package com.easyjoylife.sqd;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

/**
 * 商起点 - 商户会员模块
 */
@Service
@RequiredArgsConstructor
public class SqdMemberService {

    private final SqdClient client;

    /** 加入会员 */
    public SqdResponse join(Long merchantId, String externalUserId, Long storeId) {
        Map<String, Object> body = new HashMap<>();
        body.put("merchantId", merchantId);
        body.put("externalUserId", externalUserId);
        body.put("storeId", storeId);
        return client.post("/v1/members/join", body);
    }

    /** 查询会员信息 */
    public SqdResponse getMember(Long merchantId, String externalUserId) {
        Map<String, Object> params = new HashMap<>();
        params.put("merchantId", merchantId);
        params.put("externalUserId", externalUserId);
        return client.get("/v1/members", params);
    }

    /** 跨商户会员余额列表 */
    public SqdResponse listMembers(String externalUserId, String merchantName,
                                   Integer pageNo, Integer pageSize) {
        Map<String, Object> params = new HashMap<>();
        params.put("externalUserId", externalUserId);
        params.put("merchantName", merchantName);
        params.put("pageNo", pageNo);
        params.put("pageSize", pageSize);
        return client.get("/v1/members/list", params);
    }

    /** 创建充值单 */
    public SqdResponse createRecharge(Long memberId, Map<String, Object> body) {
        return client.post("/v1/members/" + memberId + "/recharge", body);
    }

    /** 查询充值单 */
    public SqdResponse getRecharge(Long rechargeId) {
        return client.get("/v1/members/recharges/" + rechargeId, null);
    }

    /** 为充值单唤起收银台 */
    public SqdResponse rechargeCashier(Long rechargeId, Map<String, Object> body) {
        return client.post("/v1/members/recharges/" + rechargeId + "/cashier", body);
    }

    /** 查询余额流水 */
    public SqdResponse listTransactions(Long memberId, Integer transactionType,
                                        Integer balanceType, Integer pageNo, Integer pageSize) {
        Map<String, Object> params = new HashMap<>();
        params.put("transactionType", transactionType);
        params.put("balanceType", balanceType);
        params.put("pageNo", pageNo);
        params.put("pageSize", pageSize);
        return client.get("/v1/members/" + memberId + "/transactions", params);
    }

    /** 生成会员余额核销二维码 */
    public SqdResponse writeOffQrcode(Long memberId, Long merchantId) {
        return client.post("/v1/members/" + memberId
                + "/write-off-qrcode?merchantId=" + merchantId, null);
    }

    /** 查询会员余额核销记录 */
    public SqdResponse getWriteOffRecord(String requestNo) {
        return client.get("/v1/members/write-off-records/" + requestNo, null);
    }

    /** 确认会员余额核销 */
    public SqdResponse confirmWriteOff(String requestNo, Map<String, Object> body) {
        return client.post("/v1/members/write-off-records/" + requestNo + "/confirm", body);
    }
}
