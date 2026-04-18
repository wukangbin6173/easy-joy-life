package com.easyjoylife.sqd;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

/**
 * 商起点 - 优惠券模块
 */
@Service
@RequiredArgsConstructor
public class SqdCouponService {

    private final SqdClient client;

    /** 查询优惠券列表 */
    public SqdResponse listCoupons(Long merchantId, Integer pageNo, Integer pageSize) {
        Map<String, Object> params = new HashMap<>();
        params.put("merchantId", merchantId);
        params.put("pageNo", pageNo);
        params.put("pageSize", pageSize);
        return client.get("/v1/coupons", params);
    }

    /** 查询可领取优惠券 */
    public SqdResponse availableCoupons(Long merchantId) {
        Map<String, Object> params = new HashMap<>();
        params.put("merchantId", merchantId);
        return client.get("/v1/coupons/available", params);
    }

    /** 查询用户优惠券 */
    public SqdResponse userCoupons(String externalUserId, Long merchantId,
                                   Integer pageNo, Integer pageSize) {
        Map<String, Object> params = new HashMap<>();
        params.put("externalUserId", externalUserId);
        params.put("merchantId", merchantId);
        params.put("pageNo", pageNo);
        params.put("pageSize", pageSize);
        return client.get("/v1/coupons/user", params);
    }

    /** 领取优惠券 */
    public SqdResponse claimCoupon(Long merchantId, Long templateId,
                                   String externalUserId, Long storeId) {
        Map<String, Object> body = new HashMap<>();
        body.put("merchantId", merchantId);
        body.put("templateId", templateId);
        body.put("externalUserId", externalUserId);
        body.put("storeId", storeId);
        return client.post("/v1/coupons/claim", body);
    }

    /** 核销优惠券 */
    public SqdResponse writeOffCoupon(Long couponId, Long merchantId,
                                      Long storeId, String remark) {
        Map<String, Object> body = new HashMap<>();
        body.put("merchantId", merchantId);
        body.put("storeId", storeId);
        body.put("remark", remark);
        return client.post("/v1/coupons/" + couponId + "/write-off", body);
    }

    /** 查询优惠券详情 */
    public SqdResponse getCoupon(Long couponId, Long merchantId) {
        Map<String, Object> params = new HashMap<>();
        params.put("merchantId", merchantId);
        return client.get("/v1/coupons/" + couponId, params);
    }

    /** 分页查询可用优惠券模板 */
    public SqdResponse listTemplates(Long merchantId, Integer pageNo, Integer pageSize) {
        Map<String, Object> params = new HashMap<>();
        params.put("merchantId", merchantId);
        params.put("pageNo", pageNo);
        params.put("pageSize", pageSize);
        return client.get("/v1/coupon-templates", params);
    }

    /** 创建优惠券购买单 */
    public SqdResponse createPurchase(Map<String, Object> body) {
        return client.post("/v1/coupon-purchases", body);
    }

    /** 创建优惠券购买收银台 */
    public SqdResponse createPurchaseCashier(Long purchaseId, Map<String, Object> body) {
        return client.post("/v1/coupon-purchases/" + purchaseId + "/cashier", body);
    }

    /** 查询优惠券购买单 */
    public SqdResponse getPurchase(Long purchaseId) {
        return client.get("/v1/coupon-purchases/" + purchaseId, null);
    }

    /** 购买优惠券 */
    public SqdResponse purchaseCoupon(Map<String, Object> body) {
        return client.post("/v1/coupons/purchase", body);
    }

    /** 验证优惠券 */
    public SqdResponse verifyCoupon(Long couponId, Long merchantId) {
        return client.post("/v1/coupons/" + couponId + "/verify?merchantId=" + merchantId, null);
    }

    /** 退款优惠券购买单 */
    public SqdResponse refundPurchase(Map<String, Object> body) {
        return client.post("/v1/coupon-purchases/refund", body);
    }

    /** 生成优惠券核销二维码 */
    public SqdResponse writeOffQrcode(Long couponId, Long merchantId) {
        return client.post("/v1/coupons/" + couponId + "/write-off-qrcode?merchantId=" + merchantId, null);
    }

    /** 查询优惠券核销记录 */
    public SqdResponse getWriteOffRecord(String requestNo) {
        return client.get("/v1/coupons/write-off-records/" + requestNo, null);
    }

    /** 创建优惠券模板 */
    public SqdResponse createTemplate(Map<String, Object> body) {
        return client.post("/v1/coupon-templates", body);
    }

    /** 更新优惠券模板 */
    public SqdResponse updateTemplate(Long templateId, Long merchantId, Map<String, Object> body) {
        return client.put("/v1/coupon-templates/" + templateId + "?merchantId=" + merchantId, body);
    }

    /** 发布优惠券模板 */
    public SqdResponse publishTemplate(Long templateId, Long merchantId) {
        return client.put("/v1/coupon-templates/" + templateId + "/publish?merchantId=" + merchantId, null);
    }

    /** 暂停优惠券模板 */
    public SqdResponse pauseTemplate(Long templateId, Long merchantId) {
        return client.put("/v1/coupon-templates/" + templateId + "/pause?merchantId=" + merchantId, null);
    }

    /** 恢复优惠券模板 */
    public SqdResponse resumeTemplate(Long templateId, Long merchantId) {
        return client.put("/v1/coupon-templates/" + templateId + "/resume?merchantId=" + merchantId, null);
    }

    /** 批量发放优惠券 */
    public SqdResponse batchIssue(Long templateId, Map<String, Object> body) {
        return client.post("/v1/coupon-templates/" + templateId + "/issue", body);
    }
}
