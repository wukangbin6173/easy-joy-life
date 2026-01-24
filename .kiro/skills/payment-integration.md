---
name: "Payment Integration Skills"
description: "Complete payment system integration knowledge including Alipay and WeChat Pay"
tags: ["payment", "alipay", "wechat", "integration", "api"]
version: "1.0.0"
---

# Payment Integration Skills

## 支付宝支付集成

### 配置要求
- AppID: 应用唯一标识
- 商户私钥: RSA2私钥用于签名
- 支付宝公钥: 用于验证回调签名
- 回调地址: 异步通知URL

### 关键接口
- 统一下单: alipay.trade.wap.pay
- 订单查询: alipay.trade.query
- 退款接口: alipay.trade.refund

### 签名算法
使用RSA2签名算法，对请求参数进行签名验证

## 微信支付集成

### 配置要求
- AppID: 小程序应用ID
- 商户号: 微信支付商户号
- API证书: 商户API证书文件
- API v3密钥: 32位密钥用于回调解密

### 关键接口
- 统一下单: /v3/pay/transactions/jsapi
- 订单查询: /v3/pay/transactions/out-trade-no/{out_trade_no}
- 退款接口: /v3/refund/domestic/refunds

### 小程序支付流程
1. 获取用户openid
2. 调用统一下单API
3. 生成支付参数
4. 调用wx.requestPayment
5. 处理支付结果

## 数据库设计

### 支付订单表 (payment_orders)
```sql
CREATE TABLE payment_orders (
    id BIGINT PRIMARY KEY,
    order_no VARCHAR(32) UNIQUE,
    trade_no VARCHAR(64),
    user_id BIGINT,
    payment_method VARCHAR(20),
    amount DECIMAL(10,2),
    status VARCHAR(20),
    created_time DATETIME
);
```

### 用户钱包表 (user_wallets)
```sql
CREATE TABLE user_wallets (
    id BIGINT PRIMARY KEY,
    user_id BIGINT UNIQUE,
    balance DECIMAL(10,2),
    total_recharge DECIMAL(10,2),
    status VARCHAR(20)
);
```

## 安全最佳实践

1. **签名验证**: 所有回调必须验证签名
2. **HTTPS通信**: 所有支付接口使用HTTPS
3. **订单防重**: 使用唯一订单号防止重复支付
4. **金额校验**: 回调金额与订单金额必须一致
5. **状态检查**: 处理前检查订单当前状态

## 错误处理

### 常见错误码
- 支付宝: 40004 - 业务处理失败
- 微信: ORDERNOTEXIST - 订单不存在
- 网络超时: 重试机制
- 签名失败: 检查密钥配置

### 重试策略
- 网络异常: 指数退避重试
- 业务异常: 记录日志不重试
- 回调处理: 最多重试5次