package com.easyjoylife.entity;

import lombok.Data;

import javax.persistence.*;
import java.time.LocalDateTime;

/**
 * 分润记录
 */
@Data
@Entity
@Table(name = "commission_records", indexes = {
        @Index(name = "idx_commission_merchant", columnList = "merchant_id"),
        @Index(name = "idx_commission_status", columnList = "status"),
        @Index(name = "idx_commission_created", columnList = "created_time"),
        @Index(name = "idx_commission_order", columnList = "order_id")
})
public class CommissionRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "merchant_id", nullable = false)
    private Long merchantId;

    @Column(name = "merchant_name", length = 100)
    private String merchantName;

    @Column(name = "store_name", length = 100)
    private String storeName;

    @Column(name = "order_id")
    private Long orderId;

    @Column(name = "order_type", length = 30)
    private String orderType;

    @Column(name = "user_name", length = 100)
    private String userName;

    @Column(name = "amount", nullable = false)
    private Integer amount = 0;

    @Column(name = "commission_rate", nullable = false)
    private Integer commissionRate = 0;

    @Column(name = "commission_amount", nullable = false)
    private Integer commissionAmount = 0;

    @Column(name = "status", nullable = false, length = 20)
    private String status = "pending";

    @Column(name = "settle_time")
    private LocalDateTime settleTime;

    @Column(name = "remark", length = 200)
    private String remark;

    @Column(name = "created_time", nullable = false)
    private LocalDateTime createdTime;

    @PrePersist
    protected void onCreate() {
        createdTime = LocalDateTime.now();
    }
}
