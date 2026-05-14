package com.easyjoylife.entity;

import lombok.Data;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 合作商家（雀玺自有数据）
 */
@Data
@Entity
@Table(name = "partners", indexes = {
        @Index(name = "idx_partners_merchant_id", columnList = "merchant_id", unique = true),
        @Index(name = "idx_partners_status", columnList = "status"),
        @Index(name = "idx_partners_sales_person", columnList = "sales_person")
})
public class Partner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "merchant_id", nullable = false, unique = true)
    private Long merchantId;

    @Column(name = "merchant_name", length = 100)
    private String merchantName;

    @Column(name = "industry", length = 50)
    private String industry;

    @Column(name = "store_count")
    private Integer storeCount = 0;

    @Column(name = "status", nullable = false, length = 20)
    private String status = "pending";

    @Column(name = "sales_person", length = 50)
    private String salesPerson;

    @Column(name = "commission_rate")
    private Integer commissionRate = 0;

    @Column(name = "contract_start_date")
    private LocalDate contractStartDate;

    @Column(name = "contract_end_date")
    private LocalDate contractEndDate;

    @Column(name = "contact_name", length = 50)
    private String contactName;

    @Column(name = "contact_phone", length = 20)
    private String contactPhone;

    @Column(name = "remark", length = 500)
    private String remark;

    @Column(name = "created_time", nullable = false)
    private LocalDateTime createdTime;

    @Column(name = "updated_time")
    private LocalDateTime updatedTime;

    @PrePersist
    protected void onCreate() {
        createdTime = LocalDateTime.now();
        updatedTime = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedTime = LocalDateTime.now();
    }
}
