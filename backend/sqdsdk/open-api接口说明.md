# Open API 接口说明文档

生成时间：2026-04-29

> 本文档由当前代码注解自动生成，接口路径已补齐全局前缀 `/open-api`。请求和响应均采用 `CommonResult<T>` 包装，常见结构为 `{ code, data, msg }`。

## 调用约定

- 测试环境 Base URL：`https://test-api.xuancore.com/open-api`
- 鉴权请求头：`X-App-Key`、`X-Timestamp`、`X-Nonce`、`X-Sign`。
- 签名算法：`Base64(HMAC_SHA256(appSecret, appKey + timestamp + nonce + body))`，其中 `timestamp` 为秒级时间戳，有效期 5 分钟；`nonce` 5 分钟内不能重复。
- 权限列格式：`模块:权限类型`，权限类型包括 `READ`、`WRITE`、`FULL`。

## 接口清单

共 217 个接口。

### 开放平台 - 固定收款码

| 方法 | 路径 | 说明 | 鉴权 | 权限 | 参数 | 请求体 | 返回 | 源文件 |
|---|---|---|---|---|---|---|---|---|
| POST | `/open-api/open-api/fixed-qrcode/create` | 创建固定收款码 | OpenAPI签名 | - | - | OpenApiFixedQrcodeCreateReqVO | CommonResult<OpenApiFixedQrcodeRespVO> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/fixedqrcode/OpenApiFixedQrcodeController.java |
| DELETE | `/open-api/open-api/fixed-qrcode/delete` | 删除固定收款码 | OpenAPI签名 | - | Query:id<br>Query:merchantId | - | CommonResult<Boolean> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/fixedqrcode/OpenApiFixedQrcodeController.java |
| GET | `/open-api/open-api/fixed-qrcode/list` | 查询当前App为指定商户创建的固定收款码列表 | OpenAPI签名 | - | Query:merchantId | - | CommonResult<List<OpenApiFixedQrcodeRespVO>> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/fixedqrcode/OpenApiFixedQrcodeController.java |

### 开放平台 - 银行信息

| 方法 | 路径 | 说明 | 鉴权 | 权限 | 参数 | 请求体 | 返回 | 源文件 |
|---|---|---|---|---|---|---|---|---|
| GET | `/open-api/v1/bank/list` | 获取全部银行列表 | 免签名 | - | Query:keyword? | - | CommonResult<List<OpenApiBankRespVO>> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/bank/OpenApiBankController.java |

### 开放平台 - 计费预定

| 方法 | 路径 | 说明 | 鉴权 | 权限 | 参数 | 请求体 | 返回 | 源文件 |
|---|---|---|---|---|---|---|---|---|
| POST | `/open-api/v1/billing/cleaning/{recordId}/complete` | 完成打扫（含拍照） | OpenAPI签名 | billing:WRITE | Path:recordId<br>Query:photos<br>Query:remark? | - | CommonResult<Boolean> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/billing/OpenApiBillingController.java |
| POST | `/open-api/v1/billing/cleaning/{recordId}/start` | 开始打扫 | OpenAPI签名 | billing:WRITE | Path:recordId<br>Query:cleanerId<br>Query:cleanerName | - | CommonResult<Boolean> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/billing/OpenApiBillingController.java |
| GET | `/open-api/v1/billing/cleaning/pending-list` | 查询待打扫列表 | OpenAPI签名 | billing:READ | Query:merchantId | - | CommonResult<List<Map<String, Object>>> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/billing/OpenApiBillingController.java |
| GET | `/open-api/v1/billing/dashboard` | 今日营收看板 | OpenAPI签名 | billing:READ | Query:merchantId | - | CommonResult<java.util.Map<String, Object>> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/billing/OpenApiBillingController.java |
| POST | `/open-api/v1/billing/device/event` | 接收设备事件回调 | OpenAPI签名 | billing:WRITE | - | OpenDeviceEventReqDTO | CommonResult<Boolean> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/billing/OpenApiBillingController.java |
| POST | `/open-api/v1/billing/order/{orderId}/cancel` | 取消订单 | OpenAPI签名 | billing:WRITE | Path:orderId<br>Query:reason? | - | CommonResult<Boolean> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/billing/OpenApiBillingController.java |
| POST | `/open-api/v1/billing/order/{orderId}/end-usage` | 结束使用（退房） | OpenAPI签名 | billing:WRITE | Path:orderId | - | CommonResult<Boolean> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/billing/OpenApiBillingController.java |
| POST | `/open-api/v1/billing/order/{orderId}/force-end` | 强制结束订单 | OpenAPI签名 | billing:WRITE | Path:orderId | - | CommonResult<Boolean> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/billing/OpenApiBillingController.java |
| POST | `/open-api/v1/billing/order/{orderId}/renew` | 续费 | OpenAPI签名 | billing:WRITE | Path:orderId<br>Query:additionalMinutes | - | CommonResult<OpenBillingRenewalRespDTO> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/billing/OpenApiBillingController.java |
| POST | `/open-api/v1/billing/order/{orderId}/renew-with-pay` | 续费并创建支付订单 | OpenAPI签名 | billing:WRITE | Path:orderId<br>Query:additionalMinutes | - | CommonResult<OpenBillingRenewalRespDTO> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/billing/OpenApiBillingController.java |
| POST | `/open-api/v1/billing/order/{orderId}/start-usage` | 开始使用（开锁） | OpenAPI签名 | billing:WRITE | Path:orderId | - | CommonResult<Boolean> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/billing/OpenApiBillingController.java |
| POST | `/open-api/v1/billing/order/create-package` | 创建套餐模式订单 | OpenAPI签名 | billing:WRITE | - | OpenBillingPackageOrderCreateReqDTO | CommonResult<OpenBillingOrderRespDTO> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/billing/OpenApiBillingController.java |
| POST | `/open-api/v1/billing/order/create-prepaid` | 创建预付模式订单 | OpenAPI签名 | billing:WRITE | - | OpenBillingOrderCreateReqDTO | CommonResult<OpenBillingOrderRespDTO> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/billing/OpenApiBillingController.java |
| GET | `/open-api/v1/billing/order/get` | 查询订单详情 | OpenAPI签名 | billing:READ | Query:orderId | - | CommonResult<OpenBillingOrderRespDTO> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/billing/OpenApiBillingController.java |
| GET | `/open-api/v1/billing/order/my-orders` | 查询用户的预定订单列表 | OpenAPI签名 | billing:READ | Query:externalUserId<br>Query:status?<br>QueryObject:PageParam | - | CommonResult<PageResult<OpenBillingOrderRespDTO>> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/billing/OpenApiBillingController.java |
| POST | `/open-api/v1/billing/order/page` | 分页查询订单 | OpenAPI签名 | billing:READ | - | OpenBillingOrderPageReqDTO | CommonResult<PageResult<OpenBillingOrderRespDTO>> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/billing/OpenApiBillingController.java |
| POST | `/open-api/v1/billing/package/create` | 创建套餐 | OpenAPI签名 | billing:WRITE | - | OpenBillingPackageSaveReqDTO | CommonResult<Long> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/billing/OpenApiBillingController.java |
| GET | `/open-api/v1/billing/package/list` | 查询商户套餐列表 | OpenAPI签名 | billing:READ | Query:merchantId | - | CommonResult<List<OpenBillingPackageRespDTO>> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/billing/OpenApiBillingController.java |
| POST | `/open-api/v1/billing/package/update` | 更新套餐 | OpenAPI签名 | billing:WRITE | - | OpenBillingPackageSaveReqDTO | CommonResult<Boolean> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/billing/OpenApiBillingController.java |
| GET | `/open-api/v1/billing/price/get` | 查询资源价格配置 | OpenAPI签名 | billing:READ | Query:resourceId<br>Query:merchantId | - | CommonResult<OpenResourcePriceRespDTO> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/billing/OpenApiBillingController.java |
| POST | `/open-api/v1/billing/price/save` | 保存资源价格配置 | OpenAPI签名 | billing:WRITE | - | OpenResourcePriceSaveReqDTO | CommonResult<Long> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/billing/OpenApiBillingController.java |
| POST | `/open-api/v1/billing/resource/{resourceId}/confirm-cleaning` | 确认打扫完毕 | OpenAPI签名 | billing:WRITE | Path:resourceId | - | CommonResult<Boolean> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/billing/OpenApiBillingController.java |
| POST | `/open-api/v1/billing/resource/{resourceId}/lock` | 远程关锁 | OpenAPI签名 | billing:WRITE | Path:resourceId | - | CommonResult<Boolean> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/billing/OpenApiBillingController.java |
| GET | `/open-api/v1/billing/resource/{resourceId}/timeline` | 查询资源时间轴 | OpenAPI签名 | billing:READ | Path:resourceId<br>Query:date | - | CommonResult<List<Map<String, Object>>> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/billing/OpenApiBillingController.java |
| POST | `/open-api/v1/billing/resource/{resourceId}/unlock` | 远程开锁 | OpenAPI签名 | billing:WRITE | Path:resourceId | - | CommonResult<Boolean> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/billing/OpenApiBillingController.java |
| POST | `/open-api/v1/billing/resource/batch-lock` | 批量关锁 | OpenAPI签名 | billing:WRITE | - | List | CommonResult<Boolean> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/billing/OpenApiBillingController.java |
| POST | `/open-api/v1/billing/resource/batch-unlock` | 批量开锁 | OpenAPI签名 | billing:WRITE | - | List | CommonResult<Boolean> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/billing/OpenApiBillingController.java |

### 开放平台 - IoT 设备控制

> 新 IoT 接口面向合作方/客户系统对接。所有接口必须使用 OpenAPI 签名，并申请 `iot:READ` 或 `iot:WRITE` 权限；服务端会校验当前应用与 `merchantId` 的合作关系。

| 方法 | 路径 | 说明 | 鉴权 | 权限 | 参数 | 请求体 | 返回 | 源文件 |
|---|---|---|---|---|---|---|---|---|
| POST | `/open-api/v1/iot/devices/bind` | 绑定或注册 IoT 设备 | OpenAPI签名 | iot:WRITE | - | IotDeviceBindReqDTO | CommonResult<Long> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/iot/OpenApiIotController.java |
| POST | `/open-api/v1/iot/devices/unbind-resource` | 解绑资源设备 | OpenAPI签名 | iot:WRITE | - | IotDeviceUnbindReqDTO | CommonResult<Boolean> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/iot/OpenApiIotController.java |
| POST | `/open-api/v1/iot/devices/list` | 查询 IoT 设备列表 | OpenAPI签名 | iot:READ | - | IotDeviceQueryReqDTO | CommonResult<List<IotDeviceRespDTO>> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/iot/OpenApiIotController.java |
| GET | `/open-api/v1/iot/devices/get-by-device-no` | 根据设备编号查询 IoT 设备 | OpenAPI签名 | iot:READ | Query:merchantId<br>Query:deviceNo | - | CommonResult<IotDeviceRespDTO> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/iot/OpenApiIotController.java |
| GET | `/open-api/v1/iot/devices/shadow` | 查询设备影子 | OpenAPI签名 | iot:READ | Query:merchantId<br>Query:deviceNo | - | CommonResult<IotDeviceShadowRespDTO> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/iot/OpenApiIotController.java |
| POST | `/open-api/v1/iot/devices/command` | 下发设备命令 | OpenAPI签名 | iot:WRITE | Query:merchantId | IotDeviceCommandReqDTO | CommonResult<IotDeviceCommandRespDTO> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/iot/OpenApiIotController.java |
| POST | `/open-api/v1/iot/devices/events` | 上报设备事件 | OpenAPI签名 | iot:WRITE | - | IotDeviceEventReqDTO | CommonResult<Boolean> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/iot/OpenApiIotController.java |
| POST | `/open-api/v1/iot/actions/templates/save` | 保存资源动作模板 | OpenAPI签名 | iot:WRITE | - | IotActionTemplateSaveReqDTO | CommonResult<Long> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/iot/OpenApiIotController.java |
| GET | `/open-api/v1/iot/actions/templates` | 查询资源动作模板 | OpenAPI签名 | iot:READ | Query:merchantId<br>Query:storeId?<br>Query:resourceType? | - | CommonResult<List<IotActionTemplateRespDTO>> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/iot/OpenApiIotController.java |
| POST | `/open-api/v1/iot/actions/execute` | 执行资源动作 | OpenAPI签名 | iot:WRITE | - | IotResourceActionReqDTO | CommonResult<IotResourceActionRespDTO> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/iot/OpenApiIotController.java |
| GET | `/open-api/v1/iot/actions/get` | 查询资源动作执行结果 | OpenAPI签名 | iot:READ | Query:actionNo | - | CommonResult<IotResourceActionRespDTO> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/iot/OpenApiIotController.java |

**对接注意事项**

- 设备绑定时 `merchantId` 必填，`storeId/resourceId` 按实际业务填写；如果设备用于某个棋牌室、台球桌、洗车位、足浴房、KTV 包厢，必须传 `resourceId`。
- `deviceRole` 用于动作编排，例如主门锁传 `MAIN_LOCK`，台球桌灯传 `TABLE_LIGHT`，洗车机传 `WASHER`，电源控制传 `POWER`。
- 建议客户系统优先调用 `/actions/execute` 执行业务动作，不直接拼多个 `/devices/command`，这样可以通过动作模板统一控制多设备、多步骤和超时结果。
- 设备事件建议带 `eventNo` 做幂等；命令回执必须带 `commandNo`，否则只能更新设备影子，无法关联动作步骤。

**动作模板 commandPlan 示例**

```json
[
  {
    "stepNo": 1,
    "stepName": "主门锁开锁",
    "deviceRole": "MAIN_LOCK",
    "commandType": "UNLOCK",
    "payload": "{\"expireSeconds\":30}",
    "required": true
  },
  {
    "stepNo": 2,
    "stepName": "开启电源",
    "deviceRole": "POWER",
    "commandType": "POWER_ON",
    "required": true
  }
]
```

### 开放平台 - 预约数据

| 方法 | 路径 | 说明 | 鉴权 | 权限 | 参数 | 请求体 | 返回 | 源文件 |
|---|---|---|---|---|---|---|---|---|
| GET | `/open-api/v1/booking/available-slots` | 查询可用预约时间段 | OpenAPI签名 | booking:READ | QueryObject:OpenApiBookingAvailableSlotsReqVO | - | CommonResult<List<OpenBookingAvailableSlotRespDTO>> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/booking/OpenApiBookingController.java |
| GET | `/open-api/v1/booking/orders` | 查询预约列表 | OpenAPI签名 | booking:READ | QueryObject:OpenApiBookingOrderPageReqVO | - | CommonResult<PageResult<OpenBookingOrderRespDTO>> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/booking/OpenApiBookingController.java |
| POST | `/open-api/v1/booking/orders` | 创建预约订单 | OpenAPI签名 | booking:WRITE | - | OpenApiBookingOrderCreateReqVO | CommonResult<Long> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/booking/OpenApiBookingController.java |
| GET | `/open-api/v1/booking/orders/{orderId}` | 查询预约详情 | OpenAPI签名 | booking:READ | Path:orderId<br>Query:merchantId | - | CommonResult<OpenBookingOrderRespDTO> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/booking/OpenApiBookingController.java |
| PUT | `/open-api/v1/booking/orders/{orderId}` | 变更预约 | OpenAPI签名 | booking:WRITE | Path:orderId<br>Query:merchantId | OpenApiBookingOrderUpdateReqVO | CommonResult<Boolean> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/booking/OpenApiBookingController.java |
| POST | `/open-api/v1/booking/orders/{orderId}/cancel` | 取消预约 | OpenAPI签名 | booking:WRITE | Path:orderId<br>Query:merchantId | OpenApiBookingOrderCancelReqVO | CommonResult<Boolean> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/booking/OpenApiBookingController.java |
| POST | `/open-api/v1/booking/orders/{orderId}/complete` | 完成服务 | OpenAPI签名 | booking:WRITE | Path:orderId<br>Query:merchantId | - | CommonResult<Boolean> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/booking/OpenApiBookingController.java |
| POST | `/open-api/v1/booking/orders/{orderId}/confirm` | 确认预约 | OpenAPI签名 | booking:WRITE | Path:orderId<br>Query:merchantId | OpenApiBookingOrderConfirmReqVO | CommonResult<Boolean> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/booking/OpenApiBookingController.java |
| POST | `/open-api/v1/booking/orders/{orderId}/start` | 开始服务 | OpenAPI签名 | booking:WRITE | Path:orderId<br>Query:merchantId | - | CommonResult<Boolean> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/booking/OpenApiBookingController.java |
| GET | `/open-api/v1/booking/statistics` | 查询预约统计 | OpenAPI签名 | booking:READ | Query:merchantId | - | CommonResult<OpenBookingStatisticsRespDTO> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/booking/OpenApiBookingController.java |

