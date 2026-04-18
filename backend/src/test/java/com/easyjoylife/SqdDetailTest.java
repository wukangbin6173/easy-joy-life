package com.easyjoylife;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.UUID;

public class SqdDetailTest {

    private static final String APP_KEY = "ak_7c2e9f1d5b3a8c6e0d2f4b7a1c9e5d3f";
    private static final String APP_SECRET = "sk_2d9c7b5a3f1e0d8c6b4a2f0e9d7c5b3a1f8e7d6c4b2a0f9e8d7c6b5a4f3e2d1";
    private static final String BASE_URL = "https://test-api.xuancore.com/open-api";

    public static void main(String[] args) {
        detailGet("/v1/merchants?pageNo=1&pageSize=10");
        detailGet("/v1/stores?pageNo=1&pageSize=10");
        detailGet("/v1/stores/nearby?longitude=120.241&latitude=29.289&radius=50000");
        detailGet("/v1/resources?pageNo=1&pageSize=10");
        detailGet("/v1/products?pageNo=1&pageSize=10");
        detailGet("/v1/orders?pageNo=1&pageSize=10");
        detailGet("/v1/booking/orders?pageNo=1&pageSize=10");
        detailGet("/v1/customers?pageNo=1&pageSize=10");
        detailGet("/v1/card-templates?pageNo=1&pageSize=10");
        detailGet("/v1/member-cards?pageNo=1&pageSize=10");
        detailGet("/v1/coupons?pageNo=1&pageSize=10");
    }

    private static void detailGet(String path) {
        try {
            String timestamp = String.valueOf(System.currentTimeMillis() / 1000);
            String nonce = UUID.randomUUID().toString().replace("-", "").substring(0, 16);
            String sign = generateSign(timestamp, nonce, "");

            String fullUrl = BASE_URL + path;
            System.out.println("==========================================");
            System.out.println("GET " + fullUrl);
            System.out.println("Headers:");
            System.out.println("  X-App-Key: " + APP_KEY);
            System.out.println("  X-Timestamp: " + timestamp);
            System.out.println("  X-Nonce: " + nonce);
            System.out.println("  X-Sign: " + sign);

            URL url = new URL(fullUrl);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setRequestProperty("X-App-Key", APP_KEY);
            conn.setRequestProperty("X-Timestamp", timestamp);
            conn.setRequestProperty("X-Nonce", nonce);
            conn.setRequestProperty("X-Sign", sign);
            conn.setConnectTimeout(15000);
            conn.setReadTimeout(15000);

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

            System.out.println("Response:");
            System.out.println(sb.toString());
            System.out.println();
        } catch (Exception e) {
            System.out.println("ERROR: " + e.getMessage());
            System.out.println();
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
