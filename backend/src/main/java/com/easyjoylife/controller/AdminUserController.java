package com.easyjoylife.controller;

import com.easyjoylife.common.ApiResponse;
import com.easyjoylife.entity.AdminUser;
import com.easyjoylife.service.AdminManagementService;
import com.easyjoylife.service.AdminOperationLogService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;
import java.util.NoSuchElementException;

@Slf4j
@RestController
@RequestMapping("/api/admin/users")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AdminUserController {

    private final AdminManagementService adminManagementService;
    private final AdminOperationLogService adminOperationLogService;

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> listUsers(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "1") int pageNo,
            @RequestParam(defaultValue = "20") int pageSize) {
        Page<AdminUser> page = adminManagementService.searchUsers(keyword, status, pageNo, pageSize);
        return ResponseEntity.ok(ApiResponse.success(pageData(page)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getUser(@PathVariable Long id) {
        AdminUser user = adminManagementService.findUser(id)
                .orElseThrow(() -> new NoSuchElementException("管理员不存在"));
        Map<String, Object> data = new HashMap<>();
        data.put("user", user);
        data.put("roles", adminManagementService.getUserRoles(id));
        data.put("permissions", adminManagementService.getUserPermissions(id));
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AdminUser>> createUser(@RequestBody Map<String, Object> request,
                                                            HttpServletRequest servletRequest) {
        try {
            AdminUser user = adminManagementService.createUser(request);
            adminOperationLogService.recordSafely(null, readText(request, "operator"), "admin", "create_user",
                    "admin_user", String.valueOf(user.getId()), clientIp(servletRequest), request, "SUCCESS", "创建管理员");
            return ResponseEntity.ok(ApiResponse.success(user));
        } catch (Exception e) {
            log.warn("创建管理员失败", e);
            return ResponseEntity.ok(ApiResponse.badRequest(e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<AdminUser>> updateUser(@PathVariable Long id,
                                                            @RequestBody Map<String, Object> request,
                                                            HttpServletRequest servletRequest) {
        try {
            AdminUser user = adminManagementService.updateUser(id, request);
            adminOperationLogService.recordSafely(null, readText(request, "operator"), "admin", "update_user",
                    "admin_user", String.valueOf(id), clientIp(servletRequest), request, "SUCCESS", "更新管理员");
            return ResponseEntity.ok(ApiResponse.success(user));
        } catch (Exception e) {
            log.warn("更新管理员失败: id={}", id, e);
            return ResponseEntity.ok(ApiResponse.badRequest(e.getMessage()));
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<AdminUser>> updateStatus(@PathVariable Long id,
                                                              @RequestBody Map<String, Object> request,
                                                              HttpServletRequest servletRequest) {
        try {
            AdminUser user = adminManagementService.updateUserStatus(id, readText(request, "status"));
            adminOperationLogService.recordSafely(null, readText(request, "operator"), "admin", "update_user_status",
                    "admin_user", String.valueOf(id), clientIp(servletRequest), request, "SUCCESS", "更新管理员状态");
            return ResponseEntity.ok(ApiResponse.success(user));
        } catch (Exception e) {
            log.warn("更新管理员状态失败: id={}", id, e);
            return ResponseEntity.ok(ApiResponse.badRequest(e.getMessage()));
        }
    }

    @PutMapping("/{id}/roles")
    public ResponseEntity<ApiResponse<Map<String, Object>>> setRoles(@PathVariable Long id,
                                                                    @RequestBody Map<String, Object> request,
                                                                    HttpServletRequest servletRequest) {
        try {
            adminManagementService.setUserRoles(id, readLongList(request.get("roleIds")));
            adminOperationLogService.recordSafely(null, readText(request, "operator"), "admin", "set_user_roles",
                    "admin_user", String.valueOf(id), clientIp(servletRequest), request, "SUCCESS", "设置管理员角色");
            Map<String, Object> data = new HashMap<>();
            data.put("roles", adminManagementService.getUserRoles(id));
            data.put("permissions", adminManagementService.getUserPermissions(id));
            return ResponseEntity.ok(ApiResponse.success(data));
        } catch (Exception e) {
            log.warn("设置管理员角色失败: id={}", id, e);
            return ResponseEntity.ok(ApiResponse.badRequest(e.getMessage()));
        }
    }

    @SuppressWarnings("unchecked")
    private java.util.List<Long> readLongList(Object value) {
        if (value == null) {
            return java.util.Collections.emptyList();
        }
        if (value instanceof java.util.Collection) {
            java.util.List<Long> result = new java.util.ArrayList<>();
            for (Object item : (java.util.Collection<Object>) value) {
                if (item != null && !item.toString().trim().isEmpty()) {
                    result.add(Long.valueOf(item.toString()));
                }
            }
            return result;
        }
        java.util.List<Long> result = new java.util.ArrayList<>();
        for (String item : value.toString().split(",")) {
            if (!item.trim().isEmpty()) {
                result.add(Long.valueOf(item.trim()));
            }
        }
        return result;
    }

    private Map<String, Object> pageData(Page<?> page) {
        Map<String, Object> data = new HashMap<>();
        data.put("list", page.getContent());
        data.put("pageNo", page.getNumber() + 1);
        data.put("pageSize", page.getSize());
        data.put("total", page.getTotalElements());
        data.put("totalPages", page.getTotalPages());
        return data;
    }

    private String readText(Map<String, Object> request, String key) {
        Object value = request.get(key);
        return value == null ? null : value.toString().trim();
    }

    private String clientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.trim().isEmpty()) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
