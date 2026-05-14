# 易享生活无人棋牌室 - 小程序端API接口文档

> 更新时间：2026-05-14  
> Base URL：`https://www.quexitai.com/api`  
> 所有接口统一返回格式：`{ success: boolean, message?: string, data?: object }`

---

## 目录

1. [用户认证](#一用户认证)
2. [短信验证码](#二短信验证码)
3. [门店与商户](#三门店与商户)
4. [房间/资源管理](#四房间资源管理)
5. [预约开关](#五预约开关)
6. [预约管理](#六预约管理)
7. [计费预定](#七计费预定)
8. [商户会员充值](#八商户会员充值)
9. [支付（商起点收银台）](#九支付商起点收银台)
10. [钱包与积分](#十钱包与积分)
11. [银行卡](#十一银行卡)
12. [支付密码](#十二支付密码)
13. [文件上传](#十三文件上传)
14. [充值支付（微信/支付宝）](#十四充值支付微信支付宝)
15. [IoT设备控制](#十五iot设备控制)

---

## 一、用户认证

### 1.1 微信小程序登录

```
POST /api/auth/wechat/login
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| code | String | 是 | wx.login() 获取的 code |

**返回：**
```json
{
  "success": true,
  "openid": "oXXXX",
  "sessionKey": "xxx",
  "user": {
    "id": 1,
    "openid": "oXXXX",
    "nickname": "微信用户",
    "avatar": "https://...",
    "phone": "138xxxx1234",
    "status": "ACTIVE",
    "isLogin": true
  }
}
```

### 1.2 手机号验证码登录/注册

```
POST /api/auth/phone/login
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| phone | String | 是 | 手机号 |
| code | String | 是 | 短信验证码 |
| openid | String | 否 | 微信openid，用于关联 |

### 1.3 微信手机号授权

```
POST /api/auth/wechat/phone
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| code | String | 是 | wx.getPhoneNumber 获取的 code |

**返回：** `{ success, phoneNumber, purePhoneNumber, countryCode }`

### 1.4 绑定手机号

```
POST /api/auth/phone/bind
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| userId | Long | 是 | 用户ID |
| phone | String | 是 | 手机号 |
| code | String | 是 | 短信验证码 |

### 1.5 获取用户信息

```
GET /api/auth/user/info?openid={openid}
```

### 1.6 更新用户信息

```
POST /api/auth/user/update
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| openid | String | 是 | 用户openid |
| nickname | String | 否 | 昵称 |
| avatar | String | 否 | 头像URL |
| gender | Integer | 否 | 性别 |
| phone | String | 否 | 手机号 |

### 1.7 根据手机号查询用户

```
GET /api/auth/user/info/phone?phone={phone}
```

---

## 二、短信验证码

### 2.1 发送验证码

```
POST /api/sms/send-code
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| phone | String | 是 | 手机号 |
| type | String | 否 | 类型：LOGIN/REGISTER/BIND_CARD/GENERAL，默认GENERAL |

> 60秒内只能发送一次，验证码5分钟有效

### 2.2 验证验证码

```
POST /api/sms/verify-code
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| phone | String | 是 | 手机号 |
| code | String | 是 | 验证码 |
| type | String | 否 | 类型，需与发送时一致 |

---

## 三、门店与商户

### 3.1 获取门店列表

```
GET /api/stores?merchantId={merchantId}&pageNo=1&pageSize=20
```

### 3.2 获取门店详情

```
GET /api/stores/{storeId}
```

### 3.3 查询附近门店

```
GET /api/stores/nearby?longitude={lng}&latitude={lat}&radiusKm=5&limit=10
```

### 3.4 获取门店营业时间

```
GET /api/stores/{storeId}/business-hours
```

### 3.5 获取门店预约模式

```
GET /api/stores/{storeId}/booking-mode
```

**返回：**
```json
{
  "success": true,
  "data": {
    "storeId": 456,
    "bookingConfig": { "status": 0 },
    "displayConfig": { "showBooking": true }
  }
}
```

### 3.6 查询商户列表

```
GET /api/stores/merchants?pageNo=1&pageSize=20
```

### 3.7 查询商户详情

```
GET /api/stores/merchants/{merchantId}
```

---

## 四、房间/资源管理

### 4.1 获取房间列表

```
GET /api/rooms?merchantId={merchantId}&storeId={storeId}&pageNo=1&pageSize=20
```

> 返回的每个资源对象中包含 `isAcceptBooking` 字段，表示该资源是否接受预约

### 4.2 获取房间详情

```
GET /api/rooms/{resourceId}?merchantId={merchantId}
```

### 4.3 查询房间可用性

```
GET /api/rooms/{resourceId}/availability?merchantId={merchantId}&date=2026-05-14
```

### 4.4 更新房间状态

```
PUT /api/rooms/{resourceId}/status?merchantId={merchantId}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| status | Integer | 是 | 0-空闲 1-预订中 2-占用中 3-维护中 4-停用 5-休息中 |
| changeReason | String | 否 | 变更原因 |

### 4.5 设置房间排班

```
PUT /api/rooms/{resourceId}/schedule?merchantId={merchantId}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| scheduleType | Integer | 否 | 1=固定排班 2=灵活排班，自动推断 |
| dayOfWeek | Integer | 条件 | 星期几(1-7)，固定排班必填 |
| scheduleDate | String | 条件 | 排班日期(yyyy-MM-dd)，灵活排班必填 |
| timeSlots | Array/String | 是 | 时间段，如 `[{"start":"09:00","end":"22:00"}]` |
| isRestDay | Integer | 否 | 0=营业日 1=休息日，默认0 |

### 4.6 批量设置排班

```
POST /api/rooms/schedules/batch
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| merchantId | Long | 是 | 商户ID |
| resourceIds | Long[] | 是 | 资源ID数组 |
| （其余同4.5） | | | |

### 4.7 资源统计

```
GET /api/rooms/statistics?merchantId={merchantId}
```

---

## 五、预约开关

> ⚠️ 预约开关分两层，互不干扰

| 层级 | 作用 | 关闭效果 |
|------|------|----------|
| 门店总开关 | 控制整个门店 | 该门店下所有资源都不可预约 |
| 资源单独开关 | 控制单个房间 | 仅该资源不可预约 |

### 5.1 获取门店预约配置

```
GET /api/rooms/booking-config?merchantId={merchantId}&storeId={storeId}
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| merchantId | Long | 否 | 商户ID |
| storeId | Long | 是 | 门店ID |

**返回示例：**
```json
{
  "success": true,
  "data": {
    "status": 0,
    "storeId": 456,
    "autoConfirm": 1,
    "requirePayment": 0,
    "maxAdvanceBookingDays": 30,
    "minAdvanceBookingMinutes": 30,
    "cancelFreeHours": 24
  }
}
```

> status: `0`=正常（预约开启），`1`=禁用（预约关闭）

### 5.2 修改单个资源预约开关

```
PUT /api/rooms/{resourceId}/booking-switch?merchantId={merchantId}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| isAcceptBooking | Integer | 是 | 1=接受预约，0=不接受 |

### 5.3 批量修改资源预约开关

```
POST /api/rooms/booking-switch/batch
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| merchantId | Long | 是 | 商户ID |
| resourceIds | Long[] | 是 | 资源ID数组 |
| isAcceptBooking | Integer | 是 | 1=接受预约，0=不接受 |

> ⚠️ **注意 status 和 isAcceptBooking 值含义相反：**  
> 门店总开关 status：0=开启，1=关闭  
> 资源开关 isAcceptBooking：1=接受，0=不接受

---

## 六、预约管理

### 6.1 查询可用预约时间段

```
GET /api/rooms/booking/available-slots?merchantId={merchantId}&storeId={storeId}&resourceId={resourceId}&bookingDate=2026-05-14&durationMinutes=60
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| merchantId | Long | 是 | 商户ID |
| storeId | Long | 否 | 门店ID |
| resourceId | Long | 否 | 资源ID |
| bookingDate / date | String | 是 | 预约日期 |
| durationMinutes | Integer | 否 | 预约时长（分钟） |
| slotStepMinutes | Integer | 否 | 时间段步长（分钟） |

### 6.2 创建预约

```
POST /api/rooms/booking
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| merchantId | Long | 是 | 商户ID |
| resourceId / roomId | Long | 是 | 资源ID |
| storeId | Long | 否 | 门店ID |
| bookingStartTime / startTime | String | 是 | 开始时间 (yyyy-MM-dd HH:mm) |
| bookingEndTime / endTime | String | 否 | 结束时间 |
| durationMinutes | Integer | 否 | 预约时长（分钟），与endTime二选一 |

> 后端会自动校验门店总开关和资源开关，不可预约时返回明确错误提示

### 6.3 查询预约列表

```
GET /api/rooms/booking/list?merchantId={merchantId}&pageNo=1&pageSize=20
```

### 6.4 查询预约详情

```
GET /api/rooms/booking/{orderId}?merchantId={merchantId}
```

### 6.5 取消预约

```
POST /api/rooms/booking/{orderId}/cancel?merchantId={merchantId}&externalUserId={userId}
```

> 频繁取消会触发限制，返回 `code: "CANCEL_LIMITED"`

### 6.6 开始服务（开台）

```
POST /api/rooms/booking/{orderId}/start?merchantId={merchantId}
```

### 6.7 完成服务（结台）

```
POST /api/rooms/booking/{orderId}/complete?merchantId={merchantId}
```

---

## 七、计费预定

### 7.1 查询房间时间轴

```
GET /api/billing/timeline/{resourceId}?date=2026-05-14
```

### 7.2 查询资源价格

```
GET /api/billing/price?resourceId={resourceId}&merchantId={merchantId}
```

### 7.3 查询套餐列表

```
GET /api/billing/packages?merchantId={merchantId}
```

### 7.4 创建预付订单（按时计费）

```
POST /api/billing/order/prepaid
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| merchantId | Long | 是 | 商户ID |
| resourceId | Long | 是 | 资源ID |
| externalUserId | String | 是 | 用户标识 |
| startTime | String | 是 | 开始时间 |
| durationMinutes | Integer | 是 | 时长（分钟） |
| storeId | Long | 否 | 门店ID |
| phone | String | 是 | 手机号（用于用户进件） |
| nickname | String | 否 | 昵称 |

**返回：** `{ success, data, cashierUrl }` — 前端跳转 cashierUrl 完成支付

### 7.5 创建套餐订单

```
POST /api/billing/order/package
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| merchantId | Long | 是 | 商户ID |
| resourceId | Long | 是 | 资源ID |
| externalUserId | String | 是 | 用户标识 |
| startTime | String | 是 | 开始时间 |
| packageId | Long | 是 | 套餐ID |

### 7.6 查询用户订单列表

```
GET /api/billing/order/list?externalUserId={userId}&status={status}&pageNo=1&pageSize=20
```

### 7.7 查询订单详情

```
GET /api/billing/order/{orderId}
```

### 7.8 退房结算

```
POST /api/billing/order/{orderId}/end
```

### 7.9 续费

```
POST /api/billing/order/{orderId}/renew?additionalMinutes=60
```

**返回：** `{ success, data, cashierUrl }` — 需要补费时跳转 cashierUrl

### 7.10 取消订单

```
POST /api/billing/order/{orderId}/cancel?reason=用户取消&externalUserId={userId}
```

### 7.11 支付后赠积分

```
POST /api/billing/order/{orderId}/points
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| userId | Long | 是 | 用户ID |
| totalAmount | Long | 是 | 总金额（分） |
| balanceDeducted | Long | 否 | 余额抵扣金额（分），余额部分不赠积分 |

---

## 八、商户会员充值

### 8.1 加入商户会员

```
POST /api/member/recharge/join
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| merchantId | Long | 是 | 商户ID |
| externalUserId | String | 是 | 用户标识 |
| storeId | Long | 否 | 门店ID |

### 8.2 查询会员信息

```
GET /api/member/recharge/info?merchantId={merchantId}&externalUserId={userId}
```

### 8.3 充值到商户会员余额

```
POST /api/member/recharge/to-merchant
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| memberId | Long | 是 | 商起点会员ID |
| merchantId | Long | 是 | 商户ID |
| amount | Integer | 是 | 充值金额（分） |
| returnUrl | String | 否 | 支付完成跳转地址 |

**返回：** `{ success, rechargeId, cashierUrl, token }`

### 8.4 查询充值单状态

```
GET /api/member/recharge/status/{rechargeId}
```

### 8.5 查询会员余额流水

```
GET /api/member/recharge/transactions/{memberId}?transactionType=&balanceType=&pageNo=1&pageSize=20
```

### 8.6 跨商户会员余额列表

```
GET /api/member/recharge/list?externalUserId={userId}&pageNo=1&pageSize=20
```

---

## 九、支付（商起点收银台）

### 9.1 创建收银台

```
POST /api/sqd/payment/cashier/create
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| merchantId | Long | 是 | 商户ID |
| outTradeNo | String | 是 | 业务单号 |
| subject | String | 是 | 订单标题 |
| totalAmount | Integer | 是 | 金额（分） |
| returnUrl | String | 否 | 支付完成跳转 |

### 9.2 查询支付结果

```
GET /api/sqd/payment/query?tradeNo={tradeNo}
```

### 9.3 创建订单

```
POST /api/sqd/payment/orders
```

### 9.4 查询订单列表

```
GET /api/sqd/payment/orders?merchantId={merchantId}&externalUserId={userId}&status={status}&pageNo=1&pageSize=20
```

### 9.5 查询订单详情

```
GET /api/sqd/payment/orders/{orderId}?merchantId={merchantId}
```

### 9.6 订单支付

```
POST /api/sqd/payment/orders/{orderId}/pay?merchantId={merchantId}
```

### 9.7 取消订单

```
POST /api/sqd/payment/orders/{orderId}/cancel?merchantId={merchantId}&externalUserId={userId}
```

### 9.8 申请退款

```
POST /api/sqd/payment/orders/{orderId}/refund?merchantId={merchantId}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| refundAmount | Integer | 是 | 退款金额（分） |
| reason | String | 否 | 退款原因 |

### 9.9 订单评价

```
POST /api/sqd/payment/orders/{orderId}/review?merchantId={merchantId}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| content | String | 是 | 评价内容 |
| rating | Integer | 是 | 评分 |

---

## 十、钱包与积分

### 10.1 获取钱包信息

```
GET /api/wallet/{userId}
```

**返回：** `{ success, wallet, points, totalEarnedPoints }`

### 10.2 获取交易记录

```
GET /api/wallet/{userId}/transactions?limit=50
```

### 10.3 创建充值订单

```
POST /api/wallet/recharge
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| userId | Long | 是 | 用户ID |
| amount | BigDecimal | 是 | 充值金额（元），0.1~10000 |
| paymentMethod | String | 是 | 支付方式 |

### 10.4 获取积分

```
GET /api/wallet/{userId}/points
```

**返回：** `{ success, points, totalEarned, totalUsed }`

### 10.5 获取积分变动记录

```
GET /api/wallet/{userId}/points/transactions?page=0&size=20
```

### 10.6 获取积分返还比例

```
GET /api/wallet/points/earn-rate
```

---

## 十一、银行卡

### 11.1 获取银行卡列表

```
GET /api/user/bank-cards/{userId}
```

### 11.2 添加银行卡

```
POST /api/user/bank-cards
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| userId | Long | 是 | 用户ID |
| holderName | String | 是 | 持卡人姓名 |
| cardNo | String | 是 | 卡号 |
| phone | String | 是 | 预留手机号 |
| code | String | 否 | 短信验证码 |
| isDefault | Boolean | 否 | 是否默认卡 |

### 11.3 设置默认银行卡

```
POST /api/user/bank-cards/set-default
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| userId | Long | 是 | 用户ID |
| cardId | Long | 是 | 银行卡ID |

### 11.4 删除银行卡

```
DELETE /api/user/bank-cards/{cardId}?userId={userId}
```

### 11.5 识别银行

```
POST /api/user/bank-cards/identify
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| cardNo | String | 是 | 卡号前6位 |

---

## 十二、支付密码

### 12.1 检查是否已设置

```
GET /api/user/has-pay-password/{userId}
```

**返回：** `{ success, hasPassword }`

### 12.2 设置/修改支付密码

```
POST /api/user/pay-password
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| userId | Long | 是 | 用户ID |
| newPassword | String | 是 | 新密码（6位数字） |
| oldPassword | String | 条件 | 修改时必填原密码 |

### 12.3 验证支付密码

```
POST /api/user/verify-pay-password
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| userId | Long | 是 | 用户ID |
| password | String | 是 | 支付密码 |

**返回：** `{ success, valid }`

### 12.4 重置支付密码（管理员）

```
POST /api/user/reset-pay-password/{userId}
```

---

## 十三、文件上传

### 13.1 上传图片

```
POST /api/upload/image
Content-Type: multipart/form-data
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| file | File | 是 | 图片文件，最大10MB，支持 JPG/PNG/GIF/WebP/HEIC |

**返回：**
```json
{
  "success": true,
  "url": "https://www.quexitai.com/api/upload/files/20260514/xxx.jpg",
  "fileName": "xxx.jpg"
}
```

---

## 十四、充值支付（微信/支付宝）

### 14.1 微信支付

```
POST /api/payment/wechat/pay
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| orderNo | String | 是 | 充值订单号（由 /api/wallet/recharge 返回） |
| openid | String | 是 | 用户openid |

**返回：** `{ success, payParams, orderNo }` — payParams 用于调起微信支付

### 14.2 查询充值订单状态

```
GET /api/payment/order/{orderNo}
```

---

## 附录：通用说明

### 错误返回格式

```json
{
  "success": false,
  "message": "具体错误原因"
}
```

### 取消限制返回

频繁取消预约/订单时会触发限制：
```json
{
  "success": false,
  "code": "CANCEL_LIMITED",
  "message": "取消过于频繁，请30分钟后再试",
  "retryAfterSeconds": 1800,
  "limitedUntil": "2026-05-14T15:30:00"
}
```

### 分页返回格式

```json
{
  "success": true,
  "data": {
    "list": [...],
    "total": 100,
    "pageNo": 1,
    "pageSize": 20
  }
}
```

### 关键业务流程

**预约流程：**
1. `GET /api/rooms` 获取资源列表
2. `GET /api/rooms/booking/available-slots` 查可约时段
3. `POST /api/rooms/booking` 创建预约
4. 后端自动校验门店总开关 + 资源开关 + 时段可用性

**计费下单流程：**
1. `GET /api/rooms` 获取房间列表
2. `GET /api/billing/timeline/{resourceId}` 查时间轴
3. `POST /api/billing/order/prepaid` 下单，返回 cashierUrl
4. 前端跳转 cashierUrl 完成支付（支持余额/微信/支付宝）
5. `GET /api/billing/order/{orderId}` 查询订单状态
6. `POST /api/billing/order/{orderId}/end` 退房结算

**会员充值流程：**
1. `POST /api/member/recharge/join` 加入商户会员
2. `GET /api/member/recharge/info` 查询会员信息获取 memberId
3. `POST /api/member/recharge/to-merchant` 创建充值单，返回 cashierUrl
4. 前端跳转 cashierUrl 完成支付
5. `GET /api/member/recharge/status/{rechargeId}` 查询充值结果


---

## 十五、IoT设备控制

> 用于控制棋牌室的智能门锁、电源等IoT设备。  
> ⚠️ **推荐使用"资源动作"接口**（`/api/iot/actions/execute`），而非逐个下发设备命令。资源动作会根据预配置的模板统一完成多设备、多步骤操作。

### 15.1 执行资源动作（核心接口）

```
POST /api/iot/actions/execute
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| merchantId | Long | 是 | 商户ID |
| storeId | Long | 否 | 门店ID |
| resourceId | Long | 是 | 资源ID（房间/桌台） |
| orderId | Long | 否 | 关联订单ID |
| actionType | String | 是 | 动作类型（见下表） |
| resourceType | String | 否 | 资源类型，如 CHESS_ROOM |
| requestNo | String | 否 | 请求编号（不传则自动生成） |
| timeoutSeconds | Integer | 否 | 超时时间（秒），默认30 |
| context | String | 否 | 附加上下文（JSON字符串） |

**动作类型 actionType：**

| 值 | 说明 | 典型场景 |
|----|------|----------|
| START_USAGE | 开始使用 | 用户到店，开锁+开电源 |
| END_USAGE | 结束使用 | 退房，关锁+关电源 |
| PAUSE_USAGE | 暂停使用 | 临时离开 |
| RESUME_USAGE | 恢复使用 | 回来继续 |
| MANUAL_OPEN | 手动开门 | 不关联订单的开门 |
| CLEANING_OPEN | 清洁开门 | 保洁人员开门 |

**返回示例：**
```json
{
  "success": true,
  "message": "开锁成功，请进入房间",
  "data": {
    "actionNo": "ACT202605140001",
    "status": 10,
    "steps": [...]
  }
}
```

**典型调用（用户开门）：**
```json
{
  "merchantId": 123,
  "resourceId": 456,
  "orderId": 789,
  "actionType": "START_USAGE"
}
```

---

### 15.2 查询动作执行结果

```
GET /api/iot/actions/{actionNo}
```

**动作状态：**

| status | 说明 |
|--------|------|
| 0 | 已创建 |
| 10 | 执行中 |
| 20 | 成功 |
| 30 | 部分失败 |
| 40 | 失败 |
| 50 | 超时 |

> 前端可在执行动作后轮询此接口（建议间隔2秒，最多轮询5次），确认动作是否成功

---

### 15.3 查询资源动作模板

```
GET /api/iot/actions/templates?merchantId={merchantId}&storeId={storeId}&resourceType=CHESS_ROOM
```

---

### 15.4 查询设备列表

```
POST /api/iot/devices/list
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| merchantId | Long | 是 | 商户ID |
| storeId | Long | 否 | 门店ID |
| resourceId | Long | 否 | 资源ID |
| deviceType | String | 否 | 设备类型，如 SMART_LOCK |
| status | Integer | 否 | 设备状态：0-正常 1-禁用 2-故障 |
| onlineStatus | Integer | 否 | 在线状态：0-离线 1-在线 |

---

### 15.5 查询设备详情

```
GET /api/iot/devices/{deviceNo}?merchantId={merchantId}
```

---

### 15.6 查询设备影子（实时状态）

```
GET /api/iot/devices/{deviceNo}/shadow?merchantId={merchantId}
```

**返回：**
```json
{
  "success": true,
  "data": {
    "deviceNo": "LOCK-A01-001",
    "status": 0,
    "onlineStatus": 1,
    "reportedState": { "lockState": "LOCKED", "battery": 85 },
    "desiredState": {}
  }
}
```

---

### 15.7 下发设备命令（低级接口）

> ⚠️ 推荐优先使用 15.1 的资源动作接口

```
POST /api/iot/devices/command?merchantId={merchantId}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| deviceNo | String | 是 | 设备编号 |
| commandType | String | 是 | 命令类型（见下表） |
| resourceId | Long | 否 | 资源ID |
| orderId | Long | 否 | 订单ID |
| payload | String | 否 | 命令参数（JSON字符串） |
| timeoutSeconds | Integer | 否 | 超时时间（秒） |

**支持的命令类型：**

| commandType | 说明 |
|-------------|------|
| UNLOCK | 开锁 |
| LOCK | 关锁 |
| POWER_ON | 开电源 |
| POWER_OFF | 关电源 |
| STATUS_QUERY | 查询状态 |
| SET_DURATION | 设置时长 |
| PAUSE | 暂停 |
| RESUME | 恢复 |

---

### 15.8 IoT 使用流程

**用户端典型流程：**

1. 用户下单支付成功后，前端显示"开门"按钮
2. 用户点击"开门" → 调用 `POST /api/iot/actions/execute`，传 `actionType: "START_USAGE"`
3. 前端轮询 `GET /api/iot/actions/{actionNo}` 确认开锁结果
4. status=20 → 显示"开门成功"；status=40/50 → 提示"开门失败，请重试"
5. 退房时调用 `POST /api/iot/actions/execute`，传 `actionType: "END_USAGE"`

**注意事项：**
- 未配置IoT设备的门店，预约/计费流程不受影响，只是不会触发设备动作
- 设备离线时执行动作会返回失败，前端应提示用户联系店员
- `requestNo` 用于幂等，同一个 requestNo 重复调用不会重复执行
