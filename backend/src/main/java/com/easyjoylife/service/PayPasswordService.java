package com.easyjoylife.service;

import com.easyjoylife.entity.PayPassword;
import com.easyjoylife.repository.PayPasswordRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;

@Slf4j
@Service
@RequiredArgsConstructor
public class PayPasswordService {

    private final PayPasswordRepository payPasswordRepository;
    
    // 最大错误次数
    private static final int MAX_ERROR_COUNT = 5;
    // 锁定时长（分钟）
    private static final int LOCK_DURATION_MINUTES = 30;
    
    /**
     * 检查用户是否设置了支付密码
     */
    public boolean hasPayPassword(Long userId) {
        return payPasswordRepository.existsByUserId(userId);
    }
    
    /**
     * 设置支付密码（首次）
     */
    @Transactional
    public void setPayPassword(Long userId, String password) {
        // 检查是否已设置
        if (payPasswordRepository.existsByUserId(userId)) {
            throw new RuntimeException("已设置支付密码，请使用修改功能");
        }
        
        // 生成盐值
        String salt = generateSalt();
        
        // 加密密码
        String encryptedPassword = encryptPassword(password, salt);
        
        // 保存
        PayPassword payPassword = new PayPassword();
        payPassword.setUserId(userId);
        payPassword.setPassword(encryptedPassword);
        payPassword.setSalt(salt);
        payPassword.setErrorCount(0);
        
        payPasswordRepository.save(payPassword);
        log.info("用户 {} 设置支付密码成功", userId);
    }
    
    /**
     * 修改支付密码
     */
    @Transactional
    public void updatePayPassword(Long userId, String oldPassword, String newPassword) {
        PayPassword payPassword = payPasswordRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("未设置支付密码"));
        
        // 检查是否被锁定
        if (payPassword.getLockedUntil() != null && 
            payPassword.getLockedUntil().isAfter(LocalDateTime.now())) {
            throw new RuntimeException("密码已被锁定，请稍后再试");
        }
        
        // 验证旧密码
        String encryptedOldPassword = encryptPassword(oldPassword, payPassword.getSalt());
        if (!encryptedOldPassword.equals(payPassword.getPassword())) {
            // 增加错误次数
            payPassword.setErrorCount(payPassword.getErrorCount() + 1);
            
            // 检查是否需要锁定
            if (payPassword.getErrorCount() >= MAX_ERROR_COUNT) {
                payPassword.setLockedUntil(LocalDateTime.now().plusMinutes(LOCK_DURATION_MINUTES));
                payPasswordRepository.save(payPassword);
                throw new RuntimeException("密码错误次数过多，已锁定30分钟");
            }
            
            payPasswordRepository.save(payPassword);
            throw new RuntimeException("原密码错误，还可尝试 " + 
                    (MAX_ERROR_COUNT - payPassword.getErrorCount()) + " 次");
        }
        
        // 生成新盐值
        String newSalt = generateSalt();
        
        // 加密新密码
        String encryptedNewPassword = encryptPassword(newPassword, newSalt);
        
        // 更新密码
        payPassword.setPassword(encryptedNewPassword);
        payPassword.setSalt(newSalt);
        payPassword.setErrorCount(0);
        payPassword.setLockedUntil(null);
        
        payPasswordRepository.save(payPassword);
        log.info("用户 {} 修改支付密码成功", userId);
    }
    
    /**
     * 验证支付密码
     */
    public boolean verifyPayPassword(Long userId, String password) {
        PayPassword payPassword = payPasswordRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("未设置支付密码"));
        
        // 检查是否被锁定
        if (payPassword.getLockedUntil() != null && 
            payPassword.getLockedUntil().isAfter(LocalDateTime.now())) {
            throw new RuntimeException("密码已被锁定，请稍后再试");
        }
        
        // 验证密码
        String encryptedPassword = encryptPassword(password, payPassword.getSalt());
        boolean isValid = encryptedPassword.equals(payPassword.getPassword());
        
        if (!isValid) {
            // 增加错误次数
            payPassword.setErrorCount(payPassword.getErrorCount() + 1);
            
            // 检查是否需要锁定
            if (payPassword.getErrorCount() >= MAX_ERROR_COUNT) {
                payPassword.setLockedUntil(LocalDateTime.now().plusMinutes(LOCK_DURATION_MINUTES));
                payPasswordRepository.save(payPassword);
                throw new RuntimeException("密码错误次数过多，已锁定30分钟");
            }
            
            payPasswordRepository.save(payPassword);
            throw new RuntimeException("支付密码错误，还可尝试 " + 
                    (MAX_ERROR_COUNT - payPassword.getErrorCount()) + " 次");
        }
        
        // 验证成功，重置错误次数
        if (payPassword.getErrorCount() > 0) {
            payPassword.setErrorCount(0);
            payPassword.setLockedUntil(null);
            payPasswordRepository.save(payPassword);
        }
        
        return true;
    }
    
    /**
     * 重置支付密码（管理员操作）
     */
    @Transactional
    public void resetPayPassword(Long userId) {
        PayPassword payPassword = payPasswordRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("未设置支付密码"));
        
        payPasswordRepository.delete(payPassword);
        log.info("用户 {} 的支付密码已重置", userId);
    }
    
    /**
     * 生成盐值
     */
    private String generateSalt() {
        SecureRandom random = new SecureRandom();
        byte[] salt = new byte[32];
        random.nextBytes(salt);
        return Base64.getEncoder().encodeToString(salt);
    }
    
    /**
     * 加密密码（SHA-256 + 盐值）
     */
    private String encryptPassword(String password, String salt) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            String saltedPassword = password + salt;
            byte[] hash = digest.digest(saltedPassword.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(hash);
        } catch (Exception e) {
            log.error("加密密码失败", e);
            throw new RuntimeException("加密失败");
        }
    }
}
