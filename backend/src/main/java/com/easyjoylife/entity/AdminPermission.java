package com.easyjoylife.entity;

import lombok.Data;

import javax.persistence.*;
import java.time.LocalDateTime;

/**
 * 管理后台权限点。
 */
@Data
@Entity
@Table(name = "admin_permissions", indexes = {
        @Index(name = "idx_admin_permissions_code", columnList = "permission_code"),
        @Index(name = "idx_admin_permissions_module", columnList = "module")
})
public class AdminPermission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "permission_code", nullable = false, unique = true, length = 100)
    private String permissionCode;

    @Column(name = "permission_name", nullable = false, length = 100)
    private String permissionName;

    @Column(name = "module", nullable = false, length = 50)
    private String module;

    @Column(name = "description", length = 200)
    private String description;

    @Column(name = "status", nullable = false, length = 20)
    private String status = Status.ACTIVE;

    @Column(name = "created_time", nullable = false)
    private LocalDateTime createdTime;

    @Column(name = "updated_time")
    private LocalDateTime updatedTime;

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        createdTime = now;
        updatedTime = now;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedTime = LocalDateTime.now();
    }

    public static class Status {
        public static final String ACTIVE = "ACTIVE";
        public static final String DISABLED = "DISABLED";
    }
}
