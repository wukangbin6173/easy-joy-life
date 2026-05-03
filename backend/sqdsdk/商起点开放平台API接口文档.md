# 商起点开放平台 API 接口文档

> 版本：v1.0 | 更新日期：2026-04-29

---

## 目录

- [1. 概述](#1-概述)
- [2. 接入准备](#2-接入准备)
- [3. 鉴权机制](#3-鉴权机制)
- [4. 通用说明](#4-通用说明)
- [5. 商户数据](#5-商户数据)
- [6. 商品数据](#6-商品数据)
- [7. 订单数据](#7-订单数据)
- [8. 会员卡数据](#8-会员卡数据)
- [9. 优惠券](#9-优惠券)
- [10. 抵金券](#10-抵金券)
- [11. 客户管理](#11-客户管理)
- [12. 可预订资源](#12-可预订资源)
- [13. 预约数据](#13-预约数据)
- [14. 支付（收银台）](#14-支付收银台)
- [15. 提现](#15-提现)
- [16. B2B转账](#16-b2b转账)
- [17. 固定收款码](#17-固定收款码)
- [18. 数据统计](#18-数据统计)
- [19. 实名认证](#19-实名认证)
- [20. 支付宝授权绑定](#20-支付宝授权绑定)
- [21. 风控模型](#21-风控模型)
- [22. 错误码](#22-错误码)
- [23. 计费预定](#23-计费预定)
- [24. 评论系统](#24-评论系统)
- [25. IoT设备控制](#25-iot设备控制)

---

## 1. 概述

商起点开放平台为第三方 App 开发者提供商户经营管理能力的 RESTful API。通过接入本平台，您的 App 可以实现商户管理、商品管理、订单处理、会员卡、优惠券、预约、支付等完整的商业闭环功能。

**Base URL**: `https://{domain}/open-api`

---

## 2. 接入准备

1. 在商起点运营后台注册开发者账号
2. 创建应用，获取 `AppKey` 和 `AppSecret`
3. 配置 IP 白名单（可选）
4. 申请所需的 API 权限模块

---

## 3. 鉴权机制

所有 API 请求必须携带以下 HTTP 请求头：

| 请求头 | 说明 | 示例 |
|--------|------|------|
| `X-App-Key` | 应用标识 | `app_abc123` |
| `X-Timestamp` | 当前时间戳（秒级） | `1713254400` |
| `X-Nonce` | 随机字符串（防重放） | `a1b2c3d4e5` |
| `X-Sign` | HMAC-SHA256 签名 | `Base64编码的签名` |

### 签名算法

```
签名原文 = AppKey + Timestamp + Nonce + RequestBody
X-Sign = Base64( HMAC-SHA256( AppSecret, 签名原文 ) )
```

### 安全策略

- 时间戳有效窗口：±5 分钟
- Nonce 防重放：同一 Nonce 5 分钟内不可重复使用
- IP 白名单：如已配置，仅允许白名单内 IP 访问
- 限流：按应用配置的 QPS 上限进行限流

---

## 4. 通用说明

### 统一响应格式

```json
{
  "code": 0,
  "msg": "success",
  "data": { ... }
}
```

- `code = 0` 表示成功，非 0 表示失败
- 分页接口返回 `data.list`（数据列表）和 `data.total`（总数）

### 分页参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| pageNo | Integer | 否 | 页码，默认 1 |
| pageSize | Integer | 否 | 每页条数，默认 10 |

### 权限模块

每个接口需要对应的权限模块授权，权限类型分为：
- `READ` — 只读权限
- `WRITE` — 读写权限
- `FULL` — 完全权限（含删除）

### 用户标识说明

- `externalUserId` — 您的 App 中的用户唯一标识
- `appUserId` — 商起点平台内部用户 ID（兼容旧版，建议使用 externalUserId）

---

## 5. 商户数据

> 权限模块：`merchant`

### 5.1 查询商户列表

`GET /v1/merchants`

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| pageNo | Integer | 否 | 页码 |
| pageSize | Integer | 否 | 每页条数 |
| merchantId | Long | 否 | 指定商户ID |

**权限**: `merchant:read`

### 5.2 查询商户详情

`GET /v1/merchants/{merchantId}`

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| merchantId | Long | 是 | 商户ID（路径参数） |

**权限**: `merchant:read`

### 5.3 查询门店列表

`GET /v1/stores`

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| pageNo | Integer | 否 | 页码 |
| pageSize | Integer | 否 | 每页条数 |
| merchantId | Long | 否 | 商户ID |

**权限**: `merchant:read`

### 5.4 查询门店详情

`GET /v1/stores/{storeId}`

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| storeId | Long | 是 | 门店ID（路径参数） |

**权限**: `merchant:read`

### 5.5 查询附近门店

`GET /v1/stores/nearby`

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| longitude | Double | 是 | 经度 |
| latitude | Double | 是 | 纬度 |
| radius | Integer | 否 | 搜索半径（米） |

**权限**: `merchant:read`

### 5.6 查询门店营业时间

`GET /v1/stores/{storeId}/business-hours`

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| storeId | Long | 是 | 门店ID（路径参数） |

**权限**: `merchant:read`

### 5.7 商户注册（入驻）

`POST /v1/merchants/register`

**权限**: `merchant:write`

**请求体**: 商户注册信息（JSON）

### 5.8 提交商户认证

`POST /v1/merchants/{merchantId}/certification`

**权限**: `merchant:write`

### 5.9 查询认证状态

`GET /v1/merchants/{merchantId}/certification/status`

**权限**: `merchant:read`

### 5.10 更新商户信息

`PUT /v1/merchants/{merchantId}`

**权限**: `merchant:write`

### 5.11 创建门店

`POST /v1/stores`

**权限**: `merchant:write`

### 5.12 更新门店

`PUT /v1/stores/{storeId}`

**权限**: `merchant:write`

### 5.13 删除门店

`DELETE /v1/stores/{storeId}`

**权限**: `merchant:write`

---

## 6. 商品数据

> 权限模块：`product`

### 6.1 查询商品列表

`GET /v1/products`

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| pageNo | Integer | 否 | 页码 |
| pageSize | Integer | 否 | 每页条数 |
| merchantId | Long | 否 | 商户ID |
| categoryId | Long | 否 | 分类ID |
| status | Integer | 否 | 状态（0=上架, 1=下架） |

**权限**: `product:read`

### 6.2 查询商品详情

`GET /v1/products/{productId}`

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| productId | Long | 是 | 商品ID（路径参数） |

**权限**: `product:read`

### 6.3 搜索商品

`GET /v1/products/search`

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| keyword | String | 否 | 搜索关键词 |
| merchantId | Long | 否 | 商户ID |
| categoryId | Long | 否 | 分类ID |
| minPrice | Integer | 否 | 最低价格（分） |
| maxPrice | Integer | 否 | 最高价格（分） |
| sortField | String | 否 | 排序字段 |
| sortOrder | String | 否 | 排序方向（asc/desc） |
| pageNo | Integer | 否 | 页码 |
| pageSize | Integer | 否 | 每页条数 |

**权限**: `product:read`

### 6.4 查询商品分类列表

`GET /v1/product-categories`

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| merchantId | Long | 是 | 商户ID |

**权限**: `product:read`

### 6.5 创建商品

`POST /v1/products`

**权限**: `product:write`

**请求体**: 商品信息（JSON），包含 merchantId、name、categoryId、price 等

### 6.6 更新商品

`PUT /v1/products/{productId}`

**权限**: `product:write`

### 6.7 删除商品

`DELETE /v1/products/{productId}`

**权限**: `product:full`

### 6.8 商品上架/下架

`PUT /v1/products/{productId}/status`

**权限**: `product:write`

**请求体**:
```json
{ "status": 0 }
```
- `0` = 上架，`1` = 下架

### 6.9 创建商品分类

`POST /v1/product-categories`

**权限**: `product:write`

### 6.10 更新商品分类

`PUT /v1/product-categories/{categoryId}?merchantId={merchantId}`

**权限**: `product:write`

### 6.11 删除商品分类

`DELETE /v1/product-categories/{categoryId}?merchantId={merchantId}`

**权限**: `product:full`

### 6.12 库存入库

`POST /v1/products/{productId}/stock-in`

**权限**: `product:write`

### 6.13 库存出库

`POST /v1/products/{productId}/stock-out`

**权限**: `product:write`

### 6.14 查询库存变动日志

`GET /v1/products/{productId}/stock-logs`

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| productId | Long | 是 | 商品ID（路径参数） |
| pageNo | Integer | 否 | 页码 |
| pageSize | Integer | 否 | 每页条数 |

**权限**: `product:read`

### 6.15 查询商品统计

`GET /v1/products/statistics?merchantId={merchantId}`

**权限**: `product:read`

---

## 7. 订单数据

> 权限模块：`order`

### 7.1 查询订单列表

`GET /v1/orders`

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| pageNo | Integer | 否 | 页码 |
| pageSize | Integer | 否 | 每页条数 |
| merchantId | Long | 否 | 商户ID |
| userId / externalUserId | Long / String | 否 | 用户标识 |
| status | Integer | 否 | 订单状态 |

**权限**: `order:read`

### 7.2 查询订单详情

`GET /v1/orders/{orderId}?merchantId={merchantId}`

**权限**: `order:read`

### 7.3 查询订单状态变更历史

`GET /v1/orders/{orderId}/status-history?merchantId={merchantId}`

**权限**: `order:read`

### 7.4 查询订单统计

`GET /v1/orders/statistics?merchantId={merchantId}`

**权限**: `order:read`

### 7.5 查询退款详情

`GET /v1/orders/{orderId}/refund?merchantId={merchantId}`

**权限**: `order:read`

### 7.6 创建订单

`POST /v1/orders`

**权限**: `order:write`

**请求体**:
```json
{
  "merchantId": 1,
  "storeId": 1,
  "externalUserId": "user_10001",
  "orderType": 1,
  "couponId": null,
  "voucherIds": [],
  "remark": "备注",
  "items": [
    { "productId": 1, "quantity": 2, "price": 1000 }
  ]
}
```

### 7.7 取消订单

`POST /v1/orders/{orderId}/cancel?merchantId={merchantId}`

**权限**: `order:write`

### 7.8 确认收货

`POST /v1/orders/{orderId}/confirm-receipt?merchantId={merchantId}`

**权限**: `order:write`

### 7.9 核销订单

`POST /v1/orders/{orderId}/write-off?merchantId={merchantId}`

**权限**: `order:write`

### 7.10 申请退款

`POST /v1/orders/{orderId}/refund?merchantId={merchantId}`

**权限**: `order:write`

**请求体**:
```json
{
  "refundAmount": 1000,
  "reason": "退款原因"
}
```

### 7.11 订单评价

`POST /v1/orders/{orderId}/review?merchantId={merchantId}`

**权限**: `order:write`

**请求体**:
```json
{
  "content": "评价内容",
  "rating": 5
}
```

### 7.12 订单支付

`POST /v1/orders/{orderId}/pay?merchantId={merchantId}`

**权限**: `order:write`

**请求体**:
```json
{
  "channelCode": "wx_pub",
  "userIp": "127.0.0.1",
  "returnUrl": "https://your-app.com/return",
  "channelExtras": {}
}
```

### 7.13 更新配送状态

`PUT /v1/orders/{orderId}/delivery-status?merchantId={merchantId}`

**权限**: `order:write`

**请求体**:
```json
{
  "deliveryStatus": 1,
  "deliveryNo": "SF1234567890"
}
```

### 7.14 确认预约订单

`POST /v1/orders/{orderId}/confirm-booking?merchantId={merchantId}`

**权限**: `order:write`

### 7.15 变更预约订单

`POST /v1/orders/{orderId}/change-booking?merchantId={merchantId}`

**权限**: `order:write`

---

## 8. 会员卡数据

> 权限模块：`member_card`

### 8.1 查询会员卡模板列表

`GET /v1/card-templates`

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| pageNo | Integer | 否 | 页码 |
| pageSize | Integer | 否 | 每页条数 |
| merchantId | Long | 否 | 商户ID |

**权限**: `member_card:read`

### 8.2 查询会员卡模板详情

`GET /v1/card-templates/{templateId}`

**权限**: `member_card:read`

### 8.3 创建会员卡购买单

`POST /v1/member-card-purchases`

**权限**: `member_card:write`

**请求体**:
```json
{
  "merchantId": 1,
  "templateId": 1,
  "externalUserId": "user_10001",
  "phone": "13800138000",
  "paymentMode": 0
}
```

说明：
- `paymentMode = 0`（全款购卡）时，如用户未进件，可通过 `phone` 自动注册
- 非全款购卡需先完成客户进件

### 8.4 创建会员卡购买收银台

`POST /v1/member-card-purchases/{purchaseId}/cashier`

**权限**: `member_card:write`

**请求体**:
```json
{
  "returnUrl": "https://your-app.com/return",
  "expireMinutes": 30
}
```

### 8.5 查询会员卡购买单

`GET /v1/member-card-purchases/{purchaseId}`

**权限**: `member_card:read`

### 8.6 查询会员卡列表

`GET /v1/member-cards`

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| pageNo | Integer | 否 | 页码 |
| pageSize | Integer | 否 | 每页条数 |
| merchantId | Long | 否 | 商户ID |

**权限**: `member_card:read`

### 8.7 查询会员卡详情

`GET /v1/member-cards/{cardNo}`

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| cardNo | String | 是 | 会员卡卡号（路径参数） |

**权限**: `member_card:read`

### 8.8 会员卡充值

`POST /v1/member-cards/{cardNo}/recharge`

**权限**: `member_card:write`

**请求体**:
```json
{
  "amount": 10000,
  "tierId": 1
}
```

### 8.9 生成会员卡核销二维码

`POST /v1/member-cards/{cardNo}/write-off-qrcode`

**权限**: `member_card:write`

**返回**: 核销二维码信息（含 qrCodeUrl、requestNo）

### 8.10 查询会员卡核销记录

`GET /v1/member-cards/write-off-records/{requestNo}`

**权限**: `member_card:read`

### 8.11 确认会员卡核销

`POST /v1/member-cards/write-off-records/{requestNo}/confirm`

**权限**: `member_card:write`

**请求体**:
```json
{
  "approved": true,
  "remark": "确认核销"
}
```

### 8.12 查询会员卡消费记录

`GET /v1/member-cards/{cardNo}/consumption-records`

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| pageNo | Integer | 否 | 页码 |
| pageSize | Integer | 否 | 每页条数 |

**权限**: `member_card:read`

### 8.13 查询会员卡统计

`GET /v1/member-cards/statistics?merchantId={merchantId}`

**权限**: `member_card:read`

### 8.14 申请会员卡退款

`POST /v1/member-cards/refund/apply`

**权限**: `member_card:write`

**请求体**:
```json
{
  "cardNo": "MC20240001",
  "externalUserId": "user_10001",
  "refundAmount": 5000,
  "refundReason": "退款原因",
  "evidenceUrls": ["https://..."]
}
```

---

## 9. 优惠券

> 权限模块：`coupon`

### 9.1 查询优惠券列表

`GET /v1/coupons`

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| pageNo | Integer | 否 | 页码 |
| pageSize | Integer | 否 | 每页条数 |
| merchantId | Long | 否 | 商户ID |

**权限**: `coupon:read`

### 9.2 查询优惠券详情

`GET /v1/coupons/{couponId}?merchantId={merchantId}`

**权限**: `coupon:read`

### 9.3 查询用户优惠券

`GET /v1/coupons/user`

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| externalUserId | String | 是 | App端用户标识 |
| merchantId | Long | 否 | 商户ID |
| pageNo | Integer | 否 | 页码 |
| pageSize | Integer | 否 | 每页条数 |

**权限**: `coupon:read`

### 9.4 查询优惠券模板列表

`GET /v1/coupon-templates`

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| merchantId | Long | 否 | 商户ID |
| pageNo | Integer | 否 | 页码 |
| pageSize | Integer | 否 | 每页条数 |

**权限**: `coupon:read`

### 9.5 查询可领取优惠券

`GET /v1/coupons/available?merchantId={merchantId}`

**权限**: `coupon:read`

### 9.6 创建优惠券购买单

`POST /v1/coupon-purchases`

**权限**: `coupon:write`

**请求体**:
```json
{
  "merchantId": 1,
  "templateId": 1,
  "externalUserId": "user_10001",
  "bizNo": "BIZ001",
  "storeId": 1
}
```

### 9.7 创建优惠券购买收银台

`POST /v1/coupon-purchases/{purchaseId}/cashier`

**权限**: `coupon:write`

**请求体**:
```json
{
  "returnUrl": "https://your-app.com/return",
  "expireMinutes": 30
}
```

### 9.8 查询优惠券购买单

`GET /v1/coupon-purchases/{purchaseId}`

**权限**: `coupon:read`

### 9.9 领取优惠券

`POST /v1/coupons/claim`

**权限**: `coupon:write`

**请求体**:
```json
{
  "merchantId": 1,
  "templateId": 1,
  "externalUserId": "user_10001",
  "storeId": 1
}
```

### 9.10 购买优惠券

`POST /v1/coupons/purchase`

**权限**: `coupon:write`

### 9.11 验证优惠券

`POST /v1/coupons/{couponId}/verify?merchantId={merchantId}`

**权限**: `coupon:read`

### 9.12 核销优惠券

`POST /v1/coupons/{couponId}/write-off`

**权限**: `coupon:write`

**请求体**:
```json
{
  "merchantId": 1,
  "storeId": 1,
  "remark": "核销备注"
}
```

### 9.13 退款优惠券购买单

`POST /v1/coupon-purchases/refund`

**权限**: `coupon:write`

### 9.14 生成优惠券核销二维码

`POST /v1/coupons/{couponId}/write-off-qrcode?merchantId={merchantId}`

**权限**: `coupon:write`

### 9.15 查询优惠券核销记录

`GET /v1/coupons/write-off-records/{requestNo}`

**权限**: `coupon:read`

### 9.16 创建优惠券模板

`POST /v1/coupon-templates`

**权限**: `coupon:write`

### 9.17 更新优惠券模板

`PUT /v1/coupon-templates/{templateId}?merchantId={merchantId}`

**权限**: `coupon:write`

### 9.18 发布优惠券模板

`PUT /v1/coupon-templates/{templateId}/publish?merchantId={merchantId}`

**权限**: `coupon:write`

### 9.19 暂停优惠券模板

`PUT /v1/coupon-templates/{templateId}/pause?merchantId={merchantId}`

**权限**: `coupon:write`

### 9.20 恢复优惠券模板

`PUT /v1/coupon-templates/{templateId}/resume?merchantId={merchantId}`

**权限**: `coupon:write`

### 9.21 批量发放优惠券

`POST /v1/coupon-templates/{templateId}/issue`

**权限**: `coupon:write`

**请求体**:
```json
{
  "merchantId": 1,
  "externalUserIds": ["user_001", "user_002"]
}
```

---

## 10. 抵金券

> 权限模块：`cash_voucher`
> 
> Base Path: `/v1/cash-voucher`

### 10.1 购买抵金券

`POST /v1/cash-voucher/acquire`

**权限**: `cash_voucher:write`

### 10.2 创建抵金券购买收银台

`POST /v1/cash-voucher/purchases/{purchaseId}/cashier`

**权限**: `cash_voucher:write`

### 10.3 查询抵金券购买单

`GET /v1/cash-voucher/purchases/{purchaseId}`

**权限**: `cash_voucher:read`

### 10.4 查询抵金券购买折扣配置

`GET /v1/cash-voucher/purchase-discount-config`

**权限**: `cash_voucher:read`

### 10.5 退款抵金券

`POST /v1/cash-voucher/refund`

**权限**: `cash_voucher:write`

### 10.6 生成抵金券核销二维码

`POST /v1/cash-voucher/{voucherId}/write-off-qrcode`

**权限**: `cash_voucher:write`

### 10.7 赠送抵金券

`POST /v1/cash-voucher/gift`

**权限**: `cash_voucher:write`

### 10.8 撤销赠送

`POST /v1/cash-voucher/revoke-gift`

**权限**: `cash_voucher:write`

### 10.9 查询抵金券核销记录

`GET /v1/cash-voucher/write-off-records/{requestNo}`

**权限**: `cash_voucher:read`

---

## 11. 客户管理

> 权限模块：`customer`

### 11.1 客户进件建档

`POST /v1/customers/intake`

**权限**: `customer:write`

**请求体**:
```json
{
  "externalUserId": "user_10001",
  "realName": "张三",
  "phone": "13800138000",
  "idCardNumber": "110101199001011234",
  "nickname": "小张",
  "avatarUrl": "https://..."
}
```

说明：客户进件是使用会员卡、优惠券等交易功能的前提。

### 11.2 查询客户列表

`GET /v1/customers`

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| merchantId | Long | 否 | 商户ID |
| pageNo | Integer | 否 | 页码 |
| pageSize | Integer | 否 | 每页条数 |

**权限**: `customer:read`

### 11.3 查询客户详情

`GET /v1/customers/{customerId}?merchantId={merchantId}`

**权限**: `customer:read`

### 11.4 按手机号换取平台用户ID

`GET /v1/customers/platform-user-id-by-phone?phone={phone}`

**权限**: `customer:read`

### 11.5 查询客户消费记录

`GET /v1/customers/{customerId}/transactions?merchantId={merchantId}`

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| pageNo | Integer | 否 | 页码 |
| pageSize | Integer | 否 | 每页条数 |

**权限**: `customer:read`

### 11.6 查询客户标签

`GET /v1/customers/{customerId}/tags?merchantId={merchantId}`

**权限**: `customer:read`

### 11.7 添加客户标签

`POST /v1/customers/{customerId}/tags?merchantId={merchantId}`

**权限**: `customer:write`

### 11.8 移除客户标签

`DELETE /v1/customers/{customerId}/tags/{tagName}?merchantId={merchantId}`

**权限**: `customer:write`

### 11.9 查询客户统计

`GET /v1/customers/statistics?merchantId={merchantId}`

**权限**: `customer:read`

---

## 12. 可预订资源

> 权限模块：`resource`

### 12.1 查询资源列表

`GET /v1/resources`

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| merchantId | Long | 否 | 商户ID |
| pageNo | Integer | 否 | 页码 |
| pageSize | Integer | 否 | 每页条数 |

**权限**: `resource:read`

### 12.2 查询资源详情

`GET /v1/resources/{resourceId}?merchantId={merchantId}`

**权限**: `resource:read`

### 12.3 查询资源可用性

`GET /v1/resources/{resourceId}/availability?merchantId={merchantId}&date={yyyy-MM-dd}`

**权限**: `resource:read`

### 12.4 批量查询资源状态

`GET /v1/resources/batch-status?resourceIds={ids}&merchantId={merchantId}`

**权限**: `resource:read`

### 12.5 查询资源统计

`GET /v1/resources/statistics?merchantId={merchantId}`

**权限**: `resource:read`

### 12.6 创建资源

`POST /v1/resources`

**权限**: `resource:write`

### 12.7 更新资源

`PUT /v1/resources/{resourceId}?merchantId={merchantId}`

**权限**: `resource:write`

### 12.8 删除资源

`DELETE /v1/resources/{resourceId}?merchantId={merchantId}`

**权限**: `resource:full`

### 12.9 更新资源状态

`PUT /v1/resources/{resourceId}/status?merchantId={merchantId}`

**权限**: `resource:write`

### 12.10 设置资源价格

`PUT /v1/resources/{resourceId}/price?merchantId={merchantId}`

**权限**: `resource:write`

### 12.11 设置资源排班

`PUT /v1/resources/{resourceId}/schedule?merchantId={merchantId}`

**权限**: `resource:write`

---

## 13. 预约数据

> 权限模块：`booking`

### 13.1 查询可用预约时间段

`GET /v1/booking/available-slots`

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| merchantId | Long | 是 | 商户ID |
| storeId | Long | 否 | 门店ID |
| resourceId | Long | 否 | 指定资源ID |
| resourceTypeId | Long | 否 | 资源类型ID，不传 resourceId 时按类型筛选 |
| bookingDate | String | 是 | 日期（yyyy-MM-dd） |
| durationMinutes | Integer | 否 | 预约时长，默认60分钟 |
| slotStepMinutes | Integer | 否 | 时间步长，默认等于预约时长 |

**权限**: `booking:read`

### 13.2 查询预约列表

`GET /v1/booking/orders`

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| merchantId | Long | 否 | 商户ID |
| pageNo | Integer | 否 | 页码 |
| pageSize | Integer | 否 | 每页条数 |

**权限**: `booking:read`

### 13.3 查询预约详情

`GET /v1/booking/orders/{orderId}?merchantId={merchantId}`

**权限**: `booking:read`

### 13.4 查询预约统计

`GET /v1/booking/statistics?merchantId={merchantId}`

**权限**: `booking:read`

### 13.5 创建预约订单

`POST /v1/booking/orders`

请求体除基础预约字段外，可传：

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| resourceId | Long | 否 | 指定单个资源，例如房间、台球桌、技师 |
| resourceIds | List<Long> | 否 | 指定多个资源，例如房间+技师 |
| resourceTypeId | Long | 否 | 自动分配时的资源类型 |
| assignMode | Integer | 否 | 1-自动分配 2-指定资源 |
| isDesignated | Integer | 否 | 是否指定资源：0-否 1-是 |
| designatedFee | Integer | 否 | 指定资源附加费，单位分 |

创建成功后会校验资源排班、已有占用和最小提前预约时间，并写入预约资源关联和时间占用。开始服务会尝试执行 IoT `START_USAGE` 动作，完成服务会尝试执行 IoT `END_USAGE` 动作；未配置 IoT 的门店不会影响预约状态流转。

**权限**: `booking:write`

### 13.6 变更预约

`PUT /v1/booking/orders/{orderId}?merchantId={merchantId}`

变更预约时间或资源时会重新校验占用，并重建该预约订单的资源占用记录。

**权限**: `booking:write`

### 13.7 取消预约

`POST /v1/booking/orders/{orderId}/cancel?merchantId={merchantId}`

**权限**: `booking:write`

### 13.8 确认预约

`POST /v1/booking/orders/{orderId}/confirm?merchantId={merchantId}`

**权限**: `booking:write`

### 13.9 开始服务

`POST /v1/booking/orders/{orderId}/start?merchantId={merchantId}`

**权限**: `booking:write`

### 13.10 完成服务

`POST /v1/booking/orders/{orderId}/complete?merchantId={merchantId}`

**权限**: `booking:write`

---

## 14. 支付（收银台）

> 权限模块：`payment`

### 14.1 创建收银台会话

`POST /v1/payment/cashier/create`

**权限**: `payment:write`

**请求体**:
```json
{
  "merchantId": 1,
  "outTradeNo": "YOUR_ORDER_NO_001",
  "subject": "商品购买",
  "body": "商品描述",
  "totalAmount": 10000,
  "expireMinutes": 30,
  "returnUrl": "https://your-app.com/return",
  "attach": "自定义附加数据"
}
```

**返回**:
```json
{
  "code": 0,
  "data": {
    "tradeNo": "123456789",
    "cashierUrl": "https://cashier.example.com/pay?token=xxx"
  }
}
```

说明：
- `totalAmount` 单位为分
- `outTradeNo` 为您系统中的订单号，需保证唯一
- 用户访问 `cashierUrl` 完成支付
- 支付结果通过事件回调通知

### 14.2 查询支付结果

`GET /v1/payment/query?tradeNo={tradeNo}`

**权限**: `payment:read`

**返回**:
```json
{
  "code": 0,
  "data": {
    "tradeNo": "123456789",
    "outTradeNo": "YOUR_ORDER_NO_001",
    "tradeStatus": "SUCCESS",
    "totalAmount": 10000,
    "payTime": "2026-04-16T10:30:00",
    "attach": "自定义附加数据"
  }
}
```

交易状态说明：
| 状态 | 说明 |
|------|------|
| WAIT_BUYER_PAY | 待支付 |
| SUCCESS | 支付成功 |
| REFUND | 已退款 |
| CLOSED | 已关闭 |

---

## 15. 提现

> 权限模块：`withdraw`

### 15.1 绑定提现账户

`POST /withdraw/account/bind`

**权限**: `withdraw:write`

**请求体**:
```json
{
  "externalUserId": "user_10001",
  "accountType": 1,
  "accountName": "张三",
  "cardNo": "6222021234567890",
  "bankName": "中国工商银行",
  "bankBranch": "北京朝阳支行"
}
```

### 15.2 解绑提现账户

`DELETE /withdraw/account/unbind?accountId={accountId}`

**权限**: `withdraw:write`

### 15.3 查询用户提现账户列表

`GET /withdraw/account/list?externalUserId={externalUserId}`

**权限**: `withdraw:read`

### 15.4 创建提现

`POST /withdraw/create`

**权限**: `withdraw:write`

### 15.5 查询提现状态

`GET /withdraw/get?merchantWithdrawNo={merchantWithdrawNo}`

**权限**: `withdraw:read`

---

## 16. B2B转账

> 权限模块：`transfer`

### 16.1 创建B2B转账

`POST /v1/transfer/b2b`

**权限**: `transfer:write`

**说明**: 开发者将分账资金转到 App 用户的账户

### 16.2 查询B2B转账状态

`GET /v1/transfer/b2b?merchantTransferNo={merchantTransferNo}`

**权限**: `transfer:read`

---

## 17. 固定收款码

> Base Path: `/open-api/fixed-qrcode`

### 17.1 创建固定收款码

`POST /open-api/fixed-qrcode/create`

**请求体**:
```json
{
  "merchantId": 1,
  "storeId": 1,
  "subject": "门店收款",
  "defaultAmount": 0
}
```

### 17.2 删除固定收款码

`DELETE /open-api/fixed-qrcode/delete?id={id}&merchantId={merchantId}`

### 17.3 查询固定收款码列表

`GET /open-api/fixed-qrcode/list?merchantId={merchantId}`

---

## 18. 数据统计

> 权限模块：`statistics`
> 
> Base Path: `/v1/statistics`

### 18.1 查询经营概览

`GET /v1/statistics/overview?merchantId={merchantId}`

**权限**: `statistics:read`

### 18.2 查询销售报表

`GET /v1/statistics/sales`

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| merchantId | Long | 是 | 商户ID |
| startDate | String | 否 | 开始日期 |
| endDate | String | 否 | 结束日期 |
| granularity | String | 否 | 粒度（day/week/month） |

**权限**: `statistics:read`

### 18.3 查询客户分析

`GET /v1/statistics/customers?merchantId={merchantId}`

**权限**: `statistics:read`

### 18.4 查询渠道分析

`GET /v1/statistics/channels?merchantId={merchantId}`

**权限**: `statistics:read`

### 18.5 查询预约分析

`GET /v1/statistics/bookings?merchantId={merchantId}`

**权限**: `statistics:read`

### 18.6 创建报表导出任务

`POST /v1/statistics/export`

**权限**: `statistics:read`

### 18.7 查询导出任务状态

`GET /v1/statistics/export/{taskId}?merchantId={merchantId}`

**权限**: `statistics:read`

---

## 19. 实名认证

> 权限模块：`real_name_auth`
> 
> Base Path: `/v1/real-name-auth`

### 19.1 提交身份证 OCR 识别

`POST /v1/real-name-auth/submit-id-card`

**权限**: `real_name_auth:write`

**请求体**:
```json
{
  "idCardFrontUrl": "https://oss.example.com/front.jpg",
  "idCardBackUrl": "https://oss.example.com/back.jpg"
}
```

### 19.2 获取人脸核身 SDK 参数

`GET /v1/real-name-auth/face-auth-params?idCardNumber={idCardNumber}`

**权限**: `real_name_auth:write`

### 19.3 查询人脸核身结果

`GET /v1/real-name-auth/face-auth-result?orderNo={orderNo}`

**权限**: `real_name_auth:read`

### 19.4 查询认证状态

`GET /v1/real-name-auth/status?idCardNumber={idCardNumber}`

**权限**: `real_name_auth:read`

---

## 20. 支付宝授权绑定

> 权限模块：`alipay_auth`
> 
> Base Path: `/alipay-auth`

### 20.1 获取支付宝授权配置

`GET /alipay-auth/config`

**权限**: `alipay_auth:read`

**返回**: 支付宝 AppId 等配置信息

### 20.2 通过授权码绑定支付宝账号

`POST /alipay-auth/bind`

**权限**: `alipay_auth:write`

**请求体**:
```json
{
  "externalUserId": "user_10001",
  "authCode": "支付宝授权码"
}
```

### 20.3 查询用户支付宝绑定状态

`GET /alipay-auth/binding?externalUserId={externalUserId}`

**权限**: `alipay_auth:read`

### 20.4 解绑支付宝账号

`POST /alipay-auth/unbind`

**权限**: `alipay_auth:write`

**请求体**:
```json
{
  "externalUserId": "user_10001"
}
```

---

## 21. 风控模型

> 权限模块：`risk`

### 21.1 获取可调用的风控模型产品列表

`GET /v1/risk-model-products`

**权限**: `risk:read`

### 21.2 执行风控模型产品

`POST /v1/risk-model-products/{productId}/execute`

**权限**: `risk:write`

**请求体**:
```json
{
  "merchantId": 1,
  "externalUserId": "user_10001",
  "creditAmount": 10000,
  "input": {},
  "timeout": 5000
}
```

---

## 22. 错误码

### 通用错误码

| HTTP 状态码 | 说明 |
|-------------|------|
| 401 | 认证失败（AppKey无效/签名错误/时间戳过期/Nonce重复） |
| 403 | 权限不足（应用已禁用/IP不在白名单） |
| 429 | 请求频率超限 |

### 业务错误码

| code | 说明 |
|------|------|
| 0 | 成功 |
| 非0 | 失败，具体错误信息见 msg 字段 |

常见业务错误：
- 用户不存在
- 商户合作关系不存在
- 资源不存在
- 余额不足
- 订单状态不允许当前操作

---

## 23. 计费预定

> 权限模块：`billing`
> 
> Base Path: `/v1/billing`

### 价格配置

#### 22.1 保存资源价格配置

`POST /v1/billing/price/save`

**权限**: `billing:write`

**请求体**:
```json
{
  "merchantId": 1,
  "resourceId": 1,
  "billingMethod": 2,
  "basePrice": 1500,
  "memberPrice": 1200,
  "minDuration": 120,
  "maxDuration": 480,
  "freeDuration": 3,
  "billingUnit": 60,
  "stepBillingStart": 120,
  "stepBillingUnit": 30,
  "unlockDeadline": 30,
  "bufferMinutes": 30,
  "cancelFreeMinutes": 60,
  "cancelFeeRate": 10
}
```

说明：
- `billingMethod`: 1=按次 2=按时长 3=按时段 4=阶梯
- `basePrice`: 基础价格（分/小时或分/次）
- `freeDuration`: 免费时长（分钟），如前3分钟免费
- `billingUnit`: 计费单位（分钟），60=按小时，30=按半小时
- `stepBillingStart`: 阶梯计费起始时长，超过后按 stepBillingUnit 计费
- `unlockDeadline`: 开锁截止时间（分钟），超过未开锁按下单时间计费
- `bufferMinutes`: 预约间隔缓冲时间（打扫预留）
- `cancelFreeMinutes`: 免费取消时限（分钟）
- `cancelFeeRate`: 取消手续费比例（%）

#### 22.2 查询资源价格配置

`GET /v1/billing/price/get?resourceId={resourceId}&merchantId={merchantId}`

**权限**: `billing:read`

### 套餐管理

#### 22.3 创建套餐

`POST /v1/billing/package/create`

**权限**: `billing:write`

**请求体**:
```json
{
  "merchantId": 1,
  "packageName": "通宵场",
  "packageDesc": "22:00-08:00 含茶水",
  "duration": 600,
  "price": 12800,
  "memberPrice": 9800,
  "applicableStartTime": "22:00",
  "applicableEndTime": "08:00",
  "includes": "含茶水、含小食"
}
```

#### 22.4 更新套餐

`POST /v1/billing/package/update`

**权限**: `billing:write`

#### 22.5 查询商户套餐列表

`GET /v1/billing/package/list?merchantId={merchantId}`

**权限**: `billing:read`

### 计费订单

#### 22.6 创建预付模式订单

`POST /v1/billing/order/create-prepaid`

**权限**: `billing:write`

**请求体**:
```json
{
  "merchantId": 1,
  "resourceId": 1,
  "externalUserId": "user_10001",
  "startTime": "2026-04-21T15:00:00",
  "durationMinutes": 480
}
```

**返回**:
```json
{
  "code": 0,
  "data": {
    "id": 1,
    "orderNo": "BO123456789",
    "status": 0,
    "prepaidAmount": 12000,
    "bookingStartTime": "2026-04-21T15:00:00",
    "bookingEndTime": "2026-04-21T23:00:00",
    "cashierUrl": "https://cashier.xuancore.com/pay?token=xxx"
  }
}
```

说明：
- 创建订单后自动生成支付订单和收银台
- `cashierUrl` 为收银台地址，前端直接跳转
- 收银台支持**会员余额支付**（余额不足时可用余额抵扣部分，剩余用微信/支付宝补差额）
- 支付成功后订单状态自动变为 10（已支付待使用）

#### 22.7 创建套餐模式订单

`POST /v1/billing/order/create-package`

**权限**: `billing:write`

**请求体**:
```json
{
  "merchantId": 1,
  "resourceId": 1,
  "externalUserId": "user_10001",
  "startTime": "2026-04-21T22:00:00",
  "packageId": 1
}
```

#### 22.8 查询订单详情

`GET /v1/billing/order/get?orderId={orderId}`

**权限**: `billing:read`

#### 22.9 分页查询订单

`POST /v1/billing/order/page`

**权限**: `billing:read`

**请求体**:
```json
{
  "pageNo": 1,
  "pageSize": 10,
  "merchantId": 1,
  "resourceId": null,
  "status": null,
  "billingMode": null
}
```

订单状态说明：
| status | 说明 |
|--------|------|
| 0 | 待支付 |
| 10 | 已支付待使用 |
| 20 | 使用中 |
| 30 | 待结算 |
| 40 | 已结算 |
| 50 | 已退款 |
| 60 | 已取消 |

### 计时控制

#### 22.10 开始使用（开锁）

`POST /v1/billing/order/{orderId}/start-usage`

**权限**: `billing:write`

说明：由 IoT 设备开锁事件自动触发，或手动调用。订单状态从"已支付待使用"变为"使用中"。

#### 22.11 结束使用（退房）

`POST /v1/billing/order/{orderId}/end-usage`

**权限**: `billing:write`

说明：用户退房时调用。自动计算实际使用时长、结算费用、计算退款金额。房间状态变为"待打扫"。

#### 22.12 续费

`POST /v1/billing/order/{orderId}/renew?additionalMinutes={minutes}`

**权限**: `billing:write`

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| orderId | Long | 是 | 订单ID（路径参数） |
| additionalMinutes | Integer | 是 | 续费时长（分钟），最低60 |

#### 22.13 取消订单

`POST /v1/billing/order/{orderId}/cancel?reason={reason}`

**权限**: `billing:write`

说明：待支付和已支付待使用状态可取消。超过免费取消时限会收取手续费。

### 房间状态

#### 22.14 确认打扫完毕

`POST /v1/billing/resource/{resourceId}/confirm-cleaning`

**权限**: `billing:write`

#### 22.15 查询资源时间轴

`GET /v1/billing/resource/{resourceId}/timeline?date={yyyy-MM-dd}`

**权限**: `billing:read`

**返回**: 24小时时间轴，每小时一个格子
```json
{
  "code": 0,
  "data": [
    {"startTime": "2026-04-21T00:00", "endTime": "2026-04-21T01:00", "status": "available", "price": 1500},
    {"startTime": "2026-04-21T01:00", "endTime": "2026-04-21T02:00", "status": "occupied", "price": 1500}
  ]
}
```

### 打扫管理

#### 22.16 查询待打扫列表

`GET /v1/billing/cleaning/pending-list?merchantId={merchantId}`

**权限**: `billing:read`

#### 22.17 开始打扫

`POST /v1/billing/cleaning/{recordId}/start?cleanerId={cleanerId}&cleanerName={cleanerName}`

**权限**: `billing:write`

#### 22.18 完成打扫（含拍照）

`POST /v1/billing/cleaning/{recordId}/complete?photos={photosJson}&remark={remark}`

**权限**: `billing:write`

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| photos | String | 是 | 打扫完成照片URL（JSON数组） |
| remark | String | 否 | 备注 |

### IoT 设备

#### 22.19 接收设备事件回调

`POST /v1/billing/device/event`

**权限**: `billing:write`

**请求体**:
```json
{
  "deviceNo": "LOCK_001",
  "eventType": "UNLOCK",
  "timestamp": 1713686400,
  "extra": null
}
```

事件类型：
| eventType | 说明 |
|-----------|------|
| UNLOCK | 开锁（自动触发开始计时） |
| LOCK | 关锁 |
| HEARTBEAT | 心跳 |
| FAULT | 故障 |

### 用户订单

#### 22.20 查询用户的预定订单列表

`GET /v1/billing/order/my-orders`

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| externalUserId | String | 是 | App端用户标识 |
| status | Integer | 否 | 订单状态筛选 |
| pageNo | Integer | 否 | 页码 |
| pageSize | Integer | 否 | 每页条数 |

**权限**: `billing:read`

#### 22.21 续费并创建支付订单

`POST /v1/billing/order/{orderId}/renew-with-pay?additionalMinutes={minutes}`

**权限**: `billing:write`

说明：续费最低1小时（60分钟）。会自动创建续费支付订单，用户需完成支付。

### 商户管理

#### 22.22 强制结束订单

`POST /v1/billing/order/{orderId}/force-end`

**权限**: `billing:write`

说明：商户可强制结束使用中或待使用的订单，自动结算并将房间状态改为待打扫。

#### 22.23 今日营收看板

`GET /v1/billing/dashboard?merchantId={merchantId}`

**权限**: `billing:read`

**返回**:
```json
{
  "todayBillingOrders": 15,
  "todayBillingRevenue": 225000,
  "todayBillingPrepaid": 360000,
  "totalRooms": 8,
  "freeRooms": 5,
  "usingRooms": 2,
  "cleaningRooms": 1
}
```

### 设备控制

#### 22.24 远程开锁

`POST /v1/billing/resource/{resourceId}/unlock`

**权限**: `billing:write`

#### 22.25 远程关锁

`POST /v1/billing/resource/{resourceId}/lock`

**权限**: `billing:write`

#### 22.26 批量开锁

`POST /v1/billing/resource/batch-unlock`

**权限**: `billing:write`

**请求体**: `[1, 2, 3]`（资源ID数组）

#### 22.27 批量关锁（一键关所有）

`POST /v1/billing/resource/batch-lock`

**权限**: `billing:write`

**请求体**: `[1, 2, 3]`（资源ID数组）

---

## 计费预定功能对接指南

> 本节说明 App 开发者如何完整对接棋牌室/台球室等计时计费预定功能。

### 完整业务流程

```
用户选房间 → 查看时间轴 → 选时段下单 → 跳转收银台支付 → 开锁开始使用 → 退房结算
```

### 第一步：展示房间列表

```
GET /v1/resources?merchantId=23
```

返回的每个房间包含：
- `roomStatus`: 0=空闲 1=已预约 2=使用中 3=待打扫
- `unitPrice`: 单价（分/小时）
- `currentBookingEndTime`: 当前使用者预计结束时间（使用中时显示）

### 第二步：查看房间时间轴

```
GET /v1/billing/resource/{resourceId}/timeline?date=2026-04-22
```

返回当天 24 小时的占用情况，以及已预约的时段列表（`bookedSlots`），前端据此渲染可选时段。

### 第三步：下单

**预付模式（按时计费）：**

```
POST /v1/billing/order/create-prepaid
{
  "merchantId": 23,
  "resourceId": 19,
  "externalUserId": "用户的openid或唯一标识",
  "startTime": "2026-04-22T14:00:00",
  "durationMinutes": 180
}
```

**套餐模式：**

先查可用套餐列表：
```
GET /v1/billing/package/list?merchantId=23
```

返回的每个套餐包含：
- `duration`: 套餐时长（分钟）
- `price`: 套餐价格（分）
- `applicableStartTime`/`applicableEndTime`: 适用时段（如 "22:00"/"08:00" 表示通宵场）
- `applicableDays`: 适用星期（JSON数组，如 [6,7] 表示仅周末）

下单：
```
POST /v1/billing/order/create-package
{
  "merchantId": 23,
  "resourceId": 19,
  "externalUserId": "用户的openid或唯一标识",
  "startTime": "2026-04-22T22:00:00",
  "packageId": 1
}
```

注意：
- 开始时间和结束时间必须在套餐的适用时段内，否则返回错误
- 如果套餐设了适用星期，非适用日下单会返回错误
- 前端应根据套餐的 `applicableStartTime`/`applicableEndTime`/`applicableDays` 过滤不可用的套餐

**返回值中的关键字段：**
```json
{
  "id": 1,
  "orderNo": "BO123456",
  "prepaidAmount": 4500,
  "cashierUrl": "https://cashier.xuancore.com/pay?token=xxx"
}
```

### 第四步：跳转收银台支付

拿到 `cashierUrl` 后直接跳转（小程序用 `wx.navigateTo` 或 `webview`）。

收银台支持：
- **会员余额支付** — 用户在该商户充值的余额，余额足够直接扣
- **混合支付** — 余额不足时，余额抵扣部分 + 微信/支付宝补差额
- **微信/支付宝** — 全额支付

支付成功后订单状态自动变为 `10`（已支付待使用），无需前端额外处理。

### 第五步：开始使用

用户到场开锁后，IoT 设备回调自动触发开始计时：

```
POST /v1/billing/device/event
{
  "deviceNo": "LOCK_001",
  "eventType": "UNLOCK",
  "timestamp": 1713686400
}
```

如果没有 IoT 设备，商户可手动触发：

```
POST /app-api/merchant/my-billing/order/{orderId}/start-usage
```

### 第六步：退房结算

用户在小程序点退房：

```
POST /v1/billing/order/{orderId}/end-usage
```

系统自动：
1. 计算实际使用时长
2. 按计费规则算出实际消费金额
3. 计算退款/补缴金额

**预付模式结算规则：**
- 实际时长 < 预付时长：退差价（预付金额 - 实际消费）
- 实际时长 = 预付时长：不退不补
- 实际时长 > 预付时长：产生欠费（退款金额为负数）

**套餐模式结算规则：**
- 实际时长 ≤ 套餐时长：按套餐价结算，不退差价（提前走不退钱）
- 实际时长 > 套餐时长：套餐价 + 超出部分按该资源的按时计费单价补差价

例如：用户买了2小时套餐50元，实际用了3小时，资源单价15元/小时，则结算金额 = 50 + 15 = 65元

### 查询订单状态

```
GET /v1/billing/order/get?orderId={orderId}
```

订单状态说明：
| status | 说明 |
|--------|------|
| 0 | 待支付 |
| 10 | 已支付待使用（等待开锁） |
| 20 | 使用中 |
| 30 | 待结算 |
| 40 | 已结算 |
| 50 | 已退款 |
| 60 | 已取消 |

### 续费

订单结束前5分钟内可续费：

```
POST /v1/billing/order/{orderId}/renew-with-pay?additionalMinutes=60
```

返回新的 `cashierUrl`，用户跳转支付续费金额。

### 注意事项

1. `externalUserId` 必须是该 App 下已注册的用户标识，用户需先完成客户进件（`POST /v1/customers/intake`）
2. 下单前建议先查时间轴确认时段未被占用，避免冲突
3. 下单后有 15 分钟支付窗口，超时未支付订单自动取消，房间释放
4. 收银台有效期默认 30 分钟，超时需重新下单
5. 退款金额可能为负数（超时使用产生欠费），需提示用户补缴
6. 套餐提前结束不退差价
7. 套餐超时部分按资源的按时计费单价补差价

---

## 附录：接口总览

| 模块 | 接口数量 | 权限模块 |
|------|----------|----------|
| 商户数据 | 13 | merchant |
| 商品数据 | 15 | product |
| 订单数据 | 15 | order |
| 会员卡数据 | 14 | member_card |
| 优惠券 | 21 | coupon |
| 抵金券 | 9 | cash_voucher |
| 客户管理 | 9 | customer |
| 可预订资源 | 11 | resource |
| 预约数据 | 10 | booking |
| 支付（收银台） | 2 | payment |
| 提现 | 5 | withdraw |
| B2B转账 | 2 | transfer |
| 固定收款码 | 3 | — |
| 数据统计 | 7 | statistics |
| 实名认证 | 4 | real_name_auth |
| 支付宝授权 | 4 | alipay_auth |
| 风控模型 | 2 | risk |
| 计费预定 | 27 | billing |
| 评论系统 | 11 | comment |
| **合计** | **~184** | |

---

## 24. 评论系统

> 权限模块：`comment`
>
> Base Path: `/v1/comment`

用户可以对商户/门店进行评价，支持评分、图片、标签、追评、点赞、举报。商户可在商户端查看和回复评价。每条评价自动记录来源 App（`sourceAppId`），商户可区分不同 App 的用户评价。

### 24.1 提交评价

`POST /v1/comment/create`

**请求参数（JSON Body）：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| merchantId | Long | 是 | 商户ID |
| storeId | Long | 否 | 门店ID |
| orderId | Long | 否 | 关联订单ID |
| orderNo | String | 否 | 订单号 |
| externalUserId | String | 否 | 用户标识 |
| userNickname | String | 否 | 用户昵称（匿名时不显示） |
| userAvatar | String | 否 | 用户头像URL |
| isAnonymous | Boolean | 否 | 是否匿名，默认 false |
| content | String | 是 | 评论内容（1-500字） |
| rating | Integer | 是 | 总体评分 1-5 星 |
| serviceRating | Integer | 否 | 服务评分 1-5 星 |
| environmentRating | Integer | 否 | 环境评分 1-5 星 |
| priceRating | Integer | 否 | 价格评分 1-5 星 |
| images | String[] | 否 | 图片URL数组，最多9张 |
| tags | String[] | 否 | 标签数组，如 ["服务好","环境好"] |
| userCity | String | 否 | 用户所在城市（前端定位获取，如"杭州"） |
| userPhone | String | 否 | 用户手机号（后端自动脱敏为 138****5678 格式） |

**请求示例：**

```json
POST /v1/comment/create
{
    "merchantId": 23,
    "storeId": 17,
    "orderId": 1001,
    "externalUserId": "5",
    "userNickname": "小明",
    "userCity": "杭州",
    "userPhone": "13812345678",
    "content": "环境很好，服务态度也不错，下次还来",
    "rating": 5,
    "serviceRating": 5,
    "environmentRating": 4,
    "priceRating": 4,
    "images": ["https://xxx.com/1.jpg", "https://xxx.com/2.jpg"],
    "tags": ["服务好", "环境好"]
}
```

**响应示例：**

```json
{
    "code": 0,
    "data": 1
}
```

> 同一订单只能评价一次。`sourceAppId` 由系统自动设置，无需传入。

---

### 24.2 删除评价

`POST /v1/comment/delete`

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| commentId | Long | 是 | 评论ID |
| externalUserId | String | 是 | 用户标识（只能删自己的） |

---

### 24.3 追评

`POST /v1/comment/append`

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| commentId | Long | 是 | 评论ID |
| externalUserId | String | 是 | 用户标识（只能追评自己的） |
| content | String | 是 | 追评内容 |
| images | String | 否 | 图片URL（JSON数组字符串） |

---

### 24.4 评论详情

`GET /v1/comment/get`

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| commentId | Long | 是 | 评论ID |
| externalUserId | String | 否 | 当前用户标识（传入则返回点赞状态） |

**响应示例：**

```json
{
    "code": 0,
    "data": {
        "id": 1,
        "merchantId": 23,
        "storeId": 17,
        "orderId": 1001,
        "externalUserId": "5",
        "userNickname": "小明",
        "userNickname": "小明",
        "userCity": "杭州",
        "content": "环境很好，服务态度也不错",
        "environmentRating": 4,
        "priceRating": 4,
        "images": "[\"https://xxx.com/1.jpg\"]",
        "tags": "[\"服务好\",\"环境好\"]",
        "status": 1,
        "likeCount": 3,
        "replyCount": 1,
        "sourceAppId": 3,
        "liked": false,
        "createTime": "2026-04-23T10:00:00",
        "replies": [
            {
                "id": 1,
                "commentId": 1,
                "replyType": 1,
                "content": "感谢您的好评，欢迎下次光临！",
                "createTime": "2026-04-23T11:00:00"
            }
        ]
    }
}
```

> `replyType`: 1=商家回复，2=用户追评

---

### 24.5 评论列表

`GET /v1/comment/page`

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| merchantId | Long | 否 | 商户ID（merchantId 和 storeId 至少传一个） |
| storeId | Long | 否 | 门店ID |
| rating | Integer | 否 | 按评分筛选（1-5） |
| pageNo | Integer | 否 | 页码，默认 1 |
| pageSize | Integer | 否 | 每页条数，默认 10 |

> 返回已发布的评论，按时间倒序。每条评论包含回复列表。

---

### 24.6 我的评论

`GET /v1/comment/my-page`

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| externalUserId | String | 是 | 用户标识 |
| pageNo | Integer | 否 | 页码，默认 1 |
| pageSize | Integer | 否 | 每页条数，默认 10 |

---

### 24.7 点赞/取消点赞

`POST /v1/comment/like`

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| commentId | Long | 是 | 评论ID |
| externalUserId | String | 是 | 用户标识 |

> 切换逻辑：已点赞则取消，未点赞则点赞。

---

### 24.8 举报评论

`POST /v1/comment/report`

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| commentId | Long | 是 | 评论ID |
| externalUserId | String | 是 | 举报人标识 |
| reportType | Integer | 是 | 举报类型：1广告 2辱骂 3虚假 4违法 5其他 |
| reportReason | String | 是 | 举报原因 |

---

### 24.9 评论统计

`GET /v1/comment/stats`

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| merchantId | Long | 是 | 商户ID |

**响应示例：**

```json
{
    "code": 0,
    "data": {
        "totalCount": 128,
        "avgRating": 4.52,
        "goodRate": 89.06,
        "rating5Count": 85,
        "rating4Count": 29,
        "rating3Count": 10,
        "rating2Count": 3,
        "rating1Count": 1,
        "withImageCount": 45,
        "merchantReplyCount": 67
    }
}
```

---

### 24.10 评论标签列表

`GET /v1/comment/tags`

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| merchantId | Long | 是 | 商户ID |

**响应示例：**

```json
{
    "code": 0,
    "data": [
        {"id": 1, "tagName": "服务好", "tagType": 1},
        {"id": 2, "tagName": "环境好", "tagType": 1},
        {"id": 7, "tagName": "服务差", "tagType": 2}
    ]
}
```

> `tagType`: 1=正面标签，2=负面标签。前端可根据类型用不同颜色展示。

---

### 24.11 批量查询评论回复

`POST /v1/comment/batch-replies`

**请求参数（JSON Body）：** 评论ID数组

```json
[1, 2, 3, 5, 8]
```

**响应示例：**

```json
{
    "code": 0,
    "data": {
        "1": [
            {"id": 1, "commentId": 1, "replyType": 1, "content": "感谢好评", "createTime": "2026-04-23T11:00:00"}
        ],
        "2": [],
        "5": [
            {"id": 3, "commentId": 5, "replyType": 1, "content": "已改进", "createTime": "2026-04-23T12:00:00"}
        ]
    }
}
```

> 返回 Map 结构，key 为评论ID，value 为该评论的回复列表。没有回复的返回空数组。

---

## 25. IoT设备控制

> 前缀：`/v1/iot`
>
> 本模块用于第三方客户系统接入商起点 IoT 能力，覆盖设备注册/绑定、设备状态、设备命令、设备事件、资源动作模板与动作执行。所有接口必须使用 OpenAPI 签名，并申请 `iot:READ` 或 `iot:WRITE` 权限。

### 25.1 接口列表

| 方法 | 路径 | 权限 | 说明 |
|------|------|------|------|
| POST | `/v1/iot/devices/bind` | `iot:WRITE` | 绑定或注册 IoT 设备 |
| POST | `/v1/iot/devices/unbind-resource` | `iot:WRITE` | 解绑资源设备 |
| POST | `/v1/iot/devices/list` | `iot:READ` | 查询设备列表 |
| GET | `/v1/iot/devices/get-by-device-no` | `iot:READ` | 查询设备详情 |
| GET | `/v1/iot/devices/shadow` | `iot:READ` | 查询设备影子 |
| POST | `/v1/iot/devices/command?merchantId={merchantId}` | `iot:WRITE` | 下发设备命令 |
| POST | `/v1/iot/devices/events` | `iot:WRITE` | 上报设备事件 |
| POST | `/v1/iot/actions/templates/save` | `iot:WRITE` | 保存资源动作模板 |
| GET | `/v1/iot/actions/templates` | `iot:READ` | 查询资源动作模板 |
| POST | `/v1/iot/actions/execute` | `iot:WRITE` | 执行资源动作 |
| GET | `/v1/iot/actions/get` | `iot:READ` | 查询动作执行结果 |

### 25.2 设备绑定

`POST /v1/iot/devices/bind`

```json
{
  "merchantId": 10001,
  "storeId": 20001,
  "resourceId": 30001,
  "deviceRole": "MAIN_LOCK",
  "deviceNo": "LOCK-A01-001",
  "deviceSecret": "secret",
  "deviceType": "SMART_LOCK",
  "deviceName": "A01 主门锁",
  "deviceBrand": "LOCKER",
  "deviceModel": "L100",
  "capabilities": "UNLOCK,LOCK,STATUS_QUERY"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| merchantId | Long | 是 | 商户 ID，必须是当前开放应用已合作商户 |
| storeId | Long | 否 | 门店 ID |
| resourceId | Long | 否 | 房间、台位、洗车位、包厢等资源 ID |
| deviceRole | String | 否 | 设备角色，如 `MAIN_LOCK`、`POWER`、`TABLE_LIGHT`、`WASHER` |
| deviceNo | String | 是 | 平台唯一设备编号 |
| deviceSecret | String | 是 | 设备密钥，用于设备接入认证 |
| deviceType | String | 是 | 设备类型 |
| capabilities | String | 否 | 支持命令，逗号分隔 |

### 25.3 查询设备状态

`POST /v1/iot/devices/list`

```json
{
  "merchantId": 10001,
  "storeId": 20001,
  "resourceId": 30001,
  "deviceType": "SMART_LOCK",
  "status": 0,
  "onlineStatus": 1
}
```

`GET /v1/iot/devices/shadow?merchantId=10001&deviceNo=LOCK-A01-001`

设备状态：`status=0` 正常，`1` 禁用，`2` 故障。在线状态：`onlineStatus=0` 离线，`1` 在线。影子 `reportedState` 表示设备上报状态，`desiredState` 表示平台期望状态。

### 25.4 下发设备命令

`POST /v1/iot/devices/command?merchantId=10001`

```json
{
  "deviceNo": "LOCK-A01-001",
  "commandType": "UNLOCK",
  "requestNo": "OPENAPP-30001-OPEN-001",
  "resourceId": 30001,
  "orderId": 40001,
  "payload": "{\"expireSeconds\":30}",
  "timeoutSeconds": 30
}
```

支持命令：`UNLOCK`、`LOCK`、`POWER_ON`、`POWER_OFF`、`SET_DURATION`、`PAUSE`、`RESUME`、`STATUS_QUERY`。

### 25.5 上报设备事件

`POST /v1/iot/devices/events`

```json
{
  "eventNo": "EVT-LOCK-A01-001-0001",
  "deviceNo": "LOCK-A01-001",
  "merchantId": 10001,
  "storeId": 20001,
  "resourceId": 30001,
  "orderId": 40001,
  "eventType": "UNLOCKED",
  "commandNo": "CMD202604290001",
  "payload": "{\"lockState\":\"UNLOCKED\"}",
  "eventTime": "2026-04-29 18:30:00"
}
```

事件类型：`ONLINE`、`OFFLINE`、`HEARTBEAT`、`UNLOCKED`、`LOCKED`、`POWERED_ON`、`POWERED_OFF`、`STATUS_REPORT`、`FAULT`、`COMMAND_ACK`、`COMMAND_SUCCESS`、`COMMAND_FAILED`。

### 25.6 动作模板与动作执行

建议客户系统优先使用“资源动作”而不是逐个下发设备命令。资源动作会根据模板统一完成多设备、多步骤、超时和回执汇总。

`POST /v1/iot/actions/templates/save`

```json
{
  "merchantId": 10001,
  "storeId": 20001,
  "resourceType": "CHESS_ROOM",
  "actionType": "START_USAGE",
  "templateName": "棋牌室开始使用",
  "commandPlan": "[{\"stepNo\":1,\"stepName\":\"打开主门锁\",\"deviceRole\":\"MAIN_LOCK\",\"commandType\":\"UNLOCK\",\"required\":true},{\"stepNo\":2,\"stepName\":\"开启电源\",\"deviceRole\":\"POWER\",\"commandType\":\"POWER_ON\",\"required\":true}]",
  "status": 0,
  "remark": "默认开场动作"
}
```

`POST /v1/iot/actions/execute`

```json
{
  "merchantId": 10001,
  "storeId": 20001,
  "resourceType": "CHESS_ROOM",
  "resourceId": 30001,
  "orderId": 40001,
  "actionType": "START_USAGE",
  "requestNo": "BILLING-ORDER-40001-START",
  "context": "{\"source\":\"open-api\"}",
  "timeoutSeconds": 30
}
```

动作类型：`START_USAGE`、`END_USAGE`、`PAUSE_USAGE`、`RESUME_USAGE`、`RENEW_USAGE`、`FORCE_STOP`、`CLEANING_OPEN`、`MANUAL_OPEN`。

动作状态：`0` 已创建，`10` 执行中，`20` 成功，`30` 部分失败，`40` 失败，`50` 超时，`60` 人工确认。
