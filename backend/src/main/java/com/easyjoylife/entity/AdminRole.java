package com.easyjoylife.entity;

import lombok.Data;

import javax.persistence.*;
import java.time.LocalDateTime;

/**
 * 管理后台角色。
 */
@Data
@Entity
@Table(name = "admin_roles", indexes = {
        @Index(name = "idx_admin_roles_role_code", columnList = "role_code"),
        @Index(name = "idx_admin_roles_status", columnList = "status")
})
public class AdminRole {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "role_code", nullable = false, unique = true, length = 50)
    private String roleCode;

    @Column(name = "role_name", nullable = false, length = 50)
    private String roleName;

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
