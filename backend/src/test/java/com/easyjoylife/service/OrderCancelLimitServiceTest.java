package com.easyjoylife.service;

import com.easyjoylife.entity.OrderCancelRecord;
import com.easyjoylife.repository.OrderCancelRecordRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class OrderCancelLimitServiceTest {

    @Mock
    private OrderCancelRecordRepository orderCancelRecordRepository;

    private OrderCancelLimitService orderCancelLimitService;

    @BeforeEach
    void setUp() {
        orderCancelLimitService = new OrderCancelLimitService(orderCancelRecordRepository);
    }

    @Test
    void getActiveLimitReturnsLimitedStatusWhenLockIsActive() {
        OrderCancelRecord record = new OrderCancelRecord();
        record.setLockUntil(LocalDateTime.now().plusMinutes(15));

        when(orderCancelRecordRepository.findTopByExternalUserIdAndLockUntilAfterOrderByLockUntilDesc(
                eq("user-1"), any(LocalDateTime.class))).thenReturn(Optional.of(record));

        OrderCancelLimitService.LimitStatus status = orderCancelLimitService.getActiveLimit(" user-1 ");

        assertTrue(status.isLimited());
        assertNotNull(status.getLockUntil());
        assertTrue(status.getRetryAfterSeconds() > 0);
        assertTrue(status.getMessage().contains("后再试"));
    }

    @Test
    void recordUserCancelLocksUserWhenThresholdIsReached() {
        when(orderCancelRecordRepository.existsByExternalUserIdAndOrderIdAndSource(
                "user-1", 100L, "USER")).thenReturn(false);
        when(orderCancelRecordRepository.countByExternalUserIdAndSourceAndCancelledAtAfter(
                eq("user-1"), eq("USER"), any(LocalDateTime.class))).thenReturn(2L);
        when(orderCancelRecordRepository.save(any(OrderCancelRecord.class))).thenAnswer(invocation -> invocation.getArgument(0));

        OrderCancelLimitService.LimitStatus status =
                orderCancelLimitService.recordUserCancel("user-1", 100L, 20L, "用户取消");

        ArgumentCaptor<OrderCancelRecord> recordCaptor = ArgumentCaptor.forClass(OrderCancelRecord.class);
        verify(orderCancelRecordRepository).save(recordCaptor.capture());
        OrderCancelRecord savedRecord = recordCaptor.getValue();

        assertTrue(status.isLimited());
        assertEquals("user-1", savedRecord.getExternalUserId());
        assertEquals(100L, savedRecord.getOrderId());
        assertEquals(20L, savedRecord.getMerchantId());
        assertNotNull(savedRecord.getLockUntil());
    }

    @Test
    void recordUserCancelDoesNotCreateDuplicateRecordForSameOrder() {
        when(orderCancelRecordRepository.existsByExternalUserIdAndOrderIdAndSource(
                "user-1", 100L, "USER")).thenReturn(true);
        when(orderCancelRecordRepository.findTopByExternalUserIdAndLockUntilAfterOrderByLockUntilDesc(
                eq("user-1"), any(LocalDateTime.class))).thenReturn(Optional.empty());

        OrderCancelLimitService.LimitStatus status =
                orderCancelLimitService.recordUserCancel("user-1", 100L, 20L, "用户取消");

        assertFalse(status.isLimited());
        verify(orderCancelRecordRepository, never()).save(any(OrderCancelRecord.class));
    }
}
