package com.easyjoylife.sqd;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

/**
 * 商起点 - 抵金券模块
 */
@Service
@RequiredArgsConstructor
public class SqdCashVoucherService {

    private final SqdClient client;

    /** 购买抵金券 */
    public SqdResponse acquire(Map<String, Object> body) {
        return client.post("/v1/cash-voucher/acquire", body);
    }

    /** 创建抵金券购买收银台 */
    public SqdResponse createPurchaseCashier(Long purchaseId, Map<String, Object> body) {
        return client.post("/v1/cash-voucher/purchases/" + purchaseId + "/cashier", body);
    }

    /** 查询抵金券购买单 */
    public SqdResponse getPurchase(Long purchaseId) {
        return client.get("/v1/cash-voucher/purchases/" + purchaseId, null);
    }

    /** 查询抵金券购买折扣配置 */
    public SqdResponse getPurchaseDiscountConfig() {
        return client.get("/v1/cash-voucher/purchase-discount-config", null);
    }

    /** 申请抵金券退款 */
    public SqdResponse refund(Map<String, Object> body) {
        return client.post("/v1/cash-voucher/refund", body);
    }

    /** 生成抵金券核销二维码 */
    public SqdResponse writeOffQrcode(Long voucherId) {
        return client.post("/v1/cash-voucher/" + voucherId + "/write-off-qrcode", null);
    }

    /** 赠送抵金券 */
    public SqdResponse gift(Map<String, Object> body) {
        return client.post("/v1/cash-voucher/gift", body);
    }

    /** 撤回赠送的抵金券 */
    public SqdResponse revokeGift(Map<String, Object> body) {
        return client.post("/v1/cash-voucher/revoke-gift", body);
    }

    /** 查询抵金券核销记录 */
    public SqdResponse getWriteOffRecord(String requestNo) {
        return client.get("/v1/cash-voucher/write-off-records/" + requestNo, null);
    }
}
