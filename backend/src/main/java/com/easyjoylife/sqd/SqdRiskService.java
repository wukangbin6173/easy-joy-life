package com.easyjoylife.sqd;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;

/**
 * 商起点 - 风控模型模块
 */
@Service
@RequiredArgsConstructor
public class SqdRiskService {

    private final SqdClient client;

    /** 获取可调用的平台风控模型产品列表 */
    public SqdResponse listProducts() {
        return client.get("/v1/risk-model-products", null);
    }

    /** 执行平台风控模型产品 */
    public SqdResponse execute(Long productId, Map<String, Object> body) {
        return client.post("/v1/risk-model-products/" + productId + "/execute", body);
    }
}
