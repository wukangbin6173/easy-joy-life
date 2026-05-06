package com.easyjoylife.service;

import com.easyjoylife.entity.AdminOperationLog;
import com.easyjoylife.repository.AdminOperationLogRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdminOperationLogService {

    private final AdminOperationLogRepository adminOperationLogRepository;
    private final ObjectMapper objectMapper;

    public AdminOperationLog record(AdminOperationLog logEntity) {
        return adminOperationLogRepository.save(logEntity);
    }

    public void recordSafely(Long adminUserId, String username, String module, String action,
                             String targetType, String targetId, String requestIp,
                             Object requestBody, String resultStatus, String resultMessage) {
        try {
            AdminOperationLog logEntity = new AdminOperationLog();
            logEntity.setAdminUserId(adminUserId);
            logEntity.setUsername(username);
            logEntity.setModule(module);
            logEntity.setAction(action);
            logEntity.setTargetType(targetType);
            logEntity.setTargetId(targetId);
            logEntity.setRequestIp(requestIp);
            logEntity.setRequestBody(requestBody == null ? null : objectMapper.writeValueAsString(requestBody));
            logEntity.setResultStatus(resultStatus);
            logEntity.setResultMessage(resultMessage);
            adminOperationLogRepository.save(logEntity);
        } catch (Exception e) {
            log.warn("记录后台操作日志失败", e);
        }
    }

    public Page<AdminOperationLog> search(String username, String module, String action,
                                          LocalDateTime startTime, LocalDateTime endTime,
                                          int pageNo, int pageSize) {
        return adminOperationLogRepository.search(emptyToNull(username), emptyToNull(module), emptyToNull(action),
                startTime, endTime, PageRequest.of(Math.max(pageNo - 1, 0), pageSize));
    }

    public AdminOperationLog fromRequest(Map<String, Object> request) {
        AdminOperationLog logEntity = new AdminOperationLog();
        logEntity.setAdminUserId(readLong(request.get("adminUserId")));
        logEntity.setUsername(readText(request.get("username")));
        logEntity.setModule(readText(request.get("module")));
        logEntity.setAction(readText(request.get("action")));
        logEntity.setTargetType(readText(request.get("targetType")));
        logEntity.setTargetId(readText(request.get("targetId")));
        logEntity.setHttpMethod(readText(request.get("httpMethod")));
        logEntity.setRequestPath(readText(request.get("requestPath")));
        logEntity.setRequestIp(readText(request.get("requestIp")));
        logEntity.setRequestBody(readText(request.get("requestBody")));
        logEntity.setResultStatus(readText(request.get("resultStatus")));
        logEntity.setResultMessage(readText(request.get("resultMessage")));
        return logEntity;
    }

    private Long readLong(Object value) {
        if (value == null || value.toString().trim().isEmpty()) {
            return null;
        }
        return Long.valueOf(value.toString().trim());
    }

    private String readText(Object value) {
        if (value == null) {
            return null;
        }
        String text = value.toString().trim();
        return text.isEmpty() ? null : text;
    }

    private String emptyToNull(String value) {
        return value == null || value.trim().isEmpty() ? null : value.trim();
    }
}
