package com.easyjoylife.controller;

import com.easyjoylife.common.ApiResponse;
import com.easyjoylife.entity.CommissionRecord;
import com.easyjoylife.repository.CommissionRecordRepository;
import com.easyjoylife.sqd.SqdOrderService;
import com.easyjoylife.sqd.SqdResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.Map;

/**
 * 管理后台 - 交易监控与分润 + 订单售后
 */
@Slf4j
@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AdminTransactionController {

    private final CommissionRecordRepository commissionRecordRepository;
    private final SqdOrderService sqdOrderService;

    // ========== 交易流水 ==========

    /**
     * 交易流水查询（透传商起点订单列表）
     */
    @GetMapping("/transactions")
    public ResponseEntity<ApiResponse<Object>> listTransactions(
            @RequestParam(required = false) Long merchantId,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate endDate,
            @RequestParam(defaultValue = "1") int pageNo,
            @RequestParam(defaultValue = "20") int pageSize) {
        try {
            // 透传商起点订单列表
            SqdResponse sqd = sqdOrderService.listOrders(merchantId, null, null, pageNo, pageSize);
            if (sqd.isSuccess()) {
                return ResponseEntity.ok(ApiResponse.success(sqd.getData()));
            }
            return ResponseEntity.ok(ApiResponse.error(sqd.getMsg()));
        } catch (Exception e) {
            log.error("查询交易流水失败", e);
            return ResponseEntity.ok(ApiResponse.error("查询失败: " + e.getMessage()));
        }
    }

    // ========== 分润管理 ==========

    /**
     * 分润明细
     */
    @GetMapping("/commissions")
    public ResponseEntity<ApiResponse<Map<String, Object>>> listCommissions(
            @RequestParam(required = false) Long merchantId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate endDate,
            @RequestParam(defaultValue = "1") int pageNo,
            @RequestParam(defaultValue = "20") int pageSize) {
        LocalDateTime startTime = startDate != null ? startDate.atStartOfDay() : null;
        LocalDateTime endTime = endDate != null ? endDate.atTime(LocalTime.MAX) : null;
        Page<CommissionRecord> page = commissionRecordRepository.search(
                merchantId, emptyToNull(status), startTime, endTime,
                PageRequest.of(Math.max(pageNo - 1, 0), pageSize));
        return ResponseEntity.ok(ApiResponse.success(pageData(page)));
    }

    /**
     * 分润汇总
     */
    @GetMapping("/commissions/summary")
    public ResponseEntity<ApiResponse<Map<String, Object>>> commissionSummary(
            @RequestParam(defaultValue = "month") String period) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime start;
        switch (period) {
            case "today": start = now.toLocalDate().atStartOfDay(); break;
            case "week": start = now.minusWeeks(1); break;
            default: start = now.minusMonths(1); break;
        }

        Map<String, Object> data = new HashMap<>();
        data.put("totalRevenue", commissionRecordRepository.sumAmount(start, now));
        data.put("totalCommission", commissionRecordRepository.sumCommission(start, now));
        data.put("pendingSettlement", commissionRecordRepository.sumCommissionByStatus("pending", start, now));
        data.put("settledAmount", commissionRecordRepository.sumCommissionByStatus("settled", start, now));
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    // ========== 订单售后 ==========

    /**
     * 订单退款
     */
    @PostMapping("/orders/{orderId}/refund")
    public ResponseEntity<ApiResponse<Object>> refundOrder(
            @PathVariable Long orderId,
            @RequestBody Map<String, Object> request) {
        try {
            Long merchantId = requiredLong(request, "merchantId");
            int refundAmount = Integer.parseInt(request.get("refundAmount").toString());
            String reason = readText(request, "reason");

            SqdResponse sqd = sqdOrderService.refundOrder(orderId, merchantId, refundAmount, reason);
            if (sqd.isSuccess()) {
                Map<String, Object> result = new HashMap<>();
                result.put("message", "退款申请已提交");
                result.put("data", sqd.getData());
                return ResponseEntity.ok(ApiResponse.success(result));
            }
            return ResponseEntity.ok(ApiResponse.error(sqd.getMsg()));
        } catch (Exception e) {
            log.error("退款失败: orderId={}", orderId, e);
            return ResponseEntity.ok(ApiResponse.error("退款失败: " + e.getMessage()));
        }
    }

    /**
     * 查询退款记录（透传商起点订单列表，筛选退款状态）
     */
    @GetMapping("/refunds")
    public ResponseEntity<ApiResponse<Object>> listRefunds(
            @RequestParam(required = false) Long merchantId,
            @RequestParam(defaultValue = "1") int pageNo,
            @RequestParam(defaultValue = "20") int pageSize) {
        try {
            // status=4 通常表示退款状态，具体看商起点定义
            SqdResponse sqd = sqdOrderService.listOrders(merchantId, null, 4, pageNo, pageSize);
            if (sqd.isSuccess()) {
                return ResponseEntity.ok(ApiResponse.success(sqd.getData()));
            }
            return ResponseEntity.ok(ApiResponse.error(sqd.getMsg()));
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.error("查询失败: " + e.getMessage()));
        }
    }

    // ========== 资源价格 ==========

    /**
     * 查询资源价格 - 请使用 /api/billing/price 接口
     */
    @GetMapping("/resources/{resourceId}/price")
    public ResponseEntity<ApiResponse<String>> getResourcePrice(
            @PathVariable Long resourceId,
            @RequestParam Long merchantId) {
        return ResponseEntity.ok(ApiResponse.success("请使用 GET /api/billing/price?resourceId=" + resourceId + "&merchantId=" + merchantId));
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

    private Long requiredLong(Map<String, Object> request, String key) {
        Object value = request.get(key);
        if (value == null) throw new IllegalArgumentException(key + "不能为空");
        return Long.valueOf(value.toString().trim());
    }

    private String readText(Map<String, Object> request, String key) {
        Object value = request.get(key);
        return value == null ? null : value.toString().trim();
    }

    private String emptyToNull(String value) {
        return value == null || value.trim().isEmpty() ? null : value.trim();
    }
}
