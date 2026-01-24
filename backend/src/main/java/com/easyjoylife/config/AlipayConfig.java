package com.easyjoylife.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * 支付宝配置类
 */
@Data
@Configuration
@ConfigurationProperties(prefix = "alipay")
public class AlipayConfig {

    /**
     * 应用ID
     */
    private String appId;

    /**
     * 商户私钥
     */
    private String privateKey;

    /**
     * 支付宝公钥
     */
    private String publicKey;

    /**
     * 支付宝网关地址
     */
    private String gatewayUrl = "https://openapi.alipaydev.com/gateway.do"; // 沙箱环境

    /**
     * 签名方式
     */
    private String signType = "RSA2";

    /**
     * 字符编码格式
     */
    private String charset = "UTF-8";

    /**
     * 返回数据格式
     */
    private String format = "json";

    /**
     * 同步回调地址
     */
    private String returnUrl;

    /**
     * 异步回调地址
     */
    private String notifyUrl;

    /**
     * 是否沙箱环境
     */
    private boolean sandbox = true;
}