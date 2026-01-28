// app.js
const config = require('./utils/config.js');
const api = require('./utils/api.js');

App({
  globalData: {
    userInfo: null,
    baseUrl: '',
    token: null,
    openid: null,
    sessionKey: null
  },

  onLaunch() {
    console.log('小程序启动');
    
    // 获取环境配置
    const envConfig = config.getCurrentConfig();
    this.globalData.baseUrl = envConfig.baseUrl;
    
    console.log('API地址:', this.globalData.baseUrl);
    console.log('所有数据来源: MySQL数据库');
    
    // 自动静默登录获取openid
    this.autoSilentLogin();
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
   * 自动静默登录 - 获取openid和用户基本信息
   */
  autoSilentLogin() {
    console.log('开始自动静默登录...');
    
    // 先检查缓存中是否有openid
    const cachedOpenid = wx.getStorageSync('openid');
    const cachedUserInfo = wx.getStorageSync('userInfo');
    
    if (cachedOpenid && cachedUserInfo) {
      // 有缓存，直接使用
      this.globalData.openid = cachedOpenid;
      this.globalData.userInfo = cachedUserInfo;
      console.log('从缓存恢复登录状态:', cachedUserInfo.nickname);
      return;
    }
    
    
    // 没有缓存，执行静默登录
    wx.login({
      success: (loginRes) => {
        if (loginRes.code) {
          console.log('获取微信登录code成功:', loginRes.code);
          
          // 调用后端API获取openid
          api.request('/api/auth/wechat/login', {
            method: 'POST',
            data: { code: loginRes.code }
          }).then(res => {
            if (res.success) {
              const { openid, sessionKey, user } = res;
              
              // 保存openid和基本用户信息
              this.globalData.openid = openid;
              this.globalData.sessionKey = sessionKey;
              this.globalData.userInfo = user || {
                nickname: '微信用户',
                avatar: '/images/default-avatar.png',
                isLogin: true
              };
              
              console.log('--------获取到微信的OpenId=:', openid);
              // 缓存到本地
              wx.setStorageSync('openid', openid);
              wx.setStorageSync('sessionKey', sessionKey);
              wx.setStorageSync('userInfo', this.globalData.userInfo);
              
              console.log('静默登录成功，openid:', openid);
              console.log('用户信息:', this.globalData.userInfo);
              
              // 尝试获取用户详细信息（如果已授权）
              this.tryGetUserProfile();
              
            } else {
              console.error('静默登录失败:', res.message);
              this.setDefaultUserInfo();
            }
          }).catch(err => {
            console.error('静默登录API调用失败:', err);
            this.setDefaultUserInfo();
          });
          
        } else {
          console.error('获取微信登录code失败:', loginRes.errMsg);
          this.setDefaultUserInfo();
        }
      },
      fail: (err) => {
        console.error('微信登录失败:', err);
        this.setDefaultUserInfo();
      }
    });
  },

  /**
   * 尝试获取用户详细信息（如果已授权）
   */
  tryGetUserProfile() {
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userInfo']) {
          // 已授权，获取用户详细信息
          wx.getUserInfo({
            success: (userRes) => {
              const detailedUserInfo = {
                ...this.globalData.userInfo,
                nickname: userRes.userInfo.nickName,
                avatar: userRes.userInfo.avatarUrl,
                gender: userRes.userInfo.gender,
                isLogin: true
              };
              
              this.globalData.userInfo = detailedUserInfo;
              wx.setStorageSync('userInfo', detailedUserInfo);
              
              // 更新后端用户信息
              this.updateUserInfoToBackend(detailedUserInfo);
              
              console.log('获取用户详细信息成功:', detailedUserInfo);
            },
            fail: (err) => {
              console.log('获取用户详细信息失败:', err);
            }
          });
        } else {
          console.log('用户未授权详细信息，使用基本信息');
        }
      }
    });
  },

  /**
   * 更新用户信息到后端
   */
  updateUserInfoToBackend(userInfo) {
    if (!this.globalData.openid) return;
    
    api.request('/api/auth/user/update', {
      method: 'POST',
      data: {
        openid: this.globalData.openid,
        nickname: userInfo.nickname,
        avatar: userInfo.avatar,
        gender: userInfo.gender || 0
      }
    }).then(res => {
      if (res.success) {
        console.log('用户信息更新到后端成功');
      }
    }).catch(err => {
      console.log('用户信息更新到后端失败:', err);
    });
  },

  /**
   * 设置默认用户信息
   */
  setDefaultUserInfo() {
    const defaultUserInfo = {
      nickname: '微信用户',
      avatar: '/images/default-avatar.png',
      gender: 0,
      isLogin: false
    };
    this.globalData.userInfo = defaultUserInfo;
    wx.setStorageSync('userInfo', defaultUserInfo);
    console.log('使用默认用户信息:', defaultUserInfo);
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
   * 检查是否已登录（有openid就算登录）
   */
  isLoggedIn() {
    return !!this.globalData.openid;
  }
});