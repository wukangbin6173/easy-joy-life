package com.easyjoylife.controller;

import com.easyjoylife.entity.User;
import com.easyjoylife.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import javax.annotation.PostConstruct;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.*;

/**
 * 认证控制器
 */
@Slf4j
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Value("${wechat.pay.app-id}")
    private String appId;

    @Value("${wechat.miniprogram.app-secret:your-app-secret}")
    private String appSecret;

    @Value("${upload.base-url:https://www.quexitai.com/api/upload/files}")
    private String uploadFilesBaseUrl;

    private final UserRepository userRepository;
    private final StringRedisTemplate redisTemplate;
    private RestTemplate wxRestTemplate;

    public AuthController(UserRepository userRepository, StringRedisTemplate redisTemplate) {
        this.userRepository = userRepository;
        this.redisTemplate = redisTemplate;
    }

    @PostConstruct
    public void init() {
        // 独立的 RestTemplate，避免全局 Jackson 转换器干扰
        this.wxRestTemplate = new RestTemplate();
        StringHttpMessageConverter converter = new StringHttpMessageConverter(StandardCharsets.UTF_8);
        converter.setSupportedMediaTypes(Collections.singletonList(MediaType.ALL));
        this.wxRestTemplate.setMessageConverters(Collections.singletonList(converter));
    }

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
            
            // 使用独立RestTemplate调用微信API
            String wechatRespStr = wxRestTemplate.getForObject(url, String.class);
            ObjectMapper mapper = new ObjectMapper();
            Map<String, Object> wechatResponse = mapper.readValue(wechatRespStr, Map.class);
            
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
            
            // 使用独立RestTemplate调用微信API
            Map<String, Object> wechatResponse = null;
            try {
                String wechatRespStr = wxRestTemplate.getForObject(url, String.class);
                log.info("微信API响应: {}", wechatRespStr);
                ObjectMapper mapper = new ObjectMapper();
                wechatResponse = mapper.readValue(wechatRespStr, Map.class);
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
                
                try {
                    userRepository.save(user);
                } catch (Exception ex) {
                    log.warn("微信登录保存用户冲突，重新查询: openid={}", openid);
                    user = userRepository.findByOpenid(openid).orElse(user);
                }

                response.put("success", true);
                response.put("openid", openid);
                response.put("sessionKey", sessionKey);
                response.put("user", Map.of(
                    "id", user.getId(),
                    "openid", user.getOpenid(),
                    "nickname", user.getNickname(),
                    "avatar", getUserAvatar(user),
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
                user.setAvatar(normalizeAvatarUrl(request.get("avatar")));
            }
            if (request.containsKey("gender")) {
                user.setGender(Integer.valueOf(request.get("gender").toString()));
            }
            if (request.containsKey("phone") && request.get("phone") != null
                    && !request.get("phone").toString().isEmpty()) {
                user.setPhone(request.get("phone").toString());
            }
            
            userRepository.save(user);
            
            response.put("success", true);
            response.put("user", Map.of(
                "id", user.getId(),
                "openid", user.getOpenid(),
                "nickname", user.getNickname(),
                "avatar", getUserAvatar(user),
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
                "avatar", getUserAvatar(user),
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

    /**
     * 微信手机号授权 - 通过 code 获取用户手机号
     * 前端调用 wx.getPhoneNumber 获取 code，传给此接口解密
     */
    @PostMapping("/wechat/phone")
    public ResponseEntity<Map<String, Object>> getWechatPhone(@RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();

        try {
            String code = (String) request.get("code");
            if (code == null || code.isEmpty()) {
                response.put("success", false);
                response.put("message", "code不能为空");
                return ResponseEntity.ok(response);
            }

            log.info("微信手机号授权, code={}", code);

            // 1. 获取 access_token
            String tokenUrl = String.format(
                    "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=%s&secret=%s",
                    appId, appSecret);
            String tokenResp = wxRestTemplate.getForObject(tokenUrl, String.class);
            log.info("获取access_token响应: {}", tokenResp);

            ObjectMapper mapper = new ObjectMapper();
            Map<String, Object> tokenMap = mapper.readValue(tokenResp, Map.class);

            if (tokenMap.containsKey("errcode") && !Integer.valueOf(0).equals(tokenMap.get("errcode"))) {
                response.put("success", false);
                response.put("message", "获取access_token失败: " + tokenMap.get("errmsg"));
                return ResponseEntity.ok(response);
            }

            String accessToken = (String) tokenMap.get("access_token");

            // 2. 调用 getuserphonenumber 接口
            String phoneUrl = "https://api.weixin.qq.com/wxa/business/getuserphonenumber?access_token=" + accessToken;
            String phoneReqJson = mapper.writeValueAsString(Map.of("code", code));
            org.springframework.http.HttpHeaders phoneHeaders = new org.springframework.http.HttpHeaders();
            phoneHeaders.setContentType(MediaType.APPLICATION_JSON);
            org.springframework.http.HttpEntity<String> phoneEntity = new org.springframework.http.HttpEntity<>(phoneReqJson, phoneHeaders);

            String phoneResp = wxRestTemplate.postForObject(phoneUrl, phoneEntity, String.class);
            log.info("获取手机号响应: {}", phoneResp);

            Map<String, Object> phoneMap = mapper.readValue(phoneResp, Map.class);

            if (phoneMap.containsKey("errcode") && !Integer.valueOf(0).equals(phoneMap.get("errcode"))) {
                response.put("success", false);
                response.put("message", "获取手机号失败: " + phoneMap.get("errmsg"));
                return ResponseEntity.ok(response);
            }

            // 3. 提取手机号信息
            Map<String, Object> phoneInfo = (Map<String, Object>) phoneMap.get("phone_info");
            String phoneNumber = (String) phoneInfo.get("phoneNumber");

            response.put("success", true);
            response.put("phoneNumber", phoneNumber);
            response.put("purePhoneNumber", phoneInfo.get("purePhoneNumber"));
            response.put("countryCode", phoneInfo.get("countryCode"));

            log.info("手机号获取成功: {}", phoneNumber.replaceAll("(\\d{3})\\d{4}(\\d{4})", "$1****$2"));
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("微信手机号授权失败", e);
            response.put("success", false);
            response.put("message", "获取手机号失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    /**
     * 手机号验证码登录/注册（以手机号为唯一标识）
     * POST /api/auth/phone/login
     * body: { phone, code, openid(可选) }
     */
    @PostMapping("/phone/login")
    public ResponseEntity<Map<String, Object>> phoneLogin(@RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();
        try {
            String phone = request.get("phone").toString();
            String code = request.get("code").toString();
            String openid = request.containsKey("openid") ? String.valueOf(request.get("openid")) : null;
            if ("null".equals(openid) || "".equals(openid)) openid = null;

            // 1. 校验验证码（兼容 LOGIN / REGISTER 两种类型）
            String savedCode = redisTemplate.opsForValue().get("sms:code:" + phone + ":LOGIN");
            if (savedCode == null) {
                savedCode = redisTemplate.opsForValue().get("sms:code:" + phone + ":REGISTER");
            }
            if (savedCode == null) {
                response.put("success", false);
                response.put("message", "验证码已过期，请重新获取");
                return ResponseEntity.ok(response);
            }
            if (!savedCode.equals(code)) {
                response.put("success", false);
                response.put("message", "验证码错误");
                return ResponseEntity.ok(response);
            }
            redisTemplate.delete("sms:code:" + phone + ":LOGIN");
            redisTemplate.delete("sms:code:" + phone + ":REGISTER");

            // 2. 以手机号为唯一标识查找或创建用户
            Optional<User> existingUser = userRepository.findByPhone(phone);
            User user;
            boolean isNewUser = false;

            if (existingUser.isPresent()) {
                user = existingUser.get();
                // openid 不为空且当前未绑定时才绑定
                if (openid != null && user.getOpenid() == null) {
                    user.setOpenid(openid);
                }
                log.info("手机号登录，已有用户: userId={}, phone={}", user.getId(), phone);
            } else {
                user = new User();
                user.setPhone(phone);
                // openid 为空字符串时存 null，避免唯一约束冲突
                user.setOpenid((openid != null && !openid.isEmpty()) ? openid : null);
                user.setNickname("用户" + phone.substring(phone.length() - 4));
                user.setAvatar("/images/default-avatar.png");
                user.setStatus(User.Status.ACTIVE);
                isNewUser = true;
                log.info("手机号注册新用户: phone={}", phone);
            }
            user.setLastLoginTime(LocalDateTime.now());
            try {
                userRepository.save(user);
            } catch (Exception e) {
                // 并发或重复插入时，重新查询返回
                log.warn("保存用户冲突，重新查询: phone={}", phone);
                user = userRepository.findByPhone(phone)
                        .orElseThrow(() -> new RuntimeException("用户保存失败: " + e.getMessage()));
                isNewUser = false;
            }

            Map<String, Object> userMap = new HashMap<>();
            userMap.put("id", user.getId());
            userMap.put("phone", user.getPhone());
            userMap.put("openid", user.getOpenid() != null ? user.getOpenid() : "");
            userMap.put("nickname", user.getNickname() != null ? user.getNickname() : "");
            userMap.put("avatar", getUserAvatar(user));
            userMap.put("status", user.getStatus());

            response.put("success", true);
            response.put("isNewUser", isNewUser);
            response.put("user", userMap);
            log.info("手机号登录成功: userId={}, phone={}", user.getId(), phone);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("手机号登录失败", e);
            response.put("success", false);
            response.put("message", "登录失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    /**
     * 绑定手机号（已登录用户绑定手机号）
     * POST /api/auth/phone/bind
     * body: { userId, phone, code }
     */
    @PostMapping("/phone/bind")
    public ResponseEntity<Map<String, Object>> bindPhone(@RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();
        try {
            Long userId = Long.valueOf(request.get("userId").toString());
            String phone = request.get("phone").toString();
            String code = request.get("code").toString();

            // 1. 校验验证码
            String savedCode = redisTemplate.opsForValue().get("sms:code:" + phone + ":LOGIN");
            if (savedCode == null) {
                savedCode = redisTemplate.opsForValue().get("sms:code:" + phone + ":REGISTER");
            }
            if (savedCode == null) {
                response.put("success", false);
                response.put("message", "验证码已过期，请重新获取");
                return ResponseEntity.ok(response);
            }
            if (!savedCode.equals(code)) {
                response.put("success", false);
                response.put("message", "验证码错误");
                return ResponseEntity.ok(response);
            }
            redisTemplate.delete("sms:code:" + phone + ":LOGIN");
            redisTemplate.delete("sms:code:" + phone + ":REGISTER");

            // 2. 检查手机号是否已被其他用户绑定
            Optional<User> phoneUser = userRepository.findByPhone(phone);
            if (phoneUser.isPresent() && !phoneUser.get().getId().equals(userId)) {
                response.put("success", false);
                response.put("message", "该手机号已被其他账号绑定");
                return ResponseEntity.ok(response);
            }

            // 3. 更新当前用户的手机号
            Optional<User> userOpt = userRepository.findById(userId);
            if (!userOpt.isPresent()) {
                response.put("success", false);
                response.put("message", "用户不存在");
                return ResponseEntity.ok(response);
            }
            User user = userOpt.get();
            user.setPhone(phone);
            userRepository.save(user);

            log.info("手机号绑定成功: userId={}, phone={}", userId, phone);
            response.put("success", true);
            response.put("message", "手机号绑定成功");
            Map<String, Object> userMap = new HashMap<>();
            userMap.put("id", user.getId());
            userMap.put("phone", user.getPhone());
            userMap.put("openid", user.getOpenid() != null ? user.getOpenid() : "");
            userMap.put("nickname", user.getNickname() != null ? user.getNickname() : "");
            userMap.put("avatar", getUserAvatar(user));
            response.put("user", userMap);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("绑定手机号失败", e);
            response.put("success", false);
            response.put("message", "绑定失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    /**
     * 根据手机号查询用户信息
     * GET /api/auth/user/info/phone?phone=xxx
     */
    @GetMapping("/user/info/phone")
    public ResponseEntity<Map<String, Object>> getUserInfoByPhone(@RequestParam String phone) {
        Map<String, Object> response = new HashMap<>();
        try {
            Optional<User> userOpt = userRepository.findByPhone(phone);
            if (!userOpt.isPresent()) {
                response.put("success", false);
                response.put("message", "用户不存在");
                return ResponseEntity.ok(response);
            }
            User user = userOpt.get();
            Map<String, Object> userMap = new HashMap<>();
            userMap.put("id", user.getId());
            userMap.put("phone", user.getPhone());
            userMap.put("openid", user.getOpenid() != null ? user.getOpenid() : "");
            userMap.put("nickname", user.getNickname() != null ? user.getNickname() : "");
            userMap.put("avatar", getUserAvatar(user));
            userMap.put("gender", user.getGender());
            userMap.put("status", user.getStatus());
            userMap.put("createdTime", user.getCreatedTime().toString());
            response.put("success", true);
            response.put("user", userMap);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("查询用户失败", e);
            response.put("success", false);
            response.put("message", "查询失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    private String getUserAvatar(User user) {
        return normalizeAvatarUrl(user != null ? user.getAvatar() : null);
    }

    private String normalizeAvatarUrl(Object value) {
        if (value == null) {
            return "";
        }
        String url = value.toString().trim();
        if (url.isEmpty()) {
            return "";
        }

        String httpsUrl = url.startsWith("http://") ? "https://" + url.substring("http://".length()) : url;
        String uploadBase = uploadFilesBaseUrl == null || uploadFilesBaseUrl.trim().isEmpty()
                ? "https://www.quexitai.com/api/upload/files"
                : uploadFilesBaseUrl.trim().replaceAll("/+$", "");

        String uploadFilesPrefix = "/api/upload/files/";
        int uploadFilesIndex = httpsUrl.indexOf(uploadFilesPrefix);
        if (uploadFilesIndex >= 0) {
            return uploadBase + "/" + httpsUrl.substring(uploadFilesIndex + uploadFilesPrefix.length());
        }

        String[] legacyPrefixes = {
                "https://www.quexitai.com/uploads/",
                "https://quexitai.com/uploads/"
        };
        for (String legacyPrefix : legacyPrefixes) {
            if (httpsUrl.startsWith(legacyPrefix)) {
                return uploadBase + "/" + httpsUrl.substring(legacyPrefix.length());
            }
        }
        if (httpsUrl.startsWith("/uploads/")) {
            return uploadBase + httpsUrl.substring("/uploads".length());
        }
        return httpsUrl;
    }
}
