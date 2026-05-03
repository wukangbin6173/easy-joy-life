package com.easyjoylife.sqd;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

/**
 * 商起点 - 商户/门店模块
 */
@Service
@RequiredArgsConstructor
public class SqdMerchantService {

    private final SqdClient client;

    /** 查询商户列表 */
    public SqdResponse listMerchants(Integer pageNo, Integer pageSize) {
        Map<String, Object> params = new HashMap<>();
        params.put("pageNo", pageNo);
        params.put("pageSize", pageSize);
        return client.get("/v1/merchants", params);
    }

    /** 查询商户详情 */
    public SqdResponse getMerchant(Long merchantId) {
        return client.get("/v1/merchants/" + merchantId, null);
    }

    /** 查询门店列表 */
    public SqdResponse listStores(Long merchantId, Integer pageNo, Integer pageSize) {
        Map<String, Object> params = new HashMap<>();
        params.put("merchantId", merchantId);
        params.put("pageNo", pageNo);
        params.put("pageSize", pageSize);
        return client.get("/v1/stores", params);
    }

    /** 查询门店详情 */
    public SqdResponse getStore(Long storeId) {
        return client.get("/v1/stores/" + storeId, null);
    }

    /** 查询附近门店 */
    public SqdResponse nearbyStores(Double longitude, Double latitude, Integer radius, Integer radiusKm, Integer limit) {
        Map<String, Object> params = new HashMap<>();
        params.put("longitude", longitude);
        params.put("latitude", latitude);
        params.put("radius", radius);
        params.put("radiusKm", resolveRadiusKm(radius, radiusKm));
        params.put("limit", limit);
        return client.get("/v1/stores/nearby", params);
    }

    private Integer resolveRadiusKm(Integer radiusMeters, Integer radiusKm) {
        if (radiusKm != null) {
            return radiusKm;
        }
        if (radiusMeters == null) {
            return null;
        }
        return Math.max(1, (int) Math.ceil(radiusMeters / 1000.0));
    }

    /** 查询门店营业时间 */
    public SqdResponse getBusinessHours(Long storeId) {
        return client.get("/v1/stores/" + storeId + "/business-hours", null);
    }

    /** 商户注册（入驻） */
    public SqdResponse registerMerchant(Map<String, Object> body) {
        return client.post("/v1/merchants/register", body);
    }

    /** 更新商户信息 */
    public SqdResponse updateMerchant(Long merchantId, Map<String, Object> body) {
        return client.put("/v1/merchants/" + merchantId, body);
    }

    /** 创建门店 */
    public SqdResponse createStore(Map<String, Object> body) {
        return client.post("/v1/stores", body);
    }

    /** 更新门店 */
    public SqdResponse updateStore(Long storeId, Map<String, Object> body) {
        return client.put("/v1/stores/" + storeId, body);
    }

    /** 删除门店 */
    public SqdResponse deleteStore(Long storeId) {
        return client.delete("/v1/stores/" + storeId, null);
    }

    /** 提交商户认证 */
    public SqdResponse submitCertification(Long merchantId, Map<String, Object> body) {
        return client.post("/v1/merchants/" + merchantId + "/certification", body);
    }

    /** 查询商户认证状态 */
    public SqdResponse getCertificationStatus(Long merchantId) {
        return client.get("/v1/merchants/" + merchantId + "/certification/status", null);
    }
}
