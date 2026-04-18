package com.easyjoylife.entity;

import lombok.Data;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 积分变动记录
 */
@Data
@Entity
@Table(name = "points_transactions")
public class PointsTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    /** 变动类型：EARN-获得, USE-使用, EXPIRE-过期, ADJUST-调整 */
    @Column(name = "type", nullable = false, length = 20)
    private String type;

    /** 变动积分（正数获得，负数扣减） */
    @Column(name = "points", nullable = false)
    private Long points;

    /** 变动前积分 */
    @Column(name = "points_before", nullable = false)
    private Long pointsBefore;

    /** 变动后积分 */
    @Column(name = "points_after", nullable = false)
    private Long pointsAfter;

    /** 关联订单号 */
    @Column(name = "order_no", length = 64)
    private String orderNo;

    /** 关联消费金额（获得积分时记录） */
    @Column(name = "consume_amount", precision = 10, scale = 2)
    private BigDecimal consumeAmount;

    /** 描述 */
    @Column(name = "description", length = 200)
    private String description;

    @Column(name = "created_time", nullable = false)
    private LocalDateTime createdTime;

    @PrePersist
    protected void onCreate() {
        createdTime = LocalDateTime.now();
    }

    public static class Type {
        public static final String EARN = "EARN";
        public static final String USE = "USE";
        public static final String EXPIRE = "EXPIRE";
        public static final String ADJUST = "ADJUST";
    }
}
