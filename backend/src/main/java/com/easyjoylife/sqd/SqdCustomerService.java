package com.easyjoylife.sqd;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

/**
 * 商起点 - 客户管理模块
 */
@Service
@RequiredArgsConstructor
public class SqdCustomerService {

    private final SqdClient client;

    /**
     * 客户进件建档
     * 使用会员卡、优惠券等交易功能的前提
     */
    public SqdResponse intake(String externalUserId, String realName, String phone,
                              String nickname, String avatarUrl) {
        Map<String, Object> body = new HashMap<>();
        body.put("externalUserId", externalUserId);
        body.put("realName", realName);
        body.put("phone", phone);
        body.put("nickname", nickname);
        body.put("avatarUrl", avatarUrl);
        return client.post("/v1/customers/intake", body);
    }

    /** 查询客户列表 */
    public SqdResponse listCustomers(Long merchantId, Integer pageNo, Integer pageSize) {
        Map<String, Object> params = new HashMap<>();
        params.put("merchantId", merchantId);
        params.put("pageNo", pageNo);
        params.put("pageSize", pageSize);
        return client.get("/v1/customers", params);
    }

    /** 查询客户详情 */
    public SqdResponse getCustomer(Long customerId, Long merchantId) {
        Map<String, Object> params = new HashMap<>();
        params.put("merchantId", merchantId);
        return client.get("/v1/customers/" + customerId, params);
    }

    /** 按手机号换取平台用户ID */
    public SqdResponse getPlatformUserId(String phone) {
        Map<String, Object> params = new HashMap<>();
        params.put("phone", phone);
        return client.get("/v1/customers/platform-user-id-by-phone", params);
    }

    /** 查询客户消费记录 */
    public SqdResponse getTransactions(Long customerId, Long merchantId,
                                       Integer pageNo, Integer pageSize) {
        Map<String, Object> params = new HashMap<>();
        params.put("merchantId", merchantId);
        params.put("pageNo", pageNo);
        params.put("pageSize", pageSize);
        return client.get("/v1/customers/" + customerId + "/transactions", params);
    }

    /** 同步用户信息 */
    public SqdResponse syncUser(Map<String, Object> body) {
        return client.post("/v1/customers/sync", body);
    }

    /** 查询客户标签 */
    public SqdResponse getTags(Long customerId, Long merchantId) {
        Map<String, Object> params = new HashMap<>();
        params.put("merchantId", merchantId);
        return client.get("/v1/customers/" + customerId + "/tags", params);
    }

    /** 添加客户标签 */
    public SqdResponse addTag(Long customerId, Long merchantId, Map<String, Object> body) {
        return client.post("/v1/customers/" + customerId + "/tags?merchantId=" + merchantId, body);
    }

    /** 移除客户标签 */
    public SqdResponse removeTag(Long customerId, String tagName, Long merchantId) {
        Map<String, Object> params = new HashMap<>();
        params.put("merchantId", merchantId);
        return client.delete("/v1/customers/" + customerId + "/tags/" + tagName, params);
    }

    /** 查询客户统计 */
    public SqdResponse statistics(Long merchantId) {
        Map<String, Object> params = new HashMap<>();
        params.put("merchantId", merchantId);
        return client.get("/v1/customers/statistics", params);
    }
}
