package com.easyjoylife.entity;

import lombok.Data;

import javax.persistence.*;
import java.time.LocalDateTime;

/**
 * 管理角色与权限关系。
 */
@Data
@Entity
@Table(name = "admin_role_permissions", uniqueConstraints = {
        @UniqueConstraint(name = "uk_admin_role_permission", columnNames = {"role_id", "permission_id"})
}, indexes = {
        @Index(name = "idx_admin_role_permissions_role", columnList = "role_id"),
        @Index(name = "idx_admin_role_permissions_permission", columnList = "permission_id")
})
public class AdminRolePermission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "role_id", nullable = false)
    private Long roleId;

    @Column(name = "permission_id", nullable = false)
    private Long permissionId;

    @Column(name = "created_time", nullable = false)
    private LocalDateTime createdTime;

    @PrePersist
    protected void onCreate() {
        createdTime = LocalDateTime.now();
    }
}
