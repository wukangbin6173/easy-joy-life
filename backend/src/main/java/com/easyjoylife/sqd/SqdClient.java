package com.easyjoylife.sqd;

import com.easyjoylife.config.SqdConfig;
import com.easyjoylife.service.OpenApiCallLogService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import javax.annotation.PostConstruct;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Collections;
import java.util.Map;
import java.util.UUID;

/**
 * 商起点开放平台 HTTP 客户端
 * 
 * 负责：签名生成、请求发送、响应解析
 * 使用独立的 RestTemplate 避免全局 Jackson 转换器干扰
 */
@Slf4j
@Component
public class SqdClient {

    private final SqdConfig sqdConfig;
    private final ObjectMapper objectMapper;
    private final OpenApiCallLogService openApiCallLogService;
    private RestTemplate sqdRestTemplate;

    public SqdClient(SqdConfig sqdConfig, ObjectMapper objectMapper, OpenApiCallLogService openApiCallLogService) {
        this.sqdConfig = sqdConfig;
        this.objectMapper = objectMapper;
        this.openApiCallLogService = openApiCallLogService;
    }

    @PostConstruct
    public void init() {
        SimpleClientHttpRequestFactory requestFactory = new SimpleClientHttpRequestFactory();
        requestFactory.setConnectTimeout(sqdConfig.getConnectTimeout());
        requestFactory.setReadTimeout(sqdConfig.getReadTimeout());

        // 创建独立的 RestTemplate，只用 StringHttpMessageConverter，避免全局 Jackson 转换器干扰。
        this.sqdRestTemplate = new RestTemplate(requestFactory);
        StringHttpMessageConverter stringConverter = new StringHttpMessageConverter(StandardCharsets.UTF_8);
        stringConverter.setSupportedMediaTypes(Collections.singletonList(MediaType.ALL));
        this.sqdRestTemplate.setMessageConverters(Collections.singletonList(stringConverter));
        log.info("SqdClient 初始化完成: baseUrl={}, connectTimeout={}ms, readTimeout={}ms",
                sqdConfig.getBaseUrl(), sqdConfig.getConnectTimeout(), sqdConfig.getReadTimeout());
    }

