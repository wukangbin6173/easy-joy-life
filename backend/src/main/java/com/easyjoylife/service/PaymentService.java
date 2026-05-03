package com.easyjoylife.service;

import com.easyjoylife.entity.PaymentOrder;
import com.easyjoylife.entity.UserWallet;
import com.easyjoylife.entity.WalletTransaction;
import com.easyjoylife.repository.PaymentOrderRepository;
import com.easyjoylife.repository.UserWalletRepository;
import com.easyjoylife.repository.WalletTransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * 支付服务类
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentOrderRepository paymentOrderRepository;
    private final UserWalletRepository userWalletRepository;
    private final WalletTransactionRepository walletTransactionRepository;
    private final PointsService pointsService;

    /**
     * 创建充值订单
     */
    @Transactional
    public PaymentOrder createRechargeOrder(Long userId, BigDecimal amount, String paymentMethod) {
        // 生成订单号
        String orderNo = generateOrderNo();
        
        // 创建支付订单
        PaymentOrder order = new PaymentOrder();
        order.setOrderNo(orderNo);
        order.setUserId(userId);
        order.setPaymentType(PaymentOrder.PaymentType.RECHARGE);
        order.setPaymentMethod(paymentMethod);
        order.setAmount(amount);
        order.setSubject("钱包充值");
        order.setBody("易享生活钱包充值 ¥" + amount);
        order.setStatus(PaymentOrder.Status.PENDING);
        order.setExpireTime(LocalDateTime.now().plusMinutes(30)); // 30分钟过期
        order.setNotifyStatus(PaymentOrder.NotifyStatus.PENDING);
        
        return paymentOrderRepository.save(order);
    }

    /**
     * 根据订单号查找订单
     */
    public Optional<PaymentOrder> findOrderByOrderNo(String orderNo) {
        return paymentOrderRepository.findByOrderNo(orderNo);
    }

    /**
     * 根据第三方订单号查找订单
     */
    public Optional<PaymentOrder> findOrderByTradeNo(String tradeNo) {
        return paymentOrderRepository.findByTradeNo(tradeNo);
    }

    /**
     * 处理支付成功回调
     */
    @Transactional
    public boolean handlePaymentSuccess(String orderNo, String tradeNo) {
        try {
            Optional<PaymentOrder> orderOpt = paymentOrderRepository.findByOrderNo(orderNo);
            if (!orderOpt.isPresent()) {
                log.error("订单不存在: {}", orderNo);
                return false;
            }

            PaymentOrder order = orderOpt.get();
            
            // 检查订单状态
            if (!PaymentOrder.Status.PENDING.equals(order.getStatus())) {
                log.warn("订单状态不是待支付: {} - {}", orderNo, order.getStatus());
                return true; // 已处理过，返回成功
            }

            // 更新订单状态
            order.setStatus(PaymentOrder.Status.PAID);
            order.setTradeNo(tradeNo);
            order.setPaidTime(LocalDateTime.now());
            order.setNotifyStatus(PaymentOrder.NotifyStatus.SUCCESS);
            paymentOrderRepository.save(order);

            // 处理充值
            if (PaymentOrder.PaymentType.RECHARGE.equals(order.getPaymentType())) {
                processRecharge(order.getUserId(), order.getAmount(), orderNo);
            }

            log.info("支付成功处理完成: {}", orderNo);
            return true;
            
        } catch (Exception e) {
            log.error("处理支付成功回调失败: {}", orderNo, e);
            return false;
        }
    }

    /**
     * 处理充值
     */
    @Transactional
    public void processRecharge(Long userId, BigDecimal amount, String orderNo) {
        // 获取或创建用户钱包
        UserWallet wallet = userWalletRepository.findByUserIdWithLock(userId)
                .orElseGet(() -> createUserWallet(userId));

        // 记录充值前余额
        BigDecimal balanceBefore = wallet.getBalance();
        
        // 更新钱包余额
        wallet.setBalance(wallet.getBalance().add(amount));
        wallet.setTotalRecharge(wallet.getTotalRecharge().add(amount));
        userWalletRepository.save(wallet);

        // 创建交易记录
        WalletTransaction transaction = new WalletTransaction();
        transaction.setTransactionNo(generateTransactionNo());
        transaction.setUserId(userId);
        transaction.setOrderNo(orderNo);
        transaction.setTransactionType(WalletTransaction.TransactionType.RECHARGE);
        transaction.setAmount(amount);
        transaction.setBalanceBefore(balanceBefore);
        transaction.setBalanceAfter(wallet.getBalance());
        transaction.setDescription("钱包充值");
        transaction.setStatus(WalletTransaction.Status.SUCCESS);
        walletTransactionRepository.save(transaction);

        log.info("用户充值成功: userId={}, amount={}, newBalance={}", 
                userId, amount, wallet.getBalance());
    }

    /**
     * 余额消费（扣款 + 返积分）
     */
    @Transactional
    public boolean consume(Long userId, BigDecimal amount, String orderNo, String description) {
        UserWallet wallet = userWalletRepository.findByUserIdWithLock(userId)
                .orElseGet(() -> createUserWallet(userId));

        if (wallet.getAvailableBalance().compareTo(amount) < 0) {
            log.warn("余额不足: userId={}, available={}, need={}", userId, wallet.getAvailableBalance(), amount);
            return false;
        }

        BigDecimal balanceBefore = wallet.getBalance();
        wallet.setBalance(wallet.getBalance().subtract(amount));
        wallet.setTotalConsume(wallet.getTotalConsume().add(amount));
        userWalletRepository.save(wallet);

        // 创建交易记录
        WalletTransaction transaction = new WalletTransaction();
        transaction.setTransactionNo(generateTransactionNo());
        transaction.setUserId(userId);
        transaction.setOrderNo(orderNo);
        transaction.setTransactionType(WalletTransaction.TransactionType.CONSUME);
        transaction.setAmount(amount.negate());
        transaction.setBalanceBefore(balanceBefore);
        transaction.setBalanceAfter(wallet.getBalance());
        transaction.setDescription(description != null ? description : "消费");
        transaction.setStatus(WalletTransaction.Status.SUCCESS);
        walletTransactionRepository.save(transaction);

        // 消费返积分
        long earnedPoints = pointsService.earnPoints(userId, amount, orderNo);

        log.info("用户消费成功: userId={}, amount={}, newBalance={}, earnedPoints={}",
                userId, amount, wallet.getBalance(), earnedPoints);
        return true;
    }

    /**
     * 创建用户钱包（处理并发重复创建）
     */
    private UserWallet createUserWallet(Long userId) {
        try {
            UserWallet wallet = new UserWallet();
            wallet.setUserId(userId);
            wallet.setBalance(BigDecimal.ZERO);
            wallet.setFrozenAmount(BigDecimal.ZERO);
            wallet.setTotalRecharge(BigDecimal.ZERO);
            wallet.setTotalConsume(BigDecimal.ZERO);
            wallet.setStatus(UserWallet.Status.ACTIVE);
            return userWalletRepository.save(wallet);
        } catch (Exception e) {
            // 唯一约束冲突，说明已被其他线程创建，直接查询返回
            log.warn("钱包已存在，重新查询: userId={}", userId);
            return userWalletRepository.findByUserId(userId)
                    .orElseThrow(() -> new RuntimeException("创建钱包失败: " + e.getMessage()));
        }
    }

    /**
     * 获取用户钱包
     */
    public UserWallet getUserWallet(Long userId) {
        return userWalletRepository.findByUserId(userId)
                .orElseGet(() -> createUserWallet(userId));
    }

    /**
     * 获取用户交易记录
     */
    public List<WalletTransaction> getUserTransactions(Long userId) {
        return walletTransactionRepository.findByUserIdOrderByCreatedTimeDesc(userId, 
                org.springframework.data.domain.PageRequest.of(0, 50)).getContent();
    }

    /**
     * 获取用户订单列表
     */
    public List<PaymentOrder> getUserOrders(Long userId) {
        return paymentOrderRepository.findByUserIdOrderByCreatedTimeDesc(userId);
    }

    /**
     * 生成订单号
     */
    private String generateOrderNo() {
        return "PAY" + System.currentTimeMillis() + String.format("%04d", 
                (int)(Math.random() * 10000));
    }

    /**
     * 生成交易流水号
     */
    private String generateTransactionNo() {
        return "TXN" + System.currentTimeMillis() + String.format("%04d", 
                (int)(Math.random() * 10000));
    }
}