package com.easyjoylife.entity;

import lombok.Data;

import javax.persistence.*;
import java.time.LocalDateTime;

/**
 * 推广活动（雀玺自有）
 */
@Data
@Entity
@Table(name = "promotions", indexes = {
        @Index(name = "idx_promotions_status", columnList = "status"),
        @Index(name = "idx_promotions_type", columnList = "type")
})
public class Promotion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "title", nullable = false, length = 100)
    private String title;

    @Column(name = "type", nullable = false, length = 30)
    private String type;

    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalDateTime endTime;

    @Column(name = "rules", columnDefinition = "TEXT")
    private String rules;

    @Column(name = "target_merchants", length = 500)
    private String targetMerchants;

    @Column(name = "budget")
    private Integer budget;

    @Column(name = "status", nullable = false)
    private Integer status = 0;

    @Column(name = "participant_count")
    private Integer participantCount = 0;

    @Column(name = "order_count")
    private Integer orderCount = 0;

    @Column(name = "total_amount")
    private Integer totalAmount = 0;

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
