package com.easyjoylife.repository;

import com.easyjoylife.entity.PaymentOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * 支付订单Repository
 */
@Repository
public interface PaymentOrderRepository extends JpaRepository<PaymentOrder, Long> {

    /**
     * 根据订单号查找订单
     */
    Optional<PaymentOrder> findByOrderNo(String orderNo);

    /**
     * 根据第三方支付订单号查找订单
     */
    Optional<PaymentOrder> findByTradeNo(String tradeNo);

    /**
     * 查找用户的支付订单
     */
    List<PaymentOrder> findByUserIdOrderByCreatedTimeDesc(Long userId);

    /**
     * 查找用户指定状态的订单
     */
    List<PaymentOrder> findByUserIdAndStatusOrderByCreatedTimeDesc(Long userId, String status);

    /**
     * 查找过期的待支付订单
     */
    @Query("SELECT p FROM PaymentOrder p WHERE p.status = 'PENDING' AND p.expireTime < :now")
    List<PaymentOrder> findExpiredPendingOrders(@Param("now") LocalDateTime now);

    /**
     * 查找需要重新通知的订单
     */
    @Query("SELECT p FROM PaymentOrder p WHERE p.status = 'PAID' AND p.notifyStatus != 'SUCCESS' AND p.notifyCount < 5")
    List<PaymentOrder> findOrdersNeedNotify();
}