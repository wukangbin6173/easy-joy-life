package com.easyjoylife.sqd;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

/**
 * 商起点 - 预约模块
 */
@Service
@RequiredArgsConstructor
public class SqdBookingService {

    private final SqdClient client;

    /** 查询可用预约时间段 */
    public SqdResponse availableSlots(Long merchantId, Long resourceId, String date) {
        Map<String, Object> params = new HashMap<>();
        params.put("merchantId", merchantId);
        params.put("resourceId", resourceId);
        params.put("date", date);
        return client.get("/v1/booking/available-slots", params);
    }

    /** 查询预约列表 */
    public SqdResponse listBookings(Long merchantId, Integer pageNo, Integer pageSize) {
        Map<String, Object> params = new HashMap<>();
        params.put("merchantId", merchantId);
        params.put("pageNo", pageNo);
        params.put("pageSize", pageSize);
        return client.get("/v1/booking/orders", params);
    }

    /** 查询预约详情 */
    public SqdResponse getBooking(Long orderId, Long merchantId) {
        Map<String, Object> params = new HashMap<>();
        params.put("merchantId", merchantId);
        return client.get("/v1/booking/orders/" + orderId, params);
    }

    /** 创建预约订单 */
    public SqdResponse createBooking(Map<String, Object> body) {
        return client.post("/v1/booking/orders", body);
    }

    /** 变更预约 */
    public SqdResponse changeBooking(Long orderId, Long merchantId, Map<String, Object> body) {
        return client.put("/v1/booking/orders/" + orderId + "?merchantId=" + merchantId, body);
    }

    /** 取消预约 */
    public SqdResponse cancelBooking(Long orderId, Long merchantId) {
        return client.post("/v1/booking/orders/" + orderId + "/cancel?merchantId=" + merchantId, null);
    }

    /** 确认预约 */
    public SqdResponse confirmBooking(Long orderId, Long merchantId) {
        return client.post("/v1/booking/orders/" + orderId + "/confirm?merchantId=" + merchantId, null);
    }

    /** 开始服务 */
    public SqdResponse startService(Long orderId, Long merchantId) {
        return client.post("/v1/booking/orders/" + orderId + "/start?merchantId=" + merchantId, null);
    }

    /** 完成服务 */
    public SqdResponse completeService(Long orderId, Long merchantId) {
        return client.post("/v1/booking/orders/" + orderId + "/complete?merchantId=" + merchantId, null);
    }

    /** 查询预约统计 */
    public SqdResponse statistics(Long merchantId) {
        Map<String, Object> params = new HashMap<>();
        params.put("merchantId", merchantId);
        return client.get("/v1/booking/statistics", params);
    }

    /** 变更预约订单 */
    public SqdResponse changeBookingOrder(Long orderId, Long merchantId, Map<String, Object> body) {
        return client.post("/v1/booking/orders/" + orderId + "/change?merchantId=" + merchantId, body);
    }
}
