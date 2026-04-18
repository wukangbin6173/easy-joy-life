package com.easyjoylife.sqd;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

/**
 * 商起点 - 固定收款码模块
 */
@Service
@RequiredArgsConstructor
public class SqdFixedQrcodeService {

    private final SqdClient client;

    /** 创建固定收款码 */
    public SqdResponse create(Map<String, Object> body) {
        return client.post("/fixed-qrcode/create", body);
    }

    /** 删除固定收款码 */
    public SqdResponse delete(Long id, Long merchantId) {
        Map<String, Object> params = new HashMap<>();
        params.put("id", id);
        params.put("merchantId", merchantId);
        return client.delete("/fixed-qrcode/delete", params);
    }

    /** 查询当前App为指定商户创建的固定收款码列表 */
    public SqdResponse list(Long merchantId) {
        Map<String, Object> params = new HashMap<>();
        params.put("merchantId", merchantId);
        return client.get("/fixed-qrcode/list", params);
    }
}
