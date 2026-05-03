package com.easyjoylife.repository;

import com.easyjoylife.entity.OrderCancelRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface OrderCancelRecordRepository extends JpaRepository<OrderCancelRecord, Long> {

    Optional<OrderCancelRecord> findTopByExternalUserIdAndLockUntilAfterOrderByLockUntilDesc(
            String externalUserId, LocalDateTime now);

    long countByExternalUserIdAndSourceAndCancelledAtAfter(
            String externalUserId, String source, LocalDateTime cancelledAfter);

    boolean existsByExternalUserIdAndOrderIdAndSource(String externalUserId, Long orderId, String source);
}
