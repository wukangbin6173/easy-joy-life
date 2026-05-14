package com.easyjoylife.service;

import com.easyjoylife.entity.BillingOrderSnapshot;
import com.easyjoylife.repository.BillingOrderSnapshotRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class BillingOrderSnapshotService {

    private static final ZoneId CHINA_ZONE = ZoneId.of("Asia/Shanghai");
    private static final DateTimeFormatter BACKEND_TIME = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    private final BillingOrderSnapshotRepository billingOrderSnapshotRepository;

    @Transactional
    public void capturePrepaidOrder(Long merchantId, Long storeId, Long resourceId, String externalUserId,
                                    String startTime, Integer durationMinutes, Map<String, Object> sqdData) {
        Long orderId = readLong(sqdData, "id", "orderId", "billingOrderId", "billingId");
        if (orderId == null) {
            log.warn("Skip billing order snapshot because order id is missing: merchantId={}, resourceId={}, externalUserId={}",
                    merchantId, resourceId, externalUserId);
            return;
        }

        LocalDateTime bookingStartTime = parseDateTime(startTime);
        if (bookingStartTime == null) {
            log.warn("Skip billing order snapshot because startTime is invalid: orderId={}, startTime={}", orderId, startTime);
            return;
        }

        Integer safeDuration = durationMinutes != null && durationMinutes > 0 ? durationMinutes : null;
        LocalDateTime bookingEndTime = safeDuration != null ? bookingStartTime.plusMinutes(safeDuration) : null;

        BillingOrderSnapshot snapshot = billingOrderSnapshotRepository.findByOrderId(orderId)
                .orElseGet(BillingOrderSnapshot::new);
        snapshot.setOrderId(orderId);
        snapshot.setOrderNo(readText(sqdData, "orderNo", "orderNumber"));
        snapshot.setMerchantId(merchantId);
        snapshot.setStoreId(storeId);
        snapshot.setResourceId(resourceId);
        snapshot.setExternalUserId(externalUserId);
        snapshot.setBookingStartTime(bookingStartTime);
        snapshot.setBookingEndTime(bookingEndTime);
        snapshot.setDurationMinutes(safeDuration);
        billingOrderSnapshotRepository.save(snapshot);
    }

    @Transactional(readOnly = true)
    public void normalizeForClient(Object payload) {
        if (payload instanceof Map) {
            normalizeMap(castMap(payload));
        } else if (payload instanceof Iterable) {
            for (Object item : (Iterable<?>) payload) {
                normalizeForClient(item);
            }
        }
    }

    private void normalizeMap(Map<String, Object> map) {
        applyStatusCompatibility(map);
        applyPayExpireCompatibility(map);
        applySnapshot(map);

        normalizeForClient(map.get("data"));
        normalizeForClient(map.get("order"));
        normalizeForClient(map.get("list"));
        normalizeForClient(map.get("records"));
        normalizeForClient(map.get("rows"));
        normalizeForClient(map.get("items"));
        normalizeForClient(map.get("content"));
        normalizeForClient(map.get("orders"));
    }

    private void applyStatusCompatibility(Map<String, Object> map) {
        Integer status = readInteger(map, "status");
        if (status == null) {
            return;
        }
        String alias = statusAlias(status);
        if (alias == null) {
            return;
        }
        map.put("orderStatus", alias);
        map.put("payStatus", alias);
        map.put("tradeStatus", alias);
    }

    private void applyPayExpireCompatibility(Map<String, Object> map) {
        if (hasAnyValue(map, "payExpireAt", "payExpireTime", "paymentExpireAt", "paymentExpireTime")) {
            return;
        }

        Object deadline = firstValue(map, "paymentDeadline", "payDeadline", "cashierExpireTime", "cashierExpireAt");
        LocalDateTime expireTime = parseDateTime(deadline);
        if (expireTime == null) {
            LocalDateTime createTime = parseDateTime(firstValue(map, "createTime", "createdAt", "createdTime", "orderTime"));
            if (createTime != null) {
                expireTime = createTime.plusMinutes(15);
            }
        }
        if (expireTime == null) {
            return;
        }

        String formatted = format(expireTime);
        map.put("payExpireAt", formatted);
        map.put("payExpireTime", formatted);
        map.put("paymentExpireAt", formatted);
        map.put("paymentExpireTime", formatted);
    }

    private void applySnapshot(Map<String, Object> map) {
        Long orderId = readLong(map, "id", "orderId", "billingOrderId", "billingId");
        if (orderId == null) {
            return;
        }

        billingOrderSnapshotRepository.findByOrderId(orderId).ifPresent(snapshot -> {
            map.put("bookingStartTime", format(snapshot.getBookingStartTime()));
            map.put("startTime", format(snapshot.getBookingStartTime()));
            if (snapshot.getBookingEndTime() != null) {
                map.put("bookingEndTime", format(snapshot.getBookingEndTime()));
                map.put("endTime", format(snapshot.getBookingEndTime()));
            }
            if (snapshot.getDurationMinutes() != null) {
                map.put("bookingDuration", snapshot.getDurationMinutes());
                map.put("durationMinutes", snapshot.getDurationMinutes());
            }
            map.put("bookingTimeSource", "LOCAL_REQUEST");
        });
    }

    private String statusAlias(int status) {
        switch (status) {
            case 0:
                return "UNPAID";
            case 10:
                return "WAIT_USE";
            case 20:
            case 30:
                return "USING";
            case 40:
                return "COMPLETED";
            case 50:
                return "REFUNDING";
            case 55:
                return "REFUNDED";
            case 60:
                return "CANCELLED";
            default:
                return null;
        }
    }

    private String format(LocalDateTime value) {
        return value == null ? null : value.format(BACKEND_TIME);
    }

    private LocalDateTime parseDateTime(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }

        String text = value.trim();
        if (text.matches("\\d+")) {
            long raw = Long.parseLong(text);
            long millis = raw < 10_000_000_000L ? raw * 1000L : raw;
            return Instant.ofEpochMilli(millis).atZone(CHINA_ZONE).toLocalDateTime();
        }

        String normalized = text.replace(' ', 'T');
        if (normalized.length() == 16) {
            normalized = normalized + ":00";
        }
        try {
            return LocalDateTime.parse(normalized);
        } catch (Exception e) {
            log.warn("Unable to parse billing order time: {}", value);
            return null;
        }
    }

    private LocalDateTime parseDateTime(Object value) {
        if (value instanceof Number) {
            long raw = ((Number) value).longValue();
            long millis = raw < 10_000_000_000L ? raw * 1000L : raw;
            return Instant.ofEpochMilli(millis).atZone(CHINA_ZONE).toLocalDateTime();
        }
        return value == null ? null : parseDateTime(value.toString());
    }

    private boolean hasAnyValue(Map<String, Object> map, String... keys) {
        return firstValue(map, keys) != null;
    }

    private Object firstValue(Map<String, Object> map, String... keys) {
        if (map == null) {
            return null;
        }
        for (String key : keys) {
            Object value = map.get(key);
            if (value != null && !value.toString().trim().isEmpty()) {
                return value;
            }
        }
        return null;
    }

    private Integer readInteger(Map<String, Object> map, String key) {
        Object value = map == null ? null : map.get(key);
        if (value instanceof Number) {
            return ((Number) value).intValue();
        }
        if (value == null || value.toString().trim().isEmpty()) {
            return null;
        }
        try {
            return Integer.valueOf(value.toString().trim());
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private Long readLong(Map<String, Object> map, String... keys) {
        if (map == null) {
            return null;
        }
        for (String key : keys) {
            Object value = map.get(key);
            if (value instanceof Number) {
                return ((Number) value).longValue();
            }
            if (value != null && !value.toString().trim().isEmpty()) {
                try {
                    return Long.valueOf(value.toString().trim());
                } catch (NumberFormatException ignored) {
                    // Try the next candidate.
                }
            }
        }
        return null;
    }

    private String readText(Map<String, Object> map, String... keys) {
        if (map == null) {
            return null;
        }
        for (String key : keys) {
            Object value = map.get(key);
            if (value != null && !value.toString().trim().isEmpty()) {
                return value.toString().trim();
            }
        }
        return null;
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> castMap(Object payload) {
        return (Map<String, Object>) payload;
    }
}
