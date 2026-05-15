package com.easyjoylife.entity;

import lombok.Data;

import javax.persistence.*;
import java.time.LocalDateTime;

/**
 * 消息通知（雀玺自有）
 */
@Data
@Entity
@Table(name = "notifications", indexes = {
        @Index(name = "idx_notifications_type", columnList = "type"),
        @Index(name = "idx_notifications_status", columnList = "status"),
        @Index(name = "idx_notifications_created", columnList = "created_time")
})
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "title", nullable = false, length = 100)
    private String title;

    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(name = "type", nullable = false, length = 30)
    private String type;

    @Column(name = "target_type", nullable = false, length = 30)
    private String targetType;

    @Column(name = "target_ids", columnDefinition = "TEXT")
    private String targetIds;

    @Column(name = "scheduled_time")
    private LocalDateTime scheduledTime;

    @Column(name = "sent_time")
    private LocalDateTime sentTime;

    @Column(name = "status", nullable = false)
    private Integer status = 0;

    @Column(name = "send_count")
    private Integer sendCount = 0;

    @Column(name = "created_by", length = 50)
    private String createdBy;

    @Column(name = "created_time", nullable = false)
    private LocalDateTime createdTime;

    @PrePersist
    protected void onCreate() {
        createdTime = LocalDateTime.now();
    }
}
