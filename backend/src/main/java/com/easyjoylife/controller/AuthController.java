package com.easyjoylife.controller;

import com.easyjoylife.entity.User;
import com.easyjoylife.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

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

    private final RestTemplate restTemplate;  // 使用注入的 RestTemplate
    private final UserRepository userRepository;

    /**
     * 测试微信API调用
     */
    @PostMapping("/wechat/test")
    public ResponseEntity<Map<String, Object>> testWechatApi(@RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String code = request.get("code").toString();
            
            // 调用微信接口获取openid
            String url = String.format(
                "https://api.weixin.qq.com/sns/jscode2session?appid=%s&secret=%s&js_code=%s&grant_type=authorization_code",
                appId, appSecret, code
            );
            
            log.info("测试调用微信API: {}", url.replaceAll("secret=[^&]*", "secret=***"));
            
            // 使用Map接收响应，利用我们配置的RestTemplate
            Map<String, Object> wechatResponse = restTemplate.getForObject(url, Map.class);
            
            response.put("success", true);
            response.put("wechatResponse", wechatResponse);
            response.put("appId", appId);
            response.put("codeLength", code.length());
            response.put("message", "微信API调用成功，RestTemplate配置正常");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("测试微信API异常", e);
            response.put("success", false);
            response.put("message", "测试失败: " + e.getMessage());
            response.put("error", e.getClass().getSimpleName());
            response.put("appId", appId);
            return ResponseEntity.internalServerError().body(response);
        }
    }

    /**
     * 测试微信配置
     */
    @GetMapping("/wechat/config")
    public ResponseEntity<Map<String, Object>> testWechatConfig() {
        Map<String, Object> response = new HashMap<>();
        
        response.put("appId", appId);
        response.put("appSecretLength", appSecret != null ? appSecret.length() : 0);
        response.put("appSecretPrefix", appSecret != null ? appSecret.substring(0, Math.min(8, appSecret.length())) + "..." : "null");
        
        return ResponseEntity.ok(response);
    }

    /**
     * 微信小程序登录 - 使用配置好的 RestTemplate
     */
    @PostMapping("/wechat/login")
    public ResponseEntity<Map<String, Object>> wechatLogin(@RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String code = request.get("code").toString();
            
            log.info("收到微信登录请求，code: {}", code);
            log.info("使用AppId: {}, AppSecret: {}", appId, appSecret != null ? appSecret.substring(0, 8) + "..." : "null");
            
            // 调用微信接口获取openid
            String url = String.format(
                "https://api.weixin.qq.com/sns/jscode2session?appid=%s&secret=%s&js_code=%s&grant_type=authorization_code",
                appId, appSecret, code
            );
            
            log.info("调用微信API: {}", url.replaceAll("secret=[^&]*", "secret=***"));
            
            // 使用 RestTemplate 直接获取响应（已配置支持 text/plain）
            Map<String, Object> wechatResponse = null;
            try {
                wechatResponse = restTemplate.getForObject(url, Map.class);
                log.info("微信API响应: {}", wechatResponse);
            } catch (Exception e) {
                log.error("调用微信API失败: {}", e.getMessage(), e);
                response.put("success", false);
                response.put("message", "调用微信API失败: " + e.getMessage());
                response.put("error", e.getClass().getSimpleName());
                return ResponseEntity.ok(response);
            }
            
            // 检查响应
            if (wechatResponse == null) {
                log.error("微信API返回空响应");
                response.put("success", false);
                response.put("message", "微信API返回空响应");
                return ResponseEntity.ok(response);
            }
            
            if (wechatResponse.containsKey("openid")) {
                String openid = wechatResponse.get("openid").toString();
                String sessionKey = wechatResponse.get("session_key").toString();
                
                // 查找或创建用户
                Optional<User> existingUser = userRepository.findByOpenid(openid);
                User user;
                
                if (existingUser.isPresent()) {
                    user = existingUser.get();
                    user.setLastLoginTime(LocalDateTime.now());
                    log.info("找到已存在用户: {}", user.getId());
                } else {
                    // 创建新用户
                    user = new User();
                    user.setOpenid(openid);
                    user.setNickname("微信用户" + openid.substring(openid.length() - 6));
                    user.setAvatar("/images/default-avatar.png");
                    user.setStatus(User.Status.ACTIVE);
                    user.setLastLoginTime(LocalDateTime.now());
                    log.info("创建新用户，openid: {}", openid);
                }
                
                userRepository.save(user);
                
                response.put("success", true);
                response.put("openid", openid);
                response.put("sessionKey", sessionKey);
                response.put("user", Map.of(
                    "id", user.getId(),
                    "openid", user.getOpenid(),
                    "nickname", user.getNickname(),
                    "avatar", user.getAvatar(),
                    "phone", user.getPhone() != null ? user.getPhone() : "",
                    "status", user.getStatus().toString(),
                    "isLogin", true
                ));
                
                log.info("微信登录成功: openid={}, userId={}", openid, user.getId());
                
            } else {
                // 处理微信API错误响应
                String errcode = wechatResponse.containsKey("errcode") ? 
                    wechatResponse.get("errcode").toString() : "unknown";
                String errmsg = wechatResponse.containsKey("errmsg") ? 
                    wechatResponse.get("errmsg").toString() : "unknown error";
                
                log.error("微信登录失败: errcode={}, errmsg={}", errcode, errmsg);
                
                response.put("success", false);
                response.put("message", "微信登录失败: " + errmsg);
                response.put("errcode", errcode);
                response.put("errmsg", errmsg);
            }
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("微信登录异常", e);
            response.put("success", false);
            response.put("message", "登录失败: " + e.getMessage());
            response.put("error", e.getClass().getSimpleName());
            response.put("stackTrace", e.toString());
            return ResponseEntity.ok(response);
        }
    }

    /**
     * 更新用户信息（包括头像和昵称）
     */
    @PostMapping("/user/update")
    public ResponseEntity<Map<String, Object>> updateUserInfo(@RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String openid = request.get("openid").toString();
            
            Optional<User> userOpt = userRepository.findByOpenid(openid);
            if (!userOpt.isPresent()) {
                response.put("success", false);
                response.put("message", "用户不存在");
                return ResponseEntity.ok(response);
            }
            
            User user = userOpt.get();
            
            // 更新用户信息
            if (request.containsKey("nickname")) {
                user.setNickname(request.get("nickname").toString());
            }
            if (request.containsKey("avatar")) {
                user.setAvatar(request.get("avatar").toString());
            }
            if (request.containsKey("gender")) {
                user.setGender(Integer.valueOf(request.get("gender").toString()));
            }
            
            userRepository.save(user);
            
            response.put("success", true);
            response.put("user", Map.of(
                "id", user.getId(),
                "openid", user.getOpenid(),
                "nickname", user.getNickname(),
                "avatar", user.getAvatar(),
                "phone", user.getPhone() != null ? user.getPhone() : "",
                "gender", user.getGender(),
                "status", user.getStatus().toString()
            ));
            
            log.info("用户信息更新成功: userId={}", user.getId());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("更新用户信息失败", e);
            response.put("success", false);
            response.put("message", "更新失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    /**
     * 获取用户信息
     */
    @GetMapping("/user/info")
    public ResponseEntity<Map<String, Object>> getUserInfo(@RequestParam String openid) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Optional<User> userOpt = userRepository.findByOpenid(openid);
            if (!userOpt.isPresent()) {
                response.put("success", false);
                response.put("message", "用户不存在");
                return ResponseEntity.ok(response);
            }
            
            User user = userOpt.get();
            
            response.put("success", true);
            response.put("user", Map.of(
                "id", user.getId(),
                "openid", user.getOpenid(),
                "nickname", user.getNickname(),
                "avatar", user.getAvatar(),
                "phone", user.getPhone() != null ? user.getPhone() : "",
                "gender", user.getGender(),
                "status", user.getStatus().toString(),
                "createdTime", user.getCreatedTime().toString(),
                "lastLoginTime", user.getLastLoginTime() != null ? user.getLastLoginTime().toString() : ""
            ));
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("获取用户信息失败", e);
            response.put("success", false);
            response.put("message", "获取用户信息失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }
}