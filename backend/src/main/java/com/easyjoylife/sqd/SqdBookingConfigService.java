package com.easyjoylife.sqd;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

/**
 * 商起点 - 门店预约配置
 * 
 * 对应商起点开放接口：
 * - GET /v1/booking/config?merchantId=xxx&storeId=xxx — 查询门店预约配置（OpenAPI签名）
 */
@Service
@RequiredArgsConstructor
public class SqdBookingConfigService {

    private final SqdClient client;

    /**
     * 获取门店预约配置（含总开关 status）
     * status: 0=正常（预约开启）, 1=禁用（预约关闭）
     */
    public SqdResponse getBookingConfig(Long merchantId, Long storeId) {
        Map<String, Object> params = new HashMap<>();
        if (merchantId != null) {
            params.put("merchantId", merchantId);
        }
        params.put("storeId", storeId);
        return client.get("/v1/booking/config", params);
    }
}
