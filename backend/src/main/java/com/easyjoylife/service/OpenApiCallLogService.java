package com.easyjoylife.service;

import com.easyjoylife.entity.OpenApiCallLog;
import com.easyjoylife.repository.OpenApiCallLogRepository;
import com.easyjoylife.sqd.SqdResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class OpenApiCallLogService {

    private static final String PROVIDER_SQD = "SQD";

    private final OpenApiCallLogRepository openApiCallLogRepository;

    public void recordSqdCall(String httpMethod, String apiPath, String requestPayload,
                              SqdResponse response, long durationMs, String traceId) {
        try {
            OpenApiCallLog logEntity = new OpenApiCallLog();
            logEntity.setProvider(PROVIDER_SQD);
            logEntity.setHttpMethod(httpMethod);
            logEntity.setApiPath(apiPath);
            logEntity.setRequestPayload(requestPayload);
            logEntity.setResponseCode(response != null ? response.getCode() : null);
            logEntity.setResponseMessage(response != null ? response.getMsg() : null);
            logEntity.setSuccess(response != null && response.isSuccess());
            logEntity.setErrorMessage(response != null && !response.isSuccess() ? response.getMsg() : null);
            logEntity.setDurationMs(durationMs);
            logEntity.setTraceId(traceId);
            logEntity.setCalledAt(LocalDateTime.now());
            openApiCallLogRepository.save(logEntity);
        } catch (Exception e) {
            log.warn("记录商起点 OpenAPI 调用日志失败", e);
        }
    }

    public void recordSqdFailure(String httpMethod, String apiPath, String requestPayload,
                                 String errorMessage, long durationMs, String traceId) {
        try {
            OpenApiCallLog logEntity = new OpenApiCallLog();
            logEntity.setProvider(PROVIDER_SQD);
            logEntity.setHttpMethod(httpMethod);
            logEntity.setApiPath(apiPath);
            logEntity.setRequestPayload(requestPayload);
            logEntity.setResponseCode(-1);
            logEntity.setResponseMessage(errorMessage);
            logEntity.setSuccess(false);
            logEntity.setErrorMessage(errorMessage);
            logEntity.setDurationMs(durationMs);
            logEntity.setTraceId(traceId);
            logEntity.setCalledAt(LocalDateTime.now());
            openApiCallLogRepository.save(logEntity);
        } catch (Exception e) {
            log.warn("记录商起点 OpenAPI 异常日志失败", e);
        }
    }

    public Page<OpenApiCallLog> search(String provider, String apiPath, Boolean success,
                                       LocalDateTime startTime, LocalDateTime endTime,
                                       int pageNo, int pageSize) {
        return openApiCallLogRepository.search(emptyToNull(provider), emptyToNull(apiPath), success,
                startTime, endTime, PageRequest.of(Math.max(pageNo - 1, 0), pageSize));
    }

    public Map<String, Object> status(String provider) {
        String resolvedProvider = emptyToNull(provider) == null ? PROVIDER_SQD : provider.trim();
        LocalDateTime since = LocalDateTime.now().minusHours(24);
        Map<String, Object> data = new HashMap<>();
        data.put("provider", resolvedProvider);
        data.put("latest", openApiCallLogRepository.findTopByProviderOrderByCalledAtDesc(resolvedProvider).orElse(null));
        data.put("lastSuccess", openApiCallLogRepository.findTopByProviderAndSuccessOrderByCalledAtDesc(resolvedProvider, true).orElse(null));
        data.put("lastFailure", openApiCallLogRepository.findTopByProviderAndSuccessOrderByCalledAtDesc(resolvedProvider, false).orElse(null));
        data.put("successCount24h", openApiCallLogRepository.countByProviderAndSuccessAndCalledAtAfter(resolvedProvider, true, since));
        data.put("failureCount24h", openApiCallLogRepository.countByProviderAndSuccessAndCalledAtAfter(resolvedProvider, false, since));
        return data;
    }

    private String emptyToNull(String value) {
        return value == null || value.trim().isEmpty() ? null : value.trim();
    }
}
