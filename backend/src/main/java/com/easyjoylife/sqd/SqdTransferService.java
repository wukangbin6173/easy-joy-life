package com.easyjoylife.sqd;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

/**
 * 商起点 - B2B转账模块
 */
@Service
@RequiredArgsConstructor
public class SqdTransferService {

    private final SqdClient client;

    /** 创建B2B转账 */
    public SqdResponse createB2bTransfer(Map<String, Object> body) {
        return client.post("/v1/transfer/b2b", body);
    }

    /** 查询B2B转账状态 */
    public SqdResponse getB2bTransferStatus(String merchantTransferNo) {
        Map<String, Object> params = new HashMap<>();
        params.put("merchantTransferNo", merchantTransferNo);
        return client.get("/v1/transfer/b2b", params);
    }
}
