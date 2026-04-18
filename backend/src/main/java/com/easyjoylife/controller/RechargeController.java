package com.easyjoylife.controller;

import com.easyjoylife.entity.PaymentOrder;
import com.easyjoylife.service.AlipayService;
import com.easyjoylife.service.PaymentService;
import com.easyjoylife.service.WechatPayService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

/**
 * 充值支付控制器（微信支付/支付宝 - 自有业务）
 */
@Slf4j
@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class RechargeController {

    private final PaymentService paymentService;
    private final WechatPayService wechatPayService;
    private final AlipayService alipayService;

    /** 微信支付 */
    @PostMapping("/wechat/pay")
    public ResponseEntity<Map<String, Object>> wechatPay(@RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();
        try {
            String orderNo = request.get("orderNo").toString();
            String openid = request.get("openid").toString();

            Optional<PaymentOrder> orderOpt = paymentService.findOrderByOrderNo(orderNo);
            if (!orderOpt.isPresent()) {
                response.put("success", false);
                response.put("message", "订单不存在");
                return ResponseEntity.ok(response);
            }

            PaymentOrder order = orderOpt.get();
            if (!PaymentOrder.Status.PENDING.equals(order.getStatus())) {
                response.put("success", false);
                response.put("message", "订单状态异常");
                return ResponseEntity.ok(response);
            }

            Map<String, Object> payParams = wechatPayService.createJsapiOrder(order, openid);
            response.put("success", true);
            response.put("payParams", payParams);
            response.put("orderNo", orderNo);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("创建微信支付失败", e);
            response.put("success", false);
            response.put("message", "创建支付失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    /** 微信支付回调 */
    @PostMapping("/wechat/notify")
    public String wechatNotify(HttpServletRequest request, @RequestBody String requestBody) {
        try {
            String signature = request.getHeader("Wechatpay-Signature");
            String timestamp = request.getHeader("Wechatpay-Timestamp");
            String nonce = request.getHeader("Wechatpay-Nonce");

            if (!wechatPayService.verifyNotify(signature, timestamp, nonce, requestBody)) {
                return "{\"code\":\"FAIL\",\"message\":\"签名验证失败\"}";
            }

            Map<String, Object> result = wechatPayService.handleNotify(requestBody);
            if ((Boolean) result.get("success")) {
                boolean processed = paymentService.handlePaymentSuccess(
                        (String) result.get("orderNo"), (String) result.get("tradeNo"));
                return processed ? "{\"code\":\"SUCCESS\",\"message\":\"成功\"}"
                        : "{\"code\":\"FAIL\",\"message\":\"处理失败\"}";
            }
            return "{\"code\":\"FAIL\",\"message\":\"处理失败\"}";
        } catch (Exception e) {
            log.error("处理微信支付回调异常", e);
            return "{\"code\":\"FAIL\",\"message\":\"系统异常\"}";
        }
    }

    /** 支付宝回调 */
    @PostMapping("/alipay/notify")
    public String alipayNotify(HttpServletRequest request) {
        try {
            Map<String, String> params = new HashMap<>();
            Map<String, String[]> requestParams = request.getParameterMap();
            for (String name : requestParams.keySet()) {
                String[] values = requestParams.get(name);
                StringBuilder sb = new StringBuilder();
                for (int i = 0; i < values.length; i++) {
                    sb.append(i == values.length - 1 ? values[i] : values[i] + ",");
                }
                params.put(name, sb.toString());
            }

            Map<String, Object> result = alipayService.handleNotify(params);
            if ((Boolean) result.get("success")) {
                boolean processed = paymentService.handlePaymentSuccess(
                        (String) result.get("orderNo"), (String) result.get("tradeNo"));
                return processed ? "success" : "failure";
            }
            return "failure";
        } catch (Exception e) {
            log.error("处理支付宝回调异常", e);
            return "failure";
        }
    }

    /** 查询订单状态 */
    @GetMapping("/order/{orderNo}")
    public ResponseEntity<Map<String, Object>> getOrderStatus(@PathVariable String orderNo) {
        Map<String, Object> response = new HashMap<>();
        try {
            Optional<PaymentOrder> orderOpt = paymentService.findOrderByOrderNo(orderNo);
            if (!orderOpt.isPresent()) {
                response.put("success", false);
                response.put("message", "订单不存在");
                return ResponseEntity.ok(response);
            }
            response.put("success", true);
            response.put("order", orderOpt.get());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("查询订单状态失败: {}", orderNo, e);
            response.put("success", false);
            response.put("message", "查询失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }
}
