// app.js
const config = require('./utils/config.js');

App({
  globalData: {
    userInfo: null,
    baseUrl: '',
    token: null,
    mockMode: false
  },

  onLaunch() {
    console.log('小程序启动');
    
    // 获取环境配置
    const envConfig = config.getCurrentConfig();
    this.globalData.baseUrl = envConfig.baseUrl;
    this.globalData.mockMode = envConfig.mockMode;
    
    console.log('API地址:', this.globalData.baseUrl);
    console.log('模拟模式:', this.globalData.mockMode);
    
    // 暂时注释掉可能有问题的代码
    // this.checkLogin();
  },

  onShow() {
    console.log('小程序显示');
  },

  onHide() {
    console.log('小程序隐藏');
  },

  onError(msg) {
    console.error('小程序错误:', msg);
  }
});