package com.easyjoylife.payment;

import com.easyjoylife.config.WechatPayConfig;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.io.ClassPathResource;

import static org.junit.jupiter.api.Assertions.*;

/**
 * 微信支付配置测试
 */
@SpringBootTest
public class WechatPayConfigTest {

    @Autowired
    private WechatPayConfig wechatPayConfig;

    @Test
    public void testWechatPayConfig() {
        System.out.println("=== 微信支付配置验证 ===");
        
        // 验证AppID
        assertNotNull(wechatPayConfig.getAppId(), "小程序AppID不能为空");
        assertTrue(wechatPayConfig.getAppId().startsWith("wx"), "AppID格式不正确");
        System.out.println("✅ 小程序AppID: " + wechatPayConfig.getAppId());
        
        // 验证商户号
        assertNotNull(wechatPayConfig.getMchId(), "商户号不能为空");
        assertTrue(wechatPayConfig.getMchId().matches("\\d{10}"), "商户号应为10位数字");
        System.out.println("✅ 商户号: " + wechatPayConfig.getMchId());
        
        // 验证API v3密钥
        assertNotNull(wechatPayConfig.getApiV3Key(), "API v3密钥不能为空");
        assertEquals(32, wechatPayConfig.getApiV3Key().length(), "API v3密钥应为32位");
        System.out.println("✅ API v3密钥: " + wechatPayConfig.getApiV3Key().substring(0, 8) + "****");
        
        // 验证商户证书序列号
        assertNotNull(wechatPayConfig.getMerchantSerialNumber(), "商户证书序列号不能为空");
        assertTrue(wechatPayConfig.getMerchantSerialNumber().length() >= 32, "证书序列号长度不正确");
        System.out.println("✅ 商户证书序列号: " + wechatPayConfig.getMerchantSerialNumber().substring(0, 8) + "****");
        
        // 验证私钥文件
        assertNotNull(wechatPayConfig.getPrivateKeyPath(), "私钥文件路径不能为空");
        ClassPathResource resource = new ClassPathResource("cert/apiclient_key.pem");
        assertTrue(resource.exists(), "私钥文件不存在");
        System.out.println("✅ 私钥文件: " + wechatPayConfig.getPrivateKeyPath());
        
        // 验证回调地址
        assertNotNull(wechatPayConfig.getNotifyUrl(), "回调地址不能为空");
        assertTrue(wechatPayConfig.getNotifyUrl().startsWith("https://"), "回调地址必须使用HTTPS");
        System.out.println("✅ 回调地址: " + wechatPayConfig.getNotifyUrl());
        
        System.out.println("🎉 微信支付配置验证通过！");
    }
}