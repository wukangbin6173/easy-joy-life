package com.easyjoylife;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.*;
import java.net.HttpURLConnection;
import java.net.InetAddress;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.UUID;

public class SqdProdTest {

    private static final String APP_KEY = "ak_7c2e9f1d5b3a8c6e0d2f4b7a1c9e5d3f";
    private static final String APP_SECRET = "sk_2d9c7b5a3f1e0d8c6b4a2f0e9d7c5b3a1f8e7d6c4b2a0f9e8d7c6b5a4f3e2d1";

    public static void main(String[] args) {
        // 1. DNS 解析
        System.out.println("=== DNS 解析 ===");
        try {
            InetAddress[] addrs = InetAddress.getAllByName("api.shangqidian.com");
            for (InetAddress a : addrs) {
                System.out.println("  " + a.getHostAddress());
            }
        } catch (Exception e) {
            System.out.println("  DNS解析失败: " + e.getMessage());
        }

        // 2. 尝试生产环境
        System.out.println("\n=== 生产环境: api.shangqidian.com ===");
        testEndpoint("https://api.shangqidian.com/open-api");

        // 3. 尝试其他可能的生产域名
        System.out.println("\n=== 尝试: api.xuancore.com ===");
        testEndpoint("https://api.xuancore.com/open-api");

        System.out.println("\n=== 尝试: prod-api.xuancore.com ===");
        testEndpoint("https://prod-api.xuancore.com/open-api");

        // 4. 测试环境也再跑一次确认
        System.out.println("\n=== 测试环境: test-api.xuancore.com ===");
        testEndpoint("https://test-api.xuancore.com/open-api");
    }

    private static void testEndpoint(String baseUrl) {
        String path = "/v1/merchants?pageNo=1&pageSize=10";
        String fullUrl = baseUrl + path;
        try {
            String timestamp = String.valueOf(System.currentTimeMillis() / 1000);
            String nonce = UUID.randomUUID().toString().replace("-", "").substring(0, 16);
            String sign = generateSign(timestamp, nonce, "");

            System.out.println("GET " + fullUrl);
            URL url = new URL(fullUrl);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setRequestProperty("X-App-Key", APP_KEY);
            conn.setRequestProperty("X-Timestamp", timestamp);
            conn.setRequestProperty("X-Nonce", nonce);
            conn.setRequestProperty("X-Sign", sign);
            conn.setConnectTimeout(10000);
            conn.setReadTimeout(10000);

            int code = conn.getResponseCode();
            System.out.println("HTTP Status: " + code);

            BufferedReader reader;
            if (code >= 200 && code < 300) {
                reader = new BufferedReader(new InputStreamReader(conn.getInputStream(), StandardCharsets.UTF_8));
            } else {
                InputStream es = conn.getErrorStream();
                reader = new BufferedReader(new InputStreamReader(es != null ? es : conn.getInputStream(), StandardCharsets.UTF_8));
            }
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) sb.append(line);
            reader.close();
            System.out.println("Response: " + sb.toString());
        } catch (Exception e) {
            System.out.println("ERROR: " + e.getClass().getSimpleName() + " - " + e.getMessage());
        }
    }

    private static String generateSign(String timestamp, String nonce, String body) {
        try {
            String raw = APP_KEY + timestamp + nonce + body;
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec keySpec = new SecretKeySpec(
                    APP_SECRET.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(keySpec);
            byte[] hash = mac.doFinal(raw.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(hash);
        } catch (Exception e) {
            throw new RuntimeException("Sign failed", e);
        }
    }
}
