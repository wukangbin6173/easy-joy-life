package com.easyjoylife.sqd;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

/**
 * 商起点 - 数据统计模块
 */
@Service
@RequiredArgsConstructor
public class SqdStatisticsService {

    private final SqdClient client;

    /** 查询经营概览 */
    public SqdResponse overview(Long merchantId) {
        Map<String, Object> params = new HashMap<>();
        params.put("merchantId", merchantId);
        return client.get("/v1/statistics/overview", params);
    }

    /** 查询销售报表 */
    public SqdResponse sales(Long merchantId, String period) {
        Map<String, Object> params = new HashMap<>();
        params.put("merchantId", merchantId);
        params.put("period", period);
        return client.get("/v1/statistics/sales", params);
    }

    /** 查询客户分析 */
    public SqdResponse customers(Long merchantId) {
        Map<String, Object> params = new HashMap<>();
        params.put("merchantId", merchantId);
        return client.get("/v1/statistics/customers", params);
    }

    /** 查询渠道分析 */
    public SqdResponse channels(Long merchantId) {
        Map<String, Object> params = new HashMap<>();
        params.put("merchantId", merchantId);
        return client.get("/v1/statistics/channels", params);
    }

    /** 查询预约分析 */
    public SqdResponse bookings(Long merchantId) {
        Map<String, Object> params = new HashMap<>();
        params.put("merchantId", merchantId);
        return client.get("/v1/statistics/bookings", params);
    }

    /** 创建报表导出任务 */
    public SqdResponse createExport(Map<String, Object> body) {
        return client.post("/v1/statistics/export", body);
    }

    /** 查询导出任务状态 */
    public SqdResponse getExportStatus(Long taskId, Long merchantId) {
        Map<String, Object> params = new HashMap<>();
        params.put("merchantId", merchantId);
        return client.get("/v1/statistics/export/" + taskId, params);
    }
}
