package com.easyjoylife.service;

import com.easyjoylife.sqd.SqdBookingConfigService;
import com.easyjoylife.sqd.SqdBookingService;
import com.easyjoylife.sqd.SqdResourceService;
import com.easyjoylife.sqd.SqdResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Booking safety checks before creating an order in Shangqidian.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class BookingGuardService {

    private static final Pattern TIME_PATTERN = Pattern.compile("(?:T|\\b)(\\d{1,2}):(\\d{2})");
    private static final List<Integer> BLOCKED_RESOURCE_STATUS = Arrays.asList(3, 4, 5);
    private static final List<Integer> BLOCKED_ROOM_STATUS = Arrays.asList(3, 4, 5);
    private static final List<String> SLOT_LIST_KEYS = Arrays.asList(
            "availableSlots", "slots", "timeSlots", "list", "records", "items", "rows", "timeline", "data", "result", "page");

    private final SqdResourceService sqdResourceService;
    private final SqdBookingService sqdBookingService;
    private final SqdBookingConfigService sqdBookingConfigService;

    public SqdResponse validateResourceAndSlot(Long merchantId, Long storeId, Long resourceId,
                                               String startTime, Integer durationMinutes) {
        if (storeId != null) {
            SqdResponse storeBooking = validateStoreBookingEnabled(storeId);
            if (!storeBooking.isSuccess()) {
                return storeBooking;
            }
        }
        SqdResponse resource = validateResourceBookable(merchantId, resourceId);
        if (!resource.isSuccess()) {
            return resource;
        }
        return validateAvailableSlot(merchantId, storeId, resourceId, startTime, durationMinutes);
    }

    /**
     * 校验门店预约总开关是否开启
     */
    public SqdResponse validateStoreBookingEnabled(Long storeId) {
        if (storeId == null) {
            return success("no storeId, skip store booking check");
        }
        try {
            SqdResponse configResp = sqdBookingConfigService.getBookingConfig(storeId);
            if (!configResp.isSuccess()) {
                // 获取配置失败时不阻断，让商起点后端做最终校验
                return success("config fetch skipped");
            }
            Integer status = asInteger(findDeepValueAny(configResp.getData(), "status"));
            // status=1 表示关闭预约
            if (status != null && status == 1) {
                return SqdResponse.error("该门店已关闭预约功能");
            }
        } catch (Exception e) {
            // 异常时不阻断
            log.warn("校验门店预约总开关异常: storeId={}", storeId, e);
        }
        return success("store booking enabled");
    }

    public SqdResponse validateResourceBookable(Long merchantId, Long resourceId) {
        if (merchantId == null || resourceId == null) {
            return SqdResponse.error("缺少商户或资源信息");
        }

        SqdResponse resource = sqdResourceService.getResource(resourceId, merchantId);
        if (!resource.isSuccess()) {
            return SqdResponse.error("房间状态校验失败: " + cleanMessage(resource.getMsg()));
        }

        String blockedReason = getResourceBlockedReason(resource.getData());
        if (blockedReason != null) {
            return SqdResponse.error(blockedReason);
        }
        return success("resource ok");
    }

    public SqdResponse validateAvailableSlot(Long merchantId, Long storeId, Long resourceId,
                                             String startTime, Integer durationMinutes) {
        if (merchantId == null || resourceId == null) {
            return SqdResponse.error("缺少商户或资源信息");
        }
        if (startTime == null || startTime.trim().isEmpty()) {
            return SqdResponse.error("请选择开始时间");
        }
        if (durationMinutes == null || durationMinutes <= 0) {
            return SqdResponse.error("预约时长无效");
        }

        String bookingDate = readBookingDate(startTime);
        if (bookingDate == null) {
            return SqdResponse.error("预约日期格式不正确");
        }

        SqdResponse slotsResponse = sqdBookingService.availableSlots(
                merchantId, storeId, resourceId, null, bookingDate, durationMinutes, durationMinutes);
        if (!slotsResponse.isSuccess()) {
            return SqdResponse.error("可约时间校验失败: " + cleanMessage(slotsResponse.getMsg()));
        }

        List<Map<String, Object>> slots = extractSlotMaps(slotsResponse.getData());
        if (slots.isEmpty()) {
            return SqdResponse.error("该日期暂无可预约时间");
        }

        int requestedStart = parseMinutes(startTime);
        if (requestedStart < 0) {
            return SqdResponse.error("预约开始时间格式不正确");
        }
        int requestedEnd = requestedStart + durationMinutes;
        for (Map<String, Object> slot : slots) {
            if (!isSlotAvailable(slot)) {
                continue;
            }
            int slotStart = parseMinutes(firstValue(slot, "startTime", "start", "beginTime", "begin", "time", "slotTime"));
            if (slotStart < 0) {
                continue;
            }
            int slotEnd = parseMinutes(firstValue(slot, "endTime", "end", "finishTime", "finish", "endAt"));
            if (slotEnd <= slotStart) {
                slotEnd = slotStart + durationMinutes;
            }
            if (slotStart <= requestedStart && slotEnd >= requestedEnd) {
                return success("slot ok");
            }
        }

        return SqdResponse.error("该时间段不可预约，请重新选择");
    }

    public Integer durationMinutesBetween(String startTime, String endTime) {
        int start = parseMinutes(startTime);
        int end = parseMinutes(endTime);
        if (start < 0 || end < 0) {
            return null;
        }
        if (end <= start) {
            end += 24 * 60;
        }
        return end - start;
    }

    private String getResourceBlockedReason(Object data) {
        if (isOffFlag(findDeepValueAny(data, "isAcceptBooking", "acceptBooking", "bookingEnabled"))) {
            return "该房间未开启预约";
        }
        if (isOffFlag(findDeepValueAny(data, "isEnabled", "enabled"))) {
            return "该房间已停用";
        }
        if (isOffFlag(findDeepValueAny(data, "isShowInApp", "showInApp"))) {
            return "该房间未上架";
        }

        Integer status = asInteger(findDeepValueAny(data, "status", "resourceStatus", "state", "statusCode", "resourceStatusCode"));
        if (status != null && BLOCKED_RESOURCE_STATUS.contains(status)) {
            if (status == 3) return "该房间维护中，暂不可预约";
            if (status == 4) return "该房间已停用，暂不可预约";
            if (status == 5) return "该房间休息中，暂不可预约";
            return "该房间状态不可预约";
        }

        Integer roomStatus = asInteger(findDeepValueAny(data, "roomStatus", "roomStatusCode", "cleanStatus", "cleaningStatus", "cleanState"));
        if (roomStatus != null && BLOCKED_ROOM_STATUS.contains(roomStatus)) {
            if (roomStatus == 3) return "该房间待打扫，暂不可预约";
            return "该房间状态不可预约";
        }

        String statusText = collectText(data,
                "statusText", "statusName", "statusDesc", "statusLabel",
                "resourceStatusText", "resourceStatusName", "resourceStatusDesc",
                "roomStatusText", "roomStatusName",
                "stateText", "stateName",
                "cleanStatusText", "cleanStatusName",
                "cleaningStatusText", "cleaningStatusName",
                "availableStatus", "availabilityStatus", "bookingStatusText");
        String lower = statusText.toLowerCase();
        if (containsAny(lower, "待打扫", "待清洁", "清洁", "保洁", "clean")) {
            return "该房间待打扫，暂不可预约";
        }
        if (containsAny(lower, "维护", "维修", "maintain", "repair")) {
            return "该房间维护中，暂不可预约";
        }
        if (containsAny(lower, "停用", "关闭", "下架", "禁用", "不可约", "不可用", "disabled", "closed", "unavailable")) {
            return "该房间暂不可预约";
        }
        if (containsAny(lower, "休息", "rest")) {
            return "该房间休息中，暂不可预约";
        }
        return null;
    }

    private List<Map<String, Object>> extractSlotMaps(Object data) {
        List<Map<String, Object>> slots = new ArrayList<>();
        collectSlots(data, slots, 0);
        return slots;
    }

    @SuppressWarnings("unchecked")
    private void collectSlots(Object source, List<Map<String, Object>> slots, int depth) {
        if (source == null || depth > 8) {
            return;
        }
        if (source instanceof Iterable) {
            for (Object item : (Iterable<?>) source) {
                collectSlots(item, slots, depth + 1);
            }
            return;
        }
        if (source instanceof String || source instanceof Number) {
            Map<String, Object> slot = new HashMap<>();
            slot.put("startTime", source);
            slots.add(slot);
            return;
        }
        if (!(source instanceof Map)) {
            return;
        }

        Map<String, Object> map = (Map<String, Object>) source;
        if (hasAnyKey(map, "startTime", "start", "beginTime", "begin", "time", "slotTime")) {
            slots.add(map);
            return;
        }

        boolean foundKnownList = false;
        for (String key : SLOT_LIST_KEYS) {
            Object value = map.get(key);
            if (value != null && value != source) {
                foundKnownList = true;
                collectSlots(value, slots, depth + 1);
            }
        }
        if (!foundKnownList) {
            for (Object value : map.values()) {
                if (value != source) {
                    collectSlots(value, slots, depth + 1);
                }
            }
        }
    }

    private boolean isSlotAvailable(Map<String, Object> slot) {
        if (isOffFlag(firstValue(slot, "available", "isAvailable", "bookable", "canBook"))) {
            return false;
        }
        Object statusValue = firstValue(slot, "status", "state", "bookingStatus", "availableStatus", "availabilityStatus", "statusText", "stateText");
        if (statusValue == null || statusValue.toString().trim().isEmpty()) {
            return true;
        }

        Integer code = asInteger(statusValue);
        if (code != null) {
            return code == 0;
        }

        String text = statusValue.toString().trim().toLowerCase();
        if (containsAny(text, "available", "free", "idle", "open", "可约", "空闲")) {
            return true;
        }
        return !containsAny(text,
                "booked", "reserved", "occupied", "using", "paid", "locked", "unavailable",
                "已约", "已预约", "已预订", "预订中", "预约中", "占用", "使用中",
                "待打扫", "待清洁", "清洁", "维护", "维修", "停用", "休息", "不可约", "不可用");
    }

    private String readBookingDate(String startTime) {
        String text = startTime == null ? "" : startTime.trim();
        if (text.length() >= 10 && text.charAt(4) == '-' && text.charAt(7) == '-') {
            return text.substring(0, 10);
        }
        return null;
    }

    private int parseMinutes(Object value) {
        if (value == null) {
            return -1;
        }
        if (value instanceof Number) {
            double number = ((Number) value).doubleValue();
            return number > 24 ? (int) Math.floor(number) : (int) Math.floor(number * 60);
        }
        Matcher matcher = TIME_PATTERN.matcher(value.toString());
        if (!matcher.find()) {
            return -1;
        }
        int hour = Integer.parseInt(matcher.group(1));
        int minute = Integer.parseInt(matcher.group(2));
        if (hour < 0 || minute < 0 || minute > 59) {
            return -1;
        }
        return hour * 60 + minute;
    }

    private boolean isOffFlag(Object value) {
        if (value == null) {
            return false;
        }
        if (value instanceof Number) {
            return ((Number) value).intValue() == 0;
        }
        if (value instanceof Boolean) {
            return !((Boolean) value);
        }
        String text = value.toString().trim();
        return "0".equals(text) || "false".equalsIgnoreCase(text)
                || "n".equalsIgnoreCase(text) || "no".equalsIgnoreCase(text);
    }

    private boolean containsAny(String text, String... keywords) {
        if (text == null || text.isEmpty()) {
            return false;
        }
        for (String keyword : keywords) {
            if (text.contains(keyword.toLowerCase())) {
                return true;
            }
        }
        return false;
    }

    private boolean hasAnyKey(Map<String, Object> map, String... keys) {
        for (String key : keys) {
            if (map.containsKey(key)) {
                return true;
            }
        }
        return false;
    }

    private Object firstValue(Map<String, Object> map, String... keys) {
        for (String key : keys) {
            Object value = map.get(key);
            if (value != null && !value.toString().trim().isEmpty()) {
                return value;
            }
        }
        return null;
    }

    private Object findDeepValueAny(Object source, String... keys) {
        for (String key : keys) {
            Object value = findDeepValue(source, key, 0);
            if (value != null && !value.toString().trim().isEmpty()) {
                return value;
            }
        }
        return null;
    }

    @SuppressWarnings("unchecked")
    private Object findDeepValue(Object source, String key, int depth) {
        if (source == null || depth > 8) {
            return null;
        }
        if (source instanceof Map) {
            Map<String, Object> map = (Map<String, Object>) source;
            Object direct = map.get(key);
            if (direct != null && !direct.toString().trim().isEmpty()) {
                return direct;
            }
            for (Object value : map.values()) {
                Object found = findDeepValue(value, key, depth + 1);
                if (found != null) {
                    return found;
                }
            }
        } else if (source instanceof Iterable) {
            for (Object value : (Iterable<?>) source) {
                Object found = findDeepValue(value, key, depth + 1);
                if (found != null) {
                    return found;
                }
            }
        }
        return null;
    }

    private String collectText(Object source, String... keys) {
        StringBuilder builder = new StringBuilder();
        for (String key : keys) {
            Object value = findDeepValue(source, key, 0);
            if (value != null && !value.toString().trim().isEmpty()) {
                builder.append(' ').append(value.toString().trim());
            }
        }
        return builder.toString();
    }

    private Integer asInteger(Object value) {
        if (value == null || value.toString().trim().isEmpty()) {
            return null;
        }
        if (value instanceof Number) {
            return ((Number) value).intValue();
        }
        try {
            return Integer.parseInt(value.toString().trim());
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private SqdResponse success(String message) {
        SqdResponse response = new SqdResponse();
        response.setCode(0);
        response.setMsg(message);
        return response;
    }

    private String cleanMessage(String msg) {
        return msg == null || msg.trim().isEmpty() ? "请稍后重试" : msg.trim();
    }
}
