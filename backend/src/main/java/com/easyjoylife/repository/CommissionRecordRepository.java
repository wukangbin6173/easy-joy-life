package com.easyjoylife.repository;

import com.easyjoylife.entity.CommissionRecord;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface CommissionRecordRepository extends JpaRepository<CommissionRecord, Long> {

    @Query("select c from CommissionRecord c where " +
            "(:merchantId is null or c.merchantId = :merchantId) " +
            "and (:status is null or c.status = :status) " +
            "and (:startTime is null or c.createdTime >= :startTime) " +
            "and (:endTime is null or c.createdTime <= :endTime) " +
            "order by c.createdTime desc")
    Page<CommissionRecord> search(Long merchantId, String status, LocalDateTime startTime, LocalDateTime endTime, Pageable pageable);

    @Query("select coalesce(sum(c.amount),0) from CommissionRecord c where " +
            "(:startTime is null or c.createdTime >= :startTime) " +
            "and (:endTime is null or c.createdTime <= :endTime)")
    Long sumAmount(LocalDateTime startTime, LocalDateTime endTime);

    @Query("select coalesce(sum(c.commissionAmount),0) from CommissionRecord c where " +
            "(:startTime is null or c.createdTime >= :startTime) " +
            "and (:endTime is null or c.createdTime <= :endTime)")
    Long sumCommission(LocalDateTime startTime, LocalDateTime endTime);

    @Query("select coalesce(sum(c.commissionAmount),0) from CommissionRecord c where c.status = :status " +
            "and (:startTime is null or c.createdTime >= :startTime) " +
            "and (:endTime is null or c.createdTime <= :endTime)")
    Long sumCommissionByStatus(String status, LocalDateTime startTime, LocalDateTime endTime);
}
