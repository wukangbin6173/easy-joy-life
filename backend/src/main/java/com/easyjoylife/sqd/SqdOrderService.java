package com.easyjoylife.sqd;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

/**
 * 商起点 - 订单模块
 */
@Service
@RequiredArgsConstructor
public class SqdOrderService {

    private final SqdClient client;

    /** 查询订单列表 */
    public SqdResponse listOrders(Long merchantId, String externalUserId, Integer status,
                                  Integer pageNo, Integer pageSize) {
        Map<String, Object> params = new HashMap<>();
        params.put("merchantId", merchantId);
        params.put("externalUserId", externalUserId);
        params.put("status", status);
        params.put("pageNo", pageNo);
        params.put("pageSize", pageSize);
        return client.get("/v1/orders", params);
    }

    /** 查询订单详情 */
    public SqdResponse getOrder(Long orderId, Long merchantId) {
        Map<String, Object> params = new HashMap<>();
        params.put("merchantId", merchantId);
        return client.get("/v1/orders/" + orderId, params);
    }

    /** 创建订单 */
    public SqdResponse createOrder(Map<String, Object> body) {
        return client.post("/v1/orders", body);
    }

    /** 取消订单 */
    public SqdResponse cancelOrder(Long orderId, Long merchantId) {
        return client.post("/v1/orders/" + orderId + "/cancel?merchantId=" + merchantId, null);
    }

    /** 订单支付 */
    public SqdResponse payOrder(Long orderId, Long merchantId, Map<String, Object> body) {
        return client.post("/v1/orders/" + orderId + "/pay?merchantId=" + merchantId, body);
    }

    /** 申请退款 */
    public SqdResponse refundOrder(Long orderId, Long merchantId, int refundAmount, String reason) {
        Map<String, Object> body = new HashMap<>();
        body.put("refundAmount", refundAmount);
        body.put("reason", reason);
        return client.post("/v1/orders/" + orderId + "/refund?merchantId=" + merchantId, body);
    }

    /** 订单评价 */
    public SqdResponse reviewOrder(Long orderId, Long merchantId, String content, int rating) {
        Map<String, Object> body = new HashMap<>();
        body.put("content", content);
        body.put("rating", rating);
        return client.post("/v1/orders/" + orderId + "/review?merchantId=" + merchantId, body);
    }

    /** 查询订单状态变更历史 */
    public SqdResponse getStatusHistory(Long orderId, Long merchantId) {
        Map<String, Object> params = new HashMap<>();
        params.put("merchantId", merchantId);
        return client.get("/v1/orders/" + orderId + "/status-history", params);
    }

    /** 查询订单统计 */
    public SqdResponse statistics(Long merchantId) {
        Map<String, Object> params = new HashMap<>();
        params.put("merchantId", merchantId);
        return client.get("/v1/orders/statistics", params);
    }

    /** 查询退款详情 */
    public SqdResponse getRefundDetail(Long orderId, Long merchantId) {
        Map<String, Object> params = new HashMap<>();
        params.put("merchantId", merchantId);
        return client.get("/v1/orders/" + orderId + "/refund", params);
    }

    /** 确认收货 */
    public SqdResponse confirmReceipt(Long orderId, Long merchantId) {
        return client.post("/v1/orders/" + orderId + "/confirm-receipt?merchantId=" + merchantId, null);
    }

    /** 核销订单 */
    public SqdResponse writeOffOrder(Long orderId, Long merchantId) {
        return client.post("/v1/orders/" + orderId + "/write-off?merchantId=" + merchantId, null);
    }

    /** 更新配送状态 */
    public SqdResponse updateDeliveryStatus(Long orderId, Long merchantId, Map<String, Object> body) {
        return client.put("/v1/orders/" + orderId + "/delivery-status?merchantId=" + merchantId, body);
    }

    /** 确认预约订单 */
    public SqdResponse confirmBooking(Long orderId, Long merchantId) {
        return client.post("/v1/orders/" + orderId + "/confirm-booking?merchantId=" + merchantId, null);
    }

    /** 变更预约订单 */
    public SqdResponse changeBooking(Long orderId, Long merchantId, Map<String, Object> body) {
        return client.post("/v1/orders/" + orderId + "/change-booking?merchantId=" + merchantId, body);
    }
}
