// app.js
App({
  globalData: {
    userInfo: null,
    baseUrl: 'http://192.168.110.28:8080',
    token: null,
    mockMode: false // 使用真实API，通过IP地址访问
  },

  onLaunch() {
    console.log('小程序启动');
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