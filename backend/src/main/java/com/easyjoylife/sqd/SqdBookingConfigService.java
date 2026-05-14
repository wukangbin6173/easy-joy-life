package com.easyjoylife.sqd;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

/**
 * 商起点 - 门店预约配置（总开关）
 * 
 * 对应商起点 app-api 接口：
 * - GET  /app-api/merchant/my-booking-config/get?storeId=xxx
 * - PUT  /app-api/merchant/my-booking-config/update
 */
@Service
@RequiredArgsConstructor
public class SqdBookingConfigService {

    private final SqdClient client;

    /**
     * 获取门店预约配置（含总开关 status）
     * status: 0=开启预约, 1=关闭预约
     */
    public SqdResponse getBookingConfig(Long storeId) {
        Map<String, Object> params = new HashMap<>();
        params.put("storeId", storeId);
        return client.merchantGet("/app-api/merchant/my-booking-config/get", params);
    }

    /**
     * 更新门店预约配置（含总开关 status）
     * status: 0=开启预约, 1=关闭预约
     */
    public SqdResponse updateBookingConfig(Map<String, Object> body) {
        return client.merchantPut("/app-api/merchant/my-booking-config/update", body);
    }
}
