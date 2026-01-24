package com.easyjoylife.repository;

import com.easyjoylife.entity.WalletTransaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 钱包交易记录Repository
 */
@Repository
public interface WalletTransactionRepository extends JpaRepository<WalletTransaction, Long> {

    /**
     * 根据交易流水号查找交易记录
     */
    Optional<WalletTransaction> findByTransactionNo(String transactionNo);

    /**
     * 查找用户的交易记录（分页）
     */
    Page<WalletTransaction> findByUserIdOrderByCreatedTimeDesc(Long userId, Pageable pageable);

    /**
     * 查找用户指定类型的交易记录
     */
    List<WalletTransaction> findByUserIdAndTransactionTypeOrderByCreatedTimeDesc(Long userId, String transactionType);

    /**
     * 根据订单号查找交易记录
     */
    List<WalletTransaction> findByOrderNo(String orderNo);
}