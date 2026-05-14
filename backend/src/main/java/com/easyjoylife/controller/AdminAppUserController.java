package com.easyjoylife.controller;

import com.easyjoylife.common.ApiResponse;
import com.easyjoylife.entity.User;
import com.easyjoylife.entity.WalletTransaction;
import com.easyjoylife.repository.UserRepository;
import com.easyjoylife.service.PaymentService;
import com.easyjoylife.sqd.SqdMemberService;
import com.easyjoylife.sqd.SqdResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

/**
 * 管理后台 - 小程序用户（客户运营）
 */
@Slf4j
@RestController
@RequestMapping("/api/admin/app-users")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AdminAppUserController {

    private final UserRepository userRepository;
    private final PaymentService paymentService;
    private final SqdMemberService sqdMemberService;

    /**
     * 查询小程序用户列表
     */
    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> listUsers(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "lastActive") String sortBy,
            @RequestParam(defaultValue = "1") int pageNo,
            @RequestParam(defaultValue = "20") int pageSize) {
        Sort sort = "registerTime".equals(sortBy)
                ? Sort.by(Sort.Direction.DESC, "createdTime")
                : Sort.by(Sort.Direction.DESC, "lastLoginTime");
        Page<User> page = userRepository.search(emptyToNull(keyword), emptyToNull(status),
                PageRequest.of(Math.max(pageNo - 1, 0), pageSize, sort));
        return ResponseEntity.ok(ApiResponse.success(pageData(page)));
    }

    /**
     * 查询用户详情
     */
    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getUser(@PathVariable Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (!userOpt.isPresent()) {
            return ResponseEntity.ok(ApiResponse.notFound("用户不存在"));
        }
        User user = userOpt.get();
        Map<String, Object> data = new HashMap<>();
        data.put("user", user);

        // 消费统计
        try {
            List<WalletTransaction> transactions = paymentService.getUserTransactions(userId);
            long totalSpend = transactions.stream()
                    .filter(t -> "CONSUME".equals(t.getTransactionType()))
                    .mapToLong(t -> t.getAmount().abs().multiply(java.math.BigDecimal.valueOf(100)).longValue())
                    .sum();
            data.put("totalOrders", transactions.size());
            data.put("totalSpend", totalSpend);
        } catch (Exception e) {
            data.put("totalOrders", 0);
            data.put("totalSpend", 0);
        }

        return ResponseEntity.ok(ApiResponse.success(data));
    }

    /**
     * 查询用户消费记录
     */
    @GetMapping("/{userId}/orders")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getUserOrders(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "1") int pageNo,
            @RequestParam(defaultValue = "20") int pageSize) {
        try {
            List<WalletTransaction> all = paymentService.getUserTransactions(userId);
            int total = all.size();
            int from = Math.min((pageNo - 1) * pageSize, total);
            int to = Math.min(from + pageSize, total);
            List<WalletTransaction> paged = all.subList(from, to);

            Map<String, Object> data = new HashMap<>();
            data.put("list", paged);
            data.put("total", total);
            data.put("pageNo", pageNo);
            data.put("pageSize", pageSize);
            return ResponseEntity.ok(ApiResponse.success(data));
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.error("查询失败: " + e.getMessage()));
        }
    }

    /**
     * 查询用户跨商户会员余额
     */
    @GetMapping("/{userId}/memberships")
    public ResponseEntity<ApiResponse<Object>> getUserMemberships(@PathVariable Long userId) {
        try {
            Optional<User> userOpt = userRepository.findById(userId);
            if (!userOpt.isPresent()) {
                return ResponseEntity.ok(ApiResponse.notFound("用户不存在"));
            }
            String externalUserId = String.valueOf(userId);
            SqdResponse sqd = sqdMemberService.listMembers(externalUserId, null, 1, 50);
            if (sqd.isSuccess()) {
                return ResponseEntity.ok(ApiResponse.success(sqd.getData()));
            }
            return ResponseEntity.ok(ApiResponse.error(sqd.getMsg()));
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.error("查询失败: " + e.getMessage()));
        }
    }

    /**
     * 封禁/解封用户
     */
    @PostMapping("/{userId}/status")
    public ResponseEntity<ApiResponse<User>> updateUserStatus(
            @PathVariable Long userId,
            @RequestBody Map<String, Object> request) {
        try {
            Optional<User> userOpt = userRepository.findById(userId);
            if (!userOpt.isPresent()) {
                return ResponseEntity.ok(ApiResponse.notFound("用户不存在"));
            }
            User user = userOpt.get();
            String action = readText(request, "action");
            if ("ban".equals(action)) {
                user.setStatus("BANNED");
            } else if ("unban".equals(action)) {
                user.setStatus(User.Status.ACTIVE);
            } else {
                return ResponseEntity.ok(ApiResponse.badRequest("action必须为ban或unban"));
            }
            userRepository.save(user);
            return ResponseEntity.ok(ApiResponse.success(user));
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.error("操作失败: " + e.getMessage()));
        }
    }

    /**
     * 用户统计概览
     */
    @GetMapping("/statistics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> statistics(
            @RequestParam(defaultValue = "week") String period) {
        Map<String, Object> data = new HashMap<>();
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime start = "month".equals(period) ? now.minusMonths(1) : now.minusWeeks(1);

        long totalUsers = userRepository.count();
        long newUsers = userRepository.countByCreatedTimeAfter(start);
        long activeUsers = userRepository.countByLastLoginTimeAfter(start);

        data.put("totalUsers", totalUsers);
        data.put("newUsers", newUsers);
        data.put("activeUsers", activeUsers);
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

    private String readText(Map<String, Object> request, String key) {
        Object value = request.get(key);
        return value == null ? null : value.toString().trim();
    }

    private String emptyToNull(String value) {
        return value == null || value.trim().isEmpty() ? null : value.trim();
    }
}
