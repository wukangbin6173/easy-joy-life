package com.easyjoylife.repository;

import com.easyjoylife.entity.AdminOperationLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface AdminOperationLogRepository extends JpaRepository<AdminOperationLog, Long> {

    @Query("select l from AdminOperationLog l where " +
            "(:username is null or lower(coalesce(l.username, '')) like lower(concat('%', :username, '%'))) " +
            "and (:module is null or l.module = :module) " +
            "and (:action is null or lower(l.action) like lower(concat('%', :action, '%'))) " +
            "and (:startTime is null or l.createdTime >= :startTime) " +
            "and (:endTime is null or l.createdTime <= :endTime)")
    Page<AdminOperationLog> search(String username, String module, String action,
                                   LocalDateTime startTime, LocalDateTime endTime,
                                   Pageable pageable);
}
