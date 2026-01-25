// app.js
const config = require('./utils/config.js');
const api = require('./utils/api.js');

App({
  globalData: {
    userInfo: null,
    baseUrl: '',
    token: null,
    mockMode: false,
    openid: null,
    sessionKey: null
  },

  onLaunch() {
    console.log('小程序启动');
    
    // 获取环境配置
    const envConfig = config.getCurrentConfig();
    this.globalData.baseUrl = envConfig.baseUrl;
    this.globalData.mockMode = envConfig.mockMode;
    
    console.log('API地址:', this.globalData.baseUrl);
    console.log('模拟模式:', this.globalData.mockMode);
    
    // 检查登录状态
    this.checkLogin();
  },

  onShow() {
    console.log('小程序显示');
  },

  onHide() {
    console.log('小程序隐藏');
  },

  onError(msg) {
    console.error('小程序错误:', msg);
  },

  /**
   * 检查登录状态
   */
  checkLogin() {
    const openid = wx.getStorageSync('openid');
    const userInfo = wx.getStorageSync('userInfo');
    
    if (openid && userInfo) {
      this.globalData.openid = openid;
      this.globalData.userInfo = userInfo;
      console.log('用户已登录:', userInfo.nickname);
    } else {
      console.log('用户未登录');
    }
  },

  /**
   * 微信登录
   */
  wechatLogin() {
    return new Promise((resolve, reject) => {
      // 1. 获取微信登录code
      wx.login({
        success: (loginRes) => {
          if (loginRes.code) {
            console.log('获取微信登录code成功:', loginRes.code);
            
            // 2. 获取用户信息授权
            wx.getUserProfile({
              desc: '用于完善用户资料',
              success: (profileRes) => {
                console.log('获取用户信息成功:', profileRes.userInfo);
                
                // 3. 调用后端登录接口
                this.loginWithCode(loginRes.code, profileRes.userInfo)
                  .then(resolve)
                  .catch(reject);
              },
              fail: (err) => {
                console.error('获取用户信息失败:', err);
                reject(new Error('需要授权用户信息'));
              }
            });
          } else {
            console.error('获取微信登录code失败:', loginRes.errMsg);
            reject(new Error('微信登录失败'));
          }
        },
        fail: (err) => {
          console.error('微信登录失败:', err);
          reject(new Error('微信登录失败'));
        }
      });
    });
  },

  /**
   * 使用code和用户信息登录
   */
  loginWithCode(code, userInfo) {
    return new Promise((resolve, reject) => {
      api.request('/auth/wechat/login', {
        method: 'POST',
        data: { code }
      }).then(res => {
        if (res.success) {
          const { openid, sessionKey, user } = res;
          
          // 更新用户信息（包括头像和昵称）
          return api.request('/auth/user/update', {
            method: 'POST',
            data: {
              openid: openid,
              nickname: userInfo.nickName,
              avatar: userInfo.avatarUrl,
              gender: userInfo.gender
            }
          }).then(updateRes => {
            if (updateRes.success) {
              const finalUserInfo = updateRes.user;
              
              // 保存登录信息
              this.globalData.openid = openid;
              this.globalData.sessionKey = sessionKey;
              this.globalData.userInfo = finalUserInfo;
              
              wx.setStorageSync('openid', openid);
              wx.setStorageSync('sessionKey', sessionKey);
              wx.setStorageSync('userInfo', finalUserInfo);
              
              console.log('登录成功，用户信息已更新:', finalUserInfo);
              resolve(finalUserInfo);
            } else {
              // 即使更新失败，也使用基本用户信息
              this.globalData.openid = openid;
              this.globalData.sessionKey = sessionKey;
              this.globalData.userInfo = user;
              
              wx.setStorageSync('openid', openid);
              wx.setStorageSync('sessionKey', sessionKey);
              wx.setStorageSync('userInfo', user);
              
              console.log('登录成功，使用基本用户信息:', user);
              resolve(user);
            }
          });
        } else {
          reject(new Error(res.message || '登录失败'));
        }
      }).catch(err => {
        console.error('登录请求失败:', err);
        reject(err);
      });
    });
  },

  /**
   * 退出登录
   */
  logout() {
    this.globalData.openid = null;
    this.globalData.sessionKey = null;
    this.globalData.userInfo = null;
    
    wx.removeStorageSync('openid');
    wx.removeStorageSync('sessionKey');
    wx.removeStorageSync('userInfo');
    
    console.log('用户已退出登录');
  },

  /**
   * 获取用户信息
   */
  getUserInfo() {
    return this.globalData.userInfo;
  },

  /**
   * 检查是否已登录
   */
  isLoggedIn() {
    return !!this.globalData.openid && !!this.globalData.userInfo;
  }
});