package com.easyjoylife.entity;

import lombok.Data;

import javax.persistence.*;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "billing_order_snapshots", indexes = {
        @Index(name = "idx_billing_order_snapshots_order", columnList = "order_id", unique = true),
        @Index(name = "idx_billing_order_snapshots_user", columnList = "external_user_id"),
        @Index(name = "idx_billing_order_snapshots_created", columnList = "created_time")
})
public class BillingOrderSnapshot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "order_id", nullable = false, unique = true)
    private Long orderId;

    @Column(name = "order_no", length = 64)
    private String orderNo;

    @Column(name = "merchant_id")
    private Long merchantId;

    @Column(name = "store_id")
    private Long storeId;

    @Column(name = "resource_id")
    private Long resourceId;

    @Column(name = "external_user_id", length = 64)
    private String externalUserId;

    @Column(name = "booking_start_time", nullable = false)
    private LocalDateTime bookingStartTime;

    @Column(name = "booking_end_time")
    private LocalDateTime bookingEndTime;

    @Column(name = "duration_minutes")
    private Integer durationMinutes;

    @Column(name = "created_time", nullable = false)
    private LocalDateTime createdTime;

    @Column(name = "updated_time")
    private LocalDateTime updatedTime;

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        if (createdTime == null) {
            createdTime = now;
        }
        updatedTime = now;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedTime = LocalDateTime.now();
    }
}
