package com.easyjoylife.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 钱包交易记录实体类
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Entity
@Table(name = "wallet_transactions")
public class WalletTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 交易流水号
     */
    @Column(name = "transaction_no", unique = true, nullable = false, length = 32)
    private String transactionNo;

    /**
     * 用户ID
     */
    @Column(name = "user_id", nullable = false)
    private Long userId;

    /**
     * 关联订单号
     */
    @Column(name = "order_no", length = 32)
    private String orderNo;

    /**
     * 交易类型：RECHARGE-充值, CONSUME-消费, REFUND-退款, FREEZE-冻结, UNFREEZE-解冻
     */
    @Column(name = "transaction_type", nullable = false, length = 20)
    private String transactionType;

    /**
     * 交易金额（正数为收入，负数为支出）
     */
    @Column(name = "amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    /**
     * 交易前余额
     */
    @Column(name = "balance_before", nullable = false, precision = 10, scale = 2)
    private BigDecimal balanceBefore;

    /**
     * 交易后余额
     */
    @Column(name = "balance_after", nullable = false, precision = 10, scale = 2)
    private BigDecimal balanceAfter;

    /**
     * 交易描述
     */
    @Column(name = "description", length = 200)
    private String description;

    /**
     * 交易状态：SUCCESS-成功, FAILED-失败, PENDING-处理中
     */
    @Column(name = "status", nullable = false, length = 20)
    private String status;

    /**
     * 创建时间
     */
    @Column(name = "created_time", nullable = false)
    private LocalDateTime createdTime;

    @PrePersist
    protected void onCreate() {
        createdTime = LocalDateTime.now();
    }

    // 交易类型枚举
    public static class TransactionType {
        public static final String RECHARGE = "RECHARGE";
        public static final String CONSUME = "CONSUME";
        public static final String REFUND = "REFUND";
        public static final String FREEZE = "FREEZE";
        public static final String UNFREEZE = "UNFREEZE";
    }

    // 交易状态枚举
    public static class Status {
        public static final String SUCCESS = "SUCCESS";
        public static final String FAILED = "FAILED";
        public static final String PENDING = "PENDING";
    }
}