预约创建会校验资源启用状态、是否接受预约、资源排班、休息日、最小提前预约时间和已有时间占用；创建成功后写入 `merchant_booking_order_resource` 与 `merchant_booking_time_slot`。取消预约会释放时间占用，开始服务会把资源标记为占用中并尝试执行 IoT `START_USAGE` 动作，完成服务会完成占用、释放资源并尝试执行 IoT `END_USAGE` 动作。人员类资源支持商户端轮排队列，自动分配时优先选择队列中的可用人员。

### 开放平台 - 会员卡数据

| 方法 | 路径 | 说明 | 鉴权 | 权限 | 参数 | 请求体 | 返回 | 源文件 |
|---|---|---|---|---|---|---|---|---|
| GET | `/open-api/v1/card-templates` | 查询会员卡模板列表 | OpenAPI签名 | member_card:READ | QueryObject:OpenApiCardTemplatePageReqVO | - | CommonResult<PageResult<OpenCardTemplateRespDTO>> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/membercard/OpenApiMemberCardController.java |
| GET | `/open-api/v1/card-templates/{templateId}` | 查询会员卡模板详情 | OpenAPI签名 | member_card:READ | Path:templateId | - | CommonResult<OpenCardTemplateRespDTO> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/membercard/OpenApiMemberCardController.java |
| POST | `/open-api/v1/member-card-purchases` | 创建会员卡购买单 | OpenAPI签名 | member_card:WRITE | - | OpenApiMemberCardPurchaseCreateReqVO | CommonResult<OpenMemberCardPurchaseDetailRespDTO> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/membercard/OpenApiMemberCardController.java |
| GET | `/open-api/v1/member-card-purchases/{purchaseId}` | 查询会员卡购买单 | OpenAPI签名 | member_card:READ | Path:purchaseId | - | CommonResult<OpenMemberCardPurchaseDetailRespDTO> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/membercard/OpenApiMemberCardController.java |
| POST | `/open-api/v1/member-card-purchases/{purchaseId}/cashier` | 创建会员卡购买收银台 | OpenAPI签名 | member_card:WRITE | Path:purchaseId | OpenApiMemberCardPurchaseCashierReqVO | CommonResult<OpenMemberCardPurchaseCashierRespDTO> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/membercard/OpenApiMemberCardController.java |
| GET | `/open-api/v1/member-cards` | 查询会员卡列表 | OpenAPI签名 | member_card:READ | QueryObject:OpenApiMemberCardPageReqVO | - | CommonResult<PageResult<OpenApiMemberCardRespVO>> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/membercard/OpenApiMemberCardController.java |
| GET | `/open-api/v1/member-cards/{cardNo}` | 查询会员卡详情 | OpenAPI签名 | member_card:READ | Path:cardNo | - | CommonResult<OpenApiMemberCardRespVO> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/membercard/OpenApiMemberCardController.java |
| GET | `/open-api/v1/member-cards/{cardNo}/consumption-records` | 查询会员卡消费记录 | OpenAPI签名 | member_card:READ | Path:cardNo<br>QueryObject:OpenApiConsumptionRecordPageReqVO | - | CommonResult<PageResult<OpenConsumptionRecordRespDTO>> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/membercard/OpenApiMemberCardController.java |
| POST | `/open-api/v1/member-cards/{cardNo}/recharge` | 会员卡充值 | OpenAPI签名 | member_card:WRITE | Path:cardNo | OpenApiMemberCardRechargeReqVO | CommonResult<Boolean> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/membercard/OpenApiMemberCardController.java |
| POST | `/open-api/v1/member-cards/{cardNo}/write-off-qrcode` | 生成会员卡核销二维码 | OpenAPI签名 | member_card:WRITE | Path:cardNo | - | CommonResult<OpenApiMemberCardWriteOffQrRespVO> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/membercard/OpenApiMemberCardController.java |
| POST | `/open-api/v1/member-cards/refund/apply` | 申请会员卡退款 | OpenAPI签名 | member_card:WRITE | - | OpenApiMemberCardRefundApplyReqVO | CommonResult<Boolean> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/membercard/OpenApiMemberCardController.java |
| GET | `/open-api/v1/member-cards/statistics` | 查询会员卡统计 | OpenAPI签名 | member_card:READ | Query:merchantId | - | CommonResult<OpenMemberCardStatisticsRespDTO> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/membercard/OpenApiMemberCardController.java |
| GET | `/open-api/v1/member-cards/write-off-records/{requestNo}` | 查询会员卡核销记录 | OpenAPI签名 | member_card:READ | Path:requestNo | - | CommonResult<OpenApiMemberCardWriteOffRecordRespVO> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/membercard/OpenApiMemberCardController.java |
| POST | `/open-api/v1/member-cards/write-off-records/{requestNo}/confirm` | 确认会员卡核销 | OpenAPI签名 | member_card:WRITE | Path:requestNo | OpenApiMemberCardWriteOffConfirmReqVO | CommonResult<OpenApiMemberCardWriteOffRecordRespVO> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/membercard/OpenApiMemberCardController.java |

### 开放平台 - 抵金券

| 方法 | 路径 | 说明 | 鉴权 | 权限 | 参数 | 请求体 | 返回 | 源文件 |
|---|---|---|---|---|---|---|---|---|
| POST | `/open-api/v1/cash-voucher/{voucherId}/write-off-qrcode` | 生成抵金券核销二维码 | OpenAPI签名 | cash_voucher:WRITE | Path:voucherId<br>Query:merchantId | - | CommonResult<OpenWriteOffQrRespDTO> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/cashvoucher/OpenApiCashVoucherController.java |
| POST | `/open-api/v1/cash-voucher/acquire` | 购买抵金券 | OpenAPI签名 | cash_voucher:WRITE | - | OpenApiCashVoucherAcquireReqVO | CommonResult<OpenApiCashVoucherAcquireRespVO> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/cashvoucher/OpenApiCashVoucherController.java |
| POST | `/open-api/v1/cash-voucher/gift` | 赠送抵金券 | OpenAPI签名 | cash_voucher:WRITE | - | OpenApiCashVoucherGiftReqVO | CommonResult<OpenApiCashVoucherGiftRespVO> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/cashvoucher/OpenApiCashVoucherController.java |
| GET | `/open-api/v1/cash-voucher/purchase-discount-config` | 查询抵金券购买折扣配置 | OpenAPI签名 | cash_voucher:READ | Query:merchantId | - | CommonResult<OpenApiCashVoucherPurchaseDiscountConfigRespVO> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/cashvoucher/OpenApiCashVoucherController.java |
| GET | `/open-api/v1/cash-voucher/purchases/{purchaseId}` | 查询抵金券购买单 | OpenAPI签名 | cash_voucher:READ | Path:purchaseId | - | CommonResult<CashVoucherPurchaseDetailRespDTO> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/cashvoucher/OpenApiCashVoucherController.java |
| POST | `/open-api/v1/cash-voucher/purchases/{purchaseId}/cashier` | 创建抵金券购买收银台 | OpenAPI签名 | cash_voucher:WRITE | Path:purchaseId | OpenApiCashVoucherPurchaseCashierReqVO | CommonResult<CashVoucherPurchaseCashierRespDTO> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/cashvoucher/OpenApiCashVoucherController.java |
| POST | `/open-api/v1/cash-voucher/refund` | 申请抵金券退款 | OpenAPI签名 | cash_voucher:WRITE | - | OpenApiCashVoucherRefundReqVO | CommonResult<Boolean> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/cashvoucher/OpenApiCashVoucherController.java |
| POST | `/open-api/v1/cash-voucher/revoke-gift` | 撤回赠送的抵金券 | OpenAPI签名 | cash_voucher:WRITE | - | OpenApiCashVoucherRevokeGiftReqVO | CommonResult<Boolean> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/cashvoucher/OpenApiCashVoucherController.java |
| GET | `/open-api/v1/cash-voucher/write-off-records/{requestNo}` | 查询抵金券核销记录 | OpenAPI签名 | cash_voucher:READ | Path:requestNo | - | CommonResult<OpenWriteOffRecordRespDTO> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/cashvoucher/OpenApiCashVoucherController.java |

### 开放平台 - 评论

| 方法 | 路径 | 说明 | 鉴权 | 权限 | 参数 | 请求体 | 返回 | 源文件 |
|---|---|---|---|---|---|---|---|---|
| POST | `/open-api/v1/comment/append` | 追评 | OpenAPI签名 | comment:WRITE | Query:commentId<br>Query:externalUserId<br>Query:content<br>Query:images? | - | CommonResult<Long> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/comment/OpenApiCommentController.java |
| POST | `/open-api/v1/comment/batch-replies` | 批量查询评论回复 | OpenAPI签名 | comment:READ | - | Map | CommonResult<Map<Long, List<OpenCommentReplyRespDTO>>> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/comment/OpenApiCommentController.java |
| POST | `/open-api/v1/comment/create` | 提交评价 | OpenAPI签名 | comment:WRITE | - | OpenCommentCreateReqDTO | CommonResult<Long> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/comment/OpenApiCommentController.java |
| POST | `/open-api/v1/comment/delete` | 删除评价 | OpenAPI签名 | comment:WRITE | Query:commentId<br>Query:externalUserId | - | CommonResult<Boolean> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/comment/OpenApiCommentController.java |
| GET | `/open-api/v1/comment/get` | 评论详情 | OpenAPI签名 | comment:READ | Query:commentId<br>Query:externalUserId? | - | CommonResult<OpenCommentRespDTO> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/comment/OpenApiCommentController.java |
| POST | `/open-api/v1/comment/like` | 点赞/取消点赞 | OpenAPI签名 | comment:WRITE | Query:commentId<br>Query:externalUserId | - | CommonResult<Boolean> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/comment/OpenApiCommentController.java |
| GET | `/open-api/v1/comment/my-page` | 我的评论列表 | OpenAPI签名 | comment:READ | Query:externalUserId<br>QueryObject:PageParam | - | CommonResult<PageResult<OpenCommentRespDTO>> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/comment/OpenApiCommentController.java |
| GET | `/open-api/v1/comment/page` | 评论列表 | OpenAPI签名 | comment:READ | Query:merchantId?<br>Query:storeId?<br>Query:rating?<br>QueryObject:PageParam | - | CommonResult<PageResult<OpenCommentRespDTO>> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/comment/OpenApiCommentController.java |
| POST | `/open-api/v1/comment/report` | 举报评论 | OpenAPI签名 | comment:WRITE | Query:commentId<br>Query:externalUserId<br>Query:reportType<br>Query:reportReason | - | CommonResult<Long> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/comment/OpenApiCommentController.java |
| GET | `/open-api/v1/comment/stats` | 评论统计 | OpenAPI签名 | comment:READ | Query:merchantId | - | CommonResult<Map<String, Object>> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/comment/OpenApiCommentController.java |
| GET | `/open-api/v1/comment/tags` | 评论标签列表 | OpenAPI签名 | comment:READ | Query:merchantId | - | CommonResult<List<Map<String, Object>>> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/comment/OpenApiCommentController.java |

### 开放平台 - 消费任务

| 方法 | 路径 | 说明 | 鉴权 | 权限 | 参数 | 请求体 | 返回 | 源文件 |
|---|---|---|---|---|---|---|---|---|
| GET | `/open-api/v1/consumption-tasks` | 查询商户已上架的消费任务列表（支持门店过滤，可选回填当前用户进度） | OpenAPI签名 | member:READ | Query:merchantId<br>Query:storeId?<br>Query:externalUserId? | - | CommonResult<List<OpenApiConsumptionTaskRespVO>> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/consumptiontask/OpenApiConsumptionTaskController.java |
| GET | `/open-api/v1/consumption-tasks/{taskId}` | 查询消费任务详情（含商户信息、门店信息、用户余额卡和任务期间充值记录） | OpenAPI签名 | member:READ | Path:taskId<br>Query:externalUserId?<br>Query:merchantId? | - | CommonResult<OpenApiTaskDetailRespVO> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/consumptiontask/OpenApiConsumptionTaskController.java |
| POST | `/open-api/v1/consumption-tasks/activate-unbound` | 立即激活该用户在指定商户下未激活的无主消费（按商户一次性激活，UX 触发门店仅做响应明细拆分） | OpenAPI签名 | member:WRITE | - | OpenApiActivateUnboundReqVO | CommonResult<OpenApiActivateUnboundRespVO> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/consumptiontask/OpenApiConsumptionTaskController.java |
| POST | `/open-api/v1/consumption-tasks/batch-claim-by-store` | 按门店批量领取任务（指定用户在指定门店下所有适用的消费任务一次性领取） | OpenAPI签名 | member:WRITE | - | OpenApiBatchClaimByStoreReqVO | CommonResult<OpenApiBatchClaimByStoreRespVO> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/consumptiontask/OpenApiConsumptionTaskController.java |
| POST | `/open-api/v1/consumption-tasks/claim` | 领取任务 | OpenAPI签名 | member:WRITE | - | OpenApiTaskClaimReqVO | CommonResult<OpenApiTaskRecordRespVO> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/consumptiontask/OpenApiConsumptionTaskController.java |
| GET | `/open-api/v1/consumption-tasks/my-tasks` | 查询用户跨商户的任务记录列表（按门店分组，组内按完成进度降序；传经纬度时外层按距离升序；可按商户名或门店名关键字过滤） | OpenAPI签名 | member:READ | Query:externalUserId<br>Query:status?<br>Query:latitude?<br>Query:longitude?<br>Query:keyword? | - | CommonResult<List<OpenApiStoreTaskGroupRespVO>> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/consumptiontask/OpenApiConsumptionTaskController.java |
| GET | `/open-api/v1/consumption-tasks/records` | 查询用户的任务记录列表（分页 + 状态筛选） | OpenAPI签名 | member:READ | Query:externalUserId<br>Query:merchantId<br>Query:status?<br>Query:pageNo<br>Query:pageSize | - | CommonResult<PageResult<OpenApiTaskRecordRespVO>> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/consumptiontask/OpenApiConsumptionTaskController.java |
| POST | `/open-api/v1/consumption-tasks/records/{recordId}/claim-reward` | 领取任务奖励 | OpenAPI签名 | member:WRITE | Path:recordId<br>Query:externalUserId<br>Query:merchantId | - | CommonResult<Boolean> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/consumptiontask/OpenApiConsumptionTaskController.java |
| GET | `/open-api/v1/consumption-tasks/store-detail` | 查询用户在指定门店下的任务聚合详情（含门店、商户、余额卡、任务列表、任务期间充值记录） | OpenAPI签名 | member:READ | Query:externalUserId<br>Query:storeId | - | CommonResult<OpenApiStoreTasksDetailRespVO> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/consumptiontask/OpenApiConsumptionTaskController.java |
| GET | `/open-api/v1/consumption-tasks/store-participants` | 分页查询门店任务参与会员记录 | OpenAPI签名 | member:READ | Query:merchantId<br>Query:storeId<br>Query:taskId?<br>Query:pageNo<br>Query:pageSize | - | CommonResult<PageResult<OpenApiTaskRecordRespVO>> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/consumptiontask/OpenApiConsumptionTaskController.java |
| GET | `/open-api/v1/consumption-tasks/store-stats` | 查询门店任务统计（适用任务数量 + 参与人数） | OpenAPI签名 | member:READ | Query:merchantId<br>Query:storeId | - | CommonResult<OpenApiTaskStoreStatsRespVO> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/consumptiontask/OpenApiConsumptionTaskController.java |
| GET | `/open-api/v1/consumption-tasks/top-task-by-stores` | 按门店批量查询用户完成度最高的任务（单个 externalUserId，多个 storeId），含商户统计 | OpenAPI签名 | member:READ | Query:externalUserId<br>Query:storeIds | - | CommonResult<List<OpenApiStoreTopTaskRespVO>> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/consumptiontask/OpenApiConsumptionTaskController.java |
| GET | `/open-api/v1/consumption-tasks/user-merchant-tasks` | 查询用户在指定商户下领取的所有任务列表（含领取门店信息，按完成进度降序） | OpenAPI签名 | member:READ | Query:externalUserId<br>Query:merchantId | - | CommonResult<List<OpenApiUserMerchantTaskRespVO>> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/consumptiontask/OpenApiConsumptionTaskController.java |

