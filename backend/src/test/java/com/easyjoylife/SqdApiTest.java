package com.easyjoylife;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.UUID;

/**
 * 商起点全模块 API 连通性测试
 */
public class SqdApiTest {

    private static final String APP_KEY = "ak_7c2e9f1d5b3a8c6e0d2f4b7a1c9e5d3f";
    private static final String APP_SECRET = "sk_2d9c7b5a3f1e0d8c6b4a2f0e9d7c5b3a1f8e7d6c4b2a0f9e8d7c6b5a4f3e2d1";
    private static final String BASE_URL = "https://test-api.xuancore.com/open-api";

    private static int pass = 0, fail = 0;

    public static void main(String[] args) {
        System.out.println("====== SQD API Full Module Test ======\n");

        // 1. 测试接口
        testGet("/test/ping", "测试-连通性");

        // 2. 商户数据
        testGet("/v1/merchants?pageNo=1&pageSize=5", "商户-列表");
        testGet("/v1/stores?pageNo=1&pageSize=5", "门店-列表");
        testGet("/v1/stores/nearby?longitude=120.15&latitude=30.28&radius=5000", "门店-附近");

        // 3. 商品数据
        testGet("/v1/products?pageNo=1&pageSize=5", "商品-列表");
        testGet("/v1/product-categories?merchantId=1", "商品-分类列表");
        testGet("/v1/products/search?keyword=test&pageNo=1&pageSize=5", "商品-搜索");

        // 4. 订单数据
        testGet("/v1/orders?pageNo=1&pageSize=5", "订单-列表");
        testGet("/v1/orders/statistics?merchantId=1", "订单-统计");

        // 5. 会员卡
        testGet("/v1/card-templates?pageNo=1&pageSize=5", "会员卡-模板列表");
        testGet("/v1/member-cards?pageNo=1&pageSize=5", "会员卡-列表");
        testGet("/v1/member-cards/statistics?merchantId=1", "会员卡-统计");

        // 6. 优惠券
        testGet("/v1/coupons?pageNo=1&pageSize=5", "优惠券-列表");
        testGet("/v1/coupon-templates?pageNo=1&pageSize=5", "优惠券-模板列表");
        testGet("/v1/coupons/available?merchantId=1", "优惠券-可领取");

        // 7. 可预订资源
        testGet("/v1/resources?pageNo=1&pageSize=5", "资源-列表");
        testGet("/v1/resources/statistics?merchantId=1", "资源-统计");

        // 8. 预约
        testGet("/v1/booking/available-slots?merchantId=1&date=2026-04-20", "预约-可用时段");
        testGet("/v1/booking/orders?pageNo=1&pageSize=5", "预约-列表");
        testGet("/v1/booking/statistics?merchantId=1", "预约-统计");

        // 9. 客户管理
        testGet("/v1/customers?pageNo=1&pageSize=5", "客户-列表");
        testGet("/v1/customers/statistics?merchantId=1", "客户-统计");

        // 10. 数据统计
        testGet("/v1/statistics/overview?merchantId=1", "统计-经营概览");
        testGet("/v1/statistics/sales?merchantId=1&period=today", "统计-销售报表");
        testGet("/v1/statistics/customers?merchantId=1", "统计-客户分析");
        testGet("/v1/statistics/channels?merchantId=1", "统计-渠道分析");
        testGet("/v1/statistics/bookings?merchantId=1", "统计-预约分析");

        // 11. 实名认证
        testGet("/v1/real-name-auth/status?idCardNumber=110101199001011234", "实名-认证状态");

        // 12. 支付（收银台）
        testGet("/v1/payment/query?tradeNo=test123", "支付-查询结果");

        // 13. 提现
        testGet("/withdraw/account/list?externalUserId=test_user", "提现-账户列表");
        testGet("/withdraw/get?merchantWithdrawNo=test123", "提现-查询状态");

        // 14. B2B转账
        testGet("/v1/transfer/b2b?merchantTransferNo=test123", "转账-查询状态");

        // 15. 抵金券
        testGet("/v1/cash-voucher/purchase-discount-config", "抵金券-折扣配置");

        // 16. 支付宝授权
        testGet("/alipay-auth/config", "支付宝-授权配置");
        testGet("/alipay-auth/binding?externalUserId=test_user", "支付宝-绑定状态");

        // 17. 风控模型
        testGet("/v1/risk-model-products", "风控-产品列表");

        // 18. 固定收款码
        testGet("/fixed-qrcode/list?merchantId=1", "收款码-列表");

        // 19. 消费任务
        testGet("/v1/consumption-tasks?merchantId=1", "消费任务-列表");
        testGet("/v1/consumption-tasks/my-tasks?externalUserId=test_user", "消费任务-我的任务");

        // 20. App用户入网
        testGet("/v1/onboarding/app-user/status?externalUserId=test_user", "入网-查询状态");

        // 21. 商户会员
        testGet("/v1/members?merchantId=1&externalUserId=test_user", "会员-查询信息");
        testGet("/v1/members/list?externalUserId=test_user&pageNo=1&pageSize=5", "会员-跨商户列表");

        // 22. POST 接口测试（同步用户信息）
        testPost("/v1/customers/sync",
                "{\"externalUserId\":\"test_user_001\",\"customerName\":\"Test\",\"customerPhone\":\"13800000000\",\"customerNickname\":\"Tester\",\"customerAvatar\":\"\"}",
                "客户-同步用户(POST)");

        // 23. POST 加入会员
        testPost("/v1/members/join",
                "{\"merchantId\":1,\"externalUserId\":\"test_user_001\",\"storeId\":1}",
                "会员-加入(POST)");

        System.out.println("\n====== Result ======");
        System.out.println("PASS: " + pass + "  FAIL: " + fail + "  TOTAL: " + (pass + fail));
        System.out.println("====================");
    }

