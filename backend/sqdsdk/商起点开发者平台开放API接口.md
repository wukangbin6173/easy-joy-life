---
title: 开发者平台
language_tabs:
  - shell: Shell
  - http: HTTP
  - javascript: JavaScript
  - ruby: Ruby
  - python: Python
  - php: PHP
  - java: Java
  - go: Go
toc_footers: []
includes: []
search: true
code_clipboard: true
highlight_theme: darkula
headingLevel: 2
generator: "@tarslib/widdershins v4.0.30"

---

# 开发者平台

Base URLs:

# Authentication

# 开放平台 - 测试接口

## GET 连通性测试

GET /test/ping

连通性测试

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "": {}
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultMapObject](#schemacommonresultmapobject)|

# 开放平台 - 实名认证

## POST 提交身份证进行 OCR 识别

POST /v1/real-name-auth/submit-id-card

提交身份证进行 OCR 识别

> Body 请求参数

```json
{
  "idCardFrontUrl": "https://example.com/front.jpg",
  "idCardBackUrl": "https://example.com/back.jpg"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[OpenApiSubmitIdCardReqVO](#schemaopenapisubmitidcardreqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "id": 0,
    "realName": "",
    "idCardNumber": "",
    "idCardFrontUrl": "",
    "idCardBackUrl": "",
    "sex": "",
    "nation": "",
    "birth": "",
    "address": "",
    "authority": "",
    "validDate": "",
    "portraitUrl": "",
    "authStatus": 0,
    "authTime": "",
    "failReason": "",
    "authChannel": ""
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultOpenApiRealNameAuthRespVO](#schemacommonresultopenapirealnameauthrespvo)|

## GET 获取人脸核身 SDK 参数

GET /v1/real-name-auth/face-auth-params

获取人脸核身 SDK 参数

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|idCardNumber|query|string| 是 |身份证号|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "appId": "",
    "userId": "",
    "faceId": "",
    "orderNo": "",
    "nonce": "",
    "sign": "",
    "version": "",
    "licence": ""
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultOpenApiFaceAuthParamsRespVO](#schemacommonresultopenapifaceauthparamsrespvo)|

## GET 查询人脸核身结果

GET /v1/real-name-auth/face-auth-result

查询人脸核身结果

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|orderNo|query|string| 是 |人脸核身订单号|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "id": 0,
    "realName": "",
    "idCardNumber": "",
    "idCardFrontUrl": "",
    "idCardBackUrl": "",
    "sex": "",
    "nation": "",
    "birth": "",
    "address": "",
    "authority": "",
    "validDate": "",
    "portraitUrl": "",
    "authStatus": 0,
    "authTime": "",
    "failReason": "",
    "authChannel": ""
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultOpenApiRealNameAuthRespVO](#schemacommonresultopenapirealnameauthrespvo)|

## GET 根据身份证号查询认证状态

GET /v1/real-name-auth/status

根据身份证号查询认证状态

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|idCardNumber|query|string| 是 |身份证号|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "id": 0,
    "realName": "",
    "idCardNumber": "",
    "idCardFrontUrl": "",
    "idCardBackUrl": "",
    "sex": "",
    "nation": "",
    "birth": "",
    "address": "",
    "authority": "",
    "validDate": "",
    "portraitUrl": "",
    "authStatus": 0,
    "authTime": "",
    "failReason": "",
    "authChannel": ""
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultOpenApiRealNameAuthRespVO](#schemacommonresultopenapirealnameauthrespvo)|

# 开放平台 - 数据统计

## GET 查询经营概览

GET /v1/statistics/overview

查询经营概览

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|merchantId|query|integer| 是 |商户ID|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "todayRevenue": 0,
    "todayOrderCount": 0,
    "todayWriteOffCount": 0,
    "todayNewMemberCount": 0,
    "pendingWriteOffCount": 0,
    "pendingCardApprovalCount": 0,
    "totalMemberCount": 0,
    "accountBalance": 0
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultOpenStatisticsOverviewRespDTO](#schemacommonresultopenstatisticsoverviewrespdto)|

## GET 查询销售报表

GET /v1/statistics/sales

查询销售报表

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|merchantId|query|integer(int64)| 是 |商户ID|
|period|query|string| 否 |统计周期：today/yesterday/week/month|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "period": "",
    "totalIncome": 0,
    "totalRefund": 0,
    "netIncome": 0,
    "orderCount": 0,
    "refundCount": 0,
    "trendItems": [
      {
        "date": "",
        "revenue": 0,
        "orderCount": 0
      }
    ]
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultOpenStatisticsSalesRespDTO](#schemacommonresultopenstatisticssalesrespdto)|

## GET 查询客户分析

GET /v1/statistics/customers

查询客户分析

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|merchantId|query|integer| 是 |商户ID|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "totalCustomers": 0,
    "activeCustomers": 0,
    "frozenCustomers": 0,
    "expiredCustomers": 0,
    "cancelledCustomers": 0,
    "overdueFrozenCustomers": 0,
    "todayNewCustomers": 0,
    "totalReceivable": 0,
    "totalReceived": 0,
    "totalPending": 0,
    "totalOverdue": 0
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultOpenStatisticsCustomerRespDTO](#schemacommonresultopenstatisticscustomerrespdto)|

## GET 查询渠道分析

GET /v1/statistics/channels

查询渠道分析

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|merchantId|query|integer| 是 |商户ID|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "bySource": [
      {
        "name": "",
        "amount": 0,
        "percentage": 0
      }
    ],
    "byType": [
      {
        "name": "",
        "amount": 0,
        "percentage": 0
      }
    ]
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultOpenStatisticsChannelRespDTO](#schemacommonresultopenstatisticschannelrespdto)|

## GET 查询预约分析

GET /v1/statistics/bookings

查询预约分析

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|merchantId|query|integer| 是 |商户ID|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "totalCount": 0,
    "pendingCount": 0,
    "confirmedCount": 0,
    "inProgressCount": 0,
    "completedCount": 0,
    "cancelledCount": 0,
    "todayCount": 0,
    "todayCompletedCount": 0
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultOpenStatisticsBookingRespDTO](#schemacommonresultopenstatisticsbookingrespdto)|

## POST 创建报表导出任务

POST /v1/statistics/export

创建报表导出任务

> Body 请求参数

```json
{
  "merchantId": 1,
  "reportType": "sales",
  "period": "week",
  "startTime": "string",
  "endTime": "string",
  "fileFormat": "xlsx"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[OpenApiStatisticsExportReqVO](#schemaopenapistatisticsexportreqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "taskId": 0,
    "status": 0
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultOpenStatisticsExportRespDTO](#schemacommonresultopenstatisticsexportrespdto)|

## GET 查询导出任务状态

GET /v1/statistics/export/{taskId}

查询导出任务状态

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|taskId|path|integer| 是 |none|
|merchantId|query|integer| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "taskId": 0,
    "status": 0,
    "progress": 0,
    "reportType": "",
    "fileUrl": "",
    "fileSize": 0,
    "errorMessage": "",
    "expireTime": "",
    "createTime": ""
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultOpenStatisticsExportStatusRespDTO](#schemacommonresultopenstatisticsexportstatusrespdto)|

# 开放平台 - 会员卡数据

## GET 查询会员卡模板列表

GET /v1/card-templates

查询会员卡模板列表

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|pageNo|query|integer| 是 |页码，从 1 开始|
|pageSize|query|integer| 是 |每页条数，最大值为 100|
|merchantId|query|integer(int64)| 否 |商户ID（精确匹配）|
|cardType|query|integer| 否 |卡类型：1-储值卡 2-次卡 3-折扣卡 4-套餐卡|
|status|query|integer| 否 |状态：0-草稿 1-上架中 2-已下架 3-已过期|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "total": 0,
    "list": [
      {
        "id": 0,
        "merchantId": 0,
        "cardName": "",
        "cardType": 0,
        "coverUrl": "",
        "description": "",
        "detail": "",
        "usageRules": "",
        "tips": "",
        "servicePhone": "",
        "cardAmount": 0,
        "buyAmount": 0,
        "initAmount": 0,
        "presentAmount": 0,
        "installmentEnabled": 0,
        "installmentOptions": "",
        "deferredEnabled": 0,
        "deferredDays": 0,
        "oneTimeInterestRate": 0,
        "overdueEnabled": 0,
        "overdueDailyRate": 0,
        "overdueMaxRate": 0,
        "repaymentDeadlineDays": 0,
        "useRechargeTiers": 0,
        "allowCustomAmount": 0,
        "minRechargeAmount": 0,
        "maxRechargeAmount": 0,
        "totalTimes": 0,
        "timesUnit": "",
        "discountRate": 0,
        "packageItems": "",
        "levelId": 0,
        "serviceFee": 0,
        "validityDays": 0,
        "storeScope": 0,
        "storeIds": "",
        "defaultCommissionRate": 0,
        "selfIssueVoucherEnabled": 0,
        "recommended": 0,
        "sortOrder": 0,
        "status": 0,
        "createTime": ""
      }
    ]
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultPageResultOpenCardTemplateRespDTO](#schemacommonresultpageresultopencardtemplaterespdto)|

## POST 创建会员卡模板

POST /v1/card-templates

创建会员卡模板

> Body 请求参数

```json
{
  "merchantId": 1,
  "cardType": 1,
  "cardName": "VIP会员卡",
  "coverUrl": "string",
  "description": "string",
  "detail": "string",
  "usageRules": "string",
  "tips": "string",
  "servicePhone": "string",
  "paymentMode": 0,
  "cardAmount": 100000,
  "buyAmount": 80000,
  "initAmount": 10000,
  "presentAmount": 5000,
  "installmentEnabled": 0,
  "installmentOptions": "string",
  "oneTimeInterestRate": 0,
  "overdueEnabled": 0,
  "overdueDailyRate": 0,
  "overdueMaxRate": 0,
  "repaymentDeadlineDays": 30,
  "useRechargeTiers": 0,
  "allowCustomAmount": 0,
  "minRechargeAmount": 1000,
  "maxRechargeAmount": 500000,
  "totalTimes": 10,
  "timesUnit": "次",
  "discountRate": 85,
  "packageItems": "string",
  "levelId": 1,
  "serviceFee": 0,
  "validityDays": 365,
  "storeScope": 0,
  "storeIds": "string",
  "defaultCommissionRate": 5,
  "selfIssueVoucherEnabled": 0,
  "recommended": 0,
  "sortOrder": 0
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[OpenApiCardTemplateCreateReqVO](#schemaopenapicardtemplatecreatereqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": 0
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultLong](#schemacommonresultlong)|

## GET 查询会员卡模板详情

GET /v1/card-templates/{templateId}

查询会员卡模板详情

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|templateId|path|integer| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "id": 0,
    "merchantId": 0,
    "cardName": "",
    "cardType": 0,
    "coverUrl": "",
    "description": "",
    "detail": "",
    "usageRules": "",
    "tips": "",
    "servicePhone": "",
    "cardAmount": 0,
    "buyAmount": 0,
    "initAmount": 0,
    "presentAmount": 0,
    "installmentEnabled": 0,
    "installmentOptions": "",
    "deferredEnabled": 0,
    "deferredDays": 0,
    "oneTimeInterestRate": 0,
    "overdueEnabled": 0,
    "overdueDailyRate": 0,
    "overdueMaxRate": 0,
    "repaymentDeadlineDays": 0,
    "useRechargeTiers": 0,
    "allowCustomAmount": 0,
    "minRechargeAmount": 0,
    "maxRechargeAmount": 0,
    "totalTimes": 0,
    "timesUnit": "",
    "discountRate": 0,
    "packageItems": "",
    "levelId": 0,
    "serviceFee": 0,
    "validityDays": 0,
    "storeScope": 0,
    "storeIds": "",
    "defaultCommissionRate": 0,
    "selfIssueVoucherEnabled": 0,
    "recommended": 0,
    "sortOrder": 0,
    "status": 0,
    "createTime": ""
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultOpenCardTemplateRespDTO](#schemacommonresultopencardtemplaterespdto)|

## PUT 更新会员卡模板

PUT /v1/card-templates/{templateId}

更新会员卡模板

> Body 请求参数

```json
{
  "cardName": "VIP会员卡",
  "coverUrl": "string",
  "description": "string",
  "detail": "string",
  "usageRules": "string",
  "tips": "string",
  "servicePhone": "string",
  "paymentMode": 0,
  "cardAmount": 100000,
  "buyAmount": 80000,
  "initAmount": 10000,
  "presentAmount": 5000,
  "installmentEnabled": 0,
  "installmentOptions": "string",
  "oneTimeInterestRate": 0,
  "overdueEnabled": 0,
  "overdueDailyRate": 0,
  "overdueMaxRate": 0,
  "repaymentDeadlineDays": 30,
  "useRechargeTiers": 0,
  "allowCustomAmount": 0,
  "minRechargeAmount": 1000,
  "maxRechargeAmount": 500000,
  "totalTimes": 10,
  "timesUnit": "次",
  "discountRate": 85,
  "packageItems": "string",
  "levelId": 1,
  "serviceFee": 0,
  "validityDays": 365,
  "storeScope": 0,
  "storeIds": "string",
  "recommended": 0,
  "sortOrder": 0
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|templateId|path|integer| 是 |none|
|merchantId|query|integer| 是 |none|
|body|body|[OpenApiCardTemplateUpdateReqVO](#schemaopenapicardtemplateupdatereqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

## POST 创建会员卡购买单

POST /v1/member-card-purchases

创建会员卡购买单

> Body 请求参数

```json
{
  "merchantId": 1,
  "templateId": 1,
  "externalUserId": "ext_user_001",
  "phone": "13800138000",
  "tierId": 1,
  "paymentMode": 0,
  "bizNo": "mc_order_20260329_001",
  "storeId": 1
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[OpenApiMemberCardPurchaseCreateReqVO](#schemaopenapimembercardpurchasecreatereqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "purchaseId": 0,
    "bizNo": "",
    "paymentMode": 0,
    "payableAmount": 0,
    "status": 0,
    "statusName": "",
    "nextAction": "",
    "payOrderId": 0,
    "cardNo": "",
    "applyId": 0,
    "storeId": 0
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultOpenMemberCardPurchaseDetailRespDTO](#schemacommonresultopenmembercardpurchasedetailrespdto)|

## POST 创建会员卡购买收银台

POST /v1/member-card-purchases/{purchaseId}/cashier

创建会员卡购买收银台

> Body 请求参数

```json
{
  "returnUrl": "https://app.example.com/result",
  "expireMinutes": 30
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|purchaseId|path|integer| 是 |none|
|body|body|[OpenApiMemberCardPurchaseCashierReqVO](#schemaopenapimembercardpurchasecashierreqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "tradeNo": "",
    "cashierUrl": ""
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultOpenMemberCardPurchaseCashierRespDTO](#schemacommonresultopenmembercardpurchasecashierrespdto)|

## PUT 上架会员卡模板

PUT /v1/card-templates/{templateId}/publish

上架会员卡模板

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|templateId|path|integer| 是 |none|
|merchantId|query|integer| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

## GET 查询会员卡购买单

GET /v1/member-card-purchases/{purchaseId}

查询会员卡购买单

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|purchaseId|path|integer| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "purchaseId": 0,
    "bizNo": "",
    "paymentMode": 0,
    "payableAmount": 0,
    "status": 0,
    "statusName": "",
    "nextAction": "",
    "payOrderId": 0,
    "cardNo": "",
    "applyId": 0,
    "storeId": 0
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultOpenMemberCardPurchaseDetailRespDTO](#schemacommonresultopenmembercardpurchasedetailrespdto)|

## PUT 下架会员卡模板

PUT /v1/card-templates/{templateId}/unpublish

下架会员卡模板

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|templateId|path|integer| 是 |none|
|merchantId|query|integer| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

## GET 查询会员卡列表

GET /v1/member-cards

查询会员卡列表

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|pageNo|query|integer| 是 |页码，从 1 开始|
|pageSize|query|integer| 是 |每页条数，最大值为 100|
|merchantId|query|integer(int64)| 否 |商户ID（精确匹配）|
|cardType|query|integer| 否 |卡类型：1-储值卡 2-次卡 3-折扣卡 4-套餐卡|
|status|query|integer| 否 |状态：0-正常 1-冻结 2-已过期 3-已用完 4-已退卡 5-逾期冻结|
|keyword|query|string| 否 |关键词（卡号）|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "total": 0,
    "list": [
      {
        "appId": 0,
        "appUserId": 0,
        "externalUserId": "",
        "merchantId": 0,
        "templateId": 0,
        "tierId": 0,
        "cardNo": "",
        "cardType": 0,
        "paymentMode": 0,
        "levelId": 0,
        "purchaseAmount": 0,
        "bonusAmount": 0,
        "totalAmount": 0,
        "remainAmount": 0,
        "usedAmount": 0,
        "timesTotal": 0,
        "timesLeft": 0,
        "timesUsed": 0,
        "discountRate": 0,
        "packageUsage": "",
        "paidAmount": 0,
        "owedAmount": 0,
        "installmentStatus": 0,
        "installmentPeriods": 0,
        "nextPaymentDate": "",
        "nextPaymentAmount": 0,
        "overdueAmount": 0,
        "overdueDays": 0,
        "status": 0,
        "activateTime": "",
        "expireTime": "",
        "createTime": ""
      }
    ]
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultPageResultOpenApiMemberCardRespVO](#schemacommonresultpageresultopenapimembercardrespvo)|

## GET 查询会员卡详情

GET /v1/member-cards/{cardNo}

查询会员卡详情

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|cardNo|path|string| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "appId": 0,
    "appUserId": 0,
    "externalUserId": "",
    "merchantId": 0,
    "templateId": 0,
    "tierId": 0,
    "cardNo": "",
    "cardType": 0,
    "paymentMode": 0,
    "levelId": 0,
    "purchaseAmount": 0,
    "bonusAmount": 0,
    "totalAmount": 0,
    "remainAmount": 0,
    "usedAmount": 0,
    "timesTotal": 0,
    "timesLeft": 0,
    "timesUsed": 0,
    "discountRate": 0,
    "packageUsage": "",
    "paidAmount": 0,
    "owedAmount": 0,
    "installmentStatus": 0,
    "installmentPeriods": 0,
    "nextPaymentDate": "",
    "nextPaymentAmount": 0,
    "overdueAmount": 0,
    "overdueDays": 0,
    "status": 0,
    "activateTime": "",
    "expireTime": "",
    "createTime": ""
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultOpenApiMemberCardRespVO](#schemacommonresultopenapimembercardrespvo)|

## PUT 配置充值档位

PUT /v1/card-templates/{templateId}/recharge-tiers

配置充值档位

> Body 请求参数

```json
{
  "tiers": [
    {
      "rechargeAmount": 10000,
      "bonusAmount": 2000,
      "bonusRate": 20,
      "bonusType": 1,
      "bonusInstallmentMonths": 3,
      "bonusPerConsumeRate": 0.2,
      "sortOrder": 0,
      "status": 0
    }
  ]
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|templateId|path|integer| 是 |none|
|merchantId|query|integer| 是 |none|
|body|body|[OpenApiRechargeTierSaveBatchReqVO](#schemaopenapirechargetiersavebatchreqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

## GET 查询会员卡详情

GET /v1/member-cards/{cardId}

查询会员卡详情

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|cardId|path|integer| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "id": 0,
    "appId": 0,
    "appUserId": 0,
    "merchantId": 0,
    "templateId": 0,
    "tierId": 0,
    "cardNo": "",
    "cardType": 0,
    "paymentMode": 0,
    "levelId": 0,
    "purchaseAmount": 0,
    "bonusAmount": 0,
    "totalAmount": 0,
    "remainAmount": 0,
    "usedAmount": 0,
    "timesTotal": 0,
    "timesLeft": 0,
    "timesUsed": 0,
    "discountRate": 0,
    "packageUsage": "",
    "paidAmount": 0,
    "owedAmount": 0,
    "installmentStatus": 0,
    "installmentPeriods": 0,
    "nextPaymentDate": "",
    "nextPaymentAmount": 0,
    "overdueAmount": 0,
    "overdueDays": 0,
    "status": 0,
    "activateTime": "",
    "expireTime": "",
    "createTime": ""
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultOpenMemberCardRespDTO](#schemacommonresultopenmembercardrespdto)|

## POST 会员卡充值

POST /v1/member-cards/{cardNo}/recharge

会员卡充值

> Body 请求参数

```json
{
  "amount": 10000,
  "tierId": 1
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|cardNo|path|string| 是 |none|
|body|body|[OpenApiMemberCardRechargeReqVO](#schemaopenapimembercardrechargereqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

## PUT 配置分销提成

PUT /v1/card-templates/{templateId}/commission

配置分销提成

> Body 请求参数

```json
{
  "defaultCommissionRate": 5
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|templateId|path|integer| 是 |none|
|merchantId|query|integer| 是 |none|
|body|body|[OpenApiCommissionConfigReqVO](#schemaopenapicommissionconfigreqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

## POST 会员卡充值

POST /v1/member-cards/{cardId}/recharge

会员卡充值

> Body 请求参数

```json
{
  "amount": 10000,
  "tierId": 1
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|cardId|path|integer| 是 |none|
|body|body|[OpenApiMemberCardRechargeReqVO](#schemaopenapimembercardrechargereqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

## POST 生成会员卡核销二维码

POST /v1/member-cards/{cardNo}/write-off-qrcode

生成会员卡核销二维码

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|cardNo|path|string| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "requestNo": "",
    "qrToken": "",
    "qrTimestamp": 0,
    "qrExpireTime": "",
    "resourceType": 0,
    "cardNo": ""
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultOpenApiMemberCardWriteOffQrRespVO](#schemacommonresultopenapimembercardwriteoffqrrespvo)|

## PUT 配置会员发券

PUT /v1/card-templates/{templateId}/coupon-config

配置会员发券

> Body 请求参数

```json
{
  "isEnabled": 1,
  "minAmountPerCoupon": 100,
  "maxAmountPerCoupon": 50000,
  "dailyIssueLimit": 5,
  "dailyAmountLimit": 100000,
  "hourlyIssueLimit": 2,
  "serviceFeeRate": 2,
  "allowedLevelIds": "string",
  "minConsumptionRequired": 0,
  "couponValidityDays": 30
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|templateId|path|integer| 是 |none|
|merchantId|query|integer| 是 |none|
|body|body|[OpenApiCouponConfigSaveReqVO](#schemaopenapicouponconfigsavereqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

## POST 生成会员卡核销二维码

POST /v1/member-cards/{cardId}/write-off-qrcode

生成会员卡核销二维码

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|cardId|path|integer| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "requestNo": "",
    "qrToken": "",
    "qrTimestamp": 0,
    "qrExpireTime": "",
    "resourceType": 0,
    "resourceId": 0
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultOpenWriteOffQrRespDTO](#schemacommonresultopenwriteoffqrrespdto)|

## GET 查询会员卡核销记录

GET /v1/member-cards/write-off-records/{requestNo}

查询会员卡核销记录

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|requestNo|path|string| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "requestNo": "",
    "appId": 0,
    "merchantId": 0,
    "storeId": 0,
    "resourceType": 0,
    "cardNo": "",
    "status": 0,
    "qrTimestamp": 0,
    "qrExpireTime": "",
    "amount": 0,
    "times": 0,
    "packageItemName": "",
    "operatorId": 0,
    "remark": "",
    "callbackStatus": 0,
    "confirmTime": "",
    "completeTime": "",
    "cancelTime": ""
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultOpenApiMemberCardWriteOffRecordRespVO](#schemacommonresultopenapimembercardwriteoffrecordrespvo)|

## POST 确认会员卡核销

POST /v1/member-cards/write-off-records/{requestNo}/confirm

确认会员卡核销

> Body 请求参数

```json
{
  "approved": true,
  "remark": "用户确认核销"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|requestNo|path|string| 是 |none|
|body|body|[OpenApiMemberCardWriteOffConfirmReqVO](#schemaopenapimembercardwriteoffconfirmreqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "requestNo": "",
    "appId": 0,
    "merchantId": 0,
    "storeId": 0,
    "resourceType": 0,
    "cardNo": "",
    "status": 0,
    "qrTimestamp": 0,
    "qrExpireTime": "",
    "amount": 0,
    "times": 0,
    "packageItemName": "",
    "operatorId": 0,
    "remark": "",
    "callbackStatus": 0,
    "confirmTime": "",
    "completeTime": "",
    "cancelTime": ""
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultOpenApiMemberCardWriteOffRecordRespVO](#schemacommonresultopenapimembercardwriteoffrecordrespvo)|

## GET 查询会员卡消费记录

GET /v1/member-cards/{cardNo}/consumption-records

查询会员卡消费记录

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|cardNo|path|string| 是 |none|
|pageNo|query|integer| 是 |页码，从 1 开始|
|pageSize|query|integer| 是 |每页条数，最大值为 100|
|bizType|query|integer| 否 |业务类型：1-扫码支付 2-消费券核销 3-手动核销 4-次卡扣次 5-折扣消费 6-套餐项目使用 7-退款回退 8-抵金券购券扣减 9-动态收款码会员卡抵扣|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "total": 0,
    "list": [
      {
        "id": 0,
        "cardNo": "",
        "merchantId": 0,
        "storeId": 0,
        "amount": 0,
        "balanceBefore": 0,
        "balanceAfter": 0,
        "timesBefore": 0,
        "timesAfter": 0,
        "bizType": 0,
        "bizId": 0,
        "voucherId": 0,
        "packageItemName": "",
        "operatorType": 0,
        "operatorId": 0,
        "remark": "",
        "createTime": ""
      }
    ]
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultPageResultOpenConsumptionRecordRespDTO](#schemacommonresultpageresultopenconsumptionrecordrespdto)|

## GET 查询会员卡消费记录

GET /v1/member-cards/{cardId}/consumption-records

查询会员卡消费记录

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|cardId|path|integer| 是 |none|
|pageNo|query|integer| 是 |页码，从 1 开始|
|pageSize|query|integer| 是 |每页条数，最大值为 100|
|bizType|query|integer| 否 |业务类型：1-扫码支付 2-消费券核销 3-手动核销 4-次卡扣次 5-折扣消费 6-套餐项目使用 7-退款回退|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "total": 0,
    "list": [
      {
        "id": 0,
        "cardId": 0,
        "merchantId": 0,
        "storeId": 0,
        "amount": 0,
        "balanceBefore": 0,
        "balanceAfter": 0,
        "timesBefore": 0,
        "timesAfter": 0,
        "bizType": 0,
        "bizId": 0,
        "voucherId": 0,
        "packageItemName": "",
        "operatorType": 0,
        "operatorId": 0,
        "remark": "",
        "createTime": ""
      }
    ]
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultPageResultOpenConsumptionRecordRespDTO](#schemacommonresultpageresultopenconsumptionrecordrespdto)|

## POST 购买会员卡（全款直接开卡；先付/零门槛提交赊账申请待商户审核）

POST /v1/member-cards/purchase

购买会员卡（全款直接开卡；先付/零门槛提交赊账申请待商户审核）

> Body 请求参数

```json
{
  "merchantId": 1,
  "templateId": 1,
  "appUserId": 1,
  "externalUserId": "ext_user_001",
  "tierId": 1
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[OpenApiMemberCardPurchaseReqVO](#schemaopenapimembercardpurchasereqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "resultType": "",
    "id": 0
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultOpenMemberCardPurchaseRespVO](#schemacommonresultopenmembercardpurchaserespvo)|

## GET 查询会员卡统计

GET /v1/member-cards/statistics

查询会员卡统计

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|merchantId|query|integer| 是 |商户ID|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "totalCount": 0,
    "activeCount": 0,
    "frozenCount": 0,
    "expiredCount": 0,
    "usedUpCount": 0,
    "refundedCount": 0
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultOpenMemberCardStatisticsRespDTO](#schemacommonresultopenmembercardstatisticsrespdto)|

## POST 申请会员卡退款

POST /v1/member-cards/refund/apply

申请会员卡退款

> Body 请求参数

```json
{
  "cardNo": "MC20240001",
  "appUserId": 1,
  "externalUserId": "ext_user_001",
  "refundAmount": 100,
  "refundReason": "不需要了",
  "evidenceUrls": "[\"https://example.com/img1.jpg\"]"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[OpenApiMemberCardRefundApplyReqVO](#schemaopenapimembercardrefundapplyreqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

## POST 会员卡核销

POST /v1/member-cards/{cardId}/write-off

会员卡核销

> Body 请求参数

```json
{
  "storeId": 1,
  "amount": 5000,
  "times": 1,
  "packageItemName": "深层清洁",
  "bizType": 3,
  "bizId": 1,
  "remark": "string"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|cardId|path|integer| 是 |none|
|body|body|[OpenApiMemberCardWriteOffReqVO](#schemaopenapimembercardwriteoffreqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

## POST 会员卡购买优惠券

POST /v1/member-cards/{cardId}/purchase-coupon

会员卡购买优惠券

> Body 请求参数

```json
{
  "couponTemplateId": 1
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|cardId|path|integer| 是 |none|
|body|body|[OpenApiMemberCardCouponPurchaseReqVO](#schemaopenapimembercardcouponpurchasereqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

## POST 会员卡核销优惠券

POST /v1/member-cards/{cardId}/write-off-coupon

会员卡核销优惠券

> Body 请求参数

```json
{
  "couponId": 1,
  "storeId": 1
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|cardId|path|integer| 是 |none|
|body|body|[OpenApiMemberCardCouponWriteOffReqVO](#schemaopenapimembercardcouponwriteoffreqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

# 开放平台 - 可预订资源

## GET 查询资源列表

GET /v1/resources

查询资源列表

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|pageNo|query|integer| 是 |页码，从 1 开始|
|pageSize|query|integer| 是 |每页条数，最大值为 100|
|merchantId|query|integer(int64)| 否 |商户ID（精确匹配）|
|storeId|query|integer(int64)| 否 |门店ID|
|typeId|query|integer(int64)| 否 |资源类型ID|
|resourceName|query|string| 否 |资源名称（模糊匹配）|
|status|query|integer| 否 |当前状态：0-空闲 1-预订中 2-占用中 3-维护中 4-停用 5-休息中|
|isEnabled|query|integer| 否 |是否启用：0-否 1-是|
|isAcceptBooking|query|integer| 否 |是否接受预约：0-否 1-是|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "total": 0,
    "list": [
      {
        "id": 0,
        "merchantId": 0,
        "storeId": 0,
        "typeId": 0,
        "resourceNo": "",
        "resourceName": "",
        "resourcePhoto": "",
        "description": "",
        "tags": "",
        "attributes": "",
        "status": 0,
        "isEnabled": 0,
        "isAcceptBooking": 0,
        "isShowInApp": 0,
        "sort": 0,
        "priority": 0,
        "rating": 0,
        "bookingCount": 0,
        "serviceCount": 0,
        "createTime": ""
      }
    ]
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultPageResultOpenResourceRespDTO](#schemacommonresultpageresultopenresourcerespdto)|

## POST 创建资源

POST /v1/resources

创建资源

> Body 请求参数

```json
{
  "merchantId": 1,
  "storeId": 1,
  "typeId": 1,
  "resourceName": "VIP包间1号",
  "resourcePhoto": "string",
  "description": "string",
  "tags": "string",
  "attributes": "string",
  "isEnabled": 1,
  "isAcceptBooking": 1,
  "isShowInApp": 1,
  "sort": 0,
  "priority": 0
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[OpenApiResourceCreateReqVO](#schemaopenapiresourcecreatereqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": 0
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultLong](#schemacommonresultlong)|

## GET 查询资源详情

GET /v1/resources/{resourceId}

查询资源详情

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|resourceId|path|integer| 是 |none|
|merchantId|query|integer| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "id": 0,
    "merchantId": 0,
    "storeId": 0,
    "typeId": 0,
    "resourceNo": "",
    "resourceName": "",
    "resourcePhoto": "",
    "description": "",
    "tags": "",
    "attributes": "",
    "status": 0,
    "isEnabled": 0,
    "isAcceptBooking": 0,
    "isShowInApp": 0,
    "sort": 0,
    "priority": 0,
    "rating": 0,
    "bookingCount": 0,
    "serviceCount": 0,
    "createTime": ""
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultOpenResourceRespDTO](#schemacommonresultopenresourcerespdto)|

## PUT 更新资源

PUT /v1/resources/{resourceId}

更新资源

> Body 请求参数

```json
{
  "resourceName": "VIP包间1号",
  "resourcePhoto": "string",
  "description": "string",
  "tags": "string",
  "attributes": "string",
  "isEnabled": 1,
  "isAcceptBooking": 1,
  "isShowInApp": 1,
  "sort": 0,
  "priority": 0
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|resourceId|path|integer| 是 |none|
|merchantId|query|integer| 是 |none|
|body|body|[OpenApiResourceUpdateReqVO](#schemaopenapiresourceupdatereqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

## DELETE 删除资源

DELETE /v1/resources/{resourceId}

删除资源

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|resourceId|path|integer| 是 |none|
|merchantId|query|integer| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

## GET 查询资源可用性

GET /v1/resources/{resourceId}/availability

查询资源可用性

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|resourceId|path|integer| 是 |none|
|merchantId|query|integer| 是 |none|
|date|query|string| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "resourceId": 0,
    "date": "",
    "currentStatus": 0,
    "isRestDay": false,
    "availableSlots": [
      {
        "startTime": "",
        "endTime": "",
        "type": ""
      }
    ],
    "occupiedSlots": [
      {
        "startTime": "",
        "endTime": "",
        "type": ""
      }
    ]
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultOpenResourceAvailabilityRespDTO](#schemacommonresultopenresourceavailabilityrespdto)|

## GET 批量查询资源状态

GET /v1/resources/batch-status

批量查询资源状态

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|resourceIds|query|array[integer]| 是 |none|
|merchantId|query|integer| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": [
    {
      "resourceId": 0,
      "resourceName": "",
      "status": 0,
      "isEnabled": 0
    }
  ]
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultListOpenResourceBatchStatusRespDTO](#schemacommonresultlistopenresourcebatchstatusrespdto)|

## GET 查询资源统计

GET /v1/resources/statistics

查询资源统计

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|merchantId|query|integer| 是 |商户ID|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "totalCount": 0,
    "enabledCount": 0,
    "disabledCount": 0,
    "idleCount": 0,
    "bookingCount": 0,
    "occupiedCount": 0,
    "maintenanceCount": 0,
    "disabledStatusCount": 0,
    "restingCount": 0,
    "acceptBookingCount": 0,
    "totalBookingCount": 0,
    "totalServiceCount": 0
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultOpenResourceStatisticsRespDTO](#schemacommonresultopenresourcestatisticsrespdto)|

## PUT 更新资源状态

PUT /v1/resources/{resourceId}/status

更新资源状态

> Body 请求参数

```json
{
  "status": 0,
  "changeReason": "string"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|resourceId|path|integer| 是 |none|
|merchantId|query|integer| 是 |none|
|body|body|[OpenApiResourceStatusUpdateReqVO](#schemaopenapiresourcestatusupdatereqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

## PUT 设置资源价格

PUT /v1/resources/{resourceId}/price

设置资源价格

> Body 请求参数

```json
{
  "billingMethod": 1,
  "basePrice": 10000,
  "memberPrice": 8000,
  "vipPrice": 6000,
  "timeSlotPrices": "string",
  "tieredPrices": "string",
  "packagePrices": "string",
  "extraFees": "string",
  "bufferMinutes": 15,
  "minBookingMinutes": 30,
  "maxBookingMinutes": 480,
  "isEnabled": 1
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|resourceId|path|integer| 是 |none|
|merchantId|query|integer| 是 |none|
|body|body|[OpenApiResourcePriceUpdateReqVO](#schemaopenapiresourcepriceupdatereqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

## PUT 设置资源排班

PUT /v1/resources/{resourceId}/schedule

设置资源排班

> Body 请求参数

```json
{
  "scheduleType": 1,
  "dayOfWeek": 1,
  "scheduleDate": "string",
  "timeSlots": "string",
  "isRestDay": 0,
  "remark": "string",
  "isEnabled": 1
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|resourceId|path|integer| 是 |none|
|merchantId|query|integer| 是 |none|
|body|body|[OpenApiResourceScheduleUpdateReqVO](#schemaopenapiresourcescheduleupdatereqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

# 开放平台 - 商户数据

## GET 查询商户列表

GET /v1/merchants

查询商户列表

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|pageNo|query|integer| 是 |页码，从 1 开始|
|pageSize|query|integer| 是 |每页条数，最大值为 100|
|name|query|string| 否 |商户名称（模糊匹配）|
|status|query|integer| 否 |状态：0-正常 1-禁用 2-注销|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "total": 0,
    "list": [
      {
        "id": 0,
        "merchantNo": "",
        "name": "",
        "shortName": "",
        "logoUrl": "",
        "coverUrl": "",
        "contactName": "",
        "contactPhone": "",
        "contactEmail": "",
        "province": "",
        "city": "",
        "district": "",
        "address": "",
        "status": 0,
        "createTime": ""
      }
    ]
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultPageResultOpenMerchantRespDTO](#schemacommonresultpageresultopenmerchantrespdto)|

## GET 查询商户详情

GET /v1/merchants/{merchantId}

查询商户详情

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|merchantId|path|integer| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "id": 0,
    "merchantNo": "",
    "name": "",
    "shortName": "",
    "logoUrl": "",
    "coverUrl": "",
    "contactName": "",
    "contactPhone": "",
    "contactEmail": "",
    "province": "",
    "city": "",
    "district": "",
    "address": "",
    "status": 0,
    "createTime": ""
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultOpenMerchantRespDTO](#schemacommonresultopenmerchantrespdto)|

## PUT 更新商户信息

PUT /v1/merchants/{merchantId}

更新商户信息

> Body 请求参数

```json
{
  "name": "沐沐美业",
  "shortName": "沐沐",
  "logoUrl": "string",
  "coverUrl": "string",
  "contactName": "张三",
  "contactPhone": "13800138000",
  "contactEmail": "contact@example.com",
  "province": "广东省",
  "city": "深圳市",
  "district": "南山区",
  "address": "科技园南区"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|merchantId|path|integer| 是 |none|
|body|body|[OpenApiMerchantUpdateReqVO](#schemaopenapimerchantupdatereqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

## GET 查询门店列表

GET /v1/stores

查询门店列表

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|pageNo|query|integer| 是 |页码，从 1 开始|
|pageSize|query|integer| 是 |每页条数，最大值为 100|
|merchantId|query|integer(int64)| 否 |指定商户ID|
|storeName|query|string| 否 |门店名称（模糊匹配）|
|status|query|integer| 否 |状态：0-正常 1-关闭|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "total": 0,
    "list": [
      {
        "id": 0,
        "merchantId": 0,
        "storeNo": "",
        "storeName": "",
        "logoUrl": "",
        "coverUrl": "",
        "categoryId": 0,
        "tags": "",
        "province": "",
        "city": "",
        "district": "",
        "address": "",
        "longitude": 0,
        "latitude": 0,
        "contactName": "",
        "contactPhone": "",
        "businessHours": "",
        "isDefault": 0,
        "qrCodeUrl": "",
        "status": 0,
        "announcement": "",
        "photos": "",
        "distance": 0,
        "createTime": ""
      }
    ]
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultPageResultOpenStoreRespDTO](#schemacommonresultpageresultopenstorerespdto)|

## POST 创建门店

POST /v1/stores

创建门店

> Body 请求参数

```json
{
  "merchantId": 1,
  "storeName": "南山旗舰店",
  "logoUrl": "string",
  "coverUrl": "string",
  "categoryId": 0,
  "tags": "string",
  "province": "广东省",
  "city": "深圳市",
  "district": "南山区",
  "address": "科技园南区",
  "longitude": 113.9435,
  "latitude": 22.54,
  "contactName": "李四",
  "contactPhone": "13800138001",
  "businessHours": "09:00-22:00"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[OpenApiStoreCreateReqVO](#schemaopenapistorecreatereqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": 0
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultLong](#schemacommonresultlong)|

## GET 查询门店详情

GET /v1/stores/{storeId}

查询门店详情

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|storeId|path|integer| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "id": 0,
    "merchantId": 0,
    "storeNo": "",
    "storeName": "",
    "logoUrl": "",
    "coverUrl": "",
    "categoryId": 0,
    "tags": "",
    "province": "",
    "city": "",
    "district": "",
    "address": "",
    "longitude": 0,
    "latitude": 0,
    "contactName": "",
    "contactPhone": "",
    "businessHours": "",
    "isDefault": 0,
    "qrCodeUrl": "",
    "status": 0,
    "announcement": "",
    "photos": "",
    "distance": 0,
    "createTime": ""
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultOpenStoreRespDTO](#schemacommonresultopenstorerespdto)|

## PUT 更新门店

PUT /v1/stores/{storeId}

更新门店

> Body 请求参数

```json
{
  "storeName": "南山旗舰店",
  "logoUrl": "string",
  "coverUrl": "string",
  "categoryId": 0,
  "tags": "string",
  "province": "广东省",
  "city": "深圳市",
  "district": "南山区",
  "address": "科技园南区",
  "longitude": 113.9435,
  "latitude": 22.54,
  "contactName": "李四",
  "contactPhone": "13800138001",
  "businessHours": "09:00-22:00",
  "announcement": "string",
  "photos": "string"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|storeId|path|integer| 是 |none|
|body|body|[OpenApiStoreUpdateReqVO](#schemaopenapistoreupdatereqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

## DELETE 删除门店

DELETE /v1/stores/{storeId}

删除门店

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|storeId|path|integer| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

## GET 查询附近门店

GET /v1/stores/nearby

查询附近门店

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|longitude|query|string| 是 |经度|
|latitude|query|string| 是 |纬度|
|radiusKm|query|integer| 否 |搜索半径（km），默认 5|
|limit|query|integer| 否 |返回数量限制，默认 20|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": [
    {
      "id": 0,
      "merchantId": 0,
      "storeNo": "",
      "storeName": "",
      "logoUrl": "",
      "coverUrl": "",
      "categoryId": 0,
      "tags": "",
      "province": "",
      "city": "",
      "district": "",
      "address": "",
      "longitude": 0,
      "latitude": 0,
      "contactName": "",
      "contactPhone": "",
      "businessHours": "",
      "isDefault": 0,
      "qrCodeUrl": "",
      "status": 0,
      "announcement": "",
      "photos": "",
      "distance": 0,
      "createTime": ""
    }
  ]
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultListOpenStoreRespDTO](#schemacommonresultlistopenstorerespdto)|

## GET 查询门店营业时间

GET /v1/stores/{storeId}/business-hours

查询门店营业时间

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|storeId|path|integer| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "storeId": 0,
    "storeName": "",
    "businessHours": "",
    "status": 0,
    "schedules": [
      {
        "dayOfWeek": 0,
        "isOpen": 0,
        "timeSlots": ""
      }
    ]
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultOpenBusinessHoursRespDTO](#schemacommonresultopenbusinesshoursrespdto)|

## POST 注册商户

POST /v1/merchants/register

注册商户

> Body 请求参数

```json
{
  "name": "沐沐美业",
  "shortName": "沐沐",
  "contactName": "张三",
  "contactPhone": "13800138000",
  "contactEmail": "contact@example.com",
  "province": "广东省",
  "city": "深圳市",
  "district": "南山区",
  "address": "科技园南区"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[OpenApiMerchantRegisterReqVO](#schemaopenapimerchantregisterreqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": 0
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultLong](#schemacommonresultlong)|

## POST 提交商户认证

POST /v1/merchants/{merchantId}/certification

提交商户认证

> Body 请求参数

```json
{
  "businessLicense": "91440300...",
  "licenseUrl": "string",
  "legalPerson": "张三",
  "legalPersonIdCard": "440300...",
  "idCardFrontUrl": "string",
  "idCardBackUrl": "string",
  "bankName": "中国银行",
  "bankBranch": "深圳南山支行",
  "bankAccount": "6222...",
  "bankAccountName": "深圳沐沐美业有限公司"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|merchantId|path|integer| 是 |none|
|body|body|[OpenApiMerchantCertificationReqVO](#schemaopenapimerchantcertificationreqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

## GET 查询商户认证状态

GET /v1/merchants/{merchantId}/certification/status

查询商户认证状态

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|merchantId|path|integer| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "merchantId": 0,
    "certificationStatus": 0,
    "businessLicense": "",
    "licenseUrl": "",
    "legalPerson": "",
    "legalPersonIdCard": "",
    "idCardFrontUrl": "",
    "idCardBackUrl": "",
    "bankName": "",
    "bankBranch": "",
    "bankAccount": "",
    "bankAccountName": ""
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultOpenMerchantCertificationRespDTO](#schemacommonresultopenmerchantcertificationrespdto)|

# 开放平台 - 客户管理

## POST 同步用户信息

POST /v1/customers/sync

同步用户信息

> Body 请求参数

```json
{
  "externalUserId": "ext_user_001",
  "customerName": "张三",
  "customerPhone": "13800138000",
  "customerNickname": "小张",
  "customerAvatar": "https://example.com/avatar.jpg"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[OpenApiCustomerSyncReqVO](#schemaopenapicustomersyncreqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": 0
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultLong](#schemacommonresultlong)|

## POST 客户进件建档

POST /v1/customers/intake

客户进件建档

> Body 请求参数

```json
{
  "externalUserId": "ext_user_001",
  "realName": "张三",
  "phone": "13800138000",
  "idCardNumber": "110101199001011234",
  "nickname": "小张",
  "avatarUrl": "https://example.com/avatar.jpg"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[OpenApiCustomerIntakeReqVO](#schemaopenapicustomerintakereqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": 0
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultLong](#schemacommonresultlong)|

## GET 查询客户列表

GET /v1/customers

查询客户列表

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|pageNo|query|integer| 是 |页码，从 1 开始|
|pageSize|query|integer| 是 |每页条数，最大值为 100|
|merchantId|query|integer(int64)| 否 |商户ID（精确匹配）|
|cardType|query|integer| 否 |卡类型：1-储值卡 2-次卡 3-折扣卡 4-套餐卡|
|status|query|integer| 否 |状态：0-正常 1-冻结 2-已过期 3-已用完 4-已退卡 5-逾期冻结|
|keyword|query|string| 否 |关键词（卡号模糊匹配）|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "total": 0,
    "list": [
      {
        "id": 0,
        "merchantId": 0,
        "appUserId": 0,
        "cardNo": "",
        "cardType": 0,
        "paymentMode": 0,
        "totalAmount": 0,
        "remainAmount": 0,
        "usedAmount": 0,
        "timesTotal": 0,
        "timesLeft": 0,
        "discountRate": 0,
        "owedAmount": 0,
        "installmentStatus": 0,
        "status": 0,
        "activateTime": "",
        "expireTime": "",
        "createTime": ""
      }
    ]
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultPageResultOpenCustomerRespDTO](#schemacommonresultpageresultopencustomerrespdto)|

## GET 查询客户详情

GET /v1/customers/{customerId}

查询客户详情

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|customerId|path|integer| 是 |none|
|merchantId|query|integer| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "id": 0,
    "merchantId": 0,
    "appUserId": 0,
    "templateId": 0,
    "cardNo": "",
    "cardType": 0,
    "paymentMode": 0,
    "purchaseAmount": 0,
    "bonusAmount": 0,
    "totalAmount": 0,
    "remainAmount": 0,
    "usedAmount": 0,
    "timesTotal": 0,
    "timesLeft": 0,
    "timesUsed": 0,
    "discountRate": 0,
    "packageUsage": [
      {
        "name": "深层清洁",
        "total": 3,
        "used": 1
      }
    ],
    "paidAmount": 0,
    "owedAmount": 0,
    "installmentStatus": 0,
    "installmentPeriods": 0,
    "nextPaymentDate": "",
    "nextPaymentAmount": 0,
    "overdueAmount": 0,
    "overdueDays": 0,
    "status": 0,
    "activateTime": "",
    "expireTime": "",
    "createTime": "",
    "tags": [
      {
        "tagId": 0,
        "tagName": "",
        "tagType": 0,
        "tagColor": "",
        "tagDescription": "",
        "tagSource": 0,
        "createTime": ""
      }
    ]
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultOpenCustomerDetailRespDTO](#schemacommonresultopencustomerdetailrespdto)|

## GET 按手机号换取平台用户ID

GET /v1/customers/platform-user-id-by-phone

按手机号换取平台用户ID

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|phone|query|string| 是 |用户手机号|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": 0
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultLong](#schemacommonresultlong)|

## GET 查询客户消费记录

GET /v1/customers/{customerId}/transactions

查询客户消费记录

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|customerId|path|integer| 是 |none|
|merchantId|query|integer| 是 |none|
|pageNo|query|integer| 是 |页码，从 1 开始|
|pageSize|query|integer| 是 |每页条数，最大值为 100|
|bizType|query|integer| 否 |业务类型：1-扫码支付 2-消费券核销 3-手动核销 4-次卡扣次 5-折扣消费 6-套餐项目使用 7-退款回退 8-抵金券购券扣减 9-动态收款码会员卡抵扣|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "total": 0,
    "list": [
      {
        "id": 0,
        "cardId": 0,
        "storeId": 0,
        "amount": 0,
        "balanceBefore": 0,
        "balanceAfter": 0,
        "timesBefore": 0,
        "timesAfter": 0,
        "bizType": 0,
        "bizId": 0,
        "packageItemName": "",
        "remark": "",
        "createTime": ""
      }
    ]
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultPageResultOpenCustomerTransactionRespDTO](#schemacommonresultpageresultopencustomertransactionrespdto)|

## GET 查询客户标签

GET /v1/customers/{customerId}/tags

查询客户标签

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|customerId|path|integer| 是 |none|
|merchantId|query|integer| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": [
    {
      "tagId": 0,
      "tagName": "",
      "tagType": 0,
      "tagColor": "",
      "tagDescription": "",
      "tagSource": 0,
      "createTime": ""
    }
  ]
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultListOpenCustomerTagRespDTO](#schemacommonresultlistopencustomertagrespdto)|

## POST 添加客户标签

POST /v1/customers/{customerId}/tags

添加客户标签

> Body 请求参数

```json
{
  "tagName": "VIP客户",
  "tagColor": "#FF5722",
  "tagDescription": "高价值客户"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|customerId|path|integer| 是 |none|
|merchantId|query|integer| 是 |none|
|body|body|[OpenApiCustomerTagAddReqVO](#schemaopenapicustomertagaddreqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

## DELETE 移除客户标签

DELETE /v1/customers/{customerId}/tags/{tagName}

移除客户标签

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|customerId|path|integer| 是 |none|
|tagName|path|string| 是 |none|
|merchantId|query|integer| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

## GET 查询客户统计

GET /v1/customers/statistics

查询客户统计

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|merchantId|query|integer| 是 |商户ID|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "totalCustomers": 0,
    "activeCustomers": 0,
    "frozenCustomers": 0,
    "expiredCustomers": 0,
    "cancelledCustomers": 0,
    "overdueFrozenCustomers": 0,
    "totalReceivable": 0,
    "totalReceived": 0,
    "totalPending": 0,
    "totalOverdue": 0
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultOpenCustomerStatisticsRespDTO](#schemacommonresultopencustomerstatisticsrespdto)|

# 开放平台 - 商品数据

## GET 查询商品列表

GET /v1/products

查询商品列表

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|pageNo|query|integer| 是 |页码，从 1 开始|
|pageSize|query|integer| 是 |每页条数，最大值为 100|
|merchantId|query|integer(int64)| 否 |商户ID（精确匹配）|
|categoryId|query|integer(int64)| 否 |分类ID|
|spuName|query|string| 否 |商品名称（模糊匹配）|
|status|query|integer| 否 |状态：0-上架 1-下架 2-售罄|
|productType|query|integer| 否 |商品类型：1-实物商品 2-餐饮商品 3-服务项目 4-计时服务 5-虚拟商品 6-套餐组合|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "total": 0,
    "list": [
      {
        "id": 0,
        "merchantId": 0,
        "categoryId": 0,
        "spuName": "",
        "subtitle": "",
        "productType": 0,
        "unit": "",
        "serviceDuration": 0,
        "coverUrl": "",
        "images": "",
        "description": "",
        "detail": "",
        "tags": "",
        "price": 0,
        "originalPrice": 0,
        "memberPrice": 0,
        "vipPrice": 0,
        "stock": 0,
        "stockType": 0,
        "stockWarning": 0,
        "salesCount": 0,
        "viewCount": 0,
        "rating": 0,
        "storeScope": 0,
        "storeIds": "",
        "sort": 0,
        "recommended": 0,
        "specType": 0,
        "status": 0,
        "publishedAt": "",
        "createTime": ""
      }
    ]
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultPageResultOpenProductRespDTO](#schemacommonresultpageresultopenproductrespdto)|

## POST 创建商品

POST /v1/products

创建商品

> Body 请求参数

```json
{
  "merchantId": 1,
  "categoryId": 1,
  "spuName": "招牌奶茶",
  "subtitle": "超值优惠",
  "productType": 1,
  "unit": "份",
  "serviceDuration": 60,
  "coverUrl": "string",
  "images": "string",
  "description": "string",
  "detail": "string",
  "tags": "string",
  "price": 9900,
  "originalPrice": 19900,
  "memberPrice": 8900,
  "vipPrice": 7900,
  "costPrice": 5000,
  "stock": 100,
  "stockType": 1,
  "stockWarning": 10,
  "storeScope": 0,
  "storeIds": "string",
  "sort": 0,
  "recommended": 0,
  "specType": 0,
  "status": 0
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[OpenApiProductCreateReqVO](#schemaopenapiproductcreatereqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": 0
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultLong](#schemacommonresultlong)|

## GET 查询商品详情

GET /v1/products/{productId}

查询商品详情

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|productId|path|integer| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "id": 0,
    "merchantId": 0,
    "categoryId": 0,
    "spuName": "",
    "subtitle": "",
    "productType": 0,
    "unit": "",
    "serviceDuration": 0,
    "coverUrl": "",
    "images": "",
    "description": "",
    "detail": "",
    "tags": "",
    "price": 0,
    "originalPrice": 0,
    "memberPrice": 0,
    "vipPrice": 0,
    "stock": 0,
    "stockType": 0,
    "stockWarning": 0,
    "salesCount": 0,
    "viewCount": 0,
    "rating": 0,
    "storeScope": 0,
    "storeIds": "",
    "sort": 0,
    "recommended": 0,
    "specType": 0,
    "status": 0,
    "publishedAt": "",
    "createTime": ""
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultOpenProductRespDTO](#schemacommonresultopenproductrespdto)|

## PUT 更新商品

PUT /v1/products/{productId}

更新商品

> Body 请求参数

```json
{
  "categoryId": 1,
  "spuName": "招牌奶茶",
  "subtitle": "超值优惠",
  "productType": 1,
  "unit": "份",
  "serviceDuration": 60,
  "coverUrl": "string",
  "images": "string",
  "description": "string",
  "detail": "string",
  "tags": "string",
  "price": 9900,
  "originalPrice": 19900,
  "memberPrice": 8900,
  "vipPrice": 7900,
  "costPrice": 5000,
  "stock": 100,
  "stockType": 1,
  "stockWarning": 10,
  "storeScope": 0,
  "storeIds": "string",
  "sort": 0,
  "recommended": 0,
  "specType": 0
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|productId|path|integer| 是 |none|
|body|body|[OpenApiProductUpdateReqVO](#schemaopenapiproductupdatereqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

## DELETE 删除商品

DELETE /v1/products/{productId}

删除商品

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|productId|path|integer| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

## GET 搜索商品

GET /v1/products/search

搜索商品

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|pageNo|query|integer| 是 |页码，从 1 开始|
|pageSize|query|integer| 是 |每页条数，最大值为 100|
|keyword|query|string| 是 |搜索关键词|
|categoryId|query|integer(int64)| 否 |分类ID|
|minPrice|query|integer| 否 |最低价格（分）|
|maxPrice|query|integer| 否 |最高价格（分）|
|sortBy|query|string| 否 |排序字段：price/salesCount/createTime|
|sortOrder|query|string| 否 |排序方向：asc/desc|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "total": 0,
    "list": [
      {
        "id": 0,
        "merchantId": 0,
        "categoryId": 0,
        "spuName": "",
        "subtitle": "",
        "productType": 0,
        "unit": "",
        "serviceDuration": 0,
        "coverUrl": "",
        "images": "",
        "description": "",
        "detail": "",
        "tags": "",
        "price": 0,
        "originalPrice": 0,
        "memberPrice": 0,
        "vipPrice": 0,
        "stock": 0,
        "stockType": 0,
        "stockWarning": 0,
        "salesCount": 0,
        "viewCount": 0,
        "rating": 0,
        "storeScope": 0,
        "storeIds": "",
        "sort": 0,
        "recommended": 0,
        "specType": 0,
        "status": 0,
        "publishedAt": "",
        "createTime": ""
      }
    ]
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultPageResultOpenProductRespDTO](#schemacommonresultpageresultopenproductrespdto)|

## GET 查询商品分类列表

GET /v1/product-categories

查询商品分类列表

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|merchantId|query|integer| 是 |商户ID|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": [
    {
      "id": 0,
      "merchantId": 0,
      "parentId": 0,
      "name": "",
      "iconUrl": "",
      "sort": 0,
      "status": 0,
      "createTime": ""
    }
  ]
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultListOpenCategoryRespDTO](#schemacommonresultlistopencategoryrespdto)|

## POST 创建商品分类

POST /v1/product-categories

创建商品分类

> Body 请求参数

```json
{
  "merchantId": 1,
  "parentId": 0,
  "name": "饮品",
  "iconUrl": "string",
  "sort": 0,
  "status": 0
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[OpenApiCategoryCreateReqVO](#schemaopenapicategorycreatereqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": 0
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultLong](#schemacommonresultlong)|

## PUT 商品上架/下架

PUT /v1/products/{productId}/status

商品上架/下架

> Body 请求参数

```json
{
  "status": 0
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|productId|path|integer| 是 |none|
|body|body|[OpenApiProductStatusUpdateReqVO](#schemaopenapiproductstatusupdatereqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

## PUT 更新商品分类

PUT /v1/product-categories/{categoryId}

更新商品分类

> Body 请求参数

```json
{
  "parentId": 0,
  "name": "饮品",
  "iconUrl": "string",
  "sort": 0,
  "status": 0
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|categoryId|path|integer| 是 |none|
|merchantId|query|integer| 是 |none|
|body|body|[OpenApiCategoryUpdateReqVO](#schemaopenapicategoryupdatereqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

## DELETE 删除商品分类

DELETE /v1/product-categories/{categoryId}

删除商品分类

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|categoryId|path|integer| 是 |none|
|merchantId|query|integer| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

## POST 库存入库

POST /v1/products/{productId}/stock-in

库存入库

> Body 请求参数

```json
{
  "quantity": 10,
  "reason": "采购入库",
  "remark": "供应商送货"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|productId|path|integer| 是 |none|
|body|body|[OpenApiStockOperationReqVO](#schemaopenapistockoperationreqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

## POST 库存出库

POST /v1/products/{productId}/stock-out

库存出库

> Body 请求参数

```json
{
  "quantity": 10,
  "reason": "采购入库",
  "remark": "供应商送货"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|productId|path|integer| 是 |none|
|body|body|[OpenApiStockOperationReqVO](#schemaopenapistockoperationreqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

## GET 查询库存变动日志

GET /v1/products/{productId}/stock-logs

查询库存变动日志

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|productId|path|integer| 是 |none|
|pageNo|query|integer| 是 |页码，从 1 开始|
|pageSize|query|integer| 是 |每页条数，最大值为 100|
|changeType|query|integer| 否 |变动类型：1-入库 2-出库 3-调整 4-调拨 5-订单扣减 6-订单取消恢复 7-盘点|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "total": 0,
    "list": [
      {
        "id": 0,
        "spuId": 0,
        "skuId": 0,
        "changeType": 0,
        "changeQuantity": 0,
        "stockBefore": 0,
        "stockAfter": 0,
        "reason": "",
        "remark": "",
        "createTime": ""
      }
    ]
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultPageResultOpenStockLogRespDTO](#schemacommonresultpageresultopenstocklogrespdto)|

## GET 查询商品统计

GET /v1/products/statistics

查询商品统计

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|merchantId|query|integer| 是 |商户ID|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "onSaleCount": 0,
    "offSaleCount": 0,
    "soldOutCount": 0,
    "totalCount": 0
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultOpenProductStatisticsRespDTO](#schemacommonresultopenproductstatisticsrespdto)|

# 开放平台 - 预约数据

## GET 查询可用预约时间段

GET /v1/booking/available-slots

查询可用预约时间段

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|merchantId|query|integer(int64)| 是 |商户ID|
|storeId|query|integer(int64)| 否 |门店ID|
|bookingDate|query|string| 是 |预约日期|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": [
    {
      "startTime": "",
      "endTime": "",
      "available": false,
      "bookedCount": 0
    }
  ]
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultListOpenBookingAvailableSlotRespDTO](#schemacommonresultlistopenbookingavailableslotrespdto)|

## GET 查询预约列表

GET /v1/booking/orders

查询预约列表

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|pageNo|query|integer| 是 |页码，从 1 开始|
|pageSize|query|integer| 是 |每页条数，最大值为 100|
|merchantId|query|integer(int64)| 否 |商户ID（精确匹配）|
|storeId|query|integer(int64)| 否 |门店ID|
|status|query|integer| 否 |订单状态：0-待确认 1-已确认 2-进行中 3-已完成 4-已取消 5-已过期|
|bookingDateStart|query|string| 否 |预约日期起始|
|bookingDateEnd|query|string| 否 |预约日期结束|
|userName|query|string| 否 |预约人姓名（模糊匹配）|
|userPhone|query|string| 否 |预约人手机号|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "total": 0,
    "list": [
      {
        "id": 0,
        "orderNo": "",
        "merchantId": 0,
        "storeId": 0,
        "bookingDate": "",
        "startTime": "",
        "endTime": "",
        "duration": 0,
        "actualDuration": 0,
        "userName": "",
        "userPhone": "",
        "userRemark": "",
        "specialRequirement": "",
        "peopleCount": 0,
        "status": 0,
        "confirmType": 0,
        "confirmTime": "",
        "startServiceTime": "",
        "finishServiceTime": "",
        "cancelTime": "",
        "cancelReason": "",
        "cancelBy": 0,
        "sourceAppId": 0,
        "sourceAppName": "",
        "sourceChannel": "",
        "baseAmount": 0,
        "extraAmount": 0,
        "discountAmount": 0,
        "totalAmount": 0,
        "paidAmount": 0,
        "refundAmount": 0,
        "paymentMethod": "",
        "paymentStatus": 0,
        "paymentTime": "",
        "rating": 0,
        "comment": "",
        "remark": "",
        "createTime": ""
      }
    ]
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultPageResultOpenBookingOrderRespDTO](#schemacommonresultpageresultopenbookingorderrespdto)|

## POST 创建预约订单

POST /v1/booking/orders

创建预约订单

> Body 请求参数

```json
{
  "merchantId": 1,
  "storeId": 1,
  "bookingDate": "string",
  "startTime": "string",
  "endTime": "string",
  "duration": 60,
  "userName": "张三",
  "userPhone": "13800138000",
  "userRemark": "string",
  "specialRequirement": "string",
  "peopleCount": 2,
  "sourceChannel": "string",
  "baseAmount": 10000,
  "extraAmount": 0,
  "discountAmount": 0,
  "totalAmount": 10000
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[OpenApiBookingOrderCreateReqVO](#schemaopenapibookingordercreatereqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": 0
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultLong](#schemacommonresultlong)|

## GET 查询预约详情

GET /v1/booking/orders/{orderId}

查询预约详情

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|orderId|path|integer| 是 |none|
|merchantId|query|integer| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "id": 0,
    "orderNo": "",
    "merchantId": 0,
    "storeId": 0,
    "bookingDate": "",
    "startTime": "",
    "endTime": "",
    "duration": 0,
    "actualDuration": 0,
    "userName": "",
    "userPhone": "",
    "userRemark": "",
    "specialRequirement": "",
    "peopleCount": 0,
    "status": 0,
    "confirmType": 0,
    "confirmTime": "",
    "startServiceTime": "",
    "finishServiceTime": "",
    "cancelTime": "",
    "cancelReason": "",
    "cancelBy": 0,
    "sourceAppId": 0,
    "sourceAppName": "",
    "sourceChannel": "",
    "baseAmount": 0,
    "extraAmount": 0,
    "discountAmount": 0,
    "totalAmount": 0,
    "paidAmount": 0,
    "refundAmount": 0,
    "paymentMethod": "",
    "paymentStatus": 0,
    "paymentTime": "",
    "rating": 0,
    "comment": "",
    "remark": "",
    "createTime": ""
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultOpenBookingOrderRespDTO](#schemacommonresultopenbookingorderrespdto)|

## PUT 变更预约

PUT /v1/booking/orders/{orderId}

变更预约

> Body 请求参数

```json
{
  "bookingDate": "string",
  "startTime": "string",
  "endTime": "string",
  "duration": 60,
  "userName": "张三",
  "userPhone": "13800138000",
  "userRemark": "string",
  "specialRequirement": "string",
  "peopleCount": 2,
  "remark": "string"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|orderId|path|integer| 是 |none|
|merchantId|query|integer| 是 |none|
|body|body|[OpenApiBookingOrderUpdateReqVO](#schemaopenapibookingorderupdatereqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

## GET 查询预约统计

GET /v1/booking/statistics

查询预约统计

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|merchantId|query|integer| 是 |商户ID|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "totalCount": 0,
    "pendingCount": 0,
    "confirmedCount": 0,
    "inProgressCount": 0,
    "completedCount": 0,
    "cancelledCount": 0,
    "todayCount": 0,
    "todayCompletedCount": 0
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultOpenBookingStatisticsRespDTO](#schemacommonresultopenbookingstatisticsrespdto)|

## POST 取消预约

POST /v1/booking/orders/{orderId}/cancel

取消预约

> Body 请求参数

```json
{
  "cancelReason": "string",
  "cancelRemark": "string"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|orderId|path|integer| 是 |none|
|merchantId|query|integer| 是 |none|
|body|body|[OpenApiBookingOrderCancelReqVO](#schemaopenapibookingordercancelreqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

## POST 确认预约

POST /v1/booking/orders/{orderId}/confirm

确认预约

> Body 请求参数

```json
{
  "confirmerId": 1,
  "remark": "string"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|orderId|path|integer| 是 |none|
|merchantId|query|integer| 是 |none|
|body|body|[OpenApiBookingOrderConfirmReqVO](#schemaopenapibookingorderconfirmreqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

## POST 开始服务

POST /v1/booking/orders/{orderId}/start

开始服务

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|orderId|path|integer| 是 |none|
|merchantId|query|integer| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

## POST 完成服务

POST /v1/booking/orders/{orderId}/complete

完成服务

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|orderId|path|integer| 是 |none|
|merchantId|query|integer| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

# 开放平台 - 优惠券

## GET 查询优惠券列表

GET /v1/coupons

查询优惠券列表

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|pageNo|query|integer| 是 |页码，从 1 开始|
|pageSize|query|integer| 是 |每页条数，最大值为 100|
|merchantId|query|integer(int64)| 否 |商户ID（精确匹配）|
|couponType|query|integer| 否 |优惠券类型：1-折扣券 2-满减券 3-礼品券|
|status|query|integer| 否 |状态：0-未使用 1-已使用 2-已过期|
|couponNo|query|string| 否 |券号（模糊匹配）|
|templateId|query|integer(int64)| 否 |优惠券模板ID|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "total": 0,
    "list": [
      {
        "id": 0,
        "appId": 0,
        "appUserId": 0,
        "externalUserId": "",
        "merchantId": 0,
        "templateId": 0,
        "couponType": 0,
        "couponNo": "",
        "writeOffCode": "",
        "status": 0,
        "useTime": "",
        "expireTime": "",
        "orderId": 0,
        "templateName": "",
        "templateCoverUrl": "",
        "templateDescription": "",
        "discountRate": 0,
        "maxDiscount": 0,
        "thresholdAmount": 0,
        "reduceAmount": 0,
        "giftDescription": "",
        "createTime": ""
      }
    ]
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultPageResultOpenCouponRespDTO](#schemacommonresultpageresultopencouponrespdto)|

## GET 查询优惠券详情

GET /v1/coupons/{couponId}

查询优惠券详情

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|couponId|path|integer| 是 |none|
|merchantId|query|integer| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "id": 0,
    "appId": 0,
    "appUserId": 0,
    "externalUserId": "",
    "merchantId": 0,
    "templateId": 0,
    "couponType": 0,
    "couponNo": "",
    "writeOffCode": "",
    "status": 0,
    "useTime": "",
    "expireTime": "",
    "orderId": 0,
    "templateName": "",
    "templateCoverUrl": "",
    "templateDescription": "",
    "discountRate": 0,
    "maxDiscount": 0,
    "thresholdAmount": 0,
    "reduceAmount": 0,
    "giftDescription": "",
    "createTime": ""
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultOpenCouponRespDTO](#schemacommonresultopencouponrespdto)|

## GET 查询用户优惠券

GET /v1/coupons/user

查询用户优惠券

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|pageNo|query|integer| 是 |页码，从 1 开始|
|pageSize|query|integer| 是 |每页条数，最大值为 100|
|merchantId|query|integer(int64)| 否 |商户ID（精确匹配）|
|appUserId|query|integer(int64)| 否 |App用户映射ID，传 externalUserId 时可不传|
|externalUserId|query|string| 否 |下游 App 用户标识，传 appUserId 时可不传|
|status|query|integer| 否 |状态：0-未使用 1-已使用 2-已过期|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "total": 0,
    "list": [
      {
        "id": 0,
        "appId": 0,
        "appUserId": 0,
        "externalUserId": "",
        "merchantId": 0,
        "templateId": 0,
        "couponType": 0,
        "couponNo": "",
        "writeOffCode": "",
        "status": 0,
        "useTime": "",
        "expireTime": "",
        "orderId": 0,
        "templateName": "",
        "templateCoverUrl": "",
        "templateDescription": "",
        "discountRate": 0,
        "maxDiscount": 0,
        "thresholdAmount": 0,
        "reduceAmount": 0,
        "giftDescription": "",
        "createTime": ""
      }
    ]
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultPageResultOpenCouponRespDTO](#schemacommonresultpageresultopencouponrespdto)|

## GET 分页查询可用优惠券模板

GET /v1/coupon-templates

分页查询可用优惠券模板

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|pageNo|query|integer| 是 |页码，从 1 开始|
|pageSize|query|integer| 是 |每页条数，最大值为 100|
|merchantId|query|integer(int64)| 否 |商户ID（精确匹配）|
|couponType|query|integer| 否 |优惠券类型：1-折扣券 2-满减券 3-礼品券|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "total": 0,
    "list": [
      {
        "id": 0,
        "merchantId": 0,
        "couponType": 0,
        "name": "",
        "description": "",
        "coverUrl": "",
        "discountRate": 0,
        "maxDiscount": 0,
        "thresholdAmount": 0,
        "reduceAmount": 0,
        "giftDescription": "",
        "purchaseAmount": 0,
        "totalCount": 0,
        "issuedCount": 0,
        "remainingCount": 0,
        "claimLimit": 0,
        "validityDays": 0,
        "storeScope": 0,
        "storeIds": "",
        "status": 0,
        "createTime": ""
      }
    ]
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultPageResultOpenCouponTemplateRespDTO](#schemacommonresultpageresultopencoupontemplaterespdto)|

## POST 创建优惠券模板

POST /v1/coupon-templates

创建优惠券模板

> Body 请求参数

```json
{
  "merchantId": 1,
  "couponType": 1,
  "name": "满100减20",
  "description": "满100元可使用",
  "coverUrl": "https://example.com/cover.png",
  "discountRate": 85,
  "maxDiscount": 5000,
  "thresholdAmount": 10000,
  "reduceAmount": 2000,
  "giftDescription": "赠送一杯饮品",
  "totalCount": 1000,
  "claimLimit": 1,
  "validityDays": 30,
  "storeScope": 0,
  "storeIds": "string"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[OpenApiCouponTemplateCreateReqVO](#schemaopenapicoupontemplatecreatereqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": 0
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultLong](#schemacommonresultlong)|

## GET 查询可领取优惠券

GET /v1/coupons/available

查询可领取优惠券

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|merchantId|query|integer| 是 |商户ID|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": [
    {
      "id": 0,
      "merchantId": 0,
      "couponType": 0,
      "name": "",
      "description": "",
      "coverUrl": "",
      "discountRate": 0,
      "maxDiscount": 0,
      "thresholdAmount": 0,
      "reduceAmount": 0,
      "giftDescription": "",
      "purchaseAmount": 0,
      "totalCount": 0,
      "issuedCount": 0,
      "remainingCount": 0,
      "claimLimit": 0,
      "validityDays": 0,
      "storeScope": 0,
      "storeIds": "",
      "status": 0,
      "createTime": ""
    }
  ]
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultListOpenCouponTemplateRespDTO](#schemacommonresultlistopencoupontemplaterespdto)|

## POST 创建优惠券购买单

POST /v1/coupon-purchases

创建优惠券购买单

> Body 请求参数

```json
{
  "merchantId": 1,
  "templateId": 1,
  "externalUserId": "ext_user_001",
  "bizNo": "cp_order_001",
  "storeId": 1
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[OpenApiCouponPurchaseCreateReqVO](#schemaopenapicouponpurchasecreatereqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "purchaseId": 0,
    "payableAmount": 0,
    "status": 0,
    "statusName": "",
    "nextAction": "",
    "payOrderId": 0,
    "couponId": 0,
    "storeId": 0
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultOpenCouponPurchaseDetailRespDTO](#schemacommonresultopencouponpurchasedetailrespdto)|

## POST 创建优惠券购买收银台

POST /v1/coupon-purchases/{purchaseId}/cashier

创建优惠券购买收银台

> Body 请求参数

```json
{
  "returnUrl": "https://app.example.com/result",
  "expireMinutes": 30
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|purchaseId|path|integer| 是 |none|
|body|body|[OpenApiCouponPurchaseCashierReqVO](#schemaopenapicouponpurchasecashierreqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "tradeNo": "",
    "cashierUrl": ""
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultOpenCouponPurchaseCashierRespDTO](#schemacommonresultopencouponpurchasecashierrespdto)|

## GET 查询优惠券购买单

GET /v1/coupon-purchases/{purchaseId}

查询优惠券购买单

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|purchaseId|path|integer| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "purchaseId": 0,
    "payableAmount": 0,
    "status": 0,
    "statusName": "",
    "nextAction": "",
    "payOrderId": 0,
    "couponId": 0,
    "storeId": 0
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultOpenCouponPurchaseDetailRespDTO](#schemacommonresultopencouponpurchasedetailrespdto)|

## POST 领取优惠券

POST /v1/coupons/claim

领取优惠券

> Body 请求参数

```json
{
  "merchantId": 1,
  "templateId": 1,
  "appUserId": 1,
  "externalUserId": "ext_user_001",
  "storeId": 1
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[OpenApiCouponClaimReqVO](#schemaopenapicouponclaimreqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "resultType": "",
    "id": 0
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultOpenApiCouponAcquireRespVO](#schemacommonresultopenapicouponacquirerespvo)|

## POST 购买优惠券

POST /v1/coupons/purchase

购买优惠券

> Body 请求参数

```json
{
  "merchantId": 1,
  "templateId": 1,
  "appUserId": 1,
  "externalUserId": "ext_user_001",
  "sourceChannel": "open_api",
  "storeId": 1
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[OpenApiCouponPurchaseReqVO](#schemaopenapicouponpurchasereqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "resultType": "",
    "id": 0
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultOpenApiCouponAcquireRespVO](#schemacommonresultopenapicouponacquirerespvo)|

## POST 验证优惠券

POST /v1/coupons/{couponId}/verify

验证优惠券

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|couponId|path|integer| 是 |none|
|merchantId|query|integer| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "valid": false,
    "reason": "",
    "couponId": 0,
    "couponNo": "",
    "couponType": 0,
    "status": 0,
    "templateName": "",
    "discountRate": 0,
    "maxDiscount": 0,
    "thresholdAmount": 0,
    "reduceAmount": 0,
    "giftDescription": "",
    "expireTime": ""
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultOpenCouponVerifyRespDTO](#schemacommonresultopencouponverifyrespdto)|

## POST 核销优惠券

POST /v1/coupons/{couponId}/write-off

核销优惠券

> Body 请求参数

```json
{
  "merchantId": 1,
  "storeId": 1,
  "remark": "线下核销"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|couponId|path|integer| 是 |none|
|body|body|[OpenApiCouponWriteOffReqVO](#schemaopenapicouponwriteoffreqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

## POST 退款优惠券购买单

POST /v1/coupon-purchases/refund

退款优惠券购买单

> Body 请求参数

```json
{
  "purchaseId": 1,
  "appUserId": 1,
  "externalUserId": "ext_user_001"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[OpenApiCouponPurchaseRefundReqVO](#schemaopenapicouponpurchaserefundreqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

## POST 生成优惠券核销二维码

POST /v1/coupons/{couponId}/write-off-qrcode

生成优惠券核销二维码

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|couponId|path|integer| 是 |none|
|merchantId|query|integer| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "requestNo": "",
    "qrToken": "",
    "qrTimestamp": 0,
    "qrExpireTime": "",
    "resourceType": 0,
    "resourceId": 0,
    "resourceCardNo": ""
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultOpenWriteOffQrRespDTO](#schemacommonresultopenwriteoffqrrespdto)|

## GET 查询优惠券核销记录

GET /v1/coupons/write-off-records/{requestNo}

查询优惠券核销记录

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|requestNo|path|string| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "id": 0,
    "requestNo": "",
    "appId": 0,
    "merchantId": 0,
    "storeId": 0,
    "resourceType": 0,
    "resourceId": 0,
    "resourceCardNo": "",
    "status": 0,
    "qrToken": "",
    "qrTimestamp": 0,
    "qrExpireTime": "",
    "amount": 0,
    "shortfallAmount": 0,
    "times": 0,
    "packageItemName": "",
    "operatorId": 0,
    "remark": "",
    "callbackStatus": 0,
    "resultPayload": "",
    "confirmTime": "",
    "completeTime": "",
    "cancelTime": ""
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultOpenWriteOffRecordRespDTO](#schemacommonresultopenwriteoffrecordrespdto)|

## PUT 更新优惠券模板

PUT /v1/coupon-templates/{templateId}

更新优惠券模板

> Body 请求参数

```json
{
  "name": "满100减20",
  "description": "满100元可使用",
  "coverUrl": "https://example.com/cover.png",
  "discountRate": 85,
  "maxDiscount": 5000,
  "thresholdAmount": 10000,
  "reduceAmount": 2000,
  "giftDescription": "赠送一杯饮品",
  "totalCount": 1000,
  "claimLimit": 1,
  "validityDays": 30,
  "storeScope": 0,
  "storeIds": "string"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|templateId|path|integer| 是 |none|
|merchantId|query|integer| 是 |none|
|body|body|[OpenApiCouponTemplateUpdateReqVO](#schemaopenapicoupontemplateupdatereqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

## PUT 发布优惠券模板

PUT /v1/coupon-templates/{templateId}/publish

发布优惠券模板

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|templateId|path|integer| 是 |none|
|merchantId|query|integer| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

## PUT 暂停优惠券模板

PUT /v1/coupon-templates/{templateId}/pause

暂停优惠券模板

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|templateId|path|integer| 是 |none|
|merchantId|query|integer| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

## PUT 恢复优惠券模板

PUT /v1/coupon-templates/{templateId}/resume

恢复优惠券模板

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|templateId|path|integer| 是 |none|
|merchantId|query|integer| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

## POST 批量发放优惠券

POST /v1/coupon-templates/{templateId}/issue

批量发放优惠券

> Body 请求参数

```json
{
  "merchantId": 1,
  "appUserIds": [
    0
  ],
  "externalUserIds": [
    "string"
  ]
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|templateId|path|integer| 是 |none|
|body|body|[OpenApiCouponIssueReqVO](#schemaopenapicouponissuereqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

# 开放平台 - 订单数据

## GET 查询订单列表

GET /v1/orders

查询订单列表

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|pageNo|query|integer| 是 |页码，从 1 开始|
|pageSize|query|integer| 是 |每页条数，最大值为 100|
|merchantId|query|integer(int64)| 否 |商户ID|
|status|query|integer| 否 |订单状态|
|orderType|query|integer| 否 |订单类型|
|orderNo|query|string| 否 |订单号|
|userId|query|integer(int64)| 否 |App用户映射ID|
|externalUserId|query|string| 否 |下游 App 用户标识|
|startTime|query|string| 否 |开始时间|
|endTime|query|string| 否 |结束时间|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "total": 0,
    "list": [
      {
        "id": 0,
        "appId": 0,
        "appUserId": 0,
        "merchantId": 0,
        "storeId": 0,
        "orderNo": "",
        "orderType": 0,
        "totalAmount": 0,
        "discountAmount": 0,
        "voucherDeductAmount": 0,
        "payAmount": 0,
        "couponId": 0,
        "voucherIds": "",
        "payOrderId": 0,
        "status": 0,
        "payTime": "",
        "completeTime": "",
        "cancelTime": "",
        "expireTime": "",
        "verifyCode": "",
        "deliveryStatus": 0,
        "deliveryNo": "",
        "remark": "",
        "createTime": ""
      }
    ]
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultPageResultOpenOrderRespDTO](#schemacommonresultpageresultopenorderrespdto)|

## POST 创建订单

POST /v1/orders

创建订单

> Body 请求参数

```json
{
  "merchantId": 1,
  "storeId": 1,
  "userId": 1,
  "externalUserId": "ext_user_001",
  "orderType": 1,
  "couponId": 1,
  "voucherIds": "string",
  "remark": "string",
  "items": [
    {
      "itemType": 1,
      "itemId": 1,
      "itemName": "招牌奶茶",
      "itemCoverUrl": "string",
      "specValues": "string",
      "price": 9900,
      "quantity": 1
    }
  ]
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[OpenApiOrderCreateReqVO](#schemaopenapiordercreatereqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": 0
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultLong](#schemacommonresultlong)|

## GET 查询订单详情

GET /v1/orders/{orderId}

查询订单详情

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|orderId|path|integer| 是 |none|
|merchantId|query|integer| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "id": 0,
    "appId": 0,
    "appUserId": 0,
    "merchantId": 0,
    "storeId": 0,
    "orderNo": "",
    "orderType": 0,
    "totalAmount": 0,
    "discountAmount": 0,
    "voucherDeductAmount": 0,
    "payAmount": 0,
    "couponId": 0,
    "voucherIds": "",
    "payOrderId": 0,
    "status": 0,
    "payTime": "",
    "completeTime": "",
    "cancelTime": "",
    "expireTime": "",
    "verifyCode": "",
    "deliveryStatus": 0,
    "deliveryNo": "",
    "remark": "",
    "createTime": "",
    "items": [
      {
        "id": 0,
        "orderId": 0,
        "itemType": 0,
        "itemId": 0,
        "itemName": "",
        "itemCoverUrl": "",
        "specValues": "",
        "price": 0,
        "quantity": 0,
        "amount": 0
      }
    ]
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultOpenOrderDetailRespDTO](#schemacommonresultopenorderdetailrespdto)|

## GET 查询订单状态变更历史

GET /v1/orders/{orderId}/status-history

查询订单状态变更历史

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|orderId|path|integer| 是 |none|
|merchantId|query|integer| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": [
    {
      "id": 0,
      "orderId": 0,
      "fromStatus": 0,
      "toStatus": 0,
      "operatorType": 0,
      "operatorId": "",
      "remark": "",
      "createTime": ""
    }
  ]
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultListOpenOrderLogRespDTO](#schemacommonresultlistopenorderlogrespdto)|

## GET 查询订单统计

GET /v1/orders/statistics

查询订单统计

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|merchantId|query|integer| 是 |商户ID|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "totalCount": 0,
    "unpaidCount": 0,
    "paidCount": 0,
    "completedCount": 0,
    "cancelledCount": 0,
    "refundedCount": 0,
    "totalAmount": 0,
    "totalPayAmount": 0
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultOpenOrderStatisticsRespDTO](#schemacommonresultopenorderstatisticsrespdto)|

## GET 查询退款详情

GET /v1/orders/{orderId}/refund

查询退款详情

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|orderId|path|integer| 是 |none|
|merchantId|query|integer| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "id": 0,
    "orderId": 0,
    "merchantId": 0,
    "refundNo": "",
    "refundAmount": 0,
    "reason": "",
    "status": 0,
    "auditTime": "",
    "completeTime": "",
    "auditRemark": "",
    "createTime": ""
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultOpenOrderRefundRespDTO](#schemacommonresultopenorderrefundrespdto)|

## POST 申请退款

POST /v1/orders/{orderId}/refund

申请退款

> Body 请求参数

```json
{
  "refundAmount": 5000,
  "reason": "客户要求退款"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|orderId|path|integer| 是 |none|
|merchantId|query|integer| 是 |none|
|body|body|[OpenApiOrderRefundReqVO](#schemaopenapiorderrefundreqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": 0
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultLong](#schemacommonresultlong)|

## POST 取消订单

POST /v1/orders/{orderId}/cancel

取消订单

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|orderId|path|integer| 是 |none|
|merchantId|query|integer| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

## POST 确认收货

POST /v1/orders/{orderId}/confirm-receipt

确认收货

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|orderId|path|integer| 是 |none|
|merchantId|query|integer| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

## POST 核销订单

POST /v1/orders/{orderId}/write-off

核销订单

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|orderId|path|integer| 是 |none|
|merchantId|query|integer| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

## POST 订单评价

POST /v1/orders/{orderId}/review

订单评价

> Body 请求参数

```json
{
  "content": "string",
  "rating": 5
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|orderId|path|integer| 是 |none|
|merchantId|query|integer| 是 |none|
|body|body|[OpenApiOrderReviewReqVO](#schemaopenapiorderreviewreqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

## POST 订单支付

POST /v1/orders/{orderId}/pay

订单支付

> Body 请求参数

```json
{
  "channelCode": "wx_pub",
  "userIp": "127.0.0.1",
  "channelExtras": {
    "key": "string"
  },
  "returnUrl": "string"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|orderId|path|integer| 是 |none|
|merchantId|query|integer| 是 |none|
|body|body|[OpenApiOrderPayReqVO](#schemaopenapiorderpayreqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "payOrderId": 0,
    "status": 0,
    "displayMode": "",
    "displayContent": ""
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultOpenOrderPayRespDTO](#schemacommonresultopenorderpayrespdto)|

## PUT 更新配送状态

PUT /v1/orders/{orderId}/delivery-status

更新配送状态

> Body 请求参数

```json
{
  "deliveryStatus": 1,
  "deliveryNo": "SF1234567890"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|orderId|path|integer| 是 |none|
|merchantId|query|integer| 是 |none|
|body|body|[OpenApiOrderDeliveryStatusReqVO](#schemaopenapiorderdeliverystatusreqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

## POST 确认预约订单

POST /v1/orders/{orderId}/confirm-booking

确认预约订单

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|orderId|path|integer| 是 |none|
|merchantId|query|integer| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

## POST 变更预约订单

POST /v1/orders/{orderId}/change-booking

变更预约订单

> Body 请求参数

```json
{
  "changeRemark": "string"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|orderId|path|integer| 是 |none|
|merchantId|query|integer| 是 |none|
|body|body|[OpenApiOrderChangeBookingReqVO](#schemaopenapiorderchangebookingreqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

# 开放平台 - 提现

## POST 绑定提现账户

POST /withdraw/account/bind

绑定提现账户

> Body 请求参数

```json
{
  "externalUserId": "user_10001",
  "accountType": 1,
  "accountName": "张三",
  "cardNo": "6222000012345678",
  "bankName": "中国银行",
  "bankBranch": "深圳南山支行",
  "wechatOpenid": "oUpF8uMuAJO_M2pxb1Q9zNjWeS6o",
  "alipayAccount": "zhangsan@alipay.com"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[OpenApiWithdrawAccountBindReqVO](#schemaopenapiwithdrawaccountbindreqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": 0
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultLong](#schemacommonresultlong)|

## DELETE 解绑提现账户

DELETE /withdraw/account/unbind

解绑提现账户

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|accountId|query|integer| 是 |账户ID|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

## GET 查询用户提现账户列表

GET /withdraw/account/list

查询用户提现账户列表

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|externalUserId|query|string| 是 |App端用户标识|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": [
    {
      "id": 0,
      "accountType": 0,
      "accountName": "",
      "cardNo": "",
      "bankName": "",
      "wechatOpenid": "",
      "alipayAccount": "",
      "isDefault": false,
      "createTime": ""
    }
  ]
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultListOpenApiWithdrawAccountRespVO](#schemacommonresultlistopenapiwithdrawaccountrespvo)|

## POST 创建提现

POST /withdraw/create

创建提现

> Body 请求参数

```json
{
  "externalUserId": "user_10001",
  "merchantWithdrawNo": "WD202603170001",
  "amount": 10000,
  "subject": "用户提现",
  "withdrawAccountId": 1024,
  "accountType": 3,
  "accountName": "张三",
  "cardNo": "6222000012345678",
  "bankName": "中国银行",
  "wechatOpenid": "oUpF8uMuAJO_M2pxb1Q9zNjWeS6o",
  "alipayAccount": "zhangsan@alipay.com"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[OpenApiWithdrawCreateReqVO](#schemaopenapiwithdrawcreatereqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "merchantWithdrawNo": "",
    "externalUserId": "",
    "amount": 0,
    "status": 0,
    "failReason": "",
    "transferTime": "",
    "createTime": ""
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultOpenApiWithdrawRespVO](#schemacommonresultopenapiwithdrawrespvo)|

## GET 查询提现状态

GET /withdraw/get

查询提现状态

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|merchantWithdrawNo|query|string| 是 |商户提现单号|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "merchantWithdrawNo": "",
    "externalUserId": "",
    "amount": 0,
    "status": 0,
    "failReason": "",
    "transferTime": "",
    "createTime": ""
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultOpenApiWithdrawRespVO](#schemacommonresultopenapiwithdrawrespvo)|

# 开放平台 - 支付（收银台）

## POST 创建收银台会话

POST /v1/payment/cashier/create

创建收银台会话

> Body 请求参数

```json
{
  "merchantId": 123456,
  "outTradeNo": "ORDER001",
  "totalAmount": 10000,
  "subject": "服务支付",
  "body": "订单描述",
  "returnUrl": "https://app.example.com/result",
  "expireMinutes": 30,
  "attach": "自定义数据"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[OpenApiCashierCreateReqVO](#schemaopenapicashiercreatereqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "tradeNo": "",
    "cashierUrl": ""
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultOpenApiCashierCreateRespVO](#schemacommonresultopenapicashiercreaterespvo)|

## GET 查询支付结果

GET /v1/payment/query

查询支付结果

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|tradeNo|query|integer| 是 |平台交易号|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "tradeNo": "",
    "outTradeNo": "",
    "tradeStatus": "",
    "totalAmount": 0,
    "payTime": "",
    "attach": ""
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultOpenApiPaymentQueryRespVO](#schemacommonresultopenapipaymentqueryrespvo)|

# 开放平台 - 支付宝授权绑定

## GET 获取支付宝授权配置

GET /alipay-auth/config

获取支付宝授权配置

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "alipayAppId": ""
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultOpenApiAlipayAuthConfigRespVO](#schemacommonresultopenapialipayauthconfigrespvo)|

## POST 通过授权码绑定支付宝账号

POST /alipay-auth/bind

通过授权码绑定支付宝账号

> Body 请求参数

```json
{
  "externalUserId": "user_10001",
  "authCode": "1234567890abcdef"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[OpenApiAlipayBindReqVO](#schemaopenapialipaybindreqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "bound": false,
    "alipayUserId": "",
    "alipayAccount": "",
    "nickName": "",
    "avatar": ""
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultOpenApiAlipayBindingRespVO](#schemacommonresultopenapialipaybindingrespvo)|

## GET 查询用户支付宝绑定状态

GET /alipay-auth/binding

查询用户支付宝绑定状态

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|externalUserId|query|string| 是 |App端用户标识|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "bound": false,
    "alipayUserId": "",
    "alipayAccount": "",
    "nickName": "",
    "avatar": ""
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultOpenApiAlipayBindingRespVO](#schemacommonresultopenapialipaybindingrespvo)|

## POST 解绑支付宝账号

POST /alipay-auth/unbind

解绑支付宝账号

> Body 请求参数

```json
{
  "externalUserId": "user_10001"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[OpenApiAlipayUnbindReqVO](#schemaopenapialipayunbindreqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

# 开放平台 - 抵金券

## POST 购买抵金券

POST /v1/cash-voucher/acquire

购买抵金券

> Body 请求参数

```json
{
  "merchantId": 0,
  "sourceType": 1,
  "memberCardNo": "MC20240001",
  "deductPhone": "13800138000",
  "amount": 1,
  "discountRate": 90,
  "externalUserId": "ext_user_001",
  "bizNo": "cv_order_001",
  "storeId": 1
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[OpenApiCashVoucherAcquireReqVO](#schemaopenapicashvoucheracquirereqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "resultType": "",
    "id": 0
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultOpenApiCashVoucherAcquireRespVO](#schemacommonresultopenapicashvoucheracquirerespvo)|

## POST 创建抵金券购买收银台

POST /v1/cash-voucher/purchases/{purchaseId}/cashier

创建抵金券购买收银台

> Body 请求参数

```json
{
  "returnUrl": "string",
  "expireMinutes": 1
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|purchaseId|path|integer| 是 |none|
|body|body|[OpenApiCashVoucherPurchaseCashierReqVO](#schemaopenapicashvoucherpurchasecashierreqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "tradeNo": "",
    "cashierUrl": ""
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultCashVoucherPurchaseCashierRespDTO](#schemacommonresultcashvoucherpurchasecashierrespdto)|

## GET 查询抵金券购买单

GET /v1/cash-voucher/purchases/{purchaseId}

查询抵金券购买单

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|purchaseId|path|integer| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "purchaseId": 0,
    "sourceType": 0,
    "amount": 0,
    "payableAmount": 0,
    "status": 0,
    "statusName": "",
    "nextAction": "",
    "payOrderId": 0,
    "voucherId": 0,
    "memberCardNo": "",
    "deductPhone": "",
    "deductMemberCardNo": "",
    "payeeBizType": 0,
    "payeeBizId": 0,
    "storeId": 0
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultCashVoucherPurchaseDetailRespDTO](#schemacommonresultcashvoucherpurchasedetailrespdto)|

## GET 查询抵金券购买折扣配置

GET /v1/cash-voucher/purchase-discount-config

查询抵金券购买折扣配置

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|merchantId|query|integer| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "enabled": false,
    "tiers": [
      {
        "reachAmount": 0,
        "discountRate": 0
      }
    ]
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultOpenApiCashVoucherPurchaseDiscountConfigRespVO](#schemacommonresultopenapicashvoucherpurchasediscountconfigrespvo)|

## POST 申请抵金券退款

POST /v1/cash-voucher/refund

申请抵金券退款

> Body 请求参数

```json
{
  "voucherId": 1,
  "appUserId": 1,
  "externalUserId": "ext_user_001"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[OpenApiCashVoucherRefundReqVO](#schemaopenapicashvoucherrefundreqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

## POST 生成抵金券核销二维码

POST /v1/cash-voucher/{voucherId}/write-off-qrcode

生成抵金券核销二维码

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|voucherId|path|integer| 是 |none|
|merchantId|query|integer| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "requestNo": "",
    "qrToken": "",
    "qrTimestamp": 0,
    "qrExpireTime": "",
    "resourceType": 0,
    "resourceId": 0,
    "resourceCardNo": ""
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultOpenWriteOffQrRespDTO](#schemacommonresultopenwriteoffqrrespdto)|

## POST 赠送抵金券

POST /v1/cash-voucher/gift

赠送抵金券

> Body 请求参数

```json
{
  "phone": "13800138000",
  "merchantId": 1,
  "amount": 1000,
  "validityDays": 30,
  "bizNo": "gift_biz_001"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[OpenApiCashVoucherGiftReqVO](#schemaopenapicashvouchergiftreqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "voucherId": 0,
    "voucherNo": ""
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultOpenApiCashVoucherGiftRespVO](#schemacommonresultopenapicashvouchergiftrespvo)|

## POST 撤回赠送的抵金券

POST /v1/cash-voucher/revoke-gift

撤回赠送的抵金券

> Body 请求参数

```json
{
  "voucherId": 100
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[OpenApiCashVoucherRevokeGiftReqVO](#schemaopenapicashvoucherrevokegiftreqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

## GET 查询抵金券核销记录

GET /v1/cash-voucher/write-off-records/{requestNo}

查询抵金券核销记录

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|requestNo|path|string| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "id": 0,
    "requestNo": "",
    "appId": 0,
    "merchantId": 0,
    "storeId": 0,
    "resourceType": 0,
    "resourceId": 0,
    "resourceCardNo": "",
    "status": 0,
    "qrToken": "",
    "qrTimestamp": 0,
    "qrExpireTime": "",
    "amount": 0,
    "shortfallAmount": 0,
    "times": 0,
    "packageItemName": "",
    "operatorId": 0,
    "remark": "",
    "callbackStatus": 0,
    "resultPayload": "",
    "confirmTime": "",
    "completeTime": "",
    "cancelTime": ""
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultOpenWriteOffRecordRespDTO](#schemacommonresultopenwriteoffrecordrespdto)|

# 开放平台 - 风控模型产品

## GET 获取可调用的平台风控模型产品列表

GET /v1/risk-model-products

获取可调用的平台风控模型产品列表

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": [
    {
      "id": 0,
      "productCode": "",
      "name": "",
      "description": "",
      "coverUrl": "",
      "flowId": "",
      "callPrice": 0,
      "outputDesc": "",
      "applicableScenes": "",
      "publishedCompileVersion": 0,
      "published": false
    }
  ]
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultListRiskModelProductRespDTO](#schemacommonresultlistriskmodelproductrespdto)|

## POST 执行平台风控模型产品

POST /v1/risk-model-products/{productId}/execute

执行平台风控模型产品

> Body 请求参数

```json
{
  "merchantId": 1,
  "appUserId": 1001,
  "externalUserId": "user_001",
  "creditAmount": 50000,
  "input": {
    "key": {}
  },
  "timeout": 5000
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|productId|path|integer| 是 |none|
|body|body|[OpenApiRiskModelExecuteReqVO](#schemaopenapiriskmodelexecutereqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "executionId": "",
    "compileVersion": 0,
    "score": 0,
    "specialResult": 0,
    "output": {
      "": {}
    },
    "cost": 0,
    "duration": 0,
    "success": false,
    "errorMessage": ""
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultRiskModelProductExecuteRespDTO](#schemacommonresultriskmodelproductexecuterespdto)|

# 管理后台 - 开放平台-开发者账号

## POST 创建开放平台-开发者账号

POST /open/developer/create

创建开放平台-开发者账号

> Body 请求参数

```json
{
  "id": 25357,
  "phone": "string",
  "developerName": "沐沐",
  "developerType": 1,
  "contactEmail": "string",
  "avatarUrl": "https://top.morplcp.cn",
  "authStatus": 1,
  "authLevel": 0,
  "maxAppCount": 17945,
  "status": 1,
  "lastLoginTime": "string",
  "lastLoginIp": "string"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[DeveloperSaveReqVO](#schemadevelopersavereqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": 0
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultLong](#schemacommonresultlong)|

## PUT 更新开放平台-开发者账号

PUT /open/developer/update

更新开放平台-开发者账号

> Body 请求参数

```json
{
  "id": 25357,
  "phone": "string",
  "developerName": "沐沐",
  "developerType": 1,
  "contactEmail": "string",
  "avatarUrl": "https://top.morplcp.cn",
  "authStatus": 1,
  "authLevel": 0,
  "maxAppCount": 17945,
  "status": 1,
  "lastLoginTime": "string",
  "lastLoginIp": "string"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[DeveloperSaveReqVO](#schemadevelopersavereqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

## DELETE 删除开放平台-开发者账号

DELETE /open/developer/delete

删除开放平台-开发者账号

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|query|integer| 是 |编号|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

## DELETE 批量删除开放平台-开发者账号

DELETE /open/developer/delete-list

批量删除开放平台-开发者账号

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|ids|query|array[integer]| 是 |编号|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

## GET 获得开放平台-开发者账号

GET /open/developer/get

获得开放平台-开发者账号

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|query|integer| 是 |编号|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "id": 0,
    "phone": "",
    "developerName": "",
    "developerType": 0,
    "contactEmail": "",
    "avatarUrl": "",
    "authStatus": 0,
    "authLevel": 0,
    "maxAppCount": 0,
    "status": 0,
    "lastLoginTime": "",
    "lastLoginIp": "",
    "createTime": ""
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultDeveloperRespVO](#schemacommonresultdeveloperrespvo)|

## GET 获得开放平台-开发者账号分页

GET /open/developer/page

获得开放平台-开发者账号分页

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|pageNo|query|integer| 是 |页码，从 1 开始|
|pageSize|query|integer| 是 |每页条数，最大值为 100|
|phone|query|string| 否 |手机号(登录账号)|
|developerName|query|string| 否 |开发者名称(个人姓名/企业名称)|
|developerType|query|integer| 否 |开发者类型：0-个人 1-企业|
|contactEmail|query|string| 否 |联系邮箱|
|avatarUrl|query|string| 否 |头像|
|authStatus|query|integer| 否 |认证状态：0-未认证 1-认证中 2-已认证 3-认证失败|
|authLevel|query|integer| 否 |认证等级：0-未认证 1-个人认证(L1) 2-企业认证(L2)|
|maxAppCount|query|integer| 否 |最大可创建App数量|
|status|query|integer| 否 |状态：0-正常 1-冻结 2-注销|
|lastLoginTime|query|array[string]| 否 |最后登录时间|
|lastLoginIp|query|string| 否 |最后登录IP|
|createTime|query|array[string]| 否 |创建时间|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "total": 0,
    "list": [
      {
        "id": 0,
        "phone": "",
        "developerName": "",
        "developerType": 0,
        "contactEmail": "",
        "avatarUrl": "",
        "authStatus": 0,
        "authLevel": 0,
        "maxAppCount": 0,
        "status": 0,
        "lastLoginTime": "",
        "lastLoginIp": "",
        "createTime": ""
      }
    ]
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultPageResultDeveloperRespVO](#schemacommonresultpageresultdeveloperrespvo)|

## GET 导出开放平台-开发者账号 Excel

GET /open/developer/export-excel

导出开放平台-开发者账号 Excel

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|pageNo|query|integer| 是 |页码，从 1 开始|
|pageSize|query|integer| 是 |每页条数，最大值为 100|
|phone|query|string| 否 |手机号(登录账号)|
|developerName|query|string| 否 |开发者名称(个人姓名/企业名称)|
|developerType|query|integer| 否 |开发者类型：0-个人 1-企业|
|contactEmail|query|string| 否 |联系邮箱|
|avatarUrl|query|string| 否 |头像|
|authStatus|query|integer| 否 |认证状态：0-未认证 1-认证中 2-已认证 3-认证失败|
|authLevel|query|integer| 否 |认证等级：0-未认证 1-个人认证(L1) 2-企业认证(L2)|
|maxAppCount|query|integer| 否 |最大可创建App数量|
|status|query|integer| 否 |状态：0-正常 1-冻结 2-注销|
|lastLoginTime|query|array[string]| 否 |最后登录时间|
|lastLoginIp|query|string| 否 |最后登录IP|
|createTime|query|array[string]| 否 |创建时间|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

# 管理后台 - 开放平台-接入方应用

## POST 创建开放平台-接入方应用

POST /open/app/create

创建开放平台-接入方应用

> Body 请求参数

```json
{
  "id": 21955,
  "developerId": 4789,
  "appName": "李四",
  "appType": 1,
  "appDesc": "string",
  "appLogo": "string",
  "appKey": "string",
  "appSecret": "string",
  "contactName": "李四",
  "contactPhone": "string",
  "callbackUrl": "https://top.morplcp.cn",
  "callbackSecret": "string",
  "ipWhitelist": "string",
  "rateLimitQps": 0,
  "environment": 0,
  "status": 2
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[AppSaveReqVO](#schemaappsavereqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": 0
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultLong](#schemacommonresultlong)|

## PUT 更新开放平台-接入方应用

PUT /open/app/update

更新开放平台-接入方应用

> Body 请求参数

```json
{
  "id": 21955,
  "developerId": 4789,
  "appName": "李四",
  "appType": 1,
  "appDesc": "string",
  "appLogo": "string",
  "appKey": "string",
  "appSecret": "string",
  "contactName": "李四",
  "contactPhone": "string",
  "callbackUrl": "https://top.morplcp.cn",
  "callbackSecret": "string",
  "ipWhitelist": "string",
  "rateLimitQps": 0,
  "environment": 0,
  "status": 2
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[AppSaveReqVO](#schemaappsavereqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

## DELETE 删除开放平台-接入方应用

DELETE /open/app/delete

删除开放平台-接入方应用

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|query|integer| 是 |编号|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

## DELETE 批量删除开放平台-接入方应用

DELETE /open/app/delete-list

批量删除开放平台-接入方应用

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|ids|query|array[integer]| 是 |编号|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

## GET 获得开放平台-接入方应用

GET /open/app/get

获得开放平台-接入方应用

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|query|integer| 是 |编号|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "id": 0,
    "developerId": 0,
    "appName": "",
    "appType": 0,
    "appDesc": "",
    "appLogo": "",
    "appKey": "",
    "appSecret": "",
    "contactName": "",
    "contactPhone": "",
    "callbackUrl": "",
    "callbackSecret": "",
    "ipWhitelist": "",
    "rateLimitQps": 0,
    "environment": 0,
    "status": 0,
    "createTime": ""
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultAppRespVO](#schemacommonresultapprespvo)|

## GET 获得开放平台-接入方应用分页

GET /open/app/page

获得开放平台-接入方应用分页

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|pageNo|query|integer| 是 |页码，从 1 开始|
|pageSize|query|integer| 是 |每页条数，最大值为 100|
|developerId|query|integer(int64)| 否 |所属开发者ID|
|appName|query|string| 否 |应用名称|
|appType|query|integer| 否 |应用类型：0-生活服务 1-电商 2-社交 3-工具 4-其他|
|appDesc|query|string| 否 |应用简介|
|appLogo|query|string| 否 |应用Logo|
|appKey|query|string| 否 |AppKey|
|appSecret|query|string| 否 |AppSecret(加密存储)|
|contactName|query|string| 否 |联系人|
|contactPhone|query|string| 否 |联系电话|
|callbackUrl|query|string| 否 |回调地址|
|callbackSecret|query|string| 否 |回调签名密钥|
|ipWhitelist|query|string| 否 |IP白名单(逗号分隔)|
|rateLimitQps|query|integer| 否 |限流QPS|
|environment|query|integer| 否 |环境：0-沙箱 1-生产|
|status|query|integer| 否 |状态：0-正常 1-禁用|
|createTime|query|array[string]| 否 |创建时间|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "total": 0,
    "list": [
      {
        "id": 0,
        "developerId": 0,
        "appName": "",
        "appType": 0,
        "appDesc": "",
        "appLogo": "",
        "appKey": "",
        "appSecret": "",
        "contactName": "",
        "contactPhone": "",
        "callbackUrl": "",
        "callbackSecret": "",
        "ipWhitelist": "",
        "rateLimitQps": 0,
        "environment": 0,
        "status": 0,
        "createTime": ""
      }
    ]
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultPageResultAppRespVO](#schemacommonresultpageresultapprespvo)|

## GET 导出开放平台-接入方应用 Excel

GET /open/app/export-excel

导出开放平台-接入方应用 Excel

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|pageNo|query|integer| 是 |页码，从 1 开始|
|pageSize|query|integer| 是 |每页条数，最大值为 100|
|developerId|query|integer(int64)| 否 |所属开发者ID|
|appName|query|string| 否 |应用名称|
|appType|query|integer| 否 |应用类型：0-生活服务 1-电商 2-社交 3-工具 4-其他|
|appDesc|query|string| 否 |应用简介|
|appLogo|query|string| 否 |应用Logo|
|appKey|query|string| 否 |AppKey|
|appSecret|query|string| 否 |AppSecret(加密存储)|
|contactName|query|string| 否 |联系人|
|contactPhone|query|string| 否 |联系电话|
|callbackUrl|query|string| 否 |回调地址|
|callbackSecret|query|string| 否 |回调签名密钥|
|ipWhitelist|query|string| 否 |IP白名单(逗号分隔)|
|rateLimitQps|query|integer| 否 |限流QPS|
|environment|query|integer| 否 |环境：0-沙箱 1-生产|
|status|query|integer| 否 |状态：0-正常 1-禁用|
|createTime|query|array[string]| 否 |创建时间|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

# 管理后台 - 开放平台-App用户映射

## POST 创建开放平台-App用户映射

POST /open/app-user/create

创建开放平台-App用户映射

> Body 请求参数

```json
{
  "id": 17299,
  "appId": 11183,
  "externalUserId": "27843",
  "phone": "string",
  "nickname": "赵六",
  "avatarUrl": "https://top.morplcp.cn",
  "authId": 23151
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[AppUserSaveReqVO](#schemaappusersavereqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": 0
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultLong](#schemacommonresultlong)|

## PUT 更新开放平台-App用户映射

PUT /open/app-user/update

更新开放平台-App用户映射

> Body 请求参数

```json
{
  "id": 17299,
  "appId": 11183,
  "externalUserId": "27843",
  "phone": "string",
  "nickname": "赵六",
  "avatarUrl": "https://top.morplcp.cn",
  "authId": 23151
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[AppUserSaveReqVO](#schemaappusersavereqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

## DELETE 删除开放平台-App用户映射

DELETE /open/app-user/delete

删除开放平台-App用户映射

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|query|integer| 是 |编号|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

## DELETE 批量删除开放平台-App用户映射

DELETE /open/app-user/delete-list

批量删除开放平台-App用户映射

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|ids|query|array[integer]| 是 |编号|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

## GET 获得开放平台-App用户映射

GET /open/app-user/get

获得开放平台-App用户映射

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|query|integer| 是 |编号|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "id": 0,
    "appId": 0,
    "externalUserId": "",
    "phone": "",
    "nickname": "",
    "avatarUrl": "",
    "authId": 0,
    "createTime": ""
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultAppUserRespVO](#schemacommonresultappuserrespvo)|

## GET 获得开放平台-App用户映射分页

GET /open/app-user/page

获得开放平台-App用户映射分页

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|pageNo|query|integer| 是 |页码，从 1 开始|
|pageSize|query|integer| 是 |每页条数，最大值为 100|
|appId|query|integer(int64)| 否 |所属App|
|externalUserId|query|string| 否 |App端的用户标识|
|phone|query|string| 否 |手机号(可选，用于跨场景查找如分享抵金券)|
|nickname|query|string| 否 |昵称|
|avatarUrl|query|string| 否 |头像|
|authId|query|integer(int64)| 否 |实名认证记录ID(open_real_name_auth.id)|
|createTime|query|array[string]| 否 |创建时间|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "total": 0,
    "list": [
      {
        "id": 0,
        "appId": 0,
        "externalUserId": "",
        "phone": "",
        "nickname": "",
        "avatarUrl": "",
        "authId": 0,
        "createTime": ""
      }
    ]
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultPageResultAppUserRespVO](#schemacommonresultpageresultappuserrespvo)|

## GET 导出开放平台-App用户映射 Excel

GET /open/app-user/export-excel

导出开放平台-App用户映射 Excel

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|pageNo|query|integer| 是 |页码，从 1 开始|
|pageSize|query|integer| 是 |每页条数，最大值为 100|
|appId|query|integer(int64)| 否 |所属App|
|externalUserId|query|string| 否 |App端的用户标识|
|phone|query|string| 否 |手机号(可选，用于跨场景查找如分享抵金券)|
|nickname|query|string| 否 |昵称|
|avatarUrl|query|string| 否 |头像|
|authId|query|integer(int64)| 否 |实名认证记录ID(open_real_name_auth.id)|
|createTime|query|array[string]| 否 |创建时间|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

# 管理后台 - 开放平台-开发者消息通知

## POST 创建开放平台-开发者消息通知

POST /open/developer-message/create

创建开放平台-开发者消息通知

> Body 请求参数

```json
{
  "id": 20344,
  "developerId": 22208,
  "appId": 511,
  "msgType": 2,
  "title": "string",
  "content": "string",
  "isRead": true,
  "readTime": "string"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[DeveloperMessageSaveReqVO](#schemadevelopermessagesavereqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": 0
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultLong](#schemacommonresultlong)|

## PUT 更新开放平台-开发者消息通知

PUT /open/developer-message/update

更新开放平台-开发者消息通知

> Body 请求参数

```json
{
  "id": 20344,
  "developerId": 22208,
  "appId": 511,
  "msgType": 2,
  "title": "string",
  "content": "string",
  "isRead": true,
  "readTime": "string"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[DeveloperMessageSaveReqVO](#schemadevelopermessagesavereqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

## DELETE 删除开放平台-开发者消息通知

DELETE /open/developer-message/delete

删除开放平台-开发者消息通知

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|query|integer| 是 |编号|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

## DELETE 批量删除开放平台-开发者消息通知

DELETE /open/developer-message/delete-list

批量删除开放平台-开发者消息通知

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|ids|query|array[integer]| 是 |编号|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

## GET 获得开放平台-开发者消息通知

GET /open/developer-message/get

获得开放平台-开发者消息通知

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|query|integer| 是 |编号|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "id": 0,
    "developerId": 0,
    "appId": 0,
    "msgType": 0,
    "title": "",
    "content": "",
    "isRead": false,
    "readTime": "",
    "createTime": ""
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultDeveloperMessageRespVO](#schemacommonresultdevelopermessagerespvo)|

## GET 获得开放平台-开发者消息通知分页

GET /open/developer-message/page

获得开放平台-开发者消息通知分页

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|pageNo|query|integer| 是 |页码，从 1 开始|
|pageSize|query|integer| 是 |每页条数，最大值为 100|
|developerId|query|integer(int64)| 否 |开发者ID|
|appId|query|integer(int64)| 否 |关联App ID(可选)|
|msgType|query|integer| 否 |消息类型：0-系统通知 1-审核通知 2-权限变更 3-异常告警 4-平台公告|
|title|query|string| 否 |消息标题|
|content|query|string| 否 |消息内容|
|isRead|query|boolean| 否 |是否已读|
|readTime|query|array[string]| 否 |阅读时间|
|createTime|query|array[string]| 否 |创建时间|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "total": 0,
    "list": [
      {
        "id": 0,
        "developerId": 0,
        "appId": 0,
        "msgType": 0,
        "title": "",
        "content": "",
        "isRead": false,
        "readTime": "",
        "createTime": ""
      }
    ]
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultPageResultDeveloperMessageRespVO](#schemacommonresultpageresultdevelopermessagerespvo)|

## GET 导出开放平台-开发者消息通知 Excel

GET /open/developer-message/export-excel

导出开放平台-开发者消息通知 Excel

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|pageNo|query|integer| 是 |页码，从 1 开始|
|pageSize|query|integer| 是 |每页条数，最大值为 100|
|developerId|query|integer(int64)| 否 |开发者ID|
|appId|query|integer(int64)| 否 |关联App ID(可选)|
|msgType|query|integer| 否 |消息类型：0-系统通知 1-审核通知 2-权限变更 3-异常告警 4-平台公告|
|title|query|string| 否 |消息标题|
|content|query|string| 否 |消息内容|
|isRead|query|boolean| 否 |是否已读|
|readTime|query|array[string]| 否 |阅读时间|
|createTime|query|array[string]| 否 |创建时间|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

# 管理后台 - 开放平台-App 事件订阅

## POST 创建开放平台-App 事件订阅

POST /open/app-event-subscription/create

创建开放平台-App 事件订阅

> Body 请求参数

```json
{
  "id": 1,
  "appId": 10001,
  "eventCode": "member_card.purchase.paid",
  "enabled": true,
  "callbackUrlOverride": "https://partner.example.com/open/event",
  "callbackSecretOverride": "string",
  "version": "1.0"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[AppEventSubscriptionSaveReqVO](#schemaappeventsubscriptionsavereqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": 0
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultLong](#schemacommonresultlong)|

## PUT 更新开放平台-App 事件订阅

PUT /open/app-event-subscription/update

更新开放平台-App 事件订阅

> Body 请求参数

```json
{
  "id": 1,
  "appId": 10001,
  "eventCode": "member_card.purchase.paid",
  "enabled": true,
  "callbackUrlOverride": "https://partner.example.com/open/event",
  "callbackSecretOverride": "string",
  "version": "1.0"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[AppEventSubscriptionSaveReqVO](#schemaappeventsubscriptionsavereqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

## DELETE 删除开放平台-App 事件订阅

DELETE /open/app-event-subscription/delete

删除开放平台-App 事件订阅

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|query|integer| 是 |编号|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

## DELETE 批量删除开放平台-App 事件订阅

DELETE /open/app-event-subscription/delete-list

批量删除开放平台-App 事件订阅

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|ids|query|array[integer]| 是 |编号|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

## GET 获得开放平台-App 事件订阅

GET /open/app-event-subscription/get

获得开放平台-App 事件订阅

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|query|integer| 是 |编号|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "id": 0,
    "appId": 0,
    "eventCode": "",
    "enabled": false,
    "callbackUrlOverride": "",
    "callbackSecretOverride": "",
    "version": "",
    "createTime": ""
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultAppEventSubscriptionRespVO](#schemacommonresultappeventsubscriptionrespvo)|

## GET 获得开放平台-App 事件订阅分页

GET /open/app-event-subscription/page

获得开放平台-App 事件订阅分页

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|pageNo|query|integer| 是 |页码，从 1 开始|
|pageSize|query|integer| 是 |每页条数，最大值为 100|
|appId|query|integer(int64)| 否 |App ID|
|eventCode|query|string| 否 |事件编码|
|enabled|query|boolean| 否 |是否启用|
|callbackUrlOverride|query|string| 否 |覆盖回调地址|
|version|query|string| 否 |事件版本|
|createTime|query|array[string]| 否 |创建时间|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "total": 0,
    "list": [
      {
        "id": 0,
        "appId": 0,
        "eventCode": "",
        "enabled": false,
        "callbackUrlOverride": "",
        "callbackSecretOverride": "",
        "version": "",
        "createTime": ""
      }
    ]
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultPageResultAppEventSubscriptionRespVO](#schemacommonresultpageresultappeventsubscriptionrespvo)|

## GET 导出开放平台-App 事件订阅 Excel

GET /open/app-event-subscription/export-excel

导出开放平台-App 事件订阅 Excel

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|pageNo|query|integer| 是 |页码，从 1 开始|
|pageSize|query|integer| 是 |每页条数，最大值为 100|
|appId|query|integer(int64)| 否 |App ID|
|eventCode|query|string| 否 |事件编码|
|enabled|query|boolean| 否 |是否启用|
|callbackUrlOverride|query|string| 否 |覆盖回调地址|
|version|query|string| 否 |事件版本|
|createTime|query|array[string]| 否 |创建时间|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

# 管理后台 - 开放平台-开发者账户

## POST 创建开放平台-开发者账户

POST /open/developer-account/create

创建开放平台-开发者账户

> Body 请求参数

```json
{
  "id": 27202,
  "developerId": 5344,
  "balance": 0,
  "frozenAmount": 0,
  "totalRecharge": 0,
  "totalGift": 0,
  "totalExpense": 0,
  "totalRefund": 0,
  "creditLimit": 0,
  "warningThreshold": 0,
  "status": 1
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[DeveloperAccountSaveReqVO](#schemadeveloperaccountsavereqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": 0
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultLong](#schemacommonresultlong)|

## PUT 更新开放平台-开发者账户

PUT /open/developer-account/update

更新开放平台-开发者账户

> Body 请求参数

```json
{
  "id": 27202,
  "developerId": 5344,
  "balance": 0,
  "frozenAmount": 0,
  "totalRecharge": 0,
  "totalGift": 0,
  "totalExpense": 0,
  "totalRefund": 0,
  "creditLimit": 0,
  "warningThreshold": 0,
  "status": 1
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[DeveloperAccountSaveReqVO](#schemadeveloperaccountsavereqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

## DELETE 删除开放平台-开发者账户

DELETE /open/developer-account/delete

删除开放平台-开发者账户

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|query|integer| 是 |编号|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

## DELETE 批量删除开放平台-开发者账户

DELETE /open/developer-account/delete-list

批量删除开放平台-开发者账户

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|ids|query|array[integer]| 是 |编号|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

## GET 获得开放平台-开发者账户

GET /open/developer-account/get

获得开放平台-开发者账户

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|query|integer| 是 |编号|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "id": 0,
    "developerId": 0,
    "balance": 0,
    "frozenAmount": 0,
    "totalRecharge": 0,
    "totalGift": 0,
    "totalExpense": 0,
    "totalRefund": 0,
    "creditLimit": 0,
    "warningThreshold": 0,
    "status": 0,
    "createTime": ""
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultDeveloperAccountRespVO](#schemacommonresultdeveloperaccountrespvo)|

## GET 获得开放平台-开发者账户分页

GET /open/developer-account/page

获得开放平台-开发者账户分页

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|pageNo|query|integer| 是 |页码，从 1 开始|
|pageSize|query|integer| 是 |每页条数，最大值为 100|
|developerId|query|integer(int64)| 否 |开发者ID|
|balance|query|integer| 否 |可用余额(分)|
|frozenAmount|query|integer| 否 |冻结金额(分)，预扣费或提现中的金额|
|totalRecharge|query|integer| 否 |累计充值(分)|
|totalGift|query|integer| 否 |累计赠送(分)|
|totalExpense|query|integer| 否 |累计消费(分)|
|totalRefund|query|integer| 否 |累计退款(分)|
|creditLimit|query|integer| 否 |信用额度(分)，允许余额为负的阈值|
|warningThreshold|query|integer| 否 |余额预警阈值(分)，低于此值发送提醒|
|status|query|integer| 否 |账户状态：0-正常 1-冻结 2-欠费停用|
|createTime|query|array[string]| 否 |创建时间|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "total": 0,
    "list": [
      {
        "id": 0,
        "developerId": 0,
        "balance": 0,
        "frozenAmount": 0,
        "totalRecharge": 0,
        "totalGift": 0,
        "totalExpense": 0,
        "totalRefund": 0,
        "creditLimit": 0,
        "warningThreshold": 0,
        "status": 0,
        "createTime": ""
      }
    ]
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultPageResultDeveloperAccountRespVO](#schemacommonresultpageresultdeveloperaccountrespvo)|

## GET 导出开放平台-开发者账户 Excel

GET /open/developer-account/export-excel

导出开放平台-开发者账户 Excel

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|pageNo|query|integer| 是 |页码，从 1 开始|
|pageSize|query|integer| 是 |每页条数，最大值为 100|
|developerId|query|integer(int64)| 否 |开发者ID|
|balance|query|integer| 否 |可用余额(分)|
|frozenAmount|query|integer| 否 |冻结金额(分)，预扣费或提现中的金额|
|totalRecharge|query|integer| 否 |累计充值(分)|
|totalGift|query|integer| 否 |累计赠送(分)|
|totalExpense|query|integer| 否 |累计消费(分)|
|totalRefund|query|integer| 否 |累计退款(分)|
|creditLimit|query|integer| 否 |信用额度(分)，允许余额为负的阈值|
|warningThreshold|query|integer| 否 |余额预警阈值(分)，低于此值发送提醒|
|status|query|integer| 否 |账户状态：0-正常 1-冻结 2-欠费停用|
|createTime|query|array[string]| 否 |创建时间|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

# 管理后台 - 开放平台-App API权限

## POST 创建开放平台-App API权限

POST /open/app-permission/create

创建开放平台-App API权限

> Body 请求参数

```json
{
  "id": 15358,
  "appId": 2844,
  "apiModule": "string",
  "permissionType": 1,
  "status": 2,
  "grantedTime": "string"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[AppPermissionSaveReqVO](#schemaapppermissionsavereqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": 0
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultLong](#schemacommonresultlong)|

## PUT 更新开放平台-App API权限

PUT /open/app-permission/update

更新开放平台-App API权限

> Body 请求参数

```json
{
  "id": 15358,
  "appId": 2844,
  "apiModule": "string",
  "permissionType": 1,
  "status": 2,
  "grantedTime": "string"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[AppPermissionSaveReqVO](#schemaapppermissionsavereqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

## DELETE 删除开放平台-App API权限

DELETE /open/app-permission/delete

删除开放平台-App API权限

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|query|integer| 是 |编号|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

## DELETE 批量删除开放平台-App API权限

DELETE /open/app-permission/delete-list

批量删除开放平台-App API权限

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|ids|query|array[integer]| 是 |编号|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

## GET 获得开放平台-App API权限

GET /open/app-permission/get

获得开放平台-App API权限

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|query|integer| 是 |编号|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "id": 0,
    "appId": 0,
    "apiModule": "",
    "permissionType": 0,
    "status": 0,
    "grantedTime": "",
    "createTime": ""
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultAppPermissionRespVO](#schemacommonresultapppermissionrespvo)|

## GET 获得开放平台-App API权限分页

GET /open/app-permission/page

获得开放平台-App API权限分页

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|pageNo|query|integer| 是 |页码，从 1 开始|
|pageSize|query|integer| 是 |每页条数，最大值为 100|
|appId|query|integer(int64)| 否 |App ID|
|apiModule|query|string| 否 |API模块：merchant/member_card/order/product/booking/coupon/customer/statistics|
|permissionType|query|integer| 否 |权限类型：0-只读 1-读写 2-完全|
|status|query|integer| 否 |状态：0-启用 1-禁用|
|grantedTime|query|array[string]| 否 |授权时间|
|createTime|query|array[string]| 否 |创建时间|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "total": 0,
    "list": [
      {
        "id": 0,
        "appId": 0,
        "apiModule": "",
        "permissionType": 0,
        "status": 0,
        "grantedTime": "",
        "createTime": ""
      }
    ]
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultPageResultAppPermissionRespVO](#schemacommonresultpageresultapppermissionrespvo)|

## GET 导出开放平台-App API权限 Excel

GET /open/app-permission/export-excel

导出开放平台-App API权限 Excel

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|pageNo|query|integer| 是 |页码，从 1 开始|
|pageSize|query|integer| 是 |每页条数，最大值为 100|
|appId|query|integer(int64)| 否 |App ID|
|apiModule|query|string| 否 |API模块：merchant/member_card/order/product/booking/coupon/customer/statistics|
|permissionType|query|integer| 否 |权限类型：0-只读 1-读写 2-完全|
|status|query|integer| 否 |状态：0-启用 1-禁用|
|grantedTime|query|array[string]| 否 |授权时间|
|createTime|query|array[string]| 否 |创建时间|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

# 管理后台 - 开放平台-开发者认证

## POST 创建开放平台-开发者认证

POST /open/developer-auth/create

创建开放平台-开发者认证

> Body 请求参数

```json
{
  "id": 10200,
  "developerId": 23391,
  "authType": 1,
  "realName": "沐沐",
  "idCardNumber": "string",
  "idCardFrontUrl": "https://top.morplcp.cn",
  "idCardBackUrl": "https://top.morplcp.cn",
  "companyName": "张三",
  "businessLicenseNo": "string",
  "businessLicenseUrl": "https://top.morplcp.cn",
  "legalPersonName": "李四",
  "legalPersonIdCard": "string",
  "bankAccountInfo": "string",
  "auditStatus": 2,
  "auditTime": "string",
  "auditorId": 31159,
  "auditRemark": "随便"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[DeveloperAuthSaveReqVO](#schemadeveloperauthsavereqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": 0
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultLong](#schemacommonresultlong)|

## PUT 更新开放平台-开发者认证

PUT /open/developer-auth/update

更新开放平台-开发者认证

> Body 请求参数

```json
{
  "id": 10200,
  "developerId": 23391,
  "authType": 1,
  "realName": "沐沐",
  "idCardNumber": "string",
  "idCardFrontUrl": "https://top.morplcp.cn",
  "idCardBackUrl": "https://top.morplcp.cn",
  "companyName": "张三",
  "businessLicenseNo": "string",
  "businessLicenseUrl": "https://top.morplcp.cn",
  "legalPersonName": "李四",
  "legalPersonIdCard": "string",
  "bankAccountInfo": "string",
  "auditStatus": 2,
  "auditTime": "string",
  "auditorId": 31159,
  "auditRemark": "随便"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[DeveloperAuthSaveReqVO](#schemadeveloperauthsavereqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

## DELETE 删除开放平台-开发者认证

DELETE /open/developer-auth/delete

删除开放平台-开发者认证

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|query|integer| 是 |编号|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

## DELETE 批量删除开放平台-开发者认证

DELETE /open/developer-auth/delete-list

批量删除开放平台-开发者认证

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|ids|query|array[integer]| 是 |编号|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

## GET 获得开放平台-开发者认证

GET /open/developer-auth/get

获得开放平台-开发者认证

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|query|integer| 是 |编号|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "id": 0,
    "developerId": 0,
    "authType": 0,
    "realName": "",
    "idCardNumber": "",
    "idCardFrontUrl": "",
    "idCardBackUrl": "",
    "companyName": "",
    "businessLicenseNo": "",
    "businessLicenseUrl": "",
    "legalPersonName": "",
    "legalPersonIdCard": "",
    "bankAccountInfo": "",
    "auditStatus": 0,
    "auditTime": "",
    "auditorId": 0,
    "auditRemark": "",
    "createTime": ""
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultDeveloperAuthRespVO](#schemacommonresultdeveloperauthrespvo)|

## GET 获得开放平台-开发者认证分页

GET /open/developer-auth/page

获得开放平台-开发者认证分页

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|pageNo|query|integer| 是 |页码，从 1 开始|
|pageSize|query|integer| 是 |每页条数，最大值为 100|
|developerId|query|integer(int64)| 否 |开发者ID|
|authType|query|integer| 否 |认证类型：0-个人认证 1-企业认证|
|realName|query|string| 否 |真实姓名|
|idCardNumber|query|string| 否 |身份证号(加密存储)|
|idCardFrontUrl|query|string| 否 |身份证正面照|
|idCardBackUrl|query|string| 否 |身份证反面照|
|companyName|query|string| 否 |企业名称|
|businessLicenseNo|query|string| 否 |营业执照号|
|businessLicenseUrl|query|string| 否 |营业执照照片|
|legalPersonName|query|string| 否 |法人姓名|
|legalPersonIdCard|query|string| 否 |法人身份证号(加密存储)|
|bankAccountInfo|query|string| 否 |对公账户信息(JSON，加密存储)|
|auditStatus|query|integer| 否 |审核状态：0-待审核 1-通过 2-拒绝|
|auditTime|query|array[string]| 否 |审核时间|
|auditorId|query|integer(int64)| 否 |审核人ID|
|auditRemark|query|string| 否 |审核备注|
|createTime|query|array[string]| 否 |创建时间|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "total": 0,
    "list": [
      {
        "id": 0,
        "developerId": 0,
        "authType": 0,
        "realName": "",
        "idCardNumber": "",
        "idCardFrontUrl": "",
        "idCardBackUrl": "",
        "companyName": "",
        "businessLicenseNo": "",
        "businessLicenseUrl": "",
        "legalPersonName": "",
        "legalPersonIdCard": "",
        "bankAccountInfo": "",
        "auditStatus": 0,
        "auditTime": "",
        "auditorId": 0,
        "auditRemark": "",
        "createTime": ""
      }
    ]
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultPageResultDeveloperAuthRespVO](#schemacommonresultpageresultdeveloperauthrespvo)|

## GET 导出开放平台-开发者认证 Excel

GET /open/developer-auth/export-excel

导出开放平台-开发者认证 Excel

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|pageNo|query|integer| 是 |页码，从 1 开始|
|pageSize|query|integer| 是 |每页条数，最大值为 100|
|developerId|query|integer(int64)| 否 |开发者ID|
|authType|query|integer| 否 |认证类型：0-个人认证 1-企业认证|
|realName|query|string| 否 |真实姓名|
|idCardNumber|query|string| 否 |身份证号(加密存储)|
|idCardFrontUrl|query|string| 否 |身份证正面照|
|idCardBackUrl|query|string| 否 |身份证反面照|
|companyName|query|string| 否 |企业名称|
|businessLicenseNo|query|string| 否 |营业执照号|
|businessLicenseUrl|query|string| 否 |营业执照照片|
|legalPersonName|query|string| 否 |法人姓名|
|legalPersonIdCard|query|string| 否 |法人身份证号(加密存储)|
|bankAccountInfo|query|string| 否 |对公账户信息(JSON，加密存储)|
|auditStatus|query|integer| 否 |审核状态：0-待审核 1-通过 2-拒绝|
|auditTime|query|array[string]| 否 |审核时间|
|auditorId|query|integer(int64)| 否 |审核人ID|
|auditRemark|query|string| 否 |审核备注|
|createTime|query|array[string]| 否 |创建时间|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

# 管理后台 - 开放平台-App外部链接

## POST 创建开放平台-App外部链接

POST /open/app-link/create

创建开放平台-App外部链接

> Body 请求参数

```json
{
  "id": 21909,
  "appId": 5543,
  "linkName": "王五",
  "linkUrl": "https://top.morplcp.cn",
  "linkType": 1,
  "description": "你猜",
  "auditStatus": 2,
  "auditTime": "string",
  "auditorId": 7177,
  "auditRemark": "你说的对",
  "status": 2
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[AppLinkSaveReqVO](#schemaapplinksavereqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": 0
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultLong](#schemacommonresultlong)|

## PUT 更新开放平台-App外部链接

PUT /open/app-link/update

更新开放平台-App外部链接

> Body 请求参数

```json
{
  "id": 21909,
  "appId": 5543,
  "linkName": "王五",
  "linkUrl": "https://top.morplcp.cn",
  "linkType": 1,
  "description": "你猜",
  "auditStatus": 2,
  "auditTime": "string",
  "auditorId": 7177,
  "auditRemark": "你说的对",
  "status": 2
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[AppLinkSaveReqVO](#schemaapplinksavereqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

## DELETE 删除开放平台-App外部链接

DELETE /open/app-link/delete

删除开放平台-App外部链接

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|query|integer| 是 |编号|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

## DELETE 批量删除开放平台-App外部链接

DELETE /open/app-link/delete-list

批量删除开放平台-App外部链接

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|ids|query|array[integer]| 是 |编号|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

## GET 获得开放平台-App外部链接

GET /open/app-link/get

获得开放平台-App外部链接

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|query|integer| 是 |编号|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "id": 0,
    "appId": 0,
    "linkName": "",
    "linkUrl": "",
    "linkType": 0,
    "description": "",
    "auditStatus": 0,
    "auditTime": "",
    "auditorId": 0,
    "auditRemark": "",
    "status": 0,
    "createTime": ""
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultAppLinkRespVO](#schemacommonresultapplinkrespvo)|

## GET 获得开放平台-App外部链接分页

GET /open/app-link/page

获得开放平台-App外部链接分页

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|pageNo|query|integer| 是 |页码，从 1 开始|
|pageSize|query|integer| 是 |每页条数，最大值为 100|
|appId|query|integer(int64)| 否 |App ID|
|linkName|query|string| 否 |链接名称|
|linkUrl|query|string| 否 |链接地址(支持{merchantId}占位)|
|linkType|query|integer| 否 |链接类型：0-运营数据 1-其他|
|description|query|string| 否 |链接描述|
|auditStatus|query|integer| 否 |审核状态：0-待审核 1-通过 2-拒绝|
|auditTime|query|array[string]| 否 |审核时间|
|auditorId|query|integer(int64)| 否 |审核人ID|
|auditRemark|query|string| 否 |审核备注|
|status|query|integer| 否 |状态：0-正常 1-禁用|
|createTime|query|array[string]| 否 |创建时间|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "total": 0,
    "list": [
      {
        "id": 0,
        "appId": 0,
        "linkName": "",
        "linkUrl": "",
        "linkType": 0,
        "description": "",
        "auditStatus": 0,
        "auditTime": "",
        "auditorId": 0,
        "auditRemark": "",
        "status": 0,
        "createTime": ""
      }
    ]
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultPageResultAppLinkRespVO](#schemacommonresultpageresultapplinkrespvo)|

## GET 导出开放平台-App外部链接 Excel

GET /open/app-link/export-excel

导出开放平台-App外部链接 Excel

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|pageNo|query|integer| 是 |页码，从 1 开始|
|pageSize|query|integer| 是 |每页条数，最大值为 100|
|appId|query|integer(int64)| 否 |App ID|
|linkName|query|string| 否 |链接名称|
|linkUrl|query|string| 否 |链接地址(支持{merchantId}占位)|
|linkType|query|integer| 否 |链接类型：0-运营数据 1-其他|
|description|query|string| 否 |链接描述|
|auditStatus|query|integer| 否 |审核状态：0-待审核 1-通过 2-拒绝|
|auditTime|query|array[string]| 否 |审核时间|
|auditorId|query|integer(int64)| 否 |审核人ID|
|auditRemark|query|string| 否 |审核备注|
|status|query|integer| 否 |状态：0-正常 1-禁用|
|createTime|query|array[string]| 否 |创建时间|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

# 管理后台 - 开放平台-开发者充值记录

## POST 创建开放平台-开发者充值记录

POST /open/developer-recharge/create

创建开放平台-开发者充值记录

> Body 请求参数

```json
{
  "id": 13276,
  "accountId": 23005,
  "developerId": 20043,
  "rechargeNo": "string",
  "payPrice": 19435,
  "bonusPrice": 30722,
  "totalPrice": 29253,
  "payChannel": "string",
  "payOrderNo": "string",
  "payStatus": 2,
  "payTime": "string",
  "refundStatus": 1,
  "refundAmount": 0,
  "refundTime": "string",
  "remark": "你说的对"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[DeveloperRechargeSaveReqVO](#schemadeveloperrechargesavereqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": 0
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultLong](#schemacommonresultlong)|

## PUT 更新开放平台-开发者充值记录

PUT /open/developer-recharge/update

更新开放平台-开发者充值记录

> Body 请求参数

```json
{
  "id": 13276,
  "accountId": 23005,
  "developerId": 20043,
  "rechargeNo": "string",
  "payPrice": 19435,
  "bonusPrice": 30722,
  "totalPrice": 29253,
  "payChannel": "string",
  "payOrderNo": "string",
  "payStatus": 2,
  "payTime": "string",
  "refundStatus": 1,
  "refundAmount": 0,
  "refundTime": "string",
  "remark": "你说的对"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[DeveloperRechargeSaveReqVO](#schemadeveloperrechargesavereqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

## DELETE 删除开放平台-开发者充值记录

DELETE /open/developer-recharge/delete

删除开放平台-开发者充值记录

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|query|integer| 是 |编号|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

## DELETE 批量删除开放平台-开发者充值记录

DELETE /open/developer-recharge/delete-list

批量删除开放平台-开发者充值记录

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|ids|query|array[integer]| 是 |编号|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

## GET 获得开放平台-开发者充值记录

GET /open/developer-recharge/get

获得开放平台-开发者充值记录

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|query|integer| 是 |编号|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "id": 0,
    "accountId": 0,
    "developerId": 0,
    "rechargeNo": "",
    "payPrice": 0,
    "bonusPrice": 0,
    "totalPrice": 0,
    "payChannel": "",
    "payOrderNo": "",
    "payStatus": 0,
    "payTime": "",
    "refundStatus": 0,
    "refundAmount": 0,
    "refundTime": "",
    "remark": "",
    "createTime": ""
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultDeveloperRechargeRespVO](#schemacommonresultdeveloperrechargerespvo)|

## GET 获得开放平台-开发者充值记录分页

GET /open/developer-recharge/page

获得开放平台-开发者充值记录分页

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|pageNo|query|integer| 是 |页码，从 1 开始|
|pageSize|query|integer| 是 |每页条数，最大值为 100|
|accountId|query|integer(int64)| 否 |账户ID|
|developerId|query|integer(int64)| 否 |开发者ID|
|rechargeNo|query|string| 否 |充值单号|
|payPrice|query|integer| 否 |实际支付金额(分)|
|bonusPrice|query|integer| 否 |赠送金额(分)|
|totalPrice|query|integer| 否 |到账总额(分)，pay_price + bonus_price|
|payChannel|query|string| 否 |支付渠道：alipay/wechat/bank_transfer/offline|
|payOrderNo|query|string| 否 |第三方支付订单号|
|payStatus|query|integer| 否 |支付状态：0-待支付 1-已支付 2-已取消 3-支付失败|
|payTime|query|array[string]| 否 |支付完成时间|
|refundStatus|query|integer| 否 |退款状态：0-未退款 1-部分退款 2-全额退款|
|refundAmount|query|integer| 否 |已退款金额(分)|
|refundTime|query|array[string]| 否 |退款时间|
|remark|query|string| 否 |备注|
|createTime|query|array[string]| 否 |创建时间|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "total": 0,
    "list": [
      {
        "id": 0,
        "accountId": 0,
        "developerId": 0,
        "rechargeNo": "",
        "payPrice": 0,
        "bonusPrice": 0,
        "totalPrice": 0,
        "payChannel": "",
        "payOrderNo": "",
        "payStatus": 0,
        "payTime": "",
        "refundStatus": 0,
        "refundAmount": 0,
        "refundTime": "",
        "remark": "",
        "createTime": ""
      }
    ]
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultPageResultDeveloperRechargeRespVO](#schemacommonresultpageresultdeveloperrechargerespvo)|

## GET 导出开放平台-开发者充值记录 Excel

GET /open/developer-recharge/export-excel

导出开放平台-开发者充值记录 Excel

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|pageNo|query|integer| 是 |页码，从 1 开始|
|pageSize|query|integer| 是 |每页条数，最大值为 100|
|accountId|query|integer(int64)| 否 |账户ID|
|developerId|query|integer(int64)| 否 |开发者ID|
|rechargeNo|query|string| 否 |充值单号|
|payPrice|query|integer| 否 |实际支付金额(分)|
|bonusPrice|query|integer| 否 |赠送金额(分)|
|totalPrice|query|integer| 否 |到账总额(分)，pay_price + bonus_price|
|payChannel|query|string| 否 |支付渠道：alipay/wechat/bank_transfer/offline|
|payOrderNo|query|string| 否 |第三方支付订单号|
|payStatus|query|integer| 否 |支付状态：0-待支付 1-已支付 2-已取消 3-支付失败|
|payTime|query|array[string]| 否 |支付完成时间|
|refundStatus|query|integer| 否 |退款状态：0-未退款 1-部分退款 2-全额退款|
|refundAmount|query|integer| 否 |已退款金额(分)|
|refundTime|query|array[string]| 否 |退款时间|
|remark|query|string| 否 |备注|
|createTime|query|array[string]| 否 |创建时间|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

# 管理后台 - 开放平台-App密钥操作记录

## POST 创建开放平台-App密钥操作记录

POST /open/app-secret-log/create

创建开放平台-App密钥操作记录

> Body 请求参数

```json
{
  "id": 307,
  "appId": 32729,
  "oldAppSecret": "string",
  "operateType": 1,
  "expireTime": "string",
  "operatorId": 8251,
  "reason": "不好"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[AppSecretLogSaveReqVO](#schemaappsecretlogsavereqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": 0
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultLong](#schemacommonresultlong)|

## PUT 更新开放平台-App密钥操作记录

PUT /open/app-secret-log/update

更新开放平台-App密钥操作记录

> Body 请求参数

```json
{
  "id": 307,
  "appId": 32729,
  "oldAppSecret": "string",
  "operateType": 1,
  "expireTime": "string",
  "operatorId": 8251,
  "reason": "不好"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[AppSecretLogSaveReqVO](#schemaappsecretlogsavereqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

## DELETE 删除开放平台-App密钥操作记录

DELETE /open/app-secret-log/delete

删除开放平台-App密钥操作记录

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|query|integer| 是 |编号|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

## DELETE 批量删除开放平台-App密钥操作记录

DELETE /open/app-secret-log/delete-list

批量删除开放平台-App密钥操作记录

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|ids|query|array[integer]| 是 |编号|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

## GET 获得开放平台-App密钥操作记录

GET /open/app-secret-log/get

获得开放平台-App密钥操作记录

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|query|integer| 是 |编号|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "id": 0,
    "appId": 0,
    "oldAppSecret": "",
    "operateType": 0,
    "expireTime": "",
    "operatorId": 0,
    "reason": "",
    "createTime": ""
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultAppSecretLogRespVO](#schemacommonresultappsecretlogrespvo)|

## GET 获得开放平台-App密钥操作记录分页

GET /open/app-secret-log/page

获得开放平台-App密钥操作记录分页

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|pageNo|query|integer| 是 |页码，从 1 开始|
|pageSize|query|integer| 是 |每页条数，最大值为 100|
|appId|query|integer(int64)| 否 |App ID|
|oldAppSecret|query|string| 否 |旧密钥(加密存储)|
|operateType|query|integer| 否 |操作类型：0-首次生成 1-开发者重置 2-平台强制重置|
|expireTime|query|array[string]| 否 |旧密钥过期时间(7天过渡期)|
|operatorId|query|integer(int64)| 否 |操作人ID|
|reason|query|string| 否 |重置原因|
|createTime|query|array[string]| 否 |创建时间|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "total": 0,
    "list": [
      {
        "id": 0,
        "appId": 0,
        "oldAppSecret": "",
        "operateType": 0,
        "expireTime": "",
        "operatorId": 0,
        "reason": "",
        "createTime": ""
      }
    ]
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultPageResultAppSecretLogRespVO](#schemacommonresultpageresultappsecretlogrespvo)|

## GET 导出开放平台-App密钥操作记录 Excel

GET /open/app-secret-log/export-excel

导出开放平台-App密钥操作记录 Excel

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|pageNo|query|integer| 是 |页码，从 1 开始|
|pageSize|query|integer| 是 |每页条数，最大值为 100|
|appId|query|integer(int64)| 否 |App ID|
|oldAppSecret|query|string| 否 |旧密钥(加密存储)|
|operateType|query|integer| 否 |操作类型：0-首次生成 1-开发者重置 2-平台强制重置|
|expireTime|query|array[string]| 否 |旧密钥过期时间(7天过渡期)|
|operatorId|query|integer(int64)| 否 |操作人ID|
|reason|query|string| 否 |重置原因|
|createTime|query|array[string]| 否 |创建时间|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

# 管理后台 - 开放平台-API调用日志

## POST 创建开放平台-API调用日志

POST /open/api-log/create

创建开放平台-API调用日志

> Body 请求参数

```json
{
  "id": 6898,
  "appId": 17344,
  "developerId": 6416,
  "apiPath": "string",
  "method": "string",
  "requestBody": "string",
  "responseBody": "string",
  "responseCode": 0,
  "costMs": 0,
  "ip": "string",
  "errorMsg": "string"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[ApiLogSaveReqVO](#schemaapilogsavereqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": 0
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultLong](#schemacommonresultlong)|

## PUT 更新开放平台-API调用日志

PUT /open/api-log/update

更新开放平台-API调用日志

> Body 请求参数

```json
{
  "id": 6898,
  "appId": 17344,
  "developerId": 6416,
  "apiPath": "string",
  "method": "string",
  "requestBody": "string",
  "responseBody": "string",
  "responseCode": 0,
  "costMs": 0,
  "ip": "string",
  "errorMsg": "string"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[ApiLogSaveReqVO](#schemaapilogsavereqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

## DELETE 删除开放平台-API调用日志

DELETE /open/api-log/delete

删除开放平台-API调用日志

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|query|integer| 是 |编号|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

## DELETE 批量删除开放平台-API调用日志

DELETE /open/api-log/delete-list

批量删除开放平台-API调用日志

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|ids|query|array[integer]| 是 |编号|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

## GET 获得开放平台-API调用日志

GET /open/api-log/get

获得开放平台-API调用日志

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|query|integer| 是 |编号|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "id": 0,
    "appId": 0,
    "developerId": 0,
    "apiPath": "",
    "method": "",
    "requestBody": "",
    "responseBody": "",
    "responseCode": 0,
    "costMs": 0,
    "ip": "",
    "errorMsg": "",
    "createTime": ""
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultApiLogRespVO](#schemacommonresultapilogrespvo)|

## GET 获得开放平台-API调用日志分页

GET /open/api-log/page

获得开放平台-API调用日志分页

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|pageNo|query|integer| 是 |页码，从 1 开始|
|pageSize|query|integer| 是 |每页条数，最大值为 100|
|appId|query|integer(int64)| 否 |App ID|
|developerId|query|integer(int64)| 否 |开发者ID(冗余，便于控制台统计)|
|apiPath|query|string| 否 |接口路径|
|method|query|string| 否 |请求方法|
|requestBody|query|string| 否 |请求体|
|responseBody|query|string| 否 |响应体|
|responseCode|query|integer| 否 |响应码|
|costMs|query|integer| 否 |耗时(ms)|
|ip|query|string| 否 |请求IP|
|errorMsg|query|string| 否 |错误信息|
|createTime|query|array[string]| 否 |创建时间|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "total": 0,
    "list": [
      {
        "id": 0,
        "appId": 0,
        "developerId": 0,
        "apiPath": "",
        "method": "",
        "requestBody": "",
        "responseBody": "",
        "responseCode": 0,
        "costMs": 0,
        "ip": "",
        "errorMsg": "",
        "createTime": ""
      }
    ]
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultPageResultApiLogRespVO](#schemacommonresultpageresultapilogrespvo)|

## GET 导出开放平台-API调用日志 Excel

GET /open/api-log/export-excel

导出开放平台-API调用日志 Excel

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|pageNo|query|integer| 是 |页码，从 1 开始|
|pageSize|query|integer| 是 |每页条数，最大值为 100|
|appId|query|integer(int64)| 否 |App ID|
|developerId|query|integer(int64)| 否 |开发者ID(冗余，便于控制台统计)|
|apiPath|query|string| 否 |接口路径|
|method|query|string| 否 |请求方法|
|requestBody|query|string| 否 |请求体|
|responseBody|query|string| 否 |响应体|
|responseCode|query|integer| 否 |响应码|
|costMs|query|integer| 否 |耗时(ms)|
|ip|query|string| 否 |请求IP|
|errorMsg|query|string| 否 |错误信息|
|createTime|query|array[string]| 否 |创建时间|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

# 管理后台 - 开放平台-实名认证记录

## POST 创建开放平台-实名认证记录

POST /open/real-name-auth/create

创建开放平台-实名认证记录

> Body 请求参数

```json
{
  "id": 14326,
  "realName": "赵六",
  "idCardNumber": "string",
  "idCardFrontUrl": "string",
  "idCardBackUrl": "string",
  "authStatus": 1,
  "authTime": "string",
  "failReason": "string",
  "authChannel": "string"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[RealNameAuthSaveReqVO](#schemarealnameauthsavereqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": 0
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultLong](#schemacommonresultlong)|

## PUT 更新开放平台-实名认证记录

PUT /open/real-name-auth/update

更新开放平台-实名认证记录

> Body 请求参数

```json
{
  "id": 14326,
  "realName": "赵六",
  "idCardNumber": "string",
  "idCardFrontUrl": "string",
  "idCardBackUrl": "string",
  "authStatus": 1,
  "authTime": "string",
  "failReason": "string",
  "authChannel": "string"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[RealNameAuthSaveReqVO](#schemarealnameauthsavereqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

## DELETE 删除开放平台-实名认证记录

DELETE /open/real-name-auth/delete

删除开放平台-实名认证记录

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|query|integer| 是 |编号|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

## DELETE 批量删除开放平台-实名认证记录

DELETE /open/real-name-auth/delete-list

批量删除开放平台-实名认证记录

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|ids|query|array[integer]| 是 |编号|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

## GET 获得开放平台-实名认证记录

GET /open/real-name-auth/get

获得开放平台-实名认证记录

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|query|integer| 是 |编号|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "id": 0,
    "realName": "",
    "idCardNumber": "",
    "idCardFrontUrl": "",
    "idCardBackUrl": "",
    "sex": "",
    "nation": "",
    "birth": "",
    "address": "",
    "authority": "",
    "validDate": "",
    "portraitUrl": "",
    "ocrQualityScore": 0,
    "facePhotoUrl": "",
    "faceOrderNo": "",
    "faceLiveRate": 0,
    "faceSimilarity": 0,
    "authStatus": 0,
    "authTime": "",
    "failReason": "",
    "authChannel": "",
    "signatureUrl": "",
    "createTime": ""
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultRealNameAuthRespVO](#schemacommonresultrealnameauthrespvo)|

## GET 获得开放平台-实名认证记录分页

GET /open/real-name-auth/page

获得开放平台-实名认证记录分页

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|pageNo|query|integer| 是 |页码，从 1 开始|
|pageSize|query|integer| 是 |每页条数，最大值为 100|
|realName|query|string| 否 |真实姓名|
|idCardNumber|query|string| 否 |身份证号|
|authStatus|query|integer| 否 |认证状态：0-未认证 1-认证中 2-已认证 3-认证失败|
|authChannel|query|string| 否 |认证渠道|
|authTime|query|array[string]| 否 |认证通过时间|
|createTime|query|array[string]| 否 |创建时间|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "total": 0,
    "list": [
      {
        "id": 0,
        "realName": "",
        "idCardNumber": "",
        "idCardFrontUrl": "",
        "idCardBackUrl": "",
        "sex": "",
        "nation": "",
        "birth": "",
        "address": "",
        "authority": "",
        "validDate": "",
        "portraitUrl": "",
        "ocrQualityScore": 0,
        "facePhotoUrl": "",
        "faceOrderNo": "",
        "faceLiveRate": 0,
        "faceSimilarity": 0,
        "authStatus": 0,
        "authTime": "",
        "failReason": "",
        "authChannel": "",
        "signatureUrl": "",
        "createTime": ""
      }
    ]
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultPageResultRealNameAuthRespVO](#schemacommonresultpageresultrealnameauthrespvo)|

## GET 导出开放平台-实名认证记录 Excel

GET /open/real-name-auth/export-excel

导出开放平台-实名认证记录 Excel

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|pageNo|query|integer| 是 |页码，从 1 开始|
|pageSize|query|integer| 是 |每页条数，最大值为 100|
|realName|query|string| 否 |真实姓名|
|idCardNumber|query|string| 否 |身份证号|
|authStatus|query|integer| 否 |认证状态：0-未认证 1-认证中 2-已认证 3-认证失败|
|authChannel|query|string| 否 |认证渠道|
|authTime|query|array[string]| 否 |认证通过时间|
|createTime|query|array[string]| 否 |创建时间|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

# 管理后台 - 开放平台-App关联商户

## POST 创建开放平台-App关联商户

POST /open/app-merchant/create

创建开放平台-App关联商户

> Body 请求参数

```json
{
  "id": 26599,
  "appId": 19608,
  "merchantId": 9600,
  "status": 0,
  "cooperateTime": "string",
  "remark": "你说的对"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[AppMerchantSaveReqVO](#schemaappmerchantsavereqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": 0
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultLong](#schemacommonresultlong)|

## PUT 更新开放平台-App关联商户

PUT /open/app-merchant/update

更新开放平台-App关联商户

> Body 请求参数

```json
{
  "id": 26599,
  "appId": 19608,
  "merchantId": 9600,
  "status": 0,
  "cooperateTime": "string",
  "remark": "你说的对"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[AppMerchantSaveReqVO](#schemaappmerchantsavereqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

## DELETE 删除开放平台-App关联商户

DELETE /open/app-merchant/delete

删除开放平台-App关联商户

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|query|integer| 是 |编号|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

## DELETE 批量删除开放平台-App关联商户

DELETE /open/app-merchant/delete-list

批量删除开放平台-App关联商户

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|ids|query|array[integer]| 是 |编号|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

## PUT 审核通过合作申请

PUT /open/app-merchant/approve

审核通过合作申请

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|query|integer| 是 |合作记录编号|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

## PUT 拒绝合作申请

PUT /open/app-merchant/reject

拒绝合作申请

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|query|integer| 是 |合作记录编号|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

## GET 获得开放平台-App关联商户

GET /open/app-merchant/get

获得开放平台-App关联商户

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|query|integer| 是 |编号|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "id": 0,
    "appId": 0,
    "merchantId": 0,
    "status": 0,
    "cooperateTime": "",
    "remark": "",
    "createTime": ""
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultAppMerchantRespVO](#schemacommonresultappmerchantrespvo)|

## GET 获得开放平台-App关联商户分页

GET /open/app-merchant/page

获得开放平台-App关联商户分页

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|pageNo|query|integer| 是 |页码，从 1 开始|
|pageSize|query|integer| 是 |每页条数，最大值为 100|
|appId|query|integer(int64)| 否 |App ID|
|merchantId|query|integer(int64)| 否 |商户ID|
|status|query|integer| 否 |状态：0-合作中 1-已终止 2-申请中 3-已拒绝|
|cooperateTime|query|array[string]| 否 |合作开始时间|
|remark|query|string| 否 |备注|
|createTime|query|array[string]| 否 |创建时间|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "total": 0,
    "list": [
      {
        "id": 0,
        "appId": 0,
        "merchantId": 0,
        "status": 0,
        "cooperateTime": "",
        "remark": "",
        "createTime": ""
      }
    ]
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultPageResultAppMerchantRespVO](#schemacommonresultpageresultappmerchantrespvo)|

## GET 导出开放平台-App关联商户 Excel

GET /open/app-merchant/export-excel

导出开放平台-App关联商户 Excel

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|pageNo|query|integer| 是 |页码，从 1 开始|
|pageSize|query|integer| 是 |每页条数，最大值为 100|
|appId|query|integer(int64)| 否 |App ID|
|merchantId|query|integer(int64)| 否 |商户ID|
|status|query|integer| 否 |状态：0-合作中 1-已终止 2-申请中 3-已拒绝|
|cooperateTime|query|array[string]| 否 |合作开始时间|
|remark|query|string| 否 |备注|
|createTime|query|array[string]| 否 |创建时间|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

# 管理后台 - App支付宝配置

## POST 创建App支付宝配置

POST /open/alipay-config/create

创建App支付宝配置

> Body 请求参数

```json
{
  "id": 1,
  "appId": 100,
  "alipayAppId": "2021001234567890",
  "signType": "RSA2",
  "mode": 1,
  "privateKey": "string",
  "alipayPublicKey": "string",
  "appCertContent": "string",
  "alipayPublicCertContent": "string",
  "rootCertContent": "string",
  "serverUrl": "https://openapi.alipay.com/gateway.do",
  "status": 0
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[AlipayConfigSaveReqVO](#schemaalipayconfigsavereqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": 0
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultLong](#schemacommonresultlong)|

## PUT 更新App支付宝配置

PUT /open/alipay-config/update

更新App支付宝配置

> Body 请求参数

```json
{
  "id": 1,
  "appId": 100,
  "alipayAppId": "2021001234567890",
  "signType": "RSA2",
  "mode": 1,
  "privateKey": "string",
  "alipayPublicKey": "string",
  "appCertContent": "string",
  "alipayPublicCertContent": "string",
  "rootCertContent": "string",
  "serverUrl": "https://openapi.alipay.com/gateway.do",
  "status": 0
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[AlipayConfigSaveReqVO](#schemaalipayconfigsavereqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

## DELETE 删除App支付宝配置

DELETE /open/alipay-config/delete

删除App支付宝配置

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|query|integer| 是 |配置ID|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

## GET 获取App支付宝配置

GET /open/alipay-config/get

获取App支付宝配置

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|query|integer| 是 |配置ID|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "id": 0,
    "appId": 0,
    "alipayAppId": "",
    "signType": "",
    "mode": 0,
    "serverUrl": "",
    "status": 0,
    "createTime": ""
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultAlipayConfigRespVO](#schemacommonresultalipayconfigrespvo)|

## GET 根据应用ID获取支付宝配置

GET /open/alipay-config/get-by-app

根据应用ID获取支付宝配置

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|appId|query|integer| 是 |应用ID|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "id": 0,
    "appId": 0,
    "alipayAppId": "",
    "signType": "",
    "mode": 0,
    "serverUrl": "",
    "status": 0,
    "createTime": ""
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultAlipayConfigRespVO](#schemacommonresultalipayconfigrespvo)|

# 管理后台 - 开放平台-回调任务

## POST 创建开放平台-回调任务

POST /open/callback-task/create

创建开放平台-回调任务

> Body 请求参数

```json
{
  "id": 22853,
  "appId": 12825,
  "eventId": "evt_20260325_100001",
  "eventCode": "member_card.purchase.paid",
  "eventVersion": "1.0",
  "eventKey": "purchase:12345",
  "bizId": 21564,
  "payload": "string",
  "callbackUrl": "https://top.morplcp.cn",
  "signatureVersion": "v1",
  "status": 2,
  "nextRetryTime": "string",
  "retryCount": 2415,
  "maxRetryCount": 10778,
  "lastResponseCode": 0,
  "lastResponseBody": "string"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[CallbackTaskSaveReqVO](#schemacallbacktasksavereqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": 0
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultLong](#schemacommonresultlong)|

## PUT 更新开放平台-回调任务

PUT /open/callback-task/update

更新开放平台-回调任务

> Body 请求参数

```json
{
  "id": 22853,
  "appId": 12825,
  "eventId": "evt_20260325_100001",
  "eventCode": "member_card.purchase.paid",
  "eventVersion": "1.0",
  "eventKey": "purchase:12345",
  "bizId": 21564,
  "payload": "string",
  "callbackUrl": "https://top.morplcp.cn",
  "signatureVersion": "v1",
  "status": 2,
  "nextRetryTime": "string",
  "retryCount": 2415,
  "maxRetryCount": 10778,
  "lastResponseCode": 0,
  "lastResponseBody": "string"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[CallbackTaskSaveReqVO](#schemacallbacktasksavereqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

## DELETE 删除开放平台-回调任务

DELETE /open/callback-task/delete

删除开放平台-回调任务

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|query|integer| 是 |编号|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

## DELETE 批量删除开放平台-回调任务

DELETE /open/callback-task/delete-list

批量删除开放平台-回调任务

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|ids|query|array[integer]| 是 |编号|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

## PUT 手动重试回调任务

PUT /open/callback-task/retry

手动重试回调任务

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|query|integer| 是 |编号|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

## GET 获得开放平台-回调任务

GET /open/callback-task/get

获得开放平台-回调任务

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|query|integer| 是 |编号|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "id": 0,
    "appId": 0,
    "eventId": "",
    "eventCode": "",
    "eventVersion": "",
    "eventKey": "",
    "bizId": 0,
    "payload": "",
    "callbackUrl": "",
    "signatureVersion": "",
    "status": 0,
    "nextRetryTime": "",
    "retryCount": 0,
    "maxRetryCount": 0,
    "lastResponseCode": 0,
    "lastResponseBody": "",
    "createTime": ""
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultCallbackTaskRespVO](#schemacommonresultcallbacktaskrespvo)|

## GET 获得开放平台-回调任务分页

GET /open/callback-task/page

获得开放平台-回调任务分页

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|pageNo|query|integer| 是 |页码，从 1 开始|
|pageSize|query|integer| 是 |每页条数，最大值为 100|
|appId|query|integer(int64)| 否 |App ID|
|eventId|query|string| 否 |事件唯一 ID|
|eventCode|query|string| 否 |事件编码|
|eventVersion|query|string| 否 |事件版本|
|eventKey|query|string| 否 |事件幂等键|
|bizId|query|integer(int64)| 否 |关联业务ID|
|payload|query|string| 否 |回调数据(JSON)|
|callbackUrl|query|string| 否 |回调地址|
|signatureVersion|query|string| 否 |签名版本|
|status|query|integer| 否 |状态：0-待推送 1-推送中 2-成功 3-失败|
|nextRetryTime|query|array[string]| 否 |下次重试时间|
|retryCount|query|integer| 否 |已重试次数|
|maxRetryCount|query|integer| 否 |最大重试次数|
|lastResponseCode|query|integer| 否 |最后响应码|
|lastResponseBody|query|string| 否 |最后响应体|
|createTime|query|array[string]| 否 |创建时间|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "total": 0,
    "list": [
      {
        "id": 0,
        "appId": 0,
        "eventId": "",
        "eventCode": "",
        "eventVersion": "",
        "eventKey": "",
        "bizId": 0,
        "payload": "",
        "callbackUrl": "",
        "signatureVersion": "",
        "status": 0,
        "nextRetryTime": "",
        "retryCount": 0,
        "maxRetryCount": 0,
        "lastResponseCode": 0,
        "lastResponseBody": "",
        "createTime": ""
      }
    ]
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultPageResultCallbackTaskRespVO](#schemacommonresultpageresultcallbacktaskrespvo)|

## GET 导出开放平台-回调任务 Excel

GET /open/callback-task/export-excel

导出开放平台-回调任务 Excel

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|pageNo|query|integer| 是 |页码，从 1 开始|
|pageSize|query|integer| 是 |每页条数，最大值为 100|
|appId|query|integer(int64)| 否 |App ID|
|eventId|query|string| 否 |事件唯一 ID|
|eventCode|query|string| 否 |事件编码|
|eventVersion|query|string| 否 |事件版本|
|eventKey|query|string| 否 |事件幂等键|
|bizId|query|integer(int64)| 否 |关联业务ID|
|payload|query|string| 否 |回调数据(JSON)|
|callbackUrl|query|string| 否 |回调地址|
|signatureVersion|query|string| 否 |签名版本|
|status|query|integer| 否 |状态：0-待推送 1-推送中 2-成功 3-失败|
|nextRetryTime|query|array[string]| 否 |下次重试时间|
|retryCount|query|integer| 否 |已重试次数|
|maxRetryCount|query|integer| 否 |最大重试次数|
|lastResponseCode|query|integer| 否 |最后响应码|
|lastResponseBody|query|string| 否 |最后响应体|
|createTime|query|array[string]| 否 |创建时间|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

# 管理后台 - 开放平台-开发者账户流水

## POST 创建开放平台-开发者账户流水

POST /open/developer-account-transaction/create

创建开放平台-开发者账户流水

> Body 请求参数

```json
{
  "id": 1736,
  "accountId": 26362,
  "developerId": 19617,
  "transactionNo": "string",
  "title": "string",
  "transactionType": 1,
  "amount": 0,
  "balanceAfter": 0,
  "bizType": 2,
  "bizId": "9060",
  "appId": 15772,
  "remark": "你猜"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[DeveloperAccountTransactionSaveReqVO](#schemadeveloperaccounttransactionsavereqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": 0
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultLong](#schemacommonresultlong)|

## PUT 更新开放平台-开发者账户流水

PUT /open/developer-account-transaction/update

更新开放平台-开发者账户流水

> Body 请求参数

```json
{
  "id": 1736,
  "accountId": 26362,
  "developerId": 19617,
  "transactionNo": "string",
  "title": "string",
  "transactionType": 1,
  "amount": 0,
  "balanceAfter": 0,
  "bizType": 2,
  "bizId": "9060",
  "appId": 15772,
  "remark": "你猜"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[DeveloperAccountTransactionSaveReqVO](#schemadeveloperaccounttransactionsavereqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

## DELETE 删除开放平台-开发者账户流水

DELETE /open/developer-account-transaction/delete

删除开放平台-开发者账户流水

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|query|integer| 是 |编号|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

## DELETE 批量删除开放平台-开发者账户流水

DELETE /open/developer-account-transaction/delete-list

批量删除开放平台-开发者账户流水

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|ids|query|array[integer]| 是 |编号|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

## GET 获得开放平台-开发者账户流水

GET /open/developer-account-transaction/get

获得开放平台-开发者账户流水

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|query|integer| 是 |编号|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "id": 0,
    "accountId": 0,
    "developerId": 0,
    "transactionNo": "",
    "title": "",
    "transactionType": 0,
    "amount": 0,
    "balanceAfter": 0,
    "bizType": 0,
    "bizId": "",
    "appId": 0,
    "remark": "",
    "createTime": ""
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultDeveloperAccountTransactionRespVO](#schemacommonresultdeveloperaccounttransactionrespvo)|

## GET 获得开放平台-开发者账户流水分页

GET /open/developer-account-transaction/page

获得开放平台-开发者账户流水分页

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|pageNo|query|integer| 是 |页码，从 1 开始|
|pageSize|query|integer| 是 |每页条数，最大值为 100|
|accountId|query|integer(int64)| 否 |账户ID|
|developerId|query|integer(int64)| 否 |开发者ID|
|transactionNo|query|string| 否 |流水号(唯一)|
|title|query|string| 否 |流水标题|
|transactionType|query|integer| 否 |交易类型：0-充值 1-赠送 2-API调用扣费 3-产品购买扣费 4-退款 5-平台调账 6-冻结 7-解冻|
|amount|query|integer| 否 |交易金额(分)，正数为入账，负数为出账|
|balanceAfter|query|integer| 否 |交易后余额(分)|
|bizType|query|integer| 否 |关联业务类型：0-充值订单 1-API调用 2-产品订购 3-平台操作|
|bizId|query|string| 否 |关联业务编号|
|appId|query|integer(int64)| 否 |关联App ID(API调用扣费时)|
|remark|query|string| 否 |备注|
|createTime|query|array[string]| 否 |创建时间|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "total": 0,
    "list": [
      {
        "id": 0,
        "accountId": 0,
        "developerId": 0,
        "transactionNo": "",
        "title": "",
        "transactionType": 0,
        "amount": 0,
        "balanceAfter": 0,
        "bizType": 0,
        "bizId": "",
        "appId": 0,
        "remark": "",
        "createTime": ""
      }
    ]
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultPageResultDeveloperAccountTransactionRespVO](#schemacommonresultpageresultdeveloperaccounttransactionrespvo)|

## GET 导出开放平台-开发者账户流水 Excel

GET /open/developer-account-transaction/export-excel

导出开放平台-开发者账户流水 Excel

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|pageNo|query|integer| 是 |页码，从 1 开始|
|pageSize|query|integer| 是 |每页条数，最大值为 100|
|accountId|query|integer(int64)| 否 |账户ID|
|developerId|query|integer(int64)| 否 |开发者ID|
|transactionNo|query|string| 否 |流水号(唯一)|
|title|query|string| 否 |流水标题|
|transactionType|query|integer| 否 |交易类型：0-充值 1-赠送 2-API调用扣费 3-产品购买扣费 4-退款 5-平台调账 6-冻结 7-解冻|
|amount|query|integer| 否 |交易金额(分)，正数为入账，负数为出账|
|balanceAfter|query|integer| 否 |交易后余额(分)|
|bizType|query|integer| 否 |关联业务类型：0-充值订单 1-API调用 2-产品订购 3-平台操作|
|bizId|query|string| 否 |关联业务编号|
|appId|query|integer(int64)| 否 |关联App ID(API调用扣费时)|
|remark|query|string| 否 |备注|
|createTime|query|array[string]| 否 |创建时间|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

# 管理后台 - App商户筛选策略

## POST 创建/更新 App 商户筛选策略

POST /open/app-merchant-filter/save

创建/更新 App 商户筛选策略

> Body 请求参数

```json
{
  "id": 1,
  "appId": 1,
  "filterMode": 0,
  "autoCooperate": true,
  "filterConfig": "string",
  "enabled": true
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[AppMerchantFilterSaveReqVO](#schemaappmerchantfiltersavereqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": 0
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultLong](#schemacommonresultlong)|

## GET 获取 App 的商户筛选策略

GET /open/app-merchant-filter/get

获取 App 的商户筛选策略

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|appId|query|integer| 是 |App ID|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "id": 0,
    "appId": 0,
    "filterMode": 0,
    "autoCooperate": false,
    "filterConfig": "",
    "enabled": false,
    "lastSyncTime": "",
    "createTime": "",
    "updateTime": ""
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultAppMerchantFilterRespVO](#schemacommonresultappmerchantfilterrespvo)|

## DELETE 删除 App 商户筛选策略（不影响已有绑定）

DELETE /open/app-merchant-filter/delete

删除 App 商户筛选策略（不影响已有绑定）

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|query|integer| 是 |策略编号|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

## POST 手动触发 App 商户策略同步

POST /open/app-merchant-filter/sync

手动触发 App 商户策略同步

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|appId|query|integer| 是 |App ID|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

# 开放平台 - 固定收款码

## POST 创建固定收款码

POST /open-api/fixed-qrcode/create

创建固定收款码

> Body 请求参数

```json
{
  "merchantId": 1,
  "storeId": 200,
  "subject": "门店收款",
  "defaultAmount": 10000
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[OpenApiFixedQrcodeCreateReqVO](#schemaopenapifixedqrcodecreatereqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "id": 0,
    "merchantId": 0,
    "openAppId": 0,
    "storeId": 0,
    "code": "",
    "subject": "",
    "defaultAmount": 0,
    "qrUrl": "",
    "qrCodeImageUrl": "",
    "status": 0,
    "createTime": ""
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultOpenApiFixedQrcodeRespVO](#schemacommonresultopenapifixedqrcoderespvo)|

## DELETE 删除固定收款码

DELETE /open-api/fixed-qrcode/delete

删除固定收款码

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|query|integer| 是 |固定收款码ID|
|merchantId|query|integer| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

## GET 查询当前App为指定商户创建的固定收款码列表

GET /open-api/fixed-qrcode/list

查询当前App为指定商户创建的固定收款码列表

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|merchantId|query|integer| 是 |商户ID|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": [
    {
      "id": 0,
      "merchantId": 0,
      "openAppId": 0,
      "storeId": 0,
      "code": "",
      "subject": "",
      "defaultAmount": 0,
      "qrUrl": "",
      "qrCodeImageUrl": "",
      "status": 0,
      "createTime": ""
    }
  ]
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultListOpenApiFixedQrcodeRespVO](#schemacommonresultlistopenapifixedqrcoderespvo)|

# 开放平台 - 消费任务

## GET 查询商户已上架的消费任务列表（支持门店过滤）

GET /v1/consumption-tasks

查询商户已上架的消费任务列表（支持门店过滤）

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|merchantId|query|integer| 是 |none|
|storeId|query|integer| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": [
    {
      "id": 0,
      "merchantId": 0,
      "storeScope": 0,
      "storeIds": "",
      "taskName": "",
      "description": "",
      "coverUrl": "",
      "targetAmount": 0,
      "durationDays": 0,
      "rewardAmount": 0,
      "rewardType": 0,
      "startTime": "",
      "endTime": "",
      "participantLimit": 0,
      "participantCount": 0,
      "completedCount": 0,
      "status": 0
    }
  ]
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultListOpenApiConsumptionTaskRespVO](#schemacommonresultlistopenapiconsumptiontaskrespvo)|

## GET 查询消费任务详情（含商户信息、门店信息、用户余额卡和任务期间充值记录）

GET /v1/consumption-tasks/{taskId}

查询消费任务详情（含商户信息、门店信息、用户余额卡和任务期间充值记录）

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|taskId|path|integer| 是 |none|
|externalUserId|query|string| 否 |none|
|merchantId|query|integer| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "id": 0,
    "merchantId": 0,
    "storeScope": 0,
    "storeIds": "",
    "taskName": "",
    "description": "",
    "coverUrl": "",
    "targetAmount": 0,
    "durationDays": 0,
    "rewardAmount": 0,
    "rewardType": 0,
    "startTime": "",
    "endTime": "",
    "participantLimit": 0,
    "participantCount": 0,
    "completedCount": 0,
    "status": 0,
    "merchantInfo": {
      "merchantName": "",
      "merchantLogo": ""
    },
    "storeInfoList": [
      {
        "storeId": 0,
        "storeName": "",
        "logoUrl": "",
        "province": "",
        "city": "",
        "district": "",
        "address": "",
        "contactPhone": "",
        "longitude": 0,
        "latitude": 0
      }
    ],
    "memberInfo": {
      "memberId": 0,
      "balance": 0,
      "rewardBalance": 0,
      "totalRecharge": 0,
      "totalConsume": 0,
      "totalReward": 0,
      "joinTime": ""
    },
    "myRecord": {
      "recordId": 0,
      "progressAmount": 0,
      "targetAmount": 0,
      "rewardAmount": 0,
      "rewardType": 0,
      "status": 0,
      "claimTime": "",
      "expireTime": ""
    },
    "rechargeRecords": [
      {
        "rechargeId": 0,
        "amount": 0,
        "payTime": "",
        "rechargeNo": ""
      }
    ]
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultOpenApiTaskDetailRespVO](#schemacommonresultopenapitaskdetailrespvo)|

## GET 查询用户跨商户的任务记录列表（按门店分组，组内按完成进度降序）

GET /v1/consumption-tasks/my-tasks

查询用户跨商户的任务记录列表（按门店分组，组内按完成进度降序）

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|externalUserId|query|string| 是 |none|
|status|query|integer| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": [
    {
      "storeId": 0,
      "storeName": "",
      "merchantId": 0,
      "merchantName": "",
      "merchantLogo": "",
      "memberBalance": 0,
      "memberRewardBalance": 0,
      "tasks": [
        {
          "id": 0,
          "taskId": 0,
          "taskName": "",
          "targetAmount": 0,
          "progressAmount": 0,
          "completionRate": 0,
          "rewardAmount": 0,
          "rewardType": 0,
          "status": 0,
          "claimTime": "",
          "expireTime": ""
        }
      ]
    }
  ]
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultListOpenApiStoreTaskGroupRespVO](#schemacommonresultlistopenapistoretaskgrouprespvo)|

## GET 查询门店任务统计（适用任务数量 + 参与人数）

GET /v1/consumption-tasks/store-stats

查询门店任务统计（适用任务数量 + 参与人数）

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|merchantId|query|integer| 是 |none|
|storeId|query|integer| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "taskCount": 0,
    "participantCount": 0
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultOpenApiTaskStoreStatsRespVO](#schemacommonresultopenapitaskstorestatsrespvo)|

## GET 分页查询门店任务参与会员记录

GET /v1/consumption-tasks/store-participants

分页查询门店任务参与会员记录

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|merchantId|query|integer| 是 |none|
|storeId|query|integer| 是 |none|
|taskId|query|integer| 否 |none|
|pageNo|query|integer| 是 |none|
|pageSize|query|integer| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "total": 0,
    "list": [
      {
        "id": 0,
        "taskId": 0,
        "memberId": 0,
        "storeId": 0,
        "taskName": "",
        "targetAmount": 0,
        "progressAmount": 0,
        "rewardAmount": 0,
        "rewardType": 0,
        "status": 0,
        "claimTime": "",
        "expireTime": ""
      }
    ]
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultPageResultOpenApiTaskRecordRespVO](#schemacommonresultpageresultopenapitaskrecordrespvo)|

## POST 领取任务

POST /v1/consumption-tasks/claim

领取任务

> Body 请求参数

```json
{
  "taskId": 1,
  "externalUserId": "user_001",
  "merchantId": 1,
  "storeId": 10
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[OpenApiTaskClaimReqVO](#schemaopenapitaskclaimreqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "id": 0,
    "taskId": 0,
    "memberId": 0,
    "storeId": 0,
    "taskName": "",
    "targetAmount": 0,
    "progressAmount": 0,
    "rewardAmount": 0,
    "rewardType": 0,
    "status": 0,
    "claimTime": "",
    "expireTime": ""
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultOpenApiTaskRecordRespVO](#schemacommonresultopenapitaskrecordrespvo)|

## GET 查询用户的任务记录列表（分页 + 状态筛选）

GET /v1/consumption-tasks/records

查询用户的任务记录列表（分页 + 状态筛选）

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|externalUserId|query|string| 是 |none|
|merchantId|query|integer| 是 |none|
|status|query|integer| 否 |none|
|pageNo|query|integer| 是 |none|
|pageSize|query|integer| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "total": 0,
    "list": [
      {
        "id": 0,
        "taskId": 0,
        "memberId": 0,
        "storeId": 0,
        "taskName": "",
        "targetAmount": 0,
        "progressAmount": 0,
        "rewardAmount": 0,
        "rewardType": 0,
        "status": 0,
        "claimTime": "",
        "expireTime": ""
      }
    ]
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultPageResultOpenApiTaskRecordRespVO](#schemacommonresultpageresultopenapitaskrecordrespvo)|

## POST 领取任务奖励

POST /v1/consumption-tasks/records/{recordId}/claim-reward

领取任务奖励

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|recordId|path|integer| 是 |none|
|externalUserId|query|string| 是 |none|
|merchantId|query|integer| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": false
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultBoolean](#schemacommonresultboolean)|

# 开放平台 - App用户入网

## POST 为App用户发起入网申请

POST /v1/onboarding/app-user

为App用户发起入网申请
提交App用户身份信息，发起易宝小微入网。入网审核由易宝异步完成，可通过查询接口跟踪状态。

> Body 请求参数

```json
{
  "externalUserId": "user_123",
  "signName": "张三",
  "shortName": "张三",
  "idCardNumber": "110101199001011234",
  "idCardFrontUrl": "https://oss.example.com/id_front.jpg",
  "idCardBackUrl": "https://oss.example.com/id_back.jpg",
  "mobile": "13800138000",
  "province": "北京市",
  "city": "北京市",
  "district": "朝阳区",
  "address": "朝阳区xxx路xxx号",
  "provinceCode": "110000",
  "cityCode": "110100",
  "districtCode": "110105"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[OpenApiAppUserOnboardReqVO](#schemaopenapiappuseronboardreqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "externalUserId": "",
    "signStatus": 0,
    "signStatusDesc": "",
    "merchantNo": "",
    "signTime": ""
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultOpenApiOnboardStatusRespVO](#schemacommonresultopenapionboardstatusrespvo)|

## GET 查询App用户入网状态

GET /v1/onboarding/app-user/status

查询App用户入网状态
根据 externalUserId 查询该用户的入网状态。signStatus 含义：0-未入网 1-入网中 2-已入网 3-入网失败

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|externalUserId|query|string| 是 |App端用户唯一标识|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "externalUserId": "",
    "signStatus": 0,
    "signStatusDesc": "",
    "merchantNo": "",
    "signTime": ""
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultOpenApiOnboardStatusRespVO](#schemacommonresultopenapionboardstatusrespvo)|

# 开放平台 - B2B转账

## POST 创建B2B转账

POST /v1/transfer/b2b

创建B2B转账

> Body 请求参数

```json
{
  "toExternalUserId": "user_10001",
  "merchantTransferNo": "TF20260415001",
  "amount": 10000,
  "usage": "佣金分发"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[OpenApiB2bTransferCreateReqVO](#schemaopenapib2btransfercreatereqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "merchantTransferNo": "",
    "transferNo": "",
    "toExternalUserId": "",
    "amount": 0,
    "usage": "",
    "status": 0,
    "failReason": "",
    "finishTime": "",
    "createTime": ""
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultOpenApiB2bTransferRespVO](#schemacommonresultopenapib2btransferrespvo)|

## GET 查询B2B转账状态

GET /v1/transfer/b2b

查询B2B转账状态

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|merchantTransferNo|query|string| 是 |商户转账单号|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "merchantTransferNo": "",
    "transferNo": "",
    "toExternalUserId": "",
    "amount": 0,
    "usage": "",
    "status": 0,
    "failReason": "",
    "finishTime": "",
    "createTime": ""
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultOpenApiB2bTransferRespVO](#schemacommonresultopenapib2btransferrespvo)|

# 开放平台 - 商户会员

## POST 加入会员

POST /v1/members/join

加入会员

> Body 请求参数

```json
{
  "merchantId": 1,
  "externalUserId": "user_123",
  "storeId": 10
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[OpenApiMemberJoinReqVO](#schemaopenapimemberjoinreqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "id": 0,
    "merchantId": 0,
    "merchantName": "",
    "merchantLogo": "",
    "balance": 0,
    "rewardBalance": 0,
    "totalBalance": 0,
    "totalRecharge": 0,
    "totalConsume": 0,
    "totalReward": 0,
    "status": 0,
    "joinTime": "",
    "externalUserId": ""
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultOpenApiMemberRespVO](#schemacommonresultopenapimemberrespvo)|

## GET 查询会员信息

GET /v1/members

查询会员信息

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|merchantId|query|integer| 是 |none|
|externalUserId|query|string| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "id": 0,
    "merchantId": 0,
    "merchantName": "",
    "merchantLogo": "",
    "balance": 0,
    "rewardBalance": 0,
    "totalBalance": 0,
    "totalRecharge": 0,
    "totalConsume": 0,
    "totalReward": 0,
    "status": 0,
    "joinTime": "",
    "externalUserId": ""
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultOpenApiMemberRespVO](#schemacommonresultopenapimemberrespvo)|

## GET 跨商户会员余额列表

GET /v1/members/list

跨商户会员余额列表

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|externalUserId|query|string| 是 |外部用户标识|
|merchantName|query|string| 否 |商户名称（模糊搜索）|
|pageNo|query|integer| 是 |页码，从 1 开始|
|pageSize|query|integer| 是 |每页条数|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "total": 0,
    "list": [
      {
        "id": 0,
        "merchantId": 0,
        "merchantName": "",
        "merchantLogo": "",
        "balance": 0,
        "rewardBalance": 0,
        "totalBalance": 0,
        "totalRecharge": 0,
        "totalConsume": 0,
        "totalReward": 0,
        "status": 0,
        "joinTime": "",
        "externalUserId": ""
      }
    ]
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultPageResultOpenApiMemberWithMerchantRespVO](#schemacommonresultpageresultopenapimemberwithmerchantrespvo)|

## POST 创建充值单

POST /v1/members/{memberId}/recharge

创建充值单

> Body 请求参数

```json
{
  "memberId": 1,
  "merchantId": 1,
  "amount": 1000
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|memberId|path|integer| 是 |none|
|body|body|[OpenApiMemberRechargeReqVO](#schemaopenapimemberrechargereqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "id": 0,
    "rechargeNo": "",
    "memberId": 0,
    "amount": 0,
    "status": 0,
    "payTime": ""
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultOpenApiMemberRechargeRespVO](#schemacommonresultopenapimemberrechargerespvo)|

## GET 查询充值单

GET /v1/members/recharges/{rechargeId}

查询充值单

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|rechargeId|path|integer| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "id": 0,
    "rechargeNo": "",
    "memberId": 0,
    "amount": 0,
    "status": 0,
    "payTime": ""
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultOpenApiMemberRechargeRespVO](#schemacommonresultopenapimemberrechargerespvo)|

## POST 为充值单唤起收银台

POST /v1/members/recharges/{rechargeId}/cashier

为充值单唤起收银台

> Body 请求参数

```json
{
  "returnUrl": "https://app.example.com/recharge/result",
  "expireMinutes": 30
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|rechargeId|path|integer| 是 |none|
|body|body|[OpenApiMemberRechargeCashierReqVO](#schemaopenapimemberrechargecashierreqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "token": "",
    "cashierUrl": ""
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultOpenApiMemberRechargeCashierRespVO](#schemacommonresultopenapimemberrechargecashierrespvo)|

## GET 查询余额流水

GET /v1/members/{memberId}/transactions

查询余额流水

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|memberId|path|integer| 是 |none|
|pageNo|query|integer| 是 |页码，从 1 开始|
|pageSize|query|integer| 是 |每页条数，最大值为 100|
|transactionType|query|integer| 否 |交易类型：1-充值 2-消费 3-退款 4-奖励 5-赠送|
|balanceType|query|integer| 否 |余额类型：1-充值余额 2-奖励余额|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "total": 0,
    "list": [
      {
        "id": 0,
        "memberId": 0,
        "transactionNo": "",
        "transactionType": 0,
        "amount": 0,
        "balanceAfter": 0,
        "rewardBalanceAfter": 0,
        "balanceType": 0,
        "bizType": 0,
        "remark": "",
        "createTime": ""
      }
    ]
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultPageResultOpenApiMemberTransactionRespVO](#schemacommonresultpageresultopenapimembertransactionrespvo)|

## POST 生成会员余额核销二维码

POST /v1/members/{memberId}/write-off-qrcode

生成会员余额核销二维码

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|memberId|path|integer| 是 |none|
|merchantId|query|integer| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "requestNo": "",
    "qrToken": "",
    "qrExpireTime": ""
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultOpenApiMemberWriteOffQrRespVO](#schemacommonresultopenapimemberwriteoffqrrespvo)|

## GET 查询会员余额核销记录

GET /v1/members/write-off-records/{requestNo}

查询会员余额核销记录

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|requestNo|path|string| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "requestNo": "",
    "merchantId": 0,
    "storeId": 0,
    "status": 0,
    "amount": 0,
    "shortfallAmount": 0,
    "memberId": 0,
    "completeTime": "",
    "callbackStatus": 0
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultOpenApiMemberWriteOffRecordRespVO](#schemacommonresultopenapimemberwriteoffrecordrespvo)|

## POST 确认会员余额核销

POST /v1/members/write-off-records/{requestNo}/confirm

确认会员余额核销

> Body 请求参数

```json
{
  "approved": true,
  "remark": "同意扣款"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|requestNo|path|string| 是 |none|
|body|body|[OpenApiMemberWriteOffConfirmReqVO](#schemaopenapimemberwriteoffconfirmreqvo)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "requestNo": "",
    "merchantId": 0,
    "storeId": 0,
    "status": 0,
    "amount": 0,
    "shortfallAmount": 0,
    "memberId": 0,
    "completeTime": "",
    "callbackStatus": 0
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CommonResultOpenApiMemberWriteOffRecordRespVO](#schemacommonresultopenapimemberwriteoffrecordrespvo)|

# 数据模型

<h2 id="tocS_key">key</h2>

<a id="schemakey"></a>
<a id="schema_key"></a>
<a id="tocSkey"></a>
<a id="tocskey"></a>

```json
{}

```

### 属性

*None*

<h2 id="tocS_OpenApiConsumptionTaskRespVO">OpenApiConsumptionTaskRespVO</h2>

<a id="schemaopenapiconsumptiontaskrespvo"></a>
<a id="schema_OpenApiConsumptionTaskRespVO"></a>
<a id="tocSopenapiconsumptiontaskrespvo"></a>
<a id="tocsopenapiconsumptiontaskrespvo"></a>

```json
{
  "id": 0,
  "merchantId": 0,
  "storeScope": 0,
  "storeIds": "string",
  "taskName": "string",
  "description": "string",
  "coverUrl": "string",
  "targetAmount": 0,
  "durationDays": 0,
  "rewardAmount": 0,
  "rewardType": 0,
  "startTime": "string",
  "endTime": "string",
  "participantLimit": 0,
  "participantCount": 0,
  "completedCount": 0,
  "status": 0
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||任务ID|
|merchantId|integer(int64)|false|none||商户ID|
|storeScope|integer|false|none||适用范围：0-全店通用 1-指定门店|
|storeIds|string|false|none||适用门店IDs(JSON数组，storeScope=1时有值)|
|taskName|string|false|none||任务名称|
|description|string|false|none||任务描述|
|coverUrl|string|false|none||封面图URL|
|targetAmount|integer|false|none||达标金额(分)|
|durationDays|integer|false|none||完成天数（从领取开始计算）|
|rewardAmount|integer|false|none||奖励金额(分)|
|rewardType|integer|false|none||奖励类型：1-余额 2-现金|
|startTime|string|false|none||活动开始时间|
|endTime|string|false|none||活动结束时间|
|participantLimit|integer|false|none||参与人数上限（null=不限）|
|participantCount|integer|false|none||已参与人数|
|completedCount|integer|false|none||已完成人数|
|status|integer|false|none||任务状态：0-草稿 1-已上架 2-已下架 3-已结束|

<h2 id="tocS_MapObject">MapObject</h2>

<a id="schemamapobject"></a>
<a id="schema_MapObject"></a>
<a id="tocSmapobject"></a>
<a id="tocsmapobject"></a>

```json
{
  "key": {}
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|key|[key1](#schemakey1)|false|none||none|

<h2 id="tocS_CommonResultListOpenApiConsumptionTaskRespVO">CommonResultListOpenApiConsumptionTaskRespVO</h2>

<a id="schemacommonresultlistopenapiconsumptiontaskrespvo"></a>
<a id="schema_CommonResultListOpenApiConsumptionTaskRespVO"></a>
<a id="tocScommonresultlistopenapiconsumptiontaskrespvo"></a>
<a id="tocscommonresultlistopenapiconsumptiontaskrespvo"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": [
    {
      "id": 0,
      "merchantId": 0,
      "storeScope": 0,
      "storeIds": "string",
      "taskName": "string",
      "description": "string",
      "coverUrl": "string",
      "targetAmount": 0,
      "durationDays": 0,
      "rewardAmount": 0,
      "rewardType": 0,
      "startTime": "string",
      "endTime": "string",
      "participantLimit": 0,
      "participantCount": 0,
      "completedCount": 0,
      "status": 0
    }
  ]
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[[OpenApiConsumptionTaskRespVO](#schemaopenapiconsumptiontaskrespvo)]|false|none||返回数据|

<h2 id="tocS_CommonResultMapObject">CommonResultMapObject</h2>

<a id="schemacommonresultmapobject"></a>
<a id="schema_CommonResultMapObject"></a>
<a id="tocScommonresultmapobject"></a>
<a id="tocscommonresultmapobject"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "key": {}
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[MapObject](#schemamapobject)|false|none||返回数据|

<h2 id="tocS_MerchantInfo">MerchantInfo</h2>

<a id="schemamerchantinfo"></a>
<a id="schema_MerchantInfo"></a>
<a id="tocSmerchantinfo"></a>
<a id="tocsmerchantinfo"></a>

```json
{
  "merchantName": "沐沐美业",
  "merchantLogo": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|merchantName|string|false|none||商户名称|
|merchantLogo|string|false|none||商户Logo URL|

<h2 id="tocS_OpenApiRealNameAuthRespVO">OpenApiRealNameAuthRespVO</h2>

<a id="schemaopenapirealnameauthrespvo"></a>
<a id="schema_OpenApiRealNameAuthRespVO"></a>
<a id="tocSopenapirealnameauthrespvo"></a>
<a id="tocsopenapirealnameauthrespvo"></a>

```json
{
  "id": 1,
  "realName": "张三",
  "idCardNumber": "110101199001011234",
  "idCardFrontUrl": "string",
  "idCardBackUrl": "string",
  "sex": "男",
  "nation": "汉",
  "birth": "1990/01/01",
  "address": "string",
  "authority": "string",
  "validDate": "string",
  "portraitUrl": "string",
  "authStatus": 0,
  "authTime": "string",
  "failReason": "string",
  "authChannel": "TENCENT"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||认证记录ID|
|realName|string|false|none||真实姓名|
|idCardNumber|string|false|none||身份证号|
|idCardFrontUrl|string|false|none||身份证正面照URL|
|idCardBackUrl|string|false|none||身份证背面照URL|
|sex|string|false|none||性别（OCR识别）|
|nation|string|false|none||民族（OCR识别）|
|birth|string|false|none||出生日期（OCR识别）|
|address|string|false|none||住址（OCR识别）|
|authority|string|false|none||签发机关（OCR识别）|
|validDate|string|false|none||有效期限（OCR识别）|
|portraitUrl|string|false|none||身份证头像裁剪图URL|
|authStatus|integer|false|none||认证状态：0-未认证 1-认证中 2-已认证 3-认证失败|
|authTime|string|false|none||认证通过时间|
|failReason|string|false|none||认证失败原因|
|authChannel|string|false|none||认证渠道|

<h2 id="tocS_StoreInfo">StoreInfo</h2>

<a id="schemastoreinfo"></a>
<a id="schema_StoreInfo"></a>
<a id="tocSstoreinfo"></a>
<a id="tocsstoreinfo"></a>

```json
{
  "storeId": 0,
  "storeName": "南山旗舰店",
  "logoUrl": "string",
  "province": "string",
  "city": "string",
  "district": "string",
  "address": "string",
  "contactPhone": "string",
  "longitude": 0,
  "latitude": 0
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|storeId|integer(int64)|false|none||门店ID|
|storeName|string|false|none||门店名称|
|logoUrl|string|false|none||门店Logo URL|
|province|string|false|none||省|
|city|string|false|none||市|
|district|string|false|none||区|
|address|string|false|none||详细地址|
|contactPhone|string|false|none||联系电话|
|longitude|number|false|none||经度|
|latitude|number|false|none||纬度|

<h2 id="tocS_CommonResultOpenApiRealNameAuthRespVO">CommonResultOpenApiRealNameAuthRespVO</h2>

<a id="schemacommonresultopenapirealnameauthrespvo"></a>
<a id="schema_CommonResultOpenApiRealNameAuthRespVO"></a>
<a id="tocScommonresultopenapirealnameauthrespvo"></a>
<a id="tocscommonresultopenapirealnameauthrespvo"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "id": 1,
    "realName": "张三",
    "idCardNumber": "110101199001011234",
    "idCardFrontUrl": "string",
    "idCardBackUrl": "string",
    "sex": "男",
    "nation": "汉",
    "birth": "1990/01/01",
    "address": "string",
    "authority": "string",
    "validDate": "string",
    "portraitUrl": "string",
    "authStatus": 0,
    "authTime": "string",
    "failReason": "string",
    "authChannel": "TENCENT"
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[OpenApiRealNameAuthRespVO](#schemaopenapirealnameauthrespvo)|false|none||返回数据|

<h2 id="tocS_MemberInfo">MemberInfo</h2>

<a id="schemamemberinfo"></a>
<a id="schema_MemberInfo"></a>
<a id="tocSmemberinfo"></a>
<a id="tocsmemberinfo"></a>

```json
{
  "memberId": 0,
  "balance": 0,
  "rewardBalance": 0,
  "totalRecharge": 0,
  "totalConsume": 0,
  "totalReward": 0,
  "joinTime": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|memberId|integer(int64)|false|none||会员ID|
|balance|integer|false|none||充值余额(分)|
|rewardBalance|integer|false|none||奖励余额(分)|
|totalRecharge|integer|false|none||累计充值(分)|
|totalConsume|integer|false|none||累计消费(分)|
|totalReward|integer|false|none||累计奖励(分)|
|joinTime|string|false|none||加入时间|

<h2 id="tocS_OpenApiSubmitIdCardReqVO">OpenApiSubmitIdCardReqVO</h2>

<a id="schemaopenapisubmitidcardreqvo"></a>
<a id="schema_OpenApiSubmitIdCardReqVO"></a>
<a id="tocSopenapisubmitidcardreqvo"></a>
<a id="tocsopenapisubmitidcardreqvo"></a>

```json
{
  "idCardFrontUrl": "https://example.com/front.jpg",
  "idCardBackUrl": "https://example.com/back.jpg"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|idCardFrontUrl|string|false|none||身份证正面（人像面）照片URL|
|idCardBackUrl|string|false|none||身份证背面（国徽面）照片URL|

<h2 id="tocS_PageResultOpenCouponTemplateRespDTO">PageResultOpenCouponTemplateRespDTO</h2>

<a id="schemapageresultopencoupontemplaterespdto"></a>
<a id="schema_PageResultOpenCouponTemplateRespDTO"></a>
<a id="tocSpageresultopencoupontemplaterespdto"></a>
<a id="tocspageresultopencoupontemplaterespdto"></a>

```json
{
  "total": 0,
  "list": [
    {
      "id": 1,
      "merchantId": 1,
      "couponType": 1,
      "name": "满100减20",
      "description": "满100元可使用",
      "coverUrl": "string",
      "discountRate": 85,
      "maxDiscount": 5000,
      "thresholdAmount": 10000,
      "reduceAmount": 2000,
      "giftDescription": "string",
      "purchaseAmount": 0,
      "totalCount": 1000,
      "issuedCount": 100,
      "remainingCount": 900,
      "claimLimit": 1,
      "validityDays": 30,
      "storeScope": 0,
      "storeIds": "string",
      "status": 0,
      "createTime": "string"
    }
  ]
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|total|integer(int64)|false|none||总量|
|list|[[OpenCouponTemplateRespDTO](#schemaopencoupontemplaterespdto)]|false|none||数据|

<h2 id="tocS_OpenApiFixedQrcodeRespVO">OpenApiFixedQrcodeRespVO</h2>

<a id="schemaopenapifixedqrcoderespvo"></a>
<a id="schema_OpenApiFixedQrcodeRespVO"></a>
<a id="tocSopenapifixedqrcoderespvo"></a>
<a id="tocsopenapifixedqrcoderespvo"></a>

```json
{
  "id": 1024,
  "merchantId": 1,
  "openAppId": 100,
  "storeId": 200,
  "code": "FQ1912345678901234",
  "subject": "门店收款",
  "defaultAmount": 10000,
  "qrUrl": "string",
  "qrCodeImageUrl": "string",
  "status": 0,
  "createTime": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||固定收款码ID|
|merchantId|integer(int64)|false|none||商户ID|
|openAppId|integer(int64)|false|none||下游应用ID|
|storeId|integer(int64)|false|none||门店ID|
|code|string|false|none||唯一编码|
|subject|string|false|none||收款标题|
|defaultAmount|integer|false|none||默认收款金额（分）|
|qrUrl|string|false|none||二维码链接内容（完整URL）|
|qrCodeImageUrl|string|false|none||二维码图片地址|
|status|integer|false|none||状态：0-启用 1-停用|
|createTime|string|false|none||创建时间|

<h2 id="tocS_MyRecord">MyRecord</h2>

<a id="schemamyrecord"></a>
<a id="schema_MyRecord"></a>
<a id="tocSmyrecord"></a>
<a id="tocsmyrecord"></a>

```json
{
  "recordId": 0,
  "progressAmount": 0,
  "targetAmount": 0,
  "rewardAmount": 0,
  "rewardType": 0,
  "status": 0,
  "claimTime": "string",
  "expireTime": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|recordId|integer(int64)|false|none||记录ID|
|progressAmount|integer|false|none||当前进度金额(分)|
|targetAmount|integer|false|none||达标金额(分)|
|rewardAmount|integer|false|none||奖励金额(分)|
|rewardType|integer|false|none||奖励类型：1-余额 2-现金|
|status|integer|false|none||记录状态：0-进行中 1-已达标 2-已完成 3-已过期 4-已失效 5-已取消|
|claimTime|string|false|none||领取时间|
|expireTime|string|false|none||到期时间|

<h2 id="tocS_OpenApiFaceAuthParamsRespVO">OpenApiFaceAuthParamsRespVO</h2>

<a id="schemaopenapifaceauthparamsrespvo"></a>
<a id="schema_OpenApiFaceAuthParamsRespVO"></a>
<a id="tocSopenapifaceauthparamsrespvo"></a>
<a id="tocsopenapifaceauthparamsrespvo"></a>

```json
{
  "appId": "string",
  "userId": "string",
  "faceId": "string",
  "orderNo": "string",
  "nonce": "string",
  "sign": "string",
  "version": "string",
  "licence": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|appId|string|false|none||业务流程唯一标识（WBappid）|
|userId|string|false|none||用户唯一标识|
|faceId|string|false|none||人脸核身标识（有效期5分钟）|
|orderNo|string|false|none||订单号|
|nonce|string|false|none||32位随机字符串|
|sign|string|false|none||SDK 签名|
|version|string|false|none||版本号|
|licence|string|false|none||许可证（licence）|

<h2 id="tocS_CommonResultPageResultOpenCouponTemplateRespDTO">CommonResultPageResultOpenCouponTemplateRespDTO</h2>

<a id="schemacommonresultpageresultopencoupontemplaterespdto"></a>
<a id="schema_CommonResultPageResultOpenCouponTemplateRespDTO"></a>
<a id="tocScommonresultpageresultopencoupontemplaterespdto"></a>
<a id="tocscommonresultpageresultopencoupontemplaterespdto"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "total": 0,
    "list": [
      {
        "id": 1,
        "merchantId": 1,
        "couponType": 1,
        "name": "满100减20",
        "description": "满100元可使用",
        "coverUrl": "string",
        "discountRate": 85,
        "maxDiscount": 5000,
        "thresholdAmount": 10000,
        "reduceAmount": 2000,
        "giftDescription": "string",
        "purchaseAmount": 0,
        "totalCount": 1000,
        "issuedCount": 100,
        "remainingCount": 900,
        "claimLimit": 1,
        "validityDays": 30,
        "storeScope": 0,
        "storeIds": "string",
        "status": 0,
        "createTime": "string"
      }
    ]
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[PageResultOpenCouponTemplateRespDTO](#schemapageresultopencoupontemplaterespdto)|false|none||返回数据|

<h2 id="tocS_CommonResultOpenApiFixedQrcodeRespVO">CommonResultOpenApiFixedQrcodeRespVO</h2>

<a id="schemacommonresultopenapifixedqrcoderespvo"></a>
<a id="schema_CommonResultOpenApiFixedQrcodeRespVO"></a>
<a id="tocScommonresultopenapifixedqrcoderespvo"></a>
<a id="tocscommonresultopenapifixedqrcoderespvo"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "id": 1024,
    "merchantId": 1,
    "openAppId": 100,
    "storeId": 200,
    "code": "FQ1912345678901234",
    "subject": "门店收款",
    "defaultAmount": 10000,
    "qrUrl": "string",
    "qrCodeImageUrl": "string",
    "status": 0,
    "createTime": "string"
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[OpenApiFixedQrcodeRespVO](#schemaopenapifixedqrcoderespvo)|false|none||返回数据|

<h2 id="tocS_RechargeRecord">RechargeRecord</h2>

<a id="schemarechargerecord"></a>
<a id="schema_RechargeRecord"></a>
<a id="tocSrechargerecord"></a>
<a id="tocsrechargerecord"></a>

```json
{
  "rechargeId": 0,
  "amount": 0,
  "payTime": "string",
  "rechargeNo": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|rechargeId|integer(int64)|false|none||充值单ID|
|amount|integer|false|none||充值金额(分)|
|payTime|string|false|none||支付时间|
|rechargeNo|string|false|none||充值单号|

<h2 id="tocS_CommonResultOpenApiFaceAuthParamsRespVO">CommonResultOpenApiFaceAuthParamsRespVO</h2>

<a id="schemacommonresultopenapifaceauthparamsrespvo"></a>
<a id="schema_CommonResultOpenApiFaceAuthParamsRespVO"></a>
<a id="tocScommonresultopenapifaceauthparamsrespvo"></a>
<a id="tocscommonresultopenapifaceauthparamsrespvo"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "appId": "string",
    "userId": "string",
    "faceId": "string",
    "orderNo": "string",
    "nonce": "string",
    "sign": "string",
    "version": "string",
    "licence": "string"
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[OpenApiFaceAuthParamsRespVO](#schemaopenapifaceauthparamsrespvo)|false|none||返回数据|

<h2 id="tocS_OpenApiFixedQrcodeCreateReqVO">OpenApiFixedQrcodeCreateReqVO</h2>

<a id="schemaopenapifixedqrcodecreatereqvo"></a>
<a id="schema_OpenApiFixedQrcodeCreateReqVO"></a>
<a id="tocSopenapifixedqrcodecreatereqvo"></a>
<a id="tocsopenapifixedqrcodecreatereqvo"></a>

```json
{
  "merchantId": 1,
  "storeId": 200,
  "subject": "门店收款",
  "defaultAmount": 10000
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|merchantId|integer(int64)|true|none||商户ID|
|storeId|integer(int64)|false|none||门店ID（可选）|
|subject|string|false|none||收款标题|
|defaultAmount|integer|false|none||默认收款金额（分），不填则顾客手动输入|

<h2 id="tocS_OpenApiTaskDetailRespVO">OpenApiTaskDetailRespVO</h2>

<a id="schemaopenapitaskdetailrespvo"></a>
<a id="schema_OpenApiTaskDetailRespVO"></a>
<a id="tocSopenapitaskdetailrespvo"></a>
<a id="tocsopenapitaskdetailrespvo"></a>

```json
{
  "id": 0,
  "merchantId": 0,
  "storeScope": 0,
  "storeIds": "string",
  "taskName": "string",
  "description": "string",
  "coverUrl": "string",
  "targetAmount": 0,
  "durationDays": 0,
  "rewardAmount": 0,
  "rewardType": 0,
  "startTime": "string",
  "endTime": "string",
  "participantLimit": 0,
  "participantCount": 0,
  "completedCount": 0,
  "status": 0,
  "merchantInfo": {
    "merchantName": "沐沐美业",
    "merchantLogo": "string"
  },
  "storeInfoList": [
    {
      "storeId": 0,
      "storeName": "南山旗舰店",
      "logoUrl": "string",
      "province": "string",
      "city": "string",
      "district": "string",
      "address": "string",
      "contactPhone": "string",
      "longitude": 0,
      "latitude": 0
    }
  ],
  "memberInfo": {
    "memberId": 0,
    "balance": 0,
    "rewardBalance": 0,
    "totalRecharge": 0,
    "totalConsume": 0,
    "totalReward": 0,
    "joinTime": "string"
  },
  "myRecord": {
    "recordId": 0,
    "progressAmount": 0,
    "targetAmount": 0,
    "rewardAmount": 0,
    "rewardType": 0,
    "status": 0,
    "claimTime": "string",
    "expireTime": "string"
  },
  "rechargeRecords": [
    {
      "rechargeId": 0,
      "amount": 0,
      "payTime": "string",
      "rechargeNo": "string"
    }
  ]
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||任务ID|
|merchantId|integer(int64)|false|none||商户ID|
|storeScope|integer|false|none||适用范围：0-全店通用 1-指定门店|
|storeIds|string|false|none||适用门店IDs(JSON数组，storeScope=1时有值)|
|taskName|string|false|none||任务名称|
|description|string|false|none||任务描述|
|coverUrl|string|false|none||封面图URL|
|targetAmount|integer|false|none||达标金额(分)|
|durationDays|integer|false|none||完成天数（从领取开始计算）|
|rewardAmount|integer|false|none||奖励金额(分)|
|rewardType|integer|false|none||奖励类型：1-余额 2-现金|
|startTime|string|false|none||活动开始时间|
|endTime|string|false|none||活动结束时间|
|participantLimit|integer|false|none||参与人数上限（null=不限）|
|participantCount|integer|false|none||已参与人数|
|completedCount|integer|false|none||已完成人数|
|status|integer|false|none||任务状态：0-草稿 1-已上架 2-已下架 3-已结束|
|merchantInfo|[MerchantInfo](#schemamerchantinfo)|false|none||商户信息|
|storeInfoList|[[StoreInfo](#schemastoreinfo)]|false|none||适用门店列表（storeScope=0 时为空，storeScope=1 时返回指定门店信息）|
|memberInfo|[MemberInfo](#schemamemberinfo)|false|none||当前用户的余额卡信息（未传 externalUserId 时为 null）|
|myRecord|[MyRecord](#schemamyrecord)|false|none||当前用户在该任务上的进度（未传 externalUserId 或未领取时为 null）|
|rechargeRecords|[[RechargeRecord](#schemarechargerecord)]|false|none||任务期间的充值记录（任务领取后到当前/到期之间的已支付充值记录，未领取时为 null）|

<h2 id="tocS_OpenStatisticsOverviewRespDTO">OpenStatisticsOverviewRespDTO</h2>

<a id="schemaopenstatisticsoverviewrespdto"></a>
<a id="schema_OpenStatisticsOverviewRespDTO"></a>
<a id="tocSopenstatisticsoverviewrespdto"></a>
<a id="tocsopenstatisticsoverviewrespdto"></a>

```json
{
  "todayRevenue": 150000,
  "todayOrderCount": 25,
  "todayWriteOffCount": 10,
  "todayNewMemberCount": 5,
  "pendingWriteOffCount": 8,
  "pendingCardApprovalCount": 3,
  "totalMemberCount": 200,
  "accountBalance": 500000
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|todayRevenue|integer|false|none||今日营收(分)|
|todayOrderCount|integer|false|none||今日订单数|
|todayWriteOffCount|integer|false|none||今日核销数|
|todayNewMemberCount|integer|false|none||今日新增会员数|
|pendingWriteOffCount|integer|false|none||待核销订单数|
|pendingCardApprovalCount|integer|false|none||待审核开卡数|
|totalMemberCount|integer|false|none||会员总数|
|accountBalance|integer|false|none||账户余额(分)|

<h2 id="tocS_OpenApiCashVoucherAcquireRespVO">OpenApiCashVoucherAcquireRespVO</h2>

<a id="schemaopenapicashvoucheracquirerespvo"></a>
<a id="schema_OpenApiCashVoucherAcquireRespVO"></a>
<a id="tocSopenapicashvoucheracquirerespvo"></a>
<a id="tocsopenapicashvoucheracquirerespvo"></a>

```json
{
  "resultType": "string",
  "id": 0
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|resultType|string|false|none||none|
|id|integer(int64)|false|none||none|

<h2 id="tocS_CommonResultOpenApiTaskDetailRespVO">CommonResultOpenApiTaskDetailRespVO</h2>

<a id="schemacommonresultopenapitaskdetailrespvo"></a>
<a id="schema_CommonResultOpenApiTaskDetailRespVO"></a>
<a id="tocScommonresultopenapitaskdetailrespvo"></a>
<a id="tocscommonresultopenapitaskdetailrespvo"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "id": 0,
    "merchantId": 0,
    "storeScope": 0,
    "storeIds": "string",
    "taskName": "string",
    "description": "string",
    "coverUrl": "string",
    "targetAmount": 0,
    "durationDays": 0,
    "rewardAmount": 0,
    "rewardType": 0,
    "startTime": "string",
    "endTime": "string",
    "participantLimit": 0,
    "participantCount": 0,
    "completedCount": 0,
    "status": 0,
    "merchantInfo": {
      "merchantName": "沐沐美业",
      "merchantLogo": "string"
    },
    "storeInfoList": [
      {
        "storeId": 0,
        "storeName": "南山旗舰店",
        "logoUrl": "string",
        "province": "string",
        "city": "string",
        "district": "string",
        "address": "string",
        "contactPhone": "string",
        "longitude": 0,
        "latitude": 0
      }
    ],
    "memberInfo": {
      "memberId": 0,
      "balance": 0,
      "rewardBalance": 0,
      "totalRecharge": 0,
      "totalConsume": 0,
      "totalReward": 0,
      "joinTime": "string"
    },
    "myRecord": {
      "recordId": 0,
      "progressAmount": 0,
      "targetAmount": 0,
      "rewardAmount": 0,
      "rewardType": 0,
      "status": 0,
      "claimTime": "string",
      "expireTime": "string"
    },
    "rechargeRecords": [
      {
        "rechargeId": 0,
        "amount": 0,
        "payTime": "string",
        "rechargeNo": "string"
      }
    ]
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[OpenApiTaskDetailRespVO](#schemaopenapitaskdetailrespvo)|false|none||返回数据|

<h2 id="tocS_CommonResultOpenStatisticsOverviewRespDTO">CommonResultOpenStatisticsOverviewRespDTO</h2>

<a id="schemacommonresultopenstatisticsoverviewrespdto"></a>
<a id="schema_CommonResultOpenStatisticsOverviewRespDTO"></a>
<a id="tocScommonresultopenstatisticsoverviewrespdto"></a>
<a id="tocscommonresultopenstatisticsoverviewrespdto"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "todayRevenue": 150000,
    "todayOrderCount": 25,
    "todayWriteOffCount": 10,
    "todayNewMemberCount": 5,
    "pendingWriteOffCount": 8,
    "pendingCardApprovalCount": 3,
    "totalMemberCount": 200,
    "accountBalance": 500000
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[OpenStatisticsOverviewRespDTO](#schemaopenstatisticsoverviewrespdto)|false|none||返回数据|

<h2 id="tocS_CommonResultOpenApiCashVoucherAcquireRespVO">CommonResultOpenApiCashVoucherAcquireRespVO</h2>

<a id="schemacommonresultopenapicashvoucheracquirerespvo"></a>
<a id="schema_CommonResultOpenApiCashVoucherAcquireRespVO"></a>
<a id="tocScommonresultopenapicashvoucheracquirerespvo"></a>
<a id="tocscommonresultopenapicashvoucheracquirerespvo"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "resultType": "string",
    "id": 0
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[OpenApiCashVoucherAcquireRespVO](#schemaopenapicashvoucheracquirerespvo)|false|none||返回数据|

<h2 id="tocS_CommonResultListOpenApiFixedQrcodeRespVO">CommonResultListOpenApiFixedQrcodeRespVO</h2>

<a id="schemacommonresultlistopenapifixedqrcoderespvo"></a>
<a id="schema_CommonResultListOpenApiFixedQrcodeRespVO"></a>
<a id="tocScommonresultlistopenapifixedqrcoderespvo"></a>
<a id="tocscommonresultlistopenapifixedqrcoderespvo"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": [
    {
      "id": 1024,
      "merchantId": 1,
      "openAppId": 100,
      "storeId": 200,
      "code": "FQ1912345678901234",
      "subject": "门店收款",
      "defaultAmount": 10000,
      "qrUrl": "string",
      "qrCodeImageUrl": "string",
      "status": 0,
      "createTime": "string"
    }
  ]
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[[OpenApiFixedQrcodeRespVO](#schemaopenapifixedqrcoderespvo)]|false|none||返回数据|

<h2 id="tocS_TaskItem">TaskItem</h2>

<a id="schemataskitem"></a>
<a id="schema_TaskItem"></a>
<a id="tocStaskitem"></a>
<a id="tocstaskitem"></a>

```json
{
  "id": 0,
  "taskId": 0,
  "taskName": "string",
  "targetAmount": 0,
  "progressAmount": 0,
  "completionRate": 0,
  "rewardAmount": 0,
  "rewardType": 0,
  "status": 0,
  "claimTime": "string",
  "expireTime": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||记录ID|
|taskId|integer(int64)|false|none||任务ID|
|taskName|string|false|none||任务名称|
|targetAmount|integer|false|none||达标金额(分)|
|progressAmount|integer|false|none||当前进度(分)|
|completionRate|integer|false|none||完成进度百分比(0~100)|
|rewardAmount|integer|false|none||奖励金额(分)|
|rewardType|integer|false|none||奖励类型：1-余额 2-现金|
|status|integer|false|none||记录状态：0-进行中 1-已达标 2-已完成 3-已过期 4-已失效 5-已取消|
|claimTime|string|false|none||领取时间|
|expireTime|string|false|none||到期时间|

<h2 id="tocS_TrendItem">TrendItem</h2>

<a id="schematrenditem"></a>
<a id="schema_TrendItem"></a>
<a id="tocStrenditem"></a>
<a id="tocstrenditem"></a>

```json
{
  "date": "2026-03-13",
  "revenue": 80000,
  "orderCount": 15
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|date|string|false|none||日期(yyyy-MM-dd)|
|revenue|integer|false|none||当日营收(分)|
|orderCount|integer|false|none||当日订单数|

<h2 id="tocS_OpenApiCashVoucherAcquireReqVO">OpenApiCashVoucherAcquireReqVO</h2>

<a id="schemaopenapicashvoucheracquirereqvo"></a>
<a id="schema_OpenApiCashVoucherAcquireReqVO"></a>
<a id="tocSopenapicashvoucheracquirereqvo"></a>
<a id="tocsopenapicashvoucheracquirereqvo"></a>

```json
{
  "merchantId": 0,
  "sourceType": 1,
  "memberCardNo": "MC20240001",
  "deductPhone": "13800138000",
  "amount": 1,
  "discountRate": 90,
  "externalUserId": "ext_user_001",
  "bizNo": "cv_order_001",
  "storeId": 1
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|merchantId|integer(int64)|true|none||none|
|sourceType|integer|true|none||获取方式：1-普通支付购券 2-会员余额直接扣减购券 3-自营支付购券(支付后从会员余额扣减) 5-会员余额扣减购券|
|memberCardNo|string|false|none||会员卡卡号（已废弃，sourceType=2 已切换为会员余额直扣，此字段不再生效）|
|deductPhone|string|false|none||手机号，sourceType=3 时用于定位用户在商户的会员余额|
|amount|integer|true|none||none|
|discountRate|integer|false|none||外部支付折扣率，仅 sourceType=1/3 时生效，90 表示 9 折|
|externalUserId|string|true|none||下游 App 用户标识，需先完成客户进件|
|bizNo|string|false|none||下游业务号，平台仅存储并在抵金券购买相关事件回调中原样透传|
|storeId|integer(int64)|false|none||门店ID，标记用户在哪个门店购买|

<h2 id="tocS_OpenApiStoreTaskGroupRespVO">OpenApiStoreTaskGroupRespVO</h2>

<a id="schemaopenapistoretaskgrouprespvo"></a>
<a id="schema_OpenApiStoreTaskGroupRespVO"></a>
<a id="tocSopenapistoretaskgrouprespvo"></a>
<a id="tocsopenapistoretaskgrouprespvo"></a>

```json
{
  "storeId": 0,
  "storeName": "string",
  "merchantId": 0,
  "merchantName": "string",
  "merchantLogo": "string",
  "memberBalance": 0,
  "memberRewardBalance": 0,
  "tasks": [
    {
      "id": 0,
      "taskId": 0,
      "taskName": "string",
      "targetAmount": 0,
      "progressAmount": 0,
      "completionRate": 0,
      "rewardAmount": 0,
      "rewardType": 0,
      "status": 0,
      "claimTime": "string",
      "expireTime": "string"
    }
  ]
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|storeId|integer(int64)|false|none||门店ID（未指定门店时为 null）|
|storeName|string|false|none||门店名称（未指定门店时使用商户名称）|
|merchantId|integer(int64)|false|none||商户ID|
|merchantName|string|false|none||商户名称|
|merchantLogo|string|false|none||商户Logo URL|
|memberBalance|integer|false|none||用户在该商户的充值余额(分)|
|memberRewardBalance|integer|false|none||用户在该商户的奖励余额(分)|
|tasks|[[TaskItem](#schemataskitem)]|false|none||组内任务列表（按完成进度降序排列）|

<h2 id="tocS_OpenStatisticsSalesRespDTO">OpenStatisticsSalesRespDTO</h2>

<a id="schemaopenstatisticssalesrespdto"></a>
<a id="schema_OpenStatisticsSalesRespDTO"></a>
<a id="tocSopenstatisticssalesrespdto"></a>
<a id="tocsopenstatisticssalesrespdto"></a>

```json
{
  "period": "week",
  "totalIncome": 500000,
  "totalRefund": 30000,
  "netIncome": 470000,
  "orderCount": 120,
  "refundCount": 5,
  "trendItems": "[]"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|period|string|false|none||统计周期|
|totalIncome|integer|false|none||总收入(分)|
|totalRefund|integer|false|none||总退款(分)|
|netIncome|integer|false|none||净收入(分)|
|orderCount|integer|false|none||订单笔数|
|refundCount|integer|false|none||退款笔数|
|trendItems|[[TrendItem](#schematrenditem)]|false|none||营收趋势|

<h2 id="tocS_CashVoucherPurchaseCashierRespDTO">CashVoucherPurchaseCashierRespDTO</h2>

<a id="schemacashvoucherpurchasecashierrespdto"></a>
<a id="schema_CashVoucherPurchaseCashierRespDTO"></a>
<a id="tocScashvoucherpurchasecashierrespdto"></a>
<a id="tocscashvoucherpurchasecashierrespdto"></a>

```json
{
  "tradeNo": "string",
  "cashierUrl": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|tradeNo|string|false|none||none|
|cashierUrl|string|false|none||none|

<h2 id="tocS_CommonResultListOpenApiStoreTaskGroupRespVO">CommonResultListOpenApiStoreTaskGroupRespVO</h2>

<a id="schemacommonresultlistopenapistoretaskgrouprespvo"></a>
<a id="schema_CommonResultListOpenApiStoreTaskGroupRespVO"></a>
<a id="tocScommonresultlistopenapistoretaskgrouprespvo"></a>
<a id="tocscommonresultlistopenapistoretaskgrouprespvo"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": [
    {
      "storeId": 0,
      "storeName": "string",
      "merchantId": 0,
      "merchantName": "string",
      "merchantLogo": "string",
      "memberBalance": 0,
      "memberRewardBalance": 0,
      "tasks": [
        {
          "id": 0,
          "taskId": 0,
          "taskName": "string",
          "targetAmount": 0,
          "progressAmount": 0,
          "completionRate": 0,
          "rewardAmount": 0,
          "rewardType": 0,
          "status": 0,
          "claimTime": "string",
          "expireTime": "string"
        }
      ]
    }
  ]
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[[OpenApiStoreTaskGroupRespVO](#schemaopenapistoretaskgrouprespvo)]|false|none||返回数据|

<h2 id="tocS_CommonResultOpenStatisticsSalesRespDTO">CommonResultOpenStatisticsSalesRespDTO</h2>

<a id="schemacommonresultopenstatisticssalesrespdto"></a>
<a id="schema_CommonResultOpenStatisticsSalesRespDTO"></a>
<a id="tocScommonresultopenstatisticssalesrespdto"></a>
<a id="tocscommonresultopenstatisticssalesrespdto"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "period": "week",
    "totalIncome": 500000,
    "totalRefund": 30000,
    "netIncome": 470000,
    "orderCount": 120,
    "refundCount": 5,
    "trendItems": "[]"
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[OpenStatisticsSalesRespDTO](#schemaopenstatisticssalesrespdto)|false|none||返回数据|

<h2 id="tocS_OpenMemberCardPurchaseDetailRespDTO">OpenMemberCardPurchaseDetailRespDTO</h2>

<a id="schemaopenmembercardpurchasedetailrespdto"></a>
<a id="schema_OpenMemberCardPurchaseDetailRespDTO"></a>
<a id="tocSopenmembercardpurchasedetailrespdto"></a>
<a id="tocsopenmembercardpurchasedetailrespdto"></a>

```json
{
  "purchaseId": 1,
  "bizNo": "mc_order_20260329_001",
  "paymentMode": 1,
  "payableAmount": 1000,
  "status": 0,
  "statusName": "待支付",
  "nextAction": "PAY",
  "payOrderId": 10001,
  "cardNo": "MC20240001",
  "applyId": 1,
  "storeId": 1
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|purchaseId|integer(int64)|false|none||购买单ID|
|bizNo|string|false|none||下游业务号|
|paymentMode|integer|false|none||支付模式：0-全额付款 1-分期付款 2-延期付款|
|payableAmount|integer|false|none||本次应支付金额（分）|
|status|integer|false|none||购买单状态|
|statusName|string|false|none||购买单状态名称|
|nextAction|string|false|none||下一步动作：PAY/NONE|
|payOrderId|integer(int64)|false|none||支付单ID|
|cardNo|string|false|none||会员卡卡号|
|applyId|integer(int64)|false|none||赊账申请ID|
|storeId|integer(int64)|false|none||门店ID，标记用户在哪个门店购买|

<h2 id="tocS_CommonResultCashVoucherPurchaseCashierRespDTO">CommonResultCashVoucherPurchaseCashierRespDTO</h2>

<a id="schemacommonresultcashvoucherpurchasecashierrespdto"></a>
<a id="schema_CommonResultCashVoucherPurchaseCashierRespDTO"></a>
<a id="tocScommonresultcashvoucherpurchasecashierrespdto"></a>
<a id="tocscommonresultcashvoucherpurchasecashierrespdto"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "tradeNo": "string",
    "cashierUrl": "string"
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[CashVoucherPurchaseCashierRespDTO](#schemacashvoucherpurchasecashierrespdto)|false|none||返回数据|

<h2 id="tocS_OpenApiTaskStoreStatsRespVO">OpenApiTaskStoreStatsRespVO</h2>

<a id="schemaopenapitaskstorestatsrespvo"></a>
<a id="schema_OpenApiTaskStoreStatsRespVO"></a>
<a id="tocSopenapitaskstorestatsrespvo"></a>
<a id="tocsopenapitaskstorestatsrespvo"></a>

```json
{
  "taskCount": 3,
  "participantCount": 120
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|taskCount|integer|false|none||适用于该门店的任务数量|
|participantCount|integer(int64)|false|none||参与人数（去重，跨任务统计）|

<h2 id="tocS_OpenStatisticsCustomerRespDTO">OpenStatisticsCustomerRespDTO</h2>

<a id="schemaopenstatisticscustomerrespdto"></a>
<a id="schema_OpenStatisticsCustomerRespDTO"></a>
<a id="tocSopenstatisticscustomerrespdto"></a>
<a id="tocsopenstatisticscustomerrespdto"></a>

```json
{
  "totalCustomers": 200,
  "activeCustomers": 150,
  "frozenCustomers": 10,
  "expiredCustomers": 30,
  "cancelledCustomers": 5,
  "overdueFrozenCustomers": 5,
  "todayNewCustomers": 3,
  "totalReceivable": 1000000,
  "totalReceived": 800000,
  "totalPending": 200000,
  "totalOverdue": 50000
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|totalCustomers|integer(int64)|false|none||客户总数|
|activeCustomers|integer(int64)|false|none||正常客户数|
|frozenCustomers|integer(int64)|false|none||冻结客户数|
|expiredCustomers|integer(int64)|false|none||已过期客户数|
|cancelledCustomers|integer(int64)|false|none||已退卡客户数|
|overdueFrozenCustomers|integer(int64)|false|none||逾期冻结客户数|
|todayNewCustomers|integer(int64)|false|none||今日新增客户数|
|totalReceivable|integer(int64)|false|none||应收总额(分)|
|totalReceived|integer(int64)|false|none||已收金额(分)|
|totalPending|integer(int64)|false|none||待收金额(分)|
|totalOverdue|integer(int64)|false|none||逾期金额(分)|

<h2 id="tocS_CommonResultOpenMemberCardPurchaseDetailRespDTO">CommonResultOpenMemberCardPurchaseDetailRespDTO</h2>

<a id="schemacommonresultopenmembercardpurchasedetailrespdto"></a>
<a id="schema_CommonResultOpenMemberCardPurchaseDetailRespDTO"></a>
<a id="tocScommonresultopenmembercardpurchasedetailrespdto"></a>
<a id="tocscommonresultopenmembercardpurchasedetailrespdto"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "purchaseId": 1,
    "bizNo": "mc_order_20260329_001",
    "paymentMode": 1,
    "payableAmount": 1000,
    "status": 0,
    "statusName": "待支付",
    "nextAction": "PAY",
    "payOrderId": 10001,
    "cardNo": "MC20240001",
    "applyId": 1,
    "storeId": 1
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[OpenMemberCardPurchaseDetailRespDTO](#schemaopenmembercardpurchasedetailrespdto)|false|none||返回数据|

<h2 id="tocS_OpenApiCashVoucherPurchaseCashierReqVO">OpenApiCashVoucherPurchaseCashierReqVO</h2>

<a id="schemaopenapicashvoucherpurchasecashierreqvo"></a>
<a id="schema_OpenApiCashVoucherPurchaseCashierReqVO"></a>
<a id="tocSopenapicashvoucherpurchasecashierreqvo"></a>
<a id="tocsopenapicashvoucherpurchasecashierreqvo"></a>

```json
{
  "returnUrl": "string",
  "expireMinutes": 1
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|returnUrl|string|false|none||none|
|expireMinutes|integer|false|none||none|

<h2 id="tocS_CommonResultOpenApiTaskStoreStatsRespVO">CommonResultOpenApiTaskStoreStatsRespVO</h2>

<a id="schemacommonresultopenapitaskstorestatsrespvo"></a>
<a id="schema_CommonResultOpenApiTaskStoreStatsRespVO"></a>
<a id="tocScommonresultopenapitaskstorestatsrespvo"></a>
<a id="tocscommonresultopenapitaskstorestatsrespvo"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "taskCount": 3,
    "participantCount": 120
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[OpenApiTaskStoreStatsRespVO](#schemaopenapitaskstorestatsrespvo)|false|none||返回数据|

<h2 id="tocS_CommonResultOpenStatisticsCustomerRespDTO">CommonResultOpenStatisticsCustomerRespDTO</h2>

<a id="schemacommonresultopenstatisticscustomerrespdto"></a>
<a id="schema_CommonResultOpenStatisticsCustomerRespDTO"></a>
<a id="tocScommonresultopenstatisticscustomerrespdto"></a>
<a id="tocscommonresultopenstatisticscustomerrespdto"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "totalCustomers": 200,
    "activeCustomers": 150,
    "frozenCustomers": 10,
    "expiredCustomers": 30,
    "cancelledCustomers": 5,
    "overdueFrozenCustomers": 5,
    "todayNewCustomers": 3,
    "totalReceivable": 1000000,
    "totalReceived": 800000,
    "totalPending": 200000,
    "totalOverdue": 50000
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[OpenStatisticsCustomerRespDTO](#schemaopenstatisticscustomerrespdto)|false|none||返回数据|

<h2 id="tocS_CashVoucherPurchaseDetailRespDTO">CashVoucherPurchaseDetailRespDTO</h2>

<a id="schemacashvoucherpurchasedetailrespdto"></a>
<a id="schema_CashVoucherPurchaseDetailRespDTO"></a>
<a id="tocScashvoucherpurchasedetailrespdto"></a>
<a id="tocscashvoucherpurchasedetailrespdto"></a>

```json
{
  "purchaseId": 0,
  "sourceType": 0,
  "amount": 0,
  "payableAmount": 9000,
  "status": 0,
  "statusName": "string",
  "nextAction": "string",
  "payOrderId": 0,
  "voucherId": 0,
  "memberCardNo": "MC20240001",
  "deductPhone": "13800138000",
  "deductMemberCardNo": "MC20240001",
  "payeeBizType": 1,
  "payeeBizId": 1,
  "storeId": 1
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|purchaseId|integer(int64)|false|none||none|
|sourceType|integer|false|none||none|
|amount|integer|false|none||none|
|payableAmount|integer|false|none||应付金额，单位分|
|status|integer|false|none||none|
|statusName|string|false|none||none|
|nextAction|string|false|none||none|
|payOrderId|integer(int64)|false|none||none|
|voucherId|integer(int64)|false|none||none|
|memberCardNo|string|false|none||指定扣减会员卡卡号|
|deductPhone|string|false|none||扣卡手机号快照|
|deductMemberCardNo|string|false|none||实际扣减的主会员卡卡号|
|payeeBizType|integer|false|none||收款归属业务类型：1-商户 2-开发者|
|payeeBizId|integer(int64)|false|none||收款归属业务ID：商户ID或openAppId|
|storeId|integer(int64)|false|none||门店ID，标记用户在哪个门店购买|

<h2 id="tocS_OpenApiTaskRecordRespVO">OpenApiTaskRecordRespVO</h2>

<a id="schemaopenapitaskrecordrespvo"></a>
<a id="schema_OpenApiTaskRecordRespVO"></a>
<a id="tocSopenapitaskrecordrespvo"></a>
<a id="tocsopenapitaskrecordrespvo"></a>

```json
{
  "id": 0,
  "taskId": 0,
  "memberId": 0,
  "storeId": 0,
  "taskName": "string",
  "targetAmount": 0,
  "progressAmount": 0,
  "rewardAmount": 0,
  "rewardType": 0,
  "status": 0,
  "claimTime": "string",
  "expireTime": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||记录ID|
|taskId|integer(int64)|false|none||任务ID|
|memberId|integer(int64)|false|none||会员ID|
|storeId|integer(int64)|false|none||领取门店ID|
|taskName|string|false|none||任务名称|
|targetAmount|integer|false|none||达标金额(分)|
|progressAmount|integer|false|none||当前进度(分)|
|rewardAmount|integer|false|none||奖励金额(分)|
|rewardType|integer|false|none||奖励类型：1-余额 2-现金|
|status|integer|false|none||记录状态：0-进行中 1-已达标 2-已完成 3-已过期 4-已失效 5-已取消|
|claimTime|string|false|none||领取时间|
|expireTime|string|false|none||到期时间|

<h2 id="tocS_BreakdownItem">BreakdownItem</h2>

<a id="schemabreakdownitem"></a>
<a id="schema_BreakdownItem"></a>
<a id="tocSbreakdownitem"></a>
<a id="tocsbreakdownitem"></a>

```json
{
  "name": "微信小程序",
  "amount": 200000,
  "percentage": 45
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|name|string|false|none||分组名称|
|amount|integer|false|none||金额(分)|
|percentage|integer|false|none||占比(%)|

<h2 id="tocS_OpenMemberCardPurchaseCashierRespDTO">OpenMemberCardPurchaseCashierRespDTO</h2>

<a id="schemaopenmembercardpurchasecashierrespdto"></a>
<a id="schema_OpenMemberCardPurchaseCashierRespDTO"></a>
<a id="tocSopenmembercardpurchasecashierrespdto"></a>
<a id="tocsopenmembercardpurchasecashierrespdto"></a>

```json
{
  "tradeNo": "10001",
  "cashierUrl": "https://pay.platform.com/cashier.html?token=xxx"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|tradeNo|string|false|none||平台交易号|
|cashierUrl|string|false|none||收银台页面URL|

<h2 id="tocS_CommonResultCashVoucherPurchaseDetailRespDTO">CommonResultCashVoucherPurchaseDetailRespDTO</h2>

<a id="schemacommonresultcashvoucherpurchasedetailrespdto"></a>
<a id="schema_CommonResultCashVoucherPurchaseDetailRespDTO"></a>
<a id="tocScommonresultcashvoucherpurchasedetailrespdto"></a>
<a id="tocscommonresultcashvoucherpurchasedetailrespdto"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "purchaseId": 0,
    "sourceType": 0,
    "amount": 0,
    "payableAmount": 9000,
    "status": 0,
    "statusName": "string",
    "nextAction": "string",
    "payOrderId": 0,
    "voucherId": 0,
    "memberCardNo": "MC20240001",
    "deductPhone": "13800138000",
    "deductMemberCardNo": "MC20240001",
    "payeeBizType": 1,
    "payeeBizId": 1,
    "storeId": 1
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[CashVoucherPurchaseDetailRespDTO](#schemacashvoucherpurchasedetailrespdto)|false|none||返回数据|

<h2 id="tocS_PageResultOpenApiTaskRecordRespVO">PageResultOpenApiTaskRecordRespVO</h2>

<a id="schemapageresultopenapitaskrecordrespvo"></a>
<a id="schema_PageResultOpenApiTaskRecordRespVO"></a>
<a id="tocSpageresultopenapitaskrecordrespvo"></a>
<a id="tocspageresultopenapitaskrecordrespvo"></a>

```json
{
  "total": 0,
  "list": [
    {
      "id": 0,
      "taskId": 0,
      "memberId": 0,
      "storeId": 0,
      "taskName": "string",
      "targetAmount": 0,
      "progressAmount": 0,
      "rewardAmount": 0,
      "rewardType": 0,
      "status": 0,
      "claimTime": "string",
      "expireTime": "string"
    }
  ]
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|total|integer(int64)|false|none||总量|
|list|[[OpenApiTaskRecordRespVO](#schemaopenapitaskrecordrespvo)]|false|none||数据|

<h2 id="tocS_OpenStatisticsChannelRespDTO">OpenStatisticsChannelRespDTO</h2>

<a id="schemaopenstatisticschannelrespdto"></a>
<a id="schema_OpenStatisticsChannelRespDTO"></a>
<a id="tocSopenstatisticschannelrespdto"></a>
<a id="tocsopenstatisticschannelrespdto"></a>

```json
{
  "bySource": "[]",
  "byType": "[]"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|bySource|[[BreakdownItem](#schemabreakdownitem)]|false|none||按来源分组|
|byType|[[BreakdownItem](#schemabreakdownitem)]|false|none||按类型分组|

<h2 id="tocS_CommonResultOpenMemberCardPurchaseCashierRespDTO">CommonResultOpenMemberCardPurchaseCashierRespDTO</h2>

<a id="schemacommonresultopenmembercardpurchasecashierrespdto"></a>
<a id="schema_CommonResultOpenMemberCardPurchaseCashierRespDTO"></a>
<a id="tocScommonresultopenmembercardpurchasecashierrespdto"></a>
<a id="tocscommonresultopenmembercardpurchasecashierrespdto"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "tradeNo": "10001",
    "cashierUrl": "https://pay.platform.com/cashier.html?token=xxx"
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[OpenMemberCardPurchaseCashierRespDTO](#schemaopenmembercardpurchasecashierrespdto)|false|none||返回数据|

<h2 id="tocS_CommonResultPageResultOpenApiTaskRecordRespVO">CommonResultPageResultOpenApiTaskRecordRespVO</h2>

<a id="schemacommonresultpageresultopenapitaskrecordrespvo"></a>
<a id="schema_CommonResultPageResultOpenApiTaskRecordRespVO"></a>
<a id="tocScommonresultpageresultopenapitaskrecordrespvo"></a>
<a id="tocscommonresultpageresultopenapitaskrecordrespvo"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "total": 0,
    "list": [
      {
        "id": 0,
        "taskId": 0,
        "memberId": 0,
        "storeId": 0,
        "taskName": "string",
        "targetAmount": 0,
        "progressAmount": 0,
        "rewardAmount": 0,
        "rewardType": 0,
        "status": 0,
        "claimTime": "string",
        "expireTime": "string"
      }
    ]
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[PageResultOpenApiTaskRecordRespVO](#schemapageresultopenapitaskrecordrespvo)|false|none||返回数据|

<h2 id="tocS_CommonResultOpenStatisticsChannelRespDTO">CommonResultOpenStatisticsChannelRespDTO</h2>

<a id="schemacommonresultopenstatisticschannelrespdto"></a>
<a id="schema_CommonResultOpenStatisticsChannelRespDTO"></a>
<a id="tocScommonresultopenstatisticschannelrespdto"></a>
<a id="tocscommonresultopenstatisticschannelrespdto"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "bySource": "[]",
    "byType": "[]"
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[OpenStatisticsChannelRespDTO](#schemaopenstatisticschannelrespdto)|false|none||返回数据|

<h2 id="tocS_OpenApiMemberCardPurchaseCashierReqVO">OpenApiMemberCardPurchaseCashierReqVO</h2>

<a id="schemaopenapimembercardpurchasecashierreqvo"></a>
<a id="schema_OpenApiMemberCardPurchaseCashierReqVO"></a>
<a id="tocSopenapimembercardpurchasecashierreqvo"></a>
<a id="tocsopenapimembercardpurchasecashierreqvo"></a>

```json
{
  "returnUrl": "https://app.example.com/result",
  "expireMinutes": 30
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|returnUrl|string|false|none||支付完成回跳地址|
|expireMinutes|integer|false|none||过期时间（分钟）|

<h2 id="tocS_OpenApiCashVoucherRefundReqVO">OpenApiCashVoucherRefundReqVO</h2>

<a id="schemaopenapicashvoucherrefundreqvo"></a>
<a id="schema_OpenApiCashVoucherRefundReqVO"></a>
<a id="tocSopenapicashvoucherrefundreqvo"></a>
<a id="tocsopenapicashvoucherrefundreqvo"></a>

```json
{
  "voucherId": 1,
  "appUserId": 1,
  "externalUserId": "ext_user_001"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|voucherId|integer(int64)|true|none||抵金券ID|
|appUserId|integer(int64)|false|none||App用户映射ID，传 externalUserId 时可不传|
|externalUserId|string|false|none||下游 App 用户标识，传 appUserId 时可不传|

<h2 id="tocS_OpenApiCashVoucherPurchaseDiscountConfigRespVO">OpenApiCashVoucherPurchaseDiscountConfigRespVO</h2>

<a id="schemaopenapicashvoucherpurchasediscountconfigrespvo"></a>
<a id="schema_OpenApiCashVoucherPurchaseDiscountConfigRespVO"></a>
<a id="tocSopenapicashvoucherpurchasediscountconfigrespvo"></a>
<a id="tocsopenapicashvoucherpurchasediscountconfigrespvo"></a>

```json
{
  "enabled": true,
  "tiers": [
    {
      "reachAmount": 10000,
      "discountRate": 90
    }
  ]
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|enabled|boolean|false|none||是否开启抵金券购买折扣|
|tiers|[[TierItem](#schematieritem)]|false|none||抵金券购买折扣阶梯|

<h2 id="tocS_CommonResultOpenApiTaskRecordRespVO">CommonResultOpenApiTaskRecordRespVO</h2>

<a id="schemacommonresultopenapitaskrecordrespvo"></a>
<a id="schema_CommonResultOpenApiTaskRecordRespVO"></a>
<a id="tocScommonresultopenapitaskrecordrespvo"></a>
<a id="tocscommonresultopenapitaskrecordrespvo"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "id": 0,
    "taskId": 0,
    "memberId": 0,
    "storeId": 0,
    "taskName": "string",
    "targetAmount": 0,
    "progressAmount": 0,
    "rewardAmount": 0,
    "rewardType": 0,
    "status": 0,
    "claimTime": "string",
    "expireTime": "string"
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[OpenApiTaskRecordRespVO](#schemaopenapitaskrecordrespvo)|false|none||返回数据|

<h2 id="tocS_OpenStatisticsBookingRespDTO">OpenStatisticsBookingRespDTO</h2>

<a id="schemaopenstatisticsbookingrespdto"></a>
<a id="schema_OpenStatisticsBookingRespDTO"></a>
<a id="tocSopenstatisticsbookingrespdto"></a>
<a id="tocsopenstatisticsbookingrespdto"></a>

```json
{
  "totalCount": 300,
  "pendingCount": 20,
  "confirmedCount": 50,
  "inProgressCount": 10,
  "completedCount": 180,
  "cancelledCount": 40,
  "todayCount": 12,
  "todayCompletedCount": 5
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|totalCount|integer(int64)|false|none||总预约数|
|pendingCount|integer(int64)|false|none||待确认数|
|confirmedCount|integer(int64)|false|none||已确认数|
|inProgressCount|integer(int64)|false|none||进行中数|
|completedCount|integer(int64)|false|none||已完成数|
|cancelledCount|integer(int64)|false|none||已取消数|
|todayCount|integer(int64)|false|none||今日预约数|
|todayCompletedCount|integer(int64)|false|none||今日完成数|

<h2 id="tocS_CommonResultOpenApiCashVoucherPurchaseDiscountConfigRespVO">CommonResultOpenApiCashVoucherPurchaseDiscountConfigRespVO</h2>

<a id="schemacommonresultopenapicashvoucherpurchasediscountconfigrespvo"></a>
<a id="schema_CommonResultOpenApiCashVoucherPurchaseDiscountConfigRespVO"></a>
<a id="tocScommonresultopenapicashvoucherpurchasediscountconfigrespvo"></a>
<a id="tocscommonresultopenapicashvoucherpurchasediscountconfigrespvo"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "enabled": true,
    "tiers": [
      {
        "reachAmount": 10000,
        "discountRate": 90
      }
    ]
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[OpenApiCashVoucherPurchaseDiscountConfigRespVO](#schemaopenapicashvoucherpurchasediscountconfigrespvo)|false|none||返回数据|

<h2 id="tocS_OpenApiTaskClaimReqVO">OpenApiTaskClaimReqVO</h2>

<a id="schemaopenapitaskclaimreqvo"></a>
<a id="schema_OpenApiTaskClaimReqVO"></a>
<a id="tocSopenapitaskclaimreqvo"></a>
<a id="tocsopenapitaskclaimreqvo"></a>

```json
{
  "taskId": 1,
  "externalUserId": "user_001",
  "merchantId": 1,
  "storeId": 10
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|taskId|integer(int64)|true|none||任务ID|
|externalUserId|string|true|none||外部用户标识|
|merchantId|integer(int64)|true|none||商户ID|
|storeId|integer(int64)|false|none||领取门店ID（可选）|

<h2 id="tocS_CommonResultOpenStatisticsBookingRespDTO">CommonResultOpenStatisticsBookingRespDTO</h2>

<a id="schemacommonresultopenstatisticsbookingrespdto"></a>
<a id="schema_CommonResultOpenStatisticsBookingRespDTO"></a>
<a id="tocScommonresultopenstatisticsbookingrespdto"></a>
<a id="tocscommonresultopenstatisticsbookingrespdto"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "totalCount": 300,
    "pendingCount": 20,
    "confirmedCount": 50,
    "inProgressCount": 10,
    "completedCount": 180,
    "cancelledCount": 40,
    "todayCount": 12,
    "todayCompletedCount": 5
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[OpenStatisticsBookingRespDTO](#schemaopenstatisticsbookingrespdto)|false|none||返回数据|

<h2 id="tocS_OpenStatisticsExportRespDTO">OpenStatisticsExportRespDTO</h2>

<a id="schemaopenstatisticsexportrespdto"></a>
<a id="schema_OpenStatisticsExportRespDTO"></a>
<a id="tocSopenstatisticsexportrespdto"></a>
<a id="tocsopenstatisticsexportrespdto"></a>

```json
{
  "taskId": 1024,
  "status": 0
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|taskId|integer(int64)|false|none||导出任务ID|
|status|integer|false|none||任务状态：0-待处理 1-处理中 2-已完成 3-失败|

<h2 id="tocS_CommonResultOpenStatisticsExportRespDTO">CommonResultOpenStatisticsExportRespDTO</h2>

<a id="schemacommonresultopenstatisticsexportrespdto"></a>
<a id="schema_CommonResultOpenStatisticsExportRespDTO"></a>
<a id="tocScommonresultopenstatisticsexportrespdto"></a>
<a id="tocscommonresultopenstatisticsexportrespdto"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "taskId": 1024,
    "status": 0
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[OpenStatisticsExportRespDTO](#schemaopenstatisticsexportrespdto)|false|none||返回数据|

<h2 id="tocS_OpenApiStatisticsExportReqVO">OpenApiStatisticsExportReqVO</h2>

<a id="schemaopenapistatisticsexportreqvo"></a>
<a id="schema_OpenApiStatisticsExportReqVO"></a>
<a id="tocSopenapistatisticsexportreqvo"></a>
<a id="tocsopenapistatisticsexportreqvo"></a>

```json
{
  "merchantId": 1,
  "reportType": "sales",
  "period": "week",
  "startTime": "string",
  "endTime": "string",
  "fileFormat": "xlsx"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|merchantId|integer(int64)|true|none||商户ID|
|reportType|string|true|none||报表类型：overview/sales/customers/channels/bookings|
|period|string|false|none||统计周期：today/yesterday/week/month/custom|
|startTime|string|false|none||自定义开始时间（period为custom时必填）|
|endTime|string|false|none||自定义结束时间（period为custom时必填）|
|fileFormat|string|false|none||导出格式：xlsx/csv|

<h2 id="tocS_OpenStatisticsExportStatusRespDTO">OpenStatisticsExportStatusRespDTO</h2>

<a id="schemaopenstatisticsexportstatusrespdto"></a>
<a id="schema_OpenStatisticsExportStatusRespDTO"></a>
<a id="tocSopenstatisticsexportstatusrespdto"></a>
<a id="tocsopenstatisticsexportstatusrespdto"></a>

```json
{
  "taskId": 1024,
  "status": 2,
  "progress": 100,
  "reportType": "sales",
  "fileUrl": "string",
  "fileSize": 102400,
  "errorMessage": "string",
  "expireTime": "string",
  "createTime": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|taskId|integer(int64)|false|none||导出任务ID|
|status|integer|false|none||任务状态：0-待处理 1-处理中 2-已完成 3-失败|
|progress|integer|false|none||处理进度(0~100)|
|reportType|string|false|none||报表类型|
|fileUrl|string|false|none||文件下载地址|
|fileSize|integer(int64)|false|none||文件大小(字节)|
|errorMessage|string|false|none||失败原因|
|expireTime|string|false|none||文件过期时间|
|createTime|string|false|none||创建时间|

<h2 id="tocS_CommonResultOpenStatisticsExportStatusRespDTO">CommonResultOpenStatisticsExportStatusRespDTO</h2>

<a id="schemacommonresultopenstatisticsexportstatusrespdto"></a>
<a id="schema_CommonResultOpenStatisticsExportStatusRespDTO"></a>
<a id="tocScommonresultopenstatisticsexportstatusrespdto"></a>
<a id="tocscommonresultopenstatisticsexportstatusrespdto"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "taskId": 1024,
    "status": 2,
    "progress": 100,
    "reportType": "sales",
    "fileUrl": "string",
    "fileSize": 102400,
    "errorMessage": "string",
    "expireTime": "string",
    "createTime": "string"
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[OpenStatisticsExportStatusRespDTO](#schemaopenstatisticsexportstatusrespdto)|false|none||返回数据|

<h2 id="tocS_OpenCardTemplateRespDTO">OpenCardTemplateRespDTO</h2>

<a id="schemaopencardtemplaterespdto"></a>
<a id="schema_OpenCardTemplateRespDTO"></a>
<a id="tocSopencardtemplaterespdto"></a>
<a id="tocsopencardtemplaterespdto"></a>

```json
{
  "id": 1,
  "merchantId": 1,
  "cardName": "VIP会员卡",
  "cardType": 1,
  "coverUrl": "string",
  "description": "string",
  "detail": "string",
  "usageRules": "string",
  "tips": "string",
  "servicePhone": "string",
  "cardAmount": 100000,
  "buyAmount": 80000,
  "initAmount": 10000,
  "presentAmount": 5000,
  "installmentEnabled": 0,
  "installmentOptions": "string",
  "deferredEnabled": 0,
  "deferredDays": 7,
  "oneTimeInterestRate": 0,
  "overdueEnabled": 0,
  "overdueDailyRate": 0,
  "overdueMaxRate": 0,
  "repaymentDeadlineDays": 30,
  "useRechargeTiers": 0,
  "allowCustomAmount": 0,
  "minRechargeAmount": 1000,
  "maxRechargeAmount": 500000,
  "totalTimes": 10,
  "timesUnit": "次",
  "discountRate": 85,
  "packageItems": "string",
  "levelId": 1,
  "serviceFee": 0,
  "validityDays": 365,
  "storeScope": 0,
  "storeIds": "string",
  "defaultCommissionRate": 5,
  "selfIssueVoucherEnabled": 0,
  "recommended": 0,
  "sortOrder": 0,
  "status": 1,
  "createTime": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||模板ID|
|merchantId|integer(int64)|false|none||商户ID|
|cardName|string|false|none||卡名称|
|cardType|integer|false|none||卡类型：1-储值卡 2-次卡 3-折扣卡 4-套餐卡|
|coverUrl|string|false|none||封面图|
|description|string|false|none||卡简介|
|detail|string|false|none||详细说明(富文本)|
|usageRules|string|false|none||使用须知|
|tips|string|false|none||温馨提示|
|servicePhone|string|false|none||客服电话|
|cardAmount|integer|false|none||卡面额(分)|
|buyAmount|integer|false|none||购买总价(分)|
|initAmount|integer|false|none||首付金额(分)，选择分期/延期支付时先支付该金额|
|presentAmount|integer|false|none||赠送金额(分)|
|installmentEnabled|integer|false|none||是否支持分期付尾款：0-否 1-是|
|installmentOptions|string|false|none||分期选项(JSON)，仅透传给下游 App|
|deferredEnabled|integer|false|none||是否支持延期付尾款：0-否 1-是|
|deferredDays|integer|false|none||延期天数，仅透传给下游 App|
|oneTimeInterestRate|number|false|none||一次性还款利率|
|overdueEnabled|integer|false|none||是否收逾期罚息：0-否 1-是|
|overdueDailyRate|number|false|none||逾期日利率|
|overdueMaxRate|number|false|none||逾期罚息上限|
|repaymentDeadlineDays|integer|false|none||尾款还款期限(天)|
|useRechargeTiers|integer|false|none||是否使用充值档位：0-否 1-是|
|allowCustomAmount|integer|false|none||是否允许自定义充值金额：0-否 1-是|
|minRechargeAmount|integer|false|none||最低充值金额(分)|
|maxRechargeAmount|integer|false|none||最高充值金额(分)|
|totalTimes|integer|false|none||总次数(次卡专用)|
|timesUnit|string|false|none||次数单位(次卡专用)|
|discountRate|integer|false|none||买单折扣(%)|
|packageItems|string|false|none||套餐内容(JSON)|
|levelId|integer(int64)|false|none||所属等级ID|
|serviceFee|integer|false|none||手续费(分)|
|validityDays|integer|false|none||有效期(天)，0=永久有效|
|storeScope|integer|false|none||适用范围：0-全店通用 1-指定门店|
|storeIds|string|false|none||适用门店IDs(JSON数组)|
|defaultCommissionRate|number|false|none||默认分销提成比例(%)|
|selfIssueVoucherEnabled|integer|false|none||是否允许会员自主发券：0-否 1-是|
|recommended|integer|false|none||是否推荐：0-否 1-是|
|sortOrder|integer|false|none||排序|
|status|integer|false|none||状态：0-草稿 1-上架中 2-已下架 3-已过期|
|createTime|string|false|none||创建时间|

<h2 id="tocS_PageResultOpenCardTemplateRespDTO">PageResultOpenCardTemplateRespDTO</h2>

<a id="schemapageresultopencardtemplaterespdto"></a>
<a id="schema_PageResultOpenCardTemplateRespDTO"></a>
<a id="tocSpageresultopencardtemplaterespdto"></a>
<a id="tocspageresultopencardtemplaterespdto"></a>

```json
{
  "total": 0,
  "list": [
    {
      "id": 1,
      "merchantId": 1,
      "cardName": "VIP会员卡",
      "cardType": 1,
      "coverUrl": "string",
      "description": "string",
      "detail": "string",
      "usageRules": "string",
      "tips": "string",
      "servicePhone": "string",
      "cardAmount": 100000,
      "buyAmount": 80000,
      "initAmount": 10000,
      "presentAmount": 5000,
      "installmentEnabled": 0,
      "installmentOptions": "string",
      "deferredEnabled": 0,
      "deferredDays": 7,
      "oneTimeInterestRate": 0,
      "overdueEnabled": 0,
      "overdueDailyRate": 0,
      "overdueMaxRate": 0,
      "repaymentDeadlineDays": 30,
      "useRechargeTiers": 0,
      "allowCustomAmount": 0,
      "minRechargeAmount": 1000,
      "maxRechargeAmount": 500000,
      "totalTimes": 10,
      "timesUnit": "次",
      "discountRate": 85,
      "packageItems": "string",
      "levelId": 1,
      "serviceFee": 0,
      "validityDays": 365,
      "storeScope": 0,
      "storeIds": "string",
      "defaultCommissionRate": 5,
      "selfIssueVoucherEnabled": 0,
      "recommended": 0,
      "sortOrder": 0,
      "status": 1,
      "createTime": "string"
    }
  ]
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|total|integer(int64)|false|none||总量|
|list|[[OpenCardTemplateRespDTO](#schemaopencardtemplaterespdto)]|false|none||数据|

<h2 id="tocS_OpenWriteOffQrRespDTO">OpenWriteOffQrRespDTO</h2>

<a id="schemaopenwriteoffqrrespdto"></a>
<a id="schema_OpenWriteOffQrRespDTO"></a>
<a id="tocSopenwriteoffqrrespdto"></a>
<a id="tocsopenwriteoffqrrespdto"></a>

```json
{
  "requestNo": "OWR123456789",
  "qrToken": "OWR123.1742793600.ABCDEF",
  "qrTimestamp": 1742793600,
  "qrExpireTime": "string",
  "resourceType": 1,
  "resourceId": 1,
  "resourceCardNo": "MC20240001"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|requestNo|string|false|none||请求号|
|qrToken|string|false|none||二维码令牌|
|qrTimestamp|integer(int64)|false|none||二维码生成时间戳（秒）|
|qrExpireTime|string|false|none||二维码过期时间|
|resourceType|integer|false|none||资源类型：1-会员卡 2-优惠券 3-抵金券|
|resourceId|integer(int64)|false|none||资源ID|
|resourceCardNo|string|false|none||会员卡卡号（resourceType=1 时返回）|

<h2 id="tocS_CommonResultPageResultOpenCardTemplateRespDTO">CommonResultPageResultOpenCardTemplateRespDTO</h2>

<a id="schemacommonresultpageresultopencardtemplaterespdto"></a>
<a id="schema_CommonResultPageResultOpenCardTemplateRespDTO"></a>
<a id="tocScommonresultpageresultopencardtemplaterespdto"></a>
<a id="tocscommonresultpageresultopencardtemplaterespdto"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "total": 0,
    "list": [
      {
        "id": 1,
        "merchantId": 1,
        "cardName": "VIP会员卡",
        "cardType": 1,
        "coverUrl": "string",
        "description": "string",
        "detail": "string",
        "usageRules": "string",
        "tips": "string",
        "servicePhone": "string",
        "cardAmount": 100000,
        "buyAmount": 80000,
        "initAmount": 10000,
        "presentAmount": 5000,
        "installmentEnabled": 0,
        "installmentOptions": "string",
        "deferredEnabled": 0,
        "deferredDays": 7,
        "oneTimeInterestRate": 0,
        "overdueEnabled": 0,
        "overdueDailyRate": 0,
        "overdueMaxRate": 0,
        "repaymentDeadlineDays": 30,
        "useRechargeTiers": 0,
        "allowCustomAmount": 0,
        "minRechargeAmount": 1000,
        "maxRechargeAmount": 500000,
        "totalTimes": 10,
        "timesUnit": "次",
        "discountRate": 85,
        "packageItems": "string",
        "levelId": 1,
        "serviceFee": 0,
        "validityDays": 365,
        "storeScope": 0,
        "storeIds": "string",
        "defaultCommissionRate": 5,
        "selfIssueVoucherEnabled": 0,
        "recommended": 0,
        "sortOrder": 0,
        "status": 1,
        "createTime": "string"
      }
    ]
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[PageResultOpenCardTemplateRespDTO](#schemapageresultopencardtemplaterespdto)|false|none||返回数据|

<h2 id="tocS_CommonResultOpenWriteOffQrRespDTO">CommonResultOpenWriteOffQrRespDTO</h2>

<a id="schemacommonresultopenwriteoffqrrespdto"></a>
<a id="schema_CommonResultOpenWriteOffQrRespDTO"></a>
<a id="tocScommonresultopenwriteoffqrrespdto"></a>
<a id="tocscommonresultopenwriteoffqrrespdto"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "requestNo": "OWR123456789",
    "qrToken": "OWR123.1742793600.ABCDEF",
    "qrTimestamp": 1742793600,
    "qrExpireTime": "string",
    "resourceType": 1,
    "resourceId": 1,
    "resourceCardNo": "MC20240001"
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[OpenWriteOffQrRespDTO](#schemaopenwriteoffqrrespdto)|false|none||返回数据|

<h2 id="tocS_CommonResultOpenCardTemplateRespDTO">CommonResultOpenCardTemplateRespDTO</h2>

<a id="schemacommonresultopencardtemplaterespdto"></a>
<a id="schema_CommonResultOpenCardTemplateRespDTO"></a>
<a id="tocScommonresultopencardtemplaterespdto"></a>
<a id="tocscommonresultopencardtemplaterespdto"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "id": 1,
    "merchantId": 1,
    "cardName": "VIP会员卡",
    "cardType": 1,
    "coverUrl": "string",
    "description": "string",
    "detail": "string",
    "usageRules": "string",
    "tips": "string",
    "servicePhone": "string",
    "cardAmount": 100000,
    "buyAmount": 80000,
    "initAmount": 10000,
    "presentAmount": 5000,
    "installmentEnabled": 0,
    "installmentOptions": "string",
    "deferredEnabled": 0,
    "deferredDays": 7,
    "oneTimeInterestRate": 0,
    "overdueEnabled": 0,
    "overdueDailyRate": 0,
    "overdueMaxRate": 0,
    "repaymentDeadlineDays": 30,
    "useRechargeTiers": 0,
    "allowCustomAmount": 0,
    "minRechargeAmount": 1000,
    "maxRechargeAmount": 500000,
    "totalTimes": 10,
    "timesUnit": "次",
    "discountRate": 85,
    "packageItems": "string",
    "levelId": 1,
    "serviceFee": 0,
    "validityDays": 365,
    "storeScope": 0,
    "storeIds": "string",
    "defaultCommissionRate": 5,
    "selfIssueVoucherEnabled": 0,
    "recommended": 0,
    "sortOrder": 0,
    "status": 1,
    "createTime": "string"
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[OpenCardTemplateRespDTO](#schemaopencardtemplaterespdto)|false|none||返回数据|

<h2 id="tocS_OpenWriteOffRecordRespDTO">OpenWriteOffRecordRespDTO</h2>

<a id="schemaopenwriteoffrecordrespdto"></a>
<a id="schema_OpenWriteOffRecordRespDTO"></a>
<a id="tocSopenwriteoffrecordrespdto"></a>
<a id="tocsopenwriteoffrecordrespdto"></a>

```json
{
  "id": 1,
  "requestNo": "OWR123456789",
  "appId": 1,
  "merchantId": 1,
  "storeId": 1,
  "resourceType": 1,
  "resourceId": 1,
  "resourceCardNo": "MC20240001",
  "status": 1,
  "qrToken": "OWR123.1742793600.ABCDEF",
  "qrTimestamp": 1742793600,
  "qrExpireTime": "string",
  "amount": 5000,
  "shortfallAmount": 4000,
  "times": 1,
  "packageItemName": "深层清洁",
  "operatorId": 1,
  "remark": "string",
  "callbackStatus": 0,
  "resultPayload": "string",
  "confirmTime": "string",
  "completeTime": "string",
  "cancelTime": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||记录ID|
|requestNo|string|false|none||请求号|
|appId|integer(int64)|false|none||来源App ID|
|merchantId|integer(int64)|false|none||商户ID|
|storeId|integer(int64)|false|none||门店ID|
|resourceType|integer|false|none||资源类型：1-会员卡 2-优惠券 3-抵金券|
|resourceId|integer(int64)|false|none||资源ID|
|resourceCardNo|string|false|none||会员卡卡号（resourceType=1 时返回）|
|status|integer|false|none||状态：0-待扫码 1-待确认 2-已完成 3-已取消 4-已过期|
|qrToken|string|false|none||核销二维码令牌|
|qrTimestamp|integer(int64)|false|none||二维码生成时间戳（秒）|
|qrExpireTime|string|false|none||二维码过期时间|
|amount|integer|false|none||核销金额(分)|
|shortfallAmount|integer|false|none||差价金额(分)，状态为待支付差价时返回|
|times|integer|false|none||核销次数|
|packageItemName|string|false|none||套餐项目名称|
|operatorId|integer(int64)|false|none||操作员工ID|
|remark|string|false|none||备注|
|callbackStatus|integer|false|none||回调状态：0-待创建 1-已创建 2-无需回调|
|resultPayload|string|false|none||结果快照(JSON)|
|confirmTime|string|false|none||确认时间|
|completeTime|string|false|none||完成时间|
|cancelTime|string|false|none||取消时间|

<h2 id="tocS_CommonResultLong">CommonResultLong</h2>

<a id="schemacommonresultlong"></a>
<a id="schema_CommonResultLong"></a>
<a id="tocScommonresultlong"></a>
<a id="tocscommonresultlong"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": 0
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|integer(int64)|false|none||返回数据|

<h2 id="tocS_CommonResultOpenWriteOffRecordRespDTO">CommonResultOpenWriteOffRecordRespDTO</h2>

<a id="schemacommonresultopenwriteoffrecordrespdto"></a>
<a id="schema_CommonResultOpenWriteOffRecordRespDTO"></a>
<a id="tocScommonresultopenwriteoffrecordrespdto"></a>
<a id="tocscommonresultopenwriteoffrecordrespdto"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "id": 1,
    "requestNo": "OWR123456789",
    "appId": 1,
    "merchantId": 1,
    "storeId": 1,
    "resourceType": 1,
    "resourceId": 1,
    "resourceCardNo": "MC20240001",
    "status": 1,
    "qrToken": "OWR123.1742793600.ABCDEF",
    "qrTimestamp": 1742793600,
    "qrExpireTime": "string",
    "amount": 5000,
    "shortfallAmount": 4000,
    "times": 1,
    "packageItemName": "深层清洁",
    "operatorId": 1,
    "remark": "string",
    "callbackStatus": 0,
    "resultPayload": "string",
    "confirmTime": "string",
    "completeTime": "string",
    "cancelTime": "string"
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[OpenWriteOffRecordRespDTO](#schemaopenwriteoffrecordrespdto)|false|none||返回数据|

<h2 id="tocS_OpenApiCardTemplateCreateReqVO">OpenApiCardTemplateCreateReqVO</h2>

<a id="schemaopenapicardtemplatecreatereqvo"></a>
<a id="schema_OpenApiCardTemplateCreateReqVO"></a>
<a id="tocSopenapicardtemplatecreatereqvo"></a>
<a id="tocsopenapicardtemplatecreatereqvo"></a>

```json
{
  "merchantId": 1,
  "cardType": 1,
  "cardName": "VIP会员卡",
  "coverUrl": "string",
  "description": "string",
  "detail": "string",
  "usageRules": "string",
  "tips": "string",
  "servicePhone": "string",
  "paymentMode": 0,
  "cardAmount": 100000,
  "buyAmount": 80000,
  "initAmount": 10000,
  "presentAmount": 5000,
  "installmentEnabled": 0,
  "installmentOptions": "string",
  "oneTimeInterestRate": 0,
  "overdueEnabled": 0,
  "overdueDailyRate": 0,
  "overdueMaxRate": 0,
  "repaymentDeadlineDays": 30,
  "useRechargeTiers": 0,
  "allowCustomAmount": 0,
  "minRechargeAmount": 1000,
  "maxRechargeAmount": 500000,
  "totalTimes": 10,
  "timesUnit": "次",
  "discountRate": 85,
  "packageItems": "string",
  "levelId": 1,
  "serviceFee": 0,
  "validityDays": 365,
  "storeScope": 0,
  "storeIds": "string",
  "defaultCommissionRate": 5,
  "selfIssueVoucherEnabled": 0,
  "recommended": 0,
  "sortOrder": 0
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|merchantId|integer(int64)|true|none||商户ID|
|cardType|integer|true|none||卡类型：1-储值卡 2-次卡 3-折扣卡 4-套餐卡|
|cardName|string|true|none||卡名称|
|coverUrl|string|false|none||封面图|
|description|string|false|none||卡简介|
|detail|string|false|none||详细说明(富文本)|
|usageRules|string|false|none||使用须知|
|tips|string|false|none||温馨提示|
|servicePhone|string|false|none||客服电话|
|paymentMode|integer|false|none||支付模式：0-全额付款 1-先付 2-零门槛|
|cardAmount|integer|true|none||卡面额(分)|
|buyAmount|integer|true|none||购买总价(分)|
|initAmount|integer|false|none||首付金额(分)|
|presentAmount|integer|false|none||赠送金额(分)|
|installmentEnabled|integer|false|none||是否支持分期：0-否 1-是|
|installmentOptions|string|false|none||分期选项(JSON)|
|oneTimeInterestRate|number|false|none||一次性还款利率|
|overdueEnabled|integer|false|none||是否收逾期罚息：0-否 1-是|
|overdueDailyRate|number|false|none||逾期日利率|
|overdueMaxRate|number|false|none||逾期罚息上限|
|repaymentDeadlineDays|integer|false|none||尾款还款期限(天)|
|useRechargeTiers|integer|false|none||是否使用充值档位：0-否 1-是|
|allowCustomAmount|integer|false|none||是否允许自定义充值金额：0-否 1-是|
|minRechargeAmount|integer|false|none||最低充值金额(分)|
|maxRechargeAmount|integer|false|none||最高充值金额(分)|
|totalTimes|integer|false|none||总次数(次卡专用)|
|timesUnit|string|false|none||次数单位(次卡专用)|
|discountRate|integer|false|none||买单折扣(%)|
|packageItems|string|false|none||套餐内容(JSON)|
|levelId|integer(int64)|false|none||所属等级ID|
|serviceFee|integer|false|none||手续费(分)|
|validityDays|integer|true|none||有效期(天)，0=永久有效|
|storeScope|integer|false|none||适用范围：0-全店通用 1-指定门店|
|storeIds|string|false|none||适用门店IDs(JSON数组)|
|defaultCommissionRate|number|false|none||默认分销提成比例(%)|
|selfIssueVoucherEnabled|integer|false|none||是否允许会员自主发券：0-否 1-是|
|recommended|integer|false|none||是否推荐：0-否 1-是|
|sortOrder|integer|false|none||排序|

<h2 id="tocS_OpenApiMemberCardWriteOffConfirmReqVO">OpenApiMemberCardWriteOffConfirmReqVO</h2>

<a id="schemaopenapimembercardwriteoffconfirmreqvo"></a>
<a id="schema_OpenApiMemberCardWriteOffConfirmReqVO"></a>
<a id="tocSopenapimembercardwriteoffconfirmreqvo"></a>
<a id="tocsopenapimembercardwriteoffconfirmreqvo"></a>

```json
{
  "approved": true,
  "remark": "用户确认核销"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|approved|boolean|true|none||是否同意核销|
|remark|string|false|none||备注|

<h2 id="tocS_CommonResultBoolean">CommonResultBoolean</h2>

<a id="schemacommonresultboolean"></a>
<a id="schema_CommonResultBoolean"></a>
<a id="tocScommonresultboolean"></a>
<a id="tocscommonresultboolean"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": true
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|boolean|false|none||返回数据|

<h2 id="tocS_OpenApiCardTemplateUpdateReqVO">OpenApiCardTemplateUpdateReqVO</h2>

<a id="schemaopenapicardtemplateupdatereqvo"></a>
<a id="schema_OpenApiCardTemplateUpdateReqVO"></a>
<a id="tocSopenapicardtemplateupdatereqvo"></a>
<a id="tocsopenapicardtemplateupdatereqvo"></a>

```json
{
  "cardName": "VIP会员卡",
  "coverUrl": "string",
  "description": "string",
  "detail": "string",
  "usageRules": "string",
  "tips": "string",
  "servicePhone": "string",
  "paymentMode": 0,
  "cardAmount": 100000,
  "buyAmount": 80000,
  "initAmount": 10000,
  "presentAmount": 5000,
  "installmentEnabled": 0,
  "installmentOptions": "string",
  "oneTimeInterestRate": 0,
  "overdueEnabled": 0,
  "overdueDailyRate": 0,
  "overdueMaxRate": 0,
  "repaymentDeadlineDays": 30,
  "useRechargeTiers": 0,
  "allowCustomAmount": 0,
  "minRechargeAmount": 1000,
  "maxRechargeAmount": 500000,
  "totalTimes": 10,
  "timesUnit": "次",
  "discountRate": 85,
  "packageItems": "string",
  "levelId": 1,
  "serviceFee": 0,
  "validityDays": 365,
  "storeScope": 0,
  "storeIds": "string",
  "recommended": 0,
  "sortOrder": 0
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|cardName|string|false|none||卡名称|
|coverUrl|string|false|none||封面图|
|description|string|false|none||卡简介|
|detail|string|false|none||详细说明(富文本)|
|usageRules|string|false|none||使用须知|
|tips|string|false|none||温馨提示|
|servicePhone|string|false|none||客服电话|
|paymentMode|integer|false|none||支付模式：0-全额付款 1-先付 2-零门槛|
|cardAmount|integer|false|none||卡面额(分)|
|buyAmount|integer|false|none||购买总价(分)|
|initAmount|integer|false|none||首付金额(分)|
|presentAmount|integer|false|none||赠送金额(分)|
|installmentEnabled|integer|false|none||是否支持分期：0-否 1-是|
|installmentOptions|string|false|none||分期选项(JSON)|
|oneTimeInterestRate|number|false|none||一次性还款利率|
|overdueEnabled|integer|false|none||是否收逾期罚息：0-否 1-是|
|overdueDailyRate|number|false|none||逾期日利率|
|overdueMaxRate|number|false|none||逾期罚息上限|
|repaymentDeadlineDays|integer|false|none||尾款还款期限(天)|
|useRechargeTiers|integer|false|none||是否使用充值档位：0-否 1-是|
|allowCustomAmount|integer|false|none||是否允许自定义充值金额：0-否 1-是|
|minRechargeAmount|integer|false|none||最低充值金额(分)|
|maxRechargeAmount|integer|false|none||最高充值金额(分)|
|totalTimes|integer|false|none||总次数(次卡专用)|
|timesUnit|string|false|none||次数单位(次卡专用)|
|discountRate|integer|false|none||买单折扣(%)|
|packageItems|string|false|none||套餐内容(JSON)|
|levelId|integer(int64)|false|none||所属等级ID|
|serviceFee|integer|false|none||手续费(分)|
|validityDays|integer|false|none||有效期(天)，0=永久有效|
|storeScope|integer|false|none||适用范围：0-全店通用 1-指定门店|
|storeIds|string|false|none||适用门店IDs(JSON数组)|
|recommended|integer|false|none||是否推荐：0-否 1-是|
|sortOrder|integer|false|none||排序|

<h2 id="tocS_TierItem">TierItem</h2>

<a id="schematieritem"></a>
<a id="schema_TierItem"></a>
<a id="tocStieritem"></a>
<a id="tocstieritem"></a>

```json
{
  "reachAmount": 10000,
  "discountRate": 90
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|reachAmount|integer|false|none||达到该购买金额门槛后生效，单位分|
|discountRate|integer|false|none||折扣率，100=原价，90=9折|

<h2 id="tocS_OpenApiRechargeTierSaveBatchReqVO">OpenApiRechargeTierSaveBatchReqVO</h2>

<a id="schemaopenapirechargetiersavebatchreqvo"></a>
<a id="schema_OpenApiRechargeTierSaveBatchReqVO"></a>
<a id="tocSopenapirechargetiersavebatchreqvo"></a>
<a id="tocsopenapirechargetiersavebatchreqvo"></a>

```json
{
  "tiers": [
    {
      "rechargeAmount": 10000,
      "bonusAmount": 2000,
      "bonusRate": 20,
      "bonusType": 1,
      "bonusInstallmentMonths": 3,
      "bonusPerConsumeRate": 0.2,
      "sortOrder": 0,
      "status": 0
    }
  ]
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|tiers|[[TierItem2](#schematieritem2)]|false|none||充值档位列表|

<h2 id="tocS_OpenApiCommissionConfigReqVO">OpenApiCommissionConfigReqVO</h2>

<a id="schemaopenapicommissionconfigreqvo"></a>
<a id="schema_OpenApiCommissionConfigReqVO"></a>
<a id="tocSopenapicommissionconfigreqvo"></a>
<a id="tocsopenapicommissionconfigreqvo"></a>

```json
{
  "defaultCommissionRate": 5
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|defaultCommissionRate|number|true|none||默认分销提成比例(%)|

<h2 id="tocS_OpenApiCouponConfigSaveReqVO">OpenApiCouponConfigSaveReqVO</h2>

<a id="schemaopenapicouponconfigsavereqvo"></a>
<a id="schema_OpenApiCouponConfigSaveReqVO"></a>
<a id="tocSopenapicouponconfigsavereqvo"></a>
<a id="tocsopenapicouponconfigsavereqvo"></a>

```json
{
  "isEnabled": 1,
  "minAmountPerCoupon": 100,
  "maxAmountPerCoupon": 50000,
  "dailyIssueLimit": 5,
  "dailyAmountLimit": 100000,
  "hourlyIssueLimit": 2,
  "serviceFeeRate": 2,
  "allowedLevelIds": "string",
  "minConsumptionRequired": 0,
  "couponValidityDays": 30
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|isEnabled|integer|false|none||是否开启会员自主发券：0-否 1-是|
|minAmountPerCoupon|integer|false|none||单次发券最低面额(分)|
|maxAmountPerCoupon|integer|false|none||单次发券最高面额(分)|
|dailyIssueLimit|integer|false|none||每日发券次数限制|
|dailyAmountLimit|integer|false|none||每日发券总额限制(分)|
|hourlyIssueLimit|integer|false|none||每小时发券次数限制|
|serviceFeeRate|number|false|none||手续费比例(%)|
|allowedLevelIds|string|false|none||允许发券的会员等级IDs(JSON数组)|
|minConsumptionRequired|integer|false|none||最低消费要求(分)|
|couponValidityDays|integer|false|none||生成券的默认有效天数|

<h2 id="tocS_OpenApiMemberCardPurchaseReqVO">OpenApiMemberCardPurchaseReqVO</h2>

<a id="schemaopenapimembercardpurchasereqvo"></a>
<a id="schema_OpenApiMemberCardPurchaseReqVO"></a>
<a id="tocSopenapimembercardpurchasereqvo"></a>
<a id="tocsopenapimembercardpurchasereqvo"></a>

```json
{
  "merchantId": 1,
  "templateId": 1,
  "appUserId": 1,
  "externalUserId": "ext_user_001",
  "tierId": 1
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|merchantId|integer(int64)|true|none||商户ID|
|templateId|integer(int64)|true|none||会员卡模板ID|
|appUserId|integer(int64)|false|none||App用户映射ID，传 externalUserId 时可不传|
|externalUserId|string|false|none||下游 App 用户标识，传 appUserId 时可不传|
|tierId|integer(int64)|false|none||充值档位ID（储值卡选择档位时传入）|

<h2 id="tocS_OpenMemberCardPurchaseRespVO">OpenMemberCardPurchaseRespVO</h2>

<a id="schemaopenmembercardpurchaserespvo"></a>
<a id="schema_OpenMemberCardPurchaseRespVO"></a>
<a id="tocSopenmembercardpurchaserespvo"></a>
<a id="tocsopenmembercardpurchaserespvo"></a>

```json
{
  "resultType": "CARD",
  "id": 1
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|resultType|string|false|none||结果类型：CARD-已直接开卡；APPLY-已提交赊账申请待商户审核|
|id|integer(int64)|false|none||结果ID：resultType=CARD 时为会员卡ID；resultType=APPLY 时为赊账申请ID|

<h2 id="tocS_OpenMemberCardRespDTO">OpenMemberCardRespDTO</h2>

<a id="schemaopenmembercardrespdto"></a>
<a id="schema_OpenMemberCardRespDTO"></a>
<a id="tocSopenmembercardrespdto"></a>
<a id="tocsopenmembercardrespdto"></a>

```json
{
  "id": 1,
  "appId": 1,
  "appUserId": 1,
  "merchantId": 1,
  "templateId": 1,
  "tierId": 1,
  "cardNo": "MC20240001",
  "cardType": 1,
  "paymentMode": 0,
  "levelId": 1,
  "purchaseAmount": 100000,
  "bonusAmount": 5000,
  "totalAmount": 105000,
  "remainAmount": 95000,
  "usedAmount": 10000,
  "timesTotal": 10,
  "timesLeft": 8,
  "timesUsed": 2,
  "discountRate": 85,
  "packageUsage": "string",
  "paidAmount": 100000,
  "owedAmount": 0,
  "installmentStatus": 0,
  "installmentPeriods": 0,
  "nextPaymentDate": "string",
  "nextPaymentAmount": 0,
  "overdueAmount": 0,
  "overdueDays": 0,
  "status": 0,
  "activateTime": "string",
  "expireTime": "string",
  "createTime": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||会员卡ID|
|appId|integer(int64)|false|none||来源App ID|
|appUserId|integer(int64)|false|none||App用户映射ID|
|merchantId|integer(int64)|false|none||商户ID|
|templateId|integer(int64)|false|none||会员卡模板ID|
|tierId|integer(int64)|false|none||充值档位ID|
|cardNo|string|false|none||卡号|
|cardType|integer|false|none||卡类型：1-储值卡 2-次卡 3-折扣卡 4-套餐卡|
|paymentMode|integer|false|none||支付模式：0-全额 1-先付 2-零门槛|
|levelId|integer(int64)|false|none||卡等级ID|
|purchaseAmount|integer|false|none||购买金额(分)|
|bonusAmount|integer|false|none||赠送金额(分)|
|totalAmount|integer|false|none||卡总额(分)|
|remainAmount|integer|false|none||剩余可用金额(分)|
|usedAmount|integer|false|none||已使用金额(分)|
|timesTotal|integer|false|none||总次数(次卡专用)|
|timesLeft|integer|false|none||剩余次数(次卡专用)|
|timesUsed|integer|false|none||已使用次数(次卡专用)|
|discountRate|integer|false|none||折扣率(%)|
|packageUsage|string|false|none||套餐使用情况(JSON)|
|paidAmount|integer|false|none||已支付金额(分)|
|owedAmount|integer|false|none||待还金额(分)|
|installmentStatus|integer|false|none||分期状态：0-无分期/已结清 1-还款中 2-已还清 3-逾期|
|installmentPeriods|integer|false|none||分期期数|
|nextPaymentDate|string|false|none||下次还款日期|
|nextPaymentAmount|integer|false|none||下次还款金额(分)|
|overdueAmount|integer|false|none||逾期罚息金额(分)|
|overdueDays|integer|false|none||逾期天数|
|status|integer|false|none||状态：0-正常 1-冻结 2-已过期 3-已用完 4-已退卡 5-逾期冻结|
|activateTime|string|false|none||激活时间|
|expireTime|string|false|none||过期时间|
|createTime|string|false|none||创建时间|

<h2 id="tocS_CommonResultOpenMemberCardPurchaseRespVO">CommonResultOpenMemberCardPurchaseRespVO</h2>

<a id="schemacommonresultopenmembercardpurchaserespvo"></a>
<a id="schema_CommonResultOpenMemberCardPurchaseRespVO"></a>
<a id="tocScommonresultopenmembercardpurchaserespvo"></a>
<a id="tocscommonresultopenmembercardpurchaserespvo"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "resultType": "CARD",
    "id": 1
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[OpenMemberCardPurchaseRespVO](#schemaopenmembercardpurchaserespvo)|false|none||返回数据|

<h2 id="tocS_OpenApiMemberCardRefundApplyReqVO">OpenApiMemberCardRefundApplyReqVO</h2>

<a id="schemaopenapimembercardrefundapplyreqvo"></a>
<a id="schema_OpenApiMemberCardRefundApplyReqVO"></a>
<a id="tocSopenapimembercardrefundapplyreqvo"></a>
<a id="tocsopenapimembercardrefundapplyreqvo"></a>

```json
{
  "cardNo": "MC20240001",
  "appUserId": 1,
  "externalUserId": "ext_user_001",
  "refundAmount": 100,
  "refundReason": "不需要了",
  "evidenceUrls": "[\"https://example.com/img1.jpg\"]"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|cardNo|string|true|none||会员卡卡号|
|appUserId|integer(int64)|false|none||App用户映射ID，传 externalUserId 时可不传|
|externalUserId|string|false|none||下游 App 用户标识，传 appUserId 时可不传|
|refundAmount|number|true|none||申请退款金额|
|refundReason|string|true|none||退款原因|
|evidenceUrls|[string]|false|none||凭证图片URL列表（JSON数组）|

<h2 id="tocS_PageResultOpenMemberCardRespDTO">PageResultOpenMemberCardRespDTO</h2>

<a id="schemapageresultopenmembercardrespdto"></a>
<a id="schema_PageResultOpenMemberCardRespDTO"></a>
<a id="tocSpageresultopenmembercardrespdto"></a>
<a id="tocspageresultopenmembercardrespdto"></a>

```json
{
  "total": 0,
  "list": [
    {
      "id": 1,
      "appId": 1,
      "appUserId": 1,
      "merchantId": 1,
      "templateId": 1,
      "tierId": 1,
      "cardNo": "MC20240001",
      "cardType": 1,
      "paymentMode": 0,
      "levelId": 1,
      "purchaseAmount": 100000,
      "bonusAmount": 5000,
      "totalAmount": 105000,
      "remainAmount": 95000,
      "usedAmount": 10000,
      "timesTotal": 10,
      "timesLeft": 8,
      "timesUsed": 2,
      "discountRate": 85,
      "packageUsage": "string",
      "paidAmount": 100000,
      "owedAmount": 0,
      "installmentStatus": 0,
      "installmentPeriods": 0,
      "nextPaymentDate": "string",
      "nextPaymentAmount": 0,
      "overdueAmount": 0,
      "overdueDays": 0,
      "status": 0,
      "activateTime": "string",
      "expireTime": "string",
      "createTime": "string"
    }
  ]
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|total|integer(int64)|false|none||总量|
|list|[[OpenMemberCardRespDTO](#schemaopenmembercardrespdto)]|false|none||数据|

<h2 id="tocS_CommonResultPageResultOpenMemberCardRespDTO">CommonResultPageResultOpenMemberCardRespDTO</h2>

<a id="schemacommonresultpageresultopenmembercardrespdto"></a>
<a id="schema_CommonResultPageResultOpenMemberCardRespDTO"></a>
<a id="tocScommonresultpageresultopenmembercardrespdto"></a>
<a id="tocscommonresultpageresultopenmembercardrespdto"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "total": 0,
    "list": [
      {
        "id": 1,
        "appId": 1,
        "appUserId": 1,
        "merchantId": 1,
        "templateId": 1,
        "tierId": 1,
        "cardNo": "MC20240001",
        "cardType": 1,
        "paymentMode": 0,
        "levelId": 1,
        "purchaseAmount": 100000,
        "bonusAmount": 5000,
        "totalAmount": 105000,
        "remainAmount": 95000,
        "usedAmount": 10000,
        "timesTotal": 10,
        "timesLeft": 8,
        "timesUsed": 2,
        "discountRate": 85,
        "packageUsage": "string",
        "paidAmount": 100000,
        "owedAmount": 0,
        "installmentStatus": 0,
        "installmentPeriods": 0,
        "nextPaymentDate": "string",
        "nextPaymentAmount": 0,
        "overdueAmount": 0,
        "overdueDays": 0,
        "status": 0,
        "activateTime": "string",
        "expireTime": "string",
        "createTime": "string"
      }
    ]
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[PageResultOpenMemberCardRespDTO](#schemapageresultopenmembercardrespdto)|false|none||返回数据|

<h2 id="tocS_CommonResultOpenMemberCardRespDTO">CommonResultOpenMemberCardRespDTO</h2>

<a id="schemacommonresultopenmembercardrespdto"></a>
<a id="schema_CommonResultOpenMemberCardRespDTO"></a>
<a id="tocScommonresultopenmembercardrespdto"></a>
<a id="tocscommonresultopenmembercardrespdto"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "id": 1,
    "appId": 1,
    "appUserId": 1,
    "merchantId": 1,
    "templateId": 1,
    "tierId": 1,
    "cardNo": "MC20240001",
    "cardType": 1,
    "paymentMode": 0,
    "levelId": 1,
    "purchaseAmount": 100000,
    "bonusAmount": 5000,
    "totalAmount": 105000,
    "remainAmount": 95000,
    "usedAmount": 10000,
    "timesTotal": 10,
    "timesLeft": 8,
    "timesUsed": 2,
    "discountRate": 85,
    "packageUsage": "string",
    "paidAmount": 100000,
    "owedAmount": 0,
    "installmentStatus": 0,
    "installmentPeriods": 0,
    "nextPaymentDate": "string",
    "nextPaymentAmount": 0,
    "overdueAmount": 0,
    "overdueDays": 0,
    "status": 0,
    "activateTime": "string",
    "expireTime": "string",
    "createTime": "string"
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[OpenMemberCardRespDTO](#schemaopenmembercardrespdto)|false|none||返回数据|

<h2 id="tocS_OpenApiMemberCardRechargeReqVO">OpenApiMemberCardRechargeReqVO</h2>

<a id="schemaopenapimembercardrechargereqvo"></a>
<a id="schema_OpenApiMemberCardRechargeReqVO"></a>
<a id="tocSopenapimembercardrechargereqvo"></a>
<a id="tocsopenapimembercardrechargereqvo"></a>

```json
{
  "amount": 10000,
  "tierId": 1
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|amount|integer|true|none||充值金额(分)|
|tierId|integer(int64)|false|none||充值档位ID（使用预设档位时传入）|

<h2 id="tocS_OpenApiCashVoucherGiftRespVO">OpenApiCashVoucherGiftRespVO</h2>

<a id="schemaopenapicashvouchergiftrespvo"></a>
<a id="schema_OpenApiCashVoucherGiftRespVO"></a>
<a id="tocSopenapicashvouchergiftrespvo"></a>
<a id="tocsopenapicashvouchergiftrespvo"></a>

```json
{
  "voucherId": 1,
  "voucherNo": "CV1234567890"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|voucherId|integer(int64)|false|none||抵金券ID|
|voucherNo|string|false|none||券号|

<h2 id="tocS_OpenApiMemberCardWriteOffReqVO">OpenApiMemberCardWriteOffReqVO</h2>

<a id="schemaopenapimembercardwriteoffreqvo"></a>
<a id="schema_OpenApiMemberCardWriteOffReqVO"></a>
<a id="tocSopenapimembercardwriteoffreqvo"></a>
<a id="tocsopenapimembercardwriteoffreqvo"></a>

```json
{
  "storeId": 1,
  "amount": 5000,
  "times": 1,
  "packageItemName": "深层清洁",
  "bizType": 3,
  "bizId": 1,
  "remark": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|storeId|integer(int64)|false|none||门店ID|
|amount|integer|false|none||核销金额(分)，储值卡/折扣卡使用|
|times|integer|false|none||核销次数，次卡使用|
|packageItemName|string|false|none||套餐项目名称，套餐卡使用|
|bizType|integer|true|none||业务类型：1-扫码支付 2-消费券核销 3-手动核销 4-次卡扣次 5-折扣消费 6-套餐项目使用|
|bizId|integer(int64)|false|none||关联业务ID|
|remark|string|false|none||备注|

<h2 id="tocS_CommonResultOpenApiCashVoucherGiftRespVO">CommonResultOpenApiCashVoucherGiftRespVO</h2>

<a id="schemacommonresultopenapicashvouchergiftrespvo"></a>
<a id="schema_CommonResultOpenApiCashVoucherGiftRespVO"></a>
<a id="tocScommonresultopenapicashvouchergiftrespvo"></a>
<a id="tocscommonresultopenapicashvouchergiftrespvo"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "voucherId": 1,
    "voucherNo": "CV1234567890"
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[OpenApiCashVoucherGiftRespVO](#schemaopenapicashvouchergiftrespvo)|false|none||返回数据|

<h2 id="tocS_OpenApiMemberCardCouponPurchaseReqVO">OpenApiMemberCardCouponPurchaseReqVO</h2>

<a id="schemaopenapimembercardcouponpurchasereqvo"></a>
<a id="schema_OpenApiMemberCardCouponPurchaseReqVO"></a>
<a id="tocSopenapimembercardcouponpurchasereqvo"></a>
<a id="tocsopenapimembercardcouponpurchasereqvo"></a>

```json
{
  "couponTemplateId": 1
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|couponTemplateId|integer(int64)|true|none||优惠券模板ID|

<h2 id="tocS_OpenApiCashVoucherGiftReqVO">OpenApiCashVoucherGiftReqVO</h2>

<a id="schemaopenapicashvouchergiftreqvo"></a>
<a id="schema_OpenApiCashVoucherGiftReqVO"></a>
<a id="tocSopenapicashvouchergiftreqvo"></a>
<a id="tocsopenapicashvouchergiftreqvo"></a>

```json
{
  "phone": "13800138000",
  "merchantId": 1,
  "amount": 1000,
  "validityDays": 30,
  "bizNo": "gift_biz_001"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|phone|string|true|none||接收方手机号|
|merchantId|integer(int64)|true|none||商户ID|
|amount|integer|true|none||赠送金额（分）|
|validityDays|integer|false|none||有效期天数，不传则永久有效|
|bizNo|string|false|none||下游业务号，平台仅存储并在事件回调中原样透传，可用于幂等或追踪|

<h2 id="tocS_OpenApiMemberCardCouponWriteOffReqVO">OpenApiMemberCardCouponWriteOffReqVO</h2>

<a id="schemaopenapimembercardcouponwriteoffreqvo"></a>
<a id="schema_OpenApiMemberCardCouponWriteOffReqVO"></a>
<a id="tocSopenapimembercardcouponwriteoffreqvo"></a>
<a id="tocsopenapimembercardcouponwriteoffreqvo"></a>

```json
{
  "couponId": 1,
  "storeId": 1
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|couponId|integer(int64)|true|none||优惠券ID|
|storeId|integer(int64)|false|none||门店ID|

<h2 id="tocS_OpenApiCashVoucherRevokeGiftReqVO">OpenApiCashVoucherRevokeGiftReqVO</h2>

<a id="schemaopenapicashvoucherrevokegiftreqvo"></a>
<a id="schema_OpenApiCashVoucherRevokeGiftReqVO"></a>
<a id="tocSopenapicashvoucherrevokegiftreqvo"></a>
<a id="tocsopenapicashvoucherrevokegiftreqvo"></a>

```json
{
  "voucherId": 100
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|voucherId|integer(int64)|true|none||抵金券ID|

<h2 id="tocS_OpenConsumptionRecordRespDTO">OpenConsumptionRecordRespDTO</h2>

<a id="schemaopenconsumptionrecordrespdto"></a>
<a id="schema_OpenConsumptionRecordRespDTO"></a>
<a id="tocSopenconsumptionrecordrespdto"></a>
<a id="tocsopenconsumptionrecordrespdto"></a>

```json
{
  "id": 1,
  "cardNo": "MC20240001",
  "merchantId": 1,
  "storeId": 1,
  "amount": 5000,
  "balanceBefore": 100000,
  "balanceAfter": 95000,
  "timesBefore": 10,
  "timesAfter": 9,
  "bizType": 3,
  "bizId": 1,
  "voucherId": 1,
  "packageItemName": "深层清洁",
  "operatorType": 2,
  "operatorId": 1,
  "remark": "string",
  "createTime": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||记录ID|
|cardNo|string|false|none||会员卡卡号|
|merchantId|integer(int64)|false|none||商户ID|
|storeId|integer(int64)|false|none||门店ID|
|amount|integer|false|none||核销金额(分)|
|balanceBefore|integer|false|none||核销前余额(分)|
|balanceAfter|integer|false|none||核销后余额(分)|
|timesBefore|integer|false|none||核销前剩余次数(次卡专用)|
|timesAfter|integer|false|none||核销后剩余次数(次卡专用)|
|bizType|integer|false|none||业务类型：1-扫码支付 2-消费券核销 3-手动核销 4-次卡扣次 5-折扣消费 6-套餐项目使用 7-退款回退 8-抵金券购券扣减 9-动态收款码会员卡抵扣|
|bizId|integer(int64)|false|none||关联业务ID|
|voucherId|integer(int64)|false|none||消费券ID|
|packageItemName|string|false|none||套餐项目名称|
|operatorType|integer|false|none||操作人类型：1-用户 2-商户 3-系统|
|operatorId|integer(int64)|false|none||操作人ID|
|remark|string|false|none||备注|
|createTime|string|false|none||创建时间|

<h2 id="tocS_PageResultOpenConsumptionRecordRespDTO">PageResultOpenConsumptionRecordRespDTO</h2>

<a id="schemapageresultopenconsumptionrecordrespdto"></a>
<a id="schema_PageResultOpenConsumptionRecordRespDTO"></a>
<a id="tocSpageresultopenconsumptionrecordrespdto"></a>
<a id="tocspageresultopenconsumptionrecordrespdto"></a>

```json
{
  "total": 0,
  "list": [
    {
      "id": 1,
      "cardNo": "MC20240001",
      "merchantId": 1,
      "storeId": 1,
      "amount": 5000,
      "balanceBefore": 100000,
      "balanceAfter": 95000,
      "timesBefore": 10,
      "timesAfter": 9,
      "bizType": 3,
      "bizId": 1,
      "voucherId": 1,
      "packageItemName": "深层清洁",
      "operatorType": 2,
      "operatorId": 1,
      "remark": "string",
      "createTime": "string"
    }
  ]
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|total|integer(int64)|false|none||总量|
|list|[[OpenConsumptionRecordRespDTO](#schemaopenconsumptionrecordrespdto)]|false|none||数据|

<h2 id="tocS_CommonResultPageResultOpenConsumptionRecordRespDTO">CommonResultPageResultOpenConsumptionRecordRespDTO</h2>

<a id="schemacommonresultpageresultopenconsumptionrecordrespdto"></a>
<a id="schema_CommonResultPageResultOpenConsumptionRecordRespDTO"></a>
<a id="tocScommonresultpageresultopenconsumptionrecordrespdto"></a>
<a id="tocscommonresultpageresultopenconsumptionrecordrespdto"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "total": 0,
    "list": [
      {
        "id": 1,
        "cardNo": "MC20240001",
        "merchantId": 1,
        "storeId": 1,
        "amount": 5000,
        "balanceBefore": 100000,
        "balanceAfter": 95000,
        "timesBefore": 10,
        "timesAfter": 9,
        "bizType": 3,
        "bizId": 1,
        "voucherId": 1,
        "packageItemName": "深层清洁",
        "operatorType": 2,
        "operatorId": 1,
        "remark": "string",
        "createTime": "string"
      }
    ]
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[PageResultOpenConsumptionRecordRespDTO](#schemapageresultopenconsumptionrecordrespdto)|false|none||返回数据|

<h2 id="tocS_OpenMemberCardStatisticsRespDTO">OpenMemberCardStatisticsRespDTO</h2>

<a id="schemaopenmembercardstatisticsrespdto"></a>
<a id="schema_OpenMemberCardStatisticsRespDTO"></a>
<a id="tocSopenmembercardstatisticsrespdto"></a>
<a id="tocsopenmembercardstatisticsrespdto"></a>

```json
{
  "totalCount": 100,
  "activeCount": 80,
  "frozenCount": 5,
  "expiredCount": 10,
  "usedUpCount": 3,
  "refundedCount": 2
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|totalCount|integer(int64)|false|none||总卡数|
|activeCount|integer(int64)|false|none||正常卡数|
|frozenCount|integer(int64)|false|none||冻结卡数|
|expiredCount|integer(int64)|false|none||已过期卡数|
|usedUpCount|integer(int64)|false|none||已用完卡数|
|refundedCount|integer(int64)|false|none||已退卡数|

<h2 id="tocS_TierItem2">TierItem2</h2>

<a id="schematieritem2"></a>
<a id="schema_TierItem2"></a>
<a id="tocStieritem2"></a>
<a id="tocstieritem2"></a>

```json
{
  "rechargeAmount": 10000,
  "bonusAmount": 2000,
  "bonusRate": 20,
  "bonusType": 1,
  "bonusInstallmentMonths": 3,
  "bonusPerConsumeRate": 0.2,
  "sortOrder": 0,
  "status": 0
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|rechargeAmount|integer|true|none||充值金额(分)|
|bonusAmount|integer|false|none||返点/赠送金额(分)|
|bonusRate|number|false|none||返点比例(%)|
|bonusType|integer|false|none||返点方式：1-立即到账 2-分期到账 3-消费返点|
|bonusInstallmentMonths|integer|false|none||分期到账月数|
|bonusPerConsumeRate|number|false|none||消费返点比例|
|sortOrder|integer|false|none||排序|
|status|integer|false|none||状态：0-正常 1-禁用|

<h2 id="tocS_CommonResultOpenMemberCardStatisticsRespDTO">CommonResultOpenMemberCardStatisticsRespDTO</h2>

<a id="schemacommonresultopenmembercardstatisticsrespdto"></a>
<a id="schema_CommonResultOpenMemberCardStatisticsRespDTO"></a>
<a id="tocScommonresultopenmembercardstatisticsrespdto"></a>
<a id="tocscommonresultopenmembercardstatisticsrespdto"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "totalCount": 100,
    "activeCount": 80,
    "frozenCount": 5,
    "expiredCount": 10,
    "usedUpCount": 3,
    "refundedCount": 2
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[OpenMemberCardStatisticsRespDTO](#schemaopenmembercardstatisticsrespdto)|false|none||返回数据|

<h2 id="tocS_OpenResourceRespDTO">OpenResourceRespDTO</h2>

<a id="schemaopenresourcerespdto"></a>
<a id="schema_OpenResourceRespDTO"></a>
<a id="tocSopenresourcerespdto"></a>
<a id="tocsopenresourcerespdto"></a>

```json
{
  "id": 1,
  "merchantId": 1,
  "storeId": 1,
  "typeId": 1,
  "resourceNo": "RES001",
  "resourceName": "VIP包间1号",
  "resourcePhoto": "string",
  "description": "string",
  "tags": "string",
  "attributes": "string",
  "status": 0,
  "isEnabled": 0,
  "isAcceptBooking": 0,
  "isShowInApp": 0,
  "sort": 0,
  "priority": 0,
  "rating": 0,
  "bookingCount": 0,
  "serviceCount": 0,
  "createTime": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||资源ID|
|merchantId|integer(int64)|false|none||商户ID|
|storeId|integer(int64)|false|none||门店ID|
|typeId|integer(int64)|false|none||资源类型ID|
|resourceNo|string|false|none||资源编号|
|resourceName|string|false|none||资源名称|
|resourcePhoto|string|false|none||资源照片URL|
|description|string|false|none||资源描述|
|tags|string|false|none||资源标签(JSON数组)|
|attributes|string|false|none||资源扩展属性(JSON格式)|
|status|integer|false|none||当前状态：0-空闲 1-预订中 2-占用中 3-维护中 4-停用 5-休息中|
|isEnabled|integer|false|none||是否启用：0-否 1-是|
|isAcceptBooking|integer|false|none||是否接受预约：0-否 1-是|
|isShowInApp|integer|false|none||是否在APP显示：0-否 1-是|
|sort|integer|false|none||排序|
|priority|integer|false|none||推荐优先级|
|rating|number|false|none||评分(0-5分)|
|bookingCount|integer|false|none||累计预约次数|
|serviceCount|integer|false|none||累计服务次数|
|createTime|string|false|none||创建时间|

<h2 id="tocS_PageResultOpenResourceRespDTO">PageResultOpenResourceRespDTO</h2>

<a id="schemapageresultopenresourcerespdto"></a>
<a id="schema_PageResultOpenResourceRespDTO"></a>
<a id="tocSpageresultopenresourcerespdto"></a>
<a id="tocspageresultopenresourcerespdto"></a>

```json
{
  "total": 0,
  "list": [
    {
      "id": 1,
      "merchantId": 1,
      "storeId": 1,
      "typeId": 1,
      "resourceNo": "RES001",
      "resourceName": "VIP包间1号",
      "resourcePhoto": "string",
      "description": "string",
      "tags": "string",
      "attributes": "string",
      "status": 0,
      "isEnabled": 0,
      "isAcceptBooking": 0,
      "isShowInApp": 0,
      "sort": 0,
      "priority": 0,
      "rating": 0,
      "bookingCount": 0,
      "serviceCount": 0,
      "createTime": "string"
    }
  ]
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|total|integer(int64)|false|none||总量|
|list|[[OpenResourceRespDTO](#schemaopenresourcerespdto)]|false|none||数据|

<h2 id="tocS_OpenApiMemberCardRespVO">OpenApiMemberCardRespVO</h2>

<a id="schemaopenapimembercardrespvo"></a>
<a id="schema_OpenApiMemberCardRespVO"></a>
<a id="tocSopenapimembercardrespvo"></a>
<a id="tocsopenapimembercardrespvo"></a>

```json
{
  "appId": 1,
  "appUserId": 1,
  "externalUserId": "ext_user_001",
  "merchantId": 1,
  "templateId": 1,
  "tierId": 1,
  "cardNo": "MC20240001",
  "cardType": 1,
  "paymentMode": 0,
  "levelId": 1,
  "purchaseAmount": 100000,
  "bonusAmount": 5000,
  "totalAmount": 105000,
  "remainAmount": 95000,
  "usedAmount": 10000,
  "timesTotal": 10,
  "timesLeft": 8,
  "timesUsed": 2,
  "discountRate": 85,
  "packageUsage": "string",
  "paidAmount": 100000,
  "owedAmount": 0,
  "installmentStatus": 0,
  "installmentPeriods": 0,
  "nextPaymentDate": "string",
  "nextPaymentAmount": 0,
  "overdueAmount": 0,
  "overdueDays": 0,
  "status": 0,
  "activateTime": "string",
  "expireTime": "string",
  "createTime": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|appId|integer(int64)|false|none||来源App ID|
|appUserId|integer(int64)|false|none||App用户映射ID|
|externalUserId|string|false|none||下游App用户标识|
|merchantId|integer(int64)|false|none||商户ID|
|templateId|integer(int64)|false|none||会员卡模板ID|
|tierId|integer(int64)|false|none||充值档位ID|
|cardNo|string|false|none||会员卡卡号|
|cardType|integer|false|none||卡类型：1-储值卡 2-次卡 3-折扣卡 4-套餐卡|
|paymentMode|integer|false|none||支付模式：0-全额 1-分期 2-延期|
|levelId|integer(int64)|false|none||卡等级ID|
|purchaseAmount|integer|false|none||购买金额(分)|
|bonusAmount|integer|false|none||赠送金额(分)|
|totalAmount|integer|false|none||卡总额(分)|
|remainAmount|integer|false|none||剩余可用金额(分)|
|usedAmount|integer|false|none||已使用金额(分)|
|timesTotal|integer|false|none||总次数(次卡专用)|
|timesLeft|integer|false|none||剩余次数(次卡专用)|
|timesUsed|integer|false|none||已使用次数(次卡专用)|
|discountRate|integer|false|none||折扣率(%)|
|packageUsage|string|false|none||套餐使用情况(JSON)|
|paidAmount|integer|false|none||已支付金额(分)|
|owedAmount|integer|false|none||待还金额(分)|
|installmentStatus|integer|false|none||分期状态：0-无分期/已结清 1-还款中 2-已还清 3-逾期|
|installmentPeriods|integer|false|none||分期期数|
|nextPaymentDate|string|false|none||下次还款日期|
|nextPaymentAmount|integer|false|none||下次还款金额(分)|
|overdueAmount|integer|false|none||逾期罚息金额(分)|
|overdueDays|integer|false|none||逾期天数|
|status|integer|false|none||状态：0-正常 1-冻结 2-已过期 3-已用完 4-已退卡 5-逾期冻结|
|activateTime|string|false|none||激活时间|
|expireTime|string|false|none||过期时间|
|createTime|string|false|none||创建时间|

<h2 id="tocS_CommonResultPageResultOpenResourceRespDTO">CommonResultPageResultOpenResourceRespDTO</h2>

<a id="schemacommonresultpageresultopenresourcerespdto"></a>
<a id="schema_CommonResultPageResultOpenResourceRespDTO"></a>
<a id="tocScommonresultpageresultopenresourcerespdto"></a>
<a id="tocscommonresultpageresultopenresourcerespdto"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "total": 0,
    "list": [
      {
        "id": 1,
        "merchantId": 1,
        "storeId": 1,
        "typeId": 1,
        "resourceNo": "RES001",
        "resourceName": "VIP包间1号",
        "resourcePhoto": "string",
        "description": "string",
        "tags": "string",
        "attributes": "string",
        "status": 0,
        "isEnabled": 0,
        "isAcceptBooking": 0,
        "isShowInApp": 0,
        "sort": 0,
        "priority": 0,
        "rating": 0,
        "bookingCount": 0,
        "serviceCount": 0,
        "createTime": "string"
      }
    ]
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[PageResultOpenResourceRespDTO](#schemapageresultopenresourcerespdto)|false|none||返回数据|

<h2 id="tocS_OpenApiWithdrawRespVO">OpenApiWithdrawRespVO</h2>

<a id="schemaopenapiwithdrawrespvo"></a>
<a id="schema_OpenApiWithdrawRespVO"></a>
<a id="tocSopenapiwithdrawrespvo"></a>
<a id="tocsopenapiwithdrawrespvo"></a>

```json
{
  "merchantWithdrawNo": "WD202603170001",
  "externalUserId": "user_10001",
  "amount": 10000,
  "status": 2,
  "failReason": "余额不足",
  "transferTime": "string",
  "createTime": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|merchantWithdrawNo|string|false|none||商户提现单号|
|externalUserId|string|false|none||App端用户标识|
|amount|integer|false|none||提现金额（单位：分）|
|status|integer|false|none||状态：0-待转账 1-转账中 2-成功 3-失败|
|failReason|string|false|none||失败原因|
|transferTime|string|false|none||转账成功时间|
|createTime|string|false|none||创建时间|

<h2 id="tocS_PageResultOpenApiMemberCardRespVO">PageResultOpenApiMemberCardRespVO</h2>

<a id="schemapageresultopenapimembercardrespvo"></a>
<a id="schema_PageResultOpenApiMemberCardRespVO"></a>
<a id="tocSpageresultopenapimembercardrespvo"></a>
<a id="tocspageresultopenapimembercardrespvo"></a>

```json
{
  "total": 0,
  "list": [
    {
      "appId": 1,
      "appUserId": 1,
      "externalUserId": "ext_user_001",
      "merchantId": 1,
      "templateId": 1,
      "tierId": 1,
      "cardNo": "MC20240001",
      "cardType": 1,
      "paymentMode": 0,
      "levelId": 1,
      "purchaseAmount": 100000,
      "bonusAmount": 5000,
      "totalAmount": 105000,
      "remainAmount": 95000,
      "usedAmount": 10000,
      "timesTotal": 10,
      "timesLeft": 8,
      "timesUsed": 2,
      "discountRate": 85,
      "packageUsage": "string",
      "paidAmount": 100000,
      "owedAmount": 0,
      "installmentStatus": 0,
      "installmentPeriods": 0,
      "nextPaymentDate": "string",
      "nextPaymentAmount": 0,
      "overdueAmount": 0,
      "overdueDays": 0,
      "status": 0,
      "activateTime": "string",
      "expireTime": "string",
      "createTime": "string"
    }
  ]
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|total|integer(int64)|false|none||总量|
|list|[[OpenApiMemberCardRespVO](#schemaopenapimembercardrespvo)]|false|none||数据|

<h2 id="tocS_CommonResultOpenResourceRespDTO">CommonResultOpenResourceRespDTO</h2>

<a id="schemacommonresultopenresourcerespdto"></a>
<a id="schema_CommonResultOpenResourceRespDTO"></a>
<a id="tocScommonresultopenresourcerespdto"></a>
<a id="tocscommonresultopenresourcerespdto"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "id": 1,
    "merchantId": 1,
    "storeId": 1,
    "typeId": 1,
    "resourceNo": "RES001",
    "resourceName": "VIP包间1号",
    "resourcePhoto": "string",
    "description": "string",
    "tags": "string",
    "attributes": "string",
    "status": 0,
    "isEnabled": 0,
    "isAcceptBooking": 0,
    "isShowInApp": 0,
    "sort": 0,
    "priority": 0,
    "rating": 0,
    "bookingCount": 0,
    "serviceCount": 0,
    "createTime": "string"
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[OpenResourceRespDTO](#schemaopenresourcerespdto)|false|none||返回数据|

<h2 id="tocS_CommonResultOpenApiWithdrawRespVO">CommonResultOpenApiWithdrawRespVO</h2>

<a id="schemacommonresultopenapiwithdrawrespvo"></a>
<a id="schema_CommonResultOpenApiWithdrawRespVO"></a>
<a id="tocScommonresultopenapiwithdrawrespvo"></a>
<a id="tocscommonresultopenapiwithdrawrespvo"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "merchantWithdrawNo": "WD202603170001",
    "externalUserId": "user_10001",
    "amount": 10000,
    "status": 2,
    "failReason": "余额不足",
    "transferTime": "string",
    "createTime": "string"
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[OpenApiWithdrawRespVO](#schemaopenapiwithdrawrespvo)|false|none||返回数据|

<h2 id="tocS_CommonResultPageResultOpenApiMemberCardRespVO">CommonResultPageResultOpenApiMemberCardRespVO</h2>

<a id="schemacommonresultpageresultopenapimembercardrespvo"></a>
<a id="schema_CommonResultPageResultOpenApiMemberCardRespVO"></a>
<a id="tocScommonresultpageresultopenapimembercardrespvo"></a>
<a id="tocscommonresultpageresultopenapimembercardrespvo"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "total": 0,
    "list": [
      {
        "appId": 1,
        "appUserId": 1,
        "externalUserId": "ext_user_001",
        "merchantId": 1,
        "templateId": 1,
        "tierId": 1,
        "cardNo": "MC20240001",
        "cardType": 1,
        "paymentMode": 0,
        "levelId": 1,
        "purchaseAmount": 100000,
        "bonusAmount": 5000,
        "totalAmount": 105000,
        "remainAmount": 95000,
        "usedAmount": 10000,
        "timesTotal": 10,
        "timesLeft": 8,
        "timesUsed": 2,
        "discountRate": 85,
        "packageUsage": "string",
        "paidAmount": 100000,
        "owedAmount": 0,
        "installmentStatus": 0,
        "installmentPeriods": 0,
        "nextPaymentDate": "string",
        "nextPaymentAmount": 0,
        "overdueAmount": 0,
        "overdueDays": 0,
        "status": 0,
        "activateTime": "string",
        "expireTime": "string",
        "createTime": "string"
      }
    ]
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[PageResultOpenApiMemberCardRespVO](#schemapageresultopenapimembercardrespvo)|false|none||返回数据|

<h2 id="tocS_TimeSlot">TimeSlot</h2>

<a id="schematimeslot"></a>
<a id="schema_TimeSlot"></a>
<a id="tocStimeslot"></a>
<a id="tocstimeslot"></a>

```json
{
  "startTime": "09:00",
  "endTime": "12:00",
  "type": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|startTime|string|false|none||开始时间（HH:mm格式）|
|endTime|string|false|none||结束时间（HH:mm格式）|
|type|string|false|none||时间段类型：available-可用 booked-已预约 maintenance-维护中|

<h2 id="tocS_OpenApiWithdrawCreateReqVO">OpenApiWithdrawCreateReqVO</h2>

<a id="schemaopenapiwithdrawcreatereqvo"></a>
<a id="schema_OpenApiWithdrawCreateReqVO"></a>
<a id="tocSopenapiwithdrawcreatereqvo"></a>
<a id="tocsopenapiwithdrawcreatereqvo"></a>

```json
{
  "externalUserId": "user_10001",
  "merchantWithdrawNo": "WD202603170001",
  "amount": 10000,
  "subject": "用户提现",
  "withdrawAccountId": 1024,
  "accountType": 3,
  "accountName": "张三",
  "cardNo": "6222000012345678",
  "bankName": "中国银行",
  "wechatOpenid": "oUpF8uMuAJO_M2pxb1Q9zNjWeS6o",
  "alipayAccount": "zhangsan@alipay.com"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|externalUserId|string|true|none||App端用户标识|
|merchantWithdrawNo|string|true|none||商户提现单号（下游App保证唯一）|
|amount|integer|true|none||提现金额（单位：分）|
|subject|string|false|none||提现标题/备注|
|withdrawAccountId|integer(int64)|false|none||绑定的提现账户ID（与直传账户二选一，优先使用）|
|accountType|integer|false|none||账户类型（1=银行卡 2=微信 3=支付宝），直传时必填|
|accountName|string|false|none||账户持有人姓名，直传时必填|
|cardNo|string|false|none||银行卡号（accountType=1时必填）|
|bankName|string|false|none||开户行名称（accountType=1时必填）|
|wechatOpenid|string|false|none||微信OpenID（accountType=2时必填）|
|alipayAccount|string|false|none||支付宝账号（accountType=3时必填）|

<h2 id="tocS_OpenApiMemberCardPurchaseCreateReqVO">OpenApiMemberCardPurchaseCreateReqVO</h2>

<a id="schemaopenapimembercardpurchasecreatereqvo"></a>
<a id="schema_OpenApiMemberCardPurchaseCreateReqVO"></a>
<a id="tocSopenapimembercardpurchasecreatereqvo"></a>
<a id="tocsopenapimembercardpurchasecreatereqvo"></a>

```json
{
  "merchantId": 1,
  "templateId": 1,
  "externalUserId": "ext_user_001",
  "phone": "13800138000",
  "tierId": 1,
  "paymentMode": 0,
  "bizNo": "mc_order_20260329_001",
  "storeId": 1
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|merchantId|integer(int64)|true|none||商户ID|
|templateId|integer(int64)|true|none||会员卡模板ID|
|externalUserId|string|true|none||下游 App 用户标识|
|phone|string|false|none||用户手机号（全款购卡且未进件时必传，系统将自动注册用户）|
|tierId|integer(int64)|false|none||充值档位ID（储值卡选择档位时传入）|
|paymentMode|integer|true|none||支付方式：0-全额付款 1-分期付款 2-延期付款|
|bizNo|string|false|none||下游业务号，平台仅存储并在会员卡购买相关事件回调中原样透传|
|storeId|integer(int64)|false|none||门店ID，标记用户在哪个门店购买|

<h2 id="tocS_CommonResultOpenApiMemberCardRespVO">CommonResultOpenApiMemberCardRespVO</h2>

<a id="schemacommonresultopenapimembercardrespvo"></a>
<a id="schema_CommonResultOpenApiMemberCardRespVO"></a>
<a id="tocScommonresultopenapimembercardrespvo"></a>
<a id="tocscommonresultopenapimembercardrespvo"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "appId": 1,
    "appUserId": 1,
    "externalUserId": "ext_user_001",
    "merchantId": 1,
    "templateId": 1,
    "tierId": 1,
    "cardNo": "MC20240001",
    "cardType": 1,
    "paymentMode": 0,
    "levelId": 1,
    "purchaseAmount": 100000,
    "bonusAmount": 5000,
    "totalAmount": 105000,
    "remainAmount": 95000,
    "usedAmount": 10000,
    "timesTotal": 10,
    "timesLeft": 8,
    "timesUsed": 2,
    "discountRate": 85,
    "packageUsage": "string",
    "paidAmount": 100000,
    "owedAmount": 0,
    "installmentStatus": 0,
    "installmentPeriods": 0,
    "nextPaymentDate": "string",
    "nextPaymentAmount": 0,
    "overdueAmount": 0,
    "overdueDays": 0,
    "status": 0,
    "activateTime": "string",
    "expireTime": "string",
    "createTime": "string"
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[OpenApiMemberCardRespVO](#schemaopenapimembercardrespvo)|false|none||返回数据|

<h2 id="tocS_OpenResourceAvailabilityRespDTO">OpenResourceAvailabilityRespDTO</h2>

<a id="schemaopenresourceavailabilityrespdto"></a>
<a id="schema_OpenResourceAvailabilityRespDTO"></a>
<a id="tocSopenresourceavailabilityrespdto"></a>
<a id="tocsopenresourceavailabilityrespdto"></a>

```json
{
  "resourceId": 1,
  "date": "string",
  "currentStatus": 0,
  "isRestDay": true,
  "availableSlots": [
    {
      "startTime": "09:00",
      "endTime": "12:00",
      "type": "string"
    }
  ],
  "occupiedSlots": [
    {
      "startTime": "09:00",
      "endTime": "12:00",
      "type": "string"
    }
  ]
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|resourceId|integer(int64)|false|none||资源ID|
|date|string|false|none||查询日期|
|currentStatus|integer|false|none||资源当前状态：0-空闲 1-预订中 2-占用中 3-维护中 4-停用 5-休息中|
|isRestDay|boolean|false|none||当日是否为休息日|
|availableSlots|[[TimeSlot](#schematimeslot)]|false|none||可用时间段列表|
|occupiedSlots|[[TimeSlot](#schematimeslot)]|false|none||已占用时间段列表|

<h2 id="tocS_CommonResultOpenResourceAvailabilityRespDTO">CommonResultOpenResourceAvailabilityRespDTO</h2>

<a id="schemacommonresultopenresourceavailabilityrespdto"></a>
<a id="schema_CommonResultOpenResourceAvailabilityRespDTO"></a>
<a id="tocScommonresultopenresourceavailabilityrespdto"></a>
<a id="tocscommonresultopenresourceavailabilityrespdto"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "resourceId": 1,
    "date": "string",
    "currentStatus": 0,
    "isRestDay": true,
    "availableSlots": [
      {
        "startTime": "09:00",
        "endTime": "12:00",
        "type": "string"
      }
    ],
    "occupiedSlots": [
      {
        "startTime": "09:00",
        "endTime": "12:00",
        "type": "string"
      }
    ]
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[OpenResourceAvailabilityRespDTO](#schemaopenresourceavailabilityrespdto)|false|none||返回数据|

<h2 id="tocS_OpenApiMemberCardWriteOffQrRespVO">OpenApiMemberCardWriteOffQrRespVO</h2>

<a id="schemaopenapimembercardwriteoffqrrespvo"></a>
<a id="schema_OpenApiMemberCardWriteOffQrRespVO"></a>
<a id="tocSopenapimembercardwriteoffqrrespvo"></a>
<a id="tocsopenapimembercardwriteoffqrrespvo"></a>

```json
{
  "requestNo": "OWR123456789",
  "qrToken": "OWR123.1742793600.ABCDEF",
  "qrTimestamp": 1742793600,
  "qrExpireTime": "string",
  "resourceType": 1,
  "cardNo": "MC20240001"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|requestNo|string|false|none||请求号|
|qrToken|string|false|none||二维码令牌|
|qrTimestamp|integer(int64)|false|none||二维码生成时间戳（秒）|
|qrExpireTime|string|false|none||二维码过期时间|
|resourceType|integer|false|none||资源类型：1-会员卡 2-优惠券 3-抵金券|
|cardNo|string|false|none||会员卡卡号|

<h2 id="tocS_OpenResourceBatchStatusRespDTO">OpenResourceBatchStatusRespDTO</h2>

<a id="schemaopenresourcebatchstatusrespdto"></a>
<a id="schema_OpenResourceBatchStatusRespDTO"></a>
<a id="tocSopenresourcebatchstatusrespdto"></a>
<a id="tocsopenresourcebatchstatusrespdto"></a>

```json
{
  "resourceId": 1,
  "resourceName": "VIP包间1号",
  "status": 0,
  "isEnabled": 0
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|resourceId|integer(int64)|false|none||资源ID|
|resourceName|string|false|none||资源名称|
|status|integer|false|none||当前状态：0-空闲 1-预订中 2-占用中 3-维护中 4-停用 5-休息中|
|isEnabled|integer|false|none||是否启用：0-否 1-是|

<h2 id="tocS_CommonResultOpenApiMemberCardWriteOffQrRespVO">CommonResultOpenApiMemberCardWriteOffQrRespVO</h2>

<a id="schemacommonresultopenapimembercardwriteoffqrrespvo"></a>
<a id="schema_CommonResultOpenApiMemberCardWriteOffQrRespVO"></a>
<a id="tocScommonresultopenapimembercardwriteoffqrrespvo"></a>
<a id="tocscommonresultopenapimembercardwriteoffqrrespvo"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "requestNo": "OWR123456789",
    "qrToken": "OWR123.1742793600.ABCDEF",
    "qrTimestamp": 1742793600,
    "qrExpireTime": "string",
    "resourceType": 1,
    "cardNo": "MC20240001"
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[OpenApiMemberCardWriteOffQrRespVO](#schemaopenapimembercardwriteoffqrrespvo)|false|none||返回数据|

<h2 id="tocS_CommonResultListOpenResourceBatchStatusRespDTO">CommonResultListOpenResourceBatchStatusRespDTO</h2>

<a id="schemacommonresultlistopenresourcebatchstatusrespdto"></a>
<a id="schema_CommonResultListOpenResourceBatchStatusRespDTO"></a>
<a id="tocScommonresultlistopenresourcebatchstatusrespdto"></a>
<a id="tocscommonresultlistopenresourcebatchstatusrespdto"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": [
    {
      "resourceId": 1,
      "resourceName": "VIP包间1号",
      "status": 0,
      "isEnabled": 0
    }
  ]
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[[OpenResourceBatchStatusRespDTO](#schemaopenresourcebatchstatusrespdto)]|false|none||返回数据|

<h2 id="tocS_OpenApiMemberCardWriteOffRecordRespVO">OpenApiMemberCardWriteOffRecordRespVO</h2>

<a id="schemaopenapimembercardwriteoffrecordrespvo"></a>
<a id="schema_OpenApiMemberCardWriteOffRecordRespVO"></a>
<a id="tocSopenapimembercardwriteoffrecordrespvo"></a>
<a id="tocsopenapimembercardwriteoffrecordrespvo"></a>

```json
{
  "requestNo": "OWR123456789",
  "appId": 1,
  "merchantId": 1,
  "storeId": 1,
  "resourceType": 1,
  "cardNo": "MC20240001",
  "status": 1,
  "qrTimestamp": 1742793600,
  "qrExpireTime": "string",
  "amount": 5000,
  "times": 1,
  "packageItemName": "深层清洁",
  "operatorId": 1,
  "remark": "string",
  "callbackStatus": 0,
  "confirmTime": "string",
  "completeTime": "string",
  "cancelTime": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|requestNo|string|false|none||请求号|
|appId|integer(int64)|false|none||来源App ID|
|merchantId|integer(int64)|false|none||商户ID|
|storeId|integer(int64)|false|none||门店ID|
|resourceType|integer|false|none||资源类型：1-会员卡 2-优惠券 3-抵金券|
|cardNo|string|false|none||会员卡卡号|
|status|integer|false|none||状态：0-待扫码 1-待确认 2-已完成 3-已取消 4-已过期|
|qrTimestamp|integer(int64)|false|none||二维码生成时间戳（秒）|
|qrExpireTime|string|false|none||二维码过期时间|
|amount|integer|false|none||核销金额(分)|
|times|integer|false|none||核销次数|
|packageItemName|string|false|none||套餐项目名称|
|operatorId|integer(int64)|false|none||操作员工ID|
|remark|string|false|none||备注|
|callbackStatus|integer|false|none||回调状态：0-待创建 1-已创建 2-无需回调|
|confirmTime|string|false|none||确认时间|
|completeTime|string|false|none||完成时间|
|cancelTime|string|false|none||取消时间|

<h2 id="tocS_OpenResourceStatisticsRespDTO">OpenResourceStatisticsRespDTO</h2>

<a id="schemaopenresourcestatisticsrespdto"></a>
<a id="schema_OpenResourceStatisticsRespDTO"></a>
<a id="tocSopenresourcestatisticsrespdto"></a>
<a id="tocsopenresourcestatisticsrespdto"></a>

```json
{
  "totalCount": 50,
  "enabledCount": 40,
  "disabledCount": 10,
  "idleCount": 20,
  "bookingCount": 10,
  "occupiedCount": 5,
  "maintenanceCount": 3,
  "disabledStatusCount": 2,
  "restingCount": 5,
  "acceptBookingCount": 35,
  "totalBookingCount": 500,
  "totalServiceCount": 450
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|totalCount|integer(int64)|false|none||资源总数|
|enabledCount|integer(int64)|false|none||启用数量|
|disabledCount|integer(int64)|false|none||停用数量|
|idleCount|integer(int64)|false|none||空闲数量|
|bookingCount|integer(int64)|false|none||预订中数量|
|occupiedCount|integer(int64)|false|none||占用中数量|
|maintenanceCount|integer(int64)|false|none||维护中数量|
|disabledStatusCount|integer(int64)|false|none||停用状态数量|
|restingCount|integer(int64)|false|none||休息中数量|
|acceptBookingCount|integer(int64)|false|none||可接受预约数量|
|totalBookingCount|integer(int64)|false|none||累计总预约次数|
|totalServiceCount|integer(int64)|false|none||累计总服务次数|

<h2 id="tocS_CommonResultOpenApiMemberCardWriteOffRecordRespVO">CommonResultOpenApiMemberCardWriteOffRecordRespVO</h2>

<a id="schemacommonresultopenapimembercardwriteoffrecordrespvo"></a>
<a id="schema_CommonResultOpenApiMemberCardWriteOffRecordRespVO"></a>
<a id="tocScommonresultopenapimembercardwriteoffrecordrespvo"></a>
<a id="tocscommonresultopenapimembercardwriteoffrecordrespvo"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "requestNo": "OWR123456789",
    "appId": 1,
    "merchantId": 1,
    "storeId": 1,
    "resourceType": 1,
    "cardNo": "MC20240001",
    "status": 1,
    "qrTimestamp": 1742793600,
    "qrExpireTime": "string",
    "amount": 5000,
    "times": 1,
    "packageItemName": "深层清洁",
    "operatorId": 1,
    "remark": "string",
    "callbackStatus": 0,
    "confirmTime": "string",
    "completeTime": "string",
    "cancelTime": "string"
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[OpenApiMemberCardWriteOffRecordRespVO](#schemaopenapimembercardwriteoffrecordrespvo)|false|none||返回数据|

<h2 id="tocS_CommonResultOpenResourceStatisticsRespDTO">CommonResultOpenResourceStatisticsRespDTO</h2>

<a id="schemacommonresultopenresourcestatisticsrespdto"></a>
<a id="schema_CommonResultOpenResourceStatisticsRespDTO"></a>
<a id="tocScommonresultopenresourcestatisticsrespdto"></a>
<a id="tocscommonresultopenresourcestatisticsrespdto"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "totalCount": 50,
    "enabledCount": 40,
    "disabledCount": 10,
    "idleCount": 20,
    "bookingCount": 10,
    "occupiedCount": 5,
    "maintenanceCount": 3,
    "disabledStatusCount": 2,
    "restingCount": 5,
    "acceptBookingCount": 35,
    "totalBookingCount": 500,
    "totalServiceCount": 450
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[OpenResourceStatisticsRespDTO](#schemaopenresourcestatisticsrespdto)|false|none||返回数据|

<h2 id="tocS_OpenApiResourceCreateReqVO">OpenApiResourceCreateReqVO</h2>

<a id="schemaopenapiresourcecreatereqvo"></a>
<a id="schema_OpenApiResourceCreateReqVO"></a>
<a id="tocSopenapiresourcecreatereqvo"></a>
<a id="tocsopenapiresourcecreatereqvo"></a>

```json
{
  "merchantId": 1,
  "storeId": 1,
  "typeId": 1,
  "resourceName": "VIP包间1号",
  "resourcePhoto": "string",
  "description": "string",
  "tags": "string",
  "attributes": "string",
  "isEnabled": 1,
  "isAcceptBooking": 1,
  "isShowInApp": 1,
  "sort": 0,
  "priority": 0
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|merchantId|integer(int64)|true|none||商户ID|
|storeId|integer(int64)|true|none||门店ID|
|typeId|integer(int64)|true|none||资源类型ID|
|resourceName|string|true|none||资源名称|
|resourcePhoto|string|false|none||资源照片URL|
|description|string|false|none||资源描述|
|tags|string|false|none||资源标签(JSON数组)|
|attributes|string|false|none||资源扩展属性(JSON格式)|
|isEnabled|integer|false|none||是否启用：0-否 1-是|
|isAcceptBooking|integer|false|none||是否接受预约：0-否 1-是|
|isShowInApp|integer|false|none||是否在APP显示：0-否 1-是|
|sort|integer|false|none||排序|
|priority|integer|false|none||推荐优先级|

<h2 id="tocS_OpenApiResourceUpdateReqVO">OpenApiResourceUpdateReqVO</h2>

<a id="schemaopenapiresourceupdatereqvo"></a>
<a id="schema_OpenApiResourceUpdateReqVO"></a>
<a id="tocSopenapiresourceupdatereqvo"></a>
<a id="tocsopenapiresourceupdatereqvo"></a>

```json
{
  "resourceName": "VIP包间1号",
  "resourcePhoto": "string",
  "description": "string",
  "tags": "string",
  "attributes": "string",
  "isEnabled": 1,
  "isAcceptBooking": 1,
  "isShowInApp": 1,
  "sort": 0,
  "priority": 0
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|resourceName|string|false|none||资源名称|
|resourcePhoto|string|false|none||资源照片URL|
|description|string|false|none||资源描述|
|tags|string|false|none||资源标签(JSON数组)|
|attributes|string|false|none||资源扩展属性(JSON格式)|
|isEnabled|integer|false|none||是否启用：0-否 1-是|
|isAcceptBooking|integer|false|none||是否接受预约：0-否 1-是|
|isShowInApp|integer|false|none||是否在APP显示：0-否 1-是|
|sort|integer|false|none||排序|
|priority|integer|false|none||推荐优先级|

<h2 id="tocS_OpenApiResourceStatusUpdateReqVO">OpenApiResourceStatusUpdateReqVO</h2>

<a id="schemaopenapiresourcestatusupdatereqvo"></a>
<a id="schema_OpenApiResourceStatusUpdateReqVO"></a>
<a id="tocSopenapiresourcestatusupdatereqvo"></a>
<a id="tocsopenapiresourcestatusupdatereqvo"></a>

```json
{
  "status": 0,
  "changeReason": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|status|integer|true|none||目标状态：0-空闲 1-预订中 2-占用中 3-维护中 4-停用 5-休息中|
|changeReason|string|false|none||变更原因|

<h2 id="tocS_OpenApiResourcePriceUpdateReqVO">OpenApiResourcePriceUpdateReqVO</h2>

<a id="schemaopenapiresourcepriceupdatereqvo"></a>
<a id="schema_OpenApiResourcePriceUpdateReqVO"></a>
<a id="tocSopenapiresourcepriceupdatereqvo"></a>
<a id="tocsopenapiresourcepriceupdatereqvo"></a>

```json
{
  "billingMethod": 1,
  "basePrice": 10000,
  "memberPrice": 8000,
  "vipPrice": 6000,
  "timeSlotPrices": "string",
  "tieredPrices": "string",
  "packagePrices": "string",
  "extraFees": "string",
  "bufferMinutes": 15,
  "minBookingMinutes": 30,
  "maxBookingMinutes": 480,
  "isEnabled": 1
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|billingMethod|integer|true|none||计费方式：1-按次计费 2-按时长计费 3-按时段计费 4-阶梯计费 5-套餐计费|
|basePrice|integer|true|none||基础价格(分)|
|memberPrice|integer|false|none||会员价格(分)|
|vipPrice|integer|false|none||VIP价格(分)|
|timeSlotPrices|string|false|none||时段价格(JSON格式)|
|tieredPrices|string|false|none||阶梯价格(JSON格式)|
|packagePrices|string|false|none||套餐价格(JSON格式)|
|extraFees|string|false|none||附加费用(JSON格式)|
|bufferMinutes|integer|false|none||预约间隔缓冲时间(分钟)|
|minBookingMinutes|integer|false|none||最小预约时长(分钟)|
|maxBookingMinutes|integer|false|none||最大预约时长(分钟)|
|isEnabled|integer|false|none||是否启用：0-否 1-是|

<h2 id="tocS_OpenApiResourceScheduleUpdateReqVO">OpenApiResourceScheduleUpdateReqVO</h2>

<a id="schemaopenapiresourcescheduleupdatereqvo"></a>
<a id="schema_OpenApiResourceScheduleUpdateReqVO"></a>
<a id="tocSopenapiresourcescheduleupdatereqvo"></a>
<a id="tocsopenapiresourcescheduleupdatereqvo"></a>

```json
{
  "scheduleType": 1,
  "dayOfWeek": 1,
  "scheduleDate": "string",
  "timeSlots": "string",
  "isRestDay": 0,
  "remark": "string",
  "isEnabled": 1
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|scheduleType|integer|true|none||排班类型：1-固定排班 2-灵活排班 3-轮班排班|
|dayOfWeek|integer|false|none||星期几(1-7，1=周一，固定排班专用)|
|scheduleDate|string|false|none||排班日期(灵活排班专用)|
|timeSlots|string|true|none||工作时间段(JSON数组)|
|isRestDay|integer|false|none||是否休息日：0-否 1-是|
|remark|string|false|none||备注|
|isEnabled|integer|false|none||是否启用：0-否 1-是|

<h2 id="tocS_OpenApiWithdrawAccountBindReqVO">OpenApiWithdrawAccountBindReqVO</h2>

<a id="schemaopenapiwithdrawaccountbindreqvo"></a>
<a id="schema_OpenApiWithdrawAccountBindReqVO"></a>
<a id="tocSopenapiwithdrawaccountbindreqvo"></a>
<a id="tocsopenapiwithdrawaccountbindreqvo"></a>

```json
{
  "externalUserId": "user_10001",
  "accountType": 1,
  "accountName": "张三",
  "cardNo": "6222000012345678",
  "bankName": "中国银行",
  "bankBranch": "深圳南山支行",
  "wechatOpenid": "oUpF8uMuAJO_M2pxb1Q9zNjWeS6o",
  "alipayAccount": "zhangsan@alipay.com"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|externalUserId|string|true|none||App端用户标识|
|accountType|integer|true|none||账户类型（1=银行卡 2=微信 3=支付宝）|
|accountName|string|true|none||账户持有人姓名|
|cardNo|string|false|none||========== 银行卡 ==========<br />银行卡号（accountType=1时必填）|
|bankName|string|false|none||开户行名称（accountType=1时必填）|
|bankBranch|string|false|none||开户行支行|
|wechatOpenid|string|false|none||========== 微信 ==========<br />微信OpenID（accountType=2时必填）|
|alipayAccount|string|false|none||========== 支付宝 ==========<br />支付宝账号（accountType=3时必填）|

<h2 id="tocS_OpenApiOnboardStatusRespVO">OpenApiOnboardStatusRespVO</h2>

<a id="schemaopenapionboardstatusrespvo"></a>
<a id="schema_OpenApiOnboardStatusRespVO"></a>
<a id="tocSopenapionboardstatusrespvo"></a>
<a id="tocsopenapionboardstatusrespvo"></a>

```json
{
  "externalUserId": "user_123",
  "signStatus": 2,
  "signStatusDesc": "已入网",
  "merchantNo": "100012345678",
  "signTime": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|externalUserId|string|false|none||App端用户唯一标识|
|signStatus|integer|false|none||入网状态：0-未入网 1-入网中 2-已入网 3-入网失败|
|signStatusDesc|string|false|none||入网状态描述|
|merchantNo|string|false|none||易宝子商户编号（入网成功后返回）|
|signTime|string|false|none||入网时间（入网成功时的签约时间）|

<h2 id="tocS_OpenMerchantRespDTO">OpenMerchantRespDTO</h2>

<a id="schemaopenmerchantrespdto"></a>
<a id="schema_OpenMerchantRespDTO"></a>
<a id="tocSopenmerchantrespdto"></a>
<a id="tocsopenmerchantrespdto"></a>

```json
{
  "id": 1,
  "merchantNo": "M20240001",
  "name": "沐沐美业",
  "shortName": "沐沐",
  "logoUrl": "string",
  "coverUrl": "string",
  "contactName": "张三",
  "contactPhone": "13800138000",
  "contactEmail": "contact@example.com",
  "province": "广东省",
  "city": "深圳市",
  "district": "南山区",
  "address": "科技园南区",
  "status": 0,
  "createTime": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||商户ID|
|merchantNo|string|false|none||商户编号|
|name|string|false|none||商户名称|
|shortName|string|false|none||商户简称|
|logoUrl|string|false|none||Logo URL|
|coverUrl|string|false|none||封面图 URL|
|contactName|string|false|none||联系人姓名|
|contactPhone|string|false|none||联系电话|
|contactEmail|string|false|none||联系邮箱|
|province|string|false|none||省|
|city|string|false|none||市|
|district|string|false|none||区|
|address|string|false|none||详细地址|
|status|integer|false|none||状态：0-正常 1-禁用 2-注销|
|createTime|string|false|none||创建时间|

<h2 id="tocS_OpenApiWithdrawAccountRespVO">OpenApiWithdrawAccountRespVO</h2>

<a id="schemaopenapiwithdrawaccountrespvo"></a>
<a id="schema_OpenApiWithdrawAccountRespVO"></a>
<a id="tocSopenapiwithdrawaccountrespvo"></a>
<a id="tocsopenapiwithdrawaccountrespvo"></a>

```json
{
  "id": 1024,
  "accountType": 1,
  "accountName": "张*三",
  "cardNo": "6222****5678",
  "bankName": "中国银行",
  "wechatOpenid": "oUpF8uMuAJO_M2pxb1Q9zNjWeS6o",
  "alipayAccount": "zha****@alipay.com",
  "isDefault": true,
  "createTime": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||账户ID|
|accountType|integer|false|none||账户类型（1=银行卡 2=微信 3=支付宝）|
|accountName|string|false|none||账户持有人姓名|
|cardNo|string|false|none||银行卡号（脱敏）|
|bankName|string|false|none||开户行|
|wechatOpenid|string|false|none||微信OpenID|
|alipayAccount|string|false|none||支付宝账号（脱敏）|
|isDefault|boolean|false|none||是否默认账户|
|createTime|string|false|none||创建时间|

<h2 id="tocS_CommonResultOpenApiOnboardStatusRespVO">CommonResultOpenApiOnboardStatusRespVO</h2>

<a id="schemacommonresultopenapionboardstatusrespvo"></a>
<a id="schema_CommonResultOpenApiOnboardStatusRespVO"></a>
<a id="tocScommonresultopenapionboardstatusrespvo"></a>
<a id="tocscommonresultopenapionboardstatusrespvo"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "externalUserId": "user_123",
    "signStatus": 2,
    "signStatusDesc": "已入网",
    "merchantNo": "100012345678",
    "signTime": "string"
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[OpenApiOnboardStatusRespVO](#schemaopenapionboardstatusrespvo)|false|none||返回数据|

<h2 id="tocS_PageResultOpenMerchantRespDTO">PageResultOpenMerchantRespDTO</h2>

<a id="schemapageresultopenmerchantrespdto"></a>
<a id="schema_PageResultOpenMerchantRespDTO"></a>
<a id="tocSpageresultopenmerchantrespdto"></a>
<a id="tocspageresultopenmerchantrespdto"></a>

```json
{
  "total": 0,
  "list": [
    {
      "id": 1,
      "merchantNo": "M20240001",
      "name": "沐沐美业",
      "shortName": "沐沐",
      "logoUrl": "string",
      "coverUrl": "string",
      "contactName": "张三",
      "contactPhone": "13800138000",
      "contactEmail": "contact@example.com",
      "province": "广东省",
      "city": "深圳市",
      "district": "南山区",
      "address": "科技园南区",
      "status": 0,
      "createTime": "string"
    }
  ]
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|total|integer(int64)|false|none||总量|
|list|[[OpenMerchantRespDTO](#schemaopenmerchantrespdto)]|false|none||数据|

<h2 id="tocS_CommonResultListOpenApiWithdrawAccountRespVO">CommonResultListOpenApiWithdrawAccountRespVO</h2>

<a id="schemacommonresultlistopenapiwithdrawaccountrespvo"></a>
<a id="schema_CommonResultListOpenApiWithdrawAccountRespVO"></a>
<a id="tocScommonresultlistopenapiwithdrawaccountrespvo"></a>
<a id="tocscommonresultlistopenapiwithdrawaccountrespvo"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": [
    {
      "id": 1024,
      "accountType": 1,
      "accountName": "张*三",
      "cardNo": "6222****5678",
      "bankName": "中国银行",
      "wechatOpenid": "oUpF8uMuAJO_M2pxb1Q9zNjWeS6o",
      "alipayAccount": "zha****@alipay.com",
      "isDefault": true,
      "createTime": "string"
    }
  ]
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[[OpenApiWithdrawAccountRespVO](#schemaopenapiwithdrawaccountrespvo)]|false|none||返回数据|

<h2 id="tocS_OpenApiAppUserOnboardReqVO">OpenApiAppUserOnboardReqVO</h2>

<a id="schemaopenapiappuseronboardreqvo"></a>
<a id="schema_OpenApiAppUserOnboardReqVO"></a>
<a id="tocSopenapiappuseronboardreqvo"></a>
<a id="tocsopenapiappuseronboardreqvo"></a>

```json
{
  "externalUserId": "user_123",
  "signName": "张三",
  "shortName": "张三",
  "idCardNumber": "110101199001011234",
  "idCardFrontUrl": "https://oss.example.com/id_front.jpg",
  "idCardBackUrl": "https://oss.example.com/id_back.jpg",
  "mobile": "13800138000",
  "province": "北京市",
  "city": "北京市",
  "district": "朝阳区",
  "address": "朝阳区xxx路xxx号",
  "provinceCode": "110000",
  "cityCode": "110100",
  "districtCode": "110105"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|externalUserId|string|true|none||App端用户唯一标识|
|signName|string|true|none||签约名称（须与身份证姓名一致）|
|shortName|string|true|none||简称（用于收银台展示，不超过20字）|
|idCardNumber|string|true|none||证件号码（身份证号）|
|idCardFrontUrl|string|false|none||证件人像面照片URL|
|idCardBackUrl|string|false|none||证件非人像面照片URL|
|mobile|string|true|none||手机号|
|province|string|false|none||省名称|
|city|string|false|none||市名称|
|district|string|false|none||区名称|
|address|string|false|none||详细地址|
|provinceCode|string|true|none||省编码（如 110000）|
|cityCode|string|true|none||市编码（如 110100）|
|districtCode|string|true|none||区编码（如 110105）|

<h2 id="tocS_CommonResultPageResultOpenMerchantRespDTO">CommonResultPageResultOpenMerchantRespDTO</h2>

<a id="schemacommonresultpageresultopenmerchantrespdto"></a>
<a id="schema_CommonResultPageResultOpenMerchantRespDTO"></a>
<a id="tocScommonresultpageresultopenmerchantrespdto"></a>
<a id="tocscommonresultpageresultopenmerchantrespdto"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "total": 0,
    "list": [
      {
        "id": 1,
        "merchantNo": "M20240001",
        "name": "沐沐美业",
        "shortName": "沐沐",
        "logoUrl": "string",
        "coverUrl": "string",
        "contactName": "张三",
        "contactPhone": "13800138000",
        "contactEmail": "contact@example.com",
        "province": "广东省",
        "city": "深圳市",
        "district": "南山区",
        "address": "科技园南区",
        "status": 0,
        "createTime": "string"
      }
    ]
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[PageResultOpenMerchantRespDTO](#schemapageresultopenmerchantrespdto)|false|none||返回数据|

<h2 id="tocS_CommonResultOpenMerchantRespDTO">CommonResultOpenMerchantRespDTO</h2>

<a id="schemacommonresultopenmerchantrespdto"></a>
<a id="schema_CommonResultOpenMerchantRespDTO"></a>
<a id="tocScommonresultopenmerchantrespdto"></a>
<a id="tocscommonresultopenmerchantrespdto"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "id": 1,
    "merchantNo": "M20240001",
    "name": "沐沐美业",
    "shortName": "沐沐",
    "logoUrl": "string",
    "coverUrl": "string",
    "contactName": "张三",
    "contactPhone": "13800138000",
    "contactEmail": "contact@example.com",
    "province": "广东省",
    "city": "深圳市",
    "district": "南山区",
    "address": "科技园南区",
    "status": 0,
    "createTime": "string"
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[OpenMerchantRespDTO](#schemaopenmerchantrespdto)|false|none||返回数据|

<h2 id="tocS_OpenStoreRespDTO">OpenStoreRespDTO</h2>

<a id="schemaopenstorerespdto"></a>
<a id="schema_OpenStoreRespDTO"></a>
<a id="tocSopenstorerespdto"></a>
<a id="tocsopenstorerespdto"></a>

```json
{
  "id": 1,
  "merchantId": 1,
  "storeNo": "S20240001",
  "storeName": "南山旗舰店",
  "logoUrl": "string",
  "coverUrl": "string",
  "categoryId": 0,
  "tags": "string",
  "province": "广东省",
  "city": "深圳市",
  "district": "南山区",
  "address": "科技园南区",
  "longitude": 113.9435,
  "latitude": 22.54,
  "contactName": "李四",
  "contactPhone": "13800138001",
  "businessHours": "09:00-22:00",
  "isDefault": 0,
  "qrCodeUrl": "string",
  "status": 0,
  "announcement": "string",
  "photos": "string",
  "distance": 0,
  "createTime": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||门店ID|
|merchantId|integer(int64)|false|none||商户ID|
|storeNo|string|false|none||门店编号|
|storeName|string|false|none||门店名称|
|logoUrl|string|false|none||门店Logo URL|
|coverUrl|string|false|none||门店封面图 URL|
|categoryId|integer(int64)|false|none||门店品类ID|
|tags|string|false|none||标签（JSON 数组）|
|province|string|false|none||省|
|city|string|false|none||市|
|district|string|false|none||区|
|address|string|false|none||详细地址|
|longitude|number|false|none||经度|
|latitude|number|false|none||纬度|
|contactName|string|false|none||门店联系人|
|contactPhone|string|false|none||门店联系电话|
|businessHours|string|false|none||营业时间|
|isDefault|integer|false|none||是否默认门店：0-否 1-是|
|qrCodeUrl|string|false|none||门店二维码 URL|
|status|integer|false|none||状态：0-正常 1-关闭|
|announcement|string|false|none||门店公告|
|photos|string|false|none||门店照片（JSON 数组）|
|distance|number|false|none||距离（km），仅附近门店查询时返回|
|createTime|string|false|none||创建时间|

<h2 id="tocS_PageResultOpenStoreRespDTO">PageResultOpenStoreRespDTO</h2>

<a id="schemapageresultopenstorerespdto"></a>
<a id="schema_PageResultOpenStoreRespDTO"></a>
<a id="tocSpageresultopenstorerespdto"></a>
<a id="tocspageresultopenstorerespdto"></a>

```json
{
  "total": 0,
  "list": [
    {
      "id": 1,
      "merchantId": 1,
      "storeNo": "S20240001",
      "storeName": "南山旗舰店",
      "logoUrl": "string",
      "coverUrl": "string",
      "categoryId": 0,
      "tags": "string",
      "province": "广东省",
      "city": "深圳市",
      "district": "南山区",
      "address": "科技园南区",
      "longitude": 113.9435,
      "latitude": 22.54,
      "contactName": "李四",
      "contactPhone": "13800138001",
      "businessHours": "09:00-22:00",
      "isDefault": 0,
      "qrCodeUrl": "string",
      "status": 0,
      "announcement": "string",
      "photos": "string",
      "distance": 0,
      "createTime": "string"
    }
  ]
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|total|integer(int64)|false|none||总量|
|list|[[OpenStoreRespDTO](#schemaopenstorerespdto)]|false|none||数据|

<h2 id="tocS_CommonResultPageResultOpenStoreRespDTO">CommonResultPageResultOpenStoreRespDTO</h2>

<a id="schemacommonresultpageresultopenstorerespdto"></a>
<a id="schema_CommonResultPageResultOpenStoreRespDTO"></a>
<a id="tocScommonresultpageresultopenstorerespdto"></a>
<a id="tocscommonresultpageresultopenstorerespdto"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "total": 0,
    "list": [
      {
        "id": 1,
        "merchantId": 1,
        "storeNo": "S20240001",
        "storeName": "南山旗舰店",
        "logoUrl": "string",
        "coverUrl": "string",
        "categoryId": 0,
        "tags": "string",
        "province": "广东省",
        "city": "深圳市",
        "district": "南山区",
        "address": "科技园南区",
        "longitude": 113.9435,
        "latitude": 22.54,
        "contactName": "李四",
        "contactPhone": "13800138001",
        "businessHours": "09:00-22:00",
        "isDefault": 0,
        "qrCodeUrl": "string",
        "status": 0,
        "announcement": "string",
        "photos": "string",
        "distance": 0,
        "createTime": "string"
      }
    ]
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[PageResultOpenStoreRespDTO](#schemapageresultopenstorerespdto)|false|none||返回数据|

<h2 id="tocS_CommonResultOpenStoreRespDTO">CommonResultOpenStoreRespDTO</h2>

<a id="schemacommonresultopenstorerespdto"></a>
<a id="schema_CommonResultOpenStoreRespDTO"></a>
<a id="tocScommonresultopenstorerespdto"></a>
<a id="tocscommonresultopenstorerespdto"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "id": 1,
    "merchantId": 1,
    "storeNo": "S20240001",
    "storeName": "南山旗舰店",
    "logoUrl": "string",
    "coverUrl": "string",
    "categoryId": 0,
    "tags": "string",
    "province": "广东省",
    "city": "深圳市",
    "district": "南山区",
    "address": "科技园南区",
    "longitude": 113.9435,
    "latitude": 22.54,
    "contactName": "李四",
    "contactPhone": "13800138001",
    "businessHours": "09:00-22:00",
    "isDefault": 0,
    "qrCodeUrl": "string",
    "status": 0,
    "announcement": "string",
    "photos": "string",
    "distance": 0,
    "createTime": "string"
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[OpenStoreRespDTO](#schemaopenstorerespdto)|false|none||返回数据|

<h2 id="tocS_CommonResultListOpenStoreRespDTO">CommonResultListOpenStoreRespDTO</h2>

<a id="schemacommonresultlistopenstorerespdto"></a>
<a id="schema_CommonResultListOpenStoreRespDTO"></a>
<a id="tocScommonresultlistopenstorerespdto"></a>
<a id="tocscommonresultlistopenstorerespdto"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": [
    {
      "id": 1,
      "merchantId": 1,
      "storeNo": "S20240001",
      "storeName": "南山旗舰店",
      "logoUrl": "string",
      "coverUrl": "string",
      "categoryId": 0,
      "tags": "string",
      "province": "广东省",
      "city": "深圳市",
      "district": "南山区",
      "address": "科技园南区",
      "longitude": 113.9435,
      "latitude": 22.54,
      "contactName": "李四",
      "contactPhone": "13800138001",
      "businessHours": "09:00-22:00",
      "isDefault": 0,
      "qrCodeUrl": "string",
      "status": 0,
      "announcement": "string",
      "photos": "string",
      "distance": 0,
      "createTime": "string"
    }
  ]
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[[OpenStoreRespDTO](#schemaopenstorerespdto)]|false|none||返回数据|

<h2 id="tocS_OpenBusinessHoursRespDTO">OpenBusinessHoursRespDTO</h2>

<a id="schemaopenbusinesshoursrespdto"></a>
<a id="schema_OpenBusinessHoursRespDTO"></a>
<a id="tocSopenbusinesshoursrespdto"></a>
<a id="tocsopenbusinesshoursrespdto"></a>

```json
{
  "storeId": 1,
  "storeName": "南山旗舰店",
  "businessHours": "09:00-22:00",
  "status": 0,
  "schedules": [
    {
      "dayOfWeek": 1,
      "isOpen": 1,
      "timeSlots": "string"
    }
  ]
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|storeId|integer(int64)|false|none||门店ID|
|storeName|string|false|none||门店名称|
|businessHours|string|false|none||营业时间（纯文本，向后兼容）|
|status|integer|false|none||状态：0-正常（营业） 1-关闭（停业）|
|schedules|[[DaySchedule](#schemadayschedule)]|false|none||结构化营业时间配置（按星期一~日排列），为空表示未配置详细排班|

<h2 id="tocS_CommonResultOpenBusinessHoursRespDTO">CommonResultOpenBusinessHoursRespDTO</h2>

<a id="schemacommonresultopenbusinesshoursrespdto"></a>
<a id="schema_CommonResultOpenBusinessHoursRespDTO"></a>
<a id="tocScommonresultopenbusinesshoursrespdto"></a>
<a id="tocscommonresultopenbusinesshoursrespdto"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "storeId": 1,
    "storeName": "南山旗舰店",
    "businessHours": "09:00-22:00",
    "status": 0,
    "schedules": [
      {
        "dayOfWeek": 1,
        "isOpen": 1,
        "timeSlots": "string"
      }
    ]
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[OpenBusinessHoursRespDTO](#schemaopenbusinesshoursrespdto)|false|none||返回数据|

<h2 id="tocS_OpenApiMerchantRegisterReqVO">OpenApiMerchantRegisterReqVO</h2>

<a id="schemaopenapimerchantregisterreqvo"></a>
<a id="schema_OpenApiMerchantRegisterReqVO"></a>
<a id="tocSopenapimerchantregisterreqvo"></a>
<a id="tocsopenapimerchantregisterreqvo"></a>

```json
{
  "name": "沐沐美业",
  "shortName": "沐沐",
  "contactName": "张三",
  "contactPhone": "13800138000",
  "contactEmail": "contact@example.com",
  "province": "广东省",
  "city": "深圳市",
  "district": "南山区",
  "address": "科技园南区"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|name|string|true|none||商户名称|
|shortName|string|false|none||商户简称|
|contactName|string|true|none||联系人姓名|
|contactPhone|string|true|none||联系电话|
|contactEmail|string|false|none||联系邮箱|
|province|string|false|none||省|
|city|string|false|none||市|
|district|string|false|none||区|
|address|string|false|none||详细地址|

<h2 id="tocS_OpenApiMerchantCertificationReqVO">OpenApiMerchantCertificationReqVO</h2>

<a id="schemaopenapimerchantcertificationreqvo"></a>
<a id="schema_OpenApiMerchantCertificationReqVO"></a>
<a id="tocSopenapimerchantcertificationreqvo"></a>
<a id="tocsopenapimerchantcertificationreqvo"></a>

```json
{
  "businessLicense": "91440300...",
  "licenseUrl": "string",
  "legalPerson": "张三",
  "legalPersonIdCard": "440300...",
  "idCardFrontUrl": "string",
  "idCardBackUrl": "string",
  "bankName": "中国银行",
  "bankBranch": "深圳南山支行",
  "bankAccount": "6222...",
  "bankAccountName": "深圳沐沐美业有限公司"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|businessLicense|string|true|none||营业执照号|
|licenseUrl|string|true|none||营业执照图片 URL|
|legalPerson|string|true|none||法人姓名|
|legalPersonIdCard|string|true|none||法人身份证号|
|idCardFrontUrl|string|false|none||身份证正面照 URL|
|idCardBackUrl|string|false|none||身份证反面照 URL|
|bankName|string|false|none||开户银行|
|bankBranch|string|false|none||开户支行|
|bankAccount|string|false|none||银行账号|
|bankAccountName|string|false|none||开户名|

<h2 id="tocS_OpenMerchantCertificationRespDTO">OpenMerchantCertificationRespDTO</h2>

<a id="schemaopenmerchantcertificationrespdto"></a>
<a id="schema_OpenMerchantCertificationRespDTO"></a>
<a id="tocSopenmerchantcertificationrespdto"></a>
<a id="tocsopenmerchantcertificationrespdto"></a>

```json
{
  "merchantId": 1,
  "certificationStatus": 1,
  "businessLicense": "91440300...",
  "licenseUrl": "string",
  "legalPerson": "张三",
  "legalPersonIdCard": "440300...",
  "idCardFrontUrl": "string",
  "idCardBackUrl": "string",
  "bankName": "中国银行",
  "bankBranch": "深圳南山支行",
  "bankAccount": "6222...",
  "bankAccountName": "深圳沐沐美业有限公司"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|merchantId|integer(int64)|false|none||商户ID|
|certificationStatus|integer|false|none||认证状态：0-未认证 1-已认证|
|businessLicense|string|false|none||营业执照号|
|licenseUrl|string|false|none||营业执照图片 URL|
|legalPerson|string|false|none||法人姓名|
|legalPersonIdCard|string|false|none||法人身份证号|
|idCardFrontUrl|string|false|none||身份证正面照 URL|
|idCardBackUrl|string|false|none||身份证反面照 URL|
|bankName|string|false|none||开户银行|
|bankBranch|string|false|none||开户支行|
|bankAccount|string|false|none||银行账号|
|bankAccountName|string|false|none||开户名|

<h2 id="tocS_CommonResultOpenMerchantCertificationRespDTO">CommonResultOpenMerchantCertificationRespDTO</h2>

<a id="schemacommonresultopenmerchantcertificationrespdto"></a>
<a id="schema_CommonResultOpenMerchantCertificationRespDTO"></a>
<a id="tocScommonresultopenmerchantcertificationrespdto"></a>
<a id="tocscommonresultopenmerchantcertificationrespdto"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "merchantId": 1,
    "certificationStatus": 1,
    "businessLicense": "91440300...",
    "licenseUrl": "string",
    "legalPerson": "张三",
    "legalPersonIdCard": "440300...",
    "idCardFrontUrl": "string",
    "idCardBackUrl": "string",
    "bankName": "中国银行",
    "bankBranch": "深圳南山支行",
    "bankAccount": "6222...",
    "bankAccountName": "深圳沐沐美业有限公司"
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[OpenMerchantCertificationRespDTO](#schemaopenmerchantcertificationrespdto)|false|none||返回数据|

<h2 id="tocS_OpenApiMerchantUpdateReqVO">OpenApiMerchantUpdateReqVO</h2>

<a id="schemaopenapimerchantupdatereqvo"></a>
<a id="schema_OpenApiMerchantUpdateReqVO"></a>
<a id="tocSopenapimerchantupdatereqvo"></a>
<a id="tocsopenapimerchantupdatereqvo"></a>

```json
{
  "name": "沐沐美业",
  "shortName": "沐沐",
  "logoUrl": "string",
  "coverUrl": "string",
  "contactName": "张三",
  "contactPhone": "13800138000",
  "contactEmail": "contact@example.com",
  "province": "广东省",
  "city": "深圳市",
  "district": "南山区",
  "address": "科技园南区"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|name|string|false|none||商户名称|
|shortName|string|false|none||商户简称|
|logoUrl|string|false|none||Logo URL|
|coverUrl|string|false|none||封面图 URL|
|contactName|string|false|none||联系人姓名|
|contactPhone|string|false|none||联系电话|
|contactEmail|string|false|none||联系邮箱|
|province|string|false|none||省|
|city|string|false|none||市|
|district|string|false|none||区|
|address|string|false|none||详细地址|

<h2 id="tocS_OpenApiStoreCreateReqVO">OpenApiStoreCreateReqVO</h2>

<a id="schemaopenapistorecreatereqvo"></a>
<a id="schema_OpenApiStoreCreateReqVO"></a>
<a id="tocSopenapistorecreatereqvo"></a>
<a id="tocsopenapistorecreatereqvo"></a>

```json
{
  "merchantId": 1,
  "storeName": "南山旗舰店",
  "logoUrl": "string",
  "coverUrl": "string",
  "categoryId": 0,
  "tags": "string",
  "province": "广东省",
  "city": "深圳市",
  "district": "南山区",
  "address": "科技园南区",
  "longitude": 113.9435,
  "latitude": 22.54,
  "contactName": "李四",
  "contactPhone": "13800138001",
  "businessHours": "09:00-22:00"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|merchantId|integer(int64)|true|none||商户ID|
|storeName|string|true|none||门店名称|
|logoUrl|string|false|none||门店Logo URL|
|coverUrl|string|false|none||门店封面图 URL|
|categoryId|integer(int64)|false|none||门店品类ID|
|tags|string|false|none||标签（JSON 数组）|
|province|string|false|none||省|
|city|string|false|none||市|
|district|string|false|none||区|
|address|string|false|none||详细地址|
|longitude|number|false|none||经度|
|latitude|number|false|none||纬度|
|contactName|string|false|none||门店联系人|
|contactPhone|string|false|none||门店联系电话|
|businessHours|string|false|none||营业时间|

<h2 id="tocS_OpenApiStoreUpdateReqVO">OpenApiStoreUpdateReqVO</h2>

<a id="schemaopenapistoreupdatereqvo"></a>
<a id="schema_OpenApiStoreUpdateReqVO"></a>
<a id="tocSopenapistoreupdatereqvo"></a>
<a id="tocsopenapistoreupdatereqvo"></a>

```json
{
  "storeName": "南山旗舰店",
  "logoUrl": "string",
  "coverUrl": "string",
  "categoryId": 0,
  "tags": "string",
  "province": "广东省",
  "city": "深圳市",
  "district": "南山区",
  "address": "科技园南区",
  "longitude": 113.9435,
  "latitude": 22.54,
  "contactName": "李四",
  "contactPhone": "13800138001",
  "businessHours": "09:00-22:00",
  "announcement": "string",
  "photos": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|storeName|string|false|none||门店名称|
|logoUrl|string|false|none||门店Logo URL|
|coverUrl|string|false|none||门店封面图 URL|
|categoryId|integer(int64)|false|none||门店品类ID|
|tags|string|false|none||标签（JSON 数组）|
|province|string|false|none||省|
|city|string|false|none||市|
|district|string|false|none||区|
|address|string|false|none||详细地址|
|longitude|number|false|none||经度|
|latitude|number|false|none||纬度|
|contactName|string|false|none||门店联系人|
|contactPhone|string|false|none||门店联系电话|
|businessHours|string|false|none||营业时间|
|announcement|string|false|none||门店公告|
|photos|string|false|none||门店照片（JSON 数组）|

<h2 id="tocS_OpenApiCustomerSyncReqVO">OpenApiCustomerSyncReqVO</h2>

<a id="schemaopenapicustomersyncreqvo"></a>
<a id="schema_OpenApiCustomerSyncReqVO"></a>
<a id="tocSopenapicustomersyncreqvo"></a>
<a id="tocsopenapicustomersyncreqvo"></a>

```json
{
  "externalUserId": "ext_user_001",
  "customerName": "张三",
  "customerPhone": "13800138000",
  "customerNickname": "小张",
  "customerAvatar": "https://example.com/avatar.jpg"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|externalUserId|string|true|none||外部用户ID（第三方APP用户标识）|
|customerName|string|true|none||用户姓名|
|customerPhone|string|true|none||用户手机号|
|customerNickname|string|false|none||用户昵称|
|customerAvatar|string|false|none||用户头像URL|

<h2 id="tocS_OpenCustomerRespDTO">OpenCustomerRespDTO</h2>

<a id="schemaopencustomerrespdto"></a>
<a id="schema_OpenCustomerRespDTO"></a>
<a id="tocSopencustomerrespdto"></a>
<a id="tocsopencustomerrespdto"></a>

```json
{
  "id": 1024,
  "merchantId": 1,
  "appUserId": 2048,
  "cardNo": "MC2024001",
  "cardType": 1,
  "paymentMode": 0,
  "totalAmount": 100000,
  "remainAmount": 50000,
  "usedAmount": 50000,
  "timesTotal": 10,
  "timesLeft": 5,
  "discountRate": 85,
  "owedAmount": 30000,
  "installmentStatus": 0,
  "status": 0,
  "activateTime": "string",
  "expireTime": "string",
  "createTime": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||客户ID（会员卡ID）|
|merchantId|integer(int64)|false|none||商户ID|
|appUserId|integer(int64)|false|none||App用户映射ID|
|cardNo|string|false|none||卡号|
|cardType|integer|false|none||卡类型：1-储值卡 2-次卡 3-折扣卡 4-套餐卡|
|paymentMode|integer|false|none||支付模式：0-全额 1-分期 2-延期|
|totalAmount|integer|false|none||卡总额(分)|
|remainAmount|integer|false|none||剩余可用金额(分)|
|usedAmount|integer|false|none||已使用金额(分)|
|timesTotal|integer|false|none||总次数(次卡专用)|
|timesLeft|integer|false|none||剩余次数(次卡专用)|
|discountRate|integer|false|none||折扣率(%)(折扣卡专用)|
|owedAmount|integer|false|none||待还金额(分)|
|installmentStatus|integer|false|none||分期状态：0-无分期/已结清 1-还款中 2-已还清 3-逾期|
|status|integer|false|none||状态：0-正常 1-冻结 2-已过期 3-已用完 4-已退卡 5-逾期冻结|
|activateTime|string|false|none||激活时间|
|expireTime|string|false|none||过期时间|
|createTime|string|false|none||创建时间|

<h2 id="tocS_PageResultOpenCustomerRespDTO">PageResultOpenCustomerRespDTO</h2>

<a id="schemapageresultopencustomerrespdto"></a>
<a id="schema_PageResultOpenCustomerRespDTO"></a>
<a id="tocSpageresultopencustomerrespdto"></a>
<a id="tocspageresultopencustomerrespdto"></a>

```json
{
  "total": 0,
  "list": [
    {
      "id": 1024,
      "merchantId": 1,
      "appUserId": 2048,
      "cardNo": "MC2024001",
      "cardType": 1,
      "paymentMode": 0,
      "totalAmount": 100000,
      "remainAmount": 50000,
      "usedAmount": 50000,
      "timesTotal": 10,
      "timesLeft": 5,
      "discountRate": 85,
      "owedAmount": 30000,
      "installmentStatus": 0,
      "status": 0,
      "activateTime": "string",
      "expireTime": "string",
      "createTime": "string"
    }
  ]
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|total|integer(int64)|false|none||总量|
|list|[[OpenCustomerRespDTO](#schemaopencustomerrespdto)]|false|none||数据|

<h2 id="tocS_CommonResultPageResultOpenCustomerRespDTO">CommonResultPageResultOpenCustomerRespDTO</h2>

<a id="schemacommonresultpageresultopencustomerrespdto"></a>
<a id="schema_CommonResultPageResultOpenCustomerRespDTO"></a>
<a id="tocScommonresultpageresultopencustomerrespdto"></a>
<a id="tocscommonresultpageresultopencustomerrespdto"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "total": 0,
    "list": [
      {
        "id": 1024,
        "merchantId": 1,
        "appUserId": 2048,
        "cardNo": "MC2024001",
        "cardType": 1,
        "paymentMode": 0,
        "totalAmount": 100000,
        "remainAmount": 50000,
        "usedAmount": 50000,
        "timesTotal": 10,
        "timesLeft": 5,
        "discountRate": 85,
        "owedAmount": 30000,
        "installmentStatus": 0,
        "status": 0,
        "activateTime": "string",
        "expireTime": "string",
        "createTime": "string"
      }
    ]
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[PageResultOpenCustomerRespDTO](#schemapageresultopencustomerrespdto)|false|none||返回数据|

<h2 id="tocS_String">String</h2>

<a id="schemastring"></a>
<a id="schema_String"></a>
<a id="tocSstring"></a>
<a id="tocsstring"></a>

```json
{
  "name": "深层清洁",
  "total": 3,
  "used": 1
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|name|string|false|none||none|
|total|integer|false|none||none|
|used|integer|false|none||none|

<h2 id="tocS_OpenCustomerTagRespDTO">OpenCustomerTagRespDTO</h2>

<a id="schemaopencustomertagrespdto"></a>
<a id="schema_OpenCustomerTagRespDTO"></a>
<a id="tocSopencustomertagrespdto"></a>
<a id="tocsopencustomertagrespdto"></a>

```json
{
  "tagId": 1,
  "tagName": "VIP客户",
  "tagType": 2,
  "tagColor": "#FF5722",
  "tagDescription": "高价值客户",
  "tagSource": 1,
  "createTime": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|tagId|integer(int64)|false|none||标签ID|
|tagName|string|false|none||标签名称|
|tagType|integer|false|none||标签类型：0-系统标签 1-业务标签 2-自定义标签|
|tagColor|string|false|none||标签颜色|
|tagDescription|string|false|none||标签描述|
|tagSource|integer|false|none||标签来源：0-自动打标 1-手动打标|
|createTime|string|false|none||打标时间|

<h2 id="tocS_OpenCustomerDetailRespDTO">OpenCustomerDetailRespDTO</h2>

<a id="schemaopencustomerdetailrespdto"></a>
<a id="schema_OpenCustomerDetailRespDTO"></a>
<a id="tocSopencustomerdetailrespdto"></a>
<a id="tocsopencustomerdetailrespdto"></a>

```json
{
  "id": 1024,
  "merchantId": 1,
  "appUserId": 2048,
  "templateId": 100,
  "cardNo": "MC2024001",
  "cardType": 1,
  "paymentMode": 0,
  "purchaseAmount": 100000,
  "bonusAmount": 10000,
  "totalAmount": 110000,
  "remainAmount": 50000,
  "usedAmount": 60000,
  "timesTotal": 10,
  "timesLeft": 5,
  "timesUsed": 5,
  "discountRate": 85,
  "packageUsage": "[{\"name\":\"深层清洁\",\"total\":3,\"used\":1}]",
  "paidAmount": 80000,
  "owedAmount": 20000,
  "installmentStatus": 0,
  "installmentPeriods": 12,
  "nextPaymentDate": "string",
  "nextPaymentAmount": 5000,
  "overdueAmount": 0,
  "overdueDays": 0,
  "status": 0,
  "activateTime": "string",
  "expireTime": "string",
  "createTime": "string",
  "tags": [
    {
      "tagId": 1,
      "tagName": "VIP客户",
      "tagType": 2,
      "tagColor": "#FF5722",
      "tagDescription": "高价值客户",
      "tagSource": 1,
      "createTime": "string"
    }
  ]
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||客户ID（会员卡ID）|
|merchantId|integer(int64)|false|none||商户ID|
|appUserId|integer(int64)|false|none||App用户映射ID|
|templateId|integer(int64)|false|none||会员卡模板ID|
|cardNo|string|false|none||卡号|
|cardType|integer|false|none||卡类型：1-储值卡 2-次卡 3-折扣卡 4-套餐卡|
|paymentMode|integer|false|none||支付模式：0-全额 1-分期 2-延期|
|purchaseAmount|integer|false|none||购买金额(分)|
|bonusAmount|integer|false|none||赠送金额(分)|
|totalAmount|integer|false|none||卡总额(分)|
|remainAmount|integer|false|none||剩余可用金额(分)|
|usedAmount|integer|false|none||已使用金额(分)|
|timesTotal|integer|false|none||总次数(次卡专用)|
|timesLeft|integer|false|none||剩余次数(次卡专用)|
|timesUsed|integer|false|none||已使用次数(次卡专用)|
|discountRate|integer|false|none||折扣率(%)(折扣卡专用)|
|packageUsage|[[String](#schemastring)]|false|none||套餐使用情况(JSON)|
|paidAmount|integer|false|none||已支付金额(分)|
|owedAmount|integer|false|none||待还金额(分)|
|installmentStatus|integer|false|none||分期状态：0-无分期/已结清 1-还款中 2-已还清 3-逾期|
|installmentPeriods|integer|false|none||分期期数|
|nextPaymentDate|string|false|none||下次还款日期|
|nextPaymentAmount|integer|false|none||下次还款金额(分)|
|overdueAmount|integer|false|none||逾期罚息金额(分)|
|overdueDays|integer|false|none||逾期天数|
|status|integer|false|none||状态：0-正常 1-冻结 2-已过期 3-已用完 4-已退卡 5-逾期冻结|
|activateTime|string|false|none||激活时间|
|expireTime|string|false|none||过期时间|
|createTime|string|false|none||创建时间|
|tags|[[OpenCustomerTagRespDTO](#schemaopencustomertagrespdto)]|false|none||客户标签列表|

<h2 id="tocS_CommonResultOpenCustomerDetailRespDTO">CommonResultOpenCustomerDetailRespDTO</h2>

<a id="schemacommonresultopencustomerdetailrespdto"></a>
<a id="schema_CommonResultOpenCustomerDetailRespDTO"></a>
<a id="tocScommonresultopencustomerdetailrespdto"></a>
<a id="tocscommonresultopencustomerdetailrespdto"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "id": 1024,
    "merchantId": 1,
    "appUserId": 2048,
    "templateId": 100,
    "cardNo": "MC2024001",
    "cardType": 1,
    "paymentMode": 0,
    "purchaseAmount": 100000,
    "bonusAmount": 10000,
    "totalAmount": 110000,
    "remainAmount": 50000,
    "usedAmount": 60000,
    "timesTotal": 10,
    "timesLeft": 5,
    "timesUsed": 5,
    "discountRate": 85,
    "packageUsage": "[{\"name\":\"深层清洁\",\"total\":3,\"used\":1}]",
    "paidAmount": 80000,
    "owedAmount": 20000,
    "installmentStatus": 0,
    "installmentPeriods": 12,
    "nextPaymentDate": "string",
    "nextPaymentAmount": 5000,
    "overdueAmount": 0,
    "overdueDays": 0,
    "status": 0,
    "activateTime": "string",
    "expireTime": "string",
    "createTime": "string",
    "tags": [
      {
        "tagId": 1,
        "tagName": "VIP客户",
        "tagType": 2,
        "tagColor": "#FF5722",
        "tagDescription": "高价值客户",
        "tagSource": 1,
        "createTime": "string"
      }
    ]
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[OpenCustomerDetailRespDTO](#schemaopencustomerdetailrespdto)|false|none||返回数据|

<h2 id="tocS_OpenCustomerTransactionRespDTO">OpenCustomerTransactionRespDTO</h2>

<a id="schemaopencustomertransactionrespdto"></a>
<a id="schema_OpenCustomerTransactionRespDTO"></a>
<a id="tocSopencustomertransactionrespdto"></a>
<a id="tocsopencustomertransactionrespdto"></a>

```json
{
  "id": 1024,
  "cardId": 2048,
  "storeId": 1,
  "amount": 5000,
  "balanceBefore": 50000,
  "balanceAfter": 45000,
  "timesBefore": 10,
  "timesAfter": 9,
  "bizType": 1,
  "bizId": 100,
  "packageItemName": "深层清洁",
  "remark": "日常消费",
  "createTime": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||记录ID|
|cardId|integer(int64)|false|none||会员卡ID|
|storeId|integer(int64)|false|none||门店ID|
|amount|integer|false|none||核销金额(分)|
|balanceBefore|integer|false|none||核销前余额(分)|
|balanceAfter|integer|false|none||核销后余额(分)|
|timesBefore|integer|false|none||核销前剩余次数(次卡专用)|
|timesAfter|integer|false|none||核销后剩余次数(次卡专用)|
|bizType|integer|false|none||业务类型：1-扫码支付 2-消费券核销 3-手动核销 4-次卡扣次 5-折扣消费 6-套餐项目使用 7-退款回退 8-抵金券购券扣减 9-动态收款码会员卡抵扣|
|bizId|integer(int64)|false|none||关联业务ID|
|packageItemName|string|false|none||套餐项目名称(套餐卡使用时)|
|remark|string|false|none||备注|
|createTime|string|false|none||创建时间|

<h2 id="tocS_PageResultOpenCustomerTransactionRespDTO">PageResultOpenCustomerTransactionRespDTO</h2>

<a id="schemapageresultopencustomertransactionrespdto"></a>
<a id="schema_PageResultOpenCustomerTransactionRespDTO"></a>
<a id="tocSpageresultopencustomertransactionrespdto"></a>
<a id="tocspageresultopencustomertransactionrespdto"></a>

```json
{
  "total": 0,
  "list": [
    {
      "id": 1024,
      "cardId": 2048,
      "storeId": 1,
      "amount": 5000,
      "balanceBefore": 50000,
      "balanceAfter": 45000,
      "timesBefore": 10,
      "timesAfter": 9,
      "bizType": 1,
      "bizId": 100,
      "packageItemName": "深层清洁",
      "remark": "日常消费",
      "createTime": "string"
    }
  ]
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|total|integer(int64)|false|none||总量|
|list|[[OpenCustomerTransactionRespDTO](#schemaopencustomertransactionrespdto)]|false|none||数据|

<h2 id="tocS_CommonResultPageResultOpenCustomerTransactionRespDTO">CommonResultPageResultOpenCustomerTransactionRespDTO</h2>

<a id="schemacommonresultpageresultopencustomertransactionrespdto"></a>
<a id="schema_CommonResultPageResultOpenCustomerTransactionRespDTO"></a>
<a id="tocScommonresultpageresultopencustomertransactionrespdto"></a>
<a id="tocscommonresultpageresultopencustomertransactionrespdto"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "total": 0,
    "list": [
      {
        "id": 1024,
        "cardId": 2048,
        "storeId": 1,
        "amount": 5000,
        "balanceBefore": 50000,
        "balanceAfter": 45000,
        "timesBefore": 10,
        "timesAfter": 9,
        "bizType": 1,
        "bizId": 100,
        "packageItemName": "深层清洁",
        "remark": "日常消费",
        "createTime": "string"
      }
    ]
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[PageResultOpenCustomerTransactionRespDTO](#schemapageresultopencustomertransactionrespdto)|false|none||返回数据|

<h2 id="tocS_CommonResultListOpenCustomerTagRespDTO">CommonResultListOpenCustomerTagRespDTO</h2>

<a id="schemacommonresultlistopencustomertagrespdto"></a>
<a id="schema_CommonResultListOpenCustomerTagRespDTO"></a>
<a id="tocScommonresultlistopencustomertagrespdto"></a>
<a id="tocscommonresultlistopencustomertagrespdto"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": [
    {
      "tagId": 1,
      "tagName": "VIP客户",
      "tagType": 2,
      "tagColor": "#FF5722",
      "tagDescription": "高价值客户",
      "tagSource": 1,
      "createTime": "string"
    }
  ]
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[[OpenCustomerTagRespDTO](#schemaopencustomertagrespdto)]|false|none||返回数据|

<h2 id="tocS_OpenApiCustomerTagAddReqVO">OpenApiCustomerTagAddReqVO</h2>

<a id="schemaopenapicustomertagaddreqvo"></a>
<a id="schema_OpenApiCustomerTagAddReqVO"></a>
<a id="tocSopenapicustomertagaddreqvo"></a>
<a id="tocsopenapicustomertagaddreqvo"></a>

```json
{
  "tagName": "VIP客户",
  "tagColor": "#FF5722",
  "tagDescription": "高价值客户"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|tagName|string|true|none||标签名称|
|tagColor|string|false|none||标签颜色|
|tagDescription|string|false|none||标签描述|

<h2 id="tocS_OpenCustomerStatisticsRespDTO">OpenCustomerStatisticsRespDTO</h2>

<a id="schemaopencustomerstatisticsrespdto"></a>
<a id="schema_OpenCustomerStatisticsRespDTO"></a>
<a id="tocSopencustomerstatisticsrespdto"></a>
<a id="tocsopencustomerstatisticsrespdto"></a>

```json
{
  "totalCustomers": 100,
  "activeCustomers": 80,
  "frozenCustomers": 5,
  "expiredCustomers": 10,
  "cancelledCustomers": 3,
  "overdueFrozenCustomers": 2,
  "totalReceivable": 500000,
  "totalReceived": 300000,
  "totalPending": 200000,
  "totalOverdue": 50000
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|totalCustomers|integer(int64)|false|none||客户总数|
|activeCustomers|integer(int64)|false|none||正常客户数|
|frozenCustomers|integer(int64)|false|none||冻结客户数|
|expiredCustomers|integer(int64)|false|none||已过期客户数|
|cancelledCustomers|integer(int64)|false|none||已退卡客户数|
|overdueFrozenCustomers|integer(int64)|false|none||逾期冻结客户数|
|totalReceivable|integer(int64)|false|none||应收总额(分)|
|totalReceived|integer(int64)|false|none||已收金额(分)|
|totalPending|integer(int64)|false|none||待收金额(分)|
|totalOverdue|integer(int64)|false|none||逾期金额(分)|

<h2 id="tocS_CommonResultOpenCustomerStatisticsRespDTO">CommonResultOpenCustomerStatisticsRespDTO</h2>

<a id="schemacommonresultopencustomerstatisticsrespdto"></a>
<a id="schema_CommonResultOpenCustomerStatisticsRespDTO"></a>
<a id="tocScommonresultopencustomerstatisticsrespdto"></a>
<a id="tocscommonresultopencustomerstatisticsrespdto"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "totalCustomers": 100,
    "activeCustomers": 80,
    "frozenCustomers": 5,
    "expiredCustomers": 10,
    "cancelledCustomers": 3,
    "overdueFrozenCustomers": 2,
    "totalReceivable": 500000,
    "totalReceived": 300000,
    "totalPending": 200000,
    "totalOverdue": 50000
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[OpenCustomerStatisticsRespDTO](#schemaopencustomerstatisticsrespdto)|false|none||返回数据|

<h2 id="tocS_OpenProductRespDTO">OpenProductRespDTO</h2>

<a id="schemaopenproductrespdto"></a>
<a id="schema_OpenProductRespDTO"></a>
<a id="tocSopenproductrespdto"></a>
<a id="tocsopenproductrespdto"></a>

```json
{
  "id": 1,
  "merchantId": 1,
  "categoryId": 1,
  "spuName": "招牌奶茶",
  "subtitle": "超值优惠",
  "productType": 1,
  "unit": "份",
  "serviceDuration": 60,
  "coverUrl": "string",
  "images": "string",
  "description": "string",
  "detail": "string",
  "tags": "string",
  "price": 9900,
  "originalPrice": 19900,
  "memberPrice": 8900,
  "vipPrice": 7900,
  "stock": 100,
  "stockType": 1,
  "stockWarning": 10,
  "salesCount": 50,
  "viewCount": 200,
  "rating": 4.5,
  "storeScope": 0,
  "storeIds": "string",
  "sort": 0,
  "recommended": 0,
  "specType": 0,
  "status": 0,
  "publishedAt": "string",
  "createTime": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||商品ID|
|merchantId|integer(int64)|false|none||商户ID|
|categoryId|integer(int64)|false|none||分类ID|
|spuName|string|false|none||商品名称|
|subtitle|string|false|none||副标题/卖点|
|productType|integer|false|none||商品类型：1-实物商品 2-餐饮商品 3-服务项目 4-计时服务 5-虚拟商品 6-套餐组合|
|unit|string|false|none||商品单位|
|serviceDuration|integer|false|none||服务时长（分钟）|
|coverUrl|string|false|none||封面图URL|
|images|string|false|none||轮播图（JSON数组）|
|description|string|false|none||商品简介|
|detail|string|false|none||商品详情（富文本）|
|tags|string|false|none||商品标签（JSON数组）|
|price|integer|false|none||售价（分）|
|originalPrice|integer|false|none||原价/划线价（分）|
|memberPrice|integer|false|none||会员价（分）|
|vipPrice|integer|false|none||VIP价（分）|
|stock|integer|false|none||总库存|
|stockType|integer|false|none||库存类型：1-有限库存 2-无限库存 3-资源限制 4-时段库存|
|stockWarning|integer|false|none||库存预警值|
|salesCount|integer|false|none||销量|
|viewCount|integer|false|none||浏览量|
|rating|number|false|none||评分（0-5分）|
|storeScope|integer|false|none||适用范围：0-全店通用 1-指定门店|
|storeIds|string|false|none||适用门店IDs（JSON数组）|
|sort|integer|false|none||排序|
|recommended|integer|false|none||是否推荐：0-否 1-是|
|specType|integer|false|none||规格类型：0-单规格 1-多规格|
|status|integer|false|none||状态：0-上架 1-下架 2-售罄|
|publishedAt|string|false|none||上架时间|
|createTime|string|false|none||创建时间|

<h2 id="tocS_PageResultOpenProductRespDTO">PageResultOpenProductRespDTO</h2>

<a id="schemapageresultopenproductrespdto"></a>
<a id="schema_PageResultOpenProductRespDTO"></a>
<a id="tocSpageresultopenproductrespdto"></a>
<a id="tocspageresultopenproductrespdto"></a>

```json
{
  "total": 0,
  "list": [
    {
      "id": 1,
      "merchantId": 1,
      "categoryId": 1,
      "spuName": "招牌奶茶",
      "subtitle": "超值优惠",
      "productType": 1,
      "unit": "份",
      "serviceDuration": 60,
      "coverUrl": "string",
      "images": "string",
      "description": "string",
      "detail": "string",
      "tags": "string",
      "price": 9900,
      "originalPrice": 19900,
      "memberPrice": 8900,
      "vipPrice": 7900,
      "stock": 100,
      "stockType": 1,
      "stockWarning": 10,
      "salesCount": 50,
      "viewCount": 200,
      "rating": 4.5,
      "storeScope": 0,
      "storeIds": "string",
      "sort": 0,
      "recommended": 0,
      "specType": 0,
      "status": 0,
      "publishedAt": "string",
      "createTime": "string"
    }
  ]
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|total|integer(int64)|false|none||总量|
|list|[[OpenProductRespDTO](#schemaopenproductrespdto)]|false|none||数据|

<h2 id="tocS_CommonResultPageResultOpenProductRespDTO">CommonResultPageResultOpenProductRespDTO</h2>

<a id="schemacommonresultpageresultopenproductrespdto"></a>
<a id="schema_CommonResultPageResultOpenProductRespDTO"></a>
<a id="tocScommonresultpageresultopenproductrespdto"></a>
<a id="tocscommonresultpageresultopenproductrespdto"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "total": 0,
    "list": [
      {
        "id": 1,
        "merchantId": 1,
        "categoryId": 1,
        "spuName": "招牌奶茶",
        "subtitle": "超值优惠",
        "productType": 1,
        "unit": "份",
        "serviceDuration": 60,
        "coverUrl": "string",
        "images": "string",
        "description": "string",
        "detail": "string",
        "tags": "string",
        "price": 9900,
        "originalPrice": 19900,
        "memberPrice": 8900,
        "vipPrice": 7900,
        "stock": 100,
        "stockType": 1,
        "stockWarning": 10,
        "salesCount": 50,
        "viewCount": 200,
        "rating": 4.5,
        "storeScope": 0,
        "storeIds": "string",
        "sort": 0,
        "recommended": 0,
        "specType": 0,
        "status": 0,
        "publishedAt": "string",
        "createTime": "string"
      }
    ]
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[PageResultOpenProductRespDTO](#schemapageresultopenproductrespdto)|false|none||返回数据|

<h2 id="tocS_OpenApiCustomerIntakeReqVO">OpenApiCustomerIntakeReqVO</h2>

<a id="schemaopenapicustomerintakereqvo"></a>
<a id="schema_OpenApiCustomerIntakeReqVO"></a>
<a id="tocSopenapicustomerintakereqvo"></a>
<a id="tocsopenapicustomerintakereqvo"></a>

```json
{
  "externalUserId": "ext_user_001",
  "realName": "张三",
  "phone": "13800138000",
  "idCardNumber": "110101199001011234",
  "nickname": "小张",
  "avatarUrl": "https://example.com/avatar.jpg"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|externalUserId|string|true|none||外部用户ID（第三方 App 用户标识）|
|realName|string|false|none||真实姓名（可选，不传则系统自动生成昵称）|
|phone|string|true|none||手机号|
|idCardNumber|string|false|none||身份证号（可选，不传则跳过实名认证环节）|
|nickname|string|false|none||用户昵称|
|avatarUrl|string|false|none||用户头像URL|

<h2 id="tocS_OpenApiB2bTransferRespVO">OpenApiB2bTransferRespVO</h2>

<a id="schemaopenapib2btransferrespvo"></a>
<a id="schema_OpenApiB2bTransferRespVO"></a>
<a id="tocSopenapib2btransferrespvo"></a>
<a id="tocsopenapib2btransferrespvo"></a>

```json
{
  "merchantTransferNo": "TF20260415001",
  "transferNo": "B2B1912345678901234",
  "toExternalUserId": "user_10001",
  "amount": 10000,
  "usage": "佣金分发",
  "status": 0,
  "failReason": "余额不足",
  "finishTime": "string",
  "createTime": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|merchantTransferNo|string|false|none||商户转账单号|
|transferNo|string|false|none||平台转账单号|
|toExternalUserId|string|false|none||转入方用户标识|
|amount|integer|false|none||转账金额（单位：分）|
|usage|string|false|none||用途|
|status|integer|false|none||转账状态：0-处理中 1-成功 2-失败|
|failReason|string|false|none||失败原因|
|finishTime|string|false|none||完成时间|
|createTime|string|false|none||创建时间|

<h2 id="tocS_CommonResultOpenProductRespDTO">CommonResultOpenProductRespDTO</h2>

<a id="schemacommonresultopenproductrespdto"></a>
<a id="schema_CommonResultOpenProductRespDTO"></a>
<a id="tocScommonresultopenproductrespdto"></a>
<a id="tocscommonresultopenproductrespdto"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "id": 1,
    "merchantId": 1,
    "categoryId": 1,
    "spuName": "招牌奶茶",
    "subtitle": "超值优惠",
    "productType": 1,
    "unit": "份",
    "serviceDuration": 60,
    "coverUrl": "string",
    "images": "string",
    "description": "string",
    "detail": "string",
    "tags": "string",
    "price": 9900,
    "originalPrice": 19900,
    "memberPrice": 8900,
    "vipPrice": 7900,
    "stock": 100,
    "stockType": 1,
    "stockWarning": 10,
    "salesCount": 50,
    "viewCount": 200,
    "rating": 4.5,
    "storeScope": 0,
    "storeIds": "string",
    "sort": 0,
    "recommended": 0,
    "specType": 0,
    "status": 0,
    "publishedAt": "string",
    "createTime": "string"
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[OpenProductRespDTO](#schemaopenproductrespdto)|false|none||返回数据|

<h2 id="tocS_CommonResultOpenApiB2bTransferRespVO">CommonResultOpenApiB2bTransferRespVO</h2>

<a id="schemacommonresultopenapib2btransferrespvo"></a>
<a id="schema_CommonResultOpenApiB2bTransferRespVO"></a>
<a id="tocScommonresultopenapib2btransferrespvo"></a>
<a id="tocscommonresultopenapib2btransferrespvo"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "merchantTransferNo": "TF20260415001",
    "transferNo": "B2B1912345678901234",
    "toExternalUserId": "user_10001",
    "amount": 10000,
    "usage": "佣金分发",
    "status": 0,
    "failReason": "余额不足",
    "finishTime": "string",
    "createTime": "string"
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[OpenApiB2bTransferRespVO](#schemaopenapib2btransferrespvo)|false|none||返回数据|

<h2 id="tocS_OpenCategoryRespDTO">OpenCategoryRespDTO</h2>

<a id="schemaopencategoryrespdto"></a>
<a id="schema_OpenCategoryRespDTO"></a>
<a id="tocSopencategoryrespdto"></a>
<a id="tocsopencategoryrespdto"></a>

```json
{
  "id": 1,
  "merchantId": 1,
  "parentId": 0,
  "name": "饮品",
  "iconUrl": "string",
  "sort": 0,
  "status": 0,
  "createTime": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||分类ID|
|merchantId|integer(int64)|false|none||商户ID|
|parentId|integer(int64)|false|none||父分类ID，0=顶级分类|
|name|string|false|none||分类名称|
|iconUrl|string|false|none||分类图标URL|
|sort|integer|false|none||排序|
|status|integer|false|none||状态：0-正常 1-禁用|
|createTime|string|false|none||创建时间|

<h2 id="tocS_OpenApiB2bTransferCreateReqVO">OpenApiB2bTransferCreateReqVO</h2>

<a id="schemaopenapib2btransfercreatereqvo"></a>
<a id="schema_OpenApiB2bTransferCreateReqVO"></a>
<a id="tocSopenapib2btransfercreatereqvo"></a>
<a id="tocsopenapib2btransfercreatereqvo"></a>

```json
{
  "toExternalUserId": "user_10001",
  "merchantTransferNo": "TF20260415001",
  "amount": 10000,
  "usage": "佣金分发"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|toExternalUserId|string|true|none||转入方App用户标识|
|merchantTransferNo|string|true|none||商户转账单号（下游App保证唯一）|
|amount|integer|true|none||转账金额（单位：分）|
|usage|string|true|none||用途说明|

<h2 id="tocS_CommonResultListOpenCategoryRespDTO">CommonResultListOpenCategoryRespDTO</h2>

<a id="schemacommonresultlistopencategoryrespdto"></a>
<a id="schema_CommonResultListOpenCategoryRespDTO"></a>
<a id="tocScommonresultlistopencategoryrespdto"></a>
<a id="tocscommonresultlistopencategoryrespdto"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": [
    {
      "id": 1,
      "merchantId": 1,
      "parentId": 0,
      "name": "饮品",
      "iconUrl": "string",
      "sort": 0,
      "status": 0,
      "createTime": "string"
    }
  ]
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[[OpenCategoryRespDTO](#schemaopencategoryrespdto)]|false|none||返回数据|

<h2 id="tocS_OpenApiProductCreateReqVO">OpenApiProductCreateReqVO</h2>

<a id="schemaopenapiproductcreatereqvo"></a>
<a id="schema_OpenApiProductCreateReqVO"></a>
<a id="tocSopenapiproductcreatereqvo"></a>
<a id="tocsopenapiproductcreatereqvo"></a>

```json
{
  "merchantId": 1,
  "categoryId": 1,
  "spuName": "招牌奶茶",
  "subtitle": "超值优惠",
  "productType": 1,
  "unit": "份",
  "serviceDuration": 60,
  "coverUrl": "string",
  "images": "string",
  "description": "string",
  "detail": "string",
  "tags": "string",
  "price": 9900,
  "originalPrice": 19900,
  "memberPrice": 8900,
  "vipPrice": 7900,
  "costPrice": 5000,
  "stock": 100,
  "stockType": 1,
  "stockWarning": 10,
  "storeScope": 0,
  "storeIds": "string",
  "sort": 0,
  "recommended": 0,
  "specType": 0,
  "status": 0
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|merchantId|integer(int64)|true|none||商户ID|
|categoryId|integer(int64)|false|none||分类ID|
|spuName|string|true|none||商品名称|
|subtitle|string|false|none||副标题/卖点|
|productType|integer|false|none||商品类型：1-实物商品 2-餐饮商品 3-服务项目 4-计时服务 5-虚拟商品 6-套餐组合|
|unit|string|false|none||商品单位|
|serviceDuration|integer|false|none||服务时长（分钟）|
|coverUrl|string|true|none||封面图URL|
|images|string|false|none||轮播图（JSON数组）|
|description|string|false|none||商品简介|
|detail|string|false|none||商品详情（富文本）|
|tags|string|false|none||商品标签（JSON数组）|
|price|integer|true|none||售价（分）|
|originalPrice|integer|false|none||原价/划线价（分）|
|memberPrice|integer|false|none||会员价（分）|
|vipPrice|integer|false|none||VIP价（分）|
|costPrice|integer|false|none||成本价（分）|
|stock|integer|true|none||总库存|
|stockType|integer|false|none||库存类型：1-有限库存 2-无限库存 3-资源限制 4-时段库存|
|stockWarning|integer|false|none||库存预警值|
|storeScope|integer|false|none||适用范围：0-全店通用 1-指定门店|
|storeIds|string|false|none||适用门店IDs（JSON数组）|
|sort|integer|false|none||排序|
|recommended|integer|false|none||是否推荐：0-否 1-是|
|specType|integer|false|none||规格类型：0-单规格 1-多规格|
|status|integer|false|none||状态：0-上架 1-下架|

<h2 id="tocS_OpenApiProductUpdateReqVO">OpenApiProductUpdateReqVO</h2>

<a id="schemaopenapiproductupdatereqvo"></a>
<a id="schema_OpenApiProductUpdateReqVO"></a>
<a id="tocSopenapiproductupdatereqvo"></a>
<a id="tocsopenapiproductupdatereqvo"></a>

```json
{
  "categoryId": 1,
  "spuName": "招牌奶茶",
  "subtitle": "超值优惠",
  "productType": 1,
  "unit": "份",
  "serviceDuration": 60,
  "coverUrl": "string",
  "images": "string",
  "description": "string",
  "detail": "string",
  "tags": "string",
  "price": 9900,
  "originalPrice": 19900,
  "memberPrice": 8900,
  "vipPrice": 7900,
  "costPrice": 5000,
  "stock": 100,
  "stockType": 1,
  "stockWarning": 10,
  "storeScope": 0,
  "storeIds": "string",
  "sort": 0,
  "recommended": 0,
  "specType": 0
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|categoryId|integer(int64)|false|none||分类ID|
|spuName|string|false|none||商品名称|
|subtitle|string|false|none||副标题/卖点|
|productType|integer|false|none||商品类型|
|unit|string|false|none||商品单位|
|serviceDuration|integer|false|none||服务时长（分钟）|
|coverUrl|string|false|none||封面图URL|
|images|string|false|none||轮播图（JSON数组）|
|description|string|false|none||商品简介|
|detail|string|false|none||商品详情（富文本）|
|tags|string|false|none||商品标签（JSON数组）|
|price|integer|false|none||售价（分）|
|originalPrice|integer|false|none||原价/划线价（分）|
|memberPrice|integer|false|none||会员价（分）|
|vipPrice|integer|false|none||VIP价（分）|
|costPrice|integer|false|none||成本价（分）|
|stock|integer|false|none||总库存|
|stockType|integer|false|none||库存类型|
|stockWarning|integer|false|none||库存预警值|
|storeScope|integer|false|none||适用范围：0-全店通用 1-指定门店|
|storeIds|string|false|none||适用门店IDs（JSON数组）|
|sort|integer|false|none||排序|
|recommended|integer|false|none||是否推荐：0-否 1-是|
|specType|integer|false|none||规格类型：0-单规格 1-多规格|

<h2 id="tocS_OpenApiProductStatusUpdateReqVO">OpenApiProductStatusUpdateReqVO</h2>

<a id="schemaopenapiproductstatusupdatereqvo"></a>
<a id="schema_OpenApiProductStatusUpdateReqVO"></a>
<a id="tocSopenapiproductstatusupdatereqvo"></a>
<a id="tocsopenapiproductstatusupdatereqvo"></a>

```json
{
  "status": 0
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|status|integer|true|none||状态：0-上架 1-下架|

<h2 id="tocS_OpenApiCategoryCreateReqVO">OpenApiCategoryCreateReqVO</h2>

<a id="schemaopenapicategorycreatereqvo"></a>
<a id="schema_OpenApiCategoryCreateReqVO"></a>
<a id="tocSopenapicategorycreatereqvo"></a>
<a id="tocsopenapicategorycreatereqvo"></a>

```json
{
  "merchantId": 1,
  "parentId": 0,
  "name": "饮品",
  "iconUrl": "string",
  "sort": 0,
  "status": 0
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|merchantId|integer(int64)|true|none||商户ID|
|parentId|integer(int64)|false|none||父分类ID，0=顶级分类|
|name|string|true|none||分类名称|
|iconUrl|string|false|none||分类图标URL|
|sort|integer|false|none||排序|
|status|integer|false|none||状态：0-正常 1-禁用|

<h2 id="tocS_OpenApiCategoryUpdateReqVO">OpenApiCategoryUpdateReqVO</h2>

<a id="schemaopenapicategoryupdatereqvo"></a>
<a id="schema_OpenApiCategoryUpdateReqVO"></a>
<a id="tocSopenapicategoryupdatereqvo"></a>
<a id="tocsopenapicategoryupdatereqvo"></a>

```json
{
  "parentId": 0,
  "name": "饮品",
  "iconUrl": "string",
  "sort": 0,
  "status": 0
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|parentId|integer(int64)|false|none||父分类ID，0=顶级分类|
|name|string|false|none||分类名称|
|iconUrl|string|false|none||分类图标URL|
|sort|integer|false|none||排序|
|status|integer|false|none||状态：0-正常 1-禁用|

<h2 id="tocS_OpenApiStockOperationReqVO">OpenApiStockOperationReqVO</h2>

<a id="schemaopenapistockoperationreqvo"></a>
<a id="schema_OpenApiStockOperationReqVO"></a>
<a id="tocSopenapistockoperationreqvo"></a>
<a id="tocsopenapistockoperationreqvo"></a>

```json
{
  "quantity": 10,
  "reason": "采购入库",
  "remark": "供应商送货"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|quantity|integer|true|none||数量（正数）|
|reason|string|false|none||原因|
|remark|string|false|none||备注|

<h2 id="tocS_OpenStockLogRespDTO">OpenStockLogRespDTO</h2>

<a id="schemaopenstocklogrespdto"></a>
<a id="schema_OpenStockLogRespDTO"></a>
<a id="tocSopenstocklogrespdto"></a>
<a id="tocsopenstocklogrespdto"></a>

```json
{
  "id": 1,
  "spuId": 1,
  "skuId": 1,
  "changeType": 1,
  "changeQuantity": 10,
  "stockBefore": 90,
  "stockAfter": 100,
  "reason": "采购入库",
  "remark": "string",
  "createTime": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||记录ID|
|spuId|integer(int64)|false|none||商品SPU ID|
|skuId|integer(int64)|false|none||SKU ID|
|changeType|integer|false|none||变动类型：1-入库 2-出库 3-调整 4-调拨 5-订单扣减 6-订单取消恢复 7-盘点|
|changeQuantity|integer|false|none||变动数量|
|stockBefore|integer|false|none||变动前库存|
|stockAfter|integer|false|none||变动后库存|
|reason|string|false|none||变动原因|
|remark|string|false|none||备注|
|createTime|string|false|none||创建时间|

<h2 id="tocS_PageResultOpenStockLogRespDTO">PageResultOpenStockLogRespDTO</h2>

<a id="schemapageresultopenstocklogrespdto"></a>
<a id="schema_PageResultOpenStockLogRespDTO"></a>
<a id="tocSpageresultopenstocklogrespdto"></a>
<a id="tocspageresultopenstocklogrespdto"></a>

```json
{
  "total": 0,
  "list": [
    {
      "id": 1,
      "spuId": 1,
      "skuId": 1,
      "changeType": 1,
      "changeQuantity": 10,
      "stockBefore": 90,
      "stockAfter": 100,
      "reason": "采购入库",
      "remark": "string",
      "createTime": "string"
    }
  ]
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|total|integer(int64)|false|none||总量|
|list|[[OpenStockLogRespDTO](#schemaopenstocklogrespdto)]|false|none||数据|

<h2 id="tocS_CommonResultPageResultOpenStockLogRespDTO">CommonResultPageResultOpenStockLogRespDTO</h2>

<a id="schemacommonresultpageresultopenstocklogrespdto"></a>
<a id="schema_CommonResultPageResultOpenStockLogRespDTO"></a>
<a id="tocScommonresultpageresultopenstocklogrespdto"></a>
<a id="tocscommonresultpageresultopenstocklogrespdto"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "total": 0,
    "list": [
      {
        "id": 1,
        "spuId": 1,
        "skuId": 1,
        "changeType": 1,
        "changeQuantity": 10,
        "stockBefore": 90,
        "stockAfter": 100,
        "reason": "采购入库",
        "remark": "string",
        "createTime": "string"
      }
    ]
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[PageResultOpenStockLogRespDTO](#schemapageresultopenstocklogrespdto)|false|none||返回数据|

<h2 id="tocS_OpenProductStatisticsRespDTO">OpenProductStatisticsRespDTO</h2>

<a id="schemaopenproductstatisticsrespdto"></a>
<a id="schema_OpenProductStatisticsRespDTO"></a>
<a id="tocSopenproductstatisticsrespdto"></a>
<a id="tocsopenproductstatisticsrespdto"></a>

```json
{
  "onSaleCount": 30,
  "offSaleCount": 5,
  "soldOutCount": 2,
  "totalCount": 37
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|onSaleCount|integer(int64)|false|none||在售商品数|
|offSaleCount|integer(int64)|false|none||已下架商品数|
|soldOutCount|integer(int64)|false|none||售罄商品数|
|totalCount|integer(int64)|false|none||商品总数|

<h2 id="tocS_CommonResultOpenProductStatisticsRespDTO">CommonResultOpenProductStatisticsRespDTO</h2>

<a id="schemacommonresultopenproductstatisticsrespdto"></a>
<a id="schema_CommonResultOpenProductStatisticsRespDTO"></a>
<a id="tocScommonresultopenproductstatisticsrespdto"></a>
<a id="tocscommonresultopenproductstatisticsrespdto"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "onSaleCount": 30,
    "offSaleCount": 5,
    "soldOutCount": 2,
    "totalCount": 37
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[OpenProductStatisticsRespDTO](#schemaopenproductstatisticsrespdto)|false|none||返回数据|

<h2 id="tocS_OpenBookingAvailableSlotRespDTO">OpenBookingAvailableSlotRespDTO</h2>

<a id="schemaopenbookingavailableslotrespdto"></a>
<a id="schema_OpenBookingAvailableSlotRespDTO"></a>
<a id="tocSopenbookingavailableslotrespdto"></a>
<a id="tocsopenbookingavailableslotrespdto"></a>

```json
{
  "startTime": "string",
  "endTime": "string",
  "available": true,
  "bookedCount": 0
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|startTime|string|false|none||开始时间|
|endTime|string|false|none||结束时间|
|available|boolean|false|none||是否可预约|
|bookedCount|integer|false|none||已预约数量|

<h2 id="tocS_CommonResultListOpenBookingAvailableSlotRespDTO">CommonResultListOpenBookingAvailableSlotRespDTO</h2>

<a id="schemacommonresultlistopenbookingavailableslotrespdto"></a>
<a id="schema_CommonResultListOpenBookingAvailableSlotRespDTO"></a>
<a id="tocScommonresultlistopenbookingavailableslotrespdto"></a>
<a id="tocscommonresultlistopenbookingavailableslotrespdto"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": [
    {
      "startTime": "string",
      "endTime": "string",
      "available": true,
      "bookedCount": 0
    }
  ]
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[[OpenBookingAvailableSlotRespDTO](#schemaopenbookingavailableslotrespdto)]|false|none||返回数据|

<h2 id="tocS_OpenBookingOrderRespDTO">OpenBookingOrderRespDTO</h2>

<a id="schemaopenbookingorderrespdto"></a>
<a id="schema_OpenBookingOrderRespDTO"></a>
<a id="tocSopenbookingorderrespdto"></a>
<a id="tocsopenbookingorderrespdto"></a>

```json
{
  "id": 1,
  "orderNo": "BK202603130001",
  "merchantId": 1,
  "storeId": 1,
  "bookingDate": "string",
  "startTime": "string",
  "endTime": "string",
  "duration": 0,
  "actualDuration": 0,
  "userName": "string",
  "userPhone": "string",
  "userRemark": "string",
  "specialRequirement": "string",
  "peopleCount": 0,
  "status": 0,
  "confirmType": 0,
  "confirmTime": "string",
  "startServiceTime": "string",
  "finishServiceTime": "string",
  "cancelTime": "string",
  "cancelReason": "string",
  "cancelBy": 0,
  "sourceAppId": 0,
  "sourceAppName": "string",
  "sourceChannel": "string",
  "baseAmount": 0,
  "extraAmount": 0,
  "discountAmount": 0,
  "totalAmount": 0,
  "paidAmount": 0,
  "refundAmount": 0,
  "paymentMethod": "string",
  "paymentStatus": 0,
  "paymentTime": "string",
  "rating": 0,
  "comment": "string",
  "remark": "string",
  "createTime": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||预约订单ID|
|orderNo|string|false|none||订单编号|
|merchantId|integer(int64)|false|none||商户ID|
|storeId|integer(int64)|false|none||门店ID|
|bookingDate|string|false|none||预约日期|
|startTime|string|false|none||预约开始时间|
|endTime|string|false|none||预约结束时间|
|duration|integer|false|none||预计时长(分钟)|
|actualDuration|integer|false|none||实际时长(分钟)|
|userName|string|false|none||预约人姓名|
|userPhone|string|false|none||预约人手机号|
|userRemark|string|false|none||用户备注|
|specialRequirement|string|false|none||特殊要求|
|peopleCount|integer|false|none||预约人数|
|status|integer|false|none||订单状态：0-待确认 1-已确认 2-进行中 3-已完成 4-已取消 5-已过期|
|confirmType|integer|false|none||确认方式：1-自动确认 2-人工确认 3-支付确认|
|confirmTime|string|false|none||确认时间|
|startServiceTime|string|false|none||开始服务时间|
|finishServiceTime|string|false|none||完成服务时间|
|cancelTime|string|false|none||取消时间|
|cancelReason|string|false|none||取消原因|
|cancelBy|integer|false|none||取消方：1-用户 2-商户 3-系统|
|sourceAppId|integer(int64)|false|none||来源APP ID|
|sourceAppName|string|false|none||来源APP名称|
|sourceChannel|string|false|none||来源渠道|
|baseAmount|integer|false|none||基础金额(分)|
|extraAmount|integer|false|none||附加费用(分)|
|discountAmount|integer|false|none||优惠金额(分)|
|totalAmount|integer|false|none||订单总金额(分)|
|paidAmount|integer|false|none||实付金额(分)|
|refundAmount|integer|false|none||退款金额(分)|
|paymentMethod|string|false|none||支付方式|
|paymentStatus|integer|false|none||支付状态：0-未支付 1-部分支付 2-已支付 3-已退款|
|paymentTime|string|false|none||支付时间|
|rating|integer|false|none||评分(1-5分)|
|comment|string|false|none||评价内容|
|remark|string|false|none||商户备注|
|createTime|string|false|none||创建时间|

<h2 id="tocS_PageResultOpenBookingOrderRespDTO">PageResultOpenBookingOrderRespDTO</h2>

<a id="schemapageresultopenbookingorderrespdto"></a>
<a id="schema_PageResultOpenBookingOrderRespDTO"></a>
<a id="tocSpageresultopenbookingorderrespdto"></a>
<a id="tocspageresultopenbookingorderrespdto"></a>

```json
{
  "total": 0,
  "list": [
    {
      "id": 1,
      "orderNo": "BK202603130001",
      "merchantId": 1,
      "storeId": 1,
      "bookingDate": "string",
      "startTime": "string",
      "endTime": "string",
      "duration": 0,
      "actualDuration": 0,
      "userName": "string",
      "userPhone": "string",
      "userRemark": "string",
      "specialRequirement": "string",
      "peopleCount": 0,
      "status": 0,
      "confirmType": 0,
      "confirmTime": "string",
      "startServiceTime": "string",
      "finishServiceTime": "string",
      "cancelTime": "string",
      "cancelReason": "string",
      "cancelBy": 0,
      "sourceAppId": 0,
      "sourceAppName": "string",
      "sourceChannel": "string",
      "baseAmount": 0,
      "extraAmount": 0,
      "discountAmount": 0,
      "totalAmount": 0,
      "paidAmount": 0,
      "refundAmount": 0,
      "paymentMethod": "string",
      "paymentStatus": 0,
      "paymentTime": "string",
      "rating": 0,
      "comment": "string",
      "remark": "string",
      "createTime": "string"
    }
  ]
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|total|integer(int64)|false|none||总量|
|list|[[OpenBookingOrderRespDTO](#schemaopenbookingorderrespdto)]|false|none||数据|

<h2 id="tocS_CommonResultPageResultOpenBookingOrderRespDTO">CommonResultPageResultOpenBookingOrderRespDTO</h2>

<a id="schemacommonresultpageresultopenbookingorderrespdto"></a>
<a id="schema_CommonResultPageResultOpenBookingOrderRespDTO"></a>
<a id="tocScommonresultpageresultopenbookingorderrespdto"></a>
<a id="tocscommonresultpageresultopenbookingorderrespdto"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "total": 0,
    "list": [
      {
        "id": 1,
        "orderNo": "BK202603130001",
        "merchantId": 1,
        "storeId": 1,
        "bookingDate": "string",
        "startTime": "string",
        "endTime": "string",
        "duration": 0,
        "actualDuration": 0,
        "userName": "string",
        "userPhone": "string",
        "userRemark": "string",
        "specialRequirement": "string",
        "peopleCount": 0,
        "status": 0,
        "confirmType": 0,
        "confirmTime": "string",
        "startServiceTime": "string",
        "finishServiceTime": "string",
        "cancelTime": "string",
        "cancelReason": "string",
        "cancelBy": 0,
        "sourceAppId": 0,
        "sourceAppName": "string",
        "sourceChannel": "string",
        "baseAmount": 0,
        "extraAmount": 0,
        "discountAmount": 0,
        "totalAmount": 0,
        "paidAmount": 0,
        "refundAmount": 0,
        "paymentMethod": "string",
        "paymentStatus": 0,
        "paymentTime": "string",
        "rating": 0,
        "comment": "string",
        "remark": "string",
        "createTime": "string"
      }
    ]
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[PageResultOpenBookingOrderRespDTO](#schemapageresultopenbookingorderrespdto)|false|none||返回数据|

<h2 id="tocS_CommonResultOpenBookingOrderRespDTO">CommonResultOpenBookingOrderRespDTO</h2>

<a id="schemacommonresultopenbookingorderrespdto"></a>
<a id="schema_CommonResultOpenBookingOrderRespDTO"></a>
<a id="tocScommonresultopenbookingorderrespdto"></a>
<a id="tocscommonresultopenbookingorderrespdto"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "id": 1,
    "orderNo": "BK202603130001",
    "merchantId": 1,
    "storeId": 1,
    "bookingDate": "string",
    "startTime": "string",
    "endTime": "string",
    "duration": 0,
    "actualDuration": 0,
    "userName": "string",
    "userPhone": "string",
    "userRemark": "string",
    "specialRequirement": "string",
    "peopleCount": 0,
    "status": 0,
    "confirmType": 0,
    "confirmTime": "string",
    "startServiceTime": "string",
    "finishServiceTime": "string",
    "cancelTime": "string",
    "cancelReason": "string",
    "cancelBy": 0,
    "sourceAppId": 0,
    "sourceAppName": "string",
    "sourceChannel": "string",
    "baseAmount": 0,
    "extraAmount": 0,
    "discountAmount": 0,
    "totalAmount": 0,
    "paidAmount": 0,
    "refundAmount": 0,
    "paymentMethod": "string",
    "paymentStatus": 0,
    "paymentTime": "string",
    "rating": 0,
    "comment": "string",
    "remark": "string",
    "createTime": "string"
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[OpenBookingOrderRespDTO](#schemaopenbookingorderrespdto)|false|none||返回数据|

<h2 id="tocS_OpenApiCashierCreateRespVO">OpenApiCashierCreateRespVO</h2>

<a id="schemaopenapicashiercreaterespvo"></a>
<a id="schema_OpenApiCashierCreateRespVO"></a>
<a id="tocSopenapicashiercreaterespvo"></a>
<a id="tocsopenapicashiercreaterespvo"></a>

```json
{
  "tradeNo": "PT20260316xxx",
  "cashierUrl": "https://pay.platform.com/cashier.html?token=xxx"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|tradeNo|string|false|none||平台交易号|
|cashierUrl|string|false|none||收银台页面URL|

<h2 id="tocS_OpenBookingStatisticsRespDTO">OpenBookingStatisticsRespDTO</h2>

<a id="schemaopenbookingstatisticsrespdto"></a>
<a id="schema_OpenBookingStatisticsRespDTO"></a>
<a id="tocSopenbookingstatisticsrespdto"></a>
<a id="tocsopenbookingstatisticsrespdto"></a>

```json
{
  "totalCount": 100,
  "pendingCount": 10,
  "confirmedCount": 20,
  "inProgressCount": 5,
  "completedCount": 50,
  "cancelledCount": 15,
  "todayCount": 8,
  "todayCompletedCount": 3
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|totalCount|integer(int64)|false|none||总预约数|
|pendingCount|integer(int64)|false|none||待确认数|
|confirmedCount|integer(int64)|false|none||已确认数|
|inProgressCount|integer(int64)|false|none||进行中数|
|completedCount|integer(int64)|false|none||已完成数|
|cancelledCount|integer(int64)|false|none||已取消数|
|todayCount|integer(int64)|false|none||今日预约数|
|todayCompletedCount|integer(int64)|false|none||今日完成数|

<h2 id="tocS_CommonResultOpenApiCashierCreateRespVO">CommonResultOpenApiCashierCreateRespVO</h2>

<a id="schemacommonresultopenapicashiercreaterespvo"></a>
<a id="schema_CommonResultOpenApiCashierCreateRespVO"></a>
<a id="tocScommonresultopenapicashiercreaterespvo"></a>
<a id="tocscommonresultopenapicashiercreaterespvo"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "tradeNo": "PT20260316xxx",
    "cashierUrl": "https://pay.platform.com/cashier.html?token=xxx"
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[OpenApiCashierCreateRespVO](#schemaopenapicashiercreaterespvo)|false|none||返回数据|

<h2 id="tocS_CommonResultOpenBookingStatisticsRespDTO">CommonResultOpenBookingStatisticsRespDTO</h2>

<a id="schemacommonresultopenbookingstatisticsrespdto"></a>
<a id="schema_CommonResultOpenBookingStatisticsRespDTO"></a>
<a id="tocScommonresultopenbookingstatisticsrespdto"></a>
<a id="tocscommonresultopenbookingstatisticsrespdto"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "totalCount": 100,
    "pendingCount": 10,
    "confirmedCount": 20,
    "inProgressCount": 5,
    "completedCount": 50,
    "cancelledCount": 15,
    "todayCount": 8,
    "todayCompletedCount": 3
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[OpenBookingStatisticsRespDTO](#schemaopenbookingstatisticsrespdto)|false|none||返回数据|

<h2 id="tocS_OpenApiCashierCreateReqVO">OpenApiCashierCreateReqVO</h2>

<a id="schemaopenapicashiercreatereqvo"></a>
<a id="schema_OpenApiCashierCreateReqVO"></a>
<a id="tocSopenapicashiercreatereqvo"></a>
<a id="tocsopenapicashiercreatereqvo"></a>

```json
{
  "merchantId": 123456,
  "outTradeNo": "ORDER001",
  "totalAmount": 10000,
  "subject": "服务支付",
  "body": "订单描述",
  "returnUrl": "https://app.example.com/result",
  "expireMinutes": 30,
  "attach": "自定义数据"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|merchantId|integer(int64)|true|none||商户ID|
|outTradeNo|string|true|none||商户订单号|
|totalAmount|integer|true|none||支付金额（分）|
|subject|string|true|none||商品标题|
|body|string|false|none||商品描述|
|returnUrl|string|false|none||支付完成回跳地址|
|expireMinutes|integer|false|none||过期时间（分钟）|
|attach|string|false|none||附加数据（透传）|

<h2 id="tocS_OpenApiBookingOrderCreateReqVO">OpenApiBookingOrderCreateReqVO</h2>

<a id="schemaopenapibookingordercreatereqvo"></a>
<a id="schema_OpenApiBookingOrderCreateReqVO"></a>
<a id="tocSopenapibookingordercreatereqvo"></a>
<a id="tocsopenapibookingordercreatereqvo"></a>

```json
{
  "merchantId": 1,
  "storeId": 1,
  "bookingDate": "string",
  "startTime": "string",
  "endTime": "string",
  "duration": 60,
  "userName": "张三",
  "userPhone": "13800138000",
  "userRemark": "string",
  "specialRequirement": "string",
  "peopleCount": 2,
  "sourceChannel": "string",
  "baseAmount": 10000,
  "extraAmount": 0,
  "discountAmount": 0,
  "totalAmount": 10000
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|merchantId|integer(int64)|true|none||商户ID|
|storeId|integer(int64)|true|none||门店ID|
|bookingDate|string|true|none||预约日期|
|startTime|string|true|none||预约开始时间|
|endTime|string|true|none||预约结束时间|
|duration|integer|true|none||预计时长(分钟)|
|userName|string|true|none||预约人姓名|
|userPhone|string|true|none||预约人手机号|
|userRemark|string|false|none||用户备注|
|specialRequirement|string|false|none||特殊要求|
|peopleCount|integer|true|none||预约人数|
|sourceChannel|string|false|none||来源渠道|
|baseAmount|integer|false|none||基础金额(分)|
|extraAmount|integer|false|none||附加费用(分)|
|discountAmount|integer|false|none||优惠金额(分)|
|totalAmount|integer|false|none||订单总金额(分)|

<h2 id="tocS_OpenApiPaymentQueryRespVO">OpenApiPaymentQueryRespVO</h2>

<a id="schemaopenapipaymentqueryrespvo"></a>
<a id="schema_OpenApiPaymentQueryRespVO"></a>
<a id="tocSopenapipaymentqueryrespvo"></a>
<a id="tocsopenapipaymentqueryrespvo"></a>

```json
{
  "tradeNo": "PT20260316xxx",
  "outTradeNo": "ORDER001",
  "tradeStatus": "SUCCESS",
  "totalAmount": 10000,
  "payTime": "string",
  "attach": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|tradeNo|string|false|none||平台交易号|
|outTradeNo|string|false|none||商户订单号|
|tradeStatus|string|false|none||交易状态|
|totalAmount|integer|false|none||支付金额（分）|
|payTime|string|false|none||支付成功时间|
|attach|string|false|none||附加数据|

<h2 id="tocS_OpenApiBookingOrderUpdateReqVO">OpenApiBookingOrderUpdateReqVO</h2>

<a id="schemaopenapibookingorderupdatereqvo"></a>
<a id="schema_OpenApiBookingOrderUpdateReqVO"></a>
<a id="tocSopenapibookingorderupdatereqvo"></a>
<a id="tocsopenapibookingorderupdatereqvo"></a>

```json
{
  "bookingDate": "string",
  "startTime": "string",
  "endTime": "string",
  "duration": 60,
  "userName": "张三",
  "userPhone": "13800138000",
  "userRemark": "string",
  "specialRequirement": "string",
  "peopleCount": 2,
  "remark": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|bookingDate|string|false|none||预约日期|
|startTime|string|false|none||预约开始时间|
|endTime|string|false|none||预约结束时间|
|duration|integer|false|none||预计时长(分钟)|
|userName|string|false|none||预约人姓名|
|userPhone|string|false|none||预约人手机号|
|userRemark|string|false|none||用户备注|
|specialRequirement|string|false|none||特殊要求|
|peopleCount|integer|false|none||预约人数|
|remark|string|false|none||商户备注|

<h2 id="tocS_CommonResultOpenApiPaymentQueryRespVO">CommonResultOpenApiPaymentQueryRespVO</h2>

<a id="schemacommonresultopenapipaymentqueryrespvo"></a>
<a id="schema_CommonResultOpenApiPaymentQueryRespVO"></a>
<a id="tocScommonresultopenapipaymentqueryrespvo"></a>
<a id="tocscommonresultopenapipaymentqueryrespvo"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "tradeNo": "PT20260316xxx",
    "outTradeNo": "ORDER001",
    "tradeStatus": "SUCCESS",
    "totalAmount": 10000,
    "payTime": "string",
    "attach": "string"
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[OpenApiPaymentQueryRespVO](#schemaopenapipaymentqueryrespvo)|false|none||返回数据|

<h2 id="tocS_OpenApiBookingOrderCancelReqVO">OpenApiBookingOrderCancelReqVO</h2>

<a id="schemaopenapibookingordercancelreqvo"></a>
<a id="schema_OpenApiBookingOrderCancelReqVO"></a>
<a id="tocSopenapibookingordercancelreqvo"></a>
<a id="tocsopenapibookingordercancelreqvo"></a>

```json
{
  "cancelReason": "string",
  "cancelRemark": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|cancelReason|string|false|none||取消原因|
|cancelRemark|string|false|none||取消备注|

<h2 id="tocS_OpenApiBookingOrderConfirmReqVO">OpenApiBookingOrderConfirmReqVO</h2>

<a id="schemaopenapibookingorderconfirmreqvo"></a>
<a id="schema_OpenApiBookingOrderConfirmReqVO"></a>
<a id="tocSopenapibookingorderconfirmreqvo"></a>
<a id="tocsopenapibookingorderconfirmreqvo"></a>

```json
{
  "confirmerId": 1,
  "remark": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|confirmerId|integer(int64)|false|none||确认人ID|
|remark|string|false|none||备注|

<h2 id="tocS_OpenCouponRespDTO">OpenCouponRespDTO</h2>

<a id="schemaopencouponrespdto"></a>
<a id="schema_OpenCouponRespDTO"></a>
<a id="tocSopencouponrespdto"></a>
<a id="tocsopencouponrespdto"></a>

```json
{
  "id": 1,
  "appId": 1,
  "appUserId": 1,
  "externalUserId": "string",
  "merchantId": 1,
  "templateId": 1,
  "couponType": 1,
  "couponNo": "GC123456",
  "writeOffCode": "WO123456",
  "status": 0,
  "useTime": "string",
  "expireTime": "string",
  "orderId": 1,
  "templateName": "满100减20",
  "templateCoverUrl": "string",
  "templateDescription": "string",
  "discountRate": 85,
  "maxDiscount": 5000,
  "thresholdAmount": 10000,
  "reduceAmount": 2000,
  "giftDescription": "string",
  "createTime": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||优惠券ID|
|appId|integer(int64)|false|none||来源App ID|
|appUserId|integer(int64)|false|none||App用户映射ID|
|externalUserId|string|false|none||下游App用户标识|
|merchantId|integer(int64)|false|none||商户ID|
|templateId|integer(int64)|false|none||优惠券模板ID|
|couponType|integer|false|none||优惠券类型：1-折扣券 2-满减券 3-礼品券|
|couponNo|string|false|none||券号|
|writeOffCode|string|false|none||核销码(礼品券)|
|status|integer|false|none||状态：0-未使用 1-已使用 2-已过期|
|useTime|string|false|none||使用时间|
|expireTime|string|false|none||过期时间|
|orderId|integer(int64)|false|none||使用时关联的订单ID|
|templateName|string|false|none||模板名称|
|templateCoverUrl|string|false|none||模板封面图|
|templateDescription|string|false|none||使用说明|
|discountRate|integer|false|none||折扣率(%)|
|maxDiscount|integer|false|none||最大优惠金额(分)|
|thresholdAmount|integer|false|none||使用门槛金额(分)|
|reduceAmount|integer|false|none||减免金额(分)|
|giftDescription|string|false|none||礼品说明|
|createTime|string|false|none||创建时间|

<h2 id="tocS_PageResultOpenCouponRespDTO">PageResultOpenCouponRespDTO</h2>

<a id="schemapageresultopencouponrespdto"></a>
<a id="schema_PageResultOpenCouponRespDTO"></a>
<a id="tocSpageresultopencouponrespdto"></a>
<a id="tocspageresultopencouponrespdto"></a>

```json
{
  "total": 0,
  "list": [
    {
      "id": 1,
      "appId": 1,
      "appUserId": 1,
      "externalUserId": "string",
      "merchantId": 1,
      "templateId": 1,
      "couponType": 1,
      "couponNo": "GC123456",
      "writeOffCode": "WO123456",
      "status": 0,
      "useTime": "string",
      "expireTime": "string",
      "orderId": 1,
      "templateName": "满100减20",
      "templateCoverUrl": "string",
      "templateDescription": "string",
      "discountRate": 85,
      "maxDiscount": 5000,
      "thresholdAmount": 10000,
      "reduceAmount": 2000,
      "giftDescription": "string",
      "createTime": "string"
    }
  ]
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|total|integer(int64)|false|none||总量|
|list|[[OpenCouponRespDTO](#schemaopencouponrespdto)]|false|none||数据|

<h2 id="tocS_CommonResultPageResultOpenCouponRespDTO">CommonResultPageResultOpenCouponRespDTO</h2>

<a id="schemacommonresultpageresultopencouponrespdto"></a>
<a id="schema_CommonResultPageResultOpenCouponRespDTO"></a>
<a id="tocScommonresultpageresultopencouponrespdto"></a>
<a id="tocscommonresultpageresultopencouponrespdto"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "total": 0,
    "list": [
      {
        "id": 1,
        "appId": 1,
        "appUserId": 1,
        "externalUserId": "string",
        "merchantId": 1,
        "templateId": 1,
        "couponType": 1,
        "couponNo": "GC123456",
        "writeOffCode": "WO123456",
        "status": 0,
        "useTime": "string",
        "expireTime": "string",
        "orderId": 1,
        "templateName": "满100减20",
        "templateCoverUrl": "string",
        "templateDescription": "string",
        "discountRate": 85,
        "maxDiscount": 5000,
        "thresholdAmount": 10000,
        "reduceAmount": 2000,
        "giftDescription": "string",
        "createTime": "string"
      }
    ]
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[PageResultOpenCouponRespDTO](#schemapageresultopencouponrespdto)|false|none||返回数据|

<h2 id="tocS_CommonResultOpenCouponRespDTO">CommonResultOpenCouponRespDTO</h2>

<a id="schemacommonresultopencouponrespdto"></a>
<a id="schema_CommonResultOpenCouponRespDTO"></a>
<a id="tocScommonresultopencouponrespdto"></a>
<a id="tocscommonresultopencouponrespdto"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "id": 1,
    "appId": 1,
    "appUserId": 1,
    "externalUserId": "string",
    "merchantId": 1,
    "templateId": 1,
    "couponType": 1,
    "couponNo": "GC123456",
    "writeOffCode": "WO123456",
    "status": 0,
    "useTime": "string",
    "expireTime": "string",
    "orderId": 1,
    "templateName": "满100减20",
    "templateCoverUrl": "string",
    "templateDescription": "string",
    "discountRate": 85,
    "maxDiscount": 5000,
    "thresholdAmount": 10000,
    "reduceAmount": 2000,
    "giftDescription": "string",
    "createTime": "string"
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[OpenCouponRespDTO](#schemaopencouponrespdto)|false|none||返回数据|

<h2 id="tocS_OpenCouponTemplateRespDTO">OpenCouponTemplateRespDTO</h2>

<a id="schemaopencoupontemplaterespdto"></a>
<a id="schema_OpenCouponTemplateRespDTO"></a>
<a id="tocSopencoupontemplaterespdto"></a>
<a id="tocsopencoupontemplaterespdto"></a>

```json
{
  "id": 1,
  "merchantId": 1,
  "couponType": 1,
  "name": "满100减20",
  "description": "满100元可使用",
  "coverUrl": "string",
  "discountRate": 85,
  "maxDiscount": 5000,
  "thresholdAmount": 10000,
  "reduceAmount": 2000,
  "giftDescription": "string",
  "purchaseAmount": 0,
  "totalCount": 1000,
  "issuedCount": 100,
  "remainingCount": 900,
  "claimLimit": 1,
  "validityDays": 30,
  "storeScope": 0,
  "storeIds": "string",
  "status": 0,
  "createTime": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||模板ID|
|merchantId|integer(int64)|false|none||商户ID|
|couponType|integer|false|none||优惠券类型：1-折扣券 2-满减券 3-礼品券|
|name|string|false|none||优惠券名称|
|description|string|false|none||使用说明|
|coverUrl|string|false|none||封面图|
|discountRate|integer|false|none||折扣率(%)|
|maxDiscount|integer|false|none||最大优惠金额(分)|
|thresholdAmount|integer|false|none||使用门槛金额(分)|
|reduceAmount|integer|false|none||减免金额(分)|
|giftDescription|string|false|none||礼品说明|
|purchaseAmount|integer|false|none||购买金额(分)，0=免费领取|
|totalCount|integer|false|none||发行总量，-1=不限|
|issuedCount|integer|false|none||已发行数量|
|remainingCount|integer|false|none||剩余可发行数量，-1=不限|
|claimLimit|integer|false|none||每人限领数量|
|validityDays|integer|false|none||领取后有效天数|
|storeScope|integer|false|none||适用范围：0-全店通用 1-指定门店|
|storeIds|string|false|none||适用门店IDs(JSON数组)|
|status|integer|false|none||状态：0-正常 1-禁用|
|createTime|string|false|none||创建时间|

<h2 id="tocS_CommonResultListOpenCouponTemplateRespDTO">CommonResultListOpenCouponTemplateRespDTO</h2>

<a id="schemacommonresultlistopencoupontemplaterespdto"></a>
<a id="schema_CommonResultListOpenCouponTemplateRespDTO"></a>
<a id="tocScommonresultlistopencoupontemplaterespdto"></a>
<a id="tocscommonresultlistopencoupontemplaterespdto"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": [
    {
      "id": 1,
      "merchantId": 1,
      "couponType": 1,
      "name": "满100减20",
      "description": "满100元可使用",
      "coverUrl": "string",
      "discountRate": 85,
      "maxDiscount": 5000,
      "thresholdAmount": 10000,
      "reduceAmount": 2000,
      "giftDescription": "string",
      "purchaseAmount": 0,
      "totalCount": 1000,
      "issuedCount": 100,
      "remainingCount": 900,
      "claimLimit": 1,
      "validityDays": 30,
      "storeScope": 0,
      "storeIds": "string",
      "status": 0,
      "createTime": "string"
    }
  ]
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[[OpenCouponTemplateRespDTO](#schemaopencoupontemplaterespdto)]|false|none||返回数据|

<h2 id="tocS_OpenApiCouponClaimReqVO">OpenApiCouponClaimReqVO</h2>

<a id="schemaopenapicouponclaimreqvo"></a>
<a id="schema_OpenApiCouponClaimReqVO"></a>
<a id="tocSopenapicouponclaimreqvo"></a>
<a id="tocsopenapicouponclaimreqvo"></a>

```json
{
  "merchantId": 1,
  "templateId": 1,
  "appUserId": 1,
  "externalUserId": "ext_user_001",
  "storeId": 1
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|merchantId|integer(int64)|true|none||商户ID|
|templateId|integer(int64)|true|none||优惠券模板ID|
|appUserId|integer(int64)|false|none||App用户映射ID，传 externalUserId 时可不传|
|externalUserId|string|false|none||下游 App 用户标识，传 appUserId 时可不传|
|storeId|integer(int64)|false|none||门店ID，标记用户在哪个门店购买|

<h2 id="tocS_OpenApiCouponPurchaseReqVO">OpenApiCouponPurchaseReqVO</h2>

<a id="schemaopenapicouponpurchasereqvo"></a>
<a id="schema_OpenApiCouponPurchaseReqVO"></a>
<a id="tocSopenapicouponpurchasereqvo"></a>
<a id="tocsopenapicouponpurchasereqvo"></a>

```json
{
  "merchantId": 1,
  "templateId": 1,
  "appUserId": 1,
  "externalUserId": "ext_user_001",
  "sourceChannel": "open_api",
  "storeId": 1
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|merchantId|integer(int64)|true|none||商户ID|
|templateId|integer(int64)|true|none||优惠券模板ID|
|appUserId|integer(int64)|false|none||App用户映射ID，传 externalUserId 时可不传|
|externalUserId|string|false|none||下游 App 用户标识，传 appUserId 时可不传|
|sourceChannel|string|false|none||购买来源渠道|
|storeId|integer(int64)|false|none||门店ID，标记用户在哪个门店购买|

<h2 id="tocS_OpenCouponVerifyRespDTO">OpenCouponVerifyRespDTO</h2>

<a id="schemaopencouponverifyrespdto"></a>
<a id="schema_OpenCouponVerifyRespDTO"></a>
<a id="tocSopencouponverifyrespdto"></a>
<a id="tocsopencouponverifyrespdto"></a>

```json
{
  "valid": true,
  "reason": "优惠券已过期",
  "couponId": 1,
  "couponNo": "GC123456",
  "couponType": 1,
  "status": 0,
  "templateName": "满100减20",
  "discountRate": 85,
  "maxDiscount": 5000,
  "thresholdAmount": 10000,
  "reduceAmount": 2000,
  "giftDescription": "string",
  "expireTime": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|valid|boolean|false|none||是否有效|
|reason|string|false|none||验证失败原因|
|couponId|integer(int64)|false|none||优惠券ID|
|couponNo|string|false|none||券号|
|couponType|integer|false|none||优惠券类型：1-折扣券 2-满减券 3-礼品券|
|status|integer|false|none||状态：0-未使用 1-已使用 2-已过期|
|templateName|string|false|none||模板名称|
|discountRate|integer|false|none||折扣率(%)|
|maxDiscount|integer|false|none||最大优惠金额(分)|
|thresholdAmount|integer|false|none||使用门槛金额(分)|
|reduceAmount|integer|false|none||减免金额(分)|
|giftDescription|string|false|none||礼品说明|
|expireTime|string|false|none||过期时间|

<h2 id="tocS_CommonResultOpenCouponVerifyRespDTO">CommonResultOpenCouponVerifyRespDTO</h2>

<a id="schemacommonresultopencouponverifyrespdto"></a>
<a id="schema_CommonResultOpenCouponVerifyRespDTO"></a>
<a id="tocScommonresultopencouponverifyrespdto"></a>
<a id="tocscommonresultopencouponverifyrespdto"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "valid": true,
    "reason": "优惠券已过期",
    "couponId": 1,
    "couponNo": "GC123456",
    "couponType": 1,
    "status": 0,
    "templateName": "满100减20",
    "discountRate": 85,
    "maxDiscount": 5000,
    "thresholdAmount": 10000,
    "reduceAmount": 2000,
    "giftDescription": "string",
    "expireTime": "string"
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[OpenCouponVerifyRespDTO](#schemaopencouponverifyrespdto)|false|none||返回数据|

<h2 id="tocS_OpenApiCouponWriteOffReqVO">OpenApiCouponWriteOffReqVO</h2>

<a id="schemaopenapicouponwriteoffreqvo"></a>
<a id="schema_OpenApiCouponWriteOffReqVO"></a>
<a id="tocSopenapicouponwriteoffreqvo"></a>
<a id="tocsopenapicouponwriteoffreqvo"></a>

```json
{
  "merchantId": 1,
  "storeId": 1,
  "remark": "线下核销"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|merchantId|integer(int64)|true|none||商户ID|
|storeId|integer(int64)|false|none||门店ID|
|remark|string|false|none||备注|

<h2 id="tocS_OpenApiCouponTemplateCreateReqVO">OpenApiCouponTemplateCreateReqVO</h2>

<a id="schemaopenapicoupontemplatecreatereqvo"></a>
<a id="schema_OpenApiCouponTemplateCreateReqVO"></a>
<a id="tocSopenapicoupontemplatecreatereqvo"></a>
<a id="tocsopenapicoupontemplatecreatereqvo"></a>

```json
{
  "merchantId": 1,
  "couponType": 1,
  "name": "满100减20",
  "description": "满100元可使用",
  "coverUrl": "https://example.com/cover.png",
  "discountRate": 85,
  "maxDiscount": 5000,
  "thresholdAmount": 10000,
  "reduceAmount": 2000,
  "giftDescription": "赠送一杯饮品",
  "totalCount": 1000,
  "claimLimit": 1,
  "validityDays": 30,
  "storeScope": 0,
  "storeIds": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|merchantId|integer(int64)|true|none||商户ID|
|couponType|integer|true|none||优惠券类型：1-折扣券 2-满减券 3-礼品券|
|name|string|true|none||优惠券名称|
|description|string|false|none||使用说明|
|coverUrl|string|false|none||封面图|
|discountRate|integer|false|none||折扣率(%)，折扣券用，如85=8.5折|
|maxDiscount|integer|false|none||最大优惠金额(分)，折扣券用|
|thresholdAmount|integer|false|none||使用门槛金额(分)，满减券用|
|reduceAmount|integer|false|none||减免金额(分)，满减券用|
|giftDescription|string|false|none||礼品说明，礼品券用|
|totalCount|integer|false|none||发行总量，-1=不限|
|claimLimit|integer|false|none||每人限领数量|
|validityDays|integer|true|none||领取后有效天数|
|storeScope|integer|false|none||适用范围：0-全店通用 1-指定门店|
|storeIds|string|false|none||适用门店IDs(JSON数组)|

<h2 id="tocS_OpenApiCouponTemplateUpdateReqVO">OpenApiCouponTemplateUpdateReqVO</h2>

<a id="schemaopenapicoupontemplateupdatereqvo"></a>
<a id="schema_OpenApiCouponTemplateUpdateReqVO"></a>
<a id="tocSopenapicoupontemplateupdatereqvo"></a>
<a id="tocsopenapicoupontemplateupdatereqvo"></a>

```json
{
  "name": "满100减20",
  "description": "满100元可使用",
  "coverUrl": "https://example.com/cover.png",
  "discountRate": 85,
  "maxDiscount": 5000,
  "thresholdAmount": 10000,
  "reduceAmount": 2000,
  "giftDescription": "赠送一杯饮品",
  "totalCount": 1000,
  "claimLimit": 1,
  "validityDays": 30,
  "storeScope": 0,
  "storeIds": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|name|string|false|none||优惠券名称|
|description|string|false|none||使用说明|
|coverUrl|string|false|none||封面图|
|discountRate|integer|false|none||折扣率(%)，折扣券用|
|maxDiscount|integer|false|none||最大优惠金额(分)|
|thresholdAmount|integer|false|none||使用门槛金额(分)|
|reduceAmount|integer|false|none||减免金额(分)|
|giftDescription|string|false|none||礼品说明|
|totalCount|integer|false|none||发行总量，-1=不限|
|claimLimit|integer|false|none||每人限领数量|
|validityDays|integer|false|none||领取后有效天数|
|storeScope|integer|false|none||适用范围：0-全店通用 1-指定门店|
|storeIds|string|false|none||适用门店IDs(JSON数组)|

<h2 id="tocS_OpenApiCouponIssueReqVO">OpenApiCouponIssueReqVO</h2>

<a id="schemaopenapicouponissuereqvo"></a>
<a id="schema_OpenApiCouponIssueReqVO"></a>
<a id="tocSopenapicouponissuereqvo"></a>
<a id="tocsopenapicouponissuereqvo"></a>

```json
{
  "merchantId": 1,
  "appUserIds": [
    0
  ],
  "externalUserIds": [
    "string"
  ]
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|merchantId|integer(int64)|true|none||商户ID|
|appUserIds|[integer]|false|none||App用户映射ID列表，传 externalUserIds 时可不传|
|externalUserIds|[string]|false|none||下游 App 用户标识列表，传 appUserIds 时可不传|

<h2 id="tocS_OpenOrderRespDTO">OpenOrderRespDTO</h2>

<a id="schemaopenorderrespdto"></a>
<a id="schema_OpenOrderRespDTO"></a>
<a id="tocSopenorderrespdto"></a>
<a id="tocsopenorderrespdto"></a>

```json
{
  "id": 1,
  "appId": 1,
  "appUserId": 1,
  "merchantId": 1,
  "storeId": 1,
  "orderNo": "202503120001",
  "orderType": 1,
  "totalAmount": 9900,
  "discountAmount": 0,
  "voucherDeductAmount": 0,
  "payAmount": 9900,
  "couponId": 1,
  "voucherIds": "string",
  "payOrderId": 1,
  "status": 0,
  "payTime": "string",
  "completeTime": "string",
  "cancelTime": "string",
  "expireTime": "string",
  "verifyCode": "string",
  "deliveryStatus": 0,
  "deliveryNo": "string",
  "remark": "string",
  "createTime": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||订单ID|
|appId|integer(int64)|false|none||来源App|
|appUserId|integer(int64)|false|none||App用户映射ID|
|merchantId|integer(int64)|false|none||商户ID|
|storeId|integer(int64)|false|none||门店ID|
|orderNo|string|false|none||订单号|
|orderType|integer|false|none||订单类型：1-商品购买 2-会员卡办理 3-抵金券购买 4-分期还款|
|totalAmount|integer|false|none||订单总额(分)|
|discountAmount|integer|false|none||优惠券减免(分)|
|voucherDeductAmount|integer|false|none||抵金券抵扣(分)|
|payAmount|integer|false|none||实付金额(分)|
|couponId|integer(int64)|false|none||使用的优惠券ID|
|voucherIds|string|false|none||使用的抵金券IDs(JSON数组)|
|payOrderId|integer(int64)|false|none||支付模块订单ID|
|status|integer|false|none||状态：0-待支付 10-已支付 20-已完成 30-已取消 40-已退款 50-已超时|
|payTime|string|false|none||支付时间|
|completeTime|string|false|none||完成时间|
|cancelTime|string|false|none||取消时间|
|expireTime|string|false|none||支付截止时间|
|verifyCode|string|false|none||核销码|
|deliveryStatus|integer|false|none||配送状态|
|deliveryNo|string|false|none||快递单号|
|remark|string|false|none||备注|
|createTime|string|false|none||创建时间|

<h2 id="tocS_PageResultOpenOrderRespDTO">PageResultOpenOrderRespDTO</h2>

<a id="schemapageresultopenorderrespdto"></a>
<a id="schema_PageResultOpenOrderRespDTO"></a>
<a id="tocSpageresultopenorderrespdto"></a>
<a id="tocspageresultopenorderrespdto"></a>

```json
{
  "total": 0,
  "list": [
    {
      "id": 1,
      "appId": 1,
      "appUserId": 1,
      "merchantId": 1,
      "storeId": 1,
      "orderNo": "202503120001",
      "orderType": 1,
      "totalAmount": 9900,
      "discountAmount": 0,
      "voucherDeductAmount": 0,
      "payAmount": 9900,
      "couponId": 1,
      "voucherIds": "string",
      "payOrderId": 1,
      "status": 0,
      "payTime": "string",
      "completeTime": "string",
      "cancelTime": "string",
      "expireTime": "string",
      "verifyCode": "string",
      "deliveryStatus": 0,
      "deliveryNo": "string",
      "remark": "string",
      "createTime": "string"
    }
  ]
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|total|integer(int64)|false|none||总量|
|list|[[OpenOrderRespDTO](#schemaopenorderrespdto)]|false|none||数据|

<h2 id="tocS_CommonResultPageResultOpenOrderRespDTO">CommonResultPageResultOpenOrderRespDTO</h2>

<a id="schemacommonresultpageresultopenorderrespdto"></a>
<a id="schema_CommonResultPageResultOpenOrderRespDTO"></a>
<a id="tocScommonresultpageresultopenorderrespdto"></a>
<a id="tocscommonresultpageresultopenorderrespdto"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "total": 0,
    "list": [
      {
        "id": 1,
        "appId": 1,
        "appUserId": 1,
        "merchantId": 1,
        "storeId": 1,
        "orderNo": "202503120001",
        "orderType": 1,
        "totalAmount": 9900,
        "discountAmount": 0,
        "voucherDeductAmount": 0,
        "payAmount": 9900,
        "couponId": 1,
        "voucherIds": "string",
        "payOrderId": 1,
        "status": 0,
        "payTime": "string",
        "completeTime": "string",
        "cancelTime": "string",
        "expireTime": "string",
        "verifyCode": "string",
        "deliveryStatus": 0,
        "deliveryNo": "string",
        "remark": "string",
        "createTime": "string"
      }
    ]
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[PageResultOpenOrderRespDTO](#schemapageresultopenorderrespdto)|false|none||返回数据|

<h2 id="tocS_OpenOrderItemRespDTO">OpenOrderItemRespDTO</h2>

<a id="schemaopenorderitemrespdto"></a>
<a id="schema_OpenOrderItemRespDTO"></a>
<a id="tocSopenorderitemrespdto"></a>
<a id="tocsopenorderitemrespdto"></a>

```json
{
  "id": 1,
  "orderId": 1,
  "itemType": 1,
  "itemId": 1,
  "itemName": "招牌奶茶",
  "itemCoverUrl": "string",
  "specValues": "string",
  "price": 9900,
  "quantity": 1,
  "amount": 9900
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||明细ID|
|orderId|integer(int64)|false|none||订单ID|
|itemType|integer|false|none||商品类型：1-商品SPU 2-商品SKU 3-会员卡模板 4-抵金券|
|itemId|integer(int64)|false|none||关联ID|
|itemName|string|false|none||商品名称|
|itemCoverUrl|string|false|none||商品封面图|
|specValues|string|false|none||规格信息|
|price|integer|false|none||单价(分)|
|quantity|integer|false|none||数量|
|amount|integer|false|none||小计(分)|

<h2 id="tocS_OpenOrderDetailRespDTO">OpenOrderDetailRespDTO</h2>

<a id="schemaopenorderdetailrespdto"></a>
<a id="schema_OpenOrderDetailRespDTO"></a>
<a id="tocSopenorderdetailrespdto"></a>
<a id="tocsopenorderdetailrespdto"></a>

```json
{
  "id": 1,
  "appId": 1,
  "appUserId": 1,
  "merchantId": 1,
  "storeId": 1,
  "orderNo": "202503120001",
  "orderType": 1,
  "totalAmount": 9900,
  "discountAmount": 0,
  "voucherDeductAmount": 0,
  "payAmount": 9900,
  "couponId": 1,
  "voucherIds": "string",
  "payOrderId": 1,
  "status": 0,
  "payTime": "string",
  "completeTime": "string",
  "cancelTime": "string",
  "expireTime": "string",
  "verifyCode": "string",
  "deliveryStatus": 0,
  "deliveryNo": "string",
  "remark": "string",
  "createTime": "string",
  "items": [
    {
      "id": 1,
      "orderId": 1,
      "itemType": 1,
      "itemId": 1,
      "itemName": "招牌奶茶",
      "itemCoverUrl": "string",
      "specValues": "string",
      "price": 9900,
      "quantity": 1,
      "amount": 9900
    }
  ]
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||订单ID|
|appId|integer(int64)|false|none||来源App|
|appUserId|integer(int64)|false|none||App用户映射ID|
|merchantId|integer(int64)|false|none||商户ID|
|storeId|integer(int64)|false|none||门店ID|
|orderNo|string|false|none||订单号|
|orderType|integer|false|none||订单类型：1-商品购买 2-会员卡办理 3-抵金券购买 4-分期还款|
|totalAmount|integer|false|none||订单总额(分)|
|discountAmount|integer|false|none||优惠券减免(分)|
|voucherDeductAmount|integer|false|none||抵金券抵扣(分)|
|payAmount|integer|false|none||实付金额(分)|
|couponId|integer(int64)|false|none||使用的优惠券ID|
|voucherIds|string|false|none||使用的抵金券IDs(JSON数组)|
|payOrderId|integer(int64)|false|none||支付模块订单ID|
|status|integer|false|none||状态：0-待支付 10-已支付 20-已完成 30-已取消 40-已退款 50-已超时|
|payTime|string|false|none||支付时间|
|completeTime|string|false|none||完成时间|
|cancelTime|string|false|none||取消时间|
|expireTime|string|false|none||支付截止时间|
|verifyCode|string|false|none||核销码|
|deliveryStatus|integer|false|none||配送状态|
|deliveryNo|string|false|none||快递单号|
|remark|string|false|none||备注|
|createTime|string|false|none||创建时间|
|items|[[OpenOrderItemRespDTO](#schemaopenorderitemrespdto)]|false|none||订单明细列表|

<h2 id="tocS_CommonResultOpenOrderDetailRespDTO">CommonResultOpenOrderDetailRespDTO</h2>

<a id="schemacommonresultopenorderdetailrespdto"></a>
<a id="schema_CommonResultOpenOrderDetailRespDTO"></a>
<a id="tocScommonresultopenorderdetailrespdto"></a>
<a id="tocscommonresultopenorderdetailrespdto"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "id": 1,
    "appId": 1,
    "appUserId": 1,
    "merchantId": 1,
    "storeId": 1,
    "orderNo": "202503120001",
    "orderType": 1,
    "totalAmount": 9900,
    "discountAmount": 0,
    "voucherDeductAmount": 0,
    "payAmount": 9900,
    "couponId": 1,
    "voucherIds": "string",
    "payOrderId": 1,
    "status": 0,
    "payTime": "string",
    "completeTime": "string",
    "cancelTime": "string",
    "expireTime": "string",
    "verifyCode": "string",
    "deliveryStatus": 0,
    "deliveryNo": "string",
    "remark": "string",
    "createTime": "string",
    "items": [
      {
        "id": 1,
        "orderId": 1,
        "itemType": 1,
        "itemId": 1,
        "itemName": "招牌奶茶",
        "itemCoverUrl": "string",
        "specValues": "string",
        "price": 9900,
        "quantity": 1,
        "amount": 9900
      }
    ]
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[OpenOrderDetailRespDTO](#schemaopenorderdetailrespdto)|false|none||返回数据|

<h2 id="tocS_OpenOrderLogRespDTO">OpenOrderLogRespDTO</h2>

<a id="schemaopenorderlogrespdto"></a>
<a id="schema_OpenOrderLogRespDTO"></a>
<a id="tocSopenorderlogrespdto"></a>
<a id="tocsopenorderlogrespdto"></a>

```json
{
  "id": 1,
  "orderId": 1,
  "fromStatus": 0,
  "toStatus": 10,
  "operatorType": 3,
  "operatorId": "string",
  "remark": "string",
  "createTime": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||日志ID|
|orderId|integer(int64)|false|none||订单ID|
|fromStatus|integer|false|none||变更前状态|
|toStatus|integer|false|none||变更后状态|
|operatorType|integer|false|none||操作人类型：1-系统 2-用户 3-商户 4-管理员|
|operatorId|string|false|none||操作人ID|
|remark|string|false|none||备注|
|createTime|string|false|none||创建时间|

<h2 id="tocS_CommonResultListOpenOrderLogRespDTO">CommonResultListOpenOrderLogRespDTO</h2>

<a id="schemacommonresultlistopenorderlogrespdto"></a>
<a id="schema_CommonResultListOpenOrderLogRespDTO"></a>
<a id="tocScommonresultlistopenorderlogrespdto"></a>
<a id="tocscommonresultlistopenorderlogrespdto"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": [
    {
      "id": 1,
      "orderId": 1,
      "fromStatus": 0,
      "toStatus": 10,
      "operatorType": 3,
      "operatorId": "string",
      "remark": "string",
      "createTime": "string"
    }
  ]
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[[OpenOrderLogRespDTO](#schemaopenorderlogrespdto)]|false|none||返回数据|

<h2 id="tocS_OpenOrderStatisticsRespDTO">OpenOrderStatisticsRespDTO</h2>

<a id="schemaopenorderstatisticsrespdto"></a>
<a id="schema_OpenOrderStatisticsRespDTO"></a>
<a id="tocSopenorderstatisticsrespdto"></a>
<a id="tocsopenorderstatisticsrespdto"></a>

```json
{
  "totalCount": 100,
  "unpaidCount": 10,
  "paidCount": 30,
  "completedCount": 50,
  "cancelledCount": 5,
  "refundedCount": 5,
  "totalAmount": 990000,
  "totalPayAmount": 880000
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|totalCount|integer(int64)|false|none||订单总数|
|unpaidCount|integer(int64)|false|none||待支付数量|
|paidCount|integer(int64)|false|none||已支付数量|
|completedCount|integer(int64)|false|none||已完成数量|
|cancelledCount|integer(int64)|false|none||已取消数量|
|refundedCount|integer(int64)|false|none||已退款数量|
|totalAmount|integer(int64)|false|none||订单总金额(分)|
|totalPayAmount|integer(int64)|false|none||实付总金额(分)|

<h2 id="tocS_CommonResultOpenOrderStatisticsRespDTO">CommonResultOpenOrderStatisticsRespDTO</h2>

<a id="schemacommonresultopenorderstatisticsrespdto"></a>
<a id="schema_CommonResultOpenOrderStatisticsRespDTO"></a>
<a id="tocScommonresultopenorderstatisticsrespdto"></a>
<a id="tocscommonresultopenorderstatisticsrespdto"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "totalCount": 100,
    "unpaidCount": 10,
    "paidCount": 30,
    "completedCount": 50,
    "cancelledCount": 5,
    "refundedCount": 5,
    "totalAmount": 990000,
    "totalPayAmount": 880000
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[OpenOrderStatisticsRespDTO](#schemaopenorderstatisticsrespdto)|false|none||返回数据|

<h2 id="tocS_OpenOrderRefundRespDTO">OpenOrderRefundRespDTO</h2>

<a id="schemaopenorderrefundrespdto"></a>
<a id="schema_OpenOrderRefundRespDTO"></a>
<a id="tocSopenorderrefundrespdto"></a>
<a id="tocsopenorderrefundrespdto"></a>

```json
{
  "id": 1,
  "orderId": 1,
  "merchantId": 1,
  "refundNo": "RF123456",
  "refundAmount": 5000,
  "reason": "客户要求退款",
  "status": 0,
  "auditTime": "string",
  "completeTime": "string",
  "auditRemark": "string",
  "createTime": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||退款ID|
|orderId|integer(int64)|false|none||订单ID|
|merchantId|integer(int64)|false|none||商户ID|
|refundNo|string|false|none||退款单号|
|refundAmount|integer|false|none||退款金额(分)|
|reason|string|false|none||退款原因|
|status|integer|false|none||退款状态：0-待处理 1-已通过 2-已拒绝 3-退款完成|
|auditTime|string|false|none||审核时间|
|completeTime|string|false|none||完成时间|
|auditRemark|string|false|none||审核备注|
|createTime|string|false|none||创建时间|

<h2 id="tocS_OpenApiAlipayAuthConfigRespVO">OpenApiAlipayAuthConfigRespVO</h2>

<a id="schemaopenapialipayauthconfigrespvo"></a>
<a id="schema_OpenApiAlipayAuthConfigRespVO"></a>
<a id="tocSopenapialipayauthconfigrespvo"></a>
<a id="tocsopenapialipayauthconfigrespvo"></a>

```json
{
  "alipayAppId": "2021001234567890"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|alipayAppId|string|false|none||支付宝应用APPID|

<h2 id="tocS_CommonResultOpenOrderRefundRespDTO">CommonResultOpenOrderRefundRespDTO</h2>

<a id="schemacommonresultopenorderrefundrespdto"></a>
<a id="schema_CommonResultOpenOrderRefundRespDTO"></a>
<a id="tocScommonresultopenorderrefundrespdto"></a>
<a id="tocscommonresultopenorderrefundrespdto"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "id": 1,
    "orderId": 1,
    "merchantId": 1,
    "refundNo": "RF123456",
    "refundAmount": 5000,
    "reason": "客户要求退款",
    "status": 0,
    "auditTime": "string",
    "completeTime": "string",
    "auditRemark": "string",
    "createTime": "string"
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[OpenOrderRefundRespDTO](#schemaopenorderrefundrespdto)|false|none||返回数据|

<h2 id="tocS_CommonResultOpenApiAlipayAuthConfigRespVO">CommonResultOpenApiAlipayAuthConfigRespVO</h2>

<a id="schemacommonresultopenapialipayauthconfigrespvo"></a>
<a id="schema_CommonResultOpenApiAlipayAuthConfigRespVO"></a>
<a id="tocScommonresultopenapialipayauthconfigrespvo"></a>
<a id="tocscommonresultopenapialipayauthconfigrespvo"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "alipayAppId": "2021001234567890"
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[OpenApiAlipayAuthConfigRespVO](#schemaopenapialipayauthconfigrespvo)|false|none||返回数据|

<h2 id="tocS_Item">Item</h2>

<a id="schemaitem"></a>
<a id="schema_Item"></a>
<a id="tocSitem"></a>
<a id="tocsitem"></a>

```json
{
  "itemType": 1,
  "itemId": 1,
  "itemName": "招牌奶茶",
  "itemCoverUrl": "string",
  "specValues": "string",
  "price": 9900,
  "quantity": 1
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|itemType|integer|true|none||商品类型：1-商品SPU 2-商品SKU 3-会员卡模板 4-抵金券|
|itemId|integer(int64)|true|none||关联ID|
|itemName|string|true|none||商品名称|
|itemCoverUrl|string|false|none||商品封面图|
|specValues|string|false|none||规格信息|
|price|integer|true|none||单价(分)|
|quantity|integer|true|none||数量|

<h2 id="tocS_OpenApiAlipayBindingRespVO">OpenApiAlipayBindingRespVO</h2>

<a id="schemaopenapialipaybindingrespvo"></a>
<a id="schema_OpenApiAlipayBindingRespVO"></a>
<a id="tocSopenapialipaybindingrespvo"></a>
<a id="tocsopenapialipaybindingrespvo"></a>

```json
{
  "bound": true,
  "alipayUserId": "2088****1234",
  "alipayAccount": "138****5678",
  "nickName": "支付宝用户",
  "avatar": "https://tfs.alipayobjects.com/xxx.jpg"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|bound|boolean|false|none||是否已绑定|
|alipayUserId|string|false|none||支付宝用户ID(脱敏)|
|alipayAccount|string|false|none||支付宝账号(脱敏)|
|nickName|string|false|none||昵称|
|avatar|string|false|none||头像|

<h2 id="tocS_OpenApiOrderCreateReqVO">OpenApiOrderCreateReqVO</h2>

<a id="schemaopenapiordercreatereqvo"></a>
<a id="schema_OpenApiOrderCreateReqVO"></a>
<a id="tocSopenapiordercreatereqvo"></a>
<a id="tocsopenapiordercreatereqvo"></a>

```json
{
  "merchantId": 1,
  "storeId": 1,
  "userId": 1,
  "externalUserId": "ext_user_001",
  "orderType": 1,
  "couponId": 1,
  "voucherIds": "string",
  "remark": "string",
  "items": [
    {
      "itemType": 1,
      "itemId": 1,
      "itemName": "招牌奶茶",
      "itemCoverUrl": "string",
      "specValues": "string",
      "price": 9900,
      "quantity": 1
    }
  ]
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|merchantId|integer(int64)|true|none||商户ID|
|storeId|integer(int64)|false|none||门店ID|
|userId|integer(int64)|false|none||App用户映射ID，传 externalUserId 时可不传|
|externalUserId|string|false|none||下游 App 用户标识，传 userId 时可不传|
|orderType|integer|true|none||订单类型：1-商品购买 2-会员卡办理 3-抵金券购买 4-分期还款|
|couponId|integer(int64)|false|none||使用的优惠券ID|
|voucherIds|string|false|none||使用的抵金券IDs(JSON数组)|
|remark|string|false|none||备注|
|items|[[Item](#schemaitem)]|true|none||订单明细列表|

<h2 id="tocS_CommonResultOpenApiAlipayBindingRespVO">CommonResultOpenApiAlipayBindingRespVO</h2>

<a id="schemacommonresultopenapialipaybindingrespvo"></a>
<a id="schema_CommonResultOpenApiAlipayBindingRespVO"></a>
<a id="tocScommonresultopenapialipaybindingrespvo"></a>
<a id="tocscommonresultopenapialipaybindingrespvo"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "bound": true,
    "alipayUserId": "2088****1234",
    "alipayAccount": "138****5678",
    "nickName": "支付宝用户",
    "avatar": "https://tfs.alipayobjects.com/xxx.jpg"
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[OpenApiAlipayBindingRespVO](#schemaopenapialipaybindingrespvo)|false|none||返回数据|

<h2 id="tocS_OpenApiOrderRefundReqVO">OpenApiOrderRefundReqVO</h2>

<a id="schemaopenapiorderrefundreqvo"></a>
<a id="schema_OpenApiOrderRefundReqVO"></a>
<a id="tocSopenapiorderrefundreqvo"></a>
<a id="tocsopenapiorderrefundreqvo"></a>

```json
{
  "refundAmount": 5000,
  "reason": "客户要求退款"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|refundAmount|integer|true|none||退款金额(分)|
|reason|string|true|none||退款原因|

<h2 id="tocS_OpenApiAlipayBindReqVO">OpenApiAlipayBindReqVO</h2>

<a id="schemaopenapialipaybindreqvo"></a>
<a id="schema_OpenApiAlipayBindReqVO"></a>
<a id="tocSopenapialipaybindreqvo"></a>
<a id="tocsopenapialipaybindreqvo"></a>

```json
{
  "externalUserId": "user_10001",
  "authCode": "1234567890abcdef"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|externalUserId|string|true|none||App端用户标识|
|authCode|string|true|none||支付宝授权码|

<h2 id="tocS_OpenApiOrderReviewReqVO">OpenApiOrderReviewReqVO</h2>

<a id="schemaopenapiorderreviewreqvo"></a>
<a id="schema_OpenApiOrderReviewReqVO"></a>
<a id="tocSopenapiorderreviewreqvo"></a>
<a id="tocsopenapiorderreviewreqvo"></a>

```json
{
  "content": "string",
  "rating": 5
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|content|string|true|none||评价内容|
|rating|integer|false|none||评分(1-5)|

<h2 id="tocS_OpenApiAlipayUnbindReqVO">OpenApiAlipayUnbindReqVO</h2>

<a id="schemaopenapialipayunbindreqvo"></a>
<a id="schema_OpenApiAlipayUnbindReqVO"></a>
<a id="tocSopenapialipayunbindreqvo"></a>
<a id="tocsopenapialipayunbindreqvo"></a>

```json
{
  "externalUserId": "user_10001"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|externalUserId|string|true|none||App端用户标识|

<h2 id="tocS_OpenOrderPayRespDTO">OpenOrderPayRespDTO</h2>

<a id="schemaopenorderpayrespdto"></a>
<a id="schema_OpenOrderPayRespDTO"></a>
<a id="tocSopenorderpayrespdto"></a>
<a id="tocsopenorderpayrespdto"></a>

```json
{
  "payOrderId": 1,
  "status": 0,
  "displayMode": "url",
  "displayContent": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|payOrderId|integer(int64)|false|none||支付订单ID|
|status|integer|false|none||支付状态|
|displayMode|string|false|none||展示模式|
|displayContent|string|false|none||展示内容（支付URL/二维码等）|

<h2 id="tocS_CommonResultOpenOrderPayRespDTO">CommonResultOpenOrderPayRespDTO</h2>

<a id="schemacommonresultopenorderpayrespdto"></a>
<a id="schema_CommonResultOpenOrderPayRespDTO"></a>
<a id="tocScommonresultopenorderpayrespdto"></a>
<a id="tocscommonresultopenorderpayrespdto"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "payOrderId": 1,
    "status": 0,
    "displayMode": "url",
    "displayContent": "string"
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[OpenOrderPayRespDTO](#schemaopenorderpayrespdto)|false|none||返回数据|

<h2 id="tocS_MapString">MapString</h2>

<a id="schemamapstring"></a>
<a id="schema_MapString"></a>
<a id="tocSmapstring"></a>
<a id="tocsmapstring"></a>

```json
{
  "key": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|key|string|false|none||none|

<h2 id="tocS_OpenApiOrderPayReqVO">OpenApiOrderPayReqVO</h2>

<a id="schemaopenapiorderpayreqvo"></a>
<a id="schema_OpenApiOrderPayReqVO"></a>
<a id="tocSopenapiorderpayreqvo"></a>
<a id="tocsopenapiorderpayreqvo"></a>

```json
{
  "channelCode": "wx_pub",
  "userIp": "127.0.0.1",
  "channelExtras": {
    "key": "string"
  },
  "returnUrl": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|channelCode|string|true|none||支付渠道编码|
|userIp|string|true|none||用户IP|
|channelExtras|[MapString](#schemamapstring)|false|none||支付渠道额外参数|
|returnUrl|string|false|none||回跳地址|

<h2 id="tocS_OpenApiOrderDeliveryStatusReqVO">OpenApiOrderDeliveryStatusReqVO</h2>

<a id="schemaopenapiorderdeliverystatusreqvo"></a>
<a id="schema_OpenApiOrderDeliveryStatusReqVO"></a>
<a id="tocSopenapiorderdeliverystatusreqvo"></a>
<a id="tocsopenapiorderdeliverystatusreqvo"></a>

```json
{
  "deliveryStatus": 1,
  "deliveryNo": "SF1234567890"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|deliveryStatus|integer|true|none||配送状态：0-待发货 1-已发货 2-配送中 3-已送达|
|deliveryNo|string|false|none||快递单号|

<h2 id="tocS_OpenApiOrderChangeBookingReqVO">OpenApiOrderChangeBookingReqVO</h2>

<a id="schemaopenapiorderchangebookingreqvo"></a>
<a id="schema_OpenApiOrderChangeBookingReqVO"></a>
<a id="tocSopenapiorderchangebookingreqvo"></a>
<a id="tocsopenapiorderchangebookingreqvo"></a>

```json
{
  "changeRemark": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|changeRemark|string|true|none||变更说明|

<h2 id="tocS_OpenApiCouponPurchaseCreateReqVO">OpenApiCouponPurchaseCreateReqVO</h2>

<a id="schemaopenapicouponpurchasecreatereqvo"></a>
<a id="schema_OpenApiCouponPurchaseCreateReqVO"></a>
<a id="tocSopenapicouponpurchasecreatereqvo"></a>
<a id="tocsopenapicouponpurchasecreatereqvo"></a>

```json
{
  "merchantId": 1,
  "templateId": 1,
  "externalUserId": "ext_user_001",
  "bizNo": "cp_order_001",
  "storeId": 1
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|merchantId|integer(int64)|true|none||商户ID|
|templateId|integer(int64)|true|none||优惠券模板ID|
|externalUserId|string|true|none||下游 App 用户标识，需先完成客户进件|
|bizNo|string|false|none||下游业务号，平台仅存储并在优惠券购买相关事件回调中原样透传|
|storeId|integer(int64)|false|none||门店ID，标记用户在哪个门店购买|

<h2 id="tocS_OpenCouponPurchaseDetailRespDTO">OpenCouponPurchaseDetailRespDTO</h2>

<a id="schemaopencouponpurchasedetailrespdto"></a>
<a id="schema_OpenCouponPurchaseDetailRespDTO"></a>
<a id="tocSopencouponpurchasedetailrespdto"></a>
<a id="tocsopencouponpurchasedetailrespdto"></a>

```json
{
  "purchaseId": 1,
  "payableAmount": 1000,
  "status": 0,
  "statusName": "待支付",
  "nextAction": "PAY",
  "payOrderId": 10001,
  "couponId": 1,
  "storeId": 1
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|purchaseId|integer(int64)|false|none||购买单ID|
|payableAmount|integer|false|none||应支付金额（分）|
|status|integer|false|none||购买单状态|
|statusName|string|false|none||购买单状态名称|
|nextAction|string|false|none||下一步动作：PAY/NONE|
|payOrderId|integer(int64)|false|none||支付单ID|
|couponId|integer(int64)|false|none||优惠券ID|
|storeId|integer(int64)|false|none||门店ID，标记用户在哪个门店购买|

<h2 id="tocS_CommonResultOpenCouponPurchaseDetailRespDTO">CommonResultOpenCouponPurchaseDetailRespDTO</h2>

<a id="schemacommonresultopencouponpurchasedetailrespdto"></a>
<a id="schema_CommonResultOpenCouponPurchaseDetailRespDTO"></a>
<a id="tocScommonresultopencouponpurchasedetailrespdto"></a>
<a id="tocscommonresultopencouponpurchasedetailrespdto"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "purchaseId": 1,
    "payableAmount": 1000,
    "status": 0,
    "statusName": "待支付",
    "nextAction": "PAY",
    "payOrderId": 10001,
    "couponId": 1,
    "storeId": 1
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[OpenCouponPurchaseDetailRespDTO](#schemaopencouponpurchasedetailrespdto)|false|none||返回数据|

<h2 id="tocS_OpenCouponPurchaseCashierRespDTO">OpenCouponPurchaseCashierRespDTO</h2>

<a id="schemaopencouponpurchasecashierrespdto"></a>
<a id="schema_OpenCouponPurchaseCashierRespDTO"></a>
<a id="tocSopencouponpurchasecashierrespdto"></a>
<a id="tocsopencouponpurchasecashierrespdto"></a>

```json
{
  "tradeNo": "10001",
  "cashierUrl": "https://pay.platform.com/cashier.html?token=xxx"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|tradeNo|string|false|none||平台交易号|
|cashierUrl|string|false|none||收银台页面URL|

<h2 id="tocS_CommonResultOpenCouponPurchaseCashierRespDTO">CommonResultOpenCouponPurchaseCashierRespDTO</h2>

<a id="schemacommonresultopencouponpurchasecashierrespdto"></a>
<a id="schema_CommonResultOpenCouponPurchaseCashierRespDTO"></a>
<a id="tocScommonresultopencouponpurchasecashierrespdto"></a>
<a id="tocscommonresultopencouponpurchasecashierrespdto"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "tradeNo": "10001",
    "cashierUrl": "https://pay.platform.com/cashier.html?token=xxx"
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[OpenCouponPurchaseCashierRespDTO](#schemaopencouponpurchasecashierrespdto)|false|none||返回数据|

<h2 id="tocS_OpenApiCouponPurchaseCashierReqVO">OpenApiCouponPurchaseCashierReqVO</h2>

<a id="schemaopenapicouponpurchasecashierreqvo"></a>
<a id="schema_OpenApiCouponPurchaseCashierReqVO"></a>
<a id="tocSopenapicouponpurchasecashierreqvo"></a>
<a id="tocsopenapicouponpurchasecashierreqvo"></a>

```json
{
  "returnUrl": "https://app.example.com/result",
  "expireMinutes": 30
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|returnUrl|string|false|none||支付完成回跳地址|
|expireMinutes|integer|false|none||过期时间（分钟）|

<h2 id="tocS_OpenApiCouponAcquireRespVO">OpenApiCouponAcquireRespVO</h2>

<a id="schemaopenapicouponacquirerespvo"></a>
<a id="schema_OpenApiCouponAcquireRespVO"></a>
<a id="tocSopenapicouponacquirerespvo"></a>
<a id="tocsopenapicouponacquirerespvo"></a>

```json
{
  "resultType": "COUPON",
  "id": 1
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|resultType|string|false|none||结果类型：COUPON-已直接发券；PURCHASE-已创建购买单|
|id|integer(int64)|false|none||结果ID：resultType=COUPON 时为优惠券ID；resultType=PURCHASE 时为购买单ID|

<h2 id="tocS_CommonResultOpenApiCouponAcquireRespVO">CommonResultOpenApiCouponAcquireRespVO</h2>

<a id="schemacommonresultopenapicouponacquirerespvo"></a>
<a id="schema_CommonResultOpenApiCouponAcquireRespVO"></a>
<a id="tocScommonresultopenapicouponacquirerespvo"></a>
<a id="tocscommonresultopenapicouponacquirerespvo"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "resultType": "COUPON",
    "id": 1
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[OpenApiCouponAcquireRespVO](#schemaopenapicouponacquirerespvo)|false|none||返回数据|

<h2 id="tocS_OpenApiCouponPurchaseRefundReqVO">OpenApiCouponPurchaseRefundReqVO</h2>

<a id="schemaopenapicouponpurchaserefundreqvo"></a>
<a id="schema_OpenApiCouponPurchaseRefundReqVO"></a>
<a id="tocSopenapicouponpurchaserefundreqvo"></a>
<a id="tocsopenapicouponpurchaserefundreqvo"></a>

```json
{
  "purchaseId": 1,
  "appUserId": 1,
  "externalUserId": "ext_user_001"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|purchaseId|integer(int64)|true|none||购买单ID|
|appUserId|integer(int64)|false|none||App用户映射ID，传 externalUserId 时可不传|
|externalUserId|string|false|none||下游 App 用户标识，传 appUserId 时可不传|

<h2 id="tocS_OpenApiMemberRespVO">OpenApiMemberRespVO</h2>

<a id="schemaopenapimemberrespvo"></a>
<a id="schema_OpenApiMemberRespVO"></a>
<a id="tocSopenapimemberrespvo"></a>
<a id="tocsopenapimemberrespvo"></a>

```json
{
  "id": 0,
  "merchantId": 0,
  "merchantName": "string",
  "merchantLogo": "string",
  "balance": 0,
  "rewardBalance": 0,
  "totalBalance": 0,
  "totalRecharge": 0,
  "totalConsume": 0,
  "totalReward": 0,
  "status": 0,
  "joinTime": "string",
  "externalUserId": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||会员ID|
|merchantId|integer(int64)|false|none||商户ID|
|merchantName|string|false|none||商户名称|
|merchantLogo|string|false|none||商户Logo URL|
|balance|integer|false|none||充值余额(分)|
|rewardBalance|integer|false|none||奖励余额(分)|
|totalBalance|integer|false|none||总可用余额(分) = 充值余额 + 奖励余额|
|totalRecharge|integer|false|none||累计充值(分)|
|totalConsume|integer|false|none||累计消费(分)|
|totalReward|integer|false|none||累计奖励(分)|
|status|integer|false|none||会员状态：0-正常 1-冻结|
|joinTime|string|false|none||加入时间|
|externalUserId|string|false|none||外部用户标识|

<h2 id="tocS_CommonResultOpenApiMemberRespVO">CommonResultOpenApiMemberRespVO</h2>

<a id="schemacommonresultopenapimemberrespvo"></a>
<a id="schema_CommonResultOpenApiMemberRespVO"></a>
<a id="tocScommonresultopenapimemberrespvo"></a>
<a id="tocscommonresultopenapimemberrespvo"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "id": 0,
    "merchantId": 0,
    "merchantName": "string",
    "merchantLogo": "string",
    "balance": 0,
    "rewardBalance": 0,
    "totalBalance": 0,
    "totalRecharge": 0,
    "totalConsume": 0,
    "totalReward": 0,
    "status": 0,
    "joinTime": "string",
    "externalUserId": "string"
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[OpenApiMemberRespVO](#schemaopenapimemberrespvo)|false|none||返回数据|

<h2 id="tocS_OpenApiMemberJoinReqVO">OpenApiMemberJoinReqVO</h2>

<a id="schemaopenapimemberjoinreqvo"></a>
<a id="schema_OpenApiMemberJoinReqVO"></a>
<a id="tocSopenapimemberjoinreqvo"></a>
<a id="tocsopenapimemberjoinreqvo"></a>

```json
{
  "merchantId": 1,
  "externalUserId": "user_123",
  "storeId": 10
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|merchantId|integer(int64)|true|none||商户ID|
|externalUserId|string|true|none||外部用户标识（下游App用户唯一标识）|
|storeId|integer(int64)|false|none||办理门店ID（可选，记录在哪个门店办的会员）|

<h2 id="tocS_DaySchedule">DaySchedule</h2>

<a id="schemadayschedule"></a>
<a id="schema_DaySchedule"></a>
<a id="tocSdayschedule"></a>
<a id="tocsdayschedule"></a>

```json
{
  "dayOfWeek": 1,
  "isOpen": 1,
  "timeSlots": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|dayOfWeek|integer|false|none||星期几：1-周一 ... 7-周日|
|isOpen|integer|false|none||当天是否营业：0-否 1-是|
|timeSlots|string|false|none||营业时间段(JSON数组，如[{"start":"09:00","end":"22:00"}])|

<h2 id="tocS_OpenApiMemberWithMerchantRespVO">OpenApiMemberWithMerchantRespVO</h2>

<a id="schemaopenapimemberwithmerchantrespvo"></a>
<a id="schema_OpenApiMemberWithMerchantRespVO"></a>
<a id="tocSopenapimemberwithmerchantrespvo"></a>
<a id="tocsopenapimemberwithmerchantrespvo"></a>

```json
{
  "id": 0,
  "merchantId": 0,
  "merchantName": "string",
  "merchantLogo": "string",
  "balance": 0,
  "rewardBalance": 0,
  "totalBalance": 0,
  "totalRecharge": 0,
  "totalConsume": 0,
  "totalReward": 0,
  "status": 0,
  "joinTime": "string",
  "externalUserId": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||会员ID|
|merchantId|integer(int64)|false|none||商户ID|
|merchantName|string|false|none||商户名称|
|merchantLogo|string|false|none||商户Logo URL|
|balance|integer|false|none||充值余额(分)|
|rewardBalance|integer|false|none||奖励余额(分)|
|totalBalance|integer|false|none||总可用余额(分) = 充值余额 + 奖励余额|
|totalRecharge|integer|false|none||累计充值(分)|
|totalConsume|integer|false|none||累计消费(分)|
|totalReward|integer|false|none||累计奖励(分)|
|status|integer|false|none||会员状态：0-正常 1-冻结|
|joinTime|string|false|none||加入时间|
|externalUserId|string|false|none||外部用户标识|

<h2 id="tocS_PageResultOpenApiMemberWithMerchantRespVO">PageResultOpenApiMemberWithMerchantRespVO</h2>

<a id="schemapageresultopenapimemberwithmerchantrespvo"></a>
<a id="schema_PageResultOpenApiMemberWithMerchantRespVO"></a>
<a id="tocSpageresultopenapimemberwithmerchantrespvo"></a>
<a id="tocspageresultopenapimemberwithmerchantrespvo"></a>

```json
{
  "total": 0,
  "list": [
    {
      "id": 0,
      "merchantId": 0,
      "merchantName": "string",
      "merchantLogo": "string",
      "balance": 0,
      "rewardBalance": 0,
      "totalBalance": 0,
      "totalRecharge": 0,
      "totalConsume": 0,
      "totalReward": 0,
      "status": 0,
      "joinTime": "string",
      "externalUserId": "string"
    }
  ]
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|total|integer(int64)|false|none||总量|
|list|[[OpenApiMemberWithMerchantRespVO](#schemaopenapimemberwithmerchantrespvo)]|false|none||数据|

<h2 id="tocS_CommonResultPageResultOpenApiMemberWithMerchantRespVO">CommonResultPageResultOpenApiMemberWithMerchantRespVO</h2>

<a id="schemacommonresultpageresultopenapimemberwithmerchantrespvo"></a>
<a id="schema_CommonResultPageResultOpenApiMemberWithMerchantRespVO"></a>
<a id="tocScommonresultpageresultopenapimemberwithmerchantrespvo"></a>
<a id="tocscommonresultpageresultopenapimemberwithmerchantrespvo"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "total": 0,
    "list": [
      {
        "id": 0,
        "merchantId": 0,
        "merchantName": "string",
        "merchantLogo": "string",
        "balance": 0,
        "rewardBalance": 0,
        "totalBalance": 0,
        "totalRecharge": 0,
        "totalConsume": 0,
        "totalReward": 0,
        "status": 0,
        "joinTime": "string",
        "externalUserId": "string"
      }
    ]
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[PageResultOpenApiMemberWithMerchantRespVO](#schemapageresultopenapimemberwithmerchantrespvo)|false|none||返回数据|

<h2 id="tocS_OpenApiMemberRechargeRespVO">OpenApiMemberRechargeRespVO</h2>

<a id="schemaopenapimemberrechargerespvo"></a>
<a id="schema_OpenApiMemberRechargeRespVO"></a>
<a id="tocSopenapimemberrechargerespvo"></a>
<a id="tocsopenapimemberrechargerespvo"></a>

```json
{
  "id": 0,
  "rechargeNo": "string",
  "memberId": 0,
  "amount": 0,
  "status": 0,
  "payTime": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||充值单ID|
|rechargeNo|string|false|none||充值单号|
|memberId|integer(int64)|false|none||会员ID|
|amount|integer|false|none||充值金额(分)|
|status|integer|false|none||充值状态：0-待支付 1-已支付 2-已取消|
|payTime|string|false|none||支付时间|

<h2 id="tocS_CommonResultOpenApiMemberRechargeRespVO">CommonResultOpenApiMemberRechargeRespVO</h2>

<a id="schemacommonresultopenapimemberrechargerespvo"></a>
<a id="schema_CommonResultOpenApiMemberRechargeRespVO"></a>
<a id="tocScommonresultopenapimemberrechargerespvo"></a>
<a id="tocscommonresultopenapimemberrechargerespvo"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "id": 0,
    "rechargeNo": "string",
    "memberId": 0,
    "amount": 0,
    "status": 0,
    "payTime": "string"
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[OpenApiMemberRechargeRespVO](#schemaopenapimemberrechargerespvo)|false|none||返回数据|

<h2 id="tocS_OpenApiMemberRechargeReqVO">OpenApiMemberRechargeReqVO</h2>

<a id="schemaopenapimemberrechargereqvo"></a>
<a id="schema_OpenApiMemberRechargeReqVO"></a>
<a id="tocSopenapimemberrechargereqvo"></a>
<a id="tocsopenapimemberrechargereqvo"></a>

```json
{
  "memberId": 1,
  "merchantId": 1,
  "amount": 1000
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|memberId|integer(int64)|true|none||会员ID|
|merchantId|integer(int64)|true|none||商户ID|
|amount|integer|true|none||充值金额(分)|

<h2 id="tocS_OpenApiMemberRechargeCashierRespVO">OpenApiMemberRechargeCashierRespVO</h2>

<a id="schemaopenapimemberrechargecashierrespvo"></a>
<a id="schema_OpenApiMemberRechargeCashierRespVO"></a>
<a id="tocSopenapimemberrechargecashierrespvo"></a>
<a id="tocsopenapimemberrechargecashierrespvo"></a>

```json
{
  "token": "string",
  "cashierUrl": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|token|string|false|none||收银台令牌|
|cashierUrl|string|false|none||收银台页面URL|

<h2 id="tocS_CommonResultOpenApiMemberRechargeCashierRespVO">CommonResultOpenApiMemberRechargeCashierRespVO</h2>

<a id="schemacommonresultopenapimemberrechargecashierrespvo"></a>
<a id="schema_CommonResultOpenApiMemberRechargeCashierRespVO"></a>
<a id="tocScommonresultopenapimemberrechargecashierrespvo"></a>
<a id="tocscommonresultopenapimemberrechargecashierrespvo"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "token": "string",
    "cashierUrl": "string"
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[OpenApiMemberRechargeCashierRespVO](#schemaopenapimemberrechargecashierrespvo)|false|none||返回数据|

<h2 id="tocS_OpenApiMemberRechargeCashierReqVO">OpenApiMemberRechargeCashierReqVO</h2>

<a id="schemaopenapimemberrechargecashierreqvo"></a>
<a id="schema_OpenApiMemberRechargeCashierReqVO"></a>
<a id="tocSopenapimemberrechargecashierreqvo"></a>
<a id="tocsopenapimemberrechargecashierreqvo"></a>

```json
{
  "returnUrl": "https://app.example.com/recharge/result",
  "expireMinutes": 30
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|returnUrl|string|false|none||支付完成后的回跳地址|
|expireMinutes|integer|false|none||收银台过期时间（分钟），默认30分钟，最长120分钟|

<h2 id="tocS_OpenApiMemberTransactionRespVO">OpenApiMemberTransactionRespVO</h2>

<a id="schemaopenapimembertransactionrespvo"></a>
<a id="schema_OpenApiMemberTransactionRespVO"></a>
<a id="tocSopenapimembertransactionrespvo"></a>
<a id="tocsopenapimembertransactionrespvo"></a>

```json
{
  "id": 1,
  "memberId": 100,
  "transactionNo": "MT1234567890ABCDEF",
  "transactionType": 1,
  "amount": 1000,
  "balanceAfter": 5000,
  "rewardBalanceAfter": 500,
  "balanceType": 1,
  "bizType": 1,
  "remark": "会员充值",
  "createTime": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||流水ID|
|memberId|integer(int64)|false|none||会员ID|
|transactionNo|string|false|none||流水号|
|transactionType|integer|false|none||交易类型：1-充值 2-消费 3-退款 4-奖励 5-赠送|
|amount|integer|false|none||变动金额(分)|
|balanceAfter|integer|false|none||变动后可用余额(分)|
|rewardBalanceAfter|integer|false|none||变动后奖励余额(分)|
|balanceType|integer|false|none||余额类型：1-充值余额 2-奖励余额|
|bizType|integer|false|none||业务类型|
|remark|string|false|none||备注|
|createTime|string|false|none||创建时间|

<h2 id="tocS_PageResultOpenApiMemberTransactionRespVO">PageResultOpenApiMemberTransactionRespVO</h2>

<a id="schemapageresultopenapimembertransactionrespvo"></a>
<a id="schema_PageResultOpenApiMemberTransactionRespVO"></a>
<a id="tocSpageresultopenapimembertransactionrespvo"></a>
<a id="tocspageresultopenapimembertransactionrespvo"></a>

```json
{
  "total": 0,
  "list": [
    {
      "id": 1,
      "memberId": 100,
      "transactionNo": "MT1234567890ABCDEF",
      "transactionType": 1,
      "amount": 1000,
      "balanceAfter": 5000,
      "rewardBalanceAfter": 500,
      "balanceType": 1,
      "bizType": 1,
      "remark": "会员充值",
      "createTime": "string"
    }
  ]
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|total|integer(int64)|false|none||总量|
|list|[[OpenApiMemberTransactionRespVO](#schemaopenapimembertransactionrespvo)]|false|none||数据|

<h2 id="tocS_CommonResultPageResultOpenApiMemberTransactionRespVO">CommonResultPageResultOpenApiMemberTransactionRespVO</h2>

<a id="schemacommonresultpageresultopenapimembertransactionrespvo"></a>
<a id="schema_CommonResultPageResultOpenApiMemberTransactionRespVO"></a>
<a id="tocScommonresultpageresultopenapimembertransactionrespvo"></a>
<a id="tocscommonresultpageresultopenapimembertransactionrespvo"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "total": 0,
    "list": [
      {
        "id": 1,
        "memberId": 100,
        "transactionNo": "MT1234567890ABCDEF",
        "transactionType": 1,
        "amount": 1000,
        "balanceAfter": 5000,
        "rewardBalanceAfter": 500,
        "balanceType": 1,
        "bizType": 1,
        "remark": "会员充值",
        "createTime": "string"
      }
    ]
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[PageResultOpenApiMemberTransactionRespVO](#schemapageresultopenapimembertransactionrespvo)|false|none||返回数据|

<h2 id="tocS_OpenApiMemberWriteOffQrRespVO">OpenApiMemberWriteOffQrRespVO</h2>

<a id="schemaopenapimemberwriteoffqrrespvo"></a>
<a id="schema_OpenApiMemberWriteOffQrRespVO"></a>
<a id="tocSopenapimemberwriteoffqrrespvo"></a>
<a id="tocsopenapimemberwriteoffqrrespvo"></a>

```json
{
  "requestNo": "string",
  "qrToken": "string",
  "qrExpireTime": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|requestNo|string|false|none||核销请求号|
|qrToken|string|false|none||二维码令牌|
|qrExpireTime|string|false|none||二维码过期时间|

<h2 id="tocS_CommonResultOpenApiMemberWriteOffQrRespVO">CommonResultOpenApiMemberWriteOffQrRespVO</h2>

<a id="schemacommonresultopenapimemberwriteoffqrrespvo"></a>
<a id="schema_CommonResultOpenApiMemberWriteOffQrRespVO"></a>
<a id="tocScommonresultopenapimemberwriteoffqrrespvo"></a>
<a id="tocscommonresultopenapimemberwriteoffqrrespvo"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "requestNo": "string",
    "qrToken": "string",
    "qrExpireTime": "string"
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[OpenApiMemberWriteOffQrRespVO](#schemaopenapimemberwriteoffqrrespvo)|false|none||返回数据|

<h2 id="tocS_OpenApiMemberWriteOffRecordRespVO">OpenApiMemberWriteOffRecordRespVO</h2>

<a id="schemaopenapimemberwriteoffrecordrespvo"></a>
<a id="schema_OpenApiMemberWriteOffRecordRespVO"></a>
<a id="tocSopenapimemberwriteoffrecordrespvo"></a>
<a id="tocsopenapimemberwriteoffrecordrespvo"></a>

```json
{
  "requestNo": "string",
  "merchantId": 0,
  "storeId": 0,
  "status": 0,
  "amount": 0,
  "shortfallAmount": 0,
  "memberId": 0,
  "completeTime": "string",
  "callbackStatus": 0
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|requestNo|string|false|none||核销请求号|
|merchantId|integer(int64)|false|none||商户ID|
|storeId|integer(int64)|false|none||门店ID|
|status|integer|false|none||核销状态：0-待扫码 1-待确认 2-已完成 3-已取消 4-已过期 5-待支付差价|
|amount|integer|false|none||核销金额(分)|
|shortfallAmount|integer|false|none||差价金额(分)，状态为5(待支付差价)时返回，下游App需按此金额创建充值单|
|memberId|integer(int64)|false|none||会员ID|
|completeTime|string|false|none||完成时间|
|callbackStatus|integer|false|none||回调状态|

<h2 id="tocS_CommonResultOpenApiMemberWriteOffRecordRespVO">CommonResultOpenApiMemberWriteOffRecordRespVO</h2>

<a id="schemacommonresultopenapimemberwriteoffrecordrespvo"></a>
<a id="schema_CommonResultOpenApiMemberWriteOffRecordRespVO"></a>
<a id="tocScommonresultopenapimemberwriteoffrecordrespvo"></a>
<a id="tocscommonresultopenapimemberwriteoffrecordrespvo"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "requestNo": "string",
    "merchantId": 0,
    "storeId": 0,
    "status": 0,
    "amount": 0,
    "shortfallAmount": 0,
    "memberId": 0,
    "completeTime": "string",
    "callbackStatus": 0
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[OpenApiMemberWriteOffRecordRespVO](#schemaopenapimemberwriteoffrecordrespvo)|false|none||返回数据|

<h2 id="tocS_OpenApiMemberWriteOffConfirmReqVO">OpenApiMemberWriteOffConfirmReqVO</h2>

<a id="schemaopenapimemberwriteoffconfirmreqvo"></a>
<a id="schema_OpenApiMemberWriteOffConfirmReqVO"></a>
<a id="tocSopenapimemberwriteoffconfirmreqvo"></a>
<a id="tocsopenapimemberwriteoffconfirmreqvo"></a>

```json
{
  "approved": true,
  "remark": "同意扣款"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|approved|boolean|true|none||是否同意核销：true=同意，false=拒绝|
|remark|string|false|none||备注|

<h2 id="tocS_RiskModelProductRespDTO">RiskModelProductRespDTO</h2>

<a id="schemariskmodelproductrespdto"></a>
<a id="schema_RiskModelProductRespDTO"></a>
<a id="tocSriskmodelproductrespdto"></a>
<a id="tocsriskmodelproductrespdto"></a>

```json
{
  "id": 0,
  "productCode": "string",
  "name": "string",
  "description": "string",
  "coverUrl": "string",
  "flowId": "string",
  "callPrice": 0,
  "outputDesc": "string",
  "applicableScenes": "string",
  "publishedCompileVersion": 0,
  "published": true
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||产品ID|
|productCode|string|false|none||产品编码（唯一）|
|name|string|false|none||产品名称|
|description|string|false|none||产品描述|
|coverUrl|string|false|none||封面图|
|flowId|string|false|none||关联流程ID|
|callPrice|integer|false|none||单次调用价格(分)，0=免费|
|outputDesc|string|false|none||输出说明(JSON)：描述模型输出的字段含义|
|applicableScenes|string|false|none||适用场景(JSON数组)：["credit_review","loan_review"]|
|publishedCompileVersion|integer|false|none||当前已发布版本号|
|published|boolean|false|none||是否已发布可调用|

<h2 id="tocS_CommonResultListRiskModelProductRespDTO">CommonResultListRiskModelProductRespDTO</h2>

<a id="schemacommonresultlistriskmodelproductrespdto"></a>
<a id="schema_CommonResultListRiskModelProductRespDTO"></a>
<a id="tocScommonresultlistriskmodelproductrespdto"></a>
<a id="tocscommonresultlistriskmodelproductrespdto"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": [
    {
      "id": 0,
      "productCode": "string",
      "name": "string",
      "description": "string",
      "coverUrl": "string",
      "flowId": "string",
      "callPrice": 0,
      "outputDesc": "string",
      "applicableScenes": "string",
      "publishedCompileVersion": 0,
      "published": true
    }
  ]
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[[RiskModelProductRespDTO](#schemariskmodelproductrespdto)]|false|none||返回数据|

<h2 id="tocS_key1">key1</h2>

<a id="schemakey1"></a>
<a id="schema_key1"></a>
<a id="tocSkey1"></a>
<a id="tocskey1"></a>

```json
{}

```

### 属性

*None*

<h2 id="tocS_RiskModelProductExecuteRespDTO">RiskModelProductExecuteRespDTO</h2>

<a id="schemariskmodelproductexecuterespdto"></a>
<a id="schema_RiskModelProductExecuteRespDTO"></a>
<a id="tocSriskmodelproductexecuterespdto"></a>
<a id="tocsriskmodelproductexecuterespdto"></a>

```json
{
  "executionId": "string",
  "compileVersion": 0,
  "score": 0,
  "specialResult": 0,
  "output": {
    "key": {}
  },
  "cost": 0,
  "duration": 0,
  "success": true,
  "errorMessage": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|executionId|string|false|none||执行ID（对应 risk_execution.execution_id）|
|compileVersion|integer|false|none||命中的编译版本号|
|score|integer|false|none||风控评分|
|specialResult|integer|false|none||特殊结果：null-无 1-直接通过 2-直接拒绝|
|output|[MapObject](#schemamapobject)|false|none||详细输出结果|
|cost|integer|false|none||本次调用费用(分)|
|duration|integer|false|none||执行耗时(ms)|
|success|boolean|false|none||是否执行成功|
|errorMessage|string|false|none||失败原因（success=false时）|

<h2 id="tocS_CommonResultRiskModelProductExecuteRespDTO">CommonResultRiskModelProductExecuteRespDTO</h2>

<a id="schemacommonresultriskmodelproductexecuterespdto"></a>
<a id="schema_CommonResultRiskModelProductExecuteRespDTO"></a>
<a id="tocScommonresultriskmodelproductexecuterespdto"></a>
<a id="tocscommonresultriskmodelproductexecuterespdto"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "executionId": "string",
    "compileVersion": 0,
    "score": 0,
    "specialResult": 0,
    "output": {
      "key": {}
    },
    "cost": 0,
    "duration": 0,
    "success": true,
    "errorMessage": "string"
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[RiskModelProductExecuteRespDTO](#schemariskmodelproductexecuterespdto)|false|none||返回数据|

<h2 id="tocS_key3">key3</h2>

<a id="schemakey3"></a>
<a id="schema_key3"></a>
<a id="tocSkey3"></a>
<a id="tocskey3"></a>

```json
{}

```

### 属性

*None*

<h2 id="tocS_DeveloperSaveReqVO">DeveloperSaveReqVO</h2>

<a id="schemadevelopersavereqvo"></a>
<a id="schema_DeveloperSaveReqVO"></a>
<a id="tocSdevelopersavereqvo"></a>
<a id="tocsdevelopersavereqvo"></a>

```json
{
  "id": 25357,
  "phone": "string",
  "developerName": "沐沐",
  "developerType": 1,
  "contactEmail": "string",
  "avatarUrl": "https://top.morplcp.cn",
  "authStatus": 1,
  "authLevel": 0,
  "maxAppCount": 17945,
  "status": 1,
  "lastLoginTime": "string",
  "lastLoginIp": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||开发者ID|
|phone|string|true|none||手机号(登录账号)|
|developerName|string|true|none||开发者名称(个人姓名/企业名称)|
|developerType|integer|true|none||开发者类型：0-个人 1-企业|
|contactEmail|string|false|none||联系邮箱|
|avatarUrl|string|false|none||头像|
|authStatus|integer|true|none||认证状态：0-未认证 1-认证中 2-已认证 3-认证失败|
|authLevel|integer|true|none||认证等级：0-未认证 1-个人认证(L1) 2-企业认证(L2)|
|maxAppCount|integer|true|none||最大可创建App数量|
|status|integer|true|none||状态：0-正常 1-冻结 2-注销|
|lastLoginTime|string|false|none||最后登录时间|
|lastLoginIp|string|false|none||最后登录IP|

<h2 id="tocS_OpenApiRiskModelExecuteReqVO">OpenApiRiskModelExecuteReqVO</h2>

<a id="schemaopenapiriskmodelexecutereqvo"></a>
<a id="schema_OpenApiRiskModelExecuteReqVO"></a>
<a id="tocSopenapiriskmodelexecutereqvo"></a>
<a id="tocsopenapiriskmodelexecutereqvo"></a>

```json
{
  "merchantId": 1,
  "appUserId": 1001,
  "externalUserId": "user_001",
  "creditAmount": 50000,
  "input": {
    "key": {}
  },
  "timeout": 5000
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|merchantId|integer(int64)|true|none||合作商户ID|
|appUserId|integer(int64)|false|none||开放平台用户ID|
|externalUserId|string|false|none||外部用户标识，与 appUserId 二选一|
|creditAmount|integer|false|none||赊账金额(分)|
|input|[MapObject](#schemamapobject)|false|none||额外输入参数|
|timeout|integer(int64)|false|none||超时时间（毫秒），默认 5000|

<h2 id="tocS_DeveloperRespVO">DeveloperRespVO</h2>

<a id="schemadeveloperrespvo"></a>
<a id="schema_DeveloperRespVO"></a>
<a id="tocSdeveloperrespvo"></a>
<a id="tocsdeveloperrespvo"></a>

```json
{
  "id": 25357,
  "phone": "string",
  "developerName": "沐沐",
  "developerType": 1,
  "contactEmail": "string",
  "avatarUrl": "https://top.morplcp.cn",
  "authStatus": 1,
  "authLevel": 0,
  "maxAppCount": 17945,
  "status": 1,
  "lastLoginTime": "string",
  "lastLoginIp": "string",
  "createTime": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||开发者ID|
|phone|string|false|none||手机号(登录账号)|
|developerName|string|false|none||开发者名称(个人姓名/企业名称)|
|developerType|integer|false|none||开发者类型：0-个人 1-企业|
|contactEmail|string|false|none||联系邮箱|
|avatarUrl|string|false|none||头像|
|authStatus|integer|false|none||认证状态：0-未认证 1-认证中 2-已认证 3-认证失败|
|authLevel|integer|false|none||认证等级：0-未认证 1-个人认证(L1) 2-企业认证(L2)|
|maxAppCount|integer|false|none||最大可创建App数量|
|status|integer|false|none||状态：0-正常 1-冻结 2-注销|
|lastLoginTime|string|false|none||最后登录时间|
|lastLoginIp|string|false|none||最后登录IP|
|createTime|string|false|none||创建时间|

<h2 id="tocS_CommonResultDeveloperRespVO">CommonResultDeveloperRespVO</h2>

<a id="schemacommonresultdeveloperrespvo"></a>
<a id="schema_CommonResultDeveloperRespVO"></a>
<a id="tocScommonresultdeveloperrespvo"></a>
<a id="tocscommonresultdeveloperrespvo"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "id": 25357,
    "phone": "string",
    "developerName": "沐沐",
    "developerType": 1,
    "contactEmail": "string",
    "avatarUrl": "https://top.morplcp.cn",
    "authStatus": 1,
    "authLevel": 0,
    "maxAppCount": 17945,
    "status": 1,
    "lastLoginTime": "string",
    "lastLoginIp": "string",
    "createTime": "string"
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[DeveloperRespVO](#schemadeveloperrespvo)|false|none||返回数据|

<h2 id="tocS_PageResultDeveloperRespVO">PageResultDeveloperRespVO</h2>

<a id="schemapageresultdeveloperrespvo"></a>
<a id="schema_PageResultDeveloperRespVO"></a>
<a id="tocSpageresultdeveloperrespvo"></a>
<a id="tocspageresultdeveloperrespvo"></a>

```json
{
  "total": 0,
  "list": [
    {
      "id": 25357,
      "phone": "string",
      "developerName": "沐沐",
      "developerType": 1,
      "contactEmail": "string",
      "avatarUrl": "https://top.morplcp.cn",
      "authStatus": 1,
      "authLevel": 0,
      "maxAppCount": 17945,
      "status": 1,
      "lastLoginTime": "string",
      "lastLoginIp": "string",
      "createTime": "string"
    }
  ]
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|total|integer(int64)|false|none||总量|
|list|[[DeveloperRespVO](#schemadeveloperrespvo)]|false|none||数据|

<h2 id="tocS_CommonResultPageResultDeveloperRespVO">CommonResultPageResultDeveloperRespVO</h2>

<a id="schemacommonresultpageresultdeveloperrespvo"></a>
<a id="schema_CommonResultPageResultDeveloperRespVO"></a>
<a id="tocScommonresultpageresultdeveloperrespvo"></a>
<a id="tocscommonresultpageresultdeveloperrespvo"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "total": 0,
    "list": [
      {
        "id": 25357,
        "phone": "string",
        "developerName": "沐沐",
        "developerType": 1,
        "contactEmail": "string",
        "avatarUrl": "https://top.morplcp.cn",
        "authStatus": 1,
        "authLevel": 0,
        "maxAppCount": 17945,
        "status": 1,
        "lastLoginTime": "string",
        "lastLoginIp": "string",
        "createTime": "string"
      }
    ]
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[PageResultDeveloperRespVO](#schemapageresultdeveloperrespvo)|false|none||返回数据|

<h2 id="tocS_AppSaveReqVO">AppSaveReqVO</h2>

<a id="schemaappsavereqvo"></a>
<a id="schema_AppSaveReqVO"></a>
<a id="tocSappsavereqvo"></a>
<a id="tocsappsavereqvo"></a>

```json
{
  "id": 21955,
  "developerId": 4789,
  "appName": "李四",
  "appType": 1,
  "appDesc": "string",
  "appLogo": "string",
  "appKey": "string",
  "appSecret": "string",
  "contactName": "李四",
  "contactPhone": "string",
  "callbackUrl": "https://top.morplcp.cn",
  "callbackSecret": "string",
  "ipWhitelist": "string",
  "rateLimitQps": 0,
  "environment": 0,
  "status": 2
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||应用ID|
|developerId|integer(int64)|true|none||所属开发者ID|
|appName|string|true|none||应用名称|
|appType|integer|true|none||应用类型：0-生活服务 1-电商 2-社交 3-工具 4-其他|
|appDesc|string|false|none||应用简介|
|appLogo|string|false|none||应用Logo|
|appKey|string|true|none||AppKey|
|appSecret|string|true|none||AppSecret(加密存储)|
|contactName|string|false|none||联系人|
|contactPhone|string|false|none||联系电话|
|callbackUrl|string|false|none||回调地址|
|callbackSecret|string|false|none||回调签名密钥|
|ipWhitelist|string|false|none||IP白名单(逗号分隔)|
|rateLimitQps|integer|true|none||限流QPS|
|environment|integer|true|none||环境：0-沙箱 1-生产|
|status|integer|true|none||状态：0-正常 1-禁用|

<h2 id="tocS_AppRespVO">AppRespVO</h2>

<a id="schemaapprespvo"></a>
<a id="schema_AppRespVO"></a>
<a id="tocSapprespvo"></a>
<a id="tocsapprespvo"></a>

```json
{
  "id": 21955,
  "developerId": 4789,
  "appName": "李四",
  "appType": 1,
  "appDesc": "string",
  "appLogo": "string",
  "appKey": "string",
  "appSecret": "string",
  "contactName": "李四",
  "contactPhone": "string",
  "callbackUrl": "https://top.morplcp.cn",
  "callbackSecret": "string",
  "ipWhitelist": "string",
  "rateLimitQps": 0,
  "environment": 0,
  "status": 2,
  "createTime": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||应用ID|
|developerId|integer(int64)|false|none||所属开发者ID|
|appName|string|false|none||应用名称|
|appType|integer|false|none||应用类型：0-生活服务 1-电商 2-社交 3-工具 4-其他|
|appDesc|string|false|none||应用简介|
|appLogo|string|false|none||应用Logo|
|appKey|string|false|none||AppKey|
|appSecret|string|false|none||AppSecret(加密存储)|
|contactName|string|false|none||联系人|
|contactPhone|string|false|none||联系电话|
|callbackUrl|string|false|none||回调地址|
|callbackSecret|string|false|none||回调签名密钥|
|ipWhitelist|string|false|none||IP白名单(逗号分隔)|
|rateLimitQps|integer|false|none||限流QPS|
|environment|integer|false|none||环境：0-沙箱 1-生产|
|status|integer|false|none||状态：0-正常 1-禁用|
|createTime|string|false|none||创建时间|

<h2 id="tocS_CommonResultAppRespVO">CommonResultAppRespVO</h2>

<a id="schemacommonresultapprespvo"></a>
<a id="schema_CommonResultAppRespVO"></a>
<a id="tocScommonresultapprespvo"></a>
<a id="tocscommonresultapprespvo"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "id": 21955,
    "developerId": 4789,
    "appName": "李四",
    "appType": 1,
    "appDesc": "string",
    "appLogo": "string",
    "appKey": "string",
    "appSecret": "string",
    "contactName": "李四",
    "contactPhone": "string",
    "callbackUrl": "https://top.morplcp.cn",
    "callbackSecret": "string",
    "ipWhitelist": "string",
    "rateLimitQps": 0,
    "environment": 0,
    "status": 2,
    "createTime": "string"
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[AppRespVO](#schemaapprespvo)|false|none||返回数据|

<h2 id="tocS_PageResultAppRespVO">PageResultAppRespVO</h2>

<a id="schemapageresultapprespvo"></a>
<a id="schema_PageResultAppRespVO"></a>
<a id="tocSpageresultapprespvo"></a>
<a id="tocspageresultapprespvo"></a>

```json
{
  "total": 0,
  "list": [
    {
      "id": 21955,
      "developerId": 4789,
      "appName": "李四",
      "appType": 1,
      "appDesc": "string",
      "appLogo": "string",
      "appKey": "string",
      "appSecret": "string",
      "contactName": "李四",
      "contactPhone": "string",
      "callbackUrl": "https://top.morplcp.cn",
      "callbackSecret": "string",
      "ipWhitelist": "string",
      "rateLimitQps": 0,
      "environment": 0,
      "status": 2,
      "createTime": "string"
    }
  ]
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|total|integer(int64)|false|none||总量|
|list|[[AppRespVO](#schemaapprespvo)]|false|none||数据|

<h2 id="tocS_CommonResultPageResultAppRespVO">CommonResultPageResultAppRespVO</h2>

<a id="schemacommonresultpageresultapprespvo"></a>
<a id="schema_CommonResultPageResultAppRespVO"></a>
<a id="tocScommonresultpageresultapprespvo"></a>
<a id="tocscommonresultpageresultapprespvo"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "total": 0,
    "list": [
      {
        "id": 21955,
        "developerId": 4789,
        "appName": "李四",
        "appType": 1,
        "appDesc": "string",
        "appLogo": "string",
        "appKey": "string",
        "appSecret": "string",
        "contactName": "李四",
        "contactPhone": "string",
        "callbackUrl": "https://top.morplcp.cn",
        "callbackSecret": "string",
        "ipWhitelist": "string",
        "rateLimitQps": 0,
        "environment": 0,
        "status": 2,
        "createTime": "string"
      }
    ]
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[PageResultAppRespVO](#schemapageresultapprespvo)|false|none||返回数据|

<h2 id="tocS_AppUserSaveReqVO">AppUserSaveReqVO</h2>

<a id="schemaappusersavereqvo"></a>
<a id="schema_AppUserSaveReqVO"></a>
<a id="tocSappusersavereqvo"></a>
<a id="tocsappusersavereqvo"></a>

```json
{
  "id": 17299,
  "appId": 11183,
  "externalUserId": "27843",
  "phone": "string",
  "nickname": "赵六",
  "avatarUrl": "https://top.morplcp.cn",
  "authId": 23151
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||映射ID|
|appId|integer(int64)|true|none||所属App|
|externalUserId|string|false|none||App端的用户标识|
|phone|string|false|none||手机号(可选，用于跨场景查找如分享抵金券)|
|nickname|string|false|none||昵称|
|avatarUrl|string|false|none||头像|
|authId|integer(int64)|false|none||实名认证记录ID(open_real_name_auth.id)|

<h2 id="tocS_AppUserRespVO">AppUserRespVO</h2>

<a id="schemaappuserrespvo"></a>
<a id="schema_AppUserRespVO"></a>
<a id="tocSappuserrespvo"></a>
<a id="tocsappuserrespvo"></a>

```json
{
  "id": 17299,
  "appId": 11183,
  "externalUserId": "27843",
  "phone": "string",
  "nickname": "赵六",
  "avatarUrl": "https://top.morplcp.cn",
  "authId": 23151,
  "createTime": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||映射ID|
|appId|integer(int64)|false|none||所属App|
|externalUserId|string|false|none||App端的用户标识|
|phone|string|false|none||手机号(可选，用于跨场景查找如分享抵金券)|
|nickname|string|false|none||昵称|
|avatarUrl|string|false|none||头像|
|authId|integer(int64)|false|none||实名认证记录ID(open_real_name_auth.id)|
|createTime|string|false|none||创建时间|

<h2 id="tocS_CommonResultAppUserRespVO">CommonResultAppUserRespVO</h2>

<a id="schemacommonresultappuserrespvo"></a>
<a id="schema_CommonResultAppUserRespVO"></a>
<a id="tocScommonresultappuserrespvo"></a>
<a id="tocscommonresultappuserrespvo"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "id": 17299,
    "appId": 11183,
    "externalUserId": "27843",
    "phone": "string",
    "nickname": "赵六",
    "avatarUrl": "https://top.morplcp.cn",
    "authId": 23151,
    "createTime": "string"
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[AppUserRespVO](#schemaappuserrespvo)|false|none||返回数据|

<h2 id="tocS_PageResultAppUserRespVO">PageResultAppUserRespVO</h2>

<a id="schemapageresultappuserrespvo"></a>
<a id="schema_PageResultAppUserRespVO"></a>
<a id="tocSpageresultappuserrespvo"></a>
<a id="tocspageresultappuserrespvo"></a>

```json
{
  "total": 0,
  "list": [
    {
      "id": 17299,
      "appId": 11183,
      "externalUserId": "27843",
      "phone": "string",
      "nickname": "赵六",
      "avatarUrl": "https://top.morplcp.cn",
      "authId": 23151,
      "createTime": "string"
    }
  ]
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|total|integer(int64)|false|none||总量|
|list|[[AppUserRespVO](#schemaappuserrespvo)]|false|none||数据|

<h2 id="tocS_CommonResultPageResultAppUserRespVO">CommonResultPageResultAppUserRespVO</h2>

<a id="schemacommonresultpageresultappuserrespvo"></a>
<a id="schema_CommonResultPageResultAppUserRespVO"></a>
<a id="tocScommonresultpageresultappuserrespvo"></a>
<a id="tocscommonresultpageresultappuserrespvo"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "total": 0,
    "list": [
      {
        "id": 17299,
        "appId": 11183,
        "externalUserId": "27843",
        "phone": "string",
        "nickname": "赵六",
        "avatarUrl": "https://top.morplcp.cn",
        "authId": 23151,
        "createTime": "string"
      }
    ]
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[PageResultAppUserRespVO](#schemapageresultappuserrespvo)|false|none||返回数据|

<h2 id="tocS_DeveloperMessageSaveReqVO">DeveloperMessageSaveReqVO</h2>

<a id="schemadevelopermessagesavereqvo"></a>
<a id="schema_DeveloperMessageSaveReqVO"></a>
<a id="tocSdevelopermessagesavereqvo"></a>
<a id="tocsdevelopermessagesavereqvo"></a>

```json
{
  "id": 20344,
  "developerId": 22208,
  "appId": 511,
  "msgType": 2,
  "title": "string",
  "content": "string",
  "isRead": true,
  "readTime": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||消息ID|
|developerId|integer(int64)|true|none||开发者ID|
|appId|integer(int64)|false|none||关联App ID(可选)|
|msgType|integer|true|none||消息类型：0-系统通知 1-审核通知 2-权限变更 3-异常告警 4-平台公告|
|title|string|true|none||消息标题|
|content|string|true|none||消息内容|
|isRead|boolean|true|none||是否已读|
|readTime|string|false|none||阅读时间|

<h2 id="tocS_AppMerchantFilterSaveReqVO">AppMerchantFilterSaveReqVO</h2>

<a id="schemaappmerchantfiltersavereqvo"></a>
<a id="schema_AppMerchantFilterSaveReqVO"></a>
<a id="tocSappmerchantfiltersavereqvo"></a>
<a id="tocsappmerchantfiltersavereqvo"></a>

```json
{
  "id": 1,
  "appId": 1,
  "filterMode": 0,
  "autoCooperate": true,
  "filterConfig": "string",
  "enabled": true
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||主键（更新时必填）|
|appId|integer(int64)|true|none||App ID|
|filterMode|integer|false|none||筛选模式：0-全部商户|
|autoCooperate|boolean|false|none||自动绑定是否直接合作：true-直接合作 false-申请中待审批|
|filterConfig|string|false|none||筛选条件配置(JSON，当前不使用，预留扩展)|
|enabled|boolean|false|none||是否启用|

<h2 id="tocS_DeveloperMessageRespVO">DeveloperMessageRespVO</h2>

<a id="schemadevelopermessagerespvo"></a>
<a id="schema_DeveloperMessageRespVO"></a>
<a id="tocSdevelopermessagerespvo"></a>
<a id="tocsdevelopermessagerespvo"></a>

```json
{
  "id": 20344,
  "developerId": 22208,
  "appId": 511,
  "msgType": 2,
  "title": "string",
  "content": "string",
  "isRead": true,
  "readTime": "string",
  "createTime": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||消息ID|
|developerId|integer(int64)|false|none||开发者ID|
|appId|integer(int64)|false|none||关联App ID(可选)|
|msgType|integer|false|none||消息类型：0-系统通知 1-审核通知 2-权限变更 3-异常告警 4-平台公告|
|title|string|false|none||消息标题|
|content|string|false|none||消息内容|
|isRead|boolean|false|none||是否已读|
|readTime|string|false|none||阅读时间|
|createTime|string|false|none||创建时间|

<h2 id="tocS_AppMerchantFilterRespVO">AppMerchantFilterRespVO</h2>

<a id="schemaappmerchantfilterrespvo"></a>
<a id="schema_AppMerchantFilterRespVO"></a>
<a id="tocSappmerchantfilterrespvo"></a>
<a id="tocsappmerchantfilterrespvo"></a>

```json
{
  "id": 1,
  "appId": 1,
  "filterMode": 0,
  "autoCooperate": true,
  "filterConfig": "string",
  "enabled": true,
  "lastSyncTime": "string",
  "createTime": "string",
  "updateTime": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||主键|
|appId|integer(int64)|false|none||App ID|
|filterMode|integer|false|none||筛选模式：0-全部商户|
|autoCooperate|boolean|false|none||自动绑定是否直接合作|
|filterConfig|string|false|none||筛选条件配置(JSON)|
|enabled|boolean|false|none||是否启用|
|lastSyncTime|string|false|none||最后同步时间|
|createTime|string|false|none||创建时间|
|updateTime|string|false|none||更新时间|

<h2 id="tocS_CommonResultDeveloperMessageRespVO">CommonResultDeveloperMessageRespVO</h2>

<a id="schemacommonresultdevelopermessagerespvo"></a>
<a id="schema_CommonResultDeveloperMessageRespVO"></a>
<a id="tocScommonresultdevelopermessagerespvo"></a>
<a id="tocscommonresultdevelopermessagerespvo"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "id": 20344,
    "developerId": 22208,
    "appId": 511,
    "msgType": 2,
    "title": "string",
    "content": "string",
    "isRead": true,
    "readTime": "string",
    "createTime": "string"
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[DeveloperMessageRespVO](#schemadevelopermessagerespvo)|false|none||返回数据|

<h2 id="tocS_CommonResultAppMerchantFilterRespVO">CommonResultAppMerchantFilterRespVO</h2>

<a id="schemacommonresultappmerchantfilterrespvo"></a>
<a id="schema_CommonResultAppMerchantFilterRespVO"></a>
<a id="tocScommonresultappmerchantfilterrespvo"></a>
<a id="tocscommonresultappmerchantfilterrespvo"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "id": 1,
    "appId": 1,
    "filterMode": 0,
    "autoCooperate": true,
    "filterConfig": "string",
    "enabled": true,
    "lastSyncTime": "string",
    "createTime": "string",
    "updateTime": "string"
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[AppMerchantFilterRespVO](#schemaappmerchantfilterrespvo)|false|none||返回数据|

<h2 id="tocS_PageResultDeveloperMessageRespVO">PageResultDeveloperMessageRespVO</h2>

<a id="schemapageresultdevelopermessagerespvo"></a>
<a id="schema_PageResultDeveloperMessageRespVO"></a>
<a id="tocSpageresultdevelopermessagerespvo"></a>
<a id="tocspageresultdevelopermessagerespvo"></a>

```json
{
  "total": 0,
  "list": [
    {
      "id": 20344,
      "developerId": 22208,
      "appId": 511,
      "msgType": 2,
      "title": "string",
      "content": "string",
      "isRead": true,
      "readTime": "string",
      "createTime": "string"
    }
  ]
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|total|integer(int64)|false|none||总量|
|list|[[DeveloperMessageRespVO](#schemadevelopermessagerespvo)]|false|none||数据|

<h2 id="tocS_CommonResultPageResultDeveloperMessageRespVO">CommonResultPageResultDeveloperMessageRespVO</h2>

<a id="schemacommonresultpageresultdevelopermessagerespvo"></a>
<a id="schema_CommonResultPageResultDeveloperMessageRespVO"></a>
<a id="tocScommonresultpageresultdevelopermessagerespvo"></a>
<a id="tocscommonresultpageresultdevelopermessagerespvo"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "total": 0,
    "list": [
      {
        "id": 20344,
        "developerId": 22208,
        "appId": 511,
        "msgType": 2,
        "title": "string",
        "content": "string",
        "isRead": true,
        "readTime": "string",
        "createTime": "string"
      }
    ]
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[PageResultDeveloperMessageRespVO](#schemapageresultdevelopermessagerespvo)|false|none||返回数据|

<h2 id="tocS_AppEventSubscriptionSaveReqVO">AppEventSubscriptionSaveReqVO</h2>

<a id="schemaappeventsubscriptionsavereqvo"></a>
<a id="schema_AppEventSubscriptionSaveReqVO"></a>
<a id="tocSappeventsubscriptionsavereqvo"></a>
<a id="tocsappeventsubscriptionsavereqvo"></a>

```json
{
  "id": 1,
  "appId": 10001,
  "eventCode": "member_card.purchase.paid",
  "enabled": true,
  "callbackUrlOverride": "https://partner.example.com/open/event",
  "callbackSecretOverride": "string",
  "version": "1.0"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||订阅 ID|
|appId|integer(int64)|true|none||App ID|
|eventCode|string|true|none||事件编码|
|enabled|boolean|true|none||是否启用|
|callbackUrlOverride|string|false|none||覆盖回调地址|
|callbackSecretOverride|string|false|none||覆盖回调密钥|
|version|string|false|none||事件版本|

<h2 id="tocS_AppEventSubscriptionRespVO">AppEventSubscriptionRespVO</h2>

<a id="schemaappeventsubscriptionrespvo"></a>
<a id="schema_AppEventSubscriptionRespVO"></a>
<a id="tocSappeventsubscriptionrespvo"></a>
<a id="tocsappeventsubscriptionrespvo"></a>

```json
{
  "id": 1,
  "appId": 10001,
  "eventCode": "member_card.purchase.paid",
  "enabled": true,
  "callbackUrlOverride": "string",
  "callbackSecretOverride": "string",
  "version": "1.0",
  "createTime": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||订阅 ID|
|appId|integer(int64)|false|none||App ID|
|eventCode|string|false|none||事件编码|
|enabled|boolean|false|none||是否启用|
|callbackUrlOverride|string|false|none||覆盖回调地址|
|callbackSecretOverride|string|false|none||覆盖回调密钥|
|version|string|false|none||事件版本|
|createTime|string|false|none||创建时间|

<h2 id="tocS_CommonResultAppEventSubscriptionRespVO">CommonResultAppEventSubscriptionRespVO</h2>

<a id="schemacommonresultappeventsubscriptionrespvo"></a>
<a id="schema_CommonResultAppEventSubscriptionRespVO"></a>
<a id="tocScommonresultappeventsubscriptionrespvo"></a>
<a id="tocscommonresultappeventsubscriptionrespvo"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "id": 1,
    "appId": 10001,
    "eventCode": "member_card.purchase.paid",
    "enabled": true,
    "callbackUrlOverride": "string",
    "callbackSecretOverride": "string",
    "version": "1.0",
    "createTime": "string"
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[AppEventSubscriptionRespVO](#schemaappeventsubscriptionrespvo)|false|none||返回数据|

<h2 id="tocS_PageResultAppEventSubscriptionRespVO">PageResultAppEventSubscriptionRespVO</h2>

<a id="schemapageresultappeventsubscriptionrespvo"></a>
<a id="schema_PageResultAppEventSubscriptionRespVO"></a>
<a id="tocSpageresultappeventsubscriptionrespvo"></a>
<a id="tocspageresultappeventsubscriptionrespvo"></a>

```json
{
  "total": 0,
  "list": [
    {
      "id": 1,
      "appId": 10001,
      "eventCode": "member_card.purchase.paid",
      "enabled": true,
      "callbackUrlOverride": "string",
      "callbackSecretOverride": "string",
      "version": "1.0",
      "createTime": "string"
    }
  ]
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|total|integer(int64)|false|none||总量|
|list|[[AppEventSubscriptionRespVO](#schemaappeventsubscriptionrespvo)]|false|none||数据|

<h2 id="tocS_CommonResultPageResultAppEventSubscriptionRespVO">CommonResultPageResultAppEventSubscriptionRespVO</h2>

<a id="schemacommonresultpageresultappeventsubscriptionrespvo"></a>
<a id="schema_CommonResultPageResultAppEventSubscriptionRespVO"></a>
<a id="tocScommonresultpageresultappeventsubscriptionrespvo"></a>
<a id="tocscommonresultpageresultappeventsubscriptionrespvo"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "total": 0,
    "list": [
      {
        "id": 1,
        "appId": 10001,
        "eventCode": "member_card.purchase.paid",
        "enabled": true,
        "callbackUrlOverride": "string",
        "callbackSecretOverride": "string",
        "version": "1.0",
        "createTime": "string"
      }
    ]
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[PageResultAppEventSubscriptionRespVO](#schemapageresultappeventsubscriptionrespvo)|false|none||返回数据|

<h2 id="tocS_DeveloperAccountSaveReqVO">DeveloperAccountSaveReqVO</h2>

<a id="schemadeveloperaccountsavereqvo"></a>
<a id="schema_DeveloperAccountSaveReqVO"></a>
<a id="tocSdeveloperaccountsavereqvo"></a>
<a id="tocsdeveloperaccountsavereqvo"></a>

```json
{
  "id": 27202,
  "developerId": 5344,
  "balance": 0,
  "frozenAmount": 0,
  "totalRecharge": 0,
  "totalGift": 0,
  "totalExpense": 0,
  "totalRefund": 0,
  "creditLimit": 0,
  "warningThreshold": 0,
  "status": 1
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||账户ID|
|developerId|integer(int64)|true|none||开发者ID|
|balance|integer|true|none||可用余额(分)|
|frozenAmount|integer|true|none||冻结金额(分)，预扣费或提现中的金额|
|totalRecharge|integer|true|none||累计充值(分)|
|totalGift|integer|true|none||累计赠送(分)|
|totalExpense|integer|true|none||累计消费(分)|
|totalRefund|integer|true|none||累计退款(分)|
|creditLimit|integer|true|none||信用额度(分)，允许余额为负的阈值|
|warningThreshold|integer|true|none||余额预警阈值(分)，低于此值发送提醒|
|status|integer|true|none||账户状态：0-正常 1-冻结 2-欠费停用|

<h2 id="tocS_DeveloperAccountRespVO">DeveloperAccountRespVO</h2>

<a id="schemadeveloperaccountrespvo"></a>
<a id="schema_DeveloperAccountRespVO"></a>
<a id="tocSdeveloperaccountrespvo"></a>
<a id="tocsdeveloperaccountrespvo"></a>

```json
{
  "id": 27202,
  "developerId": 5344,
  "balance": 0,
  "frozenAmount": 0,
  "totalRecharge": 0,
  "totalGift": 0,
  "totalExpense": 0,
  "totalRefund": 0,
  "creditLimit": 0,
  "warningThreshold": 0,
  "status": 1,
  "createTime": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||账户ID|
|developerId|integer(int64)|false|none||开发者ID|
|balance|integer|false|none||可用余额(分)|
|frozenAmount|integer|false|none||冻结金额(分)，预扣费或提现中的金额|
|totalRecharge|integer|false|none||累计充值(分)|
|totalGift|integer|false|none||累计赠送(分)|
|totalExpense|integer|false|none||累计消费(分)|
|totalRefund|integer|false|none||累计退款(分)|
|creditLimit|integer|false|none||信用额度(分)，允许余额为负的阈值|
|warningThreshold|integer|false|none||余额预警阈值(分)，低于此值发送提醒|
|status|integer|false|none||账户状态：0-正常 1-冻结 2-欠费停用|
|createTime|string|false|none||创建时间|

<h2 id="tocS_CommonResultDeveloperAccountRespVO">CommonResultDeveloperAccountRespVO</h2>

<a id="schemacommonresultdeveloperaccountrespvo"></a>
<a id="schema_CommonResultDeveloperAccountRespVO"></a>
<a id="tocScommonresultdeveloperaccountrespvo"></a>
<a id="tocscommonresultdeveloperaccountrespvo"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "id": 27202,
    "developerId": 5344,
    "balance": 0,
    "frozenAmount": 0,
    "totalRecharge": 0,
    "totalGift": 0,
    "totalExpense": 0,
    "totalRefund": 0,
    "creditLimit": 0,
    "warningThreshold": 0,
    "status": 1,
    "createTime": "string"
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[DeveloperAccountRespVO](#schemadeveloperaccountrespvo)|false|none||返回数据|

<h2 id="tocS_PageResultDeveloperAccountRespVO">PageResultDeveloperAccountRespVO</h2>

<a id="schemapageresultdeveloperaccountrespvo"></a>
<a id="schema_PageResultDeveloperAccountRespVO"></a>
<a id="tocSpageresultdeveloperaccountrespvo"></a>
<a id="tocspageresultdeveloperaccountrespvo"></a>

```json
{
  "total": 0,
  "list": [
    {
      "id": 27202,
      "developerId": 5344,
      "balance": 0,
      "frozenAmount": 0,
      "totalRecharge": 0,
      "totalGift": 0,
      "totalExpense": 0,
      "totalRefund": 0,
      "creditLimit": 0,
      "warningThreshold": 0,
      "status": 1,
      "createTime": "string"
    }
  ]
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|total|integer(int64)|false|none||总量|
|list|[[DeveloperAccountRespVO](#schemadeveloperaccountrespvo)]|false|none||数据|

<h2 id="tocS_CommonResultPageResultDeveloperAccountRespVO">CommonResultPageResultDeveloperAccountRespVO</h2>

<a id="schemacommonresultpageresultdeveloperaccountrespvo"></a>
<a id="schema_CommonResultPageResultDeveloperAccountRespVO"></a>
<a id="tocScommonresultpageresultdeveloperaccountrespvo"></a>
<a id="tocscommonresultpageresultdeveloperaccountrespvo"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "total": 0,
    "list": [
      {
        "id": 27202,
        "developerId": 5344,
        "balance": 0,
        "frozenAmount": 0,
        "totalRecharge": 0,
        "totalGift": 0,
        "totalExpense": 0,
        "totalRefund": 0,
        "creditLimit": 0,
        "warningThreshold": 0,
        "status": 1,
        "createTime": "string"
      }
    ]
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[PageResultDeveloperAccountRespVO](#schemapageresultdeveloperaccountrespvo)|false|none||返回数据|

<h2 id="tocS_AppPermissionSaveReqVO">AppPermissionSaveReqVO</h2>

<a id="schemaapppermissionsavereqvo"></a>
<a id="schema_AppPermissionSaveReqVO"></a>
<a id="tocSapppermissionsavereqvo"></a>
<a id="tocsapppermissionsavereqvo"></a>

```json
{
  "id": 15358,
  "appId": 2844,
  "apiModule": "string",
  "permissionType": 1,
  "status": 2,
  "grantedTime": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||权限ID|
|appId|integer(int64)|true|none||App ID|
|apiModule|string|true|none||API模块：merchant/member_card/order/product/booking/coupon/customer/statistics|
|permissionType|integer|true|none||权限类型：0-只读 1-读写 2-完全|
|status|integer|true|none||状态：0-启用 1-禁用|
|grantedTime|string|false|none||授权时间|

<h2 id="tocS_AppPermissionRespVO">AppPermissionRespVO</h2>

<a id="schemaapppermissionrespvo"></a>
<a id="schema_AppPermissionRespVO"></a>
<a id="tocSapppermissionrespvo"></a>
<a id="tocsapppermissionrespvo"></a>

```json
{
  "id": 15358,
  "appId": 2844,
  "apiModule": "string",
  "permissionType": 1,
  "status": 2,
  "grantedTime": "string",
  "createTime": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||权限ID|
|appId|integer(int64)|false|none||App ID|
|apiModule|string|false|none||API模块：merchant/member_card/order/product/booking/coupon/customer/statistics|
|permissionType|integer|false|none||权限类型：0-只读 1-读写 2-完全|
|status|integer|false|none||状态：0-启用 1-禁用|
|grantedTime|string|false|none||授权时间|
|createTime|string|false|none||创建时间|

<h2 id="tocS_CommonResultAppPermissionRespVO">CommonResultAppPermissionRespVO</h2>

<a id="schemacommonresultapppermissionrespvo"></a>
<a id="schema_CommonResultAppPermissionRespVO"></a>
<a id="tocScommonresultapppermissionrespvo"></a>
<a id="tocscommonresultapppermissionrespvo"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "id": 15358,
    "appId": 2844,
    "apiModule": "string",
    "permissionType": 1,
    "status": 2,
    "grantedTime": "string",
    "createTime": "string"
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[AppPermissionRespVO](#schemaapppermissionrespvo)|false|none||返回数据|

<h2 id="tocS_PageResultAppPermissionRespVO">PageResultAppPermissionRespVO</h2>

<a id="schemapageresultapppermissionrespvo"></a>
<a id="schema_PageResultAppPermissionRespVO"></a>
<a id="tocSpageresultapppermissionrespvo"></a>
<a id="tocspageresultapppermissionrespvo"></a>

```json
{
  "total": 0,
  "list": [
    {
      "id": 15358,
      "appId": 2844,
      "apiModule": "string",
      "permissionType": 1,
      "status": 2,
      "grantedTime": "string",
      "createTime": "string"
    }
  ]
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|total|integer(int64)|false|none||总量|
|list|[[AppPermissionRespVO](#schemaapppermissionrespvo)]|false|none||数据|

<h2 id="tocS_CommonResultPageResultAppPermissionRespVO">CommonResultPageResultAppPermissionRespVO</h2>

<a id="schemacommonresultpageresultapppermissionrespvo"></a>
<a id="schema_CommonResultPageResultAppPermissionRespVO"></a>
<a id="tocScommonresultpageresultapppermissionrespvo"></a>
<a id="tocscommonresultpageresultapppermissionrespvo"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "total": 0,
    "list": [
      {
        "id": 15358,
        "appId": 2844,
        "apiModule": "string",
        "permissionType": 1,
        "status": 2,
        "grantedTime": "string",
        "createTime": "string"
      }
    ]
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[PageResultAppPermissionRespVO](#schemapageresultapppermissionrespvo)|false|none||返回数据|

<h2 id="tocS_DeveloperAuthSaveReqVO">DeveloperAuthSaveReqVO</h2>

<a id="schemadeveloperauthsavereqvo"></a>
<a id="schema_DeveloperAuthSaveReqVO"></a>
<a id="tocSdeveloperauthsavereqvo"></a>
<a id="tocsdeveloperauthsavereqvo"></a>

```json
{
  "id": 10200,
  "developerId": 23391,
  "authType": 1,
  "realName": "沐沐",
  "idCardNumber": "string",
  "idCardFrontUrl": "https://top.morplcp.cn",
  "idCardBackUrl": "https://top.morplcp.cn",
  "companyName": "张三",
  "businessLicenseNo": "string",
  "businessLicenseUrl": "https://top.morplcp.cn",
  "legalPersonName": "李四",
  "legalPersonIdCard": "string",
  "bankAccountInfo": "string",
  "auditStatus": 2,
  "auditTime": "string",
  "auditorId": 31159,
  "auditRemark": "随便"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||认证ID|
|developerId|integer(int64)|true|none||开发者ID|
|authType|integer|true|none||认证类型：0-个人认证 1-企业认证|
|realName|string|false|none||真实姓名|
|idCardNumber|string|false|none||身份证号(加密存储)|
|idCardFrontUrl|string|false|none||身份证正面照|
|idCardBackUrl|string|false|none||身份证反面照|
|companyName|string|false|none||企业名称|
|businessLicenseNo|string|false|none||营业执照号|
|businessLicenseUrl|string|false|none||营业执照照片|
|legalPersonName|string|false|none||法人姓名|
|legalPersonIdCard|string|false|none||法人身份证号(加密存储)|
|bankAccountInfo|string|false|none||对公账户信息(JSON，加密存储)|
|auditStatus|integer|true|none||审核状态：0-待审核 1-通过 2-拒绝|
|auditTime|string|false|none||审核时间|
|auditorId|integer(int64)|false|none||审核人ID|
|auditRemark|string|false|none||审核备注|

<h2 id="tocS_DeveloperAuthRespVO">DeveloperAuthRespVO</h2>

<a id="schemadeveloperauthrespvo"></a>
<a id="schema_DeveloperAuthRespVO"></a>
<a id="tocSdeveloperauthrespvo"></a>
<a id="tocsdeveloperauthrespvo"></a>

```json
{
  "id": 10200,
  "developerId": 23391,
  "authType": 1,
  "realName": "沐沐",
  "idCardNumber": "string",
  "idCardFrontUrl": "https://top.morplcp.cn",
  "idCardBackUrl": "https://top.morplcp.cn",
  "companyName": "张三",
  "businessLicenseNo": "string",
  "businessLicenseUrl": "https://top.morplcp.cn",
  "legalPersonName": "李四",
  "legalPersonIdCard": "string",
  "bankAccountInfo": "string",
  "auditStatus": 2,
  "auditTime": "string",
  "auditorId": 31159,
  "auditRemark": "随便",
  "createTime": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||认证ID|
|developerId|integer(int64)|false|none||开发者ID|
|authType|integer|false|none||认证类型：0-个人认证 1-企业认证|
|realName|string|false|none||真实姓名|
|idCardNumber|string|false|none||身份证号(加密存储)|
|idCardFrontUrl|string|false|none||身份证正面照|
|idCardBackUrl|string|false|none||身份证反面照|
|companyName|string|false|none||企业名称|
|businessLicenseNo|string|false|none||营业执照号|
|businessLicenseUrl|string|false|none||营业执照照片|
|legalPersonName|string|false|none||法人姓名|
|legalPersonIdCard|string|false|none||法人身份证号(加密存储)|
|bankAccountInfo|string|false|none||对公账户信息(JSON，加密存储)|
|auditStatus|integer|false|none||审核状态：0-待审核 1-通过 2-拒绝|
|auditTime|string|false|none||审核时间|
|auditorId|integer(int64)|false|none||审核人ID|
|auditRemark|string|false|none||审核备注|
|createTime|string|false|none||创建时间|

<h2 id="tocS_CommonResultDeveloperAuthRespVO">CommonResultDeveloperAuthRespVO</h2>

<a id="schemacommonresultdeveloperauthrespvo"></a>
<a id="schema_CommonResultDeveloperAuthRespVO"></a>
<a id="tocScommonresultdeveloperauthrespvo"></a>
<a id="tocscommonresultdeveloperauthrespvo"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "id": 10200,
    "developerId": 23391,
    "authType": 1,
    "realName": "沐沐",
    "idCardNumber": "string",
    "idCardFrontUrl": "https://top.morplcp.cn",
    "idCardBackUrl": "https://top.morplcp.cn",
    "companyName": "张三",
    "businessLicenseNo": "string",
    "businessLicenseUrl": "https://top.morplcp.cn",
    "legalPersonName": "李四",
    "legalPersonIdCard": "string",
    "bankAccountInfo": "string",
    "auditStatus": 2,
    "auditTime": "string",
    "auditorId": 31159,
    "auditRemark": "随便",
    "createTime": "string"
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[DeveloperAuthRespVO](#schemadeveloperauthrespvo)|false|none||返回数据|

<h2 id="tocS_PageResultDeveloperAuthRespVO">PageResultDeveloperAuthRespVO</h2>

<a id="schemapageresultdeveloperauthrespvo"></a>
<a id="schema_PageResultDeveloperAuthRespVO"></a>
<a id="tocSpageresultdeveloperauthrespvo"></a>
<a id="tocspageresultdeveloperauthrespvo"></a>

```json
{
  "total": 0,
  "list": [
    {
      "id": 10200,
      "developerId": 23391,
      "authType": 1,
      "realName": "沐沐",
      "idCardNumber": "string",
      "idCardFrontUrl": "https://top.morplcp.cn",
      "idCardBackUrl": "https://top.morplcp.cn",
      "companyName": "张三",
      "businessLicenseNo": "string",
      "businessLicenseUrl": "https://top.morplcp.cn",
      "legalPersonName": "李四",
      "legalPersonIdCard": "string",
      "bankAccountInfo": "string",
      "auditStatus": 2,
      "auditTime": "string",
      "auditorId": 31159,
      "auditRemark": "随便",
      "createTime": "string"
    }
  ]
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|total|integer(int64)|false|none||总量|
|list|[[DeveloperAuthRespVO](#schemadeveloperauthrespvo)]|false|none||数据|

<h2 id="tocS_CommonResultPageResultDeveloperAuthRespVO">CommonResultPageResultDeveloperAuthRespVO</h2>

<a id="schemacommonresultpageresultdeveloperauthrespvo"></a>
<a id="schema_CommonResultPageResultDeveloperAuthRespVO"></a>
<a id="tocScommonresultpageresultdeveloperauthrespvo"></a>
<a id="tocscommonresultpageresultdeveloperauthrespvo"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "total": 0,
    "list": [
      {
        "id": 10200,
        "developerId": 23391,
        "authType": 1,
        "realName": "沐沐",
        "idCardNumber": "string",
        "idCardFrontUrl": "https://top.morplcp.cn",
        "idCardBackUrl": "https://top.morplcp.cn",
        "companyName": "张三",
        "businessLicenseNo": "string",
        "businessLicenseUrl": "https://top.morplcp.cn",
        "legalPersonName": "李四",
        "legalPersonIdCard": "string",
        "bankAccountInfo": "string",
        "auditStatus": 2,
        "auditTime": "string",
        "auditorId": 31159,
        "auditRemark": "随便",
        "createTime": "string"
      }
    ]
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[PageResultDeveloperAuthRespVO](#schemapageresultdeveloperauthrespvo)|false|none||返回数据|

<h2 id="tocS_AppLinkSaveReqVO">AppLinkSaveReqVO</h2>

<a id="schemaapplinksavereqvo"></a>
<a id="schema_AppLinkSaveReqVO"></a>
<a id="tocSapplinksavereqvo"></a>
<a id="tocsapplinksavereqvo"></a>

```json
{
  "id": 21909,
  "appId": 5543,
  "linkName": "王五",
  "linkUrl": "https://top.morplcp.cn",
  "linkType": 1,
  "description": "你猜",
  "auditStatus": 2,
  "auditTime": "string",
  "auditorId": 7177,
  "auditRemark": "你说的对",
  "status": 2
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||链接ID|
|appId|integer(int64)|true|none||App ID|
|linkName|string|true|none||链接名称|
|linkUrl|string|true|none||链接地址(支持{merchantId}占位)|
|linkType|integer|true|none||链接类型：0-运营数据 1-其他|
|description|string|false|none||链接描述|
|auditStatus|integer|true|none||审核状态：0-待审核 1-通过 2-拒绝|
|auditTime|string|false|none||审核时间|
|auditorId|integer(int64)|false|none||审核人ID|
|auditRemark|string|false|none||审核备注|
|status|integer|true|none||状态：0-正常 1-禁用|

<h2 id="tocS_AppLinkRespVO">AppLinkRespVO</h2>

<a id="schemaapplinkrespvo"></a>
<a id="schema_AppLinkRespVO"></a>
<a id="tocSapplinkrespvo"></a>
<a id="tocsapplinkrespvo"></a>

```json
{
  "id": 21909,
  "appId": 5543,
  "linkName": "王五",
  "linkUrl": "https://top.morplcp.cn",
  "linkType": 1,
  "description": "你猜",
  "auditStatus": 2,
  "auditTime": "string",
  "auditorId": 7177,
  "auditRemark": "你说的对",
  "status": 2,
  "createTime": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||链接ID|
|appId|integer(int64)|false|none||App ID|
|linkName|string|false|none||链接名称|
|linkUrl|string|false|none||链接地址(支持{merchantId}占位)|
|linkType|integer|false|none||链接类型：0-运营数据 1-其他|
|description|string|false|none||链接描述|
|auditStatus|integer|false|none||审核状态：0-待审核 1-通过 2-拒绝|
|auditTime|string|false|none||审核时间|
|auditorId|integer(int64)|false|none||审核人ID|
|auditRemark|string|false|none||审核备注|
|status|integer|false|none||状态：0-正常 1-禁用|
|createTime|string|false|none||创建时间|

<h2 id="tocS_CommonResultAppLinkRespVO">CommonResultAppLinkRespVO</h2>

<a id="schemacommonresultapplinkrespvo"></a>
<a id="schema_CommonResultAppLinkRespVO"></a>
<a id="tocScommonresultapplinkrespvo"></a>
<a id="tocscommonresultapplinkrespvo"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "id": 21909,
    "appId": 5543,
    "linkName": "王五",
    "linkUrl": "https://top.morplcp.cn",
    "linkType": 1,
    "description": "你猜",
    "auditStatus": 2,
    "auditTime": "string",
    "auditorId": 7177,
    "auditRemark": "你说的对",
    "status": 2,
    "createTime": "string"
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[AppLinkRespVO](#schemaapplinkrespvo)|false|none||返回数据|

<h2 id="tocS_PageResultAppLinkRespVO">PageResultAppLinkRespVO</h2>

<a id="schemapageresultapplinkrespvo"></a>
<a id="schema_PageResultAppLinkRespVO"></a>
<a id="tocSpageresultapplinkrespvo"></a>
<a id="tocspageresultapplinkrespvo"></a>

```json
{
  "total": 0,
  "list": [
    {
      "id": 21909,
      "appId": 5543,
      "linkName": "王五",
      "linkUrl": "https://top.morplcp.cn",
      "linkType": 1,
      "description": "你猜",
      "auditStatus": 2,
      "auditTime": "string",
      "auditorId": 7177,
      "auditRemark": "你说的对",
      "status": 2,
      "createTime": "string"
    }
  ]
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|total|integer(int64)|false|none||总量|
|list|[[AppLinkRespVO](#schemaapplinkrespvo)]|false|none||数据|

<h2 id="tocS_CommonResultPageResultAppLinkRespVO">CommonResultPageResultAppLinkRespVO</h2>

<a id="schemacommonresultpageresultapplinkrespvo"></a>
<a id="schema_CommonResultPageResultAppLinkRespVO"></a>
<a id="tocScommonresultpageresultapplinkrespvo"></a>
<a id="tocscommonresultpageresultapplinkrespvo"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "total": 0,
    "list": [
      {
        "id": 21909,
        "appId": 5543,
        "linkName": "王五",
        "linkUrl": "https://top.morplcp.cn",
        "linkType": 1,
        "description": "你猜",
        "auditStatus": 2,
        "auditTime": "string",
        "auditorId": 7177,
        "auditRemark": "你说的对",
        "status": 2,
        "createTime": "string"
      }
    ]
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[PageResultAppLinkRespVO](#schemapageresultapplinkrespvo)|false|none||返回数据|

<h2 id="tocS_DeveloperRechargeSaveReqVO">DeveloperRechargeSaveReqVO</h2>

<a id="schemadeveloperrechargesavereqvo"></a>
<a id="schema_DeveloperRechargeSaveReqVO"></a>
<a id="tocSdeveloperrechargesavereqvo"></a>
<a id="tocsdeveloperrechargesavereqvo"></a>

```json
{
  "id": 13276,
  "accountId": 23005,
  "developerId": 20043,
  "rechargeNo": "string",
  "payPrice": 19435,
  "bonusPrice": 30722,
  "totalPrice": 29253,
  "payChannel": "string",
  "payOrderNo": "string",
  "payStatus": 2,
  "payTime": "string",
  "refundStatus": 1,
  "refundAmount": 0,
  "refundTime": "string",
  "remark": "你说的对"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||充值记录ID|
|accountId|integer(int64)|true|none||账户ID|
|developerId|integer(int64)|true|none||开发者ID|
|rechargeNo|string|true|none||充值单号|
|payPrice|integer|true|none||实际支付金额(分)|
|bonusPrice|integer|true|none||赠送金额(分)|
|totalPrice|integer|true|none||到账总额(分)，pay_price + bonus_price|
|payChannel|string|false|none||支付渠道：alipay/wechat/bank_transfer/offline|
|payOrderNo|string|false|none||第三方支付订单号|
|payStatus|integer|true|none||支付状态：0-待支付 1-已支付 2-已取消 3-支付失败|
|payTime|string|false|none||支付完成时间|
|refundStatus|integer|true|none||退款状态：0-未退款 1-部分退款 2-全额退款|
|refundAmount|integer|true|none||已退款金额(分)|
|refundTime|string|false|none||退款时间|
|remark|string|false|none||备注|

<h2 id="tocS_DeveloperRechargeRespVO">DeveloperRechargeRespVO</h2>

<a id="schemadeveloperrechargerespvo"></a>
<a id="schema_DeveloperRechargeRespVO"></a>
<a id="tocSdeveloperrechargerespvo"></a>
<a id="tocsdeveloperrechargerespvo"></a>

```json
{
  "id": 13276,
  "accountId": 23005,
  "developerId": 20043,
  "rechargeNo": "string",
  "payPrice": 19435,
  "bonusPrice": 30722,
  "totalPrice": 29253,
  "payChannel": "string",
  "payOrderNo": "string",
  "payStatus": 2,
  "payTime": "string",
  "refundStatus": 1,
  "refundAmount": 0,
  "refundTime": "string",
  "remark": "你说的对",
  "createTime": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||充值记录ID|
|accountId|integer(int64)|false|none||账户ID|
|developerId|integer(int64)|false|none||开发者ID|
|rechargeNo|string|false|none||充值单号|
|payPrice|integer|false|none||实际支付金额(分)|
|bonusPrice|integer|false|none||赠送金额(分)|
|totalPrice|integer|false|none||到账总额(分)，pay_price + bonus_price|
|payChannel|string|false|none||支付渠道：alipay/wechat/bank_transfer/offline|
|payOrderNo|string|false|none||第三方支付订单号|
|payStatus|integer|false|none||支付状态：0-待支付 1-已支付 2-已取消 3-支付失败|
|payTime|string|false|none||支付完成时间|
|refundStatus|integer|false|none||退款状态：0-未退款 1-部分退款 2-全额退款|
|refundAmount|integer|false|none||已退款金额(分)|
|refundTime|string|false|none||退款时间|
|remark|string|false|none||备注|
|createTime|string|false|none||创建时间|

<h2 id="tocS_CommonResultDeveloperRechargeRespVO">CommonResultDeveloperRechargeRespVO</h2>

<a id="schemacommonresultdeveloperrechargerespvo"></a>
<a id="schema_CommonResultDeveloperRechargeRespVO"></a>
<a id="tocScommonresultdeveloperrechargerespvo"></a>
<a id="tocscommonresultdeveloperrechargerespvo"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "id": 13276,
    "accountId": 23005,
    "developerId": 20043,
    "rechargeNo": "string",
    "payPrice": 19435,
    "bonusPrice": 30722,
    "totalPrice": 29253,
    "payChannel": "string",
    "payOrderNo": "string",
    "payStatus": 2,
    "payTime": "string",
    "refundStatus": 1,
    "refundAmount": 0,
    "refundTime": "string",
    "remark": "你说的对",
    "createTime": "string"
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[DeveloperRechargeRespVO](#schemadeveloperrechargerespvo)|false|none||返回数据|

<h2 id="tocS_PageResultDeveloperRechargeRespVO">PageResultDeveloperRechargeRespVO</h2>

<a id="schemapageresultdeveloperrechargerespvo"></a>
<a id="schema_PageResultDeveloperRechargeRespVO"></a>
<a id="tocSpageresultdeveloperrechargerespvo"></a>
<a id="tocspageresultdeveloperrechargerespvo"></a>

```json
{
  "total": 0,
  "list": [
    {
      "id": 13276,
      "accountId": 23005,
      "developerId": 20043,
      "rechargeNo": "string",
      "payPrice": 19435,
      "bonusPrice": 30722,
      "totalPrice": 29253,
      "payChannel": "string",
      "payOrderNo": "string",
      "payStatus": 2,
      "payTime": "string",
      "refundStatus": 1,
      "refundAmount": 0,
      "refundTime": "string",
      "remark": "你说的对",
      "createTime": "string"
    }
  ]
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|total|integer(int64)|false|none||总量|
|list|[[DeveloperRechargeRespVO](#schemadeveloperrechargerespvo)]|false|none||数据|

<h2 id="tocS_CommonResultPageResultDeveloperRechargeRespVO">CommonResultPageResultDeveloperRechargeRespVO</h2>

<a id="schemacommonresultpageresultdeveloperrechargerespvo"></a>
<a id="schema_CommonResultPageResultDeveloperRechargeRespVO"></a>
<a id="tocScommonresultpageresultdeveloperrechargerespvo"></a>
<a id="tocscommonresultpageresultdeveloperrechargerespvo"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "total": 0,
    "list": [
      {
        "id": 13276,
        "accountId": 23005,
        "developerId": 20043,
        "rechargeNo": "string",
        "payPrice": 19435,
        "bonusPrice": 30722,
        "totalPrice": 29253,
        "payChannel": "string",
        "payOrderNo": "string",
        "payStatus": 2,
        "payTime": "string",
        "refundStatus": 1,
        "refundAmount": 0,
        "refundTime": "string",
        "remark": "你说的对",
        "createTime": "string"
      }
    ]
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[PageResultDeveloperRechargeRespVO](#schemapageresultdeveloperrechargerespvo)|false|none||返回数据|

<h2 id="tocS_AppSecretLogSaveReqVO">AppSecretLogSaveReqVO</h2>

<a id="schemaappsecretlogsavereqvo"></a>
<a id="schema_AppSecretLogSaveReqVO"></a>
<a id="tocSappsecretlogsavereqvo"></a>
<a id="tocsappsecretlogsavereqvo"></a>

```json
{
  "id": 307,
  "appId": 32729,
  "oldAppSecret": "string",
  "operateType": 1,
  "expireTime": "string",
  "operatorId": 8251,
  "reason": "不好"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||记录ID|
|appId|integer(int64)|true|none||App ID|
|oldAppSecret|string|true|none||旧密钥(加密存储)|
|operateType|integer|true|none||操作类型：0-首次生成 1-开发者重置 2-平台强制重置|
|expireTime|string|true|none||旧密钥过期时间(7天过渡期)|
|operatorId|integer(int64)|false|none||操作人ID|
|reason|string|false|none||重置原因|

<h2 id="tocS_AppSecretLogRespVO">AppSecretLogRespVO</h2>

<a id="schemaappsecretlogrespvo"></a>
<a id="schema_AppSecretLogRespVO"></a>
<a id="tocSappsecretlogrespvo"></a>
<a id="tocsappsecretlogrespvo"></a>

```json
{
  "id": 307,
  "appId": 32729,
  "oldAppSecret": "string",
  "operateType": 1,
  "expireTime": "string",
  "operatorId": 8251,
  "reason": "不好",
  "createTime": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||记录ID|
|appId|integer(int64)|false|none||App ID|
|oldAppSecret|string|false|none||旧密钥(加密存储)|
|operateType|integer|false|none||操作类型：0-首次生成 1-开发者重置 2-平台强制重置|
|expireTime|string|false|none||旧密钥过期时间(7天过渡期)|
|operatorId|integer(int64)|false|none||操作人ID|
|reason|string|false|none||重置原因|
|createTime|string|false|none||创建时间|

<h2 id="tocS_CommonResultAppSecretLogRespVO">CommonResultAppSecretLogRespVO</h2>

<a id="schemacommonresultappsecretlogrespvo"></a>
<a id="schema_CommonResultAppSecretLogRespVO"></a>
<a id="tocScommonresultappsecretlogrespvo"></a>
<a id="tocscommonresultappsecretlogrespvo"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "id": 307,
    "appId": 32729,
    "oldAppSecret": "string",
    "operateType": 1,
    "expireTime": "string",
    "operatorId": 8251,
    "reason": "不好",
    "createTime": "string"
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[AppSecretLogRespVO](#schemaappsecretlogrespvo)|false|none||返回数据|

<h2 id="tocS_PageResultAppSecretLogRespVO">PageResultAppSecretLogRespVO</h2>

<a id="schemapageresultappsecretlogrespvo"></a>
<a id="schema_PageResultAppSecretLogRespVO"></a>
<a id="tocSpageresultappsecretlogrespvo"></a>
<a id="tocspageresultappsecretlogrespvo"></a>

```json
{
  "total": 0,
  "list": [
    {
      "id": 307,
      "appId": 32729,
      "oldAppSecret": "string",
      "operateType": 1,
      "expireTime": "string",
      "operatorId": 8251,
      "reason": "不好",
      "createTime": "string"
    }
  ]
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|total|integer(int64)|false|none||总量|
|list|[[AppSecretLogRespVO](#schemaappsecretlogrespvo)]|false|none||数据|

<h2 id="tocS_CommonResultPageResultAppSecretLogRespVO">CommonResultPageResultAppSecretLogRespVO</h2>

<a id="schemacommonresultpageresultappsecretlogrespvo"></a>
<a id="schema_CommonResultPageResultAppSecretLogRespVO"></a>
<a id="tocScommonresultpageresultappsecretlogrespvo"></a>
<a id="tocscommonresultpageresultappsecretlogrespvo"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "total": 0,
    "list": [
      {
        "id": 307,
        "appId": 32729,
        "oldAppSecret": "string",
        "operateType": 1,
        "expireTime": "string",
        "operatorId": 8251,
        "reason": "不好",
        "createTime": "string"
      }
    ]
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[PageResultAppSecretLogRespVO](#schemapageresultappsecretlogrespvo)|false|none||返回数据|

<h2 id="tocS_ApiLogSaveReqVO">ApiLogSaveReqVO</h2>

<a id="schemaapilogsavereqvo"></a>
<a id="schema_ApiLogSaveReqVO"></a>
<a id="tocSapilogsavereqvo"></a>
<a id="tocsapilogsavereqvo"></a>

```json
{
  "id": 6898,
  "appId": 17344,
  "developerId": 6416,
  "apiPath": "string",
  "method": "string",
  "requestBody": "string",
  "responseBody": "string",
  "responseCode": 0,
  "costMs": 0,
  "ip": "string",
  "errorMsg": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||日志ID|
|appId|integer(int64)|true|none||App ID|
|developerId|integer(int64)|true|none||开发者ID(冗余，便于控制台统计)|
|apiPath|string|true|none||接口路径|
|method|string|true|none||请求方法|
|requestBody|string|false|none||请求体|
|responseBody|string|false|none||响应体|
|responseCode|integer|false|none||响应码|
|costMs|integer|false|none||耗时(ms)|
|ip|string|false|none||请求IP|
|errorMsg|string|false|none||错误信息|

<h2 id="tocS_ApiLogRespVO">ApiLogRespVO</h2>

<a id="schemaapilogrespvo"></a>
<a id="schema_ApiLogRespVO"></a>
<a id="tocSapilogrespvo"></a>
<a id="tocsapilogrespvo"></a>

```json
{
  "id": 6898,
  "appId": 17344,
  "developerId": 6416,
  "apiPath": "string",
  "method": "string",
  "requestBody": "string",
  "responseBody": "string",
  "responseCode": 0,
  "costMs": 0,
  "ip": "string",
  "errorMsg": "string",
  "createTime": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||日志ID|
|appId|integer(int64)|false|none||App ID|
|developerId|integer(int64)|false|none||开发者ID(冗余，便于控制台统计)|
|apiPath|string|false|none||接口路径|
|method|string|false|none||请求方法|
|requestBody|string|false|none||请求体|
|responseBody|string|false|none||响应体|
|responseCode|integer|false|none||响应码|
|costMs|integer|false|none||耗时(ms)|
|ip|string|false|none||请求IP|
|errorMsg|string|false|none||错误信息|
|createTime|string|false|none||创建时间|

<h2 id="tocS_CommonResultApiLogRespVO">CommonResultApiLogRespVO</h2>

<a id="schemacommonresultapilogrespvo"></a>
<a id="schema_CommonResultApiLogRespVO"></a>
<a id="tocScommonresultapilogrespvo"></a>
<a id="tocscommonresultapilogrespvo"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "id": 6898,
    "appId": 17344,
    "developerId": 6416,
    "apiPath": "string",
    "method": "string",
    "requestBody": "string",
    "responseBody": "string",
    "responseCode": 0,
    "costMs": 0,
    "ip": "string",
    "errorMsg": "string",
    "createTime": "string"
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[ApiLogRespVO](#schemaapilogrespvo)|false|none||返回数据|

<h2 id="tocS_PageResultApiLogRespVO">PageResultApiLogRespVO</h2>

<a id="schemapageresultapilogrespvo"></a>
<a id="schema_PageResultApiLogRespVO"></a>
<a id="tocSpageresultapilogrespvo"></a>
<a id="tocspageresultapilogrespvo"></a>

```json
{
  "total": 0,
  "list": [
    {
      "id": 6898,
      "appId": 17344,
      "developerId": 6416,
      "apiPath": "string",
      "method": "string",
      "requestBody": "string",
      "responseBody": "string",
      "responseCode": 0,
      "costMs": 0,
      "ip": "string",
      "errorMsg": "string",
      "createTime": "string"
    }
  ]
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|total|integer(int64)|false|none||总量|
|list|[[ApiLogRespVO](#schemaapilogrespvo)]|false|none||数据|

<h2 id="tocS_CommonResultPageResultApiLogRespVO">CommonResultPageResultApiLogRespVO</h2>

<a id="schemacommonresultpageresultapilogrespvo"></a>
<a id="schema_CommonResultPageResultApiLogRespVO"></a>
<a id="tocScommonresultpageresultapilogrespvo"></a>
<a id="tocscommonresultpageresultapilogrespvo"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "total": 0,
    "list": [
      {
        "id": 6898,
        "appId": 17344,
        "developerId": 6416,
        "apiPath": "string",
        "method": "string",
        "requestBody": "string",
        "responseBody": "string",
        "responseCode": 0,
        "costMs": 0,
        "ip": "string",
        "errorMsg": "string",
        "createTime": "string"
      }
    ]
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[PageResultApiLogRespVO](#schemapageresultapilogrespvo)|false|none||返回数据|

<h2 id="tocS_RealNameAuthSaveReqVO">RealNameAuthSaveReqVO</h2>

<a id="schemarealnameauthsavereqvo"></a>
<a id="schema_RealNameAuthSaveReqVO"></a>
<a id="tocSrealnameauthsavereqvo"></a>
<a id="tocsrealnameauthsavereqvo"></a>

```json
{
  "id": 14326,
  "realName": "赵六",
  "idCardNumber": "string",
  "idCardFrontUrl": "string",
  "idCardBackUrl": "string",
  "authStatus": 1,
  "authTime": "string",
  "failReason": "string",
  "authChannel": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||认证ID|
|realName|string|true|none||真实姓名|
|idCardNumber|string|true|none||身份证号|
|idCardFrontUrl|string|false|none||身份证正面照URL|
|idCardBackUrl|string|false|none||身份证背面照URL|
|authStatus|integer|true|none||认证状态：0-未认证 1-认证中 2-已认证 3-认证失败|
|authTime|string|false|none||认证通过时间|
|failReason|string|false|none||认证失败原因|
|authChannel|string|false|none||认证渠道（TENCENT/ESIGN）|

<h2 id="tocS_RealNameAuthRespVO">RealNameAuthRespVO</h2>

<a id="schemarealnameauthrespvo"></a>
<a id="schema_RealNameAuthRespVO"></a>
<a id="tocSrealnameauthrespvo"></a>
<a id="tocsrealnameauthrespvo"></a>

```json
{
  "id": 14326,
  "realName": "赵六",
  "idCardNumber": "string",
  "idCardFrontUrl": "string",
  "idCardBackUrl": "string",
  "sex": "string",
  "nation": "string",
  "birth": "string",
  "address": "string",
  "authority": "string",
  "validDate": "string",
  "portraitUrl": "string",
  "ocrQualityScore": 0,
  "facePhotoUrl": "string",
  "faceOrderNo": "string",
  "faceLiveRate": 0,
  "faceSimilarity": 0,
  "authStatus": 1,
  "authTime": "string",
  "failReason": "string",
  "authChannel": "string",
  "signatureUrl": "string",
  "createTime": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||认证ID|
|realName|string|false|none||真实姓名|
|idCardNumber|string|false|none||身份证号|
|idCardFrontUrl|string|false|none||身份证正面照URL|
|idCardBackUrl|string|false|none||身份证背面照URL|
|sex|string|false|none||性别（OCR识别）|
|nation|string|false|none||民族（OCR识别）|
|birth|string|false|none||出生日期（OCR识别）|
|address|string|false|none||住址（OCR识别）|
|authority|string|false|none||签发机关（OCR识别）|
|validDate|string|false|none||有效期限（OCR识别）|
|portraitUrl|string|false|none||身份证头像裁剪图URL|
|ocrQualityScore|integer|false|none||OCR图片质量分数（0-100）|
|facePhotoUrl|string|false|none||人脸照片URL|
|faceOrderNo|string|false|none||人脸核身订单号|
|faceLiveRate|integer|false|none||活体检测得分（0-100）|
|faceSimilarity|integer|false|none||人脸比对得分（0-100）|
|authStatus|integer|false|none||认证状态：0-未认证 1-认证中 2-已认证 3-认证失败|
|authTime|string|false|none||认证通过时间|
|failReason|string|false|none||认证失败原因|
|authChannel|string|false|none||认证渠道（TENCENT/ESIGN）|
|signatureUrl|string|false|none||用户签名图片URL|
|createTime|string|false|none||创建时间|

<h2 id="tocS_CommonResultRealNameAuthRespVO">CommonResultRealNameAuthRespVO</h2>

<a id="schemacommonresultrealnameauthrespvo"></a>
<a id="schema_CommonResultRealNameAuthRespVO"></a>
<a id="tocScommonresultrealnameauthrespvo"></a>
<a id="tocscommonresultrealnameauthrespvo"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "id": 14326,
    "realName": "赵六",
    "idCardNumber": "string",
    "idCardFrontUrl": "string",
    "idCardBackUrl": "string",
    "sex": "string",
    "nation": "string",
    "birth": "string",
    "address": "string",
    "authority": "string",
    "validDate": "string",
    "portraitUrl": "string",
    "ocrQualityScore": 0,
    "facePhotoUrl": "string",
    "faceOrderNo": "string",
    "faceLiveRate": 0,
    "faceSimilarity": 0,
    "authStatus": 1,
    "authTime": "string",
    "failReason": "string",
    "authChannel": "string",
    "signatureUrl": "string",
    "createTime": "string"
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[RealNameAuthRespVO](#schemarealnameauthrespvo)|false|none||返回数据|

<h2 id="tocS_PageResultRealNameAuthRespVO">PageResultRealNameAuthRespVO</h2>

<a id="schemapageresultrealnameauthrespvo"></a>
<a id="schema_PageResultRealNameAuthRespVO"></a>
<a id="tocSpageresultrealnameauthrespvo"></a>
<a id="tocspageresultrealnameauthrespvo"></a>

```json
{
  "total": 0,
  "list": [
    {
      "id": 14326,
      "realName": "赵六",
      "idCardNumber": "string",
      "idCardFrontUrl": "string",
      "idCardBackUrl": "string",
      "sex": "string",
      "nation": "string",
      "birth": "string",
      "address": "string",
      "authority": "string",
      "validDate": "string",
      "portraitUrl": "string",
      "ocrQualityScore": 0,
      "facePhotoUrl": "string",
      "faceOrderNo": "string",
      "faceLiveRate": 0,
      "faceSimilarity": 0,
      "authStatus": 1,
      "authTime": "string",
      "failReason": "string",
      "authChannel": "string",
      "signatureUrl": "string",
      "createTime": "string"
    }
  ]
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|total|integer(int64)|false|none||总量|
|list|[[RealNameAuthRespVO](#schemarealnameauthrespvo)]|false|none||数据|

<h2 id="tocS_CommonResultPageResultRealNameAuthRespVO">CommonResultPageResultRealNameAuthRespVO</h2>

<a id="schemacommonresultpageresultrealnameauthrespvo"></a>
<a id="schema_CommonResultPageResultRealNameAuthRespVO"></a>
<a id="tocScommonresultpageresultrealnameauthrespvo"></a>
<a id="tocscommonresultpageresultrealnameauthrespvo"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "total": 0,
    "list": [
      {
        "id": 14326,
        "realName": "赵六",
        "idCardNumber": "string",
        "idCardFrontUrl": "string",
        "idCardBackUrl": "string",
        "sex": "string",
        "nation": "string",
        "birth": "string",
        "address": "string",
        "authority": "string",
        "validDate": "string",
        "portraitUrl": "string",
        "ocrQualityScore": 0,
        "facePhotoUrl": "string",
        "faceOrderNo": "string",
        "faceLiveRate": 0,
        "faceSimilarity": 0,
        "authStatus": 1,
        "authTime": "string",
        "failReason": "string",
        "authChannel": "string",
        "signatureUrl": "string",
        "createTime": "string"
      }
    ]
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[PageResultRealNameAuthRespVO](#schemapageresultrealnameauthrespvo)|false|none||返回数据|

<h2 id="tocS_AppMerchantSaveReqVO">AppMerchantSaveReqVO</h2>

<a id="schemaappmerchantsavereqvo"></a>
<a id="schema_AppMerchantSaveReqVO"></a>
<a id="tocSappmerchantsavereqvo"></a>
<a id="tocsappmerchantsavereqvo"></a>

```json
{
  "id": 26599,
  "appId": 19608,
  "merchantId": 9600,
  "status": 0,
  "cooperateTime": "string",
  "remark": "你说的对"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||主键|
|appId|integer(int64)|true|none||App ID|
|merchantId|integer(int64)|true|none||商户ID|
|status|integer|true|none||状态：0-合作中 1-已终止 2-申请中 3-已拒绝|
|cooperateTime|string|false|none||合作开始时间|
|remark|string|false|none||备注|

<h2 id="tocS_AppMerchantRespVO">AppMerchantRespVO</h2>

<a id="schemaappmerchantrespvo"></a>
<a id="schema_AppMerchantRespVO"></a>
<a id="tocSappmerchantrespvo"></a>
<a id="tocsappmerchantrespvo"></a>

```json
{
  "id": 26599,
  "appId": 19608,
  "merchantId": 9600,
  "status": 0,
  "cooperateTime": "string",
  "remark": "你说的对",
  "createTime": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||主键|
|appId|integer(int64)|false|none||App ID|
|merchantId|integer(int64)|false|none||商户ID|
|status|integer|false|none||状态：0-合作中 1-已终止 2-申请中 3-已拒绝|
|cooperateTime|string|false|none||合作开始时间|
|remark|string|false|none||备注|
|createTime|string|false|none||创建时间|

<h2 id="tocS_CommonResultAppMerchantRespVO">CommonResultAppMerchantRespVO</h2>

<a id="schemacommonresultappmerchantrespvo"></a>
<a id="schema_CommonResultAppMerchantRespVO"></a>
<a id="tocScommonresultappmerchantrespvo"></a>
<a id="tocscommonresultappmerchantrespvo"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "id": 26599,
    "appId": 19608,
    "merchantId": 9600,
    "status": 0,
    "cooperateTime": "string",
    "remark": "你说的对",
    "createTime": "string"
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[AppMerchantRespVO](#schemaappmerchantrespvo)|false|none||返回数据|

<h2 id="tocS_PageResultAppMerchantRespVO">PageResultAppMerchantRespVO</h2>

<a id="schemapageresultappmerchantrespvo"></a>
<a id="schema_PageResultAppMerchantRespVO"></a>
<a id="tocSpageresultappmerchantrespvo"></a>
<a id="tocspageresultappmerchantrespvo"></a>

```json
{
  "total": 0,
  "list": [
    {
      "id": 26599,
      "appId": 19608,
      "merchantId": 9600,
      "status": 0,
      "cooperateTime": "string",
      "remark": "你说的对",
      "createTime": "string"
    }
  ]
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|total|integer(int64)|false|none||总量|
|list|[[AppMerchantRespVO](#schemaappmerchantrespvo)]|false|none||数据|

<h2 id="tocS_CommonResultPageResultAppMerchantRespVO">CommonResultPageResultAppMerchantRespVO</h2>

<a id="schemacommonresultpageresultappmerchantrespvo"></a>
<a id="schema_CommonResultPageResultAppMerchantRespVO"></a>
<a id="tocScommonresultpageresultappmerchantrespvo"></a>
<a id="tocscommonresultpageresultappmerchantrespvo"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "total": 0,
    "list": [
      {
        "id": 26599,
        "appId": 19608,
        "merchantId": 9600,
        "status": 0,
        "cooperateTime": "string",
        "remark": "你说的对",
        "createTime": "string"
      }
    ]
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[PageResultAppMerchantRespVO](#schemapageresultappmerchantrespvo)|false|none||返回数据|

<h2 id="tocS_AlipayConfigSaveReqVO">AlipayConfigSaveReqVO</h2>

<a id="schemaalipayconfigsavereqvo"></a>
<a id="schema_AlipayConfigSaveReqVO"></a>
<a id="tocSalipayconfigsavereqvo"></a>
<a id="tocsalipayconfigsavereqvo"></a>

```json
{
  "id": 1,
  "appId": 100,
  "alipayAppId": "2021001234567890",
  "signType": "RSA2",
  "mode": 1,
  "privateKey": "string",
  "alipayPublicKey": "string",
  "appCertContent": "string",
  "alipayPublicCertContent": "string",
  "rootCertContent": "string",
  "serverUrl": "https://openapi.alipay.com/gateway.do",
  "status": 0
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||配置ID（更新时必填）|
|appId|integer(int64)|true|none||关联的open_app.id|
|alipayAppId|string|true|none||支付宝应用APPID|
|signType|string|false|none||签名算法|
|mode|integer|true|none||模式：1-公钥 2-证书|
|privateKey|string|true|none||应用私钥|
|alipayPublicKey|string|false|none||支付宝公钥（公钥模式）|
|appCertContent|string|false|none||应用公钥证书（证书模式）|
|alipayPublicCertContent|string|false|none||支付宝公钥证书（证书模式）|
|rootCertContent|string|false|none||支付宝根证书（证书模式）|
|serverUrl|string|false|none||支付宝网关地址|
|status|integer|false|none||状态：0-正常 1-禁用|

<h2 id="tocS_AlipayConfigRespVO">AlipayConfigRespVO</h2>

<a id="schemaalipayconfigrespvo"></a>
<a id="schema_AlipayConfigRespVO"></a>
<a id="tocSalipayconfigrespvo"></a>
<a id="tocsalipayconfigrespvo"></a>

```json
{
  "id": 1,
  "appId": 100,
  "alipayAppId": "2021001234567890",
  "signType": "RSA2",
  "mode": 1,
  "serverUrl": "https://openapi.alipay.com/gateway.do",
  "status": 0,
  "createTime": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||配置ID|
|appId|integer(int64)|false|none||关联的open_app.id|
|alipayAppId|string|false|none||支付宝应用APPID|
|signType|string|false|none||签名算法|
|mode|integer|false|none||模式：1-公钥 2-证书|
|serverUrl|string|false|none||支付宝网关地址|
|status|integer|false|none||状态：0-正常 1-禁用|
|createTime|string|false|none||创建时间|

<h2 id="tocS_CommonResultAlipayConfigRespVO">CommonResultAlipayConfigRespVO</h2>

<a id="schemacommonresultalipayconfigrespvo"></a>
<a id="schema_CommonResultAlipayConfigRespVO"></a>
<a id="tocScommonresultalipayconfigrespvo"></a>
<a id="tocscommonresultalipayconfigrespvo"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "id": 1,
    "appId": 100,
    "alipayAppId": "2021001234567890",
    "signType": "RSA2",
    "mode": 1,
    "serverUrl": "https://openapi.alipay.com/gateway.do",
    "status": 0,
    "createTime": "string"
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[AlipayConfigRespVO](#schemaalipayconfigrespvo)|false|none||返回数据|

<h2 id="tocS_CallbackTaskSaveReqVO">CallbackTaskSaveReqVO</h2>

<a id="schemacallbacktasksavereqvo"></a>
<a id="schema_CallbackTaskSaveReqVO"></a>
<a id="tocScallbacktasksavereqvo"></a>
<a id="tocscallbacktasksavereqvo"></a>

```json
{
  "id": 22853,
  "appId": 12825,
  "eventId": "evt_20260325_100001",
  "eventCode": "member_card.purchase.paid",
  "eventVersion": "1.0",
  "eventKey": "purchase:12345",
  "bizId": 21564,
  "payload": "string",
  "callbackUrl": "https://top.morplcp.cn",
  "signatureVersion": "v1",
  "status": 2,
  "nextRetryTime": "string",
  "retryCount": 2415,
  "maxRetryCount": 10778,
  "lastResponseCode": 0,
  "lastResponseBody": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||任务ID|
|appId|integer(int64)|true|none||App ID|
|eventId|string|true|none||事件唯一 ID|
|eventCode|string|true|none||事件编码|
|eventVersion|string|true|none||事件版本|
|eventKey|string|true|none||事件幂等键|
|bizId|integer(int64)|false|none||关联业务ID|
|payload|string|true|none||回调数据(JSON)|
|callbackUrl|string|true|none||回调地址|
|signatureVersion|string|true|none||签名版本|
|status|integer|true|none||状态：0-待推送 1-推送中 2-成功 3-失败|
|nextRetryTime|string|false|none||下次重试时间|
|retryCount|integer|true|none||已重试次数|
|maxRetryCount|integer|true|none||最大重试次数|
|lastResponseCode|integer|false|none||最后响应码|
|lastResponseBody|string|false|none||最后响应体|

<h2 id="tocS_CallbackTaskRespVO">CallbackTaskRespVO</h2>

<a id="schemacallbacktaskrespvo"></a>
<a id="schema_CallbackTaskRespVO"></a>
<a id="tocScallbacktaskrespvo"></a>
<a id="tocscallbacktaskrespvo"></a>

```json
{
  "id": 22853,
  "appId": 12825,
  "eventId": "evt_20260325_100001",
  "eventCode": "member_card.purchase.paid",
  "eventVersion": "1.0",
  "eventKey": "purchase:12345",
  "bizId": 21564,
  "payload": "string",
  "callbackUrl": "https://top.morplcp.cn",
  "signatureVersion": "v1",
  "status": 2,
  "nextRetryTime": "string",
  "retryCount": 2415,
  "maxRetryCount": 10778,
  "lastResponseCode": 0,
  "lastResponseBody": "string",
  "createTime": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||任务ID|
|appId|integer(int64)|false|none||App ID|
|eventId|string|false|none||事件唯一 ID|
|eventCode|string|false|none||事件编码|
|eventVersion|string|false|none||事件版本|
|eventKey|string|false|none||事件幂等键|
|bizId|integer(int64)|false|none||关联业务ID|
|payload|string|false|none||回调数据(JSON)|
|callbackUrl|string|false|none||回调地址|
|signatureVersion|string|false|none||签名版本|
|status|integer|false|none||状态：0-待推送 1-推送中 2-成功 3-失败待重试 4-最终失败|
|nextRetryTime|string|false|none||下次重试时间|
|retryCount|integer|false|none||已重试次数|
|maxRetryCount|integer|false|none||最大重试次数|
|lastResponseCode|integer|false|none||最后响应码|
|lastResponseBody|string|false|none||最后响应体|
|createTime|string|false|none||创建时间|

<h2 id="tocS_CommonResultCallbackTaskRespVO">CommonResultCallbackTaskRespVO</h2>

<a id="schemacommonresultcallbacktaskrespvo"></a>
<a id="schema_CommonResultCallbackTaskRespVO"></a>
<a id="tocScommonresultcallbacktaskrespvo"></a>
<a id="tocscommonresultcallbacktaskrespvo"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "id": 22853,
    "appId": 12825,
    "eventId": "evt_20260325_100001",
    "eventCode": "member_card.purchase.paid",
    "eventVersion": "1.0",
    "eventKey": "purchase:12345",
    "bizId": 21564,
    "payload": "string",
    "callbackUrl": "https://top.morplcp.cn",
    "signatureVersion": "v1",
    "status": 2,
    "nextRetryTime": "string",
    "retryCount": 2415,
    "maxRetryCount": 10778,
    "lastResponseCode": 0,
    "lastResponseBody": "string",
    "createTime": "string"
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[CallbackTaskRespVO](#schemacallbacktaskrespvo)|false|none||返回数据|

<h2 id="tocS_PageResultCallbackTaskRespVO">PageResultCallbackTaskRespVO</h2>

<a id="schemapageresultcallbacktaskrespvo"></a>
<a id="schema_PageResultCallbackTaskRespVO"></a>
<a id="tocSpageresultcallbacktaskrespvo"></a>
<a id="tocspageresultcallbacktaskrespvo"></a>

```json
{
  "total": 0,
  "list": [
    {
      "id": 22853,
      "appId": 12825,
      "eventId": "evt_20260325_100001",
      "eventCode": "member_card.purchase.paid",
      "eventVersion": "1.0",
      "eventKey": "purchase:12345",
      "bizId": 21564,
      "payload": "string",
      "callbackUrl": "https://top.morplcp.cn",
      "signatureVersion": "v1",
      "status": 2,
      "nextRetryTime": "string",
      "retryCount": 2415,
      "maxRetryCount": 10778,
      "lastResponseCode": 0,
      "lastResponseBody": "string",
      "createTime": "string"
    }
  ]
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|total|integer(int64)|false|none||总量|
|list|[[CallbackTaskRespVO](#schemacallbacktaskrespvo)]|false|none||数据|

<h2 id="tocS_CommonResultPageResultCallbackTaskRespVO">CommonResultPageResultCallbackTaskRespVO</h2>

<a id="schemacommonresultpageresultcallbacktaskrespvo"></a>
<a id="schema_CommonResultPageResultCallbackTaskRespVO"></a>
<a id="tocScommonresultpageresultcallbacktaskrespvo"></a>
<a id="tocscommonresultpageresultcallbacktaskrespvo"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "total": 0,
    "list": [
      {
        "id": 22853,
        "appId": 12825,
        "eventId": "evt_20260325_100001",
        "eventCode": "member_card.purchase.paid",
        "eventVersion": "1.0",
        "eventKey": "purchase:12345",
        "bizId": 21564,
        "payload": "string",
        "callbackUrl": "https://top.morplcp.cn",
        "signatureVersion": "v1",
        "status": 2,
        "nextRetryTime": "string",
        "retryCount": 2415,
        "maxRetryCount": 10778,
        "lastResponseCode": 0,
        "lastResponseBody": "string",
        "createTime": "string"
      }
    ]
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[PageResultCallbackTaskRespVO](#schemapageresultcallbacktaskrespvo)|false|none||返回数据|

<h2 id="tocS_DeveloperAccountTransactionSaveReqVO">DeveloperAccountTransactionSaveReqVO</h2>

<a id="schemadeveloperaccounttransactionsavereqvo"></a>
<a id="schema_DeveloperAccountTransactionSaveReqVO"></a>
<a id="tocSdeveloperaccounttransactionsavereqvo"></a>
<a id="tocsdeveloperaccounttransactionsavereqvo"></a>

```json
{
  "id": 1736,
  "accountId": 26362,
  "developerId": 19617,
  "transactionNo": "string",
  "title": "string",
  "transactionType": 1,
  "amount": 0,
  "balanceAfter": 0,
  "bizType": 2,
  "bizId": "9060",
  "appId": 15772,
  "remark": "你猜"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||流水ID|
|accountId|integer(int64)|true|none||账户ID|
|developerId|integer(int64)|true|none||开发者ID|
|transactionNo|string|true|none||流水号(唯一)|
|title|string|true|none||流水标题|
|transactionType|integer|true|none||交易类型：0-充值 1-赠送 2-API调用扣费 3-产品购买扣费 4-退款 5-平台调账 6-冻结 7-解冻|
|amount|integer|true|none||交易金额(分)，正数为入账，负数为出账|
|balanceAfter|integer|true|none||交易后余额(分)|
|bizType|integer|false|none||关联业务类型：0-充值订单 1-API调用 2-产品订购 3-平台操作|
|bizId|string|false|none||关联业务编号|
|appId|integer(int64)|false|none||关联App ID(API调用扣费时)|
|remark|string|false|none||备注|

<h2 id="tocS_DeveloperAccountTransactionRespVO">DeveloperAccountTransactionRespVO</h2>

<a id="schemadeveloperaccounttransactionrespvo"></a>
<a id="schema_DeveloperAccountTransactionRespVO"></a>
<a id="tocSdeveloperaccounttransactionrespvo"></a>
<a id="tocsdeveloperaccounttransactionrespvo"></a>

```json
{
  "id": 1736,
  "accountId": 26362,
  "developerId": 19617,
  "transactionNo": "string",
  "title": "string",
  "transactionType": 1,
  "amount": 0,
  "balanceAfter": 0,
  "bizType": 2,
  "bizId": "9060",
  "appId": 15772,
  "remark": "你猜",
  "createTime": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||流水ID|
|accountId|integer(int64)|false|none||账户ID|
|developerId|integer(int64)|false|none||开发者ID|
|transactionNo|string|false|none||流水号(唯一)|
|title|string|false|none||流水标题|
|transactionType|integer|false|none||交易类型：0-充值 1-赠送 2-API调用扣费 3-产品购买扣费 4-退款 5-平台调账 6-冻结 7-解冻|
|amount|integer|false|none||交易金额(分)，正数为入账，负数为出账|
|balanceAfter|integer|false|none||交易后余额(分)|
|bizType|integer|false|none||关联业务类型：0-充值订单 1-API调用 2-产品订购 3-平台操作|
|bizId|string|false|none||关联业务编号|
|appId|integer(int64)|false|none||关联App ID(API调用扣费时)|
|remark|string|false|none||备注|
|createTime|string|false|none||创建时间|

<h2 id="tocS_CommonResultDeveloperAccountTransactionRespVO">CommonResultDeveloperAccountTransactionRespVO</h2>

<a id="schemacommonresultdeveloperaccounttransactionrespvo"></a>
<a id="schema_CommonResultDeveloperAccountTransactionRespVO"></a>
<a id="tocScommonresultdeveloperaccounttransactionrespvo"></a>
<a id="tocscommonresultdeveloperaccounttransactionrespvo"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "id": 1736,
    "accountId": 26362,
    "developerId": 19617,
    "transactionNo": "string",
    "title": "string",
    "transactionType": 1,
    "amount": 0,
    "balanceAfter": 0,
    "bizType": 2,
    "bizId": "9060",
    "appId": 15772,
    "remark": "你猜",
    "createTime": "string"
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[DeveloperAccountTransactionRespVO](#schemadeveloperaccounttransactionrespvo)|false|none||返回数据|

<h2 id="tocS_PageResultDeveloperAccountTransactionRespVO">PageResultDeveloperAccountTransactionRespVO</h2>

<a id="schemapageresultdeveloperaccounttransactionrespvo"></a>
<a id="schema_PageResultDeveloperAccountTransactionRespVO"></a>
<a id="tocSpageresultdeveloperaccounttransactionrespvo"></a>
<a id="tocspageresultdeveloperaccounttransactionrespvo"></a>

```json
{
  "total": 0,
  "list": [
    {
      "id": 1736,
      "accountId": 26362,
      "developerId": 19617,
      "transactionNo": "string",
      "title": "string",
      "transactionType": 1,
      "amount": 0,
      "balanceAfter": 0,
      "bizType": 2,
      "bizId": "9060",
      "appId": 15772,
      "remark": "你猜",
      "createTime": "string"
    }
  ]
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|total|integer(int64)|false|none||总量|
|list|[[DeveloperAccountTransactionRespVO](#schemadeveloperaccounttransactionrespvo)]|false|none||数据|

<h2 id="tocS_CommonResultPageResultDeveloperAccountTransactionRespVO">CommonResultPageResultDeveloperAccountTransactionRespVO</h2>

<a id="schemacommonresultpageresultdeveloperaccounttransactionrespvo"></a>
<a id="schema_CommonResultPageResultDeveloperAccountTransactionRespVO"></a>
<a id="tocScommonresultpageresultdeveloperaccounttransactionrespvo"></a>
<a id="tocscommonresultpageresultdeveloperaccounttransactionrespvo"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "total": 0,
    "list": [
      {
        "id": 1736,
        "accountId": 26362,
        "developerId": 19617,
        "transactionNo": "string",
        "title": "string",
        "transactionType": 1,
        "amount": 0,
        "balanceAfter": 0,
        "bizType": 2,
        "bizId": "9060",
        "appId": 15772,
        "remark": "你猜",
        "createTime": "string"
      }
    ]
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|msg|string|false|none||错误提示，用户可阅读|
|data|[PageResultDeveloperAccountTransactionRespVO](#schemapageresultdeveloperaccounttransactionrespvo)|false|none||返回数据|

