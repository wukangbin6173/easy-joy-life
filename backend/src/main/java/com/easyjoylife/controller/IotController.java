package com.easyjoylife.controller;

import com.easyjoylife.sqd.SqdIotService;
import com.easyjoylife.sqd.SqdResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * IoT 设备控制器
 *
 * 小程序端主要使用场景：
 * - 用户到店后执行开锁/开电源等动作
 * - 查询设备在线状态
 * - 查询动作执行结果
 *
 * 推荐使用"资源动作"接口（/actions/execute），而非逐个下发设备命令。
 * 资源动作会根据预配置的模板统一完成多设备、多步骤操作。
 */
@Slf4j
@RestController
@RequestMapping("/api/iot")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class IotController {

    private final SqdIotService sqdIotService;

    // ========== 简化开锁/关锁接口（走 billing 通道，最可靠） ==========

    /**
     * 远程开锁（单个资源）
     * POST /api/iot/unlock/{resourceId}
     *
     * 这是最简单的开锁方式，走 billing 模块的设备控制接口，
     * 商起点内部会转发为 IoT 资源动作。
     */
    @PostMapping("/unlock/{resourceId}")
    public ResponseEntity<Map<String, Object>> unlock(@PathVariable Long resourceId) {
        Map<String, Object> response = new HashMap<>();
        try {
            SqdResponse sqd = sqdIotService.unlock(resourceId);
            if (sqd.isSuccess()) {
                response.put("success", true);
                response.put("message", "开锁成功");
                response.put("data", sqd.getData());
            } else {
                response.put("success", false);
                response.put("message", sqd.getMsg());
            }
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("开锁失败: resourceId={}", resourceId, e);
            response.put("success", false);
            response.put("message", "开锁失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    /**
     * 远程关锁（单个资源）
     * POST /api/iot/lock/{resourceId}
     */
    @PostMapping("/lock/{resourceId}")
    public ResponseEntity<Map<String, Object>> lock(@PathVariable Long resourceId) {
        Map<String, Object> response = new HashMap<>();
        try {
            SqdResponse sqd = sqdIotService.lock(resourceId);
            if (sqd.isSuccess()) {
                response.put("success", true);
                response.put("message", "关锁成功");
                response.put("data", sqd.getData());
            } else {
                response.put("success", false);
                response.put("message", sqd.getMsg());
            }
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("关锁失败: resourceId={}", resourceId, e);
            response.put("success", false);
            response.put("message", "关锁失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    /**
     * 批量开锁
     * POST /api/iot/batch-unlock
     * body: [resourceId1, resourceId2, ...]
     */
    @PostMapping("/batch-unlock")
    public ResponseEntity<Map<String, Object>> batchUnlock(@RequestBody java.util.List<Long> resourceIds) {
        Map<String, Object> response = new HashMap<>();
        try {
            if (resourceIds == null || resourceIds.isEmpty()) {
                return badRequest(response, "请选择需要开锁的资源");
            }
            SqdResponse sqd = sqdIotService.batchUnlock(resourceIds);
            if (sqd.isSuccess()) {
                response.put("success", true);
                response.put("message", "批量开锁已下发");
                response.put("data", sqd.getData());
            } else {
                response.put("success", false);
                response.put("message", sqd.getMsg());
            }
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("批量开锁失败", e);
            response.put("success", false);
            response.put("message", "批量开锁失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    /**
     * 批量关锁
     * POST /api/iot/batch-lock
     * body: [resourceId1, resourceId2, ...]
     */
    @PostMapping("/batch-lock")
    public ResponseEntity<Map<String, Object>> batchLock(@RequestBody java.util.List<Long> resourceIds) {
        Map<String, Object> response = new HashMap<>();
        try {
            if (resourceIds == null || resourceIds.isEmpty()) {
                return badRequest(response, "请选择需要关锁的资源");
            }
            SqdResponse sqd = sqdIotService.batchLock(resourceIds);
            if (sqd.isSuccess()) {
                response.put("success", true);
                response.put("message", "批量关锁已下发");
                response.put("data", sqd.getData());
            } else {
                response.put("success", false);
                response.put("message", sqd.getMsg());
            }
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("批量关锁失败", e);
            response.put("success", false);
            response.put("message", "批量关锁失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    // ========== 资源动作（小程序端核心接口） ==========

    /**
     * 执行资源动作（开锁/开电源/结束使用等）
     *
     * 动作类型 actionType：
     * - START_USAGE：开始使用（开锁+开电源）
     * - END_USAGE：结束使用（关锁+关电源）
     * - PAUSE_USAGE：暂停使用
     * - RESUME_USAGE：恢复使用
     * - MANUAL_OPEN：手动开门（不关联订单）
     *
     * POST /api/iot/actions/execute
     * body: {
     *   merchantId, storeId?, resourceId, orderId?,
     *   actionType, resourceType?, requestNo?, timeoutSeconds?
     * }
     */
    @PostMapping("/actions/execute")
    public ResponseEntity<Map<String, Object>> executeAction(@RequestBody Map<String, Object> body) {
        Map<String, Object> response = new HashMap<>();
        try {
            Long merchantId = asLong(body.get("merchantId"));
            Long resourceId = asLong(body.get("resourceId"));
            String actionType = asText(body.get("actionType"));

            if (merchantId == null) {
                return badRequest(response, "merchantId不能为空");
            }
            if (resourceId == null) {
                return badRequest(response, "resourceId不能为空");
            }
            if (actionType == null || actionType.isEmpty()) {
                return badRequest(response, "actionType不能为空");
            }

            // 如果没有传 requestNo，自动生成一个
            if (!body.containsKey("requestNo") || asText(body.get("requestNo")) == null) {
                String requestNo = "APP-" + resourceId + "-" + actionType + "-" + System.currentTimeMillis();
                body.put("requestNo", requestNo);
            }

            SqdResponse sqd = sqdIotService.executeAction(body);
            if (sqd.isSuccess()) {
                response.put("success", true);
                response.put("message", actionTypeMessage(actionType));
                response.put("data", sqd.getData());
            } else {
                response.put("success", false);
                response.put("message", sqd.getMsg());
            }
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("执行资源动作失败", e);
            response.put("success", false);
            response.put("message", "执行动作失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    /**
     * 查询动作执行结果
     *
     * GET /api/iot/actions/{actionNo}
     *
     * 动作状态：
     * - 0：已创建
     * - 10：执行中
     * - 20：成功
     * - 30：部分失败
     * - 40：失败
     * - 50：超时
     */
    @GetMapping("/actions/{actionNo}")
    public ResponseEntity<Map<String, Object>> getActionResult(@PathVariable String actionNo) {
        Map<String, Object> response = new HashMap<>();
        try {
            SqdResponse sqd = sqdIotService.getActionResult(actionNo);
            if (sqd.isSuccess()) {
                response.put("success", true);
                response.put("data", sqd.getData());
            } else {
                response.put("success", false);
                response.put("message", sqd.getMsg());
            }
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("查询动作结果失败: actionNo={}", actionNo, e);
            response.put("success", false);
            response.put("message", "查询失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    /**
     * 查询资源动作模板
     *
     * GET /api/iot/actions/templates?merchantId={merchantId}&storeId={storeId}&resourceType={resourceType}
     */
    @GetMapping("/actions/templates")
    public ResponseEntity<Map<String, Object>> listActionTemplates(
            @RequestParam Long merchantId,
            @RequestParam(required = false) Long storeId,
            @RequestParam(required = false) String resourceType) {
        Map<String, Object> response = new HashMap<>();
        try {
            SqdResponse sqd = sqdIotService.listActionTemplates(merchantId, storeId, resourceType);
            if (sqd.isSuccess()) {
                response.put("success", true);
                response.put("data", sqd.getData());
            } else {
                response.put("success", false);
                response.put("message", sqd.getMsg());
            }
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("查询动作模板失败", e);
            response.put("success", false);
            response.put("message", "查询失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    // ========== 设备状态查询 ==========

    /**
     * 查询资源绑定的设备列表
     *
     * POST /api/iot/devices/list
     * body: { merchantId, storeId?, resourceId?, deviceType?, status?, onlineStatus? }
     */
    @PostMapping("/devices/list")
    public ResponseEntity<Map<String, Object>> listDevices(@RequestBody Map<String, Object> body) {
        Map<String, Object> response = new HashMap<>();
        try {
            SqdResponse sqd = sqdIotService.listDevices(body);
            if (sqd.isSuccess()) {
                response.put("success", true);
                response.put("data", sqd.getData());
            } else {
                response.put("success", false);
                response.put("message", sqd.getMsg());
            }
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("查询设备列表失败", e);
            response.put("success", false);
            response.put("message", "查询设备列表失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    /**
     * 查询设备详情
     *
     * GET /api/iot/devices/{deviceNo}?merchantId={merchantId}
     */
    @GetMapping("/devices/{deviceNo}")
    public ResponseEntity<Map<String, Object>> getDevice(
            @PathVariable String deviceNo,
            @RequestParam Long merchantId) {
        Map<String, Object> response = new HashMap<>();
        try {
            SqdResponse sqd = sqdIotService.getDeviceByNo(merchantId, deviceNo);
            if (sqd.isSuccess()) {
                response.put("success", true);
                response.put("data", sqd.getData());
            } else {
                response.put("success", false);
                response.put("message", sqd.getMsg());
            }
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("查询设备详情失败: deviceNo={}", deviceNo, e);
            response.put("success", false);
            response.put("message", "查询失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    /**
     * 查询设备影子（实时状态）
     *
     * GET /api/iot/devices/{deviceNo}/shadow?merchantId={merchantId}
     *
     * 返回 reportedState（设备上报状态）和 desiredState（平台期望状态）
     */
    @GetMapping("/devices/{deviceNo}/shadow")
    public ResponseEntity<Map<String, Object>> getDeviceShadow(
            @PathVariable String deviceNo,
            @RequestParam Long merchantId) {
        Map<String, Object> response = new HashMap<>();
        try {
            SqdResponse sqd = sqdIotService.getDeviceShadow(merchantId, deviceNo);
            if (sqd.isSuccess()) {
                response.put("success", true);
                response.put("data", sqd.getData());
            } else {
                response.put("success", false);
                response.put("message", sqd.getMsg());
            }
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("查询设备影子失败: deviceNo={}", deviceNo, e);
            response.put("success", false);
            response.put("message", "查询失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    /**
     * 下发设备命令（低级接口，推荐优先使用 /actions/execute）
     *
     * POST /api/iot/devices/command?merchantId={merchantId}
     * body: {
     *   deviceNo, commandType, requestNo?,
     *   resourceId?, orderId?, payload?, timeoutSeconds?
     * }
     *
     * 支持命令：UNLOCK, LOCK, POWER_ON, POWER_OFF, STATUS_QUERY,
     *          SET_DURATION, PAUSE, RESUME
     */
    @PostMapping("/devices/command")
    public ResponseEntity<Map<String, Object>> sendCommand(
            @RequestParam Long merchantId,
            @RequestBody Map<String, Object> body) {
        Map<String, Object> response = new HashMap<>();
        try {
            String deviceNo = asText(body.get("deviceNo"));
            String commandType = asText(body.get("commandType"));

            if (deviceNo == null || deviceNo.isEmpty()) {
                return badRequest(response, "deviceNo不能为空");
            }
            if (commandType == null || commandType.isEmpty()) {
                return badRequest(response, "commandType不能为空");
            }

            // 自动生成 requestNo
            if (!body.containsKey("requestNo") || asText(body.get("requestNo")) == null) {
                String requestNo = "APP-" + deviceNo + "-" + commandType + "-" + System.currentTimeMillis();
                body.put("requestNo", requestNo);
            }

            SqdResponse sqd = sqdIotService.sendCommand(merchantId, body);
            if (sqd.isSuccess()) {
                response.put("success", true);
                response.put("message", "命令已下发");
                response.put("data", sqd.getData());
            } else {
                response.put("success", false);
                response.put("message", sqd.getMsg());
            }
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("下发设备命令失败", e);
            response.put("success", false);
            response.put("message", "命令下发失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    // ========== 设备管理（管理端使用） ==========

    /**
     * 绑定/注册 IoT 设备
     *
     * POST /api/iot/devices/bind
     */
    @PostMapping("/devices/bind")
    public ResponseEntity<Map<String, Object>> bindDevice(@RequestBody Map<String, Object> body) {
        Map<String, Object> response = new HashMap<>();
        try {
            SqdResponse sqd = sqdIotService.bindDevice(body);
            if (sqd.isSuccess()) {
                response.put("success", true);
                response.put("message", "设备绑定成功");
                response.put("data", sqd.getData());
            } else {
                response.put("success", false);
                response.put("message", sqd.getMsg());
            }
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("绑定设备失败", e);
            response.put("success", false);
            response.put("message", "绑定失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    /**
     * 解绑资源设备
     *
     * POST /api/iot/devices/unbind
     */
    @PostMapping("/devices/unbind")
    public ResponseEntity<Map<String, Object>> unbindDevice(@RequestBody Map<String, Object> body) {
        Map<String, Object> response = new HashMap<>();
        try {
            SqdResponse sqd = sqdIotService.unbindResource(body);
            if (sqd.isSuccess()) {
                response.put("success", true);
                response.put("message", "设备已解绑");
            } else {
                response.put("success", false);
                response.put("message", sqd.getMsg());
            }
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("解绑设备失败", e);
            response.put("success", false);
            response.put("message", "解绑失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    /**
     * 保存资源动作模板
     *
     * POST /api/iot/actions/templates
     */
    @PostMapping("/actions/templates")
    public ResponseEntity<Map<String, Object>> saveActionTemplate(@RequestBody Map<String, Object> body) {
        Map<String, Object> response = new HashMap<>();
        try {
            SqdResponse sqd = sqdIotService.saveActionTemplate(body);
            if (sqd.isSuccess()) {
                response.put("success", true);
                response.put("message", "模板已保存");
                response.put("data", sqd.getData());
            } else {
                response.put("success", false);
                response.put("message", sqd.getMsg());
            }
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("保存动作模板失败", e);
            response.put("success", false);
            response.put("message", "保存失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    // ========== 工具方法 ==========

    private String actionTypeMessage(String actionType) {
        if (actionType == null) return "动作已执行";
        switch (actionType.toUpperCase()) {
            case "START_USAGE": return "开锁成功，请进入房间";
            case "END_USAGE": return "已结束使用";
            case "PAUSE_USAGE": return "已暂停";
            case "RESUME_USAGE": return "已恢复";
            case "MANUAL_OPEN": return "门已打开";
            case "CLEANING_OPEN": return "清洁开门成功";
            default: return "动作已执行";
        }
    }

    private ResponseEntity<Map<String, Object>> badRequest(Map<String, Object> response, String message) {
        response.put("success", false);
        response.put("message", message);
        return ResponseEntity.ok(response);
    }

    private Long asLong(Object value) {
        if (value == null) return null;
        if (value instanceof Number) return ((Number) value).longValue();
        try {
            String text = value.toString().trim();
            return text.isEmpty() ? null : Long.parseLong(text);
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private String asText(Object value) {
        if (value == null) return null;
        String text = value.toString().trim();
        return text.isEmpty() ? null : text;
    }
}
