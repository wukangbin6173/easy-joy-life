package com.easyjoylife.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.easyjoylife.sqd.SqdBookingConfigService;
import com.easyjoylife.sqd.SqdBookingService;
import com.easyjoylife.sqd.SqdResourceService;
import com.easyjoylife.sqd.SqdResponse;
import com.easyjoylife.service.OrderCancelLimitService;
import com.easyjoylife.service.BookingGuardService;
import com.fasterxml.jackson.core.type.TypeReference;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
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
    private final SqdBookingConfigService sqdBookingConfigService;
    private final OrderCancelLimitService orderCancelLimitService;
    private final BookingGuardService bookingGuardService;
    private final ObjectMapper objectMapper;

    /**
     * 获取门店预约总开关配置
     * status: 0=开启预约, 1=关闭预约
     */
    @GetMapping("/booking-config")
    public ResponseEntity<Map<String, Object>> getBookingConfig(
            @RequestParam Long storeId) {
        Map<String, Object> response = new HashMap<>();
        try {
            SqdResponse sqd = sqdBookingConfigService.getBookingConfig(storeId);
            if (sqd.isSuccess()) {
                response.put("success", true);
                response.put("data", sqd.getData());
            } else {
                response.put("success", false);
                response.put("message", sqd.getMsg());
            }
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("获取门店预约配置失败: storeId={}", storeId, e);
            response.put("success", false);
            response.put("message", "获取门店预约配置失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    /**
     * 更新门店预约总开关配置
     * status: 0=开启预约, 1=关闭预约
     */
    @PutMapping("/booking-config")
    public ResponseEntity<Map<String, Object>> updateBookingConfig(
            @RequestBody Map<String, Object> body) {
        Map<String, Object> response = new HashMap<>();
        try {
            Map<String, Object> requestBody = safeBody(body);
            Integer status = asInteger(requestBody.get("status"));
            if (status == null) {
                throw new IllegalArgumentException("请指定预约总开关状态（0-开启 1-关闭）");
            }
            if (status != 0 && status != 1) {
                throw new IllegalArgumentException("预约总开关状态只能为0（开启）或1（关闭）");
            }

            SqdResponse sqd = sqdBookingConfigService.updateBookingConfig(requestBody);
            if (sqd.isSuccess()) {
                response.put("success", true);
                response.put("message", status == 0 ? "门店预约已开启" : "门店预约已关闭");
                response.put("data", sqd.getData());
            } else {
                response.put("success", false);
                response.put("message", sqd.getMsg());
            }
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("更新门店预约配置失败", e);
            response.put("success", false);
            response.put("message", "更新门店预约配置失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    /**
     * 获取商户下的房间（资源）列表
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> listRooms(
            @RequestParam(required = false) Long merchantId,
            @RequestParam(required = false) Long storeId,
            @RequestParam(defaultValue = "1") Integer pageNo,
            @RequestParam(defaultValue = "20") Integer pageSize) {
        Map<String, Object> response = new HashMap<>();
        try {
            SqdResponse sqd = sqdResourceService.listResources(merchantId, storeId, pageNo, pageSize);
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
            @RequestParam(required = false) Long storeId,
            @RequestParam(required = false) Long resourceId,
            @RequestParam(required = false) Long resourceTypeId,
            @RequestParam(required = false) String bookingDate,
            @RequestParam(required = false) String date,
            @RequestParam(required = false) Integer durationMinutes,
            @RequestParam(required = false) Integer slotStepMinutes) {
        Map<String, Object> response = new HashMap<>();
        try {
            String resolvedBookingDate = firstText(bookingDate, date);
            if (resolvedBookingDate == null) {
                response.put("success", false);
                response.put("message", "请选择预约日期");
                return ResponseEntity.ok(response);
            }

            SqdResponse sqd = sqdBookingService.availableSlots(
                    merchantId, storeId, resourceId, resourceTypeId,
                    resolvedBookingDate, durationMinutes, slotStepMinutes);
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
            Long merchantId = asLong(body.get("merchantId"));
            Long resourceId = asLong(firstText(body.get("resourceId"), body.get("roomId")));
            Long storeId = asLong(body.get("storeId"));
            String startTime = firstText(body.get("bookingStartTime"), body.get("startTime"), body.get("startAt"));
            String endTime = firstText(body.get("bookingEndTime"), body.get("endTime"), body.get("endAt"));
            Integer durationMinutes = asInteger(firstText(
                    body.get("durationMinutes"), body.get("durationMinute"), body.get("minutes")));
            if (durationMinutes == null) {
                durationMinutes = bookingGuardService.durationMinutesBetween(startTime, endTime);
            }

            if (merchantId != null && resourceId != null) {
                // 先校验门店总开关
                if (storeId != null) {
                    SqdResponse storeGuard = bookingGuardService.validateStoreBookingEnabled(storeId);
                    if (!storeGuard.isSuccess()) {
                        response.put("success", false);
                        response.put("message", storeGuard.getMsg());
                        return ResponseEntity.ok(response);
                    }
                }

                SqdResponse resourceGuard = bookingGuardService.validateResourceBookable(merchantId, resourceId);
                if (!resourceGuard.isSuccess()) {
                    response.put("success", false);
                    response.put("message", resourceGuard.getMsg());
                    return ResponseEntity.ok(response);
                }

                if (startTime != null && durationMinutes != null) {
                    SqdResponse slotGuard = bookingGuardService.validateAvailableSlot(
                            merchantId, storeId, resourceId, startTime, durationMinutes);
                    if (!slotGuard.isSuccess()) {
                        response.put("success", false);
                        response.put("message", slotGuard.getMsg());
                        return ResponseEntity.ok(response);
                    }
                }
            }

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
            @RequestParam Long merchantId,
            @RequestParam(required = false) String externalUserId) {
        Map<String, Object> response = new HashMap<>();
        try {
            String resolvedExternalUserId = resolveExternalUserId(orderId, merchantId, externalUserId);
            if (resolvedExternalUserId == null || resolvedExternalUserId.trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "无法确认用户身份，请重新进入订单页后再试");
                return ResponseEntity.ok(response);
            }

            OrderCancelLimitService.LimitStatus activeLimit =
                    orderCancelLimitService.getActiveLimit(resolvedExternalUserId);
            if (activeLimit.isLimited()) {
                return ResponseEntity.ok(buildCancelLimitedResponse(activeLimit));
            }

            SqdResponse sqd = sqdBookingService.cancelBooking(orderId, merchantId);
            if (sqd.isSuccess()) {
                response.put("success", true);
                response.put("message", "预约已取消");
                OrderCancelLimitService.LimitStatus afterCancel =
                        orderCancelLimitService.recordUserCancel(
                                resolvedExternalUserId, orderId, merchantId, "用户取消预约");
                if (afterCancel.isLimited()) {
                    response.put("cancelLimit", buildCancelLimitData(afterCancel));
                }
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
     * 设置单个房间排班。
     */
    @PutMapping("/{resourceId}/schedule")
    public ResponseEntity<Map<String, Object>> setSchedule(
            @PathVariable Long resourceId,
            @RequestParam Long merchantId,
            @RequestBody(required = false) Map<String, Object> body) {
        Map<String, Object> response = new HashMap<>();
        try {
            validatePositive(resourceId, "resourceId");
            validatePositive(merchantId, "merchantId");
            Map<String, Object> scheduleBody = normalizeScheduleBody(body);

            SqdResponse sqd = sqdResourceService.setResourceSchedule(resourceId, merchantId, scheduleBody);
            if (sqd.isSuccess()) {
                response.put("success", true);
                response.put("message", "排班已保存");
                response.put("data", sqd.getData());
            } else {
                response.put("success", false);
                response.put("message", sqd.getMsg());
            }
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("设置房间排班失败: resourceId={}", resourceId, e);
            response.put("success", false);
            response.put("message", "设置房间排班失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    /**
     * 批量设置多个房间排班。
     */
    @PostMapping("/schedules/batch")
    public ResponseEntity<Map<String, Object>> batchSetSchedule(
            @RequestBody(required = false) Map<String, Object> body) {
        Map<String, Object> response = new HashMap<>();
        try {
            Map<String, Object> requestBody = safeBody(body);
            Long merchantId = asLong(requestBody.get("merchantId"));
            validatePositive(merchantId, "merchantId");

            List<Long> resourceIds = parseLongList(requestBody.get("resourceIds"));
            if (resourceIds.isEmpty()) {
                throw new IllegalArgumentException("请选择需要排班的房间");
            }

            Map<String, Object> scheduleBody = normalizeScheduleBody(requestBody);
            List<Map<String, Object>> results = new ArrayList<>();
            int successCount = 0;

            for (Long resourceId : resourceIds) {
                Map<String, Object> item = new HashMap<>();
                item.put("resourceId", resourceId);
                try {
                    SqdResponse sqd = sqdResourceService.setResourceSchedule(resourceId, merchantId, scheduleBody);
                    boolean success = sqd.isSuccess();
                    item.put("success", success);
                    item.put("message", success ? "排班已保存" : sqd.getMsg());
                    item.put("data", sqd.getData());
                    if (success) {
                        successCount++;
                    }
                } catch (Exception e) {
                    item.put("success", false);
                    item.put("message", e.getMessage());
                }
                results.add(item);
            }

            Map<String, Object> data = new HashMap<>();
            data.put("total", resourceIds.size());
            data.put("successCount", successCount);
            data.put("failedCount", resourceIds.size() - successCount);
            data.put("results", results);

            response.put("success", successCount == resourceIds.size());
            response.put("message", successCount == resourceIds.size() ? "批量排班已保存" : "部分房间排班保存失败");
            response.put("data", data);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("批量设置房间排班失败", e);
            response.put("success", false);
            response.put("message", "批量设置房间排班失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    /**
     * 设置房间预约开关（是否接受预约）
     */
    @PutMapping("/{resourceId}/booking-switch")
    public ResponseEntity<Map<String, Object>> setBookingSwitch(
            @PathVariable Long resourceId,
            @RequestParam Long merchantId,
            @RequestBody(required = false) Map<String, Object> body) {
        Map<String, Object> response = new HashMap<>();
        try {
            validatePositive(resourceId, "resourceId");
            validatePositive(merchantId, "merchantId");

            Map<String, Object> requestBody = safeBody(body);
            Integer isAcceptBooking = asInteger(
                    firstText(requestBody.get("isAcceptBooking"), requestBody.get("acceptBooking"),
                            requestBody.get("bookingEnabled"), requestBody.get("enabled")));
            if (isAcceptBooking == null) {
                throw new IllegalArgumentException("请指定预约开关状态（0-关闭 1-开启）");
            }
            if (isAcceptBooking != 0 && isAcceptBooking != 1) {
                throw new IllegalArgumentException("预约开关状态只能为0（关闭）或1（开启）");
            }

            Map<String, Object> updateBody = new HashMap<>();
            updateBody.put("isAcceptBooking", isAcceptBooking);

            SqdResponse sqd = sqdResourceService.updateResource(resourceId, merchantId, updateBody);
            if (sqd.isSuccess()) {
                response.put("success", true);
                response.put("message", isAcceptBooking == 1 ? "已开启预约" : "已关闭预约");
                response.put("data", sqd.getData());
            } else {
                response.put("success", false);
                response.put("message", sqd.getMsg());
            }
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("设置房间预约开关失败: resourceId={}", resourceId, e);
            response.put("success", false);
            response.put("message", "设置预约开关失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    /**
     * 批量设置房间预约开关
     */
    @PostMapping("/booking-switch/batch")
    public ResponseEntity<Map<String, Object>> batchSetBookingSwitch(
            @RequestBody(required = false) Map<String, Object> body) {
        Map<String, Object> response = new HashMap<>();
        try {
            Map<String, Object> requestBody = safeBody(body);
            Long merchantId = asLong(requestBody.get("merchantId"));
            validatePositive(merchantId, "merchantId");

            List<Long> resourceIds = parseLongList(requestBody.get("resourceIds"));
            if (resourceIds.isEmpty()) {
                throw new IllegalArgumentException("请选择需要设置的房间");
            }

            Integer isAcceptBooking = asInteger(
                    firstText(requestBody.get("isAcceptBooking"), requestBody.get("acceptBooking"),
                            requestBody.get("bookingEnabled"), requestBody.get("enabled")));
            if (isAcceptBooking == null) {
                throw new IllegalArgumentException("请指定预约开关状态（0-关闭 1-开启）");
            }
            if (isAcceptBooking != 0 && isAcceptBooking != 1) {
                throw new IllegalArgumentException("预约开关状态只能为0（关闭）或1（开启）");
            }

            Map<String, Object> updateBody = new HashMap<>();
            updateBody.put("isAcceptBooking", isAcceptBooking);

            List<Map<String, Object>> results = new ArrayList<>();
            int successCount = 0;

            for (Long resourceId : resourceIds) {
                Map<String, Object> item = new HashMap<>();
                item.put("resourceId", resourceId);
                try {
                    SqdResponse sqd = sqdResourceService.updateResource(resourceId, merchantId, updateBody);
                    boolean success = sqd.isSuccess();
                    item.put("success", success);
                    item.put("message", success
                            ? (isAcceptBooking == 1 ? "已开启预约" : "已关闭预约")
                            : sqd.getMsg());
                    if (success) {
                        successCount++;
                    }
                } catch (Exception e) {
                    item.put("success", false);
                    item.put("message", e.getMessage());
                }
                results.add(item);
            }

            Map<String, Object> data = new HashMap<>();
            data.put("total", resourceIds.size());
            data.put("successCount", successCount);
            data.put("failedCount", resourceIds.size() - successCount);
            data.put("results", results);

            response.put("success", successCount == resourceIds.size());
            response.put("message", successCount == resourceIds.size()
                    ? (isAcceptBooking == 1 ? "批量开启预约成功" : "批量关闭预约成功")
                    : "部分房间设置失败");
            response.put("data", data);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("批量设置房间预约开关失败", e);
            response.put("success", false);
            response.put("message", "批量设置预约开关失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    /**
     * 更新房间状态。
     */
    @PutMapping("/{resourceId}/status")
    public ResponseEntity<Map<String, Object>> updateStatus(
            @PathVariable Long resourceId,
            @RequestParam Long merchantId,
            @RequestBody(required = false) Map<String, Object> body) {
        Map<String, Object> response = new HashMap<>();
        try {
            validatePositive(resourceId, "resourceId");
            validatePositive(merchantId, "merchantId");

            Map<String, Object> requestBody = safeBody(body);
            Integer status = asInteger(requestBody.get("status"));
            if (status == null) {
                throw new IllegalArgumentException("请选择房间状态");
            }
            if (status < 0 || status > 5) {
                throw new IllegalArgumentException("房间状态必须在0到5之间");
            }

            Map<String, Object> statusBody = new HashMap<>();
            statusBody.put("status", status);
            String changeReason = firstText(requestBody.get("changeReason"), requestBody.get("reason"));
            if (changeReason != null) {
                statusBody.put("changeReason", changeReason);
            }

            SqdResponse sqd = sqdResourceService.updateResourceStatus(resourceId, merchantId, statusBody);
            if (sqd.isSuccess()) {
                response.put("success", true);
                response.put("message", "房间状态已更新");
                response.put("data", sqd.getData());
            } else {
                response.put("success", false);
                response.put("message", sqd.getMsg());
            }
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("更新房间状态失败: resourceId={}", resourceId, e);
            response.put("success", false);
            response.put("message", "更新房间状态失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    private Map<String, Object> normalizeScheduleBody(Map<String, Object> body) {
        Map<String, Object> source = extractSchedulePayload(safeBody(body));
        Map<String, Object> schedule = new HashMap<>();
        copyIfPresent(source, schedule, "scheduleType");
        copyIfPresent(source, schedule, "dayOfWeek");
        copyIfPresent(source, schedule, "scheduleDate");
        copyIfPresent(source, schedule, "timeSlots");
        copyIfPresent(source, schedule, "isRestDay");
        copyIfPresent(source, schedule, "remark");
        copyIfPresent(source, schedule, "isEnabled");

        Integer isRestDay = asInteger(schedule.get("isRestDay"));
        if (isRestDay == null) {
            isRestDay = 0;
        }
        schedule.put("isRestDay", isRestDay);

        Integer isEnabled = asInteger(schedule.get("isEnabled"));
        schedule.put("isEnabled", isEnabled == null ? 1 : isEnabled);

        Integer scheduleType = asInteger(schedule.get("scheduleType"));
        if (scheduleType == null) {
            scheduleType = firstText(schedule.get("scheduleDate")) == null ? 1 : 2;
        }
        schedule.put("scheduleType", scheduleType);

        Integer dayOfWeek = asInteger(schedule.get("dayOfWeek"));
        String scheduleDate = firstText(schedule.get("scheduleDate"));
        if (dayOfWeek == null && scheduleDate == null) {
            throw new IllegalArgumentException("请指定星期或排班日期");
        }
        if (dayOfWeek != null) {
            if (dayOfWeek < 1 || dayOfWeek > 7) {
                throw new IllegalArgumentException("星期必须在1到7之间");
            }
            schedule.put("dayOfWeek", dayOfWeek);
        }
        if (scheduleDate != null) {
            schedule.put("scheduleDate", scheduleDate);
        }

        Object timeSlots = schedule.get("timeSlots");
        if (isRestDay == 1) {
            schedule.put("timeSlots", normalizeTimeSlots(timeSlots, true));
        } else {
            String normalizedTimeSlots = normalizeTimeSlots(timeSlots, false);
            if (normalizedTimeSlots == null || normalizedTimeSlots.trim().isEmpty() || "[]".equals(normalizedTimeSlots.trim())) {
                throw new IllegalArgumentException("请至少设置一个营业时间段");
            }
            schedule.put("timeSlots", normalizedTimeSlots);
        }
        return schedule;
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> extractSchedulePayload(Map<String, Object> body) {
        Object schedule = body.get("schedule");
        if (schedule instanceof Map) {
            return (Map<String, Object>) schedule;
        }
        return body;
    }

    private Map<String, Object> safeBody(Map<String, Object> body) {
        return body == null ? new HashMap<>() : body;
    }

    private void copyIfPresent(Map<String, Object> source, Map<String, Object> target, String key) {
        if (source.containsKey(key)) {
            target.put(key, source.get(key));
        }
    }

    private String normalizeTimeSlots(Object timeSlots, boolean restDay) {
        if (timeSlots == null) {
            return restDay ? "[]" : null;
        }
        if (timeSlots instanceof String) {
            String text = ((String) timeSlots).trim();
            if (text.isEmpty()) {
                return restDay ? "[]" : text;
            }
            if (text.startsWith("[")) {
                try {
                    Object parsed = objectMapper.readValue(text, new TypeReference<List<Map<String, Object>>>() {});
                    return objectMapper.writeValueAsString(normalizeTimeSlotPayload(parsed));
                } catch (Exception e) {
                    return text;
                }
            }
            return text;
        }
        try {
            return objectMapper.writeValueAsString(normalizeTimeSlotPayload(timeSlots));
        } catch (Exception e) {
            throw new IllegalArgumentException("时间段格式不正确");
        }
    }

    private Object normalizeTimeSlotPayload(Object timeSlots) {
        if (timeSlots instanceof Iterable) {
            List<Map<String, Object>> normalized = new ArrayList<>();
            for (Object item : (Iterable<?>) timeSlots) {
                Map<String, Object> slot = normalizeTimeSlotItem(item);
                if (!slot.isEmpty()) {
                    normalized.add(slot);
                }
            }
            return normalized;
        }
        return timeSlots;
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> normalizeTimeSlotItem(Object item) {
        Map<String, Object> normalized = new HashMap<>();
        if (!(item instanceof Map)) {
            return normalized;
        }

        Map<String, Object> slot = (Map<String, Object>) item;
        String start = firstText(slot.get("start"), slot.get("startTime"));
        String end = firstText(slot.get("end"), slot.get("endTime"));
        if (start != null) {
            normalized.put("start", start);
        }
        if (end != null) {
            normalized.put("end", end);
        }
        slot.forEach((key, value) -> {
            if (!"start".equals(key) && !"startTime".equals(key)
                    && !"end".equals(key) && !"endTime".equals(key)) {
                normalized.put(key, value);
            }
        });
        return normalized;
    }

    private List<Long> parseLongList(Object value) {
        List<Long> result = new ArrayList<>();
        if (value == null) {
            return result;
        }
        if (value instanceof Iterable) {
            for (Object item : (Iterable<?>) value) {
                Long parsed = asLong(item);
                if (parsed != null) {
                    result.add(parsed);
                }
            }
            return result;
        }
        if (value.getClass().isArray()) {
            Object[] items = (Object[]) value;
            for (Object item : items) {
                Long parsed = asLong(item);
                if (parsed != null) {
                    result.add(parsed);
                }
            }
            return result;
        }
        String text = value.toString().trim();
        if (!text.isEmpty()) {
            for (String item : text.split(",")) {
                Long parsed = asLong(item);
                if (parsed != null) {
                    result.add(parsed);
                }
            }
        }
        return result;
    }

    private Long asLong(Object value) {
        if (value == null) {
            return null;
        }
        if (value instanceof Number) {
            return ((Number) value).longValue();
        }
        try {
            String text = value.toString().trim();
            return text.isEmpty() ? null : Long.parseLong(text);
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private Integer asInteger(Object value) {
        if (value == null) {
            return null;
        }
        if (value instanceof Number) {
            return ((Number) value).intValue();
        }
        try {
            String text = value.toString().trim();
            return text.isEmpty() ? null : Integer.parseInt(text);
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private void validatePositive(Long value, String fieldName) {
        if (value == null || value <= 0) {
            throw new IllegalArgumentException(fieldName + "不能为空");
        }
    }

    private String resolveExternalUserId(Long orderId, Long merchantId, String externalUserId) {
        if (externalUserId != null && !externalUserId.trim().isEmpty()) {
            return externalUserId.trim();
        }

        SqdResponse booking = sqdBookingService.getBooking(orderId, merchantId);
        Map<String, Object> bookingData = booking.isSuccess() ? booking.getDataAsMap() : null;
        return firstText(findDeepValue(bookingData, "externalUserId"), findDeepValue(bookingData, "userId"));
    }

    private Map<String, Object> buildCancelLimitedResponse(OrderCancelLimitService.LimitStatus limit) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("code", "CANCEL_LIMITED");
        response.put("message", limit.getMessage());
        response.put("retryAfterSeconds", limit.getRetryAfterSeconds());
        if (limit.getLockUntil() != null) {
            response.put("limitedUntil", limit.getLockUntil().toString());
        }
        return response;
    }

    private Map<String, Object> buildCancelLimitData(OrderCancelLimitService.LimitStatus limit) {
        Map<String, Object> data = new HashMap<>();
        data.put("limited", limit.isLimited());
        data.put("message", limit.getMessage());
        data.put("retryAfterSeconds", limit.getRetryAfterSeconds());
        if (limit.getLockUntil() != null) {
            data.put("limitedUntil", limit.getLockUntil().toString());
        }
        return data;
    }

    @SuppressWarnings("unchecked")
    private Object findDeepValue(Object source, String key) {
        if (source instanceof Map) {
            Map<String, Object> map = (Map<String, Object>) source;
            Object direct = map.get(key);
            if (direct != null && !direct.toString().trim().isEmpty()) {
                return direct;
            }
            for (Object value : map.values()) {
                Object found = findDeepValue(value, key);
                if (found != null) {
                    return found;
                }
            }
        } else if (source instanceof Iterable) {
            for (Object value : (Iterable<?>) source) {
                Object found = findDeepValue(value, key);
                if (found != null) {
                    return found;
                }
            }
        }
        return null;
    }

    private String firstText(Object... values) {
        for (Object value : values) {
            if (value != null && !value.toString().trim().isEmpty()) {
                return value.toString().trim();
            }
        }
        return null;
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
