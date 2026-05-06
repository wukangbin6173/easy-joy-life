package com.easyjoylife.controller;

import com.easyjoylife.common.ApiResponse;
import com.easyjoylife.entity.AdminPermission;
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
@RequestMapping("/api/admin/permissions")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AdminPermissionController {

    private final AdminManagementService adminManagementService;
    private final AdminOperationLogService adminOperationLogService;

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> listPermissions(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String module,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "1") int pageNo,
            @RequestParam(defaultValue = "100") int pageSize) {
        Page<AdminPermission> page = adminManagementService.searchPermissions(keyword, module, status, pageNo, pageSize);
        return ResponseEntity.ok(ApiResponse.success(pageData(page)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AdminPermission>> createPermission(@RequestBody Map<String, Object> request,
                                                                        HttpServletRequest servletRequest) {
        try {
            AdminPermission permission = adminManagementService.createPermission(request);
            adminOperationLogService.recordSafely(null, readText(request, "operator"), "admin", "create_permission",
                    "admin_permission", String.valueOf(permission.getId()), clientIp(servletRequest), request, "SUCCESS", "创建权限");
            return ResponseEntity.ok(ApiResponse.success(permission));
        } catch (Exception e) {
            log.warn("创建权限失败", e);
            return ResponseEntity.ok(ApiResponse.badRequest(e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<AdminPermission>> updatePermission(@PathVariable Long id,
                                                                        @RequestBody Map<String, Object> request,
                                                                        HttpServletRequest servletRequest) {
        try {
            AdminPermission permission = adminManagementService.updatePermission(id, request);
            adminOperationLogService.recordSafely(null, readText(request, "operator"), "admin", "update_permission",
                    "admin_permission", String.valueOf(id), clientIp(servletRequest), request, "SUCCESS", "更新权限");
            return ResponseEntity.ok(ApiResponse.success(permission));
        } catch (Exception e) {
            log.warn("更新权限失败: id={}", id, e);
            return ResponseEntity.ok(ApiResponse.badRequest(e.getMessage()));
        }
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
