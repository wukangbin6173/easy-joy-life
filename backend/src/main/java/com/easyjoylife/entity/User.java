package com.easyjoylife.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.*;
import java.time.LocalDateTime;

/**
 * 用户实体类
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 微信openid
     */
    @Column(name = "openid", unique = true, nullable = false, length = 50)
    private String openid;

    /**
     * 微信unionid
     */
    @Column(name = "unionid", length = 50)
    private String unionid;

    /**
     * 用户昵称
     */
    @Column(name = "nickname", length = 100)
    private String nickname;

    /**
     * 头像URL
     */
    @Column(name = "avatar", length = 200)
    private String avatar;

    /**
     * 性别：0-未知，1-男，2-女
     */
    @Column(name = "gender")
    private Integer gender = 0;

    /**
     * 手机号
     */
    @Column(name = "phone", length = 20)
    private String phone;

    /**
     * 用户状态：ACTIVE-正常，DISABLED-禁用
     */
    @Column(name = "status", nullable = false, length = 20)
    private String status = Status.ACTIVE;

    /**
     * 最后登录时间
     */
    @Column(name = "last_login_time")
    private LocalDateTime lastLoginTime;

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

    // 用户状态枚举
    public static class Status {
        public static final String ACTIVE = "ACTIVE";
        public static final String DISABLED = "DISABLED";
    }
}