### 开放平台 - 优惠券

| 方法 | 路径 | 说明 | 鉴权 | 权限 | 参数 | 请求体 | 返回 | 源文件 |
|---|---|---|---|---|---|---|---|---|
| POST | `/open-api/v1/coupon-purchases` | 创建优惠券购买单 | OpenAPI签名 | coupon:WRITE | - | OpenApiCouponPurchaseCreateReqVO | CommonResult<OpenCouponPurchaseDetailRespDTO> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/coupon/OpenApiCouponController.java |
| GET | `/open-api/v1/coupon-purchases/{purchaseId}` | 查询优惠券购买单 | OpenAPI签名 | coupon:READ | Path:purchaseId | - | CommonResult<OpenCouponPurchaseDetailRespDTO> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/coupon/OpenApiCouponController.java |
| POST | `/open-api/v1/coupon-purchases/{purchaseId}/cashier` | 创建优惠券购买收银台 | OpenAPI签名 | coupon:WRITE | Path:purchaseId | OpenApiCouponPurchaseCashierReqVO | CommonResult<OpenCouponPurchaseCashierRespDTO> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/coupon/OpenApiCouponController.java |
| POST | `/open-api/v1/coupon-purchases/refund` | 退款优惠券购买单 | OpenAPI签名 | coupon:WRITE | - | OpenApiCouponPurchaseRefundReqVO | CommonResult<Boolean> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/coupon/OpenApiCouponController.java |
| GET | `/open-api/v1/coupon-templates` | 分页查询可用优惠券模板 | OpenAPI签名 | coupon:READ | QueryObject:OpenApiCouponTemplatePageReqVO | - | CommonResult<PageResult<OpenCouponTemplateRespDTO>> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/coupon/OpenApiCouponController.java |
| POST | `/open-api/v1/coupon-templates` | 创建优惠券模板 | OpenAPI签名 | coupon:WRITE | - | OpenApiCouponTemplateCreateReqVO | CommonResult<Long> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/coupon/OpenApiCouponController.java |
| PUT | `/open-api/v1/coupon-templates/{templateId}` | 更新优惠券模板 | OpenAPI签名 | coupon:WRITE | Path:templateId<br>Query:merchantId | OpenApiCouponTemplateUpdateReqVO | CommonResult<Boolean> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/coupon/OpenApiCouponController.java |
| POST | `/open-api/v1/coupon-templates/{templateId}/issue` | 批量发放优惠券 | OpenAPI签名 | coupon:WRITE | Path:templateId | OpenApiCouponIssueReqVO | CommonResult<Boolean> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/coupon/OpenApiCouponController.java |
| PUT | `/open-api/v1/coupon-templates/{templateId}/pause` | 暂停优惠券模板 | OpenAPI签名 | coupon:WRITE | Path:templateId<br>Query:merchantId | - | CommonResult<Boolean> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/coupon/OpenApiCouponController.java |
| PUT | `/open-api/v1/coupon-templates/{templateId}/publish` | 发布优惠券模板 | OpenAPI签名 | coupon:WRITE | Path:templateId<br>Query:merchantId | - | CommonResult<Boolean> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/coupon/OpenApiCouponController.java |
| PUT | `/open-api/v1/coupon-templates/{templateId}/resume` | 恢复优惠券模板 | OpenAPI签名 | coupon:WRITE | Path:templateId<br>Query:merchantId | - | CommonResult<Boolean> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/coupon/OpenApiCouponController.java |
| GET | `/open-api/v1/coupons` | 查询优惠券列表 | OpenAPI签名 | coupon:READ | QueryObject:OpenApiCouponPageReqVO | - | CommonResult<PageResult<OpenCouponRespDTO>> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/coupon/OpenApiCouponController.java |
| GET | `/open-api/v1/coupons/{couponId}` | 查询优惠券详情 | OpenAPI签名 | coupon:READ | Path:couponId<br>Query:merchantId | - | CommonResult<OpenCouponRespDTO> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/coupon/OpenApiCouponController.java |
| POST | `/open-api/v1/coupons/{couponId}/verify` | 验证优惠券 | OpenAPI签名 | coupon:READ | Path:couponId<br>Query:merchantId | - | CommonResult<OpenCouponVerifyRespDTO> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/coupon/OpenApiCouponController.java |
| POST | `/open-api/v1/coupons/{couponId}/write-off` | 核销优惠券 | OpenAPI签名 | coupon:WRITE | Path:couponId | OpenApiCouponWriteOffReqVO | CommonResult<Boolean> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/coupon/OpenApiCouponController.java |
| POST | `/open-api/v1/coupons/{couponId}/write-off-qrcode` | 生成优惠券核销二维码 | OpenAPI签名 | coupon:WRITE | Path:couponId<br>Query:merchantId | - | CommonResult<OpenWriteOffQrRespDTO> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/coupon/OpenApiCouponController.java |
| GET | `/open-api/v1/coupons/available` | 查询可领取优惠券 | OpenAPI签名 | coupon:READ | Query:merchantId | - | CommonResult<List<OpenCouponTemplateRespDTO>> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/coupon/OpenApiCouponController.java |
| POST | `/open-api/v1/coupons/claim` | 领取优惠券 | OpenAPI签名 | coupon:WRITE | - | OpenApiCouponClaimReqVO | CommonResult<OpenApiCouponAcquireRespVO> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/coupon/OpenApiCouponController.java |
| POST | `/open-api/v1/coupons/purchase` | 购买优惠券 | OpenAPI签名 | coupon:WRITE | - | OpenApiCouponPurchaseReqVO | CommonResult<OpenApiCouponAcquireRespVO> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/coupon/OpenApiCouponController.java |
| GET | `/open-api/v1/coupons/user` | 查询用户优惠券 | OpenAPI签名 | coupon:READ | QueryObject:OpenApiCouponUserPageReqVO | - | CommonResult<PageResult<OpenCouponRespDTO>> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/coupon/OpenApiCouponController.java |
| GET | `/open-api/v1/coupons/write-off-records/{requestNo}` | 查询优惠券核销记录 | OpenAPI签名 | coupon:READ | Path:requestNo | - | CommonResult<OpenWriteOffRecordRespDTO> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/coupon/OpenApiCouponController.java |

### 开放平台 - 客户管理

| 方法 | 路径 | 说明 | 鉴权 | 权限 | 参数 | 请求体 | 返回 | 源文件 |
|---|---|---|---|---|---|---|---|---|
| GET | `/open-api/v1/customers` | 查询客户列表 | OpenAPI签名 | customer:READ | QueryObject:OpenApiCustomerPageReqVO | - | CommonResult<PageResult<OpenCustomerRespDTO>> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/customer/OpenApiCustomerController.java |
| GET | `/open-api/v1/customers/{customerId}` | 查询客户详情 | OpenAPI签名 | customer:READ | Path:customerId<br>Query:merchantId | - | CommonResult<OpenCustomerDetailRespDTO> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/customer/OpenApiCustomerController.java |
| GET | `/open-api/v1/customers/{customerId}/tags` | 查询客户标签 | OpenAPI签名 | customer:READ | Path:customerId<br>Query:merchantId | - | CommonResult<List<OpenCustomerTagRespDTO>> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/customer/OpenApiCustomerController.java |
| POST | `/open-api/v1/customers/{customerId}/tags` | 添加客户标签 | OpenAPI签名 | customer:WRITE | Path:customerId<br>Query:merchantId | OpenApiCustomerTagAddReqVO | CommonResult<Boolean> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/customer/OpenApiCustomerController.java |
| DELETE | `/open-api/v1/customers/{customerId}/tags/{tagName}` | 移除客户标签 | OpenAPI签名 | customer:WRITE | Path:customerId<br>Path:tagName<br>Query:merchantId | - | CommonResult<Boolean> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/customer/OpenApiCustomerController.java |
| GET | `/open-api/v1/customers/{customerId}/transactions` | 查询客户消费记录 | OpenAPI签名 | customer:READ | Path:customerId<br>Query:merchantId<br>QueryObject:OpenApiCustomerTransactionPageReqVO | - | CommonResult<PageResult<OpenCustomerTransactionRespDTO>> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/customer/OpenApiCustomerController.java |
| POST | `/open-api/v1/customers/intake` | 客户进件建档 | OpenAPI签名 | customer:WRITE | - | OpenApiCustomerIntakeReqVO | CommonResult<Long> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/customer/OpenApiCustomerController.java |
| GET | `/open-api/v1/customers/platform-user-id-by-phone` | 按手机号换取平台用户ID | OpenAPI签名 | customer:READ | Query:phone | - | CommonResult<Long> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/customer/OpenApiCustomerController.java |
| GET | `/open-api/v1/customers/statistics` | 查询客户统计 | OpenAPI签名 | customer:READ | Query:merchantId | - | CommonResult<OpenCustomerStatisticsRespDTO> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/customer/OpenApiCustomerController.java |

### 开放平台 - 商户会员

| 方法 | 路径 | 说明 | 鉴权 | 权限 | 参数 | 请求体 | 返回 | 源文件 |
|---|---|---|---|---|---|---|---|---|
| GET | `/open-api/v1/members` | 查询会员信息 | OpenAPI签名 | member:READ | Query:merchantId<br>Query:externalUserId | - | CommonResult<OpenApiMemberRespVO> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/member/OpenApiMemberController.java |
| POST | `/open-api/v1/members/{memberId}/recharge` | 创建充值单 | OpenAPI签名 | member:WRITE | Path:memberId | OpenApiMemberRechargeReqVO | CommonResult<OpenApiMemberRechargeRespVO> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/member/OpenApiMemberController.java |
| GET | `/open-api/v1/members/{memberId}/transactions` | 查询余额流水(支持按交易类型/余额类型过滤) | OpenAPI签名 | member:READ | Path:memberId<br>QueryObject:OpenApiMemberTransactionPageReqVO | - | CommonResult<PageResult<OpenApiMemberTransactionRespVO>> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/member/OpenApiMemberController.java |
| POST | `/open-api/v1/members/{memberId}/write-off-qrcode` | 生成会员余额核销二维码 | OpenAPI签名 | member:WRITE | Path:memberId<br>Query:merchantId | - | CommonResult<OpenApiMemberWriteOffQrRespVO> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/member/OpenApiMemberController.java |
| POST | `/open-api/v1/members/join` | 加入会员 | OpenAPI签名 | member:WRITE | - | OpenApiMemberJoinReqVO | CommonResult<OpenApiMemberRespVO> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/member/OpenApiMemberController.java |
| GET | `/open-api/v1/members/list` | 跨商户会员余额列表 | OpenAPI签名 | member:READ | QueryObject:OpenApiMemberListReqVO | - | CommonResult<PageResult<OpenApiMemberWithMerchantRespVO>> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/member/OpenApiMemberController.java |
| GET | `/open-api/v1/members/recharges/{rechargeId}` | 查询充值单 | OpenAPI签名 | member:READ | Path:rechargeId | - | CommonResult<OpenApiMemberRechargeRespVO> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/member/OpenApiMemberController.java |
| POST | `/open-api/v1/members/recharges/{rechargeId}/cashier` | 为充值单唤起收银台 | OpenAPI签名 | member:WRITE | Path:rechargeId | OpenApiMemberRechargeCashierReqVO | CommonResult<OpenApiMemberRechargeCashierRespVO> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/member/OpenApiMemberController.java |
| GET | `/open-api/v1/members/write-off-records/{requestNo}` | 查询会员余额核销记录 | OpenAPI签名 | member:READ | Path:requestNo | - | CommonResult<OpenApiMemberWriteOffRecordRespVO> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/member/OpenApiMemberController.java |
| POST | `/open-api/v1/members/write-off-records/{requestNo}/confirm` | 确认会员余额核销 | OpenAPI签名 | member:WRITE | Path:requestNo | OpenApiMemberWriteOffConfirmReqVO | CommonResult<OpenApiMemberWriteOffRecordRespVO> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/member/OpenApiMemberController.java |

### 开放平台 - 商户数据

| 方法 | 路径 | 说明 | 鉴权 | 权限 | 参数 | 请求体 | 返回 | 源文件 |
|---|---|---|---|---|---|---|---|---|
| GET | `/open-api/v1/merchants` | 查询商户列表 | OpenAPI签名 | merchant:READ | QueryObject:OpenApiMerchantPageReqVO | - | CommonResult<PageResult<OpenMerchantRespDTO>> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/merchant/OpenApiMerchantController.java |
| GET | `/open-api/v1/merchants/{merchantId}` | 查询商户详情 | OpenAPI签名 | merchant:READ | Path:merchantId | - | CommonResult<OpenMerchantRespDTO> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/merchant/OpenApiMerchantController.java |
| PUT | `/open-api/v1/merchants/{merchantId}` | 更新商户信息 | OpenAPI签名 | merchant:WRITE | Path:merchantId | OpenApiMerchantUpdateReqVO | CommonResult<Boolean> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/merchant/OpenApiMerchantController.java |
| POST | `/open-api/v1/merchants/{merchantId}/certification` | 提交商户认证 | OpenAPI签名 | merchant:WRITE | Path:merchantId | OpenApiMerchantCertificationReqVO | CommonResult<Boolean> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/merchant/OpenApiMerchantController.java |
| GET | `/open-api/v1/merchants/{merchantId}/certification/status` | 查询商户认证状态 | OpenAPI签名 | merchant:READ | Path:merchantId | - | CommonResult<OpenMerchantCertificationRespDTO> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/merchant/OpenApiMerchantController.java |
| POST | `/open-api/v1/merchants/register` | 注册商户 | OpenAPI签名 | merchant:WRITE | - | OpenApiMerchantRegisterReqVO | CommonResult<Long> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/merchant/OpenApiMerchantController.java |
| GET | `/open-api/v1/stores` | 查询门店列表 | OpenAPI签名 | merchant:READ | QueryObject:OpenApiStorePageReqVO | - | CommonResult<PageResult<OpenStoreRespDTO>> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/merchant/OpenApiMerchantController.java |
| POST | `/open-api/v1/stores` | 创建门店 | OpenAPI签名 | merchant:WRITE | - | OpenApiStoreCreateReqVO | CommonResult<Long> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/merchant/OpenApiMerchantController.java |
| DELETE | `/open-api/v1/stores/{storeId}` | 删除门店 | OpenAPI签名 | merchant:FULL | Path:storeId | - | CommonResult<Boolean> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/merchant/OpenApiMerchantController.java |
| GET | `/open-api/v1/stores/{storeId}` | 查询门店详情 | OpenAPI签名 | merchant:READ | Path:storeId | - | CommonResult<OpenStoreRespDTO> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/merchant/OpenApiMerchantController.java |
| PUT | `/open-api/v1/stores/{storeId}` | 更新门店 | OpenAPI签名 | merchant:WRITE | Path:storeId | OpenApiStoreUpdateReqVO | CommonResult<Boolean> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/merchant/OpenApiMerchantController.java |
| GET | `/open-api/v1/stores/{storeId}/business-hours` | 查询门店营业时间 | OpenAPI签名 | merchant:READ | Path:storeId | - | CommonResult<OpenBusinessHoursRespDTO> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/merchant/OpenApiMerchantController.java |
| GET | `/open-api/v1/stores/nearby` | 查询附近门店 | OpenAPI签名 | merchant:READ | QueryObject:OpenApiNearbyStoreReqVO | - | CommonResult<List<OpenStoreRespDTO>> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/merchant/OpenApiMerchantController.java |

### 开放平台 - App用户入网

| 方法 | 路径 | 说明 | 鉴权 | 权限 | 参数 | 请求体 | 返回 | 源文件 |
|---|---|---|---|---|---|---|---|---|
| POST | `/open-api/v1/onboarding/app-user` | 为App用户发起入网申请 | OpenAPI签名 | onboarding:WRITE | - | OpenApiAppUserOnboardReqVO | CommonResult<OpenApiOnboardStatusRespVO> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/onboarding/OpenApiOnboardingController.java |
| GET | `/open-api/v1/onboarding/app-user/status` | 查询App用户入网状态 | OpenAPI签名 | onboarding:READ | Query:externalUserId | - | CommonResult<OpenApiOnboardStatusRespVO> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/onboarding/OpenApiOnboardingController.java |

### 开放平台 - 订单数据

