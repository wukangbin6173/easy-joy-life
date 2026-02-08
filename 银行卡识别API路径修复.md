# 银行卡识别API路径修复

## 问题描述
小程序在添加银行卡时，调用银行识别API返回404错误：
```
https://xx.aieo.cn/api/bank/identify 404
```

## 问题原因
前端调用的API路径与后端提供的路径不匹配：

- **前端调用路径**：`/api/bank/identify`
- **后端实际路径**：`/api/user/bank-cards/identify`

## 修复方案

### 修改文件
`miniprogram/pages/add-bank-card/add-bank-card.js`

### 修改内容
```javascript
// 修改前
url: `${app.globalData.apiBaseUrl}/api/bank/identify`,

// 修改后
url: `${app.globalData.apiBaseUrl}/api/user/bank-cards/identify`,
```

## 后端API端点说明

### BankCardController
基础路径：`/api/user/bank-cards`

完整端点列表：
1. `GET /api/user/bank-cards/{userId}` - 获取用户银行卡列表
2. `POST /api/user/bank-cards` - 添加银行卡
3. `POST /api/user/bank-cards/identify` - 识别银行（根据卡号前6位）
4. `PUT /api/user/bank-cards/{cardId}/default` - 设置默认银行卡
5. `DELETE /api/user/bank-cards/{cardId}` - 删除银行卡

### PayPasswordController
基础路径：`/api/user`

完整端点列表：
1. `GET /api/user/has-pay-password/{userId}` - 检查是否已设置支付密码
2. `POST /api/user/pay-password` - 设置支付密码
3. `PUT /api/user/pay-password` - 修改支付密码
4. `POST /api/user/pay-password/verify` - 验证支付密码

## 测试验证

### 测试银行识别API
```bash
curl -X POST https://xx.aieo.cn/api/user/bank-cards/identify \
  -H "Content-Type: application/json" \
  -d '{"cardNo":"622202"}'
```

预期响应：
```json
{
  "success": true,
  "bankName": "工商银行",
  "bankCode": "ICBC"
}
```

### 常见银行卡号前缀
- 工商银行：622202, 622200, 621226
- 建设银行：436742, 622280, 621700
- 农业银行：622848, 622845, 621336
- 中国银行：621660, 621661, 621662
- 交通银行：622260, 622261, 621002

## 修复状态
- [x] 识别问题原因
- [x] 修改前端代码
- [ ] 测试银行识别功能
- [ ] 测试添加银行卡完整流程

## 注意事项
1. 修改后需要重新编译小程序
2. 在微信开发者工具中测试
3. 确保后端服务正常运行
4. 验证码功能需要短信服务支持（如果未配置，可以暂时跳过验证码验证）

## 相关文件
- `miniprogram/pages/add-bank-card/add-bank-card.js` - 添加银行卡页面
- `backend/src/main/java/com/easyjoylife/controller/BankCardController.java` - 银行卡控制器
- `backend/src/main/java/com/easyjoylife/service/BankCardService.java` - 银行卡服务
