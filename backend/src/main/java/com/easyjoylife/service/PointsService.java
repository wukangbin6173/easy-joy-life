package com.easyjoylife.service;

import com.easyjoylife.entity.PointsTransaction;
import com.easyjoylife.entity.SystemConfig;
import com.easyjoylife.entity.UserPoints;
import com.easyjoylife.repository.PointsTransactionRepository;
import com.easyjoylife.repository.SystemConfigRepository;
import com.easyjoylife.repository.UserPointsRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class PointsService {

    private final UserPointsRepository userPointsRepository;
    private final PointsTransactionRepository pointsTransactionRepository;
    private final SystemConfigRepository systemConfigRepository;

    /** 默认积分比例 2% */
    private static final BigDecimal DEFAULT_EARN_RATE = new BigDecimal("2");

    /**
     * 获取当前积分返还比例（百分比）
     */
    public BigDecimal getEarnRate() {
        return systemConfigRepository.findByConfigKey(SystemConfig.Keys.POINTS_EARN_RATE)
                .map(c -> new BigDecimal(c.getConfigValue()))
                .orElse(DEFAULT_EARN_RATE);
    }

    /**
     * 设置积分返还比例
     */
    @Transactional
    public void setEarnRate(BigDecimal rate) {
        SystemConfig config = systemConfigRepository
                .findByConfigKey(SystemConfig.Keys.POINTS_EARN_RATE)
                .orElseGet(() -> {
                    SystemConfig c = new SystemConfig();
                    c.setConfigKey(SystemConfig.Keys.POINTS_EARN_RATE);
                    c.setDescription("消费返积分比例（百分比）");
                    return c;
                });
        config.setConfigValue(rate.toPlainString());
        systemConfigRepository.save(config);
        log.info("积分返还比例已更新为: {}%", rate);
    }

    /**
     * 获取用户积分
     */
    public UserPoints getUserPoints(Long userId) {
        return userPointsRepository.findByUserId(userId)
                .orElseGet(() -> createUserPoints(userId));
    }

    /**
     * 消费返积分
     * @param userId 用户ID
     * @param consumeAmount 消费金额（元）
     * @param orderNo 关联订单号
     */
    @Transactional
    public long earnPoints(Long userId, BigDecimal consumeAmount, String orderNo) {
        BigDecimal rate = getEarnRate();
        // 积分 = 消费金额 * 比例 / 100，向下取整
        long earnedPoints = consumeAmount.multiply(rate)
                .divide(new BigDecimal("100"), 0, RoundingMode.DOWN)
                .longValue();

        if (earnedPoints <= 0) {
            return 0;
        }

        UserPoints userPoints = userPointsRepository.findByUserIdWithLock(userId)
                .orElseGet(() -> createUserPoints(userId));

        long before = userPoints.getPoints();
        userPoints.setPoints(before + earnedPoints);
        userPoints.setTotalEarned(userPoints.getTotalEarned() + earnedPoints);
        userPointsRepository.save(userPoints);

        // 记录积分变动
        PointsTransaction tx = new PointsTransaction();
        tx.setUserId(userId);
        tx.setType(PointsTransaction.Type.EARN);
        tx.setPoints(earnedPoints);
        tx.setPointsBefore(before);
        tx.setPointsAfter(userPoints.getPoints());
        tx.setOrderNo(orderNo);
        tx.setConsumeAmount(consumeAmount);
        tx.setDescription("消费返积分（" + rate + "%）");
        pointsTransactionRepository.save(tx);

        log.info("用户{}消费{}元，获得{}积分", userId, consumeAmount, earnedPoints);
        return earnedPoints;
    }

    /**
     * 使用积分
     */
    @Transactional
    public boolean usePoints(Long userId, long points, String orderNo, String description) {
        UserPoints userPoints = userPointsRepository.findByUserIdWithLock(userId)
                .orElseGet(() -> createUserPoints(userId));

        if (userPoints.getPoints() < points) {
            return false;
        }

        long before = userPoints.getPoints();
        userPoints.setPoints(before - points);
        userPoints.setTotalUsed(userPoints.getTotalUsed() + points);
        userPointsRepository.save(userPoints);

        PointsTransaction tx = new PointsTransaction();
        tx.setUserId(userId);
        tx.setType(PointsTransaction.Type.USE);
        tx.setPoints(-points);
        tx.setPointsBefore(before);
        tx.setPointsAfter(userPoints.getPoints());
        tx.setOrderNo(orderNo);
        tx.setDescription(description);
        pointsTransactionRepository.save(tx);

        log.info("用户{}使用{}积分", userId, points);
        return true;
    }

    /**
     * 获取积分变动记录
     */
    public List<PointsTransaction> getTransactions(Long userId, int page, int size) {
        Page<PointsTransaction> result = pointsTransactionRepository
                .findByUserIdOrderByCreatedTimeDesc(userId, PageRequest.of(page, size));
        return result.getContent();
    }

    private UserPoints createUserPoints(Long userId) {
        UserPoints p = new UserPoints();
        p.setUserId(userId);
        return userPointsRepository.save(p);
    }
}
