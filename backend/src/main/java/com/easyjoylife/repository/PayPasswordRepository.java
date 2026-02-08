package com.easyjoylife.repository;

import com.easyjoylife.entity.PayPassword;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PayPasswordRepository extends JpaRepository<PayPassword, Long> {
    
    /**
     * 根据用户ID查找支付密码
     */
    Optional<PayPassword> findByUserId(Long userId);
    
    /**
     * 检查用户是否设置了支付密码
     */
    boolean existsByUserId(Long userId);
}
