package com.easyjoylife.controller;

import com.easyjoylife.common.ApiResponse;
import com.easyjoylife.entity.Promotion;
import com.easyjoylife.repository.PromotionRepository;
import com.easyjoylife.sqd.SqdResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.NoSuchElementException;

/**
 * 管理后台 - 营销活动 + 团购券
 */
@Slf4j
@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AdminPromotionController {

    private final PromotionRepository promotionRepository;

    // ========== 推广活动（雀玺自有） ==========

    @GetMapping("/promotions")
    public ResponseEntity<ApiResponse<Map<String, Object>>> listPromotions(
            @RequestParam(required = false) Integer status,
            @RequestParam(required = false) String type,
            @RequestParam(defaultValue = "1") int pageNo,
            @RequestParam(defaultValue = "20") int pageSize) {
        Page<Promotion> page = promotionRepository.search(status, emptyToNull(type),
                PageRequest.of(Math.max(pageNo - 1, 0), pageSize));
        return ResponseEntity.ok(ApiResponse.success(pageData(page)));
    }

    @PostMapping("/promotions")
    public ResponseEntity<ApiResponse<Promotion>> createPromotion(@RequestBody Map<String, Object> request) {
        try {
            Promotion promo = new Promotion();
            promo.setTitle(requiredText(request, "title"));
            promo.setType(requiredText(request, "type"));
            promo.setStartTime(parseDateTime(requiredText(request, "startTime")));
            promo.setEndTime(parseDateTime(requiredText(request, "endTime")));
            if (request.containsKey("rules")) promo.setRules(String.valueOf(request.get("rules")));
            if (request.containsKey("targetMerchants")) promo.setTargetMerchants(String.valueOf(request.get("targetMerchants")));
            if (request.containsKey("budget")) promo.setBudget(Integer.valueOf(request.get("budget").toString()));
            if (request.containsKey("status")) promo.setStatus(Integer.valueOf(request.get("status").toString()));
            if (request.containsKey("remark")) promo.setRemark(readText(request, "remark"));
            Promotion saved = promotionRepository.save(promo);
            return ResponseEntity.ok(ApiResponse.success(saved));
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.badRequest(e.getMessage()));
        }
    }

    @PutMapping("/promotions/{promotionId}")
    public ResponseEntity<ApiResponse<Promotion>> updatePromotion(
            @PathVariable Long promotionId,
            @RequestBody Map<String, Object> request) {
        try {
            Promotion promo = promotionRepository.findById(promotionId)
                    .orElseThrow(() -> new NoSuchElementException("活动不存在"));
            if (request.containsKey("title")) promo.setTitle(readText(request, "title"));
            if (request.containsKey("type")) promo.setType(readText(request, "type"));
            if (request.containsKey("startTime")) promo.setStartTime(parseDateTime(readText(request, "startTime")));
            if (request.containsKey("endTime")) promo.setEndTime(parseDateTime(readText(request, "endTime")));
            if (request.containsKey("rules")) promo.setRules(String.valueOf(request.get("rules")));
            if (request.containsKey("targetMerchants")) promo.setTargetMerchants(String.valueOf(request.get("targetMerchants")));
            if (request.containsKey("budget")) promo.setBudget(Integer.valueOf(request.get("budget").toString()));
            if (request.containsKey("status")) promo.setStatus(Integer.valueOf(request.get("status").toString()));
            if (request.containsKey("remark")) promo.setRemark(readText(request, "remark"));
            Promotion saved = promotionRepository.save(promo);
            return ResponseEntity.ok(ApiResponse.success(saved));
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.badRequest(e.getMessage()));
        }
    }

    @GetMapping("/promotions/{promotionId}/statistics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> promotionStats(@PathVariable Long promotionId) {
        Promotion promo = promotionRepository.findById(promotionId).orElse(null);
        if (promo == null) {
            return ResponseEntity.ok(ApiResponse.notFound("活动不存在"));
        }
        Map<String, Object> data = new HashMap<>();
        data.put("promotionId", promotionId);
        data.put("title", promo.getTitle());
        data.put("participantCount", promo.getParticipantCount());
        data.put("orderCount", promo.getOrderCount());
        data.put("totalAmount", promo.getTotalAmount());
        data.put("budget", promo.getBudget());
        int spent = promo.getTotalAmount() != null ? promo.getTotalAmount() : 0;
        int budgetVal = promo.getBudget() != null ? promo.getBudget() : 0;
        data.put("roi", budgetVal > 0 ? Math.round(spent * 100.0 / budgetVal) : 0);
        return ResponseEntity.ok(ApiResponse.success(data));
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

    private String readText(Map<String, Object> request, String key) {
        Object value = request.get(key);
        return value == null ? null : value.toString().trim();
    }

    private String emptyToNull(String value) {
        return value == null || value.trim().isEmpty() ? null : value.trim();
    }

    private LocalDateTime parseDateTime(String text) {
        if (text == null) return null;
        text = text.trim();
        if (text.length() == 10) return LocalDateTime.parse(text + "T00:00:00");
        if (text.contains("T")) return LocalDateTime.parse(text);
        return LocalDateTime.parse(text.replace(" ", "T"));
    }
}
