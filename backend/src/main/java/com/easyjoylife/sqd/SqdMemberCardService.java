package com.easyjoylife.sqd;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

/**
 * 商起点 - 会员卡模块
 */
@Service
@RequiredArgsConstructor
public class SqdMemberCardService {

    private final SqdClient client;

    /** 查询会员卡模板列表 */
    public SqdResponse listTemplates(Long merchantId, Integer pageNo, Integer pageSize) {
        Map<String, Object> params = new HashMap<>();
        params.put("merchantId", merchantId);
        params.put("pageNo", pageNo);
        params.put("pageSize", pageSize);
        return client.get("/v1/card-templates", params);
    }

    /** 查询会员卡模板详情 */
    public SqdResponse getTemplate(Long templateId) {
        return client.get("/v1/card-templates/" + templateId, null);
    }

    /** 创建会员卡购买单 */
    public SqdResponse createPurchase(Long merchantId, Long templateId,
                                      String externalUserId, String phone,
                                      Integer paymentMode) {
        Map<String, Object> body = new HashMap<>();
        body.put("merchantId", merchantId);
        body.put("templateId", templateId);
        body.put("externalUserId", externalUserId);
        body.put("phone", phone);
        body.put("paymentMode", paymentMode != null ? paymentMode : 0);
        return client.post("/v1/member-card-purchases", body);
    }

    /** 创建会员卡购买收银台 */
    public SqdResponse createPurchaseCashier(Long purchaseId, String returnUrl) {
        Map<String, Object> body = new HashMap<>();
        body.put("returnUrl", returnUrl);
        body.put("expireMinutes", 30);
        return client.post("/v1/member-card-purchases/" + purchaseId + "/cashier", body);
    }

    /** 查询会员卡列表 */
    public SqdResponse listCards(Long merchantId, Integer pageNo, Integer pageSize) {
        Map<String, Object> params = new HashMap<>();
        params.put("merchantId", merchantId);
        params.put("pageNo", pageNo);
        params.put("pageSize", pageSize);
        return client.get("/v1/member-cards", params);
    }

    /** 查询会员卡详情 */
    public SqdResponse getCard(String cardNo) {
        return client.get("/v1/member-cards/" + cardNo, null);
    }

    /** 会员卡充值 */
    public SqdResponse recharge(String cardNo, int amount, Long tierId) {
        Map<String, Object> body = new HashMap<>();
        body.put("amount", amount);
        body.put("tierId", tierId);
        return client.post("/v1/member-cards/" + cardNo + "/recharge", body);
    }

    /** 查询会员卡消费记录 */
    public SqdResponse consumptionRecords(String cardNo, Integer pageNo, Integer pageSize) {
        Map<String, Object> params = new HashMap<>();
        params.put("pageNo", pageNo);
        params.put("pageSize", pageSize);
        return client.get("/v1/member-cards/" + cardNo + "/consumption-records", params);
    }

    /** 创建会员卡模板 */
    public SqdResponse createTemplate(Map<String, Object> body) {
        return client.post("/v1/card-templates", body);
    }

    /** 更新会员卡模板 */
    public SqdResponse updateTemplate(Long templateId, Long merchantId, Map<String, Object> body) {
        return client.put("/v1/card-templates/" + templateId + "?merchantId=" + merchantId, body);
    }

    /** 上架会员卡模板 */
    public SqdResponse publishTemplate(Long templateId, Long merchantId) {
        return client.put("/v1/card-templates/" + templateId + "/publish?merchantId=" + merchantId, null);
    }

    /** 下架会员卡模板 */
    public SqdResponse unpublishTemplate(Long templateId, Long merchantId) {
        return client.put("/v1/card-templates/" + templateId + "/unpublish?merchantId=" + merchantId, null);
    }

    /** 配置充值档位 */
    public SqdResponse configRechargeTiers(Long templateId, Long merchantId, Map<String, Object> body) {
        return client.put("/v1/card-templates/" + templateId + "/recharge-tiers?merchantId=" + merchantId, body);
    }

