package com.easyjoylife.controller;

import com.easyjoylife.common.ApiResponse;
import com.easyjoylife.entity.AdminRole;
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

@Slf4j
@RestController
@RequestMapping("/api/admin/roles")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AdminRoleController {

    private final AdminManagementService adminManagementService;
    private final AdminOperationLogService adminOperationLogService;

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> listRoles(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "1") int pageNo,
            @RequestParam(defaultValue = "20") int pageSize) {
        Page<AdminRole> page = adminManagementService.searchRoles(keyword, status, pageNo, pageSize);
        return ResponseEntity.ok(ApiResponse.success(pageData(page)));
    }

    @GetMapping("/{id}/permissions")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getRolePermissions(@PathVariable Long id) {
        Map<String, Object> data = new HashMap<>();
        data.put("permissions", adminManagementService.getRolePermissions(id));
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AdminRole>> createRole(@RequestBody Map<String, Object> request,
                                                            HttpServletRequest servletRequest) {
        try {
            AdminRole role = adminManagementService.createRole(request);
            adminOperationLogService.recordSafely(null, readText(request, "operator"), "admin", "create_role",
                    "admin_role", String.valueOf(role.getId()), clientIp(servletRequest), request, "SUCCESS", "创建角色");
            return ResponseEntity.ok(ApiResponse.success(role));
        } catch (Exception e) {
            log.warn("创建角色失败", e);
            return ResponseEntity.ok(ApiResponse.badRequest(e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<AdminRole>> updateRole(@PathVariable Long id,
                                                            @RequestBody Map<String, Object> request,
                                                            HttpServletRequest servletRequest) {
        try {
            AdminRole role = adminManagementService.updateRole(id, request);
            adminOperationLogService.recordSafely(null, readText(request, "operator"), "admin", "update_role",
                    "admin_role", String.valueOf(id), clientIp(servletRequest), request, "SUCCESS", "更新角色");
            return ResponseEntity.ok(ApiResponse.success(role));
        } catch (Exception e) {
            log.warn("更新角色失败: id={}", id, e);
            return ResponseEntity.ok(ApiResponse.badRequest(e.getMessage()));
        }
    }

    @PutMapping("/{id}/permissions")
    public ResponseEntity<ApiResponse<Map<String, Object>>> setRolePermissions(@PathVariable Long id,
                                                                              @RequestBody Map<String, Object> request,
                                                                              HttpServletRequest servletRequest) {
        try {
            adminManagementService.setRolePermissions(id, readLongList(request.get("permissionIds")));
            adminOperationLogService.recordSafely(null, readText(request, "operator"), "admin", "set_role_permissions",
                    "admin_role", String.valueOf(id), clientIp(servletRequest), request, "SUCCESS", "设置角色权限");
            Map<String, Object> data = new HashMap<>();
            data.put("permissions", adminManagementService.getRolePermissions(id));
            return ResponseEntity.ok(ApiResponse.success(data));
        } catch (Exception e) {
            log.warn("设置角色权限失败: id={}", id, e);
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
