package com.easyjoylife.repository;

import com.easyjoylife.entity.UserWallet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.persistence.LockModeType;
import java.util.Optional;

/**
 * 用户钱包Repository
 */
@Repository
public interface UserWalletRepository extends JpaRepository<UserWallet, Long> {

    /**
     * 根据用户ID查找钱包
     */
    Optional<UserWallet> findByUserId(Long userId);

    /**
     * 根据用户ID查找钱包（加锁）
     */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT w FROM UserWallet w WHERE w.userId = :userId")
    Optional<UserWallet> findByUserIdWithLock(@Param("userId") Long userId);
}