    /** 配置分销提成 */
    public SqdResponse configCommission(Long templateId, Long merchantId, Map<String, Object> body) {
        return client.put("/v1/card-templates/" + templateId + "/commission?merchantId=" + merchantId, body);
    }

    /** 配置会员发券 */
    public SqdResponse configCoupon(Long templateId, Long merchantId, Map<String, Object> body) {
        return client.put("/v1/card-templates/" + templateId + "/coupon-config?merchantId=" + merchantId, body);
    }

    /** 查询会员卡购买单 */
    public SqdResponse getPurchase(Long purchaseId) {
        return client.get("/v1/member-card-purchases/" + purchaseId, null);
    }

    /** 查询会员卡详情（按cardId） */
    public SqdResponse getCardById(Long cardId) {
        return client.get("/v1/member-cards/" + cardId, null);
    }

    /** 会员卡充值（按cardId） */
    public SqdResponse rechargeById(Long cardId, int amount, Long tierId) {
        Map<String, Object> body = new HashMap<>();
        body.put("amount", amount);
        body.put("tierId", tierId);
        return client.post("/v1/member-cards/" + cardId + "/recharge", body);
    }

    /** 生成会员卡核销二维码（按cardNo） */
    public SqdResponse writeOffQrcode(String cardNo) {
        return client.post("/v1/member-cards/" + cardNo + "/write-off-qrcode", null);
    }

    /** 生成会员卡核销二维码（按cardId） */
    public SqdResponse writeOffQrcodeById(Long cardId) {
        return client.post("/v1/member-cards/" + cardId + "/write-off-qrcode", null);
    }

    /** 查询会员卡核销记录 */
    public SqdResponse getWriteOffRecord(String requestNo) {
        return client.get("/v1/member-cards/write-off-records/" + requestNo, null);
    }

    /** 确认会员卡核销 */
    public SqdResponse confirmWriteOff(String requestNo, Map<String, Object> body) {
        return client.post("/v1/member-cards/write-off-records/" + requestNo + "/confirm", body);
    }

    /** 查询会员卡消费记录（按cardId） */
    public SqdResponse consumptionRecordsById(Long cardId, Integer bizType,
                                              Integer pageNo, Integer pageSize) {
        Map<String, Object> params = new HashMap<>();
        params.put("bizType", bizType);
        params.put("pageNo", pageNo);
        params.put("pageSize", pageSize);
        return client.get("/v1/member-cards/" + cardId + "/consumption-records", params);
    }

    /** 购买会员卡（全款直接开卡；先付/零门槛提交赊账申请） */
    public SqdResponse purchase(Map<String, Object> body) {
        return client.post("/v1/member-cards/purchase", body);
    }

    /** 查询会员卡统计 */
    public SqdResponse statistics(Long merchantId) {
        Map<String, Object> params = new HashMap<>();
        params.put("merchantId", merchantId);
        return client.get("/v1/member-cards/statistics", params);
    }

    /** 申请会员卡退款 */
    public SqdResponse refundApply(Map<String, Object> body) {
        return client.post("/v1/member-cards/refund/apply", body);
    }

    /** 会员卡核销（按cardId） */
    public SqdResponse writeOff(Long cardId, Map<String, Object> body) {
        return client.post("/v1/member-cards/" + cardId + "/write-off", body);
    }

    /** 会员卡购买优惠券 */
    public SqdResponse purchaseCoupon(Long cardId, Map<String, Object> body) {
        return client.post("/v1/member-cards/" + cardId + "/purchase-coupon", body);
    }

    /** 会员卡核销优惠券 */
    public SqdResponse writeOffCoupon(Long cardId, Map<String, Object> body) {
        return client.post("/v1/member-cards/" + cardId + "/write-off-coupon", body);
    }
}
