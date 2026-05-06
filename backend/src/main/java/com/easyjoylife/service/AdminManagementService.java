package com.easyjoylife.service;

import com.easyjoylife.entity.*;
import com.easyjoylife.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminManagementService {

    private static final Duration ADMIN_SESSION_TTL = Duration.ofHours(12);

    private final AdminUserRepository adminUserRepository;
    private final AdminRoleRepository adminRoleRepository;
    private final AdminPermissionRepository adminPermissionRepository;
    private final AdminUserRoleRepository adminUserRoleRepository;
    private final AdminRolePermissionRepository adminRolePermissionRepository;
    private final PasswordEncoder passwordEncoder;
    private final Map<String, AdminSession> adminSessions = new ConcurrentHashMap<>();

    public Page<AdminUser> searchUsers(String keyword, String status, int pageNo, int pageSize) {
        return adminUserRepository.search(emptyToNull(keyword), emptyToNull(status),
                PageRequest.of(Math.max(pageNo - 1, 0), pageSize));
    }

    public Optional<AdminUser> findUser(Long id) {
        return adminUserRepository.findById(id);
    }

    @Transactional
    public AdminUser createUser(Map<String, Object> request) {
        String username = requiredText(request, "username");
        if (adminUserRepository.existsByUsername(username)) {
            throw new IllegalArgumentException("管理员账号已存在");
        }
        AdminUser user = new AdminUser();
        user.setUsername(username);
        user.setPasswordHash(passwordEncoder.encode(readText(request, "password", "123456")));
        fillUser(user, request);
        AdminUser saved = adminUserRepository.save(user);
        setUserRoles(saved.getId(), readLongList(request.get("roleIds")));
        return saved;
    }

    @Transactional
    public AdminUser updateUser(Long id, Map<String, Object> request) {
        AdminUser user = adminUserRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("管理员不存在"));
        fillUser(user, request);
        if (request.containsKey("password") && readText(request, "password", null) != null) {
            user.setPasswordHash(passwordEncoder.encode(readText(request, "password", "123456")));
        }
        AdminUser saved = adminUserRepository.save(user);
        if (request.containsKey("roleIds")) {
            setUserRoles(id, readLongList(request.get("roleIds")));
        }
        return saved;
    }

    @Transactional
    public AdminUser updateUserStatus(Long id, String status) {
        AdminUser user = adminUserRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("管理员不存在"));
        user.setStatus(status);
        return adminUserRepository.save(user);
    }

    @Transactional
    public void setUserRoles(Long adminUserId, List<Long> roleIds) {
        adminUserRoleRepository.deleteByAdminUserId(adminUserId);
        if (roleIds == null || roleIds.isEmpty()) {
            return;
        }
        List<AdminUserRole> relations = roleIds.stream().distinct().map(roleId -> {
            AdminUserRole relation = new AdminUserRole();
            relation.setAdminUserId(adminUserId);
            relation.setRoleId(roleId);
            return relation;
        }).collect(Collectors.toList());
        adminUserRoleRepository.saveAll(relations);
    }

    @Transactional
    public Map<String, Object> login(String username, String password, String requestIp) {
        AdminUser user = adminUserRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("账号或密码错误"));
        if (!AdminUser.Status.ACTIVE.equals(user.getStatus())) {
            throw new IllegalArgumentException("账号已被禁用");
        }
        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new IllegalArgumentException("账号或密码错误");
        }
        user.setLastLoginAt(LocalDateTime.now());
        user.setLastLoginIp(requestIp);
        adminUserRepository.save(user);

        String token = UUID.randomUUID().toString().replace("-", "");
        adminSessions.put(token, new AdminSession(user.getId(), user.getUsername(), LocalDateTime.now().plus(ADMIN_SESSION_TTL)));

        Map<String, Object> data = new HashMap<>();
        data.put("token", token);
        data.put("user", user);
        data.put("roles", getUserRoles(user.getId()));
        data.put("permissions", getUserPermissions(user.getId()));
        return data;
    }

    public Optional<AdminSession> validateToken(String token) {
        if (token == null || token.trim().isEmpty()) {
            return Optional.empty();
        }
        AdminSession session = adminSessions.get(token.trim());
        if (session == null) {
            return Optional.empty();
        }
        if (session.getExpiresAt().isBefore(LocalDateTime.now())) {
            adminSessions.remove(token.trim());
            return Optional.empty();
        }
        return Optional.of(session);
    }

    public void logout(String token) {
        if (token != null) {
            adminSessions.remove(token.trim());
        }
    }

    public List<AdminRole> getUserRoles(Long adminUserId) {
        List<Long> roleIds = adminUserRoleRepository.findByAdminUserId(adminUserId).stream()
                .map(AdminUserRole::getRoleId)
                .collect(Collectors.toList());
        return roleIds.isEmpty() ? Collections.emptyList() : adminRoleRepository.findByIdIn(roleIds);
    }

    public List<AdminPermission> getUserPermissions(Long adminUserId) {
        List<Long> roleIds = adminUserRoleRepository.findByAdminUserId(adminUserId).stream()
                .map(AdminUserRole::getRoleId)
                .collect(Collectors.toList());
        if (roleIds.isEmpty()) {
            return Collections.emptyList();
        }
        List<Long> permissionIds = adminRolePermissionRepository.findByRoleIdIn(roleIds).stream()
                .map(AdminRolePermission::getPermissionId)
                .distinct()
                .collect(Collectors.toList());
        return permissionIds.isEmpty() ? Collections.emptyList() : adminPermissionRepository.findByIdIn(permissionIds);
    }

    public Page<AdminRole> searchRoles(String keyword, String status, int pageNo, int pageSize) {
        return adminRoleRepository.search(emptyToNull(keyword), emptyToNull(status),
                PageRequest.of(Math.max(pageNo - 1, 0), pageSize));
    }

    @Transactional
    public AdminRole createRole(Map<String, Object> request) {
        String roleCode = requiredText(request, "roleCode");
        if (adminRoleRepository.existsByRoleCode(roleCode)) {
            throw new IllegalArgumentException("角色编码已存在");
        }
        AdminRole role = new AdminRole();
        role.setRoleCode(roleCode);
        role.setRoleName(requiredText(request, "roleName"));
        fillRole(role, request);
        AdminRole saved = adminRoleRepository.save(role);
        setRolePermissions(saved.getId(), readLongList(request.get("permissionIds")));
        return saved;
    }

    @Transactional
    public AdminRole updateRole(Long id, Map<String, Object> request) {
        AdminRole role = adminRoleRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("角色不存在"));
        fillRole(role, request);
        AdminRole saved = adminRoleRepository.save(role);
        if (request.containsKey("permissionIds")) {
            setRolePermissions(id, readLongList(request.get("permissionIds")));
        }
        return saved;
    }

    @Transactional
    public void setRolePermissions(Long roleId, List<Long> permissionIds) {
        adminRolePermissionRepository.deleteByRoleId(roleId);
        if (permissionIds == null || permissionIds.isEmpty()) {
            return;
        }
        List<AdminRolePermission> relations = permissionIds.stream().distinct().map(permissionId -> {
            AdminRolePermission relation = new AdminRolePermission();
            relation.setRoleId(roleId);
            relation.setPermissionId(permissionId);
            return relation;
        }).collect(Collectors.toList());
        adminRolePermissionRepository.saveAll(relations);
    }

    public List<AdminPermission> getRolePermissions(Long roleId) {
        List<Long> permissionIds = adminRolePermissionRepository.findByRoleId(roleId).stream()
                .map(AdminRolePermission::getPermissionId)
                .collect(Collectors.toList());
        return permissionIds.isEmpty() ? Collections.emptyList() : adminPermissionRepository.findByIdIn(permissionIds);
    }

    public Page<AdminPermission> searchPermissions(String keyword, String module, String status, int pageNo, int pageSize) {
        return adminPermissionRepository.search(emptyToNull(keyword), emptyToNull(module), emptyToNull(status),
                PageRequest.of(Math.max(pageNo - 1, 0), pageSize));
    }

    @Transactional
    public AdminPermission createPermission(Map<String, Object> request) {
        String permissionCode = requiredText(request, "permissionCode");
        if (adminPermissionRepository.existsByPermissionCode(permissionCode)) {
            throw new IllegalArgumentException("权限编码已存在");
        }
        AdminPermission permission = new AdminPermission();
        permission.setPermissionCode(permissionCode);
        permission.setPermissionName(requiredText(request, "permissionName"));
        permission.setModule(requiredText(request, "module"));
        fillPermission(permission, request);
        return adminPermissionRepository.save(permission);
    }

    @Transactional
    public AdminPermission updatePermission(Long id, Map<String, Object> request) {
        AdminPermission permission = adminPermissionRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("权限不存在"));
        fillPermission(permission, request);
        return adminPermissionRepository.save(permission);
    }

    private void fillUser(AdminUser user, Map<String, Object> request) {
        user.setRealName(readText(request, "realName", user.getRealName()));
        user.setPhone(readText(request, "phone", user.getPhone()));
        user.setEmail(readText(request, "email", user.getEmail()));
        user.setAvatar(readText(request, "avatar", user.getAvatar()));
        user.setStatus(readText(request, "status", user.getStatus()));
    }

    private void fillRole(AdminRole role, Map<String, Object> request) {
        role.setRoleName(readText(request, "roleName", role.getRoleName()));
        role.setDescription(readText(request, "description", role.getDescription()));
        role.setStatus(readText(request, "status", role.getStatus()));
    }

    private void fillPermission(AdminPermission permission, Map<String, Object> request) {
        permission.setPermissionName(readText(request, "permissionName", permission.getPermissionName()));
        permission.setModule(readText(request, "module", permission.getModule()));
        permission.setDescription(readText(request, "description", permission.getDescription()));
        permission.setStatus(readText(request, "status", permission.getStatus()));
    }

    private String requiredText(Map<String, Object> request, String key) {
        String value = readText(request, key, null);
        if (value == null) {
            throw new IllegalArgumentException(key + "不能为空");
        }
        return value;
    }

    private String readText(Map<String, Object> request, String key, String fallback) {
        Object value = request.get(key);
        if (value == null) {
            return fallback;
        }
        String text = value.toString().trim();
        return text.isEmpty() ? fallback : text;
    }

    @SuppressWarnings("unchecked")
    private List<Long> readLongList(Object value) {
        if (value == null) {
            return Collections.emptyList();
        }
        if (value instanceof Collection) {
            return ((Collection<Object>) value).stream()
                    .filter(Objects::nonNull)
                    .map(v -> Long.valueOf(v.toString()))
                    .collect(Collectors.toList());
        }
        String text = value.toString().trim();
        if (text.isEmpty()) {
            return Collections.emptyList();
        }
        return Arrays.stream(text.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .map(Long::valueOf)
                .collect(Collectors.toList());
    }

    private String emptyToNull(String value) {
        return value == null || value.trim().isEmpty() ? null : value.trim();
    }

    public static class AdminSession {
        private final Long userId;
        private final String username;
        private final LocalDateTime expiresAt;

        public AdminSession(Long userId, String username, LocalDateTime expiresAt) {
            this.userId = userId;
            this.username = username;
            this.expiresAt = expiresAt;
        }

        public Long getUserId() {
            return userId;
        }

        public String getUsername() {
            return username;
        }

        public LocalDateTime getExpiresAt() {
            return expiresAt;
        }
    }
}
