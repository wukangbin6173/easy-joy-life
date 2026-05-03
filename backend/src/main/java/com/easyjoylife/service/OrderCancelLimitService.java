package com.easyjoylife.service;

import com.easyjoylife.entity.OrderCancelRecord;
import com.easyjoylife.repository.OrderCancelRecordRepository;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderCancelLimitService {

    public static final int CANCEL_WINDOW_MINUTES = 30;
    public static final int MAX_CANCELS_IN_WINDOW = 3;
    public static final int LOCK_MINUTES = 60;
    private static final String SOURCE_USER = "USER";

    private final OrderCancelRecordRepository orderCancelRecordRepository;

    public boolean isAutoCancel(String reason) {
        if (reason == null) {
            return false;
        }
        return reason.contains("自动取消") || reason.contains("支付超时");
    }

    public LimitStatus getActiveLimit(String externalUserId) {
        if (externalUserId == null || externalUserId.trim().isEmpty()) {
            return LimitStatus.allowed();
        }
        LocalDateTime now = LocalDateTime.now();
        return orderCancelRecordRepository
                .findTopByExternalUserIdAndLockUntilAfterOrderByLockUntilDesc(externalUserId.trim(), now)
                .map(record -> LimitStatus.limited(record.getLockUntil(), buildMessage(record.getLockUntil(), now)))
                .orElseGet(LimitStatus::allowed);
    }

    @Transactional
    public LimitStatus recordUserCancel(String externalUserId, Long orderId, Long merchantId, String reason) {
        String userId = externalUserId == null ? "" : externalUserId.trim();
        if (userId.isEmpty() || orderId == null) {
            return LimitStatus.allowed();
        }

        if (orderCancelRecordRepository.existsByExternalUserIdAndOrderIdAndSource(userId, orderId, SOURCE_USER)) {
            return getActiveLimit(userId);
        }

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime windowStart = now.minusMinutes(CANCEL_WINDOW_MINUTES);
        long recentCount = orderCancelRecordRepository
                .countByExternalUserIdAndSourceAndCancelledAtAfter(userId, SOURCE_USER, windowStart);

        LocalDateTime lockUntil = null;
        if (recentCount + 1 >= MAX_CANCELS_IN_WINDOW) {
            lockUntil = now.plusMinutes(LOCK_MINUTES);
        }

        OrderCancelRecord record = new OrderCancelRecord();
        record.setExternalUserId(userId);
        record.setOrderId(orderId);
        record.setMerchantId(merchantId);
        record.setReason(limitText(reason, 200));
        record.setSource(SOURCE_USER);
        record.setCancelledAt(now);
        record.setLockUntil(lockUntil);
        orderCancelRecordRepository.save(record);

        if (lockUntil != null) {
            log.info("User cancel limit triggered: externalUserId={}, recentCount={}, lockUntil={}",
                    userId, recentCount + 1, lockUntil);
            return LimitStatus.limited(lockUntil, buildMessage(lockUntil, now));
        }
        return LimitStatus.allowed();
    }

    private String buildMessage(LocalDateTime lockUntil, LocalDateTime now) {
        return "取消过于频繁，请" + formatRemaining(lockUntil, now) + "后再试";
    }

    private String formatRemaining(LocalDateTime lockUntil, LocalDateTime now) {
        long seconds = Math.max(1, Duration.between(now, lockUntil).getSeconds());
        long minutes = (long) Math.ceil(seconds / 60.0);
        if (minutes < 60) {
            return minutes + "分钟";
        }
        long hours = minutes / 60;
        long remainMinutes = minutes % 60;
        return remainMinutes == 0 ? hours + "小时" : hours + "小时" + remainMinutes + "分钟";
    }

    private String limitText(String text, int maxLength) {
        if (text == null) {
            return "";
        }
        String value = text.trim();
        return value.length() > maxLength ? value.substring(0, maxLength) : value;
    }

    @Getter
    public static class LimitStatus {
        private final boolean limited;
        private final LocalDateTime lockUntil;
        private final long retryAfterSeconds;
        private final String message;

        private LimitStatus(boolean limited, LocalDateTime lockUntil, long retryAfterSeconds, String message) {
            this.limited = limited;
            this.lockUntil = lockUntil;
            this.retryAfterSeconds = retryAfterSeconds;
            this.message = message;
        }

        public static LimitStatus allowed() {
            return new LimitStatus(false, null, 0, "");
        }

        public static LimitStatus limited(LocalDateTime lockUntil, String message) {
            long retryAfterSeconds = Math.max(1, Duration.between(LocalDateTime.now(), lockUntil).getSeconds());
            return new LimitStatus(true, lockUntil, retryAfterSeconds, message);
        }
    }
}
