package com.easyjoylife.sqd;

import com.easyjoylife.config.SqdConfig;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Map;
import java.util.UUID;

/**
 * 商起点开放平台 HTTP 客户端
 * 
 * 负责：签名生成、请求发送、响应解析
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class SqdClient {

    private final SqdConfig sqdConfig;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    /**
     * GET 请求
     */
    public SqdResponse get(String path, Map<String, Object> params) {
        String url = buildUrl(path, params);
        HttpHeaders headers = buildHeaders("");
        HttpEntity<String> entity = new HttpEntity<>(headers);

        try {
            log.debug("SQD GET: {}", url);
            ResponseEntity<String> resp = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
            return parseResponse(resp.getBody());
        } catch (HttpStatusCodeException e) {
            log.error("SQD GET 请求失败: {} status={} body={}", url, e.getStatusCode(), e.getResponseBodyAsString());
            return parseResponse(e.getResponseBodyAsString());
        } catch (RestClientException e) {
            log.error("SQD GET 请求异常: {}", url, e);
            return SqdResponse.error("请求异常: " + e.getMessage());
        }
    }

    /**
     * POST 请求
     */
    public SqdResponse post(String path, Object body) {
        String url = buildUrl(path, null);
        String bodyJson = toJson(body);
        HttpHeaders headers = buildHeaders(bodyJson);
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<String> entity = new HttpEntity<>(bodyJson, headers);

        try {
            log.debug("SQD POST: {} body: {}", url, bodyJson);
            ResponseEntity<String> resp = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);
            return parseResponse(resp.getBody());
        } catch (HttpStatusCodeException e) {
            log.error("SQD POST 请求失败: {} status={} body={}", url, e.getStatusCode(), e.getResponseBodyAsString());
            return parseResponse(e.getResponseBodyAsString());
        } catch (RestClientException e) {
            log.error("SQD POST 请求异常: {}", url, e);
            return SqdResponse.error("请求异常: " + e.getMessage());
        }
    }

    /**
     * PUT 请求
     */
    public SqdResponse put(String path, Object body) {
        String url = buildUrl(path, null);
        String bodyJson = toJson(body);
        HttpHeaders headers = buildHeaders(bodyJson);
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<String> entity = new HttpEntity<>(bodyJson, headers);

        try {
            log.debug("SQD PUT: {} body: {}", url, bodyJson);
            ResponseEntity<String> resp = restTemplate.exchange(url, HttpMethod.PUT, entity, String.class);
            return parseResponse(resp.getBody());
        } catch (HttpStatusCodeException e) {
            log.error("SQD PUT 请求失败: {} status={} body={}", url, e.getStatusCode(), e.getResponseBodyAsString());
            return parseResponse(e.getResponseBodyAsString());
        } catch (RestClientException e) {
            log.error("SQD PUT 请求异常: {}", url, e);
            return SqdResponse.error("请求异常: " + e.getMessage());
        }
    }

    /**
     * DELETE 请求
     */
    public SqdResponse delete(String path, Map<String, Object> params) {
        String url = buildUrl(path, params);
        HttpHeaders headers = buildHeaders("");
        HttpEntity<String> entity = new HttpEntity<>(headers);

        try {
            log.debug("SQD DELETE: {}", url);
            ResponseEntity<String> resp = restTemplate.exchange(url, HttpMethod.DELETE, entity, String.class);
            return parseResponse(resp.getBody());
        } catch (HttpStatusCodeException e) {
            log.error("SQD DELETE 请求失败: {} status={} body={}", url, e.getStatusCode(), e.getResponseBodyAsString());
            return parseResponse(e.getResponseBodyAsString());
        } catch (RestClientException e) {
            log.error("SQD DELETE 请求异常: {}", url, e);
            return SqdResponse.error("请求异常: " + e.getMessage());
        }
    }

    // ========== 内部方法 ==========

    /**
     * 构建完整 URL
     */
    private String buildUrl(String path, Map<String, Object> params) {
        UriComponentsBuilder builder = UriComponentsBuilder
                .fromHttpUrl(sqdConfig.getBaseUrl() + path);

        if (params != null) {
            params.forEach((k, v) -> {
                if (v != null) {
                    builder.queryParam(k, v);
                }
            });
        }
        return builder.toUriString();
    }

    /**
     * 构建请求头（含签名）
     */
    private HttpHeaders buildHeaders(String body) {
        String timestamp = String.valueOf(System.currentTimeMillis() / 1000);
        String nonce = UUID.randomUUID().toString().replace("-", "").substring(0, 16);
        String sign = generateSign(timestamp, nonce, body != null ? body : "");

        HttpHeaders headers = new HttpHeaders();
        headers.set("X-App-Key", sqdConfig.getAppKey());
        headers.set("X-Timestamp", timestamp);
        headers.set("X-Nonce", nonce);
        headers.set("X-Sign", sign);
        return headers;
    }

    /**
     * HMAC-SHA256 签名
     * 签名原文 = AppKey + Timestamp + Nonce + RequestBody
     */
    private String generateSign(String timestamp, String nonce, String body) {
        try {
            String raw = sqdConfig.getAppKey() + timestamp + nonce + body;
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec keySpec = new SecretKeySpec(
                    sqdConfig.getAppSecret().getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(keySpec);
            byte[] hash = mac.doFinal(raw.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(hash);
        } catch (Exception e) {
            throw new RuntimeException("商起点签名生成失败", e);
        }
    }

    /**
     * 解析响应
     */
    private SqdResponse parseResponse(String body) {
        try {
            log.debug("SQD Response: {}", body);
            return objectMapper.readValue(body, SqdResponse.class);
        } catch (Exception e) {
            log.error("商起点响应解析失败: {}", body, e);
            return SqdResponse.error("响应解析失败: " + e.getMessage());
        }
    }

    private String toJson(Object obj) {
        if (obj == null) return "";
        if (obj instanceof String) return (String) obj;
        try {
            return objectMapper.writeValueAsString(obj);
        } catch (Exception e) {
            throw new RuntimeException("JSON序列化失败", e);
        }
    }
}
