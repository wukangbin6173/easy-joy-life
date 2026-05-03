package com.easyjoylife.controller;

import com.easyjoylife.service.AliyunSmsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.TimeUnit;

/**
 * 短信验证码控制器
 * 
 * 已接入阿里云短信服务
 */
@Slf4j
@RestController
@RequestMapping("/api/sms")
@RequiredArgsConstructor
public class SmsController {

    private final StringRedisTemplate redisTemplate;
    private final AliyunSmsService aliyunSmsService;
    
    // 开发模式：true=模拟短信，false=真实短信
    private static final boolean DEV_MODE = false;
    
    // 模拟验证码（开发测试用）
    private static final String DEV_CODE = "9999";

    /**
     * 发送短信验证码
     */
    @PostMapping("/send-code")
    public ResponseEntity<Map<String, Object>> sendCode(@RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String phone = request.get("phone").toString();
            String type = request.getOrDefault("type", "GENERAL").toString();
            
            // 验证手机号格式
            if (!phone.matches("^1[3-9]\\d{9}$")) {
                response.put("success", false);
                response.put("message", "手机号格式不正确");
                return ResponseEntity.ok(response);
            }
            
            // 检查发送频率（60秒内只能发送一次）
            String rateLimitKey = "sms:rate:" + phone;
            if (Boolean.TRUE.equals(redisTemplate.hasKey(rateLimitKey))) {
                response.put("success", false);
                response.put("message", "发送过于频繁，请稍后再试");
                return ResponseEntity.ok(response);
            }
            
            // 生成6位验证码
            String code = generateCode();
            
            if (DEV_MODE) {
                // 开发模式：使用固定验证码，方便测试
                code = DEV_CODE;
                log.info("【开发模式】发送验证码到 {}, 验证码: {}, 类型: {}", phone, code, type);
            } else {
                // 生产模式：调用真实短信服务
                boolean sent = sendRealSms(phone, code, type);
                if (!sent) {
                    response.put("success", false);
                    response.put("message", "短信发送失败，请稍后重试");
                    return ResponseEntity.ok(response);
                }
                log.info("发送验证码到 {}, 类型: {}", phone, type);
            }
            
            // 保存验证码到Redis（5分钟有效期）
            String codeKey = "sms:code:" + phone + ":" + type;
            redisTemplate.opsForValue().set(codeKey, code, 5, TimeUnit.MINUTES);
            
            // 设置发送频率限制（60秒）
            redisTemplate.opsForValue().set(rateLimitKey, "1", 60, TimeUnit.SECONDS);
            
            response.put("success", true);
            response.put("message", "验证码已发送");
            
            // 开发模式下返回验证码（方便测试）
            if (DEV_MODE) {
                response.put("code", code);
                response.put("devMode", true);
            }
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("发送验证码失败", e);
            response.put("success", false);
            response.put("message", "发送失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    /**
     * 验证短信验证码
     */
    @PostMapping("/verify-code")
    public ResponseEntity<Map<String, Object>> verifyCode(@RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String phone = request.get("phone").toString();
            String code = request.get("code").toString();
            String type = request.getOrDefault("type", "GENERAL").toString();
            
            String codeKey = "sms:code:" + phone + ":" + type;
            String savedCode = redisTemplate.opsForValue().get(codeKey);
            
            if (savedCode == null) {
                response.put("success", false);
                response.put("message", "验证码已过期或不存在");
                return ResponseEntity.ok(response);
            }
            
            if (!savedCode.equals(code)) {
                response.put("success", false);
                response.put("message", "验证码错误");
                return ResponseEntity.ok(response);
            }
            
            // 验证成功后删除验证码
            redisTemplate.delete(codeKey);
            
            response.put("success", true);
            response.put("message", "验证成功");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("验证验证码失败", e);
            response.put("success", false);
            response.put("message", "验证失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    /**
     * 生成6位随机验证码
     */
    private String generateCode() {
        Random random = new Random();
        return String.format("%06d", random.nextInt(1000000));
    }

    /**
     * 发送真实短信（阿里云短信服务）
     */
    private boolean sendRealSms(String phone, String code, String type) {
        return aliyunSmsService.sendSms(phone, code);
    }
}