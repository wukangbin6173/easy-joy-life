package com.easyjoylife.sqd;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

/**
 * 商起点 - 商品数据模块
 */
@Service
@RequiredArgsConstructor
public class SqdProductService {

    private final SqdClient client;

    /** 查询商品列表 */
    public SqdResponse listProducts(Long merchantId, Long categoryId, Integer status,
                                    Integer pageNo, Integer pageSize) {
        Map<String, Object> params = new HashMap<>();
        params.put("merchantId", merchantId);
        params.put("categoryId", categoryId);
        params.put("status", status);
        params.put("pageNo", pageNo);
        params.put("pageSize", pageSize);
        return client.get("/v1/products", params);
    }

    /** 查询商品详情 */
    public SqdResponse getProduct(Long productId) {
        return client.get("/v1/products/" + productId, null);
    }

    /** 搜索商品 */
    public SqdResponse searchProducts(String keyword, Long merchantId, Long categoryId,
                                      Integer minPrice, Integer maxPrice,
                                      String sortField, String sortOrder,
                                      Integer pageNo, Integer pageSize) {
        Map<String, Object> params = new HashMap<>();
        params.put("keyword", keyword);
        params.put("merchantId", merchantId);
        params.put("categoryId", categoryId);
        params.put("minPrice", minPrice);
        params.put("maxPrice", maxPrice);
        params.put("sortField", sortField);
        params.put("sortOrder", sortOrder);
        params.put("pageNo", pageNo);
        params.put("pageSize", pageSize);
        return client.get("/v1/products/search", params);
    }

    /** 查询商品分类列表 */
    public SqdResponse listCategories(Long merchantId) {
        Map<String, Object> params = new HashMap<>();
        params.put("merchantId", merchantId);
        return client.get("/v1/product-categories", params);
    }

    /** 创建商品 */
    public SqdResponse createProduct(Map<String, Object> body) {
        return client.post("/v1/products", body);
    }

    /** 更新商品 */
    public SqdResponse updateProduct(Long productId, Map<String, Object> body) {
        return client.put("/v1/products/" + productId, body);
    }

    /** 删除商品 */
    public SqdResponse deleteProduct(Long productId) {
        return client.delete("/v1/products/" + productId, null);
    }

    /** 商品上架/下架 */
    public SqdResponse updateProductStatus(Long productId, Integer status) {
        Map<String, Object> body = new HashMap<>();
        body.put("status", status);
        return client.put("/v1/products/" + productId + "/status", body);
    }

    /** 创建商品分类 */
    public SqdResponse createCategory(Map<String, Object> body) {
        return client.post("/v1/product-categories", body);
    }

    /** 更新商品分类 */
    public SqdResponse updateCategory(Long categoryId, Long merchantId, Map<String, Object> body) {
        return client.put("/v1/product-categories/" + categoryId + "?merchantId=" + merchantId, body);
    }

    /** 删除商品分类 */
    public SqdResponse deleteCategory(Long categoryId, Long merchantId) {
        return client.delete("/v1/product-categories/" + categoryId + "?merchantId=" + merchantId, null);
    }

    /** 库存入库 */
    public SqdResponse stockIn(Long productId, Map<String, Object> body) {
        return client.post("/v1/products/" + productId + "/stock-in", body);
    }

    /** 库存出库 */
    public SqdResponse stockOut(Long productId, Map<String, Object> body) {
        return client.post("/v1/products/" + productId + "/stock-out", body);
    }

    /** 查询库存变动日志 */
    public SqdResponse stockLogs(Long productId, Integer pageNo, Integer pageSize) {
        Map<String, Object> params = new HashMap<>();
        params.put("pageNo", pageNo);
        params.put("pageSize", pageSize);
        return client.get("/v1/products/" + productId + "/stock-logs", params);
    }

    /** 查询商品统计 */
    public SqdResponse statistics(Long merchantId) {
        Map<String, Object> params = new HashMap<>();
        params.put("merchantId", merchantId);
        return client.get("/v1/products/statistics", params);
    }
}
