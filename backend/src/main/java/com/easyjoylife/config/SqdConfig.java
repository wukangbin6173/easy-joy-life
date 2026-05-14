package com.easyjoylife.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * 商起点开放平台配置
 */
@Data
@Configuration
@ConfigurationProperties(prefix = "sqd")
public class SqdConfig {

    /** 应用标识 */
    private String appKey;

    /** 应用密钥 */
    private String appSecret;

    /** API基础地址 */
    private String baseUrl = "https://test-api.xuancore.com/open-api";

    /** Merchant-side app-api base URL. Defaults to baseUrl without /open-api. */
    private String merchantBaseUrl;

    /** Merchant-side Bearer token. Configure through SQD_MERCHANT_BEARER_TOKEN. */
    private String merchantBearerToken;

    /**
     * 未在 HTTP 请求中传 merchantId 时，若配置了该值则用于调用商起点（由运维通过环境变量设置，如 SQD_FALLBACK_MERCHANT_ID；多商户场景勿配）。
     */
    private Long fallbackMerchantId;

    /** 请求超时时间（毫秒） */
    private int connectTimeout = 5000;

    /** 读取超时时间（毫秒） */
    private int readTimeout = 10000;

    /**
     * 请求中的 merchantId 优先；否则使用运维配置的 fallback（环境变量 SQD_FALLBACK_MERCHANT_ID 等）。
     *
     * @return null 表示缺少可用于调用商起点的商户标识
     */
    public Long resolveEffectiveMerchantId(Long requestMerchantId) {
        if (requestMerchantId != null && requestMerchantId > 0) {
            return requestMerchantId;
        }
        if (fallbackMerchantId != null && fallbackMerchantId > 0) {
            return fallbackMerchantId;
        }
        return null;
    }

    public String resolveMerchantBaseUrl() {
        String configured = trimToNull(merchantBaseUrl);
        if (configured != null) {
            return trimTrailingSlash(configured);
        }

        String openApiBaseUrl = trimToNull(baseUrl);
        if (openApiBaseUrl == null) {
            return null;
        }

        String normalized = trimTrailingSlash(openApiBaseUrl);
        String openApiSuffix = "/open-api";
        if (normalized.endsWith(openApiSuffix)) {
            return normalized.substring(0, normalized.length() - openApiSuffix.length());
        }
        return normalized;
    }

    public boolean hasMerchantBearerToken() {
        return trimToNull(merchantBearerToken) != null;
    }

    private String trimTrailingSlash(String value) {
        String result = value;
        while (result.endsWith("/")) {
            result = result.substring(0, result.length() - 1);
        }
        return result;
    }

    private String trimToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
