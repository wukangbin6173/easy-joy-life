package com.easyjoylife.entity;

import lombok.Data;

import javax.persistence.*;
import java.time.LocalDateTime;

/**
 * 第三方 OpenAPI 调用日志。
 */
@Data
@Entity
@Table(name = "openapi_call_logs", indexes = {
        @Index(name = "idx_openapi_call_logs_provider", columnList = "provider"),
        @Index(name = "idx_openapi_call_logs_success", columnList = "success"),
        @Index(name = "idx_openapi_call_logs_called", columnList = "called_at")
})
public class OpenApiCallLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "provider", nullable = false, length = 50)
    private String provider;

    @Column(name = "http_method", nullable = false, length = 20)
    private String httpMethod;

    @Column(name = "api_path", nullable = false, length = 255)
    private String apiPath;

    @Column(name = "request_payload", columnDefinition = "TEXT")
    private String requestPayload;

    @Column(name = "response_code")
    private Integer responseCode;

    @Column(name = "response_message", length = 500)
    private String responseMessage;

    @Column(name = "success", nullable = false)
    private Boolean success;

    @Column(name = "error_message", columnDefinition = "TEXT")
    private String errorMessage;

    @Column(name = "duration_ms")
    private Long durationMs;

    @Column(name = "trace_id", length = 64)
    private String traceId;

    @Column(name = "called_at", nullable = false)
    private LocalDateTime calledAt;

    @PrePersist
    protected void onCreate() {
        if (calledAt == null) {
            calledAt = LocalDateTime.now();
        }
    }
}
