package com.easyjoylife.sqd;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

/**
 * 商起点 - 可预订资源模块（棋牌室房间）
 */
@Service
@RequiredArgsConstructor
public class SqdResourceService {

    private final SqdClient client;

    /** 查询资源列表 */
    public SqdResponse listResources(Long merchantId, Long storeId, Integer pageNo, Integer pageSize) {
        Map<String, Object> params = new HashMap<>();
        params.put("merchantId", merchantId);
        if (storeId != null) {
            params.put("storeId", storeId);
        }
        params.put("pageNo", pageNo);
        params.put("pageSize", pageSize);
        return client.get("/v1/resources", params);
    }

    /** 查询资源详情 */
    public SqdResponse getResource(Long resourceId, Long merchantId) {
        Map<String, Object> params = new HashMap<>();
        params.put("merchantId", merchantId);
        return client.get("/v1/resources/" + resourceId, params);
    }

    /** 查询资源可用性 */
    public SqdResponse getAvailability(Long resourceId, Long merchantId, String date) {
        Map<String, Object> params = new HashMap<>();
        params.put("merchantId", merchantId);
        params.put("date", date);
        return client.get("/v1/resources/" + resourceId + "/availability", params);
    }

    /** 批量查询资源状态 */
    public SqdResponse batchStatus(String resourceIds, Long merchantId) {
        Map<String, Object> params = new HashMap<>();
        params.put("resourceIds", resourceIds);
        params.put("merchantId", merchantId);
        return client.get("/v1/resources/batch-status", params);
    }

    /** 查询资源统计 */
    public SqdResponse statistics(Long merchantId) {
        Map<String, Object> params = new HashMap<>();
        params.put("merchantId", merchantId);
        return client.get("/v1/resources/statistics", params);
    }

    /** 创建资源 */
    public SqdResponse createResource(Map<String, Object> body) {
        return client.post("/v1/resources", body);
    }

    /** 更新资源 */
    public SqdResponse updateResource(Long resourceId, Long merchantId, Map<String, Object> body) {
        return client.put("/v1/resources/" + resourceId + "?merchantId=" + merchantId, body);
    }

    /** 删除资源 */
    public SqdResponse deleteResource(Long resourceId, Long merchantId) {
        Map<String, Object> params = new HashMap<>();
        params.put("merchantId", merchantId);
        return client.delete("/v1/resources/" + resourceId, params);
    }

    /** 更新资源状态 */
    public SqdResponse updateResourceStatus(Long resourceId, Long merchantId, Map<String, Object> body) {
        return client.put("/v1/resources/" + resourceId + "/status?merchantId=" + merchantId, body);
    }

    /** 设置资源价格 */
    public SqdResponse setResourcePrice(Long resourceId, Long merchantId, Map<String, Object> body) {
        return client.put("/v1/resources/" + resourceId + "/price?merchantId=" + merchantId, body);
    }

    /** 设置资源排班 */
    public SqdResponse setResourceSchedule(Long resourceId, Long merchantId, Map<String, Object> body) {
        return client.put("/v1/resources/" + resourceId + "/schedule?merchantId=" + merchantId, body);
    }
}
