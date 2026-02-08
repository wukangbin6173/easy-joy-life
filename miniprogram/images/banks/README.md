# 银行 Logo 说明

## 已支持的银行

| 银行代码 | 银行名称 | 品牌色 | Logo文件 |
|---------|---------|--------|---------|
| icbc | 工商银行 | #C8161D | icbc.png |
| ccb | 建设银行 | #003D7C | ccb.png |
| abc | 农业银行 | #00843D | abc.png |
| boc | 中国银行 | #B8292F | boc.png |
| cmb | 招商银行 | #D32F2F | cmb.png |
| comm | 交通银行 | #0066B3 | comm.png |
| psbc | 邮储银行 | #00853F | psbc.png |
| cib | 兴业银行 | #003D7C | cib.png |
| spdb | 浦发银行 | #003D7C | spdb.png |
| citic | 中信银行 | #D32F2F | citic.png |

## 使用方法

### 1. 在小程序中使用

```javascript
// 引入银行配置
const bankConfig = require('../../utils/bank-config.js');

// 根据卡号识别银行
const bankCode = bankConfig.getBankByCardNo('6222021234567890');
const bankInfo = bankConfig.BANK_CONFIG[bankCode];

// 使用 logo
<image src="{{bankInfo.logo}}" />
```

### 2. 支持的卡号前缀

每个银行支持多个卡号前缀（BIN码），详见 `bank-config.js`

### 3. 重新生成 Logo

如果需要重新生成或修改 logo：

```bash
python create_bank_logos_enhanced.py
```

## Logo 规格

- 尺寸：200x200 像素
- 格式：PNG（支持透明）
- 圆角：20px
- 文字：银行简称（白色）
- 背景：银行品牌色

## 添加新银行

1. 在 `create_bank_logos_enhanced.py` 中添加银行信息
2. 在 `bank-config.js` 中添加配置和卡号前缀
3. 运行脚本生成 logo

## 注意事项

- Logo 仅用于识别，不代表官方授权
- 品牌色参考各银行官方网站
- 卡号前缀（BIN码）可能会更新，需定期维护
