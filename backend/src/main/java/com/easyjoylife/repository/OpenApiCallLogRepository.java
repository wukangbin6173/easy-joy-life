package com.easyjoylife.repository;

import com.easyjoylife.entity.OpenApiCallLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface OpenApiCallLogRepository extends JpaRepository<OpenApiCallLog, Long> {

    Optional<OpenApiCallLog> findTopByProviderOrderByCalledAtDesc(String provider);

    Optional<OpenApiCallLog> findTopByProviderAndSuccessOrderByCalledAtDesc(String provider, Boolean success);

    long countByProviderAndSuccessAndCalledAtAfter(String provider, Boolean success, LocalDateTime calledAt);

    @Query("select l from OpenApiCallLog l where " +
            "(:provider is null or l.provider = :provider) " +
            "and (:apiPath is null or lower(l.apiPath) like lower(concat('%', :apiPath, '%'))) " +
            "and (:success is null or l.success = :success) " +
            "and (:startTime is null or l.calledAt >= :startTime) " +
            "and (:endTime is null or l.calledAt <= :endTime)")
    Page<OpenApiCallLog> search(String provider, String apiPath, Boolean success,
                                LocalDateTime startTime, LocalDateTime endTime,
                                Pageable pageable);
}
