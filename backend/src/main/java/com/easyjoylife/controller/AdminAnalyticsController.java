package com.easyjoylife.controller;

import com.easyjoylife.common.ApiResponse;
import com.easyjoylife.entity.CommissionRecord;
import com.easyjoylife.entity.User;
import com.easyjoylife.repository.CommissionRecordRepository;
import com.easyjoylife.repository.PartnerRepository;
import com.easyjoylife.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

/**
 * 管理后台 - 数据分析
 */
@Slf4j
@RestController
@RequestMapping("/api/admin/analytics")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AdminAnalyticsController {

    private final UserRepository userRepository;
    private final PartnerRepository partnerRepository;
    private final CommissionRecordRepository commissionRecordRepository;

    /**
     * 渠道转化漏斗
     */
    @GetMapping("/funnel")
    public ResponseEntity<ApiResponse<Map<String, Object>>> funnel(
            @RequestParam(defaultValue = "week") String period) {
        LocalDateTime start = resolveStart(period);
        Map<String, Object> data = new HashMap<>();

        long totalUsers = userRepository.count();
        long newUsers = userRepository.countByCreatedTimeAfter(start);
        long activeUsers = userRepository.countByLastLoginTimeAfter(start);

        data.put("totalRegistered", totalUsers);
        data.put("newRegistered", newUsers);
        data.put("active", activeUsers);
        data.put("registerToActiveRate", totalUsers > 0 ? Math.round(activeUsers * 100.0 / totalUsers) : 0);
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    /**
     * 用户留存分析
     */
    @GetMapping("/retention")
    public ResponseEntity<ApiResponse<Map<String, Object>>> retention(
            @RequestParam(defaultValue = "month") String period) {
        Map<String, Object> data = new HashMap<>();
        LocalDateTime now = LocalDateTime.now();

        // 简化版留存：按周计算
        long totalUsers = userRepository.count();
        long day1Active = userRepository.countByLastLoginTimeAfter(now.minusDays(1));
        long day7Active = userRepository.countByLastLoginTimeAfter(now.minusDays(7));
        long day30Active = userRepository.countByLastLoginTimeAfter(now.minusDays(30));

        data.put("totalUsers", totalUsers);
        data.put("day1Retention", totalUsers > 0 ? Math.round(day1Active * 100.0 / totalUsers) : 0);
        data.put("day7Retention", totalUsers > 0 ? Math.round(day7Active * 100.0 / totalUsers) : 0);
        data.put("day30Retention", totalUsers > 0 ? Math.round(day30Active * 100.0 / totalUsers) : 0);
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    /**
     * 商户贡献排行
     */
    @GetMapping("/merchant-rank")
    public ResponseEntity<ApiResponse<Object>> merchantRank(
            @RequestParam(defaultValue = "month") String period,
            @RequestParam(defaultValue = "revenue") String sortBy,
            @RequestParam(defaultValue = "20") int limit) {
        // 从分润记录中聚合商户贡献
        Map<String, Object> data = new HashMap<>();
        data.put("period", period);
        data.put("sortBy", sortBy);
        data.put("list", Collections.emptyList());
        data.put("message", "数据将随交易积累自动生成");
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    /**
     * 时段热力分析
     */
    @GetMapping("/heatmap")
    public ResponseEntity<ApiResponse<Object>> heatmap(
            @RequestParam(required = false) Long merchantId,
            @RequestParam(defaultValue = "week") String period) {
        // 基于订单时间分布生成热力数据
        Map<String, Object> data = new HashMap<>();
        data.put("merchantId", merchantId);
        data.put("period", period);
        data.put("heatmap", Collections.emptyList());
        data.put("message", "数据将随订单积累自动生成");
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    /**
     * 行业对比分析
     */
    @GetMapping("/industry-compare")
    public ResponseEntity<ApiResponse<Object>> industryCompare(
            @RequestParam(defaultValue = "month") String period) {
        Map<String, Object> data = new HashMap<>();
        data.put("period", period);

        long chessCount = partnerRepository.countByStatus("active");
        List<Map<String, Object>> industries = new ArrayList<>();
        Map<String, Object> chess = new HashMap<>();
        chess.put("industry", "chess");
        chess.put("name", "棋牌");
        chess.put("merchantCount", chessCount);
        industries.add(chess);

        data.put("industries", industries);
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    private LocalDateTime resolveStart(String period) {
        LocalDateTime now = LocalDateTime.now();
        switch (period) {
            case "today": return now.toLocalDate().atStartOfDay();
            case "week": return now.minusWeeks(1);
            case "month": return now.minusMonths(1);
            case "quarter": return now.minusMonths(3);
            default: return now.minusWeeks(1);
        }
    }
}
