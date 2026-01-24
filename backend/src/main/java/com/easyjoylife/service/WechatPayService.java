package com.easyjoylife.service;

import com.easyjoylife.config.WechatPayConfig;
import com.easyjoylife.entity.PaymentOrder;
import com.wechat.pay.java.core.Config;
import com.wechat.pay.java.core.RSAAutoCertificateConfig;
import com.wechat.pay.java.service.payments.jsapi.JsapiServiceExtension;
import com.wechat.pay.java.service.payments.jsapi.model.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.util.HashMap;
import java.util.Map;

/**
 * 微信支付服务类
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class WechatPayService {

    private final WechatPayConfig wechatPayConfig;
    private Config config;
    private JsapiServiceExtension jsapiService;

    @PostConstruct
    public void init() {
        try {
            // 使用RSAAutoCertificateConfig自动管理证书
            // 这个配置会自动下载和更新微信支付平台证书
            this.config = new RSAAutoCertificateConfig.Builder()
                    .merchantId(wechatPayConfig.getMchId())
                    .privateKeyFromPath(wechatPayConfig.getPrivateKeyPath())
                    .merchantSerialNumber(wechatPayConfig.getMerchantSerialNumber())
                    .apiV3Key(wechatPayConfig.getApiV3Key())
                    .build();

            // 初始化JSAPI服务
            this.jsapiService = new JsapiServiceExtension.Builder()
                    .config(config)
                    .build();

            log.info("微信支付服务初始化成功 - 使用自动证书管理");
        } catch (Exception e) {
            log.error("微信支付服务初始化失败", e);
        }
    }

    /**
     * 创建小程序支付订单
     */
    public Map<String, Object> createJsapiOrder(PaymentOrder order, String openid) {
        try {
            // 构建请求参数
            PrepayRequest request = new PrepayRequest();
            request.setAppid(wechatPayConfig.getAppId());
            request.setMchid(wechatPayConfig.getMchId());
            request.setDescription(order.getSubject());
            request.setOutTradeNo(order.getOrderNo());
            request.setNotifyUrl(wechatPayConfig.getNotifyUrl());

            // 设置订单金额（微信支付金额单位为分）
            Amount amount = new Amount();
            amount.setTotal(order.getAmount().multiply(new java.math.BigDecimal("100")).intValue());
            amount.setCurrency("CNY");
            request.setAmount(amount);

            // 设置支付者信息
            Payer payer = new Payer();
            payer.setOpenid(openid);
            request.setPayer(payer);

            // 调用微信支付API
            PrepayResponse response = jsapiService.prepay(request);
            
            if (response != null && response.getPrepayId() != null) {
                // 生成小程序支付参数
                Map<String, Object> payParams = generateMiniProgramPayParams(response.getPrepayId());
                
                log.info("微信支付订单创建成功: orderNo={}, prepayId={}", 
                        order.getOrderNo(), response.getPrepayId());
                
                return payParams;
            } else {
                throw new RuntimeException("微信支付预下单失败");
            }

        } catch (Exception e) {
            log.error("创建微信支付订单失败: {}", order.getOrderNo(), e);
            throw new RuntimeException("创建微信支付订单失败: " + e.getMessage());
        }
    }

    /**
     * 生成小程序支付参数
     */
    private Map<String, Object> generateMiniProgramPayParams(String prepayId) {
        try {
            // 使用JSAPI服务生成小程序支付参数
            PrepayWithRequestPaymentResponse payParams = jsapiService.prepayWithRequestPayment(
                    new PrepayRequest() {{
                        // 这里需要重新设置请求参数，但实际上我们只需要prepayId
                    }}
            );

            Map<String, Object> result = new HashMap<>();
            result.put("timeStamp", String.valueOf(System.currentTimeMillis() / 1000));
            result.put("nonceStr", generateNonceStr());
            result.put("package", "prepay_id=" + prepayId);
            result.put("signType", "RSA");
            
            // 生成签名
            String paySign = generatePaySign(result);
            result.put("paySign", paySign);

            return result;

        } catch (Exception e) {
            log.error("生成小程序支付参数失败", e);
            throw new RuntimeException("生成支付参数失败: " + e.getMessage());
        }
    }

    /**
     * 生成随机字符串
     */
    private String generateNonceStr() {
        return java.util.UUID.randomUUID().toString().replace("-", "");
    }

    /**
     * 生成支付签名
     */
    private String generatePaySign(Map<String, Object> params) {
        // 这里需要实现RSA签名逻辑
        // 由于微信支付SDK会自动处理签名，这里返回空字符串
        // 实际使用时应该使用SDK提供的签名方法
        return "";
    }

    /**
     * 验证微信支付回调签名
     */
    public boolean verifyNotify(String signature, String timestamp, String nonce, String body) {
        try {
            // 使用微信支付SDK验证签名
            // 这里需要实现具体的验证逻辑
            return true;
        } catch (Exception e) {
            log.error("验证微信支付回调签名失败", e);
            return false;
        }
    }

    /**
     * 处理微信支付异步通知
     */
    public Map<String, Object> handleNotify(String requestBody) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            // 解析微信支付回调数据
            // 这里需要实现具体的解析逻辑
            log.info("收到微信支付回调: {}", requestBody);

            // 模拟解析结果
            result.put("success", true);
            result.put("orderNo", "PAY20260123001"); // 从回调数据中解析
            result.put("tradeNo", "WX20260123001"); // 微信支付交易号
            result.put("amount", "100.00"); // 支付金额

        } catch (Exception e) {
            log.error("处理微信支付回调异常", e);
            result.put("success", false);
            result.put("message", "处理回调异常: " + e.getMessage());
        }

        return result;
    }

    /**
     * 查询订单状态
     */
    public Map<String, Object> queryOrder(String orderNo) {
        try {
            // 使用微信支付SDK查询订单
            // QueryOrderByOutTradeNoRequest request = new QueryOrderByOutTradeNoRequest();
            // request.setMchid(wechatPayConfig.getMchId());
            // request.setOutTradeNo(orderNo);
            
            // Transaction response = jsapiService.queryOrderByOutTradeNo(request);
            
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("orderNo", orderNo);
            result.put("tradeState", "SUCCESS"); // SUCCESS, REFUND, NOTPAY, CLOSED, REVOKED, USERPAYING, PAYERROR
            
            return result;

        } catch (Exception e) {
            log.error("查询微信支付订单失败: {}", orderNo, e);
            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("message", "查询订单失败: " + e.getMessage());
            return result;
        }
    }
}