| 方法 | 路径 | 说明 | 鉴权 | 权限 | 参数 | 请求体 | 返回 | 源文件 |
|---|---|---|---|---|---|---|---|---|
| GET | `/open-api/v1/orders` | 查询订单列表 | OpenAPI签名 | order:READ | QueryObject:OpenApiOrderPageReqVO | - | CommonResult<PageResult<OpenOrderRespDTO>> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/order/OpenApiOrderController.java |
| POST | `/open-api/v1/orders` | 创建订单 | OpenAPI签名 | order:WRITE | - | OpenApiOrderCreateReqVO | CommonResult<Long> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/order/OpenApiOrderController.java |
| GET | `/open-api/v1/orders/{orderId}` | 查询订单详情 | OpenAPI签名 | order:READ | Path:orderId<br>Query:merchantId | - | CommonResult<OpenOrderDetailRespDTO> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/order/OpenApiOrderController.java |
| POST | `/open-api/v1/orders/{orderId}/cancel` | 取消订单 | OpenAPI签名 | order:WRITE | Path:orderId<br>Query:merchantId | - | CommonResult<Boolean> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/order/OpenApiOrderController.java |
| POST | `/open-api/v1/orders/{orderId}/change-booking` | 变更预约订单 | OpenAPI签名 | order:WRITE | Path:orderId<br>Query:merchantId | OpenApiOrderChangeBookingReqVO | CommonResult<Boolean> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/order/OpenApiOrderController.java |
| POST | `/open-api/v1/orders/{orderId}/confirm-booking` | 确认预约订单 | OpenAPI签名 | order:WRITE | Path:orderId<br>Query:merchantId | - | CommonResult<Boolean> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/order/OpenApiOrderController.java |
| POST | `/open-api/v1/orders/{orderId}/confirm-receipt` | 确认收货 | OpenAPI签名 | order:WRITE | Path:orderId<br>Query:merchantId | - | CommonResult<Boolean> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/order/OpenApiOrderController.java |
| PUT | `/open-api/v1/orders/{orderId}/delivery-status` | 更新配送状态 | OpenAPI签名 | order:WRITE | Path:orderId<br>Query:merchantId | OpenApiOrderDeliveryStatusReqVO | CommonResult<Boolean> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/order/OpenApiOrderController.java |
| POST | `/open-api/v1/orders/{orderId}/pay` | 订单支付 | OpenAPI签名 | order:WRITE | Path:orderId<br>Query:merchantId | OpenApiOrderPayReqVO | CommonResult<OpenOrderPayRespDTO> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/order/OpenApiOrderController.java |
| GET | `/open-api/v1/orders/{orderId}/refund` | 查询退款详情 | OpenAPI签名 | order:READ | Path:orderId<br>Query:merchantId | - | CommonResult<OpenOrderRefundRespDTO> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/order/OpenApiOrderController.java |
| POST | `/open-api/v1/orders/{orderId}/refund` | 申请退款 | OpenAPI签名 | order:WRITE | Path:orderId<br>Query:merchantId | OpenApiOrderRefundReqVO | CommonResult<Long> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/order/OpenApiOrderController.java |
| POST | `/open-api/v1/orders/{orderId}/review` | 订单评价 | OpenAPI签名 | order:WRITE | Path:orderId<br>Query:merchantId | OpenApiOrderReviewReqVO | CommonResult<Boolean> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/order/OpenApiOrderController.java |
| GET | `/open-api/v1/orders/{orderId}/status-history` | 查询订单状态变更历史 | OpenAPI签名 | order:READ | Path:orderId<br>Query:merchantId | - | CommonResult<List<OpenOrderLogRespDTO>> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/order/OpenApiOrderController.java |
| POST | `/open-api/v1/orders/{orderId}/write-off` | 核销订单 | OpenAPI签名 | order:WRITE | Path:orderId<br>Query:merchantId | - | CommonResult<Boolean> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/order/OpenApiOrderController.java |
| GET | `/open-api/v1/orders/statistics` | 查询订单统计 | OpenAPI签名 | order:READ | Query:merchantId | - | CommonResult<OpenOrderStatisticsRespDTO> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/order/OpenApiOrderController.java |

### 开放平台 - 支付（收银台）

| 方法 | 路径 | 说明 | 鉴权 | 权限 | 参数 | 请求体 | 返回 | 源文件 |
|---|---|---|---|---|---|---|---|---|
| POST | `/open-api/v1/payment/cashier/create` | 创建收银台会话 | OpenAPI签名 | payment:WRITE | - | OpenApiCashierCreateReqVO | CommonResult<OpenApiCashierCreateRespVO> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/payment/OpenApiPaymentController.java |
| GET | `/open-api/v1/payment/query` | 查询支付结果（支持平台交易号 / 下游业务单号 二选一） | OpenAPI签名 | payment:READ | Query:tradeNo?<br>Query:outTradeNo? | - | CommonResult<OpenApiPaymentQueryRespVO> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/payment/OpenApiPaymentController.java |

### 开放平台 - 商品数据

| 方法 | 路径 | 说明 | 鉴权 | 权限 | 参数 | 请求体 | 返回 | 源文件 |
|---|---|---|---|---|---|---|---|---|
| GET | `/open-api/v1/product-categories` | 查询商品分类列表 | OpenAPI签名 | product:READ | Query:merchantId | - | CommonResult<List<OpenCategoryRespDTO>> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/product/OpenApiProductController.java |
| POST | `/open-api/v1/product-categories` | 创建商品分类 | OpenAPI签名 | product:WRITE | - | OpenApiCategoryCreateReqVO | CommonResult<Long> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/product/OpenApiProductController.java |
| DELETE | `/open-api/v1/product-categories/{categoryId}` | 删除商品分类 | OpenAPI签名 | product:FULL | Path:categoryId<br>Query:merchantId | - | CommonResult<Boolean> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/product/OpenApiProductController.java |
| PUT | `/open-api/v1/product-categories/{categoryId}` | 更新商品分类 | OpenAPI签名 | product:WRITE | Path:categoryId<br>Query:merchantId | OpenApiCategoryUpdateReqVO | CommonResult<Boolean> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/product/OpenApiProductController.java |
| GET | `/open-api/v1/products` | 查询商品列表 | OpenAPI签名 | product:READ | QueryObject:OpenApiProductPageReqVO | - | CommonResult<PageResult<OpenProductRespDTO>> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/product/OpenApiProductController.java |
| POST | `/open-api/v1/products` | 创建商品 | OpenAPI签名 | product:WRITE | - | OpenApiProductCreateReqVO | CommonResult<Long> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/product/OpenApiProductController.java |
| DELETE | `/open-api/v1/products/{productId}` | 删除商品 | OpenAPI签名 | product:FULL | Path:productId | - | CommonResult<Boolean> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/product/OpenApiProductController.java |
| GET | `/open-api/v1/products/{productId}` | 查询商品详情 | OpenAPI签名 | product:READ | Path:productId | - | CommonResult<OpenProductRespDTO> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/product/OpenApiProductController.java |
| PUT | `/open-api/v1/products/{productId}` | 更新商品 | OpenAPI签名 | product:WRITE | Path:productId | OpenApiProductUpdateReqVO | CommonResult<Boolean> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/product/OpenApiProductController.java |
| PUT | `/open-api/v1/products/{productId}/status` | 商品上架/下架 | OpenAPI签名 | product:WRITE | Path:productId | OpenApiProductStatusUpdateReqVO | CommonResult<Boolean> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/product/OpenApiProductController.java |
| POST | `/open-api/v1/products/{productId}/stock-in` | 库存入库 | OpenAPI签名 | product:WRITE | Path:productId | OpenApiStockOperationReqVO | CommonResult<Boolean> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/product/OpenApiProductController.java |
| GET | `/open-api/v1/products/{productId}/stock-logs` | 查询库存变动日志 | OpenAPI签名 | product:READ | Path:productId<br>QueryObject:OpenApiStockLogPageReqVO | - | CommonResult<PageResult<OpenStockLogRespDTO>> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/product/OpenApiProductController.java |
| POST | `/open-api/v1/products/{productId}/stock-out` | 库存出库 | OpenAPI签名 | product:WRITE | Path:productId | OpenApiStockOperationReqVO | CommonResult<Boolean> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/product/OpenApiProductController.java |
| GET | `/open-api/v1/products/search` | 搜索商品 | OpenAPI签名 | product:READ | QueryObject:OpenApiProductSearchReqVO | - | CommonResult<PageResult<OpenProductRespDTO>> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/product/OpenApiProductController.java |
| GET | `/open-api/v1/products/statistics` | 查询商品统计 | OpenAPI签名 | product:READ | Query:merchantId | - | CommonResult<OpenProductStatisticsRespDTO> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/product/OpenApiProductController.java |

### 开放平台 - 实名认证

| 方法 | 路径 | 说明 | 鉴权 | 权限 | 参数 | 请求体 | 返回 | 源文件 |
|---|---|---|---|---|---|---|---|---|
| GET | `/open-api/v1/real-name-auth/face-auth-params` | 获取人脸核身 SDK 参数 | OpenAPI签名 | real_name_auth:WRITE | Query:idCardNumber | - | CommonResult<OpenApiFaceAuthParamsRespVO> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/realnameauth/OpenApiRealNameAuthController.java |
| GET | `/open-api/v1/real-name-auth/face-auth-result` | 查询人脸核身结果 | OpenAPI签名 | real_name_auth:READ | Query:orderNo | - | CommonResult<OpenApiRealNameAuthRespVO> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/realnameauth/OpenApiRealNameAuthController.java |
| GET | `/open-api/v1/real-name-auth/status` | 根据身份证号查询认证状态 | OpenAPI签名 | real_name_auth:READ | Query:idCardNumber | - | CommonResult<OpenApiRealNameAuthRespVO> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/realnameauth/OpenApiRealNameAuthController.java |
| POST | `/open-api/v1/real-name-auth/submit-id-card` | 提交身份证进行 OCR 识别 | OpenAPI签名 | real_name_auth:WRITE | - | OpenApiSubmitIdCardReqVO | CommonResult<OpenApiRealNameAuthRespVO> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/realnameauth/OpenApiRealNameAuthController.java |

### 开放平台 - 可预订资源

| 方法 | 路径 | 说明 | 鉴权 | 权限 | 参数 | 请求体 | 返回 | 源文件 |
|---|---|---|---|---|---|---|---|---|
| GET | `/open-api/v1/resources` | 查询资源列表 | OpenAPI签名 | resource:READ | QueryObject:OpenApiResourcePageReqVO | - | CommonResult<PageResult<OpenResourceRespDTO>> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/resource/OpenApiResourceController.java |
| POST | `/open-api/v1/resources` | 创建资源 | OpenAPI签名 | resource:WRITE | - | OpenApiResourceCreateReqVO | CommonResult<Long> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/resource/OpenApiResourceController.java |
| DELETE | `/open-api/v1/resources/{resourceId}` | 删除资源 | OpenAPI签名 | resource:FULL | Path:resourceId<br>Query:merchantId | - | CommonResult<Boolean> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/resource/OpenApiResourceController.java |
| GET | `/open-api/v1/resources/{resourceId}` | 查询资源详情 | OpenAPI签名 | resource:READ | Path:resourceId<br>Query:merchantId | - | CommonResult<OpenResourceRespDTO> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/resource/OpenApiResourceController.java |
| PUT | `/open-api/v1/resources/{resourceId}` | 更新资源 | OpenAPI签名 | resource:WRITE | Path:resourceId<br>Query:merchantId | OpenApiResourceUpdateReqVO | CommonResult<Boolean> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/resource/OpenApiResourceController.java |
| GET | `/open-api/v1/resources/{resourceId}/availability` | 查询资源可用性 | OpenAPI签名 | resource:READ | Path:resourceId<br>Query:merchantId<br>Query:date | - | CommonResult<OpenResourceAvailabilityRespDTO> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/resource/OpenApiResourceController.java |
| PUT | `/open-api/v1/resources/{resourceId}/price` | 设置资源价格 | OpenAPI签名 | resource:WRITE | Path:resourceId<br>Query:merchantId | OpenApiResourcePriceUpdateReqVO | CommonResult<Boolean> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/resource/OpenApiResourceController.java |
| PUT | `/open-api/v1/resources/{resourceId}/schedule` | 设置资源排班 | OpenAPI签名 | resource:WRITE | Path:resourceId<br>Query:merchantId | OpenApiResourceScheduleUpdateReqVO | CommonResult<Boolean> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/resource/OpenApiResourceController.java |
| PUT | `/open-api/v1/resources/{resourceId}/status` | 更新资源状态 | OpenAPI签名 | resource:WRITE | Path:resourceId<br>Query:merchantId | OpenApiResourceStatusUpdateReqVO | CommonResult<Boolean> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/resource/OpenApiResourceController.java |
| GET | `/open-api/v1/resources/batch-status` | 批量查询资源状态 | OpenAPI签名 | resource:READ | Query:resourceIds<br>Query:merchantId | - | CommonResult<List<OpenResourceBatchStatusRespDTO>> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/resource/OpenApiResourceController.java |
| GET | `/open-api/v1/resources/statistics` | 查询资源统计 | OpenAPI签名 | resource:READ | Query:merchantId | - | CommonResult<OpenResourceStatisticsRespDTO> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/resource/OpenApiResourceController.java |

### 开放平台 - 风控模型产品

| 方法 | 路径 | 说明 | 鉴权 | 权限 | 参数 | 请求体 | 返回 | 源文件 |
|---|---|---|---|---|---|---|---|---|
| GET | `/open-api/v1/risk-model-products` | 获取可调用的平台风控模型产品列表 | OpenAPI签名 | risk:READ | - | - | CommonResult<List<RiskModelProductRespDTO>> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/risk/OpenApiRiskModelController.java |
| POST | `/open-api/v1/risk-model-products/{productId}/execute` | 执行平台风控模型产品 | OpenAPI签名 | risk:WRITE | Path:productId | OpenApiRiskModelExecuteReqVO | CommonResult<RiskModelProductExecuteRespDTO> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/risk/OpenApiRiskModelController.java |

### 开放平台 - 数据统计

| 方法 | 路径 | 说明 | 鉴权 | 权限 | 参数 | 请求体 | 返回 | 源文件 |
|---|---|---|---|---|---|---|---|---|
| GET | `/open-api/v1/statistics/bookings` | 查询预约分析 | OpenAPI签名 | statistics:READ | Query:merchantId | - | CommonResult<OpenStatisticsBookingRespDTO> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/statistics/OpenApiStatisticsController.java |
| GET | `/open-api/v1/statistics/channels` | 查询渠道分析 | OpenAPI签名 | statistics:READ | Query:merchantId | - | CommonResult<OpenStatisticsChannelRespDTO> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/statistics/OpenApiStatisticsController.java |
| GET | `/open-api/v1/statistics/customers` | 查询客户分析 | OpenAPI签名 | statistics:READ | Query:merchantId | - | CommonResult<OpenStatisticsCustomerRespDTO> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/statistics/OpenApiStatisticsController.java |
| POST | `/open-api/v1/statistics/export` | 创建报表导出任务 | OpenAPI签名 | statistics:READ | - | OpenApiStatisticsExportReqVO | CommonResult<OpenStatisticsExportRespDTO> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/statistics/OpenApiStatisticsController.java |
| GET | `/open-api/v1/statistics/export/{taskId}` | 查询导出任务状态 | OpenAPI签名 | statistics:READ | Path:taskId<br>Query:merchantId | - | CommonResult<OpenStatisticsExportStatusRespDTO> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/statistics/OpenApiStatisticsController.java |
| GET | `/open-api/v1/statistics/overview` | 查询经营概览 | OpenAPI签名 | statistics:READ | Query:merchantId | - | CommonResult<OpenStatisticsOverviewRespDTO> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/statistics/OpenApiStatisticsController.java |
| GET | `/open-api/v1/statistics/sales` | 查询销售报表 | OpenAPI签名 | statistics:READ | QueryObject:OpenApiStatisticsSalesReqVO | - | CommonResult<OpenStatisticsSalesRespDTO> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/statistics/OpenApiStatisticsController.java |

### 开放平台 - B2B转账

| 方法 | 路径 | 说明 | 鉴权 | 权限 | 参数 | 请求体 | 返回 | 源文件 |
|---|---|---|---|---|---|---|---|---|
| GET | `/open-api/v1/transfer/b2b` | 查询B2B转账状态 | OpenAPI签名 | transfer:READ | Query:merchantTransferNo | - | CommonResult<OpenApiB2bTransferRespVO> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/transfer/OpenApiB2bTransferController.java |
| POST | `/open-api/v1/transfer/b2b` | 创建B2B转账 | OpenAPI签名 | transfer:WRITE | - | OpenApiB2bTransferCreateReqVO | CommonResult<OpenApiB2bTransferRespVO> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/transfer/OpenApiB2bTransferController.java |

