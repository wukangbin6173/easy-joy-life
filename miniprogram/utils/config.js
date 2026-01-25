// 环境配置
const config = {
  // 开发环境
  development: {
    baseUrl: 'https://xx.aieo.cn',
    debug: true
  },
  
  // 生产环境
  production: {
    baseUrl: 'https://xx.aieo.cn',
    debug: false
  }
};

// 自动检测环境
function getEnvironment() {
  // 可以通过不同方式检测环境
  // 方法1: 通过域名检测
  const accountInfo = wx.getAccountInfoSync();
  if (accountInfo.miniProgram.envVersion === 'develop') {
    return 'development';
  }
  
  // 方法2: 手动设置（推荐用于测试）
  return 'development';
  // return 'production';      // 发布时使用
}

// 获取当前环境配置
function getCurrentConfig() {
  const env = getEnvironment();
  const currentConfig = config[env];
  
  console.log('当前环境:', env);
  console.log('配置信息:', currentConfig);
  
  return currentConfig;
}

module.exports = {
  getCurrentConfig,
  getEnvironment
};