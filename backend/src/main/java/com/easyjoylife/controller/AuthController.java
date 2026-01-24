package com.easyjoylife.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

/**
 * 认证控制器
 */
@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    @Value("${wechat.pay.app-id}")
    private String appId;

    @Value("${wechat.miniprogram.app-secret:your-app-secret}")
    private String appSecret;

    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * 微信小程序登录
     */
    @PostMapping("/wechat/login")
    public ResponseEntity<Map<String, Object>> wechatLogin(@RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String code = request.get("code").toString();
            
            // 调用微信接口获取openid
            String url = String.format(
                "https://api.weixin.qq.com/sns/jscode2session?appid=%s&secret=%s&js_code=%s&grant_type=authorization_code",
                appId, appSecret, code
            );
            
            Map<String, Object> wechatResponse = restTemplate.getForObject(url, Map.class);
            
            if (wechatResponse != null && wechatResponse.containsKey("openid")) {
                String openid = wechatResponse.get("openid").toString();
                String sessionKey = wechatResponse.get("session_key").toString();
                
                // 这里可以保存用户信息到数据库
                // 生成自定义token等
                
                response.put("success", true);
                response.put("openid", openid);
                response.put("sessionKey", sessionKey);
                
                log.info("微信登录成功: openid={}", openid);
                
            } else {
                String errcode = wechatResponse != null ? wechatResponse.get("errcode").toString() : "unknown";
                String errmsg = wechatResponse != null ? wechatResponse.get("errmsg").toString() : "unknown error";
                
                log.error("微信登录失败: errcode={}, errmsg={}", errcode, errmsg);
                
                response.put("success", false);
                response.put("message", "微信登录失败: " + errmsg);
            }
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("微信登录异常", e);
            response.put("success", false);
            response.put("message", "登录失败: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    /**
     * 获取用户信息
     */
    @GetMapping("/user/info")
    public ResponseEntity<Map<String, Object>> getUserInfo(@RequestParam String openid) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // 根据openid查询用户信息
            // 这里需要实现用户信息查询逻辑
            
            response.put("success", true);
            response.put("user", Map.of(
                "openid", openid,
                "nickname", "用户" + openid.substring(0, 6),
                "avatar", "/images/default-avatar.png"
            ));
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("获取用户信息失败", e);
            response.put("success", false);
            response.put("message", "获取用户信息失败: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
}