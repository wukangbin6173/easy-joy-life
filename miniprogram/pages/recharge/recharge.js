// pages/recharge/recharge.js
const app = getApp();
const { userApi } = require('../../utils/api.js');

Page({
  data: {
    currentBalance: 0,
    userPoints: 0,
    amountOptions: [10, 20, 50, 100, 200, 500],
    selectedAmount: 0,
    customAmount: '',
    finalAmount: 0,
    paymentMethods: [
      {
        id: 'wechat',
        name: '微信支付',
        desc: '推荐使用',
        icon: '/images/wechat-pay-icon.png'
      },
      {
        id: 'alipay',
        name: '支付宝',
        desc: '安全便捷',
        icon: '/images/alipay-icon.png'
      }
    ],
    selectedPayment: 'wechat',
    promotion: null
  },

  onLoad() {
    this.loadCurrentBalance();
    this.checkPromotion();
  },

  // 加载当前余额和积分
  loadCurrentBalance() {
    const app = getApp();
    const userId = app.globalData.userId;
    if (!userId) return;

    const { request } = require('../../utils/api.js');
    request(`/api/wallet/${userId}`).then(res => {
      if (res.success) {
        this.setData({
          currentBalance: res.wallet ? res.wallet.balance : 0,
          userPoints: res.points || 0
        });
      }
    }).catch(err => {
      console.error('加载钱包数据失败:', err);
      this.setData({ currentBalance: 0, userPoints: 0 });
    });
  },

  // 检查优惠活动
  checkPromotion() {
    // 模拟优惠活动
    const promotions = [
      '首次充值满100元送20元',
      '充值满500元享9.5折优惠',
      null // 无优惠
    ];
    
    const randomPromotion = promotions[Math.floor(Math.random() * promotions.length)];
    this.setData({
      promotion: randomPromotion
    });
  },

  // 选择预设金额
  selectAmount(e) {
    const amount = e.currentTarget.dataset.amount;
    this.setData({
      selectedAmount: amount,
      customAmount: '',
      finalAmount: amount
    });
  },

  // 自定义金额输入
  onCustomAmountInput(e) {
    const value = e.detail.value;
    this.setData({
      customAmount: value,
      selectedAmount: 0
    });
  },

  // 自定义金额输入完成
  onCustomAmountBlur(e) {
    const value = parseFloat(e.detail.value) || 0;
    this.setData({
      finalAmount: value
    });
  },

  // 选择支付方式
  selectPayment(e) {
    const paymentId = e.currentTarget.dataset.id;
    this.setData({
      selectedPayment: paymentId
    });
  },

  // 确认充值
  confirmRecharge() {
    const { finalAmount, selectedPayment } = this.data;
    
    if (finalAmount <= 0) {
      wx.showToast({
        title: '请输入充值金额',
        icon: 'none'
      });
      return;
    }

    if (finalAmount < 0.1) {
      wx.showToast({
        title: '充值金额不能少于0.1元',
        icon: 'none'
      });
      return;
    }

    if (finalAmount > 10000) {
      wx.showToast({
        title: '单次充值不能超过10000元',
        icon: 'none'
      });
      return;
    }

    // 显示确认对话框
    wx.showModal({
      title: '确认充值',
      content: `确定要充值 ¥${finalAmount} 吗？`,
      success: (res) => {
        if (res.confirm) {
          this.processRecharge();
        }
      }
    });
  },

  // 处理充值
  processRecharge() {
    const { finalAmount, selectedPayment } = this.data;
    
    wx.showLoading({
      title: '正在创建订单...'
    });

    // 创建充值订单
    this.createRechargeOrder(finalAmount, selectedPayment)
      .then(orderResult => {
        if (orderResult.success) {
          // 根据支付方式处理
          if (selectedPayment === 'alipay') {
            return this.processAlipayPayment(orderResult.orderNo);
          } else if (selectedPayment === 'wechat') {
            return this.processWechatPayment(orderResult.orderNo);
          }
        } else {
          throw new Error(orderResult.message || '创建订单失败');
        }
      })
      .then(payResult => {
        wx.hideLoading();
        if (payResult.success) {
          wx.showToast({
            title: '支付成功',
            icon: 'success'
          });
          
          // 更新余额
          this.loadCurrentBalance();
          
          // 延迟返回上一页
          setTimeout(() => {
            wx.navigateBack();
          }, 1500);
        } else {
          throw new Error(payResult.message || '支付失败');
        }
      })
      .catch(error => {
        wx.hideLoading();
        wx.showModal({
          title: '充值失败',
          content: error.message || '网络异常，请稍后重试',
          showCancel: false,
          confirmText: '知道了'
        });
      });
  },

  // 创建充值订单
  createRechargeOrder(amount, paymentMethod) {
    const { request } = require('../../utils/api.js');
    const app = getApp();
    
    return request('/api/wallet/recharge', {
      method: 'POST',
      data: {
        userId: app.globalData.userId,
        amount: amount,
        paymentMethod: paymentMethod.toUpperCase()
      }
    });
  },

  // 处理支付宝支付
  processAlipayPayment(orderNo) {
    const app = getApp();
    const baseUrl = app.globalData.baseUrl;
    
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${baseUrl}/api/payment/alipay/pay`,
        method: 'POST',
        header: {
          'Content-Type': 'application/json'
        },
        data: {
          orderNo: orderNo
        },
        success: (res) => {
          if (res.statusCode === 200 && res.data.success) {
            // 支付宝支付需要跳转到H5页面
            const payForm = res.data.payForm;
            
            // 在小程序中打开支付宝支付页面
            wx.navigateToMiniProgram({
              appId: '', // 支付宝小程序AppID，如果有的话
              path: '',
              extraData: {
                payForm: payForm
              },
              success: () => {
                // 跳转成功，开始轮询订单状态
                this.pollOrderStatus(orderNo, resolve, reject);
              },
              fail: () => {
                // 跳转失败，使用webview方式
                this.openAlipayWebView(payForm, orderNo, resolve, reject);
              }
            });
          } else {
            reject(new Error(res.data.message || '创建支付失败'));
          }
        },
        fail: (error) => {
          reject(new Error('网络请求失败: ' + error.errMsg));
        }
      });
    });
  },

  // 使用webview打开支付宝支付
  openAlipayWebView(payForm, orderNo, resolve, reject) {
    // 创建临时HTML文件用于支付
    const payUrl = `data:text/html;charset=utf-8,${encodeURIComponent(payForm)}`;
    
    wx.navigateTo({
      url: `/pages/payment-webview/payment-webview?url=${encodeURIComponent(payUrl)}&orderNo=${orderNo}`,
      success: () => {
        // 开始轮询订单状态
        this.pollOrderStatus(orderNo, resolve, reject);
      },
      fail: () => {
        reject(new Error('无法打开支付页面'));
      }
    });
  },

  // 轮询订单状态
  pollOrderStatus(orderNo, resolve, reject) {
    const app = getApp();
    const baseUrl = app.globalData.baseUrl;
    let pollCount = 0;
    const maxPollCount = 60; // 最多轮询60次（5分钟）
    
    const poll = () => {
      if (pollCount >= maxPollCount) {
        reject(new Error('支付超时，请稍后查看订单状态'));
        return;
      }
      
      wx.request({
        url: `${baseUrl}/api/payment/order/${orderNo}`,
        method: 'GET',
        success: (res) => {
          if (res.statusCode === 200 && res.data.success) {
            const order = res.data.order;
            if (order.status === 'PAID') {
              resolve({ success: true, message: '支付成功' });
            } else if (order.status === 'CANCELLED' || order.status === 'REFUNDED') {
              reject(new Error('订单已取消'));
            } else {
              // 继续轮询
              pollCount++;
              setTimeout(poll, 5000); // 5秒后再次查询
            }
          } else {
            pollCount++;
            setTimeout(poll, 5000);
          }
        },
        fail: () => {
          pollCount++;
          setTimeout(poll, 5000);
        }
      });
    };
    
    // 开始轮询
    setTimeout(poll, 2000); // 2秒后开始第一次查询
  },

  // 处理微信支付
  processWechatPayment(orderNo) {
    const { request } = require('../../utils/api.js');
    
    return new Promise((resolve, reject) => {
      // 先获取用户openid
      this.getUserOpenid()
        .then(openid => {
          // 创建微信支付订单
          return request('/api/payment/wechat/pay', {
            method: 'POST',
            data: {
              orderNo: orderNo,
              openid: openid
            }
          });
        })
        .then(res => {
          if (res.success) {
            const payParams = res.payParams;
            
            // 调用微信支付
            return wx.requestPayment({
              timeStamp: payParams.timeStamp,
              nonceStr: payParams.nonceStr,
              package: payParams.package,
              signType: payParams.signType,
              paySign: payParams.paySign
            });
          } else {
            throw new Error(res.message || '创建支付失败');
          }
        })
        .then(() => {
          // 支付成功
          resolve({ success: true, message: '支付成功' });
        })
        .catch(error => {
          console.error('微信支付处理失败:', error);
          if (error.errMsg && error.errMsg.includes('cancel')) {
            reject(new Error('用户取消支付'));
          } else {
            reject(new Error(error.message || '支付失败'));
          }
        });
    });
  },

  // 获取用户openid
  getUserOpenid() {
    return new Promise((resolve, reject) => {
      // 检查是否已有openid
      const app = getApp();
      if (app.globalData.openid) {
        resolve(app.globalData.openid);
        return;
      }

      // 微信登录获取code
      wx.login({
        success: (loginRes) => {
          if (loginRes.code) {
            // 使用统一的API模块发送code到后端获取openid
            const { request } = require('../../utils/api.js');
            
            request('/api/auth/wechat/login', {
              method: 'POST',
              data: {
                code: loginRes.code
              }
            }).then(res => {
              if (res.success && res.openid) {
                const openid = res.openid;
                app.globalData.openid = openid;
                resolve(openid);
              } else {
                reject(new Error('获取openid失败'));
              }
            }).catch(error => {
              console.error('获取openid失败:', error);
              reject(new Error(error.message || '网络请求失败'));
            });
          } else {
            reject(new Error('微信登录失败'));
          }
        },
        fail: () => {
          reject(new Error('微信登录失败'));
        }
      });
    });
  }
});