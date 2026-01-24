package com.easyjoylife.controller;

import com.easyjoylife.entity.PaymentOrder;
import com.easyjoylife.entity.UserWallet;
import com.easyjoylife.entity.WalletTransaction;
import com.easyjoylife.service.AlipayService;
import com.easyjoylife.service.PaymentService;
import com.easyjoylife.service.WechatPayService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * 支付控制器
 */
@Slf4j
@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;
    private final AlipayService alipayService;
    private final WechatPayService wechatPayService;

    /**
     * 创建充值订单
     */
    @PostMapping("/recharge/create")
    public ResponseEntity<Map<String, Object>> createRechargeOrder(@RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // 获取请求参数
            Long userId = Long.valueOf(request.get("userId").toString());
            BigDecimal amount = new BigDecimal(request.get("amount").toString());
            String paymentMethod = request.get("paymentMethod").toString();

            // 参数验证
            if (amount.compareTo(BigDecimal.ONE) < 0) {
                response.put("success", false);
                response.put("message", "充值金额不能少于1元");
                return ResponseEntity.badRequest().body(response);
            }

            if (amount.compareTo(new BigDecimal("10000")) > 0) {
                response.put("success", false);
                response.put("message", "单次充值不能超过10000元");
                return ResponseEntity.badRequest().body(response);
            }

            // 创建订单
            PaymentOrder order = paymentService.createRechargeOrder(userId, amount, paymentMethod);

            response.put("success", true);
            response.put("orderNo", order.getOrderNo());
            response.put("amount", order.getAmount());
            response.put("expireTime", order.getExpireTime());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("创建充值订单失败", e);
            response.put("success", false);
            response.put("message", "创建订单失败: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    /**
     * 支付宝支付
     */
    @PostMapping("/alipay/pay")
    public ResponseEntity<Map<String, Object>> alipayPay(@RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String orderNo = request.get("orderNo").toString();
            
            // 查找订单
            Optional<PaymentOrder> orderOpt = paymentService.findOrderByOrderNo(orderNo);
            if (!orderOpt.isPresent()) {
                response.put("success", false);
                response.put("message", "订单不存在");
                return ResponseEntity.badRequest().body(response);
            }

            PaymentOrder order = orderOpt.get();
            
            // 检查订单状态
            if (!PaymentOrder.Status.PENDING.equals(order.getStatus())) {
                response.put("success", false);
                response.put("message", "订单状态异常");
                return ResponseEntity.badRequest().body(response);
            }

            // 创建支付宝支付
            String payForm = alipayService.createWapPay(order);

            response.put("success", true);
            response.put("payForm", payForm);
            response.put("orderNo", orderNo);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("创建支付宝支付失败", e);
            response.put("success", false);
            response.put("message", "创建支付失败: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    /**
     * 微信支付
     */
    @PostMapping("/wechat/pay")
    public ResponseEntity<Map<String, Object>> wechatPay(@RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String orderNo = request.get("orderNo").toString();
            String openid = request.get("openid").toString(); // 用户的openid
            
            // 查找订单
            Optional<PaymentOrder> orderOpt = paymentService.findOrderByOrderNo(orderNo);
            if (!orderOpt.isPresent()) {
                response.put("success", false);
                response.put("message", "订单不存在");
                return ResponseEntity.badRequest().body(response);
            }

            PaymentOrder order = orderOpt.get();
            
            // 检查订单状态
            if (!PaymentOrder.Status.PENDING.equals(order.getStatus())) {
                response.put("success", false);
                response.put("message", "订单状态异常");
                return ResponseEntity.badRequest().body(response);
            }

            // 创建微信支付订单
            Map<String, Object> payParams = wechatPayService.createJsapiOrder(order, openid);

            response.put("success", true);
            response.put("payParams", payParams);
            response.put("orderNo", orderNo);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("创建微信支付失败", e);
            response.put("success", false);
            response.put("message", "创建支付失败: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    /**
     * 微信支付异步回调
     */
    @PostMapping("/wechat/notify")
    public String wechatNotify(HttpServletRequest request, @RequestBody String requestBody) {
        try {
            // 获取微信支付回调头部信息
            String signature = request.getHeader("Wechatpay-Signature");
            String timestamp = request.getHeader("Wechatpay-Timestamp");
            String nonce = request.getHeader("Wechatpay-Nonce");
            String serial = request.getHeader("Wechatpay-Serial");

            log.info("收到微信支付回调: signature={}, timestamp={}, nonce={}, serial={}", 
                    signature, timestamp, nonce, serial);

            // 验证签名
            if (!wechatPayService.verifyNotify(signature, timestamp, nonce, requestBody)) {
                log.error("微信支付回调签名验证失败");
                return "{\"code\":\"FAIL\",\"message\":\"签名验证失败\"}";
            }

            // 处理回调
            Map<String, Object> result = wechatPayService.handleNotify(requestBody);
            
            if ((Boolean) result.get("success")) {
                String orderNo = (String) result.get("orderNo");
                String tradeNo = (String) result.get("tradeNo");
                
                // 处理支付成功
                boolean processed = paymentService.handlePaymentSuccess(orderNo, tradeNo);
                
                if (processed) {
                    return "{\"code\":\"SUCCESS\",\"message\":\"成功\"}";
                } else {
                    log.error("处理支付成功回调失败: {}", orderNo);
                    return "{\"code\":\"FAIL\",\"message\":\"处理失败\"}";
                }
            } else {
                log.error("微信支付回调处理失败: {}", result.get("message"));
                return "{\"code\":\"FAIL\",\"message\":\"处理失败\"}";
            }

        } catch (Exception e) {
            log.error("处理微信支付回调异常", e);
            return "{\"code\":\"FAIL\",\"message\":\"系统异常\"}";
        }
    }
    @PostMapping("/alipay/notify")
    public String alipayNotify(HttpServletRequest request) {
        try {
            // 获取支付宝POST过来反馈信息
            Map<String, String> params = new HashMap<>();
            Map<String, String[]> requestParams = request.getParameterMap();
            
            for (String name : requestParams.keySet()) {
                String[] values = requestParams.get(name);
                String valueStr = "";
                for (int i = 0; i < values.length; i++) {
                    valueStr = (i == values.length - 1) ? valueStr + values[i] : valueStr + values[i] + ",";
                }
                params.put(name, valueStr);
            }

            // 处理回调
            Map<String, Object> result = alipayService.handleNotify(params);
            
            if ((Boolean) result.get("success")) {
                String orderNo = (String) result.get("orderNo");
                String tradeNo = (String) result.get("tradeNo");
                
                // 处理支付成功
                boolean processed = paymentService.handlePaymentSuccess(orderNo, tradeNo);
                
                if (processed) {
                    return "success";
                } else {
                    log.error("处理支付成功回调失败: {}", orderNo);
                    return "failure";
                }
            } else {
                log.error("支付宝回调处理失败: {}", result.get("message"));
                return "failure";
            }

        } catch (Exception e) {
            log.error("处理支付宝回调异常", e);
            return "failure";
        }
    }

    /**
     * 查询订单状态
     */
    @GetMapping("/order/{orderNo}")
    public ResponseEntity<Map<String, Object>> getOrderStatus(@PathVariable String orderNo) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Optional<PaymentOrder> orderOpt = paymentService.findOrderByOrderNo(orderNo);
            if (!orderOpt.isPresent()) {
                response.put("success", false);
                response.put("message", "订单不存在");
                return ResponseEntity.badRequest().body(response);
            }

            PaymentOrder order = orderOpt.get();
            response.put("success", true);
            response.put("order", order);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("查询订单状态失败: {}", orderNo, e);
            response.put("success", false);
            response.put("message", "查询失败: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    /**
     * 获取用户钱包信息
     */
    @GetMapping("/wallet/{userId}")
    public ResponseEntity<Map<String, Object>> getUserWallet(@PathVariable Long userId) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            UserWallet wallet = paymentService.getUserWallet(userId);
            response.put("success", true);
            response.put("wallet", wallet);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("获取用户钱包失败: {}", userId, e);
            response.put("success", false);
            response.put("message", "获取钱包信息失败: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    /**
     * 获取用户交易记录
     */
    @GetMapping("/transactions/{userId}")
    public ResponseEntity<Map<String, Object>> getUserTransactions(@PathVariable Long userId) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<WalletTransaction> transactions = paymentService.getUserTransactions(userId);
            response.put("success", true);
            response.put("transactions", transactions);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("获取用户交易记录失败: {}", userId, e);
            response.put("success", false);
            response.put("message", "获取交易记录失败: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    /**
     * 获取用户订单列表
     */
    @GetMapping("/orders/{userId}")
    public ResponseEntity<Map<String, Object>> getUserOrders(@PathVariable Long userId) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<PaymentOrder> orders = paymentService.getUserOrders(userId);
            response.put("success", true);
            response.put("orders", orders);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("获取用户订单失败: {}", userId, e);
            response.put("success", false);
            response.put("message", "获取订单列表失败: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
}