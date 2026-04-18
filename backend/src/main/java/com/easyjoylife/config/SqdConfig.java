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

    /** 请求超时时间（毫秒） */
    private int connectTimeout = 5000;

    /** 读取超时时间（毫秒） */
    private int readTimeout = 10000;
}
