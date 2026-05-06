package com.easyjoylife.controller;

import com.easyjoylife.sqd.SqdBillingService;
import com.easyjoylife.sqd.SqdResponse;
import com.easyjoylife.sqd.SqdStatisticsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * 管理后台经营看板代理层。
 * 商起点能提供的数据全部实时透传，不在本地落业务缓存。
 */
@Slf4j
@RestController
@RequestMapping("/api/admin/dashboard")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AdminDashboardController {

    private final SqdStatisticsService sqdStatisticsService;
    private final SqdBillingService sqdBillingService;

    @GetMapping("/overview")
    public ResponseEntity<Map<String, Object>> overview(@RequestParam Map<String, String> query) {
        return wrap(() -> sqdStatisticsService.overview(toObjectMap(query)), "获取经营概览失败");
    }

    @GetMapping("/sales")
    public ResponseEntity<Map<String, Object>> sales(@RequestParam Map<String, String> query) {
        return wrap(() -> sqdStatisticsService.sales(toObjectMap(query)), "获取销售报表失败");
    }

    @GetMapping("/customers")
    public ResponseEntity<Map<String, Object>> customers(@RequestParam Map<String, String> query) {
        return wrap(() -> sqdStatisticsService.customers(toObjectMap(query)), "获取客户分析失败");
    }

    @GetMapping("/channels")
    public ResponseEntity<Map<String, Object>> channels(@RequestParam Map<String, String> query) {
        return wrap(() -> sqdStatisticsService.channels(toObjectMap(query)), "获取渠道分析失败");
    }

    @GetMapping("/bookings")
    public ResponseEntity<Map<String, Object>> bookings(@RequestParam Map<String, String> query) {
        return wrap(() -> sqdStatisticsService.bookings(toObjectMap(query)), "获取预约分析失败");
    }

    @GetMapping("/billing")
    public ResponseEntity<Map<String, Object>> billingDashboard(@RequestParam Map<String, String> query) {
        return wrap(() -> sqdBillingService.dashboard(toObjectMap(query)), "获取计费看板失败");
    }

    private ResponseEntity<Map<String, Object>> wrap(SqdCall call, String fallbackMessage) {
        Map<String, Object> response = new HashMap<>();
        try {
            SqdResponse sqd = call.call();
            if (sqd.isSuccess()) {
                response.put("success", true);
                response.put("data", sqd.getData());
            } else {
                response.put("success", false);
                response.put("message", sqd.getMsg());
            }
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error(fallbackMessage, e);
            response.put("success", false);
            response.put("message", fallbackMessage + ": " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    private Map<String, Object> toObjectMap(Map<String, String> query) {
        Map<String, Object> params = new HashMap<>();
        query.forEach((key, value) -> {
            if (value != null && !value.trim().isEmpty()) {
                params.put(key, value.trim());
            }
        });
        return params;
    }

    private interface SqdCall {
        SqdResponse call();
    }
}
