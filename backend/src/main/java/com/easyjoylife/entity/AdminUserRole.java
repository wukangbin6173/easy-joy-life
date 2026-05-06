package com.easyjoylife.entity;

import lombok.Data;

import javax.persistence.*;
import java.time.LocalDateTime;

/**
 * 管理用户与角色关系。
 */
@Data
@Entity
@Table(name = "admin_user_roles", uniqueConstraints = {
        @UniqueConstraint(name = "uk_admin_user_role", columnNames = {"admin_user_id", "role_id"})
}, indexes = {
        @Index(name = "idx_admin_user_roles_user", columnList = "admin_user_id"),
        @Index(name = "idx_admin_user_roles_role", columnList = "role_id")
})
public class AdminUserRole {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "admin_user_id", nullable = false)
    private Long adminUserId;

    @Column(name = "role_id", nullable = false)
    private Long roleId;

    @Column(name = "created_time", nullable = false)
    private LocalDateTime createdTime;

    @PrePersist
    protected void onCreate() {
        createdTime = LocalDateTime.now();
    }
}