    /**
     * GET 请求
     */
    public SqdResponse get(String path, Map<String, Object> params) {
        String url = buildUrl(path, params);
        HttpHeaders headers = buildHeaders("");
        HttpEntity<String> entity = new HttpEntity<>(headers);
        long start = System.currentTimeMillis();
        String traceId = newTraceId();
        String requestPayload = toJson(params);

        try {
            log.info("SQD GET 请求 url={}", url);
            ResponseEntity<String> resp = sqdRestTemplate.exchange(url, HttpMethod.GET, entity, String.class);
            return parseAndLogOutcome("GET", path, requestPayload, url, resp.getBody(), null, start, traceId);
        } catch (HttpStatusCodeException e) {
            String errBody = e.getResponseBodyAsString();
            log.error("SQD GET HTTP 错误 url={} status={} rawBody={}", url, e.getStatusCode(), errBody);
            return parseAndLogOutcome("GET", path, requestPayload, url, errBody, e.getRawStatusCode(), start, traceId);
        } catch (RestClientException e) {
            log.error("SQD GET 网络异常 url={}", url, e);
            String message = "请求异常: " + e.getMessage();
            recordFailure("GET", path, requestPayload, message, start, traceId);
            return SqdResponse.error(message);
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
        long start = System.currentTimeMillis();
        String traceId = newTraceId();

        try {
            log.info("SQD POST 请求 url={}", url);
            log.debug("SQD POST 请求体 url={} requestBody={}", url, bodyJson);
            ResponseEntity<String> resp = sqdRestTemplate.exchange(url, HttpMethod.POST, entity, String.class);
            return parseAndLogOutcome("POST", path, bodyJson, url, resp.getBody(), null, start, traceId);
        } catch (HttpStatusCodeException e) {
            String errBody = e.getResponseBodyAsString();
            log.error("SQD POST HTTP 错误 url={} status={} rawBody={}", url, e.getStatusCode(), errBody);
            return parseAndLogOutcome("POST", path, bodyJson, url, errBody, e.getRawStatusCode(), start, traceId);
        } catch (RestClientException e) {
            log.error("SQD POST 网络异常 url={}", url, e);
            String message = "请求异常: " + e.getMessage();
            recordFailure("POST", path, bodyJson, message, start, traceId);
            return SqdResponse.error(message);
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
        long start = System.currentTimeMillis();
        String traceId = newTraceId();

        try {
            log.info("SQD PUT 请求 url={}", url);
            log.debug("SQD PUT 请求体 url={} requestBody={}", url, bodyJson);
            ResponseEntity<String> resp = sqdRestTemplate.exchange(url, HttpMethod.PUT, entity, String.class);
            return parseAndLogOutcome("PUT", path, bodyJson, url, resp.getBody(), null, start, traceId);
        } catch (HttpStatusCodeException e) {
            String errBody = e.getResponseBodyAsString();
            log.error("SQD PUT HTTP 错误 url={} status={} rawBody={}", url, e.getStatusCode(), errBody);
            return parseAndLogOutcome("PUT", path, bodyJson, url, errBody, e.getRawStatusCode(), start, traceId);
        } catch (RestClientException e) {
            log.error("SQD PUT 网络异常 url={}", url, e);
            String message = "请求异常: " + e.getMessage();
            recordFailure("PUT", path, bodyJson, message, start, traceId);
            return SqdResponse.error(message);
        }
    }

    /**
     * DELETE 请求
     */
    public SqdResponse delete(String path, Map<String, Object> params) {
        String url = buildUrl(path, params);
        HttpHeaders headers = buildHeaders("");
        HttpEntity<String> entity = new HttpEntity<>(headers);
        long start = System.currentTimeMillis();
        String traceId = newTraceId();
        String requestPayload = toJson(params);

        try {
            log.info("SQD DELETE 请求 url={}", url);
            ResponseEntity<String> resp = sqdRestTemplate.exchange(url, HttpMethod.DELETE, entity, String.class);
            return parseAndLogOutcome("DELETE", path, requestPayload, url, resp.getBody(), null, start, traceId);
        } catch (HttpStatusCodeException e) {
            String errBody = e.getResponseBodyAsString();
            log.error("SQD DELETE HTTP 错误 url={} status={} rawBody={}", url, e.getStatusCode(), errBody);
            return parseAndLogOutcome("DELETE", path, requestPayload, url, errBody, e.getRawStatusCode(), start, traceId);
        } catch (RestClientException e) {
            log.error("SQD DELETE 网络异常 url={}", url, e);
            String message = "请求异常: " + e.getMessage();
            recordFailure("DELETE", path, requestPayload, message, start, traceId);
            return SqdResponse.error(message);
        }
    }

    // ========== 内部方法 ==========

    /**
     * PUT request for merchant-side app-api endpoints that require a Bearer token.
     */
    public SqdResponse merchantPut(String path, Object body) {
        if (!sqdConfig.hasMerchantBearerToken()) {
            return SqdResponse.error("商起点商户端Token未配置");
        }

        String url = buildMerchantUrl(path, null);
        if (url == null) {
            return SqdResponse.error("商起点商户端地址未配置");
        }

        String bodyJson = toJson(body);
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(sqdConfig.getMerchantBearerToken().trim());
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<String> entity = new HttpEntity<>(bodyJson, headers);
        long start = System.currentTimeMillis();
        String traceId = newTraceId();

        try {
            log.info("SQD merchant PUT 请求 url={}", url);
            log.debug("SQD merchant PUT 请求体 url={} requestBody={}", url, bodyJson);
            ResponseEntity<String> resp = sqdRestTemplate.exchange(url, HttpMethod.PUT, entity, String.class);
            return parseAndLogOutcome("PUT", path, bodyJson, url, resp.getBody(), null, start, traceId);
        } catch (HttpStatusCodeException e) {
            String errBody = e.getResponseBodyAsString();
            log.error("SQD merchant PUT HTTP 错误 url={} status={} rawBody={}", url, e.getStatusCode(), errBody);
            return parseAndLogOutcome("PUT", path, bodyJson, url, errBody, e.getRawStatusCode(), start, traceId);
        } catch (RestClientException e) {
            log.error("SQD merchant PUT 网络异常 url={}", url, e);
            String message = "请求异常: " + e.getMessage();
            recordFailure("PUT", path, bodyJson, message, start, traceId);
            return SqdResponse.error(message);
        }
    }

    /**
     * GET request for merchant-side app-api endpoints that require a Bearer token.
     */
    public SqdResponse merchantGet(String path, Map<String, Object> params) {
        if (!sqdConfig.hasMerchantBearerToken()) {
            return SqdResponse.error("商起点商户端Token未配置");
        }

        String url = buildMerchantUrl(path, params);
        if (url == null) {
            return SqdResponse.error("商起点商户端地址未配置");
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(sqdConfig.getMerchantBearerToken().trim());
        HttpEntity<String> entity = new HttpEntity<>(headers);
        long start = System.currentTimeMillis();
        String traceId = newTraceId();
        String requestPayload = toJson(params);

        try {
            log.info("SQD merchant GET 请求 url={}", url);
            ResponseEntity<String> resp = sqdRestTemplate.exchange(url, HttpMethod.GET, entity, String.class);
            return parseAndLogOutcome("GET", path, requestPayload, url, resp.getBody(), null, start, traceId);
        } catch (HttpStatusCodeException e) {
            String errBody = e.getResponseBodyAsString();
            log.error("SQD merchant GET HTTP 错误 url={} status={} rawBody={}", url, e.getStatusCode(), errBody);
            return parseAndLogOutcome("GET", path, requestPayload, url, errBody, e.getRawStatusCode(), start, traceId);
        } catch (RestClientException e) {
            log.error("SQD merchant GET 网络异常 url={}", url, e);
            String message = "请求异常: " + e.getMessage();
            recordFailure("GET", path, requestPayload, message, start, traceId);
            return SqdResponse.error(message);
        }
    }

    /**
     * 构建完整 URL
     */
    private String buildUrl(String path, Map<String, Object> params) {
        String baseUrl = sqdConfig.getBaseUrl();
        if (baseUrl != null && baseUrl.endsWith("/")) {
            baseUrl = baseUrl.substring(0, baseUrl.length() - 1);
        }
        String normalizedPath = path != null && path.startsWith("/") ? path : "/" + path;
        UriComponentsBuilder builder = UriComponentsBuilder
                .fromHttpUrl(baseUrl + normalizedPath);

        if (params != null) {
            params.forEach((k, v) -> {
                if (v != null) {
                    builder.queryParam(k, v);
                }
            });
        }
        return builder.toUriString();
    }

    private String buildMerchantUrl(String path, Map<String, Object> params) {
        String baseUrl = sqdConfig.resolveMerchantBaseUrl();
        if (baseUrl == null) {
            return null;
        }

        String normalizedPath = path != null && path.startsWith("/") ? path : "/" + path;
        UriComponentsBuilder builder = UriComponentsBuilder
                .fromHttpUrl(baseUrl + normalizedPath);

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
     * 解析响应并打日志：成功 INFO，业务失败 WARN（含完整 rawBody），解析失败 ERROR。
     */
    private SqdResponse parseAndLogOutcome(String method, String path, String requestPayload, String url,
                                           String rawBody, Integer httpStatusCode, long start, String traceId) {
        SqdResponse response;
        if (rawBody == null) {
            log.warn("SQD 响应体为空 method={} url={}", method, url);
            if (httpStatusCode != null) {
                response = SqdResponse.error("商起点服务暂不可用: HTTP " + httpStatusCode);
            } else {
                response = SqdResponse.error("商起点响应体为空");
            }
            recordCall(method, path, requestPayload, response, start, traceId);
            return response;
        }
        try {
            response = objectMapper.readValue(rawBody, SqdResponse.class);
            if (response.isSuccess()) {
                log.debug("SQD 业务成功 method={} url={}", method, url);
            } else {
                log.warn("SQD 业务失败 method={} url={} code={} msg={} rawBody={}",
                        method, url, response.getCode(), response.getMsg(), rawBody);
            }
        } catch (Exception e) {
            log.error("SQD 响应非预期 JSON method={} url={} rawBody={}", method, url, rawBody, e);
            if (httpStatusCode != null) {
                response = SqdResponse.error("商起点服务暂不可用: HTTP " + httpStatusCode);
            } else {
                response = SqdResponse.error("商起点响应格式异常");
            }
        }
        recordCall(method, path, requestPayload, response, start, traceId);
        return response;
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

    private void recordCall(String httpMethod, String path, String requestPayload,
                            SqdResponse response, long start, String traceId) {
        openApiCallLogService.recordSqdCall(
                httpMethod, path, requestPayload, response, System.currentTimeMillis() - start, traceId);
    }

    private void recordFailure(String httpMethod, String path, String requestPayload,
                               String errorMessage, long start, String traceId) {
        openApiCallLogService.recordSqdFailure(
                httpMethod, path, requestPayload, errorMessage, System.currentTimeMillis() - start, traceId);
    }

    private String newTraceId() {
        return UUID.randomUUID().toString().replace("-", "");
    }
}
