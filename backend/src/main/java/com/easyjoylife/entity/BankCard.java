package com.easyjoylife.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.*;
import java.time.LocalDateTime;

/**
 * 银行卡实体类
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Entity
@Table(name = "user_bank_cards")
public class BankCard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 用户ID
     */
    @Column(name = "user_id", nullable = false)
    private Long userId;

    /**
     * 持卡人姓名
     */
    @Column(name = "holder_name", nullable = false, length = 50)
    private String holderName;

    /**
     * 银行卡号（加密存储）
     */
    @Column(name = "card_no", nullable = false, length = 128)
    private String cardNo;

    /**
     * 银行名称
     */
    @Column(name = "bank_name", nullable = false, length = 50)
    private String bankName;

    /**
     * 银行代码
     */
    @Column(name = "bank_code", nullable = false, length = 20)
    private String bankCode;

    /**
     * 卡类型：DEBIT-储蓄卡, CREDIT-信用卡
     */
    @Column(name = "card_type", nullable = false, length = 20)
    private String cardType;

    /**
     * 预留手机号
     */
    @Column(name = "phone", nullable = false, length = 20)
    private String phone;

    /**
     * 是否默认
     */
    @Column(name = "is_default", nullable = false)
    private Boolean isDefault = false;

    /**
     * 状态：ACTIVE-正常, DISABLED-禁用
     */
    @Column(name = "status", nullable = false, length = 20)
    private String status = "ACTIVE";

    /**
     * 创建时间
     */
    @Column(name = "created_time", nullable = false)
    private LocalDateTime createdTime;

    /**
     * 更新时间
     */
    @Column(name = "updated_time", nullable = false)
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

    // 卡类型枚举
    public static class CardType {
        public static final String DEBIT = "DEBIT";   // 储蓄卡
        public static final String CREDIT = "CREDIT"; // 信用卡
    }

    // 状态枚举
    public static class Status {
        public static final String ACTIVE = "ACTIVE";
        public static final String DISABLED = "DISABLED";
    }
}
