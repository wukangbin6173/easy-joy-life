package com.easyjoylife.controller;

import com.easyjoylife.entity.UserPoints;
import com.easyjoylife.entity.UserWallet;
import com.easyjoylife.entity.WalletTransaction;
import com.easyjoylife.service.PaymentService;
import com.easyjoylife.service.PointsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 钱包 + 积分控制器（自有业务，不走商起点）
 */
@Slf4j
@RestController
@RequestMapping("/api/wallet")
@RequiredArgsConstructor
public class WalletController {

    private final PaymentService paymentService;
    private final PointsService pointsService;

    // ========== 钱包 ==========

    /** 获取用户钱包信息 */
    @GetMapping("/{userId}")
    public ResponseEntity<Map<String, Object>> getWallet(@PathVariable Long userId) {
        Map<String, Object> response = new HashMap<>();
        try {
            UserWallet wallet = paymentService.getUserWallet(userId);
            UserPoints points = pointsService.getUserPoints(userId);

            response.put("success", true);
            response.put("wallet", wallet);
            response.put("points", points.getPoints());
            response.put("totalEarnedPoints", points.getTotalEarned());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("获取钱包失败: userId={}", userId, e);
            response.put("success", false);
            response.put("message", "获取钱包失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    /** 获取交易记录 */
    @GetMapping("/{userId}/transactions")
    public ResponseEntity<Map<String, Object>> getTransactions(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "50") Integer limit) {
        Map<String, Object> response = new HashMap<>();
        try {
            List<WalletTransaction> transactions = paymentService.getUserTransactions(userId);
            response.put("success", true);
            response.put("transactions", transactions);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("获取交易记录失败: userId={}", userId, e);
            response.put("success", false);
            response.put("message", "获取交易记录失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    /** 创建充值订单 */
    @PostMapping("/recharge")
    public ResponseEntity<Map<String, Object>> createRecharge(@RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();
        try {
            Long userId = Long.valueOf(request.get("userId").toString());
            BigDecimal amount = new BigDecimal(request.get("amount").toString());
            String paymentMethod = request.get("paymentMethod").toString();

            if (amount.compareTo(new BigDecimal("0.1")) < 0) {
                response.put("success", false);
                response.put("message", "充值金额不能少于0.1元");
                return ResponseEntity.ok(response);
            }
            if (amount.compareTo(new BigDecimal("10000")) > 0) {
                response.put("success", false);
                response.put("message", "单次充值不能超过10000元");
                return ResponseEntity.ok(response);
            }

            var order = paymentService.createRechargeOrder(userId, amount, paymentMethod);
            response.put("success", true);
            response.put("orderNo", order.getOrderNo());
            response.put("amount", order.getAmount());
            response.put("expireTime", order.getExpireTime());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("创建充值订单失败", e);
            response.put("success", false);
            response.put("message", "创建订单失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    // ========== 积分 ==========

    /** 获取用户积分 */
    @GetMapping("/{userId}/points")
    public ResponseEntity<Map<String, Object>> getPoints(@PathVariable Long userId) {
        Map<String, Object> response = new HashMap<>();
        try {
            UserPoints points = pointsService.getUserPoints(userId);
            response.put("success", true);
            response.put("points", points.getPoints());
            response.put("totalEarned", points.getTotalEarned());
            response.put("totalUsed", points.getTotalUsed());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("获取积分失败: userId={}", userId, e);
            response.put("success", false);
            response.put("message", "获取积分失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    /** 获取积分变动记录 */
    @GetMapping("/{userId}/points/transactions")
    public ResponseEntity<Map<String, Object>> getPointsTransactions(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "20") Integer size) {
        Map<String, Object> response = new HashMap<>();
        try {
            var transactions = pointsService.getTransactions(userId, page, size);
            response.put("success", true);
            response.put("transactions", transactions);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("获取积分记录失败: userId={}", userId, e);
            response.put("success", false);
            response.put("message", "获取积分记录失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    /** 获取当前积分返还比例 */
    @GetMapping("/points/earn-rate")
    public ResponseEntity<Map<String, Object>> getEarnRate() {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("earnRate", pointsService.getEarnRate());
        return ResponseEntity.ok(response);
    }

    /** 设置积分返还比例（管理后台） */
    @PostMapping("/points/earn-rate")
    public ResponseEntity<Map<String, Object>> setEarnRate(@RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();
        try {
            BigDecimal rate = new BigDecimal(request.get("earnRate").toString());
            if (rate.compareTo(BigDecimal.ZERO) < 0 || rate.compareTo(new BigDecimal("100")) > 0) {
                response.put("success", false);
                response.put("message", "比例必须在0-100之间");
                return ResponseEntity.ok(response);
            }
            pointsService.setEarnRate(rate);
            response.put("success", true);
            response.put("message", "设置成功");
            response.put("earnRate", rate);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("设置积分比例失败", e);
            response.put("success", false);
            response.put("message", "设置失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }
}
