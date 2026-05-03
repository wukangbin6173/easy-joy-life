package com.easyjoylife.controller;

import com.easyjoylife.service.PointsService;
import com.easyjoylife.service.OrderCancelLimitService;
import com.easyjoylife.service.BookingGuardService;
import com.easyjoylife.sqd.SqdBillingService;
import com.easyjoylife.sqd.SqdCustomerService;
import com.easyjoylife.sqd.SqdMemberService;
import com.easyjoylife.sqd.SqdResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * 计费预定控制器
 * 适用于棋牌室等计时计费场景
 *
 * 完整流程：
 * 1. GET  /api/billing/rooms?merchantId=         查房间列表（含状态和单价）
 * 2. GET  /api/billing/timeline/{resourceId}?date= 查时间轴（可选时段）
 * 3. POST /api/billing/order/prepaid              下单（预付模式），返回 cashierUrl
 * 4. 前端跳转 cashierUrl，收银台支持余额/混合/微信支付宝
 * 5. GET  /api/billing/order/{orderId}            查询订单状态
 * 6. POST /api/billing/order/{orderId}/end        退房结算
 */
@Slf4j
@RestController
@RequestMapping("/api/billing")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class BillingController {

    private final SqdBillingService sqdBillingService;
    private final SqdCustomerService sqdCustomerService;
    private final SqdMemberService sqdMemberService;
    private final PointsService pointsService;
    private final OrderCancelLimitService orderCancelLimitService;
    private final BookingGuardService bookingGuardService;

    /**
     * 查询房间列表 - 直接使用 /api/rooms 接口
     * 此接口重定向说明
     */
    @GetMapping("/rooms")
    public ResponseEntity<Map<String, Object>> getRooms(@RequestParam Long merchantId) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("message", "请使用 GET /api/rooms?merchantId=" + merchantId + " 接口获取房间列表");
        return ResponseEntity.ok(response);
    }

    /**
     * 查询房间时间轴（当天可预约时段）
     * GET /api/billing/timeline/{resourceId}?date=2026-04-22
     */
    @GetMapping("/timeline/{resourceId}")
    public ResponseEntity<Map<String, Object>> getTimeline(
            @PathVariable Long resourceId,
            @RequestParam String date) {
        Map<String, Object> response = new HashMap<>();
        try {
            SqdResponse sqd = sqdBillingService.getTimeline(resourceId, date);
            if (sqd.isSuccess()) {
                response.put("success", true);
                response.put("data", sqd.getData());
            } else {
                response.put("success", false);
                response.put("message", sqd.getMsg());
            }
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("查询时间轴失败: resourceId={}", resourceId, e);
            response.put("success", false);
            response.put("message", "查询失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    /**
     * 查询资源价格配置
     * GET /api/billing/price?resourceId=&merchantId=
     */
    @GetMapping("/price")
    public ResponseEntity<Map<String, Object>> getPrice(
            @RequestParam Long resourceId,
            @RequestParam Long merchantId) {
        Map<String, Object> response = new HashMap<>();
        try {
            SqdResponse sqd = sqdBillingService.getPrice(resourceId, merchantId);
            if (sqd.isSuccess()) {
                response.put("success", true);
                response.put("data", sqd.getData());
            } else {
                response.put("success", false);
                response.put("message", sqd.getMsg());
            }
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("查询价格失败", e);
            response.put("success", false);
            response.put("message", "查询失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    /**
     * 查询套餐列表
     * GET /api/billing/packages?merchantId=
     */
    @GetMapping("/packages")
    public ResponseEntity<Map<String, Object>> getPackages(@RequestParam Long merchantId) {
        Map<String, Object> response = new HashMap<>();
        try {
            SqdResponse sqd = sqdBillingService.listPackages(merchantId);
            if (sqd.isSuccess()) {
                response.put("success", true);
                response.put("data", sqd.getData());
            } else {
                response.put("success", false);
                response.put("message", sqd.getMsg());
            }
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("查询套餐失败", e);
            response.put("success", false);
            response.put("message", "查询失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    /**
     * 创建预付模式订单（按时计费）
     * POST /api/billing/order/prepaid
     * body: { merchantId, resourceId, externalUserId, startTime, durationMinutes }
     * 返回 cashierUrl，前端直接跳转，收银台自动显示余额支付
     */
    @PostMapping("/order/prepaid")
    public ResponseEntity<Map<String, Object>> createPrepaidOrder(@RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();
        try {
            Long merchantId = Long.valueOf(request.get("merchantId").toString());
            Long resourceId = Long.valueOf(request.get("resourceId").toString());
            String externalUserId = request.get("externalUserId").toString();
            String startTime = request.get("startTime").toString();
            Integer durationMinutes = Integer.valueOf(request.get("durationMinutes").toString());
            Long storeId = parseOptionalLong(request.get("storeId"));

            SqdResponse bookingGuard = bookingGuardService.validateResourceAndSlot(
                    merchantId, storeId, resourceId, startTime, durationMinutes);
            if (!bookingGuard.isSuccess()) {
                response.put("success", false);
                response.put("message", bookingGuard.getMsg());
                return ResponseEntity.ok(response);
            }

            SqdResponse userReady = ensureSqdUserReady(merchantId, externalUserId, storeId, request);
            if (!userReady.isSuccess()) {
                response.put("success", false);
                response.put("message", userReady.getMsg());
                return ResponseEntity.ok(response);
            }

            SqdResponse sqd = sqdBillingService.createPrepaidOrder(
                    merchantId, resourceId, externalUserId, startTime, durationMinutes);

            if (sqd.isSuccess()) {
                Map<String, Object> data = sqd.getDataAsMap();
                String cashierUrl = data != null ? (String) data.get("cashierUrl") : null;
                response.put("success", true);
                response.put("data", data);
                response.put("cashierUrl", cashierUrl != null ? cashierUrl : "");
                log.info("预付订单创建成功: merchantId={}, resourceId={}, externalUserId={}",
                        merchantId, resourceId, externalUserId);
            } else {
                response.put("success", false);
                response.put("message", sqd.getMsg());
            }
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("创建预付订单失败", e);
            response.put("success", false);
            response.put("message", "下单失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    /**
     * 创建套餐模式订单
     * POST /api/billing/order/package
     * body: { merchantId, resourceId, externalUserId, startTime, packageId }
     */
    @PostMapping("/order/package")
    public ResponseEntity<Map<String, Object>> createPackageOrder(@RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();
        try {
            Long merchantId = Long.valueOf(request.get("merchantId").toString());
            Long resourceId = Long.valueOf(request.get("resourceId").toString());
            String externalUserId = request.get("externalUserId").toString();
            String startTime = request.get("startTime").toString();
            Long packageId = Long.valueOf(request.get("packageId").toString());
            Long storeId = parseOptionalLong(request.get("storeId"));

            SqdResponse bookingGuard = bookingGuardService.validateResourceBookable(merchantId, resourceId);
            if (!bookingGuard.isSuccess()) {
                response.put("success", false);
                response.put("message", bookingGuard.getMsg());
                return ResponseEntity.ok(response);
            }

            SqdResponse userReady = ensureSqdUserReady(merchantId, externalUserId, storeId, request);
            if (!userReady.isSuccess()) {
                response.put("success", false);
                response.put("message", userReady.getMsg());
                return ResponseEntity.ok(response);
            }

            SqdResponse sqd = sqdBillingService.createPackageOrder(
                    merchantId, resourceId, externalUserId, startTime, packageId);

            if (sqd.isSuccess()) {
                Map<String, Object> data = sqd.getDataAsMap();
                String cashierUrl = data != null ? (String) data.get("cashierUrl") : null;
                response.put("success", true);
                response.put("data", data);
                response.put("cashierUrl", cashierUrl != null ? cashierUrl : "");
            } else {
                response.put("success", false);
                response.put("message", sqd.getMsg());
            }
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("创建套餐订单失败", e);
            response.put("success", false);
            response.put("message", "下单失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    /**
     * 支付成功后赠积分（前端支付完成后调用）
     * POST /api/billing/order/{orderId}/points
     * body: {
     *   userId,
     *   totalAmount,      // 总金额（分）
     *   balanceDeducted   // 余额抵扣金额（分），余额支付部分不赠积分
     * }
     * 积分 = (totalAmount - balanceDeducted) * 2%
     */
    @PostMapping("/order/{orderId}/points")
    public ResponseEntity<Map<String, Object>> earnPoints(
            @PathVariable Long orderId,
            @RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();
        try {
            Long userId = Long.valueOf(request.get("userId").toString());
            long totalAmount = Long.parseLong(request.get("totalAmount").toString());
            long balanceDeducted = request.containsKey("balanceDeducted")
                    ? Long.parseLong(request.get("balanceDeducted").toString()) : 0;

            // 只对外部支付金额（非余额部分）赠积分
            long externalPayAmount = totalAmount - balanceDeducted;
            if (externalPayAmount <= 0) {
                response.put("success", true);
                response.put("earnedPoints", 0);
                response.put("message", "余额全额支付，不赠积分");
                return ResponseEntity.ok(response);
            }

            // 分转元
            java.math.BigDecimal amountYuan = java.math.BigDecimal.valueOf(externalPayAmount)
                    .divide(java.math.BigDecimal.valueOf(100));
            String orderNo = "BILLING_" + orderId;

            long points = pointsService.earnPoints(userId, amountYuan, orderNo);
            response.put("success", true);
            response.put("earnedPoints", points);
            response.put("message", points > 0 ? "获得 " + points + " 积分" : "金额不足，未获得积分");
            log.info("计费订单积分赠送: orderId={}, userId={}, externalPay={}分, points={}", orderId, userId, externalPayAmount, points);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("积分赠送失败: orderId={}", orderId, e);
            response.put("success", false);
            response.put("message", "积分赠送失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    /**
     * 查询用户订单列表
     * GET /api/billing/order/list?externalUserId=&merchantId=&status=&pageNo=&pageSize=
     */
    @GetMapping("/order/list")
    public ResponseEntity<Map<String, Object>> listOrders(
            @RequestParam String externalUserId,
            @RequestParam(required = false) Long merchantId,
            @RequestParam(required = false) Integer status,
            @RequestParam(defaultValue = "1") Integer pageNo,
            @RequestParam(defaultValue = "20") Integer pageSize) {
        Map<String, Object> response = new HashMap<>();
        try {
            SqdResponse sqd;
            if (externalUserId != null && !externalUserId.trim().isEmpty()) {
                sqd = sqdBillingService.myOrders(externalUserId.trim(), status, pageNo, pageSize);
            } else {
                Map<String, Object> body = new HashMap<>();
                body.put("merchantId", merchantId);
                body.put("status", status);
                body.put("pageNo", pageNo);
                body.put("pageSize", pageSize);
                sqd = sqdBillingService.pageOrders(body);
            }
            if (sqd.isSuccess()) {
                response.put("success", true);
                response.put("data", sqd.getData());
            } else {
                response.put("success", false);
                response.put("message", sqd.getMsg());
            }
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("查询订单列表失败", e);
            response.put("success", false);
            response.put("message", "查询失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    /**
     * 查询订单详情
     * GET /api/billing/order/{orderId}
     */
    @GetMapping("/order/{orderId}")
    public ResponseEntity<Map<String, Object>> getOrder(@PathVariable Long orderId) {
        Map<String, Object> response = new HashMap<>();
        try {
            SqdResponse sqd = sqdBillingService.getOrder(orderId);
            if (sqd.isSuccess()) {
                response.put("success", true);
                response.put("data", sqd.getData());
            } else {
                response.put("success", false);
                response.put("message", sqd.getMsg());
            }
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("查询订单失败: orderId={}", orderId, e);
            response.put("success", false);
            response.put("message", "查询失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    /**
     * 退房结算
     * POST /api/billing/order/{orderId}/end
     */
    @PostMapping("/order/{orderId}/end")
    public ResponseEntity<Map<String, Object>> endUsage(@PathVariable Long orderId) {
        Map<String, Object> response = new HashMap<>();
        try {
            SqdResponse sqd = sqdBillingService.endUsage(orderId);
            if (sqd.isSuccess()) {
                response.put("success", true);
                response.put("data", sqd.getData());
                response.put("message", "退房成功，系统正在结算");
            } else {
                response.put("success", false);
                response.put("message", sqd.getMsg());
            }
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("退房失败: orderId={}", orderId, e);
            response.put("success", false);
            response.put("message", "退房失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    /**
     * 续费
     * POST /api/billing/order/{orderId}/renew?additionalMinutes=60
     */
    @PostMapping("/order/{orderId}/renew")
    public ResponseEntity<Map<String, Object>> renew(
            @PathVariable Long orderId,
            @RequestParam Integer additionalMinutes) {
        Map<String, Object> response = new HashMap<>();
        try {
            SqdResponse sqd = sqdBillingService.renew(orderId, additionalMinutes);
            if (sqd.isSuccess()) {
                Map<String, Object> data = sqd.getDataAsMap();
                response.put("success", true);
                response.put("data", data);
                response.put("cashierUrl", data != null ? data.get("cashierUrl") : null);
            } else {
                response.put("success", false);
                response.put("message", sqd.getMsg());
            }
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("续费失败: orderId={}", orderId, e);
            response.put("success", false);
            response.put("message", "续费失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    /**
     * 取消订单
     * POST /api/billing/order/{orderId}/cancel
     */
    @PostMapping("/order/{orderId}/cancel")
    public ResponseEntity<Map<String, Object>> cancelOrder(
            @PathVariable Long orderId,
            @RequestParam(required = false, defaultValue = "用户取消") String reason,
            @RequestParam(required = false) String externalUserId) {
        Map<String, Object> response = new HashMap<>();
        try {
            boolean autoCancel = orderCancelLimitService.isAutoCancel(reason);
            String resolvedExternalUserId = externalUserId;
            Long merchantId = null;

            if (!autoCancel) {
                SqdResponse order = sqdBillingService.getOrder(orderId);
                Map<String, Object> orderData = order.isSuccess() ? order.getDataAsMap() : null;
                resolvedExternalUserId = firstText(
                        findDeepValue(orderData, "externalUserId"),
                        externalUserId,
                        findDeepValue(orderData, "userId"));
                merchantId = parseOptionalLong(findDeepValue(orderData, "merchantId"));

                if (resolvedExternalUserId == null || resolvedExternalUserId.trim().isEmpty()) {
                    response.put("success", false);
                    response.put("message", "无法确认用户身份，请重新进入订单页后再试");
                    return ResponseEntity.ok(response);
                }

                OrderCancelLimitService.LimitStatus activeLimit =
                        orderCancelLimitService.getActiveLimit(resolvedExternalUserId);
                if (activeLimit.isLimited()) {
                    return ResponseEntity.ok(buildCancelLimitedResponse(activeLimit));
                }
            }

            SqdResponse sqd = sqdBillingService.cancelOrder(orderId, reason);
            if (sqd.isSuccess()) {
                response.put("success", true);
                response.put("message", "订单已取消");
                if (!autoCancel) {
                    OrderCancelLimitService.LimitStatus afterCancel =
                            orderCancelLimitService.recordUserCancel(resolvedExternalUserId, orderId, merchantId, reason);
                    if (afterCancel.isLimited()) {
                        response.put("cancelLimit", buildCancelLimitData(afterCancel));
                    }
                }
            } else {
                response.put("success", false);
                response.put("message", sqd.getMsg());
            }
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("取消订单失败: orderId={}", orderId, e);
            response.put("success", false);
            response.put("message", "取消失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    private Map<String, Object> buildCancelLimitedResponse(OrderCancelLimitService.LimitStatus limit) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("code", "CANCEL_LIMITED");
        response.put("message", limit.getMessage());
        response.put("retryAfterSeconds", limit.getRetryAfterSeconds());
        if (limit.getLockUntil() != null) {
            response.put("limitedUntil", limit.getLockUntil().toString());
        }
        return response;
    }

    private Map<String, Object> buildCancelLimitData(OrderCancelLimitService.LimitStatus limit) {
        Map<String, Object> data = new HashMap<>();
        data.put("limited", limit.isLimited());
        data.put("message", limit.getMessage());
        data.put("retryAfterSeconds", limit.getRetryAfterSeconds());
        if (limit.getLockUntil() != null) {
            data.put("limitedUntil", limit.getLockUntil().toString());
        }
        return data;
    }

    @SuppressWarnings("unchecked")
    private Object findDeepValue(Object source, String key) {
        if (source instanceof Map) {
            Map<String, Object> map = (Map<String, Object>) source;
            Object direct = map.get(key);
            if (direct != null && !direct.toString().trim().isEmpty()) {
                return direct;
            }
            for (Object value : map.values()) {
                Object found = findDeepValue(value, key);
                if (found != null) {
                    return found;
                }
            }
        } else if (source instanceof Iterable) {
            for (Object value : (Iterable<?>) source) {
                Object found = findDeepValue(value, key);
                if (found != null) {
                    return found;
                }
            }
        }
        return null;
    }

    private String firstText(Object... values) {
        for (Object value : values) {
            if (value != null && !value.toString().trim().isEmpty()) {
                return value.toString().trim();
            }
        }
        return null;
    }

    private SqdResponse ensureSqdUserReady(Long merchantId, String externalUserId, Long storeId,
                                           Map<String, Object> request) {
        SqdResponse customer = ensureCustomerIntake(externalUserId, request);
        if (!customer.isSuccess()) {
            return customer;
        }

        SqdResponse member = sqdMemberService.getMember(merchantId, externalUserId);
        if (member.isSuccess()) {
            return member;
        }

        log.info("Sqd member mapping missing, joining before billing order: merchantId={}, externalUserId={}, msg={}",
                merchantId, externalUserId, member.getMsg());
        SqdResponse joined = sqdMemberService.join(merchantId, externalUserId, storeId);
        if (joined.isSuccess() || isAlreadyExists(joined.getMsg())) {
            SqdResponse rechecked = sqdMemberService.getMember(merchantId, externalUserId);
            return rechecked.isSuccess() ? rechecked : joined;
        }

        log.warn("Sqd member join failed before billing order: merchantId={}, externalUserId={}, msg={}",
                merchantId, externalUserId, joined.getMsg());
        return SqdResponse.error("用户会员信息同步失败: " + cleanMessage(joined.getMsg()));
    }

    private SqdResponse ensureCustomerIntake(String externalUserId, Map<String, Object> request) {
        String phone = readText(request, "phone", "mobile", "phoneNumber");
        if (phone == null || phone.trim().isEmpty()) {
            return SqdResponse.error("请先绑定手机号后再预约支付");
        }

        String nickname = readText(request, "nickname", "nickName", "customerNickname");
        String realName = readText(request, "realName", "customerName");
        String avatarUrl = readText(request, "avatarUrl", "avatar");
        if (nickname == null || nickname.trim().isEmpty()) {
            nickname = "用户" + externalUserId;
        }
        if (realName == null || realName.trim().isEmpty()) {
            realName = nickname;
        }

        SqdResponse intake = sqdCustomerService.intake(externalUserId, realName, phone, nickname, avatarUrl);
        if (intake.isSuccess() || isAlreadyExists(intake.getMsg())) {
            return intake.isSuccess() ? intake : successResponse("customer exists");
        }

        log.warn("Sqd customer intake failed before billing order: externalUserId={}, msg={}",
                externalUserId, intake.getMsg());
        return SqdResponse.error("用户信息同步失败: " + cleanMessage(intake.getMsg()));
    }

    private Long parseOptionalLong(Object value) {
        if (value == null) {
            return null;
        }
        String text = value.toString().trim();
        if (text.isEmpty()) {
            return null;
        }
        return Long.valueOf(text);
    }

    private String readText(Map<String, Object> request, String... keys) {
        for (String key : keys) {
            Object value = request.get(key);
            if (value != null && !value.toString().trim().isEmpty()) {
                return value.toString().trim();
            }
        }
        return null;
    }

    private boolean isAlreadyExists(String msg) {
        if (msg == null) {
            return false;
        }
        String lower = msg.toLowerCase();
        if (msg.contains("不存在") || lower.contains("not exist") || lower.contains("not found")) {
            return false;
        }
        return msg.contains("已存在") || msg.contains("已经存在") || msg.contains("重复")
                || msg.contains("已进件") || msg.contains("已建档") || msg.contains("已注册")
                || lower.contains("already exist") || lower.contains("duplicate");
    }

    private String cleanMessage(String msg) {
        return msg == null || msg.trim().isEmpty() ? "请稍后重试" : msg.trim();
    }

    private SqdResponse successResponse(String msg) {
        SqdResponse response = new SqdResponse();
        response.setCode(0);
        response.setMsg(msg);
        return response;
    }
}
