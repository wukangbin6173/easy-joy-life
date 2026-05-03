package com.easyjoylife.controller;

import com.easyjoylife.sqd.SqdOrderService;
import com.easyjoylife.sqd.SqdPaymentService;
import com.easyjoylife.sqd.SqdResponse;
import com.easyjoylife.service.OrderCancelLimitService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * 支付控制器 - 数据来源：商起点开放平台（收银台 + 订单）
 */
@Slf4j
@RestController
@RequestMapping("/api/sqd/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final SqdPaymentService sqdPaymentService;
    private final SqdOrderService sqdOrderService;
    private final OrderCancelLimitService orderCancelLimitService;

    /**
     * 创建收银台支付
     */
    @PostMapping("/cashier/create")
    public ResponseEntity<Map<String, Object>> createCashier(@RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();
        try {
            Long merchantId = Long.valueOf(request.get("merchantId").toString());
            String outTradeNo = request.get("outTradeNo").toString();
            String subject = request.get("subject").toString();
            String body = request.getOrDefault("body", "").toString();
            int totalAmount = Integer.parseInt(request.get("totalAmount").toString());
            String returnUrl = request.getOrDefault("returnUrl", "").toString();

            SqdResponse sqd = sqdPaymentService.createCashier(
                    merchantId, outTradeNo, subject, body, totalAmount, returnUrl);

            if (sqd.isSuccess()) {
                response.put("success", true);
                response.put("data", sqd.getData());
            } else {
                response.put("success", false);
                response.put("message", sqd.getMsg());
            }
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("创建收银台失败", e);
            response.put("success", false);
            response.put("message", "创建收银台失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    /**
     * 查询支付结果
     */
    @GetMapping("/query")
    public ResponseEntity<Map<String, Object>> queryPayment(@RequestParam String tradeNo) {
        Map<String, Object> response = new HashMap<>();
        try {
            SqdResponse sqd = sqdPaymentService.queryPayment(tradeNo);
            if (sqd.isSuccess()) {
                response.put("success", true);
                response.put("data", sqd.getData());
            } else {
                response.put("success", false);
                response.put("message", sqd.getMsg());
            }
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("查询支付结果失败: tradeNo={}", tradeNo, e);
            response.put("success", false);
            response.put("message", "查询支付结果失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    /**
     * 创建订单
     */
    @PostMapping("/orders")
    public ResponseEntity<Map<String, Object>> createOrder(@RequestBody Map<String, Object> body) {
        Map<String, Object> response = new HashMap<>();
        try {
            SqdResponse sqd = sqdOrderService.createOrder(body);
            if (sqd.isSuccess()) {
                response.put("success", true);
                response.put("data", sqd.getData());
            } else {
                response.put("success", false);
                response.put("message", sqd.getMsg());
            }
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("创建订单失败", e);
            response.put("success", false);
            response.put("message", "创建订单失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    /**
     * 查询订单列表
     */
    @GetMapping("/orders")
    public ResponseEntity<Map<String, Object>> listOrders(
            @RequestParam Long merchantId,
            @RequestParam(required = false) String externalUserId,
            @RequestParam(required = false) Integer status,
            @RequestParam(defaultValue = "1") Integer pageNo,
            @RequestParam(defaultValue = "20") Integer pageSize) {
        Map<String, Object> response = new HashMap<>();
        try {
            SqdResponse sqd = sqdOrderService.listOrders(merchantId, externalUserId, status, pageNo, pageSize);
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
            response.put("message", "查询订单列表失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    /**
     * 查询订单详情
     */
    @GetMapping("/orders/{orderId}")
    public ResponseEntity<Map<String, Object>> getOrder(
            @PathVariable Long orderId,
            @RequestParam Long merchantId) {
        Map<String, Object> response = new HashMap<>();
        try {
            SqdResponse sqd = sqdOrderService.getOrder(orderId, merchantId);
            if (sqd.isSuccess()) {
                response.put("success", true);
                response.put("data", sqd.getData());
            } else {
                response.put("success", false);
                response.put("message", sqd.getMsg());
            }
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("查询订单详情失败: orderId={}", orderId, e);
            response.put("success", false);
            response.put("message", "查询订单详情失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    /**
     * 订单支付
     */
    @PostMapping("/orders/{orderId}/pay")
    public ResponseEntity<Map<String, Object>> payOrder(
            @PathVariable Long orderId,
            @RequestParam Long merchantId,
            @RequestBody Map<String, Object> body) {
        Map<String, Object> response = new HashMap<>();
        try {
            SqdResponse sqd = sqdOrderService.payOrder(orderId, merchantId, body);
            if (sqd.isSuccess()) {
                response.put("success", true);
                response.put("data", sqd.getData());
            } else {
                response.put("success", false);
                response.put("message", sqd.getMsg());
            }
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("订单支付失败: orderId={}", orderId, e);
            response.put("success", false);
            response.put("message", "订单支付失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    /**
     * 取消订单
     */
    @PostMapping("/orders/{orderId}/cancel")
    public ResponseEntity<Map<String, Object>> cancelOrder(
            @PathVariable Long orderId,
            @RequestParam Long merchantId,
            @RequestParam(required = false) String externalUserId) {
        Map<String, Object> response = new HashMap<>();
        try {
            String resolvedExternalUserId = resolveExternalUserId(orderId, merchantId, externalUserId);
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

            SqdResponse sqd = sqdOrderService.cancelOrder(orderId, merchantId);
            if (sqd.isSuccess()) {
                response.put("success", true);
                response.put("message", "订单已取消");
                OrderCancelLimitService.LimitStatus afterCancel =
                        orderCancelLimitService.recordUserCancel(
                                resolvedExternalUserId, orderId, merchantId, "用户取消订单");
                if (afterCancel.isLimited()) {
                    response.put("cancelLimit", buildCancelLimitData(afterCancel));
                }
            } else {
                response.put("success", false);
                response.put("message", sqd.getMsg());
            }
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("取消订单失败: orderId={}", orderId, e);
            response.put("success", false);
            response.put("message", "取消订单失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    private String resolveExternalUserId(Long orderId, Long merchantId, String externalUserId) {
        if (externalUserId != null && !externalUserId.trim().isEmpty()) {
            return externalUserId.trim();
        }

        SqdResponse order = sqdOrderService.getOrder(orderId, merchantId);
        Map<String, Object> orderData = order.isSuccess() ? order.getDataAsMap() : null;
        return firstText(findDeepValue(orderData, "externalUserId"), findDeepValue(orderData, "userId"));
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

    /**
     * 申请退款
     */
    @PostMapping("/orders/{orderId}/refund")
    public ResponseEntity<Map<String, Object>> refundOrder(
            @PathVariable Long orderId,
            @RequestParam Long merchantId,
            @RequestBody Map<String, Object> body) {
        Map<String, Object> response = new HashMap<>();
        try {
            int refundAmount = Integer.parseInt(body.get("refundAmount").toString());
            String reason = body.getOrDefault("reason", "").toString();

            SqdResponse sqd = sqdOrderService.refundOrder(orderId, merchantId, refundAmount, reason);
            if (sqd.isSuccess()) {
                response.put("success", true);
                response.put("message", "退款申请已提交");
                response.put("data", sqd.getData());
            } else {
                response.put("success", false);
                response.put("message", sqd.getMsg());
            }
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("申请退款失败: orderId={}", orderId, e);
            response.put("success", false);
            response.put("message", "申请退款失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    /**
     * 订单评价
     */
    @PostMapping("/orders/{orderId}/review")
    public ResponseEntity<Map<String, Object>> reviewOrder(
            @PathVariable Long orderId,
            @RequestParam Long merchantId,
            @RequestBody Map<String, Object> body) {
        Map<String, Object> response = new HashMap<>();
        try {
            String content = body.get("content").toString();
            int rating = Integer.parseInt(body.get("rating").toString());

            SqdResponse sqd = sqdOrderService.reviewOrder(orderId, merchantId, content, rating);
            if (sqd.isSuccess()) {
                response.put("success", true);
                response.put("message", "评价成功");
            } else {
                response.put("success", false);
                response.put("message", sqd.getMsg());
            }
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("订单评价失败: orderId={}", orderId, e);
            response.put("success", false);
            response.put("message", "评价失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }
}
