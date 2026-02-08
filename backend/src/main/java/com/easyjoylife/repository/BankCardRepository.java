package com.easyjoylife.repository;

import com.easyjoylife.entity.BankCard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BankCardRepository extends JpaRepository<BankCard, Long> {
    
    /**
     * 根据用户ID查找所有银行卡
     */
    List<BankCard> findByUserIdOrderByIsDefaultDescCreatedTimeDesc(Long userId);
    
    /**
     * 根据用户ID和卡ID查找
     */
    Optional<BankCard> findByIdAndUserId(Long id, Long userId);
    
    /**
     * 根据用户ID查找默认银行卡
     */
    Optional<BankCard> findByUserIdAndIsDefaultTrue(Long userId);
    
    /**
     * 统计用户的银行卡数量
     */
    long countByUserId(Long userId);
    
    /**
     * 根据卡号查找（用于检查重复）
     */
    Optional<BankCard> findByCardNo(String cardNo);
}
