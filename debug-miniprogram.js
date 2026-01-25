// 小程序调试脚本 - 复制到小程序控制台运行

// 1. 检查网络状态
wx.getNetworkType({
  success: (res) => {
    console.log('网络类型:', res.networkType);
  }
});

// 2. 测试API请求
wx.request({
  url: 'https://xx.aieo.cn/api/stores',
  method: 'GET',
  header: {
    'Content-Type': 'application/json'
  },
  success: (res) => {
    console.log('✅ API请求成功:', res);
    console.log('状态码:', res.statusCode);
    console.log('数据:', res.data);
  },
  fail: (err) => {
    console.log('❌ API请求失败:', err);
  }
});

// 3. 检查域名配置
console.log('当前域名配置需要在微信小程序后台添加:');
console.log('request合法域名: https://xx.aieo.cn');