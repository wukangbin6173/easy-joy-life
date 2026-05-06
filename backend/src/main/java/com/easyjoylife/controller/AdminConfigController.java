package com.easyjoylife.controller;

import com.easyjoylife.common.ApiResponse;
import com.easyjoylife.entity.SystemConfig;
import com.easyjoylife.repository.SystemConfigRepository;
import com.easyjoylife.service.AdminOperationLogService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/admin/configs")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AdminConfigController {

    private final SystemConfigRepository systemConfigRepository;
    private final AdminOperationLogService adminOperationLogService;

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> listConfigs(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "1") int pageNo,
            @RequestParam(defaultValue = "50") int pageSize) {
        Page<SystemConfig> page = systemConfigRepository.search(emptyToNull(keyword),
                PageRequest.of(Math.max(pageNo - 1, 0), pageSize));
        return ResponseEntity.ok(ApiResponse.success(pageData(page)));
    }

    @GetMapping("/{configKey}")
    public ResponseEntity<ApiResponse<SystemConfig>> getConfig(@PathVariable String configKey) {
        return systemConfigRepository.findByConfigKey(configKey)
                .map(config -> ResponseEntity.ok(ApiResponse.success(config)))
                .orElseGet(() -> ResponseEntity.ok(ApiResponse.notFound("配置不存在")));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<SystemConfig>> saveConfig(@RequestBody Map<String, Object> request,
                                                               HttpServletRequest servletRequest) {
        try {
            String key = requiredText(request, "configKey");
            SystemConfig config = systemConfigRepository.findByConfigKey(key).orElseGet(SystemConfig::new);
            config.setConfigKey(key);
            config.setConfigValue(requiredText(request, "configValue"));
            config.setDescription(readText(request, "description"));
            SystemConfig saved = systemConfigRepository.save(config);
            adminOperationLogService.recordSafely(null, readText(request, "operator"), "config", "save_config",
                    "system_config", key, clientIp(servletRequest), request, "SUCCESS", "保存配置");
            return ResponseEntity.ok(ApiResponse.success(saved));
        } catch (Exception e) {
            log.warn("保存配置失败", e);
            return ResponseEntity.ok(ApiResponse.badRequest(e.getMessage()));
        }
    }

    @DeleteMapping("/{configKey}")
    public ResponseEntity<ApiResponse<Void>> deleteConfig(@PathVariable String configKey,
                                                         @RequestParam(required = false) String operator,
                                                         HttpServletRequest servletRequest) {
        return systemConfigRepository.findByConfigKey(configKey)
                .map(config -> {
                    systemConfigRepository.delete(config);
                    adminOperationLogService.recordSafely(null, operator, "config", "delete_config",
                            "system_config", configKey, clientIp(servletRequest), null, "SUCCESS", "删除配置");
                    return ResponseEntity.ok(ApiResponse.<Void>success());
                })
                .orElseGet(() -> ResponseEntity.ok(ApiResponse.notFound("配置不存在")));
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

    private String requiredText(Map<String, Object> request, String key) {
        String value = readText(request, key);
        if (value == null) {
            throw new IllegalArgumentException(key + "不能为空");
        }
        return value;
    }

    private String readText(Map<String, Object> request, String key) {
        Object value = request.get(key);
        if (value == null) {
            return null;
        }
        String text = value.toString().trim();
        return text.isEmpty() ? null : text;
    }

    private String emptyToNull(String value) {
        return value == null || value.trim().isEmpty() ? null : value.trim();
    }

    private String clientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.trim().isEmpty()) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
