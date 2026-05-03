package com.easyjoylife.sqd;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

/**
 * 商起点 - 计费预定模块
 * 适用于棋牌室等计时计费场景
 */
@Service
@RequiredArgsConstructor
public class SqdBillingService {

    private final SqdClient client;

    // ========== 价格配置 ==========

    /** 查询资源价格配置 */
    public SqdResponse getPrice(Long resourceId, Long merchantId) {
        Map<String, Object> params = new HashMap<>();
        params.put("resourceId", resourceId);
        params.put("merchantId", merchantId);
        return client.get("/v1/billing/price/get", params);
    }

    /** 保存资源价格配置 */
    public SqdResponse savePrice(Map<String, Object> body) {
        return client.post("/v1/billing/price/save", body);
    }

    // ========== 套餐管理 ==========

    /** 查询商户套餐列表 */
    public SqdResponse listPackages(Long merchantId) {
        Map<String, Object> params = new HashMap<>();
        params.put("merchantId", merchantId);
        return client.get("/v1/billing/package/list", params);
    }

    /** 创建套餐 */
    public SqdResponse createPackage(Map<String, Object> body) {
        return client.post("/v1/billing/package/create", body);
    }

    // ========== 计费订单 ==========

    /**
     * 创建预付模式订单（按时计费）
     * 返回 cashierUrl，前端直接跳转收银台
     * 收银台自动显示余额支付选项
     */
    public SqdResponse createPrepaidOrder(Long merchantId, Long resourceId,
                                          String externalUserId, String startTime,
                                          Integer durationMinutes) {
        return createPrepaidOrder(merchantId, resourceId, externalUserId, startTime, durationMinutes, null);
    }

    public SqdResponse createPrepaidOrder(Long merchantId, Long resourceId,
                                          String externalUserId, String startTime,
                                          Integer durationMinutes, String returnUrl) {
        Map<String, Object> body = new HashMap<>();
        body.put("merchantId", merchantId);
        body.put("resourceId", resourceId);
        body.put("externalUserId", externalUserId);
        body.put("startTime", startTime);
        body.put("durationMinutes", durationMinutes);
        if (returnUrl != null && !returnUrl.isEmpty()) {
            body.put("returnUrl", returnUrl);
        }
        return client.post("/v1/billing/order/create-prepaid", body);
    }
    /**
     * 创建套餐模式订单
     * 返回 cashierUrl，前端直接跳转收银台支付
     */
    public SqdResponse createPackageOrder(Long merchantId, Long resourceId,
                                          String externalUserId, String startTime,
                                          Long packageId) {
        Map<String, Object> body = new HashMap<>();
        body.put("merchantId", merchantId);
        body.put("resourceId", resourceId);
        body.put("externalUserId", externalUserId);
        body.put("startTime", startTime);
        body.put("packageId", packageId);
        return client.post("/v1/billing/order/create-package", body);
    }

    /** 查询订单详情 */
    public SqdResponse getOrder(Long orderId) {
        Map<String, Object> params = new HashMap<>();
        params.put("orderId", orderId);
        return client.get("/v1/billing/order/get", params);
    }

    /** 分页查询订单 */
    public SqdResponse pageOrders(Map<String, Object> body) {
        return client.post("/v1/billing/order/page", body);
    }

    /** 查询当前 App 用户自己的计费订单 */
    public SqdResponse myOrders(String externalUserId, Integer status, Integer pageNo, Integer pageSize) {
        Map<String, Object> params = new HashMap<>();
        params.put("externalUserId", externalUserId);
        params.put("status", status);
        params.put("pageNo", pageNo);
        params.put("pageSize", pageSize);
        return client.get("/v1/billing/order/my-orders", params);
    }

    // ========== 计时控制 ==========

    /** 开始使用（开锁） */
    public SqdResponse startUsage(Long orderId) {
        return client.post("/v1/billing/order/" + orderId + "/start-usage", null);
    }

    /** 结束使用（退房结算） */
    public SqdResponse endUsage(Long orderId) {
        return client.post("/v1/billing/order/" + orderId + "/end-usage", null);
    }

    /** 续费 */
    public SqdResponse renew(Long orderId, Integer additionalMinutes) {
        return client.post("/v1/billing/order/" + orderId + "/renew?additionalMinutes=" + additionalMinutes, null);
    }

    /** 取消订单 */
    public SqdResponse cancelOrder(Long orderId, String reason) {
        String encodedReason = URLEncoder.encode(reason == null ? "" : reason, StandardCharsets.UTF_8);
        return client.post("/v1/billing/order/" + orderId + "/cancel?reason=" + encodedReason, null);
    }

    // ========== 房间状态 ==========

    /**
     * 查询资源时间轴
     * 返回当天24小时占用情况，前端据此渲染可选时段
     */
    public SqdResponse getTimeline(Long resourceId, String date) {
        Map<String, Object> params = new HashMap<>();
        params.put("date", date);
        return client.get("/v1/billing/resource/" + resourceId + "/timeline", params);
    }

    /** 确认打扫完毕 */
    public SqdResponse confirmCleaning(Long resourceId) {
        return client.post("/v1/billing/resource/" + resourceId + "/confirm-cleaning", null);
    }

    /** 查询待打扫列表 */
    public SqdResponse pendingCleaningList(Long merchantId) {
        Map<String, Object> params = new HashMap<>();
        params.put("merchantId", merchantId);
        return client.get("/v1/billing/cleaning/pending-list", params);
    }

    // ========== 设备控制 ==========

    /** 远程开锁 */
    public SqdResponse unlock(Long resourceId, Map<String, Object> body) {
        return client.post("/v1/billing/resource/" + resourceId + "/unlock", body);
    }

    /** IoT 设备事件上报 */
    public SqdResponse deviceEvent(Map<String, Object> body) {
        return client.post("/v1/billing/device/event", body);
    }
}
