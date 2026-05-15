package com.easyjoylife.controller;

import com.easyjoylife.common.ApiResponse;
import com.easyjoylife.entity.Notification;
import com.easyjoylife.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * 管理后台 - 消息通知
 */
@Slf4j
@RestController
@RequestMapping("/api/admin/notifications")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AdminNotificationController {

    private final NotificationRepository notificationRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> list(
            @RequestParam(required = false) String type,
            @RequestParam(defaultValue = "1") int pageNo,
            @RequestParam(defaultValue = "20") int pageSize) {
        Page<Notification> page = notificationRepository.search(emptyToNull(type),
                PageRequest.of(Math.max(pageNo - 1, 0), pageSize));
        return ResponseEntity.ok(ApiResponse.success(pageData(page)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Notification>> create(@RequestBody Map<String, Object> request) {
        try {
            Notification n = new Notification();
            n.setTitle(requiredText(request, "title"));
            n.setContent(requiredText(request, "content"));
            n.setType(requiredText(request, "type"));
            n.setTargetType(requiredText(request, "targetType"));
            if (request.containsKey("targetIds")) n.setTargetIds(String.valueOf(request.get("targetIds")));
            if (request.containsKey("scheduledTime")) {
                String st = request.get("scheduledTime").toString().trim();
                if (!st.isEmpty()) {
                    n.setScheduledTime(parseDateTime(st));
                    n.setStatus(1); // 待发送
                }
            }
            if (n.getScheduledTime() == null) {
                // 立即发送
                n.setStatus(2); // 已发送
                n.setSentTime(LocalDateTime.now());
            }
            Notification saved = notificationRepository.save(n);
            return ResponseEntity.ok(ApiResponse.success(saved));
        } catch (Exception e) {
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

    private String requiredText(Map<String, Object> request, String key) {
        Object value = request.get(key);
        if (value == null || value.toString().trim().isEmpty()) {
            throw new IllegalArgumentException(key + "不能为空");
        }
        return value.toString().trim();
    }

    private String emptyToNull(String value) {
        return value == null || value.trim().isEmpty() ? null : value.trim();
    }

    private LocalDateTime parseDateTime(String text) {
        if (text.length() == 10) return LocalDateTime.parse(text + "T00:00:00");
        if (text.contains("T")) return LocalDateTime.parse(text);
        return LocalDateTime.parse(text.replace(" ", "T"));
    }
}
