Page({
  data: {
    baseUrl: '',
    appId: '',
    selectedAmount: 0.01,
    canTestPay: false,
    currentOrderNo: '',
    currentOpenid: '',
    configStatus: {
      api: false,
      appId: false
    },
    testResults: {
      login: '',
      order: '',
      payment: ''
    },
    logs: []
  },

  onLoad() {
    this.initConfig();
    this.addLog('页面加载完成');
  },

  // 初始化配置
  initConfig() {
    const app = getApp();
    const accountInfo = wx.getAccountInfoSync();
    
    this.setData({
      baseUrl: app.globalData.baseUrl,
      appId: accountInfo.miniProgram.appId,
      'configStatus.api': !!app.globalData.baseUrl,
      'configStatus.appId': !!accountInfo.miniProgram.appId
    });

    this.addLog(`API地址: ${app.globalData.baseUrl}`);
    this.addLog(`小程序AppID: ${accountInfo.miniProgram.appId}`);
  },

  // 选择测试金额
  selectAmount(e) {
    const amount = parseFloat(e.currentTarget.dataset.amount);
    this.setData({ selectedAmount: amount });
    this.addLog(`选择测试金额: ¥${amount}`);
  },

  // 测试微信登录
  testWechatLogin() {
    this.addLog('开始测试微信登录...');
    this.setData({ 'testResults.login': 'pending' });

    wx.login({
      success: (res) => {
        if (res.code) {
          this.addLog(`获取到登录code: ${res.code.substring(0, 10)}...`);
          
          // 调用后端登录接口
          wx.request({
            url: `${this.data.baseUrl}/api/auth/wechat/login`,
            method: 'POST',
            data: { code: res.code },
            success: (response) => {
              if (response.statusCode === 200 && response.data.success) {
                const openid = response.data.openid;
                this.setData({ 
                  currentOpenid: openid,
                  'testResults.login': 'success',
                  canTestPay: true
                });
                this.addLog(`✅ 微信登录成功，openid: ${openid.substring(0, 10)}...`);
              } else {
                this.setData({ 'testResults.login': 'error' });
                this.addLog(`❌ 微信登录失败: ${response.data.message || '未知错误'}`);
              }
            },
            fail: (error) => {
              this.setData({ 'testResults.login': 'error' });
              this.addLog(`❌ 登录请求失败: ${error.errMsg}`);
            }
          });
        } else {
          this.setData({ 'testResults.login': 'error' });
          this.addLog('❌ 获取登录code失败');
        }
      },
      fail: (error) => {
        this.setData({ 'testResults.login': 'error' });
        this.addLog(`❌ 微信登录失败: ${error.errMsg}`);
      }
    });
  },

  // 测试创建订单
  testCreateOrder() {
    this.addLog('开始测试创建订单...');
    this.setData({ 'testResults.order': 'pending' });

    const app = getApp();
    const userId = app.globalData.userId;
    
    if (!userId) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      });
      return;
    }
    
    const orderData = {
      userId: userId,
      amount: this.data.selectedAmount,
      paymentMethod: 'WECHAT'
    };

    wx.request({
      url: `${this.data.baseUrl}/api/payment/recharge/create`,
      method: 'POST',
      header: { 'Content-Type': 'application/json' },
      data: orderData,
      success: (res) => {
        if (res.statusCode === 200 && res.data.success) {
          const orderNo = res.data.orderNo;
          this.setData({ 
            currentOrderNo: orderNo,
            'testResults.order': 'success'
          });
          this.addLog(`✅ 订单创建成功: ${orderNo}`);
        } else {
          this.setData({ 'testResults.order': 'error' });
          this.addLog(`❌ 订单创建失败: ${res.data.message || '未知错误'}`);
        }
      },
      fail: (error) => {
        this.setData({ 'testResults.order': 'error' });
        this.addLog(`❌ 创建订单请求失败: ${error.errMsg}`);
      }
    });
  },

  // 测试微信支付
  testWechatPay() {
    if (!this.data.currentOrderNo || !this.data.currentOpenid) {
      wx.showToast({
        title: '请先完成登录和创建订单测试',
        icon: 'none'
      });
      return;
    }

    this.addLog('开始测试微信支付...');
    this.setData({ 'testResults.payment': 'pending' });

    // 调用微信支付接口
    wx.request({
      url: `${this.data.baseUrl}/api/payment/wechat/pay`,
      method: 'POST',
      header: { 'Content-Type': 'application/json' },
      data: {
        orderNo: this.data.currentOrderNo,
        openid: this.data.currentOpenid
      },
      success: (res) => {
        if (res.statusCode === 200 && res.data.success) {
          const payParams = res.data.payParams;
          this.addLog('✅ 获取支付参数成功，发起支付...');
          
          // 发起微信支付
          wx.requestPayment({
            timeStamp: payParams.timeStamp,
            nonceStr: payParams.nonceStr,
            package: payParams.package,
            signType: payParams.signType,
            paySign: payParams.paySign,
            success: () => {
              this.setData({ 'testResults.payment': 'success' });
              this.addLog('🎉 微信支付成功！');
              wx.showToast({
                title: '支付成功',
                icon: 'success'
              });
            },
            fail: (error) => {
              if (error.errMsg.includes('cancel')) {
                this.setData({ 'testResults.payment': 'error' });
                this.addLog('⚠️ 用户取消支付');
              } else {
                this.setData({ 'testResults.payment': 'error' });
                this.addLog(`❌ 支付失败: ${error.errMsg}`);
              }
            }
          });
        } else {
          this.setData({ 'testResults.payment': 'error' });
          this.addLog(`❌ 获取支付参数失败: ${res.data.message || '未知错误'}`);
        }
      },
      fail: (error) => {
        this.setData({ 'testResults.payment': 'error' });
        this.addLog(`❌ 支付请求失败: ${error.errMsg}`);
      }
    });
  },

  // 添加日志
  addLog(message) {
    const now = new Date();
    const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    
    const logs = this.data.logs;
    logs.unshift({ time, message });
    
    // 只保留最近50条日志
    if (logs.length > 50) {
      logs.splice(50);
    }
    
    this.setData({ logs });
  },

  // 清空日志
  clearLogs() {
    this.setData({ logs: [] });
  }
});