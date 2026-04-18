package com.easyjoylife.sqd;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

/**
 * 商起点 - 支付宝授权绑定模块
 */
@Service
@RequiredArgsConstructor
public class SqdAlipayAuthService {

    private final SqdClient client;

    /** 获取支付宝授权配置 */
    public SqdResponse getConfig() {
        return client.get("/alipay-auth/config", null);
    }

    /** 通过授权码绑定支付宝账号 */
    public SqdResponse bind(String externalUserId, String authCode) {
        Map<String, Object> body = new HashMap<>();
        body.put("externalUserId", externalUserId);
        body.put("authCode", authCode);
        return client.post("/alipay-auth/bind", body);
    }

    /** 查询用户支付宝绑定状态 */
    public SqdResponse getBindingStatus(String externalUserId) {
        Map<String, Object> params = new HashMap<>();
        params.put("externalUserId", externalUserId);
        return client.get("/alipay-auth/binding", params);
    }

    /** 解绑支付宝账号 */
    public SqdResponse unbind(String externalUserId) {
        Map<String, Object> body = new HashMap<>();
        body.put("externalUserId", externalUserId);
        return client.post("/alipay-auth/unbind", body);
    }
}
