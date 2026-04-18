package com.easyjoylife.controller;

import com.easyjoylife.sqd.SqdBookingService;
import com.easyjoylife.sqd.SqdResourceService;
import com.easyjoylife.sqd.SqdResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * 房间/资源控制器 - 数据来源：商起点开放平台（可预订资源 + 预约）
 */
@Slf4j
@RestController
@RequestMapping("/api/rooms")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class RoomController {

    private final SqdResourceService sqdResourceService;
    private final SqdBookingService sqdBookingService;

    /**
     * 获取商户下的房间（资源）列表
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> listRooms(
            @RequestParam Long merchantId,
            @RequestParam(defaultValue = "1") Integer pageNo,
            @RequestParam(defaultValue = "20") Integer pageSize) {
        Map<String, Object> response = new HashMap<>();
        try {
            SqdResponse sqd = sqdResourceService.listResources(merchantId, pageNo, pageSize);
            if (sqd.isSuccess()) {
                response.put("success", true);
                response.put("data", sqd.getData());
            } else {
                response.put("success", false);
                response.put("message", sqd.getMsg());
            }
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("获取房间列表失败", e);
            response.put("success", false);
            response.put("message", "获取房间列表失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    /**
     * 获取房间详情
     */
    @GetMapping("/{resourceId}")
    public ResponseEntity<Map<String, Object>> getRoom(
            @PathVariable Long resourceId,
            @RequestParam Long merchantId) {
        Map<String, Object> response = new HashMap<>();
        try {
            SqdResponse sqd = sqdResourceService.getResource(resourceId, merchantId);
            if (sqd.isSuccess()) {
                response.put("success", true);
                response.put("data", sqd.getData());
            } else {
                response.put("success", false);
                response.put("message", sqd.getMsg());
            }
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("获取房间详情失败: resourceId={}", resourceId, e);
            response.put("success", false);
            response.put("message", "获取房间详情失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    /**
     * 查询房间可用性
     */
    @GetMapping("/{resourceId}/availability")
    public ResponseEntity<Map<String, Object>> getAvailability(
            @PathVariable Long resourceId,
            @RequestParam Long merchantId,
            @RequestParam String date) {
        Map<String, Object> response = new HashMap<>();
        try {
            SqdResponse sqd = sqdResourceService.getAvailability(resourceId, merchantId, date);
            if (sqd.isSuccess()) {
                response.put("success", true);
                response.put("data", sqd.getData());
            } else {
                response.put("success", false);
                response.put("message", sqd.getMsg());
            }
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("查询房间可用性失败: resourceId={}", resourceId, e);
            response.put("success", false);
            response.put("message", "查询可用性失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    /**
     * 查询可用预约时间段
     */
    @GetMapping("/booking/available-slots")
    public ResponseEntity<Map<String, Object>> availableSlots(
            @RequestParam Long merchantId,
            @RequestParam(required = false) Long resourceId,
            @RequestParam(required = false) String date) {
        Map<String, Object> response = new HashMap<>();
        try {
            SqdResponse sqd = sqdBookingService.availableSlots(merchantId, resourceId, date);
            if (sqd.isSuccess()) {
                response.put("success", true);
                response.put("data", sqd.getData());
            } else {
                response.put("success", false);
                response.put("message", sqd.getMsg());
            }
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("查询可用时间段失败", e);
            response.put("success", false);
            response.put("message", "查询可用时间段失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    /**
     * 创建预约
     */
    @PostMapping("/booking")
    public ResponseEntity<Map<String, Object>> createBooking(@RequestBody Map<String, Object> body) {
        Map<String, Object> response = new HashMap<>();
        try {
            SqdResponse sqd = sqdBookingService.createBooking(body);
            if (sqd.isSuccess()) {
                response.put("success", true);
                response.put("message", "预约成功");
                response.put("data", sqd.getData());
            } else {
                response.put("success", false);
                response.put("message", sqd.getMsg());
            }
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("创建预约失败", e);
            response.put("success", false);
            response.put("message", "创建预约失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    /**
     * 查询预约列表
     */
    @GetMapping("/booking/list")
    public ResponseEntity<Map<String, Object>> listBookings(
            @RequestParam Long merchantId,
            @RequestParam(defaultValue = "1") Integer pageNo,
            @RequestParam(defaultValue = "20") Integer pageSize) {
        Map<String, Object> response = new HashMap<>();
        try {
            SqdResponse sqd = sqdBookingService.listBookings(merchantId, pageNo, pageSize);
            if (sqd.isSuccess()) {
                response.put("success", true);
                response.put("data", sqd.getData());
            } else {
                response.put("success", false);
                response.put("message", sqd.getMsg());
            }
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("查询预约列表失败", e);
            response.put("success", false);
            response.put("message", "查询预约列表失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    /**
     * 查询预约详情
     */
    @GetMapping("/booking/{orderId}")
    public ResponseEntity<Map<String, Object>> getBooking(
            @PathVariable Long orderId,
            @RequestParam Long merchantId) {
        Map<String, Object> response = new HashMap<>();
        try {
            SqdResponse sqd = sqdBookingService.getBooking(orderId, merchantId);
            if (sqd.isSuccess()) {
                response.put("success", true);
                response.put("data", sqd.getData());
            } else {
                response.put("success", false);
                response.put("message", sqd.getMsg());
            }
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("查询预约详情失败: orderId={}", orderId, e);
            response.put("success", false);
            response.put("message", "查询预约详情失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    /**
     * 取消预约
     */
    @PostMapping("/booking/{orderId}/cancel")
    public ResponseEntity<Map<String, Object>> cancelBooking(
            @PathVariable Long orderId,
            @RequestParam Long merchantId) {
        Map<String, Object> response = new HashMap<>();
        try {
            SqdResponse sqd = sqdBookingService.cancelBooking(orderId, merchantId);
            if (sqd.isSuccess()) {
                response.put("success", true);
                response.put("message", "预约已取消");
            } else {
                response.put("success", false);
                response.put("message", sqd.getMsg());
            }
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("取消预约失败: orderId={}", orderId, e);
            response.put("success", false);
            response.put("message", "取消预约失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    /**
     * 开始服务（开台）
     */
    @PostMapping("/booking/{orderId}/start")
    public ResponseEntity<Map<String, Object>> startService(
            @PathVariable Long orderId,
            @RequestParam Long merchantId) {
        Map<String, Object> response = new HashMap<>();
        try {
            SqdResponse sqd = sqdBookingService.startService(orderId, merchantId);
            if (sqd.isSuccess()) {
                response.put("success", true);
                response.put("message", "已开台");
            } else {
                response.put("success", false);
                response.put("message", sqd.getMsg());
            }
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("开始服务失败: orderId={}", orderId, e);
            response.put("success", false);
            response.put("message", "开始服务失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    /**
     * 完成服务（结台）
     */
    @PostMapping("/booking/{orderId}/complete")
    public ResponseEntity<Map<String, Object>> completeService(
            @PathVariable Long orderId,
            @RequestParam Long merchantId) {
        Map<String, Object> response = new HashMap<>();
        try {
            SqdResponse sqd = sqdBookingService.completeService(orderId, merchantId);
            if (sqd.isSuccess()) {
                response.put("success", true);
                response.put("message", "已结台");
            } else {
                response.put("success", false);
                response.put("message", sqd.getMsg());
            }
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("完成服务失败: orderId={}", orderId, e);
            response.put("success", false);
            response.put("message", "完成服务失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    /**
     * 资源统计
     */
    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> statistics(@RequestParam Long merchantId) {
        Map<String, Object> response = new HashMap<>();
        try {
            SqdResponse sqd = sqdResourceService.statistics(merchantId);
            if (sqd.isSuccess()) {
                response.put("success", true);
                response.put("data", sqd.getData());
            } else {
                response.put("success", false);
                response.put("message", sqd.getMsg());
            }
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("获取资源统计失败", e);
            response.put("success", false);
            response.put("message", "获取统计失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }
}
