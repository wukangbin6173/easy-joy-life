package com.easyjoylife.sqd;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

/**
 * 商起点 - 提现模块
 */
@Service
@RequiredArgsConstructor
public class SqdWithdrawService {

    private final SqdClient client;

    /** 绑定提现账户 */
    public SqdResponse bindAccount(Map<String, Object> body) {
        return client.post("/withdraw/account/bind", body);
    }

    /** 解绑提现账户 */
    public SqdResponse unbindAccount(Long accountId) {
        Map<String, Object> params = new HashMap<>();
        params.put("accountId", accountId);
        return client.delete("/withdraw/account/unbind", params);
    }

    /** 查询用户提现账户列表 */
    public SqdResponse listAccounts(String externalUserId) {
        Map<String, Object> params = new HashMap<>();
        params.put("externalUserId", externalUserId);
        return client.get("/withdraw/account/list", params);
    }

    /** 创建提现 */
    public SqdResponse createWithdraw(Map<String, Object> body) {
        return client.post("/withdraw/create", body);
    }

    /** 查询提现状态 */
    public SqdResponse getWithdrawStatus(String merchantWithdrawNo) {
        Map<String, Object> params = new HashMap<>();
        params.put("merchantWithdrawNo", merchantWithdrawNo);
        return client.get("/withdraw/get", params);
    }
}
