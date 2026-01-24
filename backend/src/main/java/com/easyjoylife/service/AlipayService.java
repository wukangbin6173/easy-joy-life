package com.easyjoylife.service;

import com.alipay.api.AlipayApiException;
import com.alipay.api.AlipayClient;
import com.alipay.api.DefaultAlipayClient;
import com.alipay.api.domain.AlipayTradeWapPayModel;
import com.alipay.api.internal.util.AlipaySignature;
import com.alipay.api.request.AlipayTradeWapPayRequest;
import com.alipay.api.response.AlipayTradeWapPayResponse;
import com.easyjoylife.config.AlipayConfig;
import com.easyjoylife.entity.PaymentOrder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.util.HashMap;
import java.util.Map;

/**
 * 支付宝支付服务类
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AlipayService {

    private final AlipayConfig alipayConfig;
    private AlipayClient alipayClient;

    @PostConstruct
    public void init() {
        // 初始化支付宝客户端
        this.alipayClient = new DefaultAlipayClient(
                alipayConfig.getGatewayUrl(),
                alipayConfig.getAppId(),
                alipayConfig.getPrivateKey(),
                alipayConfig.getFormat(),
                alipayConfig.getCharset(),
                alipayConfig.getPublicKey(),
                alipayConfig.getSignType()
        );
    }

    /**
     * 创建手机网站支付（适用于小程序H5支付）
     */
    public String createWapPay(PaymentOrder order) throws AlipayApiException {
        // 创建API对应的request
        AlipayTradeWapPayRequest alipayRequest = new AlipayTradeWapPayRequest();
        
        // 设置回调地址
        alipayRequest.setReturnUrl(alipayConfig.getReturnUrl());
        alipayRequest.setNotifyUrl(alipayConfig.getNotifyUrl());

        // 设置请求参数
        AlipayTradeWapPayModel model = new AlipayTradeWapPayModel();
        model.setOutTradeNo(order.getOrderNo());
        model.setTotalAmount(order.getAmount().toString());
        model.setSubject(order.getSubject());
        model.setBody(order.getBody());
        model.setProductCode("QUICK_WAP_WAY");
        
        alipayRequest.setBizModel(model);

        try {
            // 调用SDK生成表单
            AlipayTradeWapPayResponse response = alipayClient.pageExecute(alipayRequest);
            
            if (response.isSuccess()) {
                log.info("支付宝支付订单创建成功: {}", order.getOrderNo());
                return response.getBody();
            } else {
                log.error("支付宝支付订单创建失败: {} - {}", order.getOrderNo(), response.getMsg());
                throw new AlipayApiException("创建支付订单失败: " + response.getMsg());
            }
        } catch (AlipayApiException e) {
            log.error("调用支付宝API失败: {}", order.getOrderNo(), e);
            throw e;
        }
    }

    /**
     * 验证支付宝回调签名
     */
    public boolean verifyNotify(Map<String, String> params) {
        try {
            return AlipaySignature.rsaCheckV1(
                    params,
                    alipayConfig.getPublicKey(),
                    alipayConfig.getCharset(),
                    alipayConfig.getSignType()
            );
        } catch (AlipayApiException e) {
            log.error("验证支付宝签名失败", e);
            return false;
        }
    }

    /**
     * 处理支付宝异步通知
     */
    public Map<String, Object> handleNotify(Map<String, String> params) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            // 验证签名
            if (!verifyNotify(params)) {
                log.error("支付宝回调签名验证失败");
                result.put("success", false);
                result.put("message", "签名验证失败");
                return result;
            }

            // 获取回调参数
            String tradeStatus = params.get("trade_status");
            String outTradeNo = params.get("out_trade_no");
            String tradeNo = params.get("trade_no");
            String totalAmount = params.get("total_amount");

            log.info("收到支付宝回调: orderNo={}, tradeNo={}, status={}, amount={}", 
                    outTradeNo, tradeNo, tradeStatus, totalAmount);

            // 判断交易状态
            if ("TRADE_SUCCESS".equals(tradeStatus) || "TRADE_FINISHED".equals(tradeStatus)) {
                result.put("success", true);
                result.put("orderNo", outTradeNo);
                result.put("tradeNo", tradeNo);
                result.put("amount", totalAmount);
            } else {
                log.warn("支付宝回调状态异常: {}", tradeStatus);
                result.put("success", false);
                result.put("message", "交易状态异常: " + tradeStatus);
            }

        } catch (Exception e) {
            log.error("处理支付宝回调异常", e);
            result.put("success", false);
            result.put("message", "处理回调异常: " + e.getMessage());
        }

        return result;
    }
}