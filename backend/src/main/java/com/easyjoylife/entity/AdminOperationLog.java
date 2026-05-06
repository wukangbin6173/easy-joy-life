package com.easyjoylife.entity;

import lombok.Data;

import javax.persistence.*;
import java.time.LocalDateTime;

/**
 * 管理后台操作日志。
 */
@Data
@Entity
@Table(name = "admin_operation_logs", indexes = {
        @Index(name = "idx_admin_operation_logs_user", columnList = "admin_user_id"),
        @Index(name = "idx_admin_operation_logs_module", columnList = "module"),
        @Index(name = "idx_admin_operation_logs_created", columnList = "created_time")
})
public class AdminOperationLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "admin_user_id")
    private Long adminUserId;

    @Column(name = "username", length = 50)
    private String username;

    @Column(name = "module", length = 50)
    private String module;

    @Column(name = "action", nullable = false, length = 100)
    private String action;

    @Column(name = "target_type", length = 50)
    private String targetType;

    @Column(name = "target_id", length = 64)
    private String targetId;

    @Column(name = "http_method", length = 20)
    private String httpMethod;

    @Column(name = "request_path", length = 255)
    private String requestPath;

    @Column(name = "request_ip", length = 50)
    private String requestIp;

    @Column(name = "request_body", columnDefinition = "TEXT")
    private String requestBody;

    @Column(name = "result_status", length = 20)
    private String resultStatus;

    @Column(name = "result_message", length = 500)
    private String resultMessage;

    @Column(name = "created_time", nullable = false)
    private LocalDateTime createdTime;

    @PrePersist
    protected void onCreate() {
        createdTime = LocalDateTime.now();
    }
}
