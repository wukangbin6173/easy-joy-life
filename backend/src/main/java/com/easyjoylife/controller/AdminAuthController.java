package com.easyjoylife.controller;

import com.easyjoylife.common.ApiResponse;
import com.easyjoylife.service.AdminManagementService;
import com.easyjoylife.service.AdminOperationLogService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/admin/auth")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AdminAuthController {

    private final AdminManagementService adminManagementService;
    private final AdminOperationLogService adminOperationLogService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<Map<String, Object>>> login(@RequestBody Map<String, Object> request,
                                                                  HttpServletRequest servletRequest) {
        String username = text(request.get("username"));
        String password = text(request.get("password"));
        try {
            Map<String, Object> data = adminManagementService.login(username, password, clientIp(servletRequest));
            adminOperationLogService.recordSafely(null, username, "auth", "login",
                    "admin_user", username, clientIp(servletRequest), null, "SUCCESS", "登录成功");
            return ResponseEntity.ok(ApiResponse.success(data));
        } catch (Exception e) {
            log.warn("管理后台登录失败: username={}", username, e);
            adminOperationLogService.recordSafely(null, username, "auth", "login",
                    "admin_user", username, clientIp(servletRequest), null, "FAILED", e.getMessage());
            return ResponseEntity.ok(ApiResponse.error(401, e.getMessage()));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(HttpServletRequest servletRequest) {
        adminManagementService.logout(resolveToken(servletRequest));
        return ResponseEntity.ok(ApiResponse.success());
    }

    private String text(Object value) {
        return value == null ? "" : value.toString().trim();
    }

    private String resolveToken(HttpServletRequest request) {
        String authorization = request.getHeader("Authorization");
        if (authorization != null && authorization.startsWith("Bearer ")) {
            return authorization.substring("Bearer ".length()).trim();
        }
        return request.getHeader("X-Admin-Token");
    }

    private String clientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.trim().isEmpty()) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