### 开放平台 - 提现

| 方法 | 路径 | 说明 | 鉴权 | 权限 | 参数 | 请求体 | 返回 | 源文件 |
|---|---|---|---|---|---|---|---|---|
| POST | `/open-api/withdraw/account/bind` | 绑定提现账户 | OpenAPI签名 | withdraw:WRITE | - | OpenApiWithdrawAccountBindReqVO | CommonResult<Long> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/withdraw/OpenApiWithdrawController.java |
| GET | `/open-api/withdraw/account/list` | 查询用户提现账户列表 | OpenAPI签名 | withdraw:READ | Query:externalUserId | - | CommonResult<List<OpenApiWithdrawAccountRespVO>> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/withdraw/OpenApiWithdrawController.java |
| DELETE | `/open-api/withdraw/account/unbind` | 解绑提现账户 | OpenAPI签名 | withdraw:WRITE | Query:accountId | - | CommonResult<Boolean> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/withdraw/OpenApiWithdrawController.java |
| POST | `/open-api/withdraw/create` | 创建提现 | OpenAPI签名 | withdraw:WRITE | - | OpenApiWithdrawCreateReqVO | CommonResult<OpenApiWithdrawRespVO> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/withdraw/OpenApiWithdrawController.java |
| GET | `/open-api/withdraw/get` | 查询提现状态 | OpenAPI签名 | withdraw:READ | Query:merchantWithdrawNo | - | CommonResult<OpenApiWithdrawRespVO> | mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/withdraw/OpenApiWithdrawController.java |

## 请求对象字段

### OpenApiActivateUnboundReqVO

来源：`mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/consumptiontask/vo/OpenApiActivateUnboundReqVO.java`

| 字段 | 类型 | 必填 | 说明 | 示例 |
|---|---|---|---|---|
| externalUserId | String | 是 | 外部用户ID（OpenAPI 鉴权后解析为 platformUserId） | user_001 |
| merchantId | Long | 是 | 商户ID（按商户激活，一次性收口该商户下用户全部门店的未激活消费） | 5001 |
| triggeredStoreId | Long | 是 | 触发激活的门店ID（UX 上下文，用于响应明细 currentStoreAmount/otherStoreAmount 拆分；不影响实际激活范围） | 100 |

### OpenApiAppUserOnboardReqVO

来源：`mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/onboarding/vo/OpenApiAppUserOnboardReqVO.java`

| 字段 | 类型 | 必填 | 说明 | 示例 |
|---|---|---|---|---|
| externalUserId | String | 是 | App端用户唯一标识 | user_123 |
| signName | String | 是 | 签约名称（须与身份证姓名一致） | 张三 |
| shortName | String | 是 | 简称（用于收银台展示，不超过20字） | 张三 |
| idCardNumber | String | 是 | 证件号码（身份证号） | 110101199001011234 |
| idCardFrontUrl | String | 否 | 证件人像面照片URL | https://oss.example.com/id_front.jpg |
| idCardBackUrl | String | 否 | 证件非人像面照片URL | https://oss.example.com/id_back.jpg |
| mobile | String | 是 | 手机号 | 13800138000 |
| province | String | 否 | 省名称 | 北京市 |
| city | String | 否 | 市名称 | 北京市 |
| district | String | 否 | 区名称 | 朝阳区 |
| address | String | 否 | 详细地址 | 朝阳区xxx路xxx号 |
| provinceCode | String | 是 | 省编码（如 110000） | 110000 |
| cityCode | String | 是 | 市编码（如 110100） | 110100 |
| districtCode | String | 是 | 区编码（如 110105） | 110105 |
| bankCardNo | String | 是 | 银行卡号 | 6222021234567890123 |
| bankCode | String | 是 | 开户总行编码（易宝银行编码，如 ICBC、CMB） | ICBC |
| bankName | String | 否 | 开户行名称（如「工商银行」，当 bankCode 为空时可由系统自动转换） | 工商银行 |

### OpenApiB2bTransferCreateReqVO

来源：`mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/transfer/vo/OpenApiB2bTransferCreateReqVO.java`

| 字段 | 类型 | 必填 | 说明 | 示例 |
|---|---|---|---|---|
| toExternalUserId | String | 是 | 转入方App用户标识 | user_10001 |
| merchantTransferNo | String | 是 | 商户转账单号（下游App保证唯一） | TF20260415001 |
| amount | Integer | 是 | 转账金额（单位：分） | 10000 |
| usage | String | 是 | 用途说明 | 佣金分发 |

### OpenApiBatchClaimByStoreReqVO

来源：`mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/consumptiontask/vo/OpenApiBatchClaimByStoreReqVO.java`

| 字段 | 类型 | 必填 | 说明 | 示例 |
|---|---|---|---|---|
| externalUserId | String | 是 | 外部用户标识 | user_001 |
| storeId | Long | 是 | 门店ID | 10 |

### OpenApiBookingAvailableSlotsReqVO

来源：`mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/booking/vo/OpenApiBookingAvailableSlotsReqVO.java`

| 字段 | 类型 | 必填 | 说明 | 示例 |
|---|---|---|---|---|
| merchantId | Long | 是 | 商户ID | 1 |
| storeId | Long | 否 | 门店ID | 1 |
| resourceId | Long | 否 | 指定资源ID；传入后只查询该资源是否可约 | 1 |
| resourceTypeId | Long | 否 | 资源类型ID；不指定资源时可按类型筛选 | 1 |
| bookingDate | LocalDate | 是 | 预约日期 | 2026-03-15 |
| durationMinutes | Integer | 否 | 预约时长(分钟)，默认60分钟 | 60 |
| slotStepMinutes | Integer | 否 | 时间步长(分钟)，默认等于预约时长 | 30 |

### OpenApiBookingOrderCancelReqVO

来源：`mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/booking/vo/OpenApiBookingOrderCancelReqVO.java`

| 字段 | 类型 | 必填 | 说明 | 示例 |
|---|---|---|---|---|
| cancelReason | String | 否 | 取消原因 | - |
| cancelRemark | String | 否 | 取消备注 | - |

### OpenApiBookingOrderConfirmReqVO

来源：`mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/booking/vo/OpenApiBookingOrderConfirmReqVO.java`

| 字段 | 类型 | 必填 | 说明 | 示例 |
|---|---|---|---|---|
| confirmerId | Long | 否 | 确认人ID | 1 |
| remark | String | 否 | 备注 | - |

### OpenApiBookingOrderCreateReqVO

来源：`mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/booking/vo/OpenApiBookingOrderCreateReqVO.java`

| 字段 | 类型 | 必填 | 说明 | 示例 |
|---|---|---|---|---|
| merchantId | Long | 是 | 商户ID | 1 |
| storeId | Long | 是 | 门店ID | 1 |
| bookingDate | LocalDate | 是 | 预约日期 | - |
| startTime | LocalDateTime | 是 | 预约开始时间 | - |
| endTime | LocalDateTime | 是 | 预约结束时间 | - |
| resourceId | Long | 否 | 指定资源ID；适用于指定房间/台桌/技师 | 1 |
| resourceIds | List<Long> | 否 | 指定多个资源ID；适用于组合预约 | - |
| resourceTypeId | Long | 否 | 自动分配时的资源类型ID；例如技师类型、台球桌类型 | 1 |
| assignMode | Integer | 否 | 分配方式：1-自动分配 2-指定资源 | 1 |
| duration | Integer | 是 | 预计时长(分钟) | 60 |
| userName | String | 是 | 预约人姓名 | 张三 |
| userPhone | String | 是 | 预约人手机号 | 13800138000 |
| userRemark | String | 否 | 用户备注 | - |
| specialRequirement | String | 否 | 特殊要求 | - |
| peopleCount | Integer | 是 | 预约人数 | 2 |
| sourceChannel | String | 否 | 来源渠道 | - |
| baseAmount | Integer | 否 | 基础金额(分) | 10000 |
| extraAmount | Integer | 否 | 附加费用(分) | 0 |
| discountAmount | Integer | 否 | 优惠金额(分) | 0 |
| totalAmount | Integer | 否 | 订单总金额(分) | 10000 |
| isDesignated | Integer | 否 | 是否指定资源：0-否 1-是 | 1 |
| designatedFee | Integer | 否 | 指定资源附加费(分) | 2000 |

### OpenApiBookingOrderPageReqVO

来源：`mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/booking/vo/OpenApiBookingOrderPageReqVO.java`

| 字段 | 类型 | 必填 | 说明 | 示例 |
|---|---|---|---|---|
| merchantId | Long | 否 | 商户ID（精确匹配） | 1 |
| storeId | Long | 否 | 门店ID | 1 |
| status | Integer | 否 | 订单状态：0-待确认 1-已确认 2-进行中 3-已完成 4-已取消 5-已过期 | 0 |
| bookingDateStart | LocalDate | 否 | 预约日期起始 | 2026-03-01 |
| bookingDateEnd | LocalDate | 否 | 预约日期结束 | 2026-03-31 |
| userName | String | 否 | 预约人姓名（模糊匹配） | 张三 |
| userPhone | String | 否 | 预约人手机号 | 13800138000 |

### OpenApiBookingOrderUpdateReqVO

来源：`mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/booking/vo/OpenApiBookingOrderUpdateReqVO.java`

| 字段 | 类型 | 必填 | 说明 | 示例 |
|---|---|---|---|---|
| bookingDate | LocalDate | 否 | 预约日期 | - |
| startTime | LocalDateTime | 否 | 预约开始时间 | - |
| endTime | LocalDateTime | 否 | 预约结束时间 | - |
| resourceId | Long | 否 | 变更后的指定资源ID | 1 |
| resourceIds | List<Long> | 否 | 变更后的指定多个资源ID | - |
| resourceTypeId | Long | 否 | 自动分配时的资源类型ID | 1 |
| duration | Integer | 否 | 预计时长(分钟) | 60 |
| userName | String | 否 | 预约人姓名 | 张三 |
| userPhone | String | 否 | 预约人手机号 | 13800138000 |
| userRemark | String | 否 | 用户备注 | - |
| specialRequirement | String | 否 | 特殊要求 | - |
| peopleCount | Integer | 否 | 预约人数 | 2 |
| remark | String | 否 | 商户备注 | - |

### OpenApiCardTemplatePageReqVO

来源：`mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/membercard/vo/OpenApiCardTemplatePageReqVO.java`

| 字段 | 类型 | 必填 | 说明 | 示例 |
|---|---|---|---|---|
| merchantId | Long | 否 | 商户ID（精确匹配） | 1 |
| cardType | Integer | 否 | 卡类型：1-储值卡 2-次卡 3-折扣卡 4-套餐卡 | 1 |
| status | Integer | 否 | 状态：0-草稿 1-上架中 2-已下架 3-已过期 | 1 |

### OpenApiCashVoucherAcquireReqVO

来源：`mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/cashvoucher/vo/OpenApiCashVoucherAcquireReqVO.java`

| 字段 | 类型 | 必填 | 说明 | 示例 |
|---|---|---|---|---|
| merchantId | Long | 是 | - | - |
| sourceType | Integer | 是 | 获取方式：1-普通支付购券 2-会员余额直接扣减购券 3-自营支付购券(支付后从会员余额扣减) 5-会员余额扣减购券 | 1 |
| memberCardNo | String | 否 | 会员卡卡号（已废弃，sourceType=2 已切换为会员余额直扣，此字段不再生效） | MC20240001 |
| deductPhone | String | 否 | 手机号，sourceType=3 时用于定位用户在商户的会员余额 | 13800138000 |
| amount | Integer | 是 | - | - |
| discountRate | Integer | 否 | 外部支付折扣率，仅 sourceType=1/3 时生效，90 表示 9 折 | 90 |
| externalUserId | String | 是 | 下游 App 用户标识，需先完成客户进件 | ext_user_001 |
| bizNo | String | 否 | 下游业务号，平台仅存储并在抵金券购买相关事件回调中原样透传 | cv_order_001 |
| storeId | Long | 否 | 门店ID，标记用户在哪个门店购买 | 1 |

### OpenApiCashVoucherGiftReqVO

来源：`mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/cashvoucher/vo/OpenApiCashVoucherGiftReqVO.java`

| 字段 | 类型 | 必填 | 说明 | 示例 |
|---|---|---|---|---|
| phone | String | 是 | 接收方手机号 | 13800138000 |
| merchantId | Long | 是 | 商户ID | 1 |
| amount | Integer | 是 | 赠送金额（分） | 1000 |
| validityDays | Integer | 否 | 有效期天数，不传则永久有效 | 30 |
| bizNo | String | 否 | 下游业务号，平台仅存储并在事件回调中原样透传，可用于幂等或追踪 | gift_biz_001 |

### OpenApiCashVoucherPurchaseCashierReqVO

来源：`mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/cashvoucher/vo/OpenApiCashVoucherPurchaseCashierReqVO.java`

| 字段 | 类型 | 必填 | 说明 | 示例 |
|---|---|---|---|---|
| returnUrl | String | 否 | - | - |
| expireMinutes | Integer | 否 | - | - |

### OpenApiCashVoucherRefundReqVO

来源：`mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/cashvoucher/vo/OpenApiCashVoucherRefundReqVO.java`

| 字段 | 类型 | 必填 | 说明 | 示例 |
|---|---|---|---|---|
| voucherId | Long | 是 | 抵金券ID | 1 |
| appUserId | Long | 否 | App用户映射ID，传 externalUserId 时可不传 | 1 |
| externalUserId | String | 否 | 下游 App 用户标识，传 appUserId 时可不传 | ext_user_001 |

### OpenApiCashVoucherRevokeGiftReqVO

来源：`mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/cashvoucher/vo/OpenApiCashVoucherRevokeGiftReqVO.java`

| 字段 | 类型 | 必填 | 说明 | 示例 |
|---|---|---|---|---|
| voucherId | Long | 是 | 抵金券ID | 100 |

### OpenApiCashierCreateReqVO

来源：`mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/payment/vo/OpenApiCashierCreateReqVO.java`

| 字段 | 类型 | 必填 | 说明 | 示例 |
|---|---|---|---|---|
| merchantId | Long | 是 | 商户ID | 123456 |
| outTradeNo | String | 是 | 商户订单号 | ORDER001 |
| totalAmount | Integer | 是 | 支付金额（分） | 10000 |
| subject | String | 是 | 商品标题 | 服务支付 |
| body | String | 否 | 商品描述 | 订单描述 |
| returnUrl | String | 否 | 支付完成回跳地址 | https://app.example.com/result |
| expireMinutes | Integer | 否 | 过期时间（分钟） | 30 |
| attach | String | 否 | 附加数据（透传） | 自定义数据 |

### OpenApiCategoryCreateReqVO

来源：`mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/product/vo/OpenApiCategoryCreateReqVO.java`

| 字段 | 类型 | 必填 | 说明 | 示例 |
|---|---|---|---|---|
| merchantId | Long | 是 | 商户ID | 1 |
| parentId | Long | 否 | 父分类ID，0=顶级分类 | 0 |
| name | String | 是 | 分类名称 | 饮品 |
| iconUrl | String | 否 | 分类图标URL | - |
| sort | Integer | 否 | 排序 | 0 |
| status | Integer | 否 | 状态：0-正常 1-禁用 | 0 |

### OpenApiCategoryUpdateReqVO

来源：`mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/product/vo/OpenApiCategoryUpdateReqVO.java`

| 字段 | 类型 | 必填 | 说明 | 示例 |
|---|---|---|---|---|
| parentId | Long | 否 | 父分类ID，0=顶级分类 | 0 |
| name | String | 否 | 分类名称 | 饮品 |
| iconUrl | String | 否 | 分类图标URL | - |
| sort | Integer | 否 | 排序 | 0 |
| status | Integer | 否 | 状态：0-正常 1-禁用 | 0 |

### OpenApiConsumptionRecordPageReqVO

来源：`mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/membercard/vo/OpenApiConsumptionRecordPageReqVO.java`

| 字段 | 类型 | 必填 | 说明 | 示例 |
|---|---|---|---|---|
| bizType | Integer | 否 | 业务类型：1-扫码支付 2-消费券核销 3-手动核销 4-次卡扣次 5-折扣消费 6-套餐项目使用 7-退款回退 8-抵金券购券扣减 9-动态收款码会员卡抵扣 | 1 |

### OpenApiCouponClaimReqVO