    private static void testGet(String path, String desc) {
        doRequest("GET", path, null, desc);
    }

    private static void testPost(String path, String body, String desc) {
        doRequest("POST", path, body, desc);
    }

    private static void testPut(String path, String body, String desc) {
        doRequest("PUT", path, body, desc);
    }

    private static void doRequest(String method, String path, String body, String desc) {
        try {
            String timestamp = String.valueOf(System.currentTimeMillis() / 1000);
            String nonce = UUID.randomUUID().toString().replace("-", "").substring(0, 16);
            String signBody = (body != null) ? body : "";
            String sign = generateSign(timestamp, nonce, signBody);

            URL url = new URL(BASE_URL + path);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod(method);
            conn.setRequestProperty("X-App-Key", APP_KEY);
            conn.setRequestProperty("X-Timestamp", timestamp);
            conn.setRequestProperty("X-Nonce", nonce);
            conn.setRequestProperty("X-Sign", sign);
            conn.setConnectTimeout(10000);
            conn.setReadTimeout(10000);

            if (body != null && ("POST".equals(method) || "PUT".equals(method))) {
                conn.setRequestProperty("Content-Type", "application/json");
                conn.setDoOutput(true);
                try (OutputStream os = conn.getOutputStream()) {
                    os.write(body.getBytes(StandardCharsets.UTF_8));
                }
            }

            int httpCode = conn.getResponseCode();
            BufferedReader reader;
            if (httpCode >= 200 && httpCode < 300) {
                reader = new BufferedReader(new InputStreamReader(conn.getInputStream(), StandardCharsets.UTF_8));
            } else {
                reader = new BufferedReader(new InputStreamReader(
                        conn.getErrorStream() != null ? conn.getErrorStream() : conn.getInputStream(), StandardCharsets.UTF_8));
            }

            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) sb.append(line);
            reader.close();

            String resp = sb.toString();
            // Parse code from response
            boolean ok = resp.contains("\"code\":0") || resp.contains("\"code\": 0");
            boolean is403 = resp.contains("\"code\":403");
            String status;
            if (ok) {
                status = "OK";
                pass++;
            } else if (is403) {
                status = "403-NO_PERM";
                pass++; // 403 means auth works, just no permission for this module
            } else {
                status = "FAIL(HTTP=" + httpCode + ")";
                fail++;
            }

            // Truncate response for display
            String display = resp.length() > 120 ? resp.substring(0, 120) + "..." : resp;
            System.out.printf("%-6s %-20s %s %s%n", status, desc, method + " " + path.split("\\?")[0], display);

        } catch (Exception e) {
            fail++;
            System.out.printf("%-6s %-20s %s %s%n", "ERROR", desc, method + " " + path.split("\\?")[0], e.getMessage());
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
