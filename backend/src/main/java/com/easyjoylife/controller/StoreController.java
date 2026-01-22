package com.easyjoylife.controller;

import com.easyjoylife.common.ApiResponse;
import com.easyjoylife.entity.Store;
import com.easyjoylife.service.StoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * 门店控制器
 */
@RestController
@RequestMapping("/api/stores")
@CrossOrigin(origins = "*") // 允许跨域
public class StoreController {
    
    @Autowired
    private StoreService storeService;
    
    /**
     * 获取所有有效门店
     */
    @GetMapping
    public ApiResponse<List<Store>> getAllStores() {
        try {
            List<Store> stores = storeService.getAllActiveStores();
            return ApiResponse.success(stores);
        } catch (Exception e) {
            return ApiResponse.error("获取门店列表失败: " + e.getMessage());
        }
    }
    
    /**
     * 根据ID获取门店详情
     */
    @GetMapping("/{id}")
    public ApiResponse<Store> getStoreById(@PathVariable Long id) {
        try {
            Optional<Store> store = storeService.getStoreById(id);
            if (store.isPresent()) {
                return ApiResponse.success(store.get());
            } else {
                return ApiResponse.notFound("门店不存在");
            }
        } catch (Exception e) {
            return ApiResponse.error("获取门店详情失败: " + e.getMessage());
        }
    }
    
    /**
     * 搜索门店
     */
    @GetMapping("/search")
    public ApiResponse<List<Store>> searchStores(@RequestParam(required = false) String keyword) {
        try {
            List<Store> stores = storeService.searchStores(keyword);
            return ApiResponse.success(stores);
        } catch (Exception e) {
            return ApiResponse.error("搜索门店失败: " + e.getMessage());
        }
    }
    
    /**
     * 创建门店
     */
    @PostMapping
    public ApiResponse<Store> createStore(@RequestBody Store store) {
        try {
            Store createdStore = storeService.createStore(store);
            return ApiResponse.success("门店创建成功", createdStore);
        } catch (Exception e) {
            return ApiResponse.error("创建门店失败: " + e.getMessage());
        }
    }
    
    /**
     * 更新门店
     */
    @PutMapping("/{id}")
    public ApiResponse<Store> updateStore(@PathVariable Long id, @RequestBody Store store) {
        try {
            Store updatedStore = storeService.updateStore(id, store);
            if (updatedStore != null) {
                return ApiResponse.success("门店更新成功", updatedStore);
            } else {
                return ApiResponse.notFound("门店不存在");
            }
        } catch (Exception e) {
            return ApiResponse.error("更新门店失败: " + e.getMessage());
        }
    }
    
    /**
     * 删除门店
     */
    @DeleteMapping("/{id}")
    public ApiResponse<String> deleteStore(@PathVariable Long id) {
        try {
            boolean deleted = storeService.deleteStore(id);
            if (deleted) {
                return ApiResponse.success("门店删除成功");
            } else {
                return ApiResponse.notFound("门店不存在");
            }
        } catch (Exception e) {
            return ApiResponse.error("删除门店失败: " + e.getMessage());
        }
    }
    
    /**
     * 管理后台：获取所有门店（包括禁用的）
     */
    @GetMapping("/admin/all")
    public ApiResponse<List<Store>> getAllStoresForAdmin() {
        try {
            List<Store> stores = storeService.getAllStores();
            return ApiResponse.success(stores);
        } catch (Exception e) {
            return ApiResponse.error("获取门店列表失败: " + e.getMessage());
        }
    }
}