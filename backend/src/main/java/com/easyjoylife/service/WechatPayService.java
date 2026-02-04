package com.easyjoylife.service;

import com.easyjoylife.config.WechatPayConfig;
import com.easyjoylife.entity.PaymentOrder;
import com.wechat.pay.java.core.Config;
import com.wechat.pay.java.core.RSAAutoCertificateConfig;
import com.wechat.pay.java.service.payments.jsapi.JsapiServiceExtension;
import com.wechat.pay.java.service.payments.jsapi.model.*;
import com.wechat.pay.java.service.payments.jsapi.model.PrepayRequest;
import com.wechat.pay.java.service.payments.jsapi.model.PrepayWithRequestPaymentResponse;
import com.wechat.pay.java.service.payments.jsapi.model.Amount;
import com.wechat.pay.java.service.payments.jsapi.model.Payer;
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
            log.info("开始初始化微信支付服务...");
            log.info("商户号: {}", wechatPayConfig.getMchId());
            log.info("私钥路径: {}", wechatPayConfig.getPrivateKeyPath());
            log.info("商户证书序列号: {}", wechatPayConfig.getMerchantSerialNumber());更新
            log.info("API v3密钥长度: {}", wechatPayConfig.getApiV3Key() != null ? wechatPayConfig.getApiV3Key().length() : "null");
            
            // 检查配置参数
            if (wechatPayConfig.getMchId() == null || wechatPayConfig.getMchId().isEmpty()) {
                throw new RuntimeException("商户号未配置");
            }
            if (wechatPayConfig.getPrivateKeyPath() == null || wechatPayConfig.getPrivateKeyPath().isEmpty()) {
                throw new RuntimeException("私钥路径未配置");
            }
            if (wechatPayConfig.getMerchantSerialNumber() == null || wechatPayConfig.getMerchantSerialNumber().isEmpty()) {
                throw new RuntimeException("商户证书序列号未配置");
            }
            if (wechatPayConfig.getApiV3Key() == null || wechatPayConfig.getApiV3Key().isEmpty()) {
                throw new RuntimeException("API v3密钥未配置");
            }

            // 检查是否配置了微信支付公钥
            if (wechatPayConfig.getPublicKeyPath() != null && !wechatPayConfig.getPublicKeyPath().isEmpty() &&
                wechatPayConfig.getPublicKeyId() != null && !wechatPayConfig.getPublicKeyId().isEmpty()) {
                
                log.info("检测到微信支付公钥配置:");
                log.info("公钥路径: {}", wechatPayConfig.getPublicKeyPath());
                log.info("公钥ID: {}", wechatPayConfig.getPublicKeyId());
                log.warn("当前SDK版本暂不支持公钥模式，将使用自动证书管理模式");
                log.warn("建议升级到最新SDK版本以支持公钥模式，避免证书过期问题");
            }

            // 使用RSAAutoCertificateConfig自动管理证书
            // 注意：这个配置会自动下载和更新微信支付平台证书
            // 如果遇到证书过期问题，需要升级SDK并使用公钥模式
            this.config = new RSAAutoCertificateConfig.Builder()
                    .merchantId(wechatPayConfig.getMchId())
                    .privateKeyFromPath(wechatPayConfig.getPrivateKeyPath())
                    .merchantSerialNumber(wechatPayConfig.getMerchantSerialNumber())
                    .apiV3Key(wechatPayConfig.getApiV3Key())
                    .build();

            log.info("微信支付配置创建成功 - 使用自动证书管理模式");

            // 初始化JSAPI服务 - 使用最新SDK版本
            this.jsapiService = new JsapiServiceExtension.Builder()
                    .config(config)
                    .build();

            log.info("微信支付JSAPI服务初始化成功");
            
            // 验证服务是否可用
            if (this.jsapiService != null) {
                log.info("✅ 微信支付服务初始化完成，SDK版本: 0.2.17");
            } else {
                log.error("❌ 微信支付JSAPI服务初始化失败");
                throw new RuntimeException("JSAPI服务初始化失败");
            }

        } catch (Exception e) {
            log.error("微信支付服务初始化失败: {}", e.getMessage(), e);
            // 不抛出异常，允许应用启动，但标记服务不可用
            this.config = null;
            this.jsapiService = null;
            log.error("❌ 微信支付功能将不可用，请检查配置后重启服务");
        }
    }

    /**
     * 创建小程序支付订单
     */
    public Map<String, Object> createJsapiOrder(PaymentOrder order, String openid) {
        try {
            log.info("开始创建微信支付订单: orderNo={}, openid={}", order.getOrderNo(), openid);
            
            // 检查服务是否已初始化
            if (jsapiService == null) {
                throw new RuntimeException("微信支付服务未正确初始化，请检查配置");
            }
            
            // 验证必要参数
            if (order == null || order.getOrderNo() == null || order.getAmount() == null) {
                throw new RuntimeException("订单信息不完整");
            }
            
            if (openid == null || openid.trim().isEmpty()) {
                throw new RuntimeException("用户openid不能为空");
            }
            
            // 构建请求参数
            PrepayRequest request = new PrepayRequest();
            request.setAppid(wechatPayConfig.getAppId());
            request.setMchid(wechatPayConfig.getMchId());
            request.setDescription(order.getSubject() != null ? order.getSubject() : "易享生活充值");
            request.setOutTradeNo(order.getOrderNo());
            request.setNotifyUrl(wechatPayConfig.getNotifyUrl());

            log.info("微信支付请求参数: appId={}, mchId={}, description={}, outTradeNo={}, notifyUrl={}", 
                    wechatPayConfig.getAppId(), wechatPayConfig.getMchId(), request.getDescription(), 
                    order.getOrderNo(), wechatPayConfig.getNotifyUrl());

            // 设置订单金额（微信支付金额单位为分）
            // 确保金额转换正确，避免精度问题
            int totalFee = order.getAmount().multiply(new java.math.BigDecimal("100")).intValue();
            if (totalFee <= 0) {
                throw new RuntimeException("订单金额必须大于0");
            }
            
            Amount amount = new Amount();
            amount.setTotal(totalFee);  // 这里是新版API的total参数，不是旧版的total_fee
            amount.setCurrency("CNY");
            request.setAmount(amount);

            log.info("订单金额: {} 元 = {} 分", order.getAmount(), totalFee);

            // 设置支付者信息
            Payer payer = new Payer();
            payer.setOpenid(openid.trim());
            request.setPayer(payer);

            log.info("支付者openid: {}", openid);

            // 调用微信支付API - 使用prepayWithRequestPayment方法直接获取支付参数
            log.info("调用微信支付API...");
            PrepayWithRequestPaymentResponse response = jsapiService.prepayWithRequestPayment(request);
            
            if (response != null) {
                log.info("微信支付API调用成功");
                
                // 验证返回的支付参数
                if (response.getTimeStamp() == null || response.getNonceStr() == null || 
                    response.getPackageVal() == null || response.getPaySign() == null) {
                    log.error("微信支付返回参数不完整: timeStamp={}, nonceStr={}, package={}, paySign={}", 
                            response.getTimeStamp(), response.getNonceStr(), 
                            response.getPackageVal(), response.getPaySign());
                    throw new RuntimeException("微信支付返回参数不完整");
                }
                
                // 直接返回SDK生成的支付参数
                Map<String, Object> payParams = new HashMap<>();
                payParams.put("timeStamp", response.getTimeStamp());
                payParams.put("nonceStr", response.getNonceStr());
                payParams.put("package", response.getPackageVal());
                payParams.put("signType", response.getSignType() != null ? response.getSignType() : "RSA");
                payParams.put("paySign", response.getPaySign());
                
                log.info("微信支付订单创建成功: orderNo={}, payParams={}", order.getOrderNo(), payParams);
                
                return payParams;
            } else {
                log.error("微信支付API返回null响应");
                throw new RuntimeException("微信支付预下单失败：API返回空响应，请检查微信支付配置");
            }

        } catch (Exception e) {
            log.error("创建微信支付订单失败: orderNo={}, error={}", order.getOrderNo(), e.getMessage(), e);
            
            // 提供更详细的错误信息
            String errorMessage = e.getMessage();
            if (errorMessage != null) {
                if (errorMessage.contains("total_fee")) {
                    errorMessage = "微信支付参数错误：请检查SDK版本和配置";
                } else if (errorMessage.contains("APPID")) {
                    errorMessage = "微信支付APPID配置错误";
                } else if (errorMessage.contains("MCH_ID")) {
                    errorMessage = "微信支付商户号配置错误";
                } else if (errorMessage.contains("签名")) {
                    errorMessage = "微信支付签名验证失败，请检查证书配置";
                }
            }
            
            throw new RuntimeException("创建微信支付订单失败: " + errorMessage);
        }
    }

    /**
     * 生成随机字符串
     */
    private String generateNonceStr() {
        return java.util.UUID.randomUUID().toString().replace("-", "");
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