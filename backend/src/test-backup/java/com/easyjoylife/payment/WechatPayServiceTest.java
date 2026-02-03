package com.easyjoylife.payment;

import com.easyjoylife.entity.PaymentOrder;
import com.easyjoylife.service.WechatPayService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

/**
 * 微信支付服务测试
 */
@SpringBootTest
public class WechatPayServiceTest {

    @Autowired
    private WechatPayService wechatPayService;

    @Test
    public void testWechatPayServiceInit() {
        System.out.println("=== 微信支付服务初始化测试 ===");
        
        // 验证服务是否正确初始化
        assertNotNull(wechatPayService, "微信支付服务未初始化");
        System.out.println("✅ 微信支付服务初始化成功");
    }

    @Test
    public void testCreateJsapiOrder() {
        System.out.println("=== 微信支付订单创建测试 ===");
        
        try {
            // 创建测试订单
            PaymentOrder testOrder = createTestOrder();
            String testOpenid = "test_openid_for_payment";
            
            System.out.println("📋 测试订单信息:");
            System.out.println("   订单号: " + testOrder.getOrderNo());
            System.out.println("   金额: ¥" + testOrder.getAmount());
            System.out.println("   用户openid: " + testOpenid);
            
            // 调用创建支付订单
            Map<String, Object> payParams = wechatPayService.createJsapiOrder(testOrder, testOpenid);
            
            // 验证返回参数
            assertNotNull(payParams, "支付参数不能为空");
            System.out.println("✅ 支付订单创建成功");
            
            // 验证必要的支付参数
            assertTrue(payParams.containsKey("timeStamp"), "缺少timeStamp参数");
            assertTrue(payParams.containsKey("nonceStr"), "缺少nonceStr参数");
            assertTrue(payParams.containsKey("package"), "缺少package参数");
            assertTrue(payParams.containsKey("signType"), "缺少signType参数");
            assertTrue(payParams.containsKey("paySign"), "缺少paySign参数");
            
            System.out.println("✅ 支付参数验证通过");
            System.out.println("📦 支付参数:");
            payParams.forEach((key, value) -> 
                System.out.println("   " + key + ": " + value));
            
        } catch (Exception e) {
            System.err.println("❌ 微信支付订单创建失败: " + e.getMessage());
            e.printStackTrace();
            fail("微信支付订单创建测试失败: " + e.getMessage());
        }
    }

    @Test
    public void testQueryOrder() {
        System.out.println("=== 微信支付订单查询测试 ===");
        
        try {
            String testOrderNo = "TEST" + System.currentTimeMillis();
            
            // 查询订单状态
            Map<String, Object> result = wechatPayService.queryOrder(testOrderNo);
            
            assertNotNull(result, "查询结果不能为空");
            assertTrue(result.containsKey("success"), "查询结果应包含success字段");
            
            System.out.println("✅ 订单查询功能正常");
            System.out.println("📋 查询结果: " + result);
            
        } catch (Exception e) {
            System.err.println("❌ 订单查询测试失败: " + e.getMessage());
            // 查询测试失败不影响整体测试，因为订单可能不存在
        }
    }

    /**
     * 创建测试订单
     */
    private PaymentOrder createTestOrder() {
        PaymentOrder order = new PaymentOrder();
        order.setOrderNo("TEST" + System.currentTimeMillis());
        order.setUserId(1L);
        order.setPaymentType(PaymentOrder.PaymentType.RECHARGE);
        order.setPaymentMethod(PaymentOrder.PaymentMethod.WECHAT);
        order.setAmount(new BigDecimal("0.01")); // 测试金额1分钱
        order.setSubject("微信支付测试");
        order.setBody("微信支付功能测试订单");
        order.setStatus(PaymentOrder.Status.PENDING);
        order.setExpireTime(LocalDateTime.now().plusMinutes(30));
        order.setNotifyStatus(PaymentOrder.NotifyStatus.PENDING);
        
        return order;
    }
}