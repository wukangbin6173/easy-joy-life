package com.easyjoylife.controller;

import com.easyjoylife.entity.User;
import com.easyjoylife.repository.UserRepository;
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

    private final RestTemplate restTemplate = new RestTemplate();
    private final UserRepository userRepository;

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
     * 微信小程序登录
     */
    @PostMapping("/wechat/login")
    public ResponseEntity<Map<String, Object>> wechatLogin(@RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String code = request.get("code").toString();
            
            log.info("收到微信登录请求，code: {}", code);
            log.info("使用AppId: {}, AppSecret: {}", appId, appSecret.substring(0, 8) + "...");
            
            // 调用微信接口获取openid
            String url = String.format(
                "https://api.weixin.qq.com/sns/jscode2session?appid=%s&secret=%s&js_code=%s&grant_type=authorization_code",
                appId, appSecret, code
            );
            
            log.info("调用微信API: {}", url.replaceAll("secret=[^&]*", "secret=***"));
            
            Map<String, Object> wechatResponse = restTemplate.getForObject(url, Map.class);
            
            log.info("微信API响应: {}", wechatResponse);
            
            if (wechatResponse != null && wechatResponse.containsKey("openid")) {
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
                    user.setNickname("用户" + openid.substring(openid.length() - 6));
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
                    "status", user.getStatus(),
                    "isLogin", true
                ));
                
                log.info("微信登录成功: openid={}, userId={}", openid, user.getId());
                
            } else {
                String errcode = wechatResponse != null ? wechatResponse.get("errcode").toString() : "unknown";
                String errmsg = wechatResponse != null ? wechatResponse.get("errmsg").toString() : "unknown error";
                
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
            return ResponseEntity.internalServerError().body(response);
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
                return ResponseEntity.badRequest().body(response);
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
                "status", user.getStatus()
            ));
            
            log.info("用户信息更新成功: userId={}", user.getId());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("更新用户信息失败", e);
            response.put("success", false);
            response.put("message", "更新失败: " + e.getMessage());
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
            Optional<User> userOpt = userRepository.findByOpenid(openid);
            if (!userOpt.isPresent()) {
                response.put("success", false);
                response.put("message", "用户不存在");
                return ResponseEntity.badRequest().body(response);
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
                "status", user.getStatus(),
                "createdTime", user.getCreatedTime(),
                "lastLoginTime", user.getLastLoginTime()
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