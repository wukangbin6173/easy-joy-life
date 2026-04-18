package com.easyjoylife.entity;

import lombok.Data;

import javax.persistence.*;
import java.time.LocalDateTime;

/**
 * 用户积分实体
 */
@Data
@Entity
@Table(name = "user_points")
public class UserPoints {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", unique = true, nullable = false)
    private Long userId;

    /** 可用积分 */
    @Column(name = "points", nullable = false)
    private Long points = 0L;

    /** 累计获得积分 */
    @Column(name = "total_earned", nullable = false)
    private Long totalEarned = 0L;

    /** 累计使用积分 */
    @Column(name = "total_used", nullable = false)
    private Long totalUsed = 0L;

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
