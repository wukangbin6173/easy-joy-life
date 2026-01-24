package com.easyjoylife.utils;

import com.easyjoylife.config.WechatPayConfig;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import javax.annotation.PostConstruct;

/**
 * 微信支付配置验证器
 */
@Slf4j
@Component
public class WechatPayConfigValidator {

    @Autowired
    private WechatPayConfig wechatPayConfig;

    @PostConstruct
    public void validateConfig() {
        log.info("开始验证微信支付配置...");
        
        boolean isValid = true;
        
        // 验证AppID
        if (StringUtils.isEmpty(wechatPayConfig.getAppId())) {
            log.error("❌ 小程序AppID未配置");
            isValid = false;
        } else {
            log.info("✅ 小程序AppID: {}", wechatPayConfig.getAppId());
        }
        
        // 验证商户号
        if (StringUtils.isEmpty(wechatPayConfig.getMchId())) {
            log.error("❌ 商户号未配置");
            isValid = false;
        } else {
            log.info("✅ 商户号: {}", wechatPayConfig.getMchId());
        }
        
        // 验证API v3密钥
        if (StringUtils.isEmpty(wechatPayConfig.getApiV3Key())) {
            log.error("❌ API v3密钥未配置");
            isValid = false;
        } else if (wechatPayConfig.getApiV3Key().length() != 32) {
            log.error("❌ API v3密钥长度不正确，应为32位，当前长度: {}", 
                    wechatPayConfig.getApiV3Key().length());
            isValid = false;
        } else {
            log.info("✅ API v3密钥: {}****{}", 
                    wechatPayConfig.getApiV3Key().substring(0, 4),
                    wechatPayConfig.getApiV3Key().substring(28));
        }
        
        // 验证商户证书序列号
        if (StringUtils.isEmpty(wechatPayConfig.getMerchantSerialNumber())) {
            log.error("❌ 商户证书序列号未配置");
            isValid = false;
        } else {
            log.info("✅ 商户证书序列号: {}****{}", 
                    wechatPayConfig.getMerchantSerialNumber().substring(0, 8),
                    wechatPayConfig.getMerchantSerialNumber().substring(32));
        }
        
        // 验证私钥路径
        if (StringUtils.isEmpty(wechatPayConfig.getPrivateKeyPath())) {
            log.error("❌ 商户私钥路径未配置");
            isValid = false;
        } else {
            log.info("✅ 商户私钥路径: {}", wechatPayConfig.getPrivateKeyPath());
        }
        
        // 验证回调地址
        if (StringUtils.isEmpty(wechatPayConfig.getNotifyUrl())) {
            log.error("❌ 支付回调地址未配置");
            isValid = false;
        } else {
            log.info("✅ 支付回调地址: {}", wechatPayConfig.getNotifyUrl());
        }
        
        if (isValid) {
            log.info("🎉 微信支付配置验证通过！");
        } else {
            log.error("💥 微信支付配置验证失败，请检查配置项");
        }
    }
}