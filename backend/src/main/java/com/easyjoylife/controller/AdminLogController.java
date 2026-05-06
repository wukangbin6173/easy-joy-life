package com.easyjoylife.controller;

import com.easyjoylife.common.ApiResponse;
import com.easyjoylife.entity.AdminOperationLog;
import com.easyjoylife.entity.OpenApiCallLog;
import com.easyjoylife.service.AdminOperationLogService;
import com.easyjoylife.service.OpenApiCallLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/logs")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AdminLogController {

    private final AdminOperationLogService adminOperationLogService;
    private final OpenApiCallLogService openApiCallLogService;

    @GetMapping("/operations")
    public ResponseEntity<ApiResponse<Map<String, Object>>> operationLogs(
            @RequestParam(required = false) String username,
            @RequestParam(required = false) String module,
            @RequestParam(required = false) String action,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime startTime,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime endTime,
            @RequestParam(defaultValue = "1") int pageNo,
            @RequestParam(defaultValue = "20") int pageSize) {
        Page<AdminOperationLog> page = adminOperationLogService.search(
                username, module, action, startTime, endTime, pageNo, pageSize);
        return ResponseEntity.ok(ApiResponse.success(pageData(page)));
    }

    @PostMapping("/operations")
    public ResponseEntity<ApiResponse<AdminOperationLog>> recordOperation(@RequestBody Map<String, Object> request) {
        AdminOperationLog saved = adminOperationLogService.record(adminOperationLogService.fromRequest(request));
        return ResponseEntity.ok(ApiResponse.success(saved));
    }

    @GetMapping("/openapi")
    public ResponseEntity<ApiResponse<Map<String, Object>>> openApiLogs(
            @RequestParam(required = false) String provider,
            @RequestParam(required = false) String apiPath,
            @RequestParam(required = false) Boolean success,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime startTime,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime endTime,
            @RequestParam(defaultValue = "1") int pageNo,
            @RequestParam(defaultValue = "20") int pageSize) {
        Page<OpenApiCallLog> page = openApiCallLogService.search(
                provider, apiPath, success, startTime, endTime, pageNo, pageSize);
        return ResponseEntity.ok(ApiResponse.success(pageData(page)));
    }

    @GetMapping("/openapi/status")
    public ResponseEntity<ApiResponse<Map<String, Object>>> openApiStatus(
            @RequestParam(required = false, defaultValue = "SQD") String provider) {
        return ResponseEntity.ok(ApiResponse.success(openApiCallLogService.status(provider)));
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
}
