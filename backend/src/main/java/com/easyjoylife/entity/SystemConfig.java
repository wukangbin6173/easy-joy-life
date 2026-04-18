package com.easyjoylife.entity;

import lombok.Data;

import javax.persistence.*;
import java.time.LocalDateTime;

/**
 * 系统配置（键值对形式，后台可动态调整）
 */
@Data
@Entity
@Table(name = "system_config")
public class SystemConfig {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** 配置键 */
    @Column(name = "config_key", unique = true, nullable = false, length = 100)
    private String configKey;

    /** 配置值 */
    @Column(name = "config_value", nullable = false, length = 500)
    private String configValue;

    /** 配置说明 */
    @Column(name = "description", length = 200)
    private String description;

    @Column(name = "updated_time")
    private LocalDateTime updatedTime;

    @PrePersist
    @PreUpdate
    protected void onSave() {
        updatedTime = LocalDateTime.now();
    }

    /** 预定义配置键 */
    public static class Keys {
        /** 消费返积分比例（百分比，如 2 表示 2%） */
        public static final String POINTS_EARN_RATE = "points_earn_rate";
    }
}
