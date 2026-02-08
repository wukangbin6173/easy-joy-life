package com.easyjoylife.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.*;
import java.time.LocalDateTime;

/**
 * 支付密码实体类
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Entity
@Table(name = "user_pay_passwords")
public class PayPassword {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 用户ID（唯一）
     */
    @Column(name = "user_id", nullable = false, unique = true)
    private Long userId;

    /**
     * 支付密码（加密存储）
     */
    @Column(name = "password", nullable = false, length = 255)
    private String password;

    /**
     * 盐值
     */
    @Column(name = "salt", nullable = false, length = 64)
    private String salt;

    /**
     * 错误次数
     */
    @Column(name = "error_count", nullable = false)
    private Integer errorCount = 0;

    /**
     * 锁定时间
     */
    @Column(name = "locked_until")
    private LocalDateTime lockedUntil;

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
}
