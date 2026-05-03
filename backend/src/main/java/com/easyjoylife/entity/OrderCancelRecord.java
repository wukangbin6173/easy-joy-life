package com.easyjoylife.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.*;
import java.time.LocalDateTime;

/**
 * 用户主动取消订单记录，用于限制短时间内频繁取消。
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Entity
@Table(name = "order_cancel_records", indexes = {
        @Index(name = "idx_order_cancel_user_time", columnList = "external_user_id,cancelled_at"),
        @Index(name = "idx_order_cancel_lock", columnList = "external_user_id,lock_until"),
        @Index(name = "idx_order_cancel_order", columnList = "order_id")
})
public class OrderCancelRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "external_user_id", nullable = false, length = 64)
    private String externalUserId;

    @Column(name = "order_id", nullable = false)
    private Long orderId;

    @Column(name = "merchant_id")
    private Long merchantId;

    @Column(name = "reason", length = 200)
    private String reason;

    @Column(name = "source", nullable = false, length = 20)
    private String source;

    @Column(name = "cancelled_at", nullable = false)
    private LocalDateTime cancelledAt;

    @Column(name = "lock_until")
    private LocalDateTime lockUntil;

    @Column(name = "created_time", nullable = false)
    private LocalDateTime createdTime;

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        if (cancelledAt == null) {
            cancelledAt = now;
        }
        createdTime = now;
    }
}