来源：`mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/coupon/vo/OpenApiCouponClaimReqVO.java`

| 字段 | 类型 | 必填 | 说明 | 示例 |
|---|---|---|---|---|
| merchantId | Long | 是 | 商户ID | 1 |
| templateId | Long | 是 | 优惠券模板ID | 1 |
| appUserId | Long | 否 | App用户映射ID，传 externalUserId 时可不传 | 1 |
| externalUserId | String | 否 | 下游 App 用户标识，传 appUserId 时可不传 | ext_user_001 |
| storeId | Long | 否 | 门店ID，标记用户在哪个门店购买 | 1 |

### OpenApiCouponIssueReqVO

来源：`mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/coupon/vo/OpenApiCouponIssueReqVO.java`

| 字段 | 类型 | 必填 | 说明 | 示例 |
|---|---|---|---|---|
| merchantId | Long | 是 | 商户ID | 1 |
| appUserIds | List<Long> | 否 | App用户映射ID列表，传 externalUserIds 时可不传 | - |
| externalUserIds | List<String> | 否 | 下游 App 用户标识列表，传 appUserIds 时可不传 | - |

### OpenApiCouponPageReqVO

来源：`mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/coupon/vo/OpenApiCouponPageReqVO.java`

| 字段 | 类型 | 必填 | 说明 | 示例 |
|---|---|---|---|---|
| merchantId | Long | 否 | 商户ID（精确匹配） | 1 |
| couponType | Integer | 否 | 优惠券类型：1-折扣券 2-满减券 3-礼品券 | 1 |
| status | Integer | 否 | 状态：0-未使用 1-已使用 2-已过期 | 0 |
| couponNo | String | 否 | 券号（模糊匹配） | GC |
| templateId | Long | 否 | 优惠券模板ID | 1 |

### OpenApiCouponPurchaseCashierReqVO

来源：`mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/coupon/vo/OpenApiCouponPurchaseCashierReqVO.java`

| 字段 | 类型 | 必填 | 说明 | 示例 |
|---|---|---|---|---|
| returnUrl | String | 否 | 支付完成回跳地址 | https://app.example.com/result |
| expireMinutes | Integer | 否 | 过期时间（分钟） | 30 |

### OpenApiCouponPurchaseCreateReqVO

来源：`mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/coupon/vo/OpenApiCouponPurchaseCreateReqVO.java`

| 字段 | 类型 | 必填 | 说明 | 示例 |
|---|---|---|---|---|
| merchantId | Long | 是 | 商户ID | 1 |
| templateId | Long | 是 | 优惠券模板ID | 1 |
| externalUserId | String | 是 | 下游 App 用户标识，需先完成客户进件 | ext_user_001 |
| bizNo | String | 否 | 下游业务号，平台仅存储并在优惠券购买相关事件回调中原样透传 | cp_order_001 |
| storeId | Long | 否 | 门店ID，标记用户在哪个门店购买 | 1 |

### OpenApiCouponPurchaseRefundReqVO

来源：`mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/coupon/vo/OpenApiCouponPurchaseRefundReqVO.java`

| 字段 | 类型 | 必填 | 说明 | 示例 |
|---|---|---|---|---|
| purchaseId | Long | 是 | 购买单ID | 1 |
| appUserId | Long | 否 | App用户映射ID，传 externalUserId 时可不传 | 1 |
| externalUserId | String | 否 | 下游 App 用户标识，传 appUserId 时可不传 | ext_user_001 |

### OpenApiCouponPurchaseReqVO

来源：`mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/coupon/vo/OpenApiCouponPurchaseReqVO.java`

| 字段 | 类型 | 必填 | 说明 | 示例 |
|---|---|---|---|---|
| merchantId | Long | 是 | 商户ID | 1 |
| templateId | Long | 是 | 优惠券模板ID | 1 |
| appUserId | Long | 否 | App用户映射ID，传 externalUserId 时可不传 | 1 |
| externalUserId | String | 否 | 下游 App 用户标识，传 appUserId 时可不传 | ext_user_001 |
| sourceChannel | String | 否 | 购买来源渠道 | open_api |
| storeId | Long | 否 | 门店ID，标记用户在哪个门店购买 | 1 |

### OpenApiCouponTemplateCreateReqVO

来源：`mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/coupon/vo/OpenApiCouponTemplateCreateReqVO.java`

| 字段 | 类型 | 必填 | 说明 | 示例 |
|---|---|---|---|---|
| merchantId | Long | 是 | 商户ID | 1 |
| couponType | Integer | 是 | 优惠券类型：1-折扣券 2-满减券 3-礼品券 | 1 |
| name | String | 是 | 优惠券名称 | 满100减20 |
| description | String | 否 | 使用说明 | 满100元可使用 |
| coverUrl | String | 否 | 封面图 | https://example.com/cover.png |
| discountRate | Integer | 否 | 折扣率(%)，折扣券用，如85=8.5折 | 85 |
| maxDiscount | Integer | 否 | 最大优惠金额(分)，折扣券用 | 5000 |
| thresholdAmount | Integer | 否 | 使用门槛金额(分)，满减券用 | 10000 |
| reduceAmount | Integer | 否 | 减免金额(分)，满减券用 | 2000 |
| giftDescription | String | 否 | 礼品说明，礼品券用 | 赠送一杯饮品 |
| totalCount | Integer | 否 | 发行总量，-1=不限 | 1000 |
| claimLimit | Integer | 否 | 每人限领数量 | 1 |
| validityDays | Integer | 是 | 领取后有效天数 | 30 |
| storeScope | Integer | 否 | 适用范围：0-全店通用 1-指定门店 | 0 |
| storeIds | String | 否 | 适用门店IDs(JSON数组) | - |

### OpenApiCouponTemplatePageReqVO

来源：`mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/coupon/vo/OpenApiCouponTemplatePageReqVO.java`

| 字段 | 类型 | 必填 | 说明 | 示例 |
|---|---|---|---|---|
| merchantId | Long | 否 | 商户ID（精确匹配） | 1 |
| couponType | Integer | 否 | 优惠券类型：1-折扣券 2-满减券 3-礼品券 | 1 |

### OpenApiCouponTemplateUpdateReqVO

来源：`mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/coupon/vo/OpenApiCouponTemplateUpdateReqVO.java`

| 字段 | 类型 | 必填 | 说明 | 示例 |
|---|---|---|---|---|
| name | String | 否 | 优惠券名称 | 满100减20 |
| description | String | 否 | 使用说明 | 满100元可使用 |
| coverUrl | String | 否 | 封面图 | https://example.com/cover.png |
| discountRate | Integer | 否 | 折扣率(%)，折扣券用 | 85 |
| maxDiscount | Integer | 否 | 最大优惠金额(分) | 5000 |
| thresholdAmount | Integer | 否 | 使用门槛金额(分) | 10000 |
| reduceAmount | Integer | 否 | 减免金额(分) | 2000 |
| giftDescription | String | 否 | 礼品说明 | 赠送一杯饮品 |
| totalCount | Integer | 否 | 发行总量，-1=不限 | 1000 |
| claimLimit | Integer | 否 | 每人限领数量 | 1 |
| validityDays | Integer | 否 | 领取后有效天数 | 30 |
| storeScope | Integer | 否 | 适用范围：0-全店通用 1-指定门店 | 0 |
| storeIds | String | 否 | 适用门店IDs(JSON数组) | - |

### OpenApiCouponUserPageReqVO

来源：`mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/coupon/vo/OpenApiCouponUserPageReqVO.java`

| 字段 | 类型 | 必填 | 说明 | 示例 |
|---|---|---|---|---|
| merchantId | Long | 否 | 商户ID（精确匹配） | 1 |
| appUserId | Long | 否 | App用户映射ID，传 externalUserId 时可不传 | 1 |
| externalUserId | String | 否 | 下游 App 用户标识，传 appUserId 时可不传 | ext_user_001 |
| status | Integer | 否 | 状态：0-未使用 1-已使用 2-已过期 | 0 |

### OpenApiCouponWriteOffReqVO

来源：`mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/coupon/vo/OpenApiCouponWriteOffReqVO.java`

| 字段 | 类型 | 必填 | 说明 | 示例 |
|---|---|---|---|---|
| merchantId | Long | 是 | 商户ID | 1 |
| storeId | Long | 否 | 门店ID | 1 |
| remark | String | 否 | 备注 | 线下核销 |

### OpenApiCustomerIntakeReqVO

来源：`mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/customer/vo/OpenApiCustomerIntakeReqVO.java`

| 字段 | 类型 | 必填 | 说明 | 示例 |
|---|---|---|---|---|
| externalUserId | String | 是 | 外部用户ID（第三方 App 用户标识） | ext_user_001 |
| realName | String | 否 | 真实姓名（可选，不传则系统自动生成昵称） | 张三 |
| phone | String | 是 | 手机号 | 13800138000 |
| idCardNumber | String | 否 | 身份证号（可选，不传则跳过实名认证环节） | 110101199001011234 |
| nickname | String | 否 | 用户昵称 | 小张 |
| avatarUrl | String | 否 | 用户头像URL | https://example.com/avatar.jpg |

### OpenApiCustomerPageReqVO

来源：`mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/customer/vo/OpenApiCustomerPageReqVO.java`

| 字段 | 类型 | 必填 | 说明 | 示例 |
|---|---|---|---|---|
| merchantId | Long | 否 | 商户ID（精确匹配） | 1 |
| cardType | Integer | 否 | 卡类型：1-储值卡 2-次卡 3-折扣卡 4-套餐卡 | 1 |
| status | Integer | 否 | 状态：0-正常 1-冻结 2-已过期 3-已用完 4-已退卡 5-逾期冻结 | 0 |
| keyword | String | 否 | 关键词（卡号模糊匹配） | MC2024 |

### OpenApiCustomerTagAddReqVO

来源：`mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/customer/vo/OpenApiCustomerTagAddReqVO.java`

| 字段 | 类型 | 必填 | 说明 | 示例 |
|---|---|---|---|---|
| tagName | String | 是 | 标签名称 | VIP客户 |
| tagColor | String | 否 | 标签颜色 | #FF5722 |
| tagDescription | String | 否 | 标签描述 | 高价值客户 |

### OpenApiCustomerTransactionPageReqVO

来源：`mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/customer/vo/OpenApiCustomerTransactionPageReqVO.java`

| 字段 | 类型 | 必填 | 说明 | 示例 |
|---|---|---|---|---|
| bizType | Integer | 否 | 业务类型：1-扫码支付 2-消费券核销 3-手动核销 4-次卡扣次 5-折扣消费 6-套餐项目使用 7-退款回退 8-抵金券购券扣减 9-动态收款码会员卡抵扣 | 1 |

### OpenApiFixedQrcodeCreateReqVO

来源：`mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/fixedqrcode/vo/OpenApiFixedQrcodeCreateReqVO.java`

| 字段 | 类型 | 必填 | 说明 | 示例 |
|---|---|---|---|---|
| merchantId | Long | 是 | 商户ID | 1 |
| storeId | Long | 否 | 门店ID（可选） | 200 |
| subject | String | 否 | 收款标题 | 门店收款 |
| defaultAmount | Integer | 否 | 默认收款金额（分），不填则顾客手动输入 | 10000 |

### OpenApiMemberCardPageReqVO

来源：`mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/membercard/vo/OpenApiMemberCardPageReqVO.java`

| 字段 | 类型 | 必填 | 说明 | 示例 |
|---|---|---|---|---|
| merchantId | Long | 否 | 商户ID（精确匹配） | 1 |
| cardType | Integer | 否 | 卡类型：1-储值卡 2-次卡 3-折扣卡 4-套餐卡 | 1 |
| status | Integer | 否 | 状态：0-正常 1-冻结 2-已过期 3-已用完 4-已退卡 5-逾期冻结 | 0 |
| keyword | String | 否 | 关键词（卡号） | MC2024001 |

### OpenApiMemberCardPurchaseCashierReqVO

来源：`mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/membercard/vo/OpenApiMemberCardPurchaseCashierReqVO.java`

| 字段 | 类型 | 必填 | 说明 | 示例 |
|---|---|---|---|---|
| returnUrl | String | 否 | 支付完成回跳地址 | https://app.example.com/result |
| expireMinutes | Integer | 否 | 过期时间（分钟） | 30 |

### OpenApiMemberCardPurchaseCreateReqVO

来源：`mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/membercard/vo/OpenApiMemberCardPurchaseCreateReqVO.java`

| 字段 | 类型 | 必填 | 说明 | 示例 |
|---|---|---|---|---|
| merchantId | Long | 是 | 商户ID | 1 |
| templateId | Long | 是 | 会员卡模板ID | 1 |
| externalUserId | String | 是 | 下游 App 用户标识 | ext_user_001 |
| phone | String | 否 | 用户手机号（全款购卡且未进件时必传，系统将自动注册用户） | 13800138000 |
| tierId | Long | 否 | 充值档位ID（储值卡选择档位时传入） | 1 |
| paymentMode | Integer | 是 | 支付方式：0-全额付款 1-分期付款 2-延期付款 | 0 |
| bizNo | String | 否 | 下游业务号，平台仅存储并在会员卡购买相关事件回调中原样透传 | mc_order_20260329_001 |
| storeId | Long | 否 | 门店ID，标记用户在哪个门店购买 | 1 |

### OpenApiMemberCardRechargeReqVO

来源：`mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/membercard/vo/OpenApiMemberCardRechargeReqVO.java`

| 字段 | 类型 | 必填 | 说明 | 示例 |
|---|---|---|---|---|
| amount | Integer | 是 | 充值金额(分) | 10000 |
| tierId | Long | 否 | 充值档位ID（使用预设档位时传入） | 1 |

### OpenApiMemberCardRefundApplyReqVO

来源：`mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/membercard/vo/OpenApiMemberCardRefundApplyReqVO.java`

