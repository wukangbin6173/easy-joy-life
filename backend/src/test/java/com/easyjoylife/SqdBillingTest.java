package com.easyjoylife;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.UUID;

public class SqdBillingTest {
    private static final String APP_KEY = "ak_7c2e9f1d5b3a8c6e0d2f4b7a1c9e5d3f";
    private static final String APP_SECRET = "sk_2d9c7b5a3f1e0d8c6b4a2f0e9d7c5b3a1f8e7d6c4b2a0f9e8d7c6b5a4f3e2d1";
    private static final String BASE = "https://test-api.xuancore.com/open-api";

    public static void main(String[] args) throws Exception {
        System.setOut(new java.io.PrintStream(System.out, true, "UTF-8"));
        // 试不同的 externalUserId 和时间
        System.out.println("=== 试 externalUserId=67（进件返回的ID）===");
        test("POST", "/v1/billing/order/create-prepaid",
                "{\"merchantId\":23,\"resourceId\":19,\"externalUserId\":\"67\",\"startTime\":\"2026-04-23T10:00:00\",\"durationMinutes\":120}");

        System.out.println("\n=== 试 externalUserId=2，明天 ===");
        test("POST", "/v1/billing/order/create-prepaid",
                "{\"merchantId\":23,\"resourceId\":19,\"externalUserId\":\"2\",\"startTime\":\"2026-04-23T10:00:00\",\"durationMinutes\":120}");

        System.out.println("\n=== 试不同房间 resourceId=20 ===");
        test("POST", "/v1/billing/order/create-prepaid",
                "{\"merchantId\":23,\"resourceId\":20,\"externalUserId\":\"2\",\"startTime\":\"2026-04-23T10:00:00\",\"durationMinutes\":120}");

        System.out.println("\n=== 查询资源列表确认 resourceId ===");
        test("GET", "/v1/resources?merchantId=23&pageNo=1&pageSize=10", null);
    }

    static void test(String method, String path, String body) {
        try {
            String ts = String.valueOf(System.currentTimeMillis() / 1000);
            String nonce = UUID.randomUUID().toString().replace("-", "").substring(0, 16);
            String signBody = body != null ? body : "";
            String raw = APP_KEY + ts + nonce + signBody;
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(APP_SECRET.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            String sign = Base64.getEncoder().encodeToString(mac.doFinal(raw.getBytes(StandardCharsets.UTF_8)));

            URL url = new URL(BASE + path);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod(method);
            conn.setRequestProperty("X-App-Key", APP_KEY);
            conn.setRequestProperty("X-Timestamp", ts);
            conn.setRequestProperty("X-Nonce", nonce);
            conn.setRequestProperty("X-Sign", sign);
            conn.setConnectTimeout(10000);
            conn.setReadTimeout(10000);
            if (body != null) {
                conn.setRequestProperty("Content-Type", "application/json");
                conn.setDoOutput(true);
                conn.getOutputStream().write(body.getBytes(StandardCharsets.UTF_8));
            }

            int code = conn.getResponseCode();
            InputStream is = code < 300 ? conn.getInputStream() : conn.getErrorStream();
            String resp = new String(is.readAllBytes(), StandardCharsets.UTF_8);
            System.out.println(method + " " + path.split("\\?")[0] + " -> " + resp.substring(0, Math.min(400, resp.length())));
        } catch (Exception e) {
            System.out.println(method + " " + path + " -> ERROR: " + e.getMessage());
        }
    }
}
