package com.easyjoylife.controller;

import com.easyjoylife.service.PayPasswordService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class PayPasswordController {

    private final PayPasswordService payPasswordService;

    /**
     * 检查是否已设置支付密码
     */
    @GetMapping("/has-pay-password/{userId}")
    public ResponseEntity<Map<String, Object>> hasPayPassword(@PathVariable Long userId) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            boolean hasPassword = payPasswordService.hasPayPassword(userId);
            
            response.put("success", true);
            response.put("hasPassword", hasPassword);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("检查支付密码失败: userId={}", userId, e);
            response.put("success", false);
            response.put("message", "检查失败");
            return ResponseEntity.ok(response);
        }
    }

    /**
     * 设置/修改支付密码
     */
    @PostMapping("/pay-password")
    public ResponseEntity<Map<String, Object>> setPayPassword(@RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Long userId = Long.valueOf(request.get("userId").toString());
            String newPassword = request.get("newPassword").toString();
            String oldPassword = request.containsKey("oldPassword") && request.get("oldPassword") != null ? 
                    request.get("oldPassword").toString() : null;
            
            // 验证密码格式
            if (newPassword.length() != 6 || !newPassword.matches("\\d{6}")) {
                response.put("success", false);
                response.put("message", "密码必须为6位数字");
                return ResponseEntity.ok(response);
            }
            
            // 判断是设置还是修改
            boolean hasPassword = payPasswordService.hasPayPassword(userId);
            
            if (hasPassword) {
                // 修改密码
                if (oldPassword == null) {
                    response.put("success", false);
                    response.put("message", "请输入原密码");
                    return ResponseEntity.ok(response);
                }
                
                payPasswordService.updatePayPassword(userId, oldPassword, newPassword);
                response.put("message", "修改成功");
            } else {
                // 设置密码
                payPasswordService.setPayPassword(userId, newPassword);
                response.put("message", "设置成功");
            }
            
            response.put("success", true);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("设置/修改支付密码失败", e);
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    /**
     * 验证支付密码
     */
    @PostMapping("/verify-pay-password")
    public ResponseEntity<Map<String, Object>> verifyPayPassword(@RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Long userId = Long.valueOf(request.get("userId").toString());
            String password = request.get("password").toString();
            
            boolean isValid = payPasswordService.verifyPayPassword(userId, password);
            
            response.put("success", true);
            response.put("valid", isValid);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("验证支付密码失败", e);
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    /**
     * 重置支付密码（管理员功能）
     */
    @PostMapping("/reset-pay-password/{userId}")
    public ResponseEntity<Map<String, Object>> resetPayPassword(@PathVariable Long userId) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            payPasswordService.resetPayPassword(userId);
            
            response.put("success", true);
            response.put("message", "重置成功");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("重置支付密码失败: userId={}", userId, e);
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.ok(response);
        }
    }
}
