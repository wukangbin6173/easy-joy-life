package com.easyjoylife.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 用户钱包实体类
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Entity
@Table(name = "user_wallets")
public class UserWallet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 用户ID
     */
    @Column(name = "user_id", unique = true, nullable = false)
    private Long userId;

    /**
     * 账户余额
     */
    @Column(name = "balance", nullable = false, precision = 10, scale = 2)
    private BigDecimal balance = BigDecimal.ZERO;

    /**
     * 冻结金额
     */
    @Column(name = "frozen_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal frozenAmount = BigDecimal.ZERO;

    /**
     * 累计充值金额
     */
    @Column(name = "total_recharge", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalRecharge = BigDecimal.ZERO;

    /**
     * 累计消费金额
     */
    @Column(name = "total_consume", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalConsume = BigDecimal.ZERO;

    /**
     * 钱包状态：ACTIVE-正常, FROZEN-冻结, DISABLED-禁用
     */
    @Column(name = "status", nullable = false, length = 20)
    private String status = Status.ACTIVE;

    /**
     * 创建时间
     */
    @Column(name = "created_time", nullable = false)
    private LocalDateTime createdTime;

    /**
     * 更新时间
     */
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

    // 钱包状态枚举
    public static class Status {
        public static final String ACTIVE = "ACTIVE";
        public static final String FROZEN = "FROZEN";
        public static final String DISABLED = "DISABLED";
    }

    /**
     * 获取可用余额
     */
    public BigDecimal getAvailableBalance() {
        return balance.subtract(frozenAmount);
    }
}