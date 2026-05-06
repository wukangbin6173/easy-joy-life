package com.easyjoylife.config;

import com.easyjoylife.entity.*;
import com.easyjoylife.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;

/**
 * 初始化管理后台默认账号、角色和权限点。
 */
@Component
@RequiredArgsConstructor
public class AdminBootstrapInitializer implements CommandLineRunner {

    private final AdminUserRepository adminUserRepository;
    private final AdminRoleRepository adminRoleRepository;
    private final AdminPermissionRepository adminPermissionRepository;
    private final AdminUserRoleRepository adminUserRoleRepository;
    private final AdminRolePermissionRepository adminRolePermissionRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        List<AdminPermission> permissions = ensurePermissions();
        AdminRole superRole = ensureSuperRole(permissions);
        ensureDefaultAdmin(superRole);
    }

    private List<AdminPermission> ensurePermissions() {
        List<AdminPermission> permissions = Arrays.asList(
                ensurePermission("dashboard:read", "经营看板查看", "dashboard"),
                ensurePermission("admin:user:manage", "管理员管理", "admin"),
                ensurePermission("admin:role:manage", "角色权限管理", "admin"),
                ensurePermission("admin:config:manage", "本地配置管理", "config"),
                ensurePermission("admin:operation-log:read", "操作日志查看", "log"),
                ensurePermission("admin:openapi-log:read", "OpenAPI日志查看", "log")
        );
        return permissions;
    }

    private AdminPermission ensurePermission(String code, String name, String module) {
        return adminPermissionRepository.findByPermissionCode(code).orElseGet(() -> {
            AdminPermission permission = new AdminPermission();
            permission.setPermissionCode(code);
            permission.setPermissionName(name);
            permission.setModule(module);
            permission.setStatus(AdminPermission.Status.ACTIVE);
            return adminPermissionRepository.save(permission);
        });
    }

    private AdminRole ensureSuperRole(List<AdminPermission> permissions) {
        AdminRole role = adminRoleRepository.findByRoleCode("super_admin").orElseGet(() -> {
            AdminRole created = new AdminRole();
            created.setRoleCode("super_admin");
            created.setRoleName("超级管理员");
            created.setDescription("拥有管理后台全部权限");
            created.setStatus(AdminRole.Status.ACTIVE);
            return adminRoleRepository.save(created);
        });

        if (adminRolePermissionRepository.findByRoleId(role.getId()).isEmpty()) {
            for (AdminPermission permission : permissions) {
                AdminRolePermission relation = new AdminRolePermission();
                relation.setRoleId(role.getId());
                relation.setPermissionId(permission.getId());
                adminRolePermissionRepository.save(relation);
            }
        }
        return role;
    }

    private void ensureDefaultAdmin(AdminRole superRole) {
        AdminUser admin = adminUserRepository.findByUsername("admin").orElseGet(() -> {
            AdminUser created = new AdminUser();
            created.setUsername("admin");
            created.setPasswordHash(passwordEncoder.encode("admin123"));
            created.setRealName("超级管理员");
            created.setStatus(AdminUser.Status.ACTIVE);
            return adminUserRepository.save(created);
        });

        if (adminUserRoleRepository.findByAdminUserId(admin.getId()).isEmpty()) {
            AdminUserRole relation = new AdminUserRole();
            relation.setAdminUserId(admin.getId());
            relation.setRoleId(superRole.getId());
            adminUserRoleRepository.save(relation);
        }
    }
}
