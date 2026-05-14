package com.easyjoylife.repository;

import com.easyjoylife.entity.BillingOrderSnapshot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BillingOrderSnapshotRepository extends JpaRepository<BillingOrderSnapshot, Long> {

    Optional<BillingOrderSnapshot> findByOrderId(Long orderId);
}
