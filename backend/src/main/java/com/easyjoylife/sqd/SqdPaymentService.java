package com.easyjoylife.sqd;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

/**
 * 商起点 - 支付（收银台）模块
 */
@Service
@RequiredArgsConstructor
public class SqdPaymentService {

    private final SqdClient client;

    /**
     * 创建收银台会话
     *
     * @param merchantId   商户ID
     * @param outTradeNo   我方订单号
     * @param subject      商品标题
     * @param body         商品描述
     * @param totalAmount  金额（分）
     * @param returnUrl    支付完成跳转地址
     */
    public SqdResponse createCashier(Long merchantId, String outTradeNo, String subject,
                                     String body, int totalAmount, String returnUrl) {
        Map<String, Object> req = new HashMap<>();
        req.put("merchantId", merchantId);
        req.put("outTradeNo", outTradeNo);
        req.put("subject", subject);
        req.put("body", body);
        req.put("totalAmount", totalAmount);
        req.put("expireMinutes", 30);
        req.put("returnUrl", returnUrl);
        return client.post("/v1/payment/cashier/create", req);
    }

    /** 查询支付结果 */
    public SqdResponse queryPayment(String tradeNo) {
        Map<String, Object> params = new HashMap<>();
        params.put("tradeNo", tradeNo);
        return client.get("/v1/payment/query", params);
    }
}
