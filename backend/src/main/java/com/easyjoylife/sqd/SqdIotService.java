package com.easyjoylife.sqd;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

/**
 * 商起点 - IoT 设备控制模块
 *
 * 覆盖：设备列表、设备影子、下发命令、执行资源动作、查询动作结果
 */
@Service
@RequiredArgsConstructor
public class SqdIotService {

    private final SqdClient client;

    // ========== 设备管理 ==========

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

    // ========== 资源动作 ==========

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

    // ========== 设备注册（管理端使用） ==========

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
