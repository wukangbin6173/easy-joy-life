package com.easyjoylife.sqd;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 商起点 - IoT 设备控制模块
 *
 * 开锁/关锁走 billing 模块的设备控制接口（已转发为 IoT 资源动作）：
 * - POST /v1/billing/resource/{resourceId}/unlock — 远程开锁
 * - POST /v1/billing/resource/{resourceId}/lock — 远程关锁
 * - POST /v1/billing/resource/batch-unlock — 批量开锁
 * - POST /v1/billing/resource/batch-lock — 批量关锁
 *
 * 通用 IoT 动作执行走 /v1/iot/actions/execute（如果权限可用）
 */
@Service
@RequiredArgsConstructor
public class SqdIotService {

    private final SqdClient client;

    // ========== 通过 billing 模块的设备控制（推荐，OpenAPI签名） ==========

    /** 远程开锁（单个资源） */
    public SqdResponse unlock(Long resourceId) {
        return client.post("/v1/billing/resource/" + resourceId + "/unlock", new HashMap<>());
    }

    /** 远程关锁（单个资源） */
    public SqdResponse lock(Long resourceId) {
        return client.post("/v1/billing/resource/" + resourceId + "/lock", new HashMap<>());
    }

    /** 批量开锁 */
    public SqdResponse batchUnlock(List<Long> resourceIds) {
        return client.post("/v1/billing/resource/batch-unlock", resourceIds);
    }

    /** 批量关锁 */
    public SqdResponse batchLock(List<Long> resourceIds) {
        return client.post("/v1/billing/resource/batch-lock", resourceIds);
    }

    // ========== 通用 IoT 动作执行（/v1/iot，需要 iot 权限） ==========

    /** 执行资源动作（推荐使用，优于逐个下发命令） */
    public SqdResponse executeAction(Map<String, Object> body) {
        return client.post("/v1/iot/actions/execute", body);
    }

    /** 查询动作执行结果 */
    public SqdResponse getActionResult(String actionNo) {
        Map<String, Object> params = new HashMap<>();
        params.put("actionNo", actionNo);
        return client.get("/v1/iot/actions/get", params);
    }

    /** 查询设备列表 */
    public SqdResponse listDevices(Map<String, Object> body) {
        return client.post("/v1/iot/devices/list", body);
    }

    /** 根据设备编号查询设备详情 */
    public SqdResponse getDeviceByNo(Long merchantId, String deviceNo) {
        Map<String, Object> params = new HashMap<>();
        params.put("merchantId", merchantId);
        params.put("deviceNo", deviceNo);
        return client.get("/v1/iot/devices/get-by-device-no", params);
    }

    /** 查询设备影子（实时状态） */
    public SqdResponse getDeviceShadow(Long merchantId, String deviceNo) {
        Map<String, Object> params = new HashMap<>();
        params.put("merchantId", merchantId);
        params.put("deviceNo", deviceNo);
        return client.get("/v1/iot/devices/shadow", params);
    }

    /** 下发设备命令 */
    public SqdResponse sendCommand(Long merchantId, Map<String, Object> body) {
        return client.post("/v1/iot/devices/command?merchantId=" + merchantId, body);
    }

    /** 查询资源动作模板 */
    public SqdResponse listActionTemplates(Long merchantId, Long storeId, String resourceType) {
        Map<String, Object> params = new HashMap<>();
        params.put("merchantId", merchantId);
        if (storeId != null) {
            params.put("storeId", storeId);
        }
        if (resourceType != null) {
            params.put("resourceType", resourceType);
        }
        return client.get("/v1/iot/actions/templates", params);
    }

    /** 绑定或注册 IoT 设备 */
    public SqdResponse bindDevice(Map<String, Object> body) {
        return client.post("/v1/iot/devices/bind", body);
    }

    /** 解绑资源设备 */
    public SqdResponse unbindResource(Map<String, Object> body) {
        return client.post("/v1/iot/devices/unbind-resource", body);
    }

    /** 保存资源动作模板 */
    public SqdResponse saveActionTemplate(Map<String, Object> body) {
        return client.post("/v1/iot/actions/templates/save", body);
    }
}