| 字段 | 类型 | 必填 | 说明 | 示例 |
|---|---|---|---|---|
| cardNo | String | 是 | 会员卡卡号 | MC20240001 |
| appUserId | Long | 否 | App用户映射ID，传 externalUserId 时可不传 | 1 |
| externalUserId | String | 否 | 下游 App 用户标识，传 appUserId 时可不传 | ext_user_001 |
| refundAmount | BigDecimal | 是 | 申请退款金额 | 100.00 |
| refundReason | String | 是 | 退款原因 | 不需要了 |
| evidenceUrls | String | 否 | 凭证图片URL列表（JSON数组） | [\"https://example.com/img1.jpg\"] |

### OpenApiMemberCardWriteOffConfirmReqVO

来源：`mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/membercard/vo/OpenApiMemberCardWriteOffConfirmReqVO.java`

| 字段 | 类型 | 必填 | 说明 | 示例 |
|---|---|---|---|---|
| approved | Boolean | 是 | 是否同意核销 | true |
| remark | String | 否 | 备注 | 用户确认核销 |

### OpenApiMemberJoinReqVO

来源：`mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/member/vo/OpenApiMemberJoinReqVO.java`

| 字段 | 类型 | 必填 | 说明 | 示例 |
|---|---|---|---|---|
| merchantId | Long | 是 | 商户ID | 1 |
| externalUserId | String | 是 | 外部用户标识（下游App用户唯一标识） | user_123 |
| storeId | Long | 否 | 办理门店ID（可选，记录在哪个门店办的会员） | 10 |

### OpenApiMemberListReqVO

来源：`mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/member/vo/OpenApiMemberListReqVO.java`

| 字段 | 类型 | 必填 | 说明 | 示例 |
|---|---|---|---|---|
| externalUserId | String | 是 | 外部用户标识 | user_001 |
| merchantName | String | 否 | 商户名称（模糊搜索） | 沐沐 |

### OpenApiMemberRechargeCashierReqVO

来源：`mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/member/vo/OpenApiMemberRechargeCashierReqVO.java`

| 字段 | 类型 | 必填 | 说明 | 示例 |
|---|---|---|---|---|
| returnUrl | String | 否 | 支付完成后的回跳地址 | https://app.example.com/recharge/result |
| expireMinutes | Integer | 否 | 收银台过期时间（分钟），默认30分钟，最长120分钟 | 30 |

### OpenApiMemberRechargeReqVO

来源：`mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/member/vo/OpenApiMemberRechargeReqVO.java`

| 字段 | 类型 | 必填 | 说明 | 示例 |
|---|---|---|---|---|
| memberId | Long | 是 | 会员ID | 1 |
| merchantId | Long | 是 | 商户ID | 1 |
| amount | Integer | 是 | 充值金额(分) | 1000 |

### OpenApiMemberTransactionPageReqVO

来源：`mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/member/vo/OpenApiMemberTransactionPageReqVO.java`

| 字段 | 类型 | 必填 | 说明 | 示例 |
|---|---|---|---|---|
| transactionType | Integer | 否 | 交易类型：1-充值 2-消费 3-退款 4-奖励 5-赠送 | 1 |
| balanceType | Integer | 否 | 余额类型：1-充值余额 2-奖励余额 | 1 |
| startDate | LocalDate | 否 | 起始日期(yyyy-MM-dd,闭区间) | 2026-04-01 |
| endDate | LocalDate | 否 | 截止日期(yyyy-MM-dd,闭区间,包含当天整天) | 2026-04-17 |

### OpenApiMemberWriteOffConfirmReqVO

来源：`mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/member/vo/OpenApiMemberWriteOffConfirmReqVO.java`

| 字段 | 类型 | 必填 | 说明 | 示例 |
|---|---|---|---|---|
| approved | Boolean | 是 | 是否同意核销：true=同意，false=拒绝 | true |
| remark | String | 否 | 备注 | 同意扣款 |

### OpenApiMerchantCertificationReqVO

来源：`mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/merchant/vo/OpenApiMerchantCertificationReqVO.java`

| 字段 | 类型 | 必填 | 说明 | 示例 |
|---|---|---|---|---|
| businessLicense | String | 是 | 营业执照号 | 91440300... |
| licenseUrl | String | 是 | 营业执照图片 URL | - |
| legalPerson | String | 是 | 法人姓名 | 张三 |
| legalPersonIdCard | String | 是 | 法人身份证号 | 440300... |
| idCardFrontUrl | String | 否 | 身份证正面照 URL | - |
| idCardBackUrl | String | 否 | 身份证反面照 URL | - |
| bankName | String | 否 | 开户银行 | 中国银行 |
| bankBranch | String | 否 | 开户支行 | 深圳南山支行 |
| bankAccount | String | 否 | 银行账号 | 6222... |
| bankAccountName | String | 否 | 开户名 | 深圳沐沐美业有限公司 |

### OpenApiMerchantPageReqVO

来源：`mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/merchant/vo/OpenApiMerchantPageReqVO.java`

| 字段 | 类型 | 必填 | 说明 | 示例 |
|---|---|---|---|---|
| name | String | 否 | 商户名称（模糊匹配） | 沐沐 |
| status | Integer | 否 | 状态：0-正常 1-禁用 2-注销 | 0 |

### OpenApiMerchantRegisterReqVO

来源：`mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/merchant/vo/OpenApiMerchantRegisterReqVO.java`

| 字段 | 类型 | 必填 | 说明 | 示例 |
|---|---|---|---|---|
| name | String | 是 | 商户名称 | 沐沐美业 |
| shortName | String | 否 | 商户简称 | 沐沐 |
| contactName | String | 是 | 联系人姓名 | 张三 |
| contactPhone | String | 是 | 联系电话 | 13800138000 |
| contactEmail | String | 否 | 联系邮箱 | contact@example.com |
| province | String | 否 | 省 | 广东省 |
| city | String | 否 | 市 | 深圳市 |
| district | String | 否 | 区 | 南山区 |
| address | String | 否 | 详细地址 | 科技园南区 |

### OpenApiMerchantUpdateReqVO

来源：`mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/merchant/vo/OpenApiMerchantUpdateReqVO.java`

| 字段 | 类型 | 必填 | 说明 | 示例 |
|---|---|---|---|---|
| name | String | 否 | 商户名称 | 沐沐美业 |
| shortName | String | 否 | 商户简称 | 沐沐 |
| logoUrl | String | 否 | Logo URL | - |
| coverUrl | String | 否 | 封面图 URL | - |
| contactName | String | 否 | 联系人姓名 | 张三 |
| contactPhone | String | 否 | 联系电话 | 13800138000 |
| contactEmail | String | 否 | 联系邮箱 | contact@example.com |
| province | String | 否 | 省 | 广东省 |
| city | String | 否 | 市 | 深圳市 |
| district | String | 否 | 区 | 南山区 |
| address | String | 否 | 详细地址 | 科技园南区 |

### OpenApiNearbyStoreReqVO

来源：`mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/merchant/vo/OpenApiNearbyStoreReqVO.java`

| 字段 | 类型 | 必填 | 说明 | 示例 |
|---|---|---|---|---|
| longitude | BigDecimal | 是 | 经度 | 113.9435 |
| latitude | BigDecimal | 是 | 纬度 | 22.5400 |
| radiusKm | Integer | 否 | 搜索半径（km），默认 5 | 5 |
| limit | Integer | 否 | 返回数量限制，默认 20 | 20 |

### OpenApiOrderChangeBookingReqVO

来源：`mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/order/vo/OpenApiOrderChangeBookingReqVO.java`

| 字段 | 类型 | 必填 | 说明 | 示例 |
|---|---|---|---|---|
| changeRemark | String | 是 | 变更说明 | - |

### OpenApiOrderCreateReqVO

来源：`mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/order/vo/OpenApiOrderCreateReqVO.java`

| 字段 | 类型 | 必填 | 说明 | 示例 |
|---|---|---|---|---|
| merchantId | Long | 是 | 商户ID | 1 |
| storeId | Long | 否 | 门店ID | 1 |
| userId | Long | 否 | App用户映射ID，传 externalUserId 时可不传 | 1 |
| externalUserId | String | 否 | 下游 App 用户标识，传 userId 时可不传 | ext_user_001 |
| orderType | Integer | 是 | 订单类型：1-商品购买 2-会员卡办理 3-抵金券购买 4-分期还款 | 1 |
| couponId | Long | 否 | 使用的优惠券ID | 1 |
| voucherIds | String | 否 | 使用的抵金券IDs(JSON数组) | - |
| remark | String | 否 | 备注 | - |
| items | List<Item> | 是 | 订单明细列表 | - |
| itemType | Integer | 是 | 商品类型：1-商品SPU 2-商品SKU 3-会员卡模板 4-抵金券 | 1 |
| itemId | Long | 是 | 关联ID | 1 |
| itemName | String | 是 | 商品名称 | 招牌奶茶 |
| itemCoverUrl | String | 否 | 商品封面图 | - |
| specValues | String | 否 | 规格信息 | - |
| price | Integer | 是 | 单价(分) | 9900 |
| quantity | Integer | 是 | 数量 | 1 |

### OpenApiOrderDeliveryStatusReqVO

来源：`mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/order/vo/OpenApiOrderDeliveryStatusReqVO.java`

| 字段 | 类型 | 必填 | 说明 | 示例 |
|---|---|---|---|---|
| deliveryStatus | Integer | 是 | 配送状态：0-待发货 1-已发货 2-配送中 3-已送达 | 1 |
| deliveryNo | String | 否 | 快递单号 | SF1234567890 |

### OpenApiOrderPageReqVO

来源：`mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/order/vo/OpenApiOrderPageReqVO.java`

| 字段 | 类型 | 必填 | 说明 | 示例 |
|---|---|---|---|---|
| merchantId | Long | 否 | 商户ID | 1 |
| status | Integer | 否 | 订单状态 | 10 |
| orderType | Integer | 否 | 订单类型 | 1 |
| orderNo | String | 否 | 订单号 | 202503120001 |
| userId | Long | 否 | App用户映射ID | 1 |
| externalUserId | String | 否 | 下游 App 用户标识 | ext_user_001 |
| startTime | LocalDateTime | 否 | 开始时间 | - |
| endTime | LocalDateTime | 否 | 结束时间 | - |

### OpenApiOrderPayReqVO

来源：`mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/order/vo/OpenApiOrderPayReqVO.java`

| 字段 | 类型 | 必填 | 说明 | 示例 |
|---|---|---|---|---|
| channelCode | String | 是 | 支付渠道编码 | wx_pub |
| userIp | String | 是 | 用户IP | 127.0.0.1 |
| channelExtras | Map<String, String> | 否 | 支付渠道额外参数 | - |
| returnUrl | String | 否 | 回跳地址 | - |

### OpenApiOrderRefundReqVO

来源：`mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/order/vo/OpenApiOrderRefundReqVO.java`

| 字段 | 类型 | 必填 | 说明 | 示例 |
|---|---|---|---|---|
| refundAmount | Integer | 是 | 退款金额(分) | 5000 |
| reason | String | 是 | 退款原因 | 客户要求退款 |

### OpenApiOrderReviewReqVO

来源：`mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/order/vo/OpenApiOrderReviewReqVO.java`

| 字段 | 类型 | 必填 | 说明 | 示例 |
|---|---|---|---|---|
| content | String | 是 | 评价内容 | - |
| rating | Integer | 否 | 评分(1-5) | 5 |

### OpenApiProductCreateReqVO

来源：`mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/product/vo/OpenApiProductCreateReqVO.java`

| 字段 | 类型 | 必填 | 说明 | 示例 |
|---|---|---|---|---|
| merchantId | Long | 是 | 商户ID | 1 |
| categoryId | Long | 否 | 分类ID | 1 |
| spuName | String | 是 | 商品名称 | 招牌奶茶 |
| subtitle | String | 否 | 副标题/卖点 | 超值优惠 |
| productType | Integer | 否 | 商品类型：1-实物商品 2-餐饮商品 3-服务项目 4-计时服务 5-虚拟商品 6-套餐组合 | 1 |
| unit | String | 否 | 商品单位 | 份 |
| serviceDuration | Integer | 否 | 服务时长（分钟） | 60 |
| coverUrl | String | 是 | 封面图URL | - |
| images | String | 否 | 轮播图（JSON数组） | - |
| description | String | 否 | 商品简介 | - |
| detail | String | 否 | 商品详情（富文本） | - |
| tags | String | 否 | 商品标签（JSON数组） | - |
| price | Integer | 是 | 售价（分） | 9900 |
| originalPrice | Integer | 否 | 原价/划线价（分） | 19900 |
| memberPrice | Integer | 否 | 会员价（分） | 8900 |
| vipPrice | Integer | 否 | VIP价（分） | 7900 |
| costPrice | Integer | 否 | 成本价（分） | 5000 |
| stock | Integer | 是 | 总库存 | 100 |
| stockType | Integer | 否 | 库存类型：1-有限库存 2-无限库存 3-资源限制 4-时段库存 | 1 |
| stockWarning | Integer | 否 | 库存预警值 | 10 |
| storeScope | Integer | 否 | 适用范围：0-全店通用 1-指定门店 | 0 |
| storeIds | String | 否 | 适用门店IDs（JSON数组） | - |
| sort | Integer | 否 | 排序 | 0 |
| recommended | Integer | 否 | 是否推荐：0-否 1-是 | 0 |
| specType | Integer | 否 | 规格类型：0-单规格 1-多规格 | 0 |
| status | Integer | 否 | 状态：0-上架 1-下架 | 0 |

### OpenApiProductPageReqVO

来源：`mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/product/vo/OpenApiProductPageReqVO.java`

| 字段 | 类型 | 必填 | 说明 | 示例 |
|---|---|---|---|---|
| merchantId | Long | 否 | 商户ID（精确匹配） | 1 |
| categoryId | Long | 否 | 分类ID | 1 |
| spuName | String | 否 | 商品名称（模糊匹配） | 招牌奶茶 |
| status | Integer | 否 | 状态：0-上架 1-下架 2-售罄 | 0 |
| productType | Integer | 否 | 商品类型：1-实物商品 2-餐饮商品 3-服务项目 4-计时服务 5-虚拟商品 6-套餐组合 | 1 |

### OpenApiProductSearchReqVO

来源：`mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/product/vo/OpenApiProductSearchReqVO.java`

| 字段 | 类型 | 必填 | 说明 | 示例 |
|---|---|---|---|---|
| keyword | String | 是 | 搜索关键词 | 奶茶 |
| categoryId | Long | 否 | 分类ID | 1 |
| minPrice | Integer | 否 | 最低价格（分） | 1000 |
| maxPrice | Integer | 否 | 最高价格（分） | 50000 |
| sortBy | String | 否 | 排序字段：price/salesCount/createTime | salesCount |
| sortOrder | String | 否 | 排序方向：asc/desc | desc |

### OpenApiProductStatusUpdateReqVO

来源：`mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/product/vo/OpenApiProductStatusUpdateReqVO.java`

| 字段 | 类型 | 必填 | 说明 | 示例 |
|---|---|---|---|---|
| status | Integer | 是 | 状态：0-上架 1-下架 | 0 |

### OpenApiProductUpdateReqVO

来源：`mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/product/vo/OpenApiProductUpdateReqVO.java`

| 字段 | 类型 | 必填 | 说明 | 示例 |
|---|---|---|---|---|
| categoryId | Long | 否 | 分类ID | 1 |
| spuName | String | 否 | 商品名称 | 招牌奶茶 |
| subtitle | String | 否 | 副标题/卖点 | 超值优惠 |
| productType | Integer | 否 | 商品类型 | 1 |
| unit | String | 否 | 商品单位 | 份 |
| serviceDuration | Integer | 否 | 服务时长（分钟） | 60 |
| coverUrl | String | 否 | 封面图URL | - |
| images | String | 否 | 轮播图（JSON数组） | - |
| description | String | 否 | 商品简介 | - |
| detail | String | 否 | 商品详情（富文本） | - |
| tags | String | 否 | 商品标签（JSON数组） | - |
| price | Integer | 否 | 售价（分） | 9900 |
| originalPrice | Integer | 否 | 原价/划线价（分） | 19900 |
| memberPrice | Integer | 否 | 会员价（分） | 8900 |
| vipPrice | Integer | 否 | VIP价（分） | 7900 |
| costPrice | Integer | 否 | 成本价（分） | 5000 |
| stock | Integer | 否 | 总库存 | 100 |
| stockType | Integer | 否 | 库存类型 | 1 |
| stockWarning | Integer | 否 | 库存预警值 | 10 |
| storeScope | Integer | 否 | 适用范围：0-全店通用 1-指定门店 | 0 |
| storeIds | String | 否 | 适用门店IDs（JSON数组） | - |
| sort | Integer | 否 | 排序 | 0 |
| recommended | Integer | 否 | 是否推荐：0-否 1-是 | 0 |
| specType | Integer | 否 | 规格类型：0-单规格 1-多规格 | 0 |

### OpenApiResourceCreateReqVO

来源：`mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/resource/vo/OpenApiResourceCreateReqVO.java`

| 字段 | 类型 | 必填 | 说明 | 示例 |
|---|---|---|---|---|
| merchantId | Long | 是 | 商户ID | 1 |
| storeId | Long | 是 | 门店ID | 1 |
| typeId | Long | 是 | 资源类型ID | 1 |
| resourceName | String | 是 | 资源名称 | VIP包间1号 |
| resourcePhoto | String | 否 | 资源照片URL | - |
| description | String | 否 | 资源描述 | - |
| tags | String | 否 | 资源标签(JSON数组) | - |
| attributes | String | 否 | 资源扩展属性(JSON格式) | - |
| isEnabled | Integer | 否 | 是否启用：0-否 1-是 | 1 |
| isAcceptBooking | Integer | 否 | 是否接受预约：0-否 1-是 | 1 |
| isShowInApp | Integer | 否 | 是否在APP显示：0-否 1-是 | 1 |
| sort | Integer | 否 | 排序 | 0 |
| priority | Integer | 否 | 推荐优先级 | 0 |

### OpenApiResourcePageReqVO

来源：`mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/resource/vo/OpenApiResourcePageReqVO.java`

| 字段 | 类型 | 必填 | 说明 | 示例 |
|---|---|---|---|---|
| merchantId | Long | 否 | 商户ID（精确匹配） | 1 |
| storeId | Long | 否 | 门店ID | 1 |
| typeId | Long | 否 | 资源类型ID | 1 |
| resourceName | String | 否 | 资源名称（模糊匹配） | VIP包间 |
| status | Integer | 否 | 当前状态：0-空闲 1-预订中 2-占用中 3-维护中 4-停用 5-休息中 | 0 |
| isEnabled | Integer | 否 | 是否启用：0-否 1-是 | 1 |
| isAcceptBooking | Integer | 否 | 是否接受预约：0-否 1-是 | 1 |

### OpenApiResourcePriceUpdateReqVO

来源：`mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/resource/vo/OpenApiResourcePriceUpdateReqVO.java`

| 字段 | 类型 | 必填 | 说明 | 示例 |
|---|---|---|---|---|
| billingMethod | Integer | 是 | - | - |
| basePrice | Integer | 是 | 基础价格(分) | 10000 |
| memberPrice | Integer | 否 | 会员价格(分) | 8000 |
| vipPrice | Integer | 否 | VIP价格(分) | 6000 |
| timeSlotPrices | String | 否 | 时段价格(JSON格式) | - |
| tieredPrices | String | 否 | 阶梯价格(JSON格式) | - |
| packagePrices | String | 否 | 套餐价格(JSON格式) | - |
| extraFees | String | 否 | 附加费用(JSON格式) | - |
| bufferMinutes | Integer | 否 | 预约间隔缓冲时间(分钟) | 15 |
| minBookingMinutes | Integer | 否 | 最小预约时长(分钟) | 30 |
| maxBookingMinutes | Integer | 否 | 最大预约时长(分钟) | 480 |
| isEnabled | Integer | 否 | 是否启用：0-否 1-是 | 1 |

### OpenApiResourceScheduleUpdateReqVO

来源：`mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/resource/vo/OpenApiResourceScheduleUpdateReqVO.java`

| 字段 | 类型 | 必填 | 说明 | 示例 |
|---|---|---|---|---|
| scheduleType | Integer | 是 | - | - |
| dayOfWeek | Integer | 否 | 星期几(1-7，1=周一，固定排班专用) | 1 |
| scheduleDate | LocalDate | 否 | 排班日期(灵活排班专用) | - |
| timeSlots | String | 是 | 工作时间段(JSON数组) | - |
| isRestDay | Integer | 否 | 是否休息日：0-否 1-是 | 0 |
| remark | String | 否 | 备注 | - |
| isEnabled | Integer | 否 | 是否启用：0-否 1-是 | 1 |

### OpenApiResourceStatusUpdateReqVO

来源：`mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/resource/vo/OpenApiResourceStatusUpdateReqVO.java`

| 字段 | 类型 | 必填 | 说明 | 示例 |
|---|---|---|---|---|
| status | Integer | 是 | - | - |
| changeReason | String | 否 | 变更原因 | - |

### OpenApiResourceUpdateReqVO

来源：`mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/resource/vo/OpenApiResourceUpdateReqVO.java`

| 字段 | 类型 | 必填 | 说明 | 示例 |
|---|---|---|---|---|
| resourceName | String | 否 | 资源名称 | VIP包间1号 |
| resourcePhoto | String | 否 | 资源照片URL | - |
| description | String | 否 | 资源描述 | - |
| tags | String | 否 | 资源标签(JSON数组) | - |
| attributes | String | 否 | 资源扩展属性(JSON格式) | - |
| isEnabled | Integer | 否 | 是否启用：0-否 1-是 | 1 |
| isAcceptBooking | Integer | 否 | 是否接受预约：0-否 1-是 | 1 |
| isShowInApp | Integer | 否 | 是否在APP显示：0-否 1-是 | 1 |
| sort | Integer | 否 | 排序 | 0 |
| priority | Integer | 否 | 推荐优先级 | 0 |

### OpenApiRiskModelExecuteReqVO

来源：`mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/risk/vo/OpenApiRiskModelExecuteReqVO.java`

| 字段 | 类型 | 必填 | 说明 | 示例 |
|---|---|---|---|---|
| merchantId | Long | 是 | 合作商户ID | 1 |
| appUserId | Long | 否 | 开放平台用户ID | 1001 |
| externalUserId | String | 否 | 外部用户标识，与 appUserId 二选一 | user_001 |
| creditAmount | Integer | 否 | 赊账金额(分) | 50000 |
| input | Map<String, Object> | 否 | 额外输入参数 | - |
| timeout | Long | 否 | 超时时间（毫秒），默认 5000 | 5000 |

### OpenApiStatisticsExportReqVO

来源：`mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/statistics/vo/OpenApiStatisticsExportReqVO.java`

| 字段 | 类型 | 必填 | 说明 | 示例 |
|---|---|---|---|---|
| merchantId | Long | 是 | 商户ID | 1 |
| reportType | String | 是 | 报表类型：overview/sales/customers/channels/bookings | sales |
| period | String | 否 | 统计周期：today/yesterday/week/month/custom | week |
| startTime | LocalDateTime | 否 | 自定义开始时间（period为custom时必填） | - |
| endTime | LocalDateTime | 否 | 自定义结束时间（period为custom时必填） | - |
| fileFormat | String | 否 | 导出格式：xlsx/csv | xlsx |

### OpenApiStatisticsSalesReqVO

来源：`mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/statistics/vo/OpenApiStatisticsSalesReqVO.java`

| 字段 | 类型 | 必填 | 说明 | 示例 |
|---|---|---|---|---|
| merchantId | Long | 是 | 商户ID | 1 |
| period | String | 否 | 统计周期：today/yesterday/week/month | week |

### OpenApiStockLogPageReqVO

来源：`mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/product/vo/OpenApiStockLogPageReqVO.java`

| 字段 | 类型 | 必填 | 说明 | 示例 |
|---|---|---|---|---|
| changeType | Integer | 否 | 变动类型：1-入库 2-出库 3-调整 4-调拨 5-订单扣减 6-订单取消恢复 7-盘点 | 1 |

### OpenApiStockOperationReqVO

来源：`mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/product/vo/OpenApiStockOperationReqVO.java`

| 字段 | 类型 | 必填 | 说明 | 示例 |
|---|---|---|---|---|
| quantity | Integer | 是 | 数量（正数） | 10 |
| reason | String | 否 | 原因 | 采购入库 |
| remark | String | 否 | 备注 | 供应商送货 |

### OpenApiStoreCreateReqVO

来源：`mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/merchant/vo/OpenApiStoreCreateReqVO.java`

| 字段 | 类型 | 必填 | 说明 | 示例 |
|---|---|---|---|---|
| merchantId | Long | 是 | 商户ID | 1 |
| storeName | String | 是 | 门店名称 | 南山旗舰店 |
| logoUrl | String | 否 | 门店Logo URL | - |
| coverUrl | String | 否 | 门店封面图 URL | - |
| categoryId | Long | 否 | 门店品类ID | - |
| tags | String | 否 | 标签（JSON 数组） | - |
| province | String | 否 | 省 | 广东省 |
| city | String | 否 | 市 | 深圳市 |
| district | String | 否 | 区 | 南山区 |
| address | String | 否 | 详细地址 | 科技园南区 |
| longitude | BigDecimal | 否 | 经度 | 113.9435 |
| latitude | BigDecimal | 否 | 纬度 | 22.5400 |
| contactName | String | 否 | 门店联系人 | 李四 |
| contactPhone | String | 否 | 门店联系电话 | 13800138001 |
| businessHours | String | 否 | 营业时间 | 09:00-22:00 |

### OpenApiStorePageReqVO

来源：`mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/merchant/vo/OpenApiStorePageReqVO.java`

| 字段 | 类型 | 必填 | 说明 | 示例 |
|---|---|---|---|---|
| merchantId | Long | 否 | 指定商户ID | 1 |
| storeName | String | 否 | 门店名称（模糊匹配） | 旗舰店 |
| status | Integer | 否 | 状态：0-正常 1-关闭 | 0 |

### OpenApiStoreUpdateReqVO

来源：`mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/merchant/vo/OpenApiStoreUpdateReqVO.java`

| 字段 | 类型 | 必填 | 说明 | 示例 |
|---|---|---|---|---|
| storeName | String | 否 | 门店名称 | 南山旗舰店 |
| logoUrl | String | 否 | 门店Logo URL | - |
| coverUrl | String | 否 | 门店封面图 URL | - |
| categoryId | Long | 否 | 门店品类ID | - |
| tags | String | 否 | 标签（JSON 数组） | - |
| province | String | 否 | 省 | 广东省 |
| city | String | 否 | 市 | 深圳市 |
| district | String | 否 | 区 | 南山区 |
| address | String | 否 | 详细地址 | 科技园南区 |
| longitude | BigDecimal | 否 | 经度 | 113.9435 |
| latitude | BigDecimal | 否 | 纬度 | 22.5400 |
| contactName | String | 否 | 门店联系人 | 李四 |
| contactPhone | String | 否 | 门店联系电话 | 13800138001 |
| businessHours | String | 否 | 营业时间 | 09:00-22:00 |
| announcement | String | 否 | 门店公告 | - |
| photos | String | 否 | 门店照片（JSON 数组） | - |

### OpenApiSubmitIdCardReqVO

来源：`mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/realnameauth/vo/OpenApiSubmitIdCardReqVO.java`

| 字段 | 类型 | 必填 | 说明 | 示例 |
|---|---|---|---|---|
| idCardFrontUrl | String | 否 | 身份证正面（人像面）照片URL | https://example.com/front.jpg |
| idCardBackUrl | String | 否 | 身份证背面（国徽面）照片URL | https://example.com/back.jpg |

### OpenApiTaskClaimReqVO

来源：`mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/consumptiontask/vo/OpenApiTaskClaimReqVO.java`

| 字段 | 类型 | 必填 | 说明 | 示例 |
|---|---|---|---|---|
| taskId | Long | 是 | 任务ID | 1 |
| externalUserId | String | 是 | 外部用户标识 | user_001 |
| merchantId | Long | 是 | 商户ID | 1 |
| storeId | Long | 否 | 领取门店ID（可选） | 10 |

### OpenApiWithdrawAccountBindReqVO

来源：`mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/withdraw/vo/OpenApiWithdrawAccountBindReqVO.java`

| 字段 | 类型 | 必填 | 说明 | 示例 |
|---|---|---|---|---|
| externalUserId | String | 是 | App端用户标识 | user_10001 |
| accountType | Integer | 是 | 账户类型（1=银行卡 2=微信 3=支付宝） | 1 |
| accountName | String | 是 | 账户持有人姓名 | 张三 |
| cardNo | String | 否 | 银行卡号（accountType=1时必填） | 6222000012345678 |
| bankName | String | 否 | 开户行名称（accountType=1时必填） | 中国银行 |
| bankBranch | String | 否 | 开户行支行 | 深圳南山支行 |
| wechatOpenid | String | 否 | 微信OpenID（accountType=2时必填） | oUpF8uMuAJO_M2pxb1Q9zNjWeS6o |
| alipayAccount | String | 否 | 支付宝账号（accountType=3时必填） | zhangsan@alipay.com |

### OpenApiWithdrawCreateReqVO

来源：`mm-module-open/mm-module-open-server/src/main/java/top/morplcp/mm/module/open/controller/openapi/withdraw/vo/OpenApiWithdrawCreateReqVO.java`

| 字段 | 类型 | 必填 | 说明 | 示例 |
|---|---|---|---|---|
| externalUserId | String | 是 | App端用户标识 | user_10001 |
| merchantWithdrawNo | String | 是 | 商户提现单号（下游App保证唯一） | WD202603170001 |
| amount | Integer | 是 | 提现金额（单位：分） | 10000 |
| subject | String | 否 | 提现标题/备注 | 用户提现 |
| withdrawAccountId | Long | 否 | 绑定的提现账户ID（与直传账户二选一，优先使用） | 1024 |
| accountType | Integer | 否 | 账户类型（1=银行卡 2=微信 3=支付宝），直传时必填 | 3 |
| accountName | String | 否 | 账户持有人姓名，直传时必填 | 张三 |
| cardNo | String | 否 | 银行卡号（accountType=1时必填） | 6222000012345678 |
| bankName | String | 否 | 开户行名称（accountType=1时必填） | 中国银行 |
| wechatOpenid | String | 否 | 微信OpenID（accountType=2时必填） | oUpF8uMuAJO_M2pxb1Q9zNjWeS6o |
| alipayAccount | String | 否 | 支付宝账号（accountType=3时必填） | zhangsan@alipay.com |

### OpenBillingOrderCreateReqDTO

来源：`mm-module-merchant/mm-module-merchant-api/src/main/java/top/morplcp/mm/module/merchant/api/openbilling/dto/OpenBillingOrderCreateReqDTO.java`

| 字段 | 类型 | 必填 | 说明 | 示例 |
|---|---|---|---|---|
| appId | Long | 是 | - | - |
| appUserId | Long | 否 | - | - |
| platformUserId | Long | 否 | - | - |
| externalUserId | String | 否 | - | - |

### OpenBillingOrderPageReqDTO

来源：`mm-module-merchant/mm-module-merchant-api/src/main/java/top/morplcp/mm/module/merchant/api/openbilling/dto/OpenBillingOrderPageReqDTO.java`

| 字段 | 类型 | 必填 | 说明 | 示例 |
|---|---|---|---|---|
| merchantIds | List<Long> | 否 | - | - |
| merchantId | Long | 否 | - | - |
| resourceId | Long | 否 | - | - |
| status | Integer | 否 | - | - |
| appUserId | Long | 否 | - | - |
| billingMode | Integer | 否 | - | - |

### OpenBillingPackageOrderCreateReqDTO

来源：`mm-module-merchant/mm-module-merchant-api/src/main/java/top/morplcp/mm/module/merchant/api/openbilling/dto/OpenBillingPackageOrderCreateReqDTO.java`

| 字段 | 类型 | 必填 | 说明 | 示例 |
|---|---|---|---|---|
| appId | Long | 是 | - | - |
| appUserId | Long | 否 | - | - |
| platformUserId | Long | 否 | - | - |
| externalUserId | String | 否 | - | - |

### OpenBillingPackageSaveReqDTO

来源：`mm-module-merchant/mm-module-merchant-api/src/main/java/top/morplcp/mm/module/merchant/api/openbilling/dto/OpenBillingPackageSaveReqDTO.java`

| 字段 | 类型 | 必填 | 说明 | 示例 |
|---|---|---|---|---|
| id | Long | 否 | - | - |
| resourceTypeId | Long | 是 | - | - |
| packageDesc | String | 是 | - | - |
| memberPrice | Integer | 是 | - | - |
| applicableStartTime | String | 否 | - | - |
| applicableEndTime | String | 否 | - | - |
| applicableDays | String | 否 | - | - |
| includes | String | 否 | - | - |
| sort | Integer | 否 | - | - |
| status | Integer | 否 | - | - |

### OpenCommentCreateReqDTO

来源：`mm-module-merchant/mm-module-merchant-api/src/main/java/top/morplcp/mm/module/merchant/api/opencomment/dto/OpenCommentCreateReqDTO.java`

| 字段 | 类型 | 必填 | 说明 | 示例 |
|---|---|---|---|---|
| storeId | Long | 是 | - | - |
| orderId | Long | 否 | - | - |
| orderNo | String | 否 | - | - |
| externalUserId | String | 否 | - | - |
| userNickname | String | 否 | - | - |
| userAvatar | String | 否 | - | - |
| isAnonymous | Boolean | 否 | - | - |
| images | List<String> | 是 | - | - |
| tags | List<String> | 否 | - | - |
| userCity | String | 否 | - | - |
| userPhone | String | 否 | - | - |
| sourceAppId | Long | 否 | - | - |

### OpenDeviceEventReqDTO

来源：`mm-module-merchant/mm-module-merchant-api/src/main/java/top/morplcp/mm/module/merchant/api/openbilling/dto/OpenDeviceEventReqDTO.java`

| 字段 | 类型 | 必填 | 说明 | 示例 |
|---|---|---|---|---|
| extra | String | 是 | - | - |

### OpenResourcePriceSaveReqDTO

来源：`mm-module-merchant/mm-module-merchant-api/src/main/java/top/morplcp/mm/module/merchant/api/openbilling/dto/OpenResourcePriceSaveReqDTO.java`

| 字段 | 类型 | 必填 | 说明 | 示例 |
|---|---|---|---|---|
| memberPrice | Integer | 是 | - | - |
| vipPrice | Integer | 否 | - | - |
| minDuration | Integer | 否 | - | - |
| maxDuration | Integer | 否 | - | - |
| freeDuration | Integer | 否 | - | - |
| billingUnit | Integer | 否 | - | - |
| stepBillingStart | Integer | 否 | - | - |
| stepBillingUnit | Integer | 否 | - | - |
| timeSlotPrices | String | 否 | - | - |
| unlockDeadline | Integer | 否 | - | - |
| bufferMinutes | Integer | 否 | - | - |
| cancelFreeMinutes | Integer | 否 | - | - |
| cancelFeeRate | Integer | 否 | - | - |
| holidayPriceRate | Integer | 否 | - | - |

### PageParam

来源：`mm-framework/mm-common/src/main/java/top/morplcp/mm/framework/common/pojo/PageParam.java`

未解析到字段。
