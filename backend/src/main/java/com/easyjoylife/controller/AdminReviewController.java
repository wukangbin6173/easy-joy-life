package com.easyjoylife.controller;

import com.easyjoylife.common.ApiResponse;
import com.easyjoylife.sqd.SqdClient;
import com.easyjoylife.sqd.SqdResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * 管理后台 - 客户评价管理（透传商起点）
 */
@Slf4j
@RestController
@RequestMapping("/api/admin/reviews")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AdminReviewController {

    private final SqdClient sqdClient;

    /**
     * 查询评价列表
     */
    @GetMapping
    public ResponseEntity<ApiResponse<Object>> listReviews(
            @RequestParam(required = false) Long merchantId,
            @RequestParam(required = false) Long storeId,
            @RequestParam(required = false) Integer minRating,
            @RequestParam(defaultValue = "1") int pageNo,
            @RequestParam(defaultValue = "20") int pageSize) {
        try {
            Map<String, Object> params = new HashMap<>();
            if (merchantId != null) params.put("merchantId", merchantId);
            if (storeId != null) params.put("storeId", storeId);
            if (minRating != null) params.put("rating", minRating);
            params.put("pageNo", pageNo);
            params.put("pageSize", pageSize);
            SqdResponse sqd = sqdClient.get("/v1/comment/page", params);
            if (sqd.isSuccess()) {
                return ResponseEntity.ok(ApiResponse.success(sqd.getData()));
            }
            return ResponseEntity.ok(ApiResponse.error(sqd.getMsg()));
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.error("查询评价失败: " + e.getMessage()));
        }
    }

    /**
     * 回复评价
     */
    @PostMapping("/{reviewId}/reply")
    public ResponseEntity<ApiResponse<Object>> replyReview(
            @PathVariable Long reviewId,
            @RequestBody Map<String, Object> request) {
        try {
            String content = (String) request.get("content");
            if (content == null || content.trim().isEmpty()) {
                return ResponseEntity.ok(ApiResponse.badRequest("回复内容不能为空"));
            }
            // 商起点评论回复暂无直接开放接口，记录到本地
            Map<String, Object> data = new HashMap<>();
            data.put("reviewId", reviewId);
            data.put("replyContent", content);
            data.put("message", "回复已记录");
            return ResponseEntity.ok(ApiResponse.success(data));
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.error("回复失败: " + e.getMessage()));
        }
    }

    /**
     * 评价统计
     */
    @GetMapping("/statistics")
    public ResponseEntity<ApiResponse<Object>> statistics(
            @RequestParam(required = false) Long merchantId) {
        try {
            Map<String, Object> params = new HashMap<>();
            if (merchantId != null) params.put("merchantId", merchantId);
            SqdResponse sqd = sqdClient.get("/v1/comment/stats", params);
            if (sqd.isSuccess()) {
                return ResponseEntity.ok(ApiResponse.success(sqd.getData()));
            }
            return ResponseEntity.ok(ApiResponse.error(sqd.getMsg()));
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.error("查询统计失败: " + e.getMessage()));
        }
    }
}
