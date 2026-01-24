package com.easyjoylife.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 支付订单实体类
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Entity
@Table(name = "payment_orders")
public class PaymentOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 订单号（系统生成）
     */
    @Column(name = "order_no", unique = true, nullable = false, length = 32)
    private String orderNo;

    /**
     * 第三方支付订单号
     */
    @Column(name = "trade_no", length = 64)
    private String tradeNo;

    /**
     * 用户ID
     */
    @Column(name = "user_id", nullable = false)
    private Long userId;

    /**
     * 支付类型：RECHARGE-充值, BOOKING-预订
     */
    @Column(name = "payment_type", nullable = false, length = 20)
    private String paymentType;

    /**
     * 支付方式：ALIPAY-支付宝, WECHAT-微信
     */
    @Column(name = "payment_method", nullable = false, length = 20)
    private String paymentMethod;

    /**
     * 支付金额
     */
    @Column(name = "amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    /**
     * 订单标题
     */
    @Column(name = "subject", nullable = false, length = 100)
    private String subject;

    /**
     * 订单描述
     */
    @Column(name = "body", length = 500)
    private String body;

    /**
     * 订单状态：PENDING-待支付, PAID-已支付, CANCELLED-已取消, REFUNDED-已退款
     */
    @Column(name = "status", nullable = false, length = 20)
    private String status;

    /**
     * 支付时间
     */
    @Column(name = "paid_time")
    private LocalDateTime paidTime;

    /**
     * 过期时间
     */
    @Column(name = "expire_time")
    private LocalDateTime expireTime;

    /**
     * 回调通知状态：PENDING-待通知, SUCCESS-成功, FAILED-失败
     */
    @Column(name = "notify_status", length = 20)
    private String notifyStatus;

    /**
     * 回调通知次数
     */
    @Column(name = "notify_count")
    private Integer notifyCount = 0;

    /**
     * 扩展信息（JSON格式）
     */
    @Column(name = "extra_data", columnDefinition = "TEXT")
    private String extraData;

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

    // 订单状态枚举
    public static class Status {
        public static final String PENDING = "PENDING";
        public static final String PAID = "PAID";
        public static final String CANCELLED = "CANCELLED";
        public static final String REFUNDED = "REFUNDED";
    }

    // 支付类型枚举
    public static class PaymentType {
        public static final String RECHARGE = "RECHARGE";
        public static final String BOOKING = "BOOKING";
    }

    // 支付方式枚举
    public static class PaymentMethod {
        public static final String ALIPAY = "ALIPAY";
        public static final String WECHAT = "WECHAT";
    }

    // 通知状态枚举
    public static class NotifyStatus {
        public static final String PENDING = "PENDING";
        public static final String SUCCESS = "SUCCESS";
        public static final String FAILED = "FAILED";
    }
}