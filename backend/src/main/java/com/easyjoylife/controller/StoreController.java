package com.easyjoylife.controller;

import com.easyjoylife.sqd.SqdMerchantService;
import com.easyjoylife.sqd.SqdResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * 门店控制器 - 数据来源：商起点开放平台
 */
@Slf4j
@RestController
@RequestMapping("/api/stores")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class StoreController {

    private final SqdMerchantService sqdMerchantService;

    /**
     * 获取商户下的门店列表
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getStores(
            @RequestParam Long merchantId,
            @RequestParam(defaultValue = "1") Integer pageNo,
            @RequestParam(defaultValue = "20") Integer pageSize) {
        Map<String, Object> response = new HashMap<>();
        try {
            SqdResponse sqd = sqdMerchantService.listStores(merchantId, pageNo, pageSize);
            if (sqd.isSuccess()) {
                response.put("success", true);
                response.put("data", sqd.getData());
            } else {
                response.put("success", false);
                response.put("message", sqd.getMsg());
            }
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("获取门店列表失败", e);
            response.put("success", false);
            response.put("message", "获取门店列表失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    /**
     * 获取门店详情
     */
    @GetMapping("/{storeId}")
    public ResponseEntity<Map<String, Object>> getStore(@PathVariable Long storeId) {
        Map<String, Object> response = new HashMap<>();
        try {
            SqdResponse sqd = sqdMerchantService.getStore(storeId);
            if (sqd.isSuccess()) {
                response.put("success", true);
                response.put("data", sqd.getData());
            } else {
                response.put("success", false);
                response.put("message", sqd.getMsg());
            }
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("获取门店详情失败: storeId={}", storeId, e);
            response.put("success", false);
            response.put("message", "获取门店详情失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    /**
     * 查询附近门店
     */
    @GetMapping("/nearby")
    public ResponseEntity<Map<String, Object>> nearbyStores(
            @RequestParam Double longitude,
            @RequestParam Double latitude,
            @RequestParam(required = false) Integer radius) {
        Map<String, Object> response = new HashMap<>();
        try {
            SqdResponse sqd = sqdMerchantService.nearbyStores(longitude, latitude, radius);
            if (sqd.isSuccess()) {
                response.put("success", true);
                response.put("data", sqd.getData());
            } else {
                response.put("success", false);
                response.put("message", sqd.getMsg());
            }
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("查询附近门店失败", e);
            response.put("success", false);
            response.put("message", "查询附近门店失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    /**
     * 获取门店营业时间
     */
    @GetMapping("/{storeId}/business-hours")
    public ResponseEntity<Map<String, Object>> getBusinessHours(@PathVariable Long storeId) {
        Map<String, Object> response = new HashMap<>();
        try {
            SqdResponse sqd = sqdMerchantService.getBusinessHours(storeId);
            if (sqd.isSuccess()) {
                response.put("success", true);
                response.put("data", sqd.getData());
            } else {
                response.put("success", false);
                response.put("message", sqd.getMsg());
            }
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("获取营业时间失败: storeId={}", storeId, e);
            response.put("success", false);
            response.put("message", "获取营业时间失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    /**
     * 创建门店
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> createStore(@RequestBody Map<String, Object> body) {
        Map<String, Object> response = new HashMap<>();
        try {
            SqdResponse sqd = sqdMerchantService.createStore(body);
            if (sqd.isSuccess()) {
                response.put("success", true);
                response.put("message", "门店创建成功");
                response.put("data", sqd.getData());
            } else {
                response.put("success", false);
                response.put("message", sqd.getMsg());
            }
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("创建门店失败", e);
            response.put("success", false);
            response.put("message", "创建门店失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    /**
     * 更新门店
     */
    @PutMapping("/{storeId}")
    public ResponseEntity<Map<String, Object>> updateStore(
            @PathVariable Long storeId, @RequestBody Map<String, Object> body) {
        Map<String, Object> response = new HashMap<>();
        try {
            SqdResponse sqd = sqdMerchantService.updateStore(storeId, body);
            if (sqd.isSuccess()) {
                response.put("success", true);
                response.put("message", "门店更新成功");
                response.put("data", sqd.getData());
            } else {
                response.put("success", false);
                response.put("message", sqd.getMsg());
            }
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("更新门店失败: storeId={}", storeId, e);
            response.put("success", false);
            response.put("message", "更新门店失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    /**
     * 删除门店
     */
    @DeleteMapping("/{storeId}")
    public ResponseEntity<Map<String, Object>> deleteStore(@PathVariable Long storeId) {
        Map<String, Object> response = new HashMap<>();
        try {
            SqdResponse sqd = sqdMerchantService.deleteStore(storeId);
            if (sqd.isSuccess()) {
                response.put("success", true);
                response.put("message", "门店删除成功");
            } else {
                response.put("success", false);
                response.put("message", sqd.getMsg());
            }
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("删除门店失败: storeId={}", storeId, e);
            response.put("success", false);
            response.put("message", "删除门店失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    /**
     * 查询商户列表
     */
    @GetMapping("/merchants")
    public ResponseEntity<Map<String, Object>> listMerchants(
            @RequestParam(defaultValue = "1") Integer pageNo,
            @RequestParam(defaultValue = "20") Integer pageSize) {
        Map<String, Object> response = new HashMap<>();
        try {
            SqdResponse sqd = sqdMerchantService.listMerchants(pageNo, pageSize);
            if (sqd.isSuccess()) {
                response.put("success", true);
                response.put("data", sqd.getData());
            } else {
                response.put("success", false);
                response.put("message", sqd.getMsg());
            }
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("获取商户列表失败", e);
            response.put("success", false);
            response.put("message", "获取商户列表失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    /**
     * 查询商户详情
     */
    @GetMapping("/merchants/{merchantId}")
    public ResponseEntity<Map<String, Object>> getMerchant(@PathVariable Long merchantId) {
        Map<String, Object> response = new HashMap<>();
        try {
            SqdResponse sqd = sqdMerchantService.getMerchant(merchantId);
            if (sqd.isSuccess()) {
                response.put("success", true);
                response.put("data", sqd.getData());
            } else {
                response.put("success", false);
                response.put("message", sqd.getMsg());
            }
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("获取商户详情失败: merchantId={}", merchantId, e);
            response.put("success", false);
            response.put("message", "获取商户详情失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    /**
     * 商户注册（入驻）
     */
    @PostMapping("/merchants/register")
    public ResponseEntity<Map<String, Object>> registerMerchant(@RequestBody Map<String, Object> body) {
        Map<String, Object> response = new HashMap<>();
        try {
            SqdResponse sqd = sqdMerchantService.registerMerchant(body);
            if (sqd.isSuccess()) {
                response.put("success", true);
                response.put("message", "商户注册成功");
                response.put("data", sqd.getData());
            } else {
                response.put("success", false);
                response.put("message", sqd.getMsg());
            }
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("商户注册失败", e);
            response.put("success", false);
            response.put("message", "商户注册失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }
}
