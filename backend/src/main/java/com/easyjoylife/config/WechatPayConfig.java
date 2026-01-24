package com.easyjoylife.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * 微信支付配置类
 */
@Data
@Configuration
@ConfigurationProperties(prefix = "wechat.pay")
public class WechatPayConfig {

    /**
     * 小程序AppID
     */
    private String appId;

    /**
     * 商户号
     */
    private String mchId;

    /**
     * 商户API私钥路径
     */
    private String privateKeyPath;

    /**
     * 商户证书序列号
     */
    private String merchantSerialNumber;

    /**
     * API v3密钥
     */
    private String apiV3Key;

    /**
     * 异步回调地址
     */
    private String notifyUrl;

    /**
     * 是否沙箱环境
     */
    private boolean sandbox = false;

    /**
     * 微信支付API域名
     */
    private String domain = "https://api.mch.weixin.qq.com";
}