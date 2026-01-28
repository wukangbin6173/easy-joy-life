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
            console.log('微信登录API响应:', res);
            
            // 检查是否成功获取到openid
            if (res.success && res.openid) {
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
              // 登录失败，但不是网络错误
              console.log('微信登录失败:', res.message || res.errmsg);
              console.log('错误码:', res.errcode);
              
              if (res.errcode === '40029') {
                console.log('这是正常的，code已过期或无效');
              }
              
              // 设置默认用户信息，让应用继续运行
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
    console.log('🔍 检查用户授权状态...');
    
    wx.getSetting({
      success: (res) => {
        console.log('📋 授权设置:', res.authSetting);
        
        if (res.authSetting['scope.userInfo']) {
          console.log('✅ 用户已授权 scope.userInfo，获取详细信息');
          // 已授权，获取用户详细信息
          wx.getUserInfo({
            success: (userRes) => {
              console.log('📥 获取到用户详细信息:', userRes.userInfo);
              
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
              
              console.log('✅ 获取用户详细信息成功:', detailedUserInfo);
            },
            fail: (err) => {
              console.log('❌ 获取用户详细信息失败:', err);
            }
          });
        } else {
          console.log('⚠️ 用户未授权详细信息，使用基本信息');
          console.log('💡 提示：用户可以在个人中心页面授权获取详细信息');
          
          // 检查用户是否已经通过新版组件设置过信息
          const cachedUserInfo = wx.getStorageSync('userInfo');
          if (cachedUserInfo && cachedUserInfo.nickname && cachedUserInfo.nickname !== '微信用户') {
            console.log('✅ 发现用户已通过新版组件设置过信息:', cachedUserInfo);
            this.globalData.userInfo = cachedUserInfo;
          } else {
            console.log('💡 用户尚未设置详细信息，建议引导用户完善');
            // 设置一个标记，表示需要完善信息
            this.globalData.needCompleteProfile = true;
          }
          
          // 即使没有详细信息，也尝试更新基本信息到后端
          if (this.globalData.userInfo && this.globalData.openid) {
            console.log('📤 尝试更新基本用户信息到后端');
            this.updateUserInfoToBackend(this.globalData.userInfo);
          }
        }
      },
      fail: (err) => {
        console.log('❌ 获取授权设置失败:', err);
      }
    });
  },

  /**
   * 获取用户详细信息（需要用户主动授权）
   */
  getUserProfileWithAuth() {
    return new Promise((resolve, reject) => {
      console.log('🔐 请求用户授权获取详细信息...');
      
      wx.getUserProfile({
        desc: '用于完善用户资料',
        success: (res) => {
          console.log('✅ 用户授权成功，获取到详细信息:', res.userInfo);
          
          const detailedUserInfo = {
            ...this.globalData.userInfo,
            nickname: res.userInfo.nickName,
            avatar: res.userInfo.avatarUrl,
            gender: res.userInfo.gender,
            isLogin: true
          };
          
          // 更新全局数据
          this.globalData.userInfo = detailedUserInfo;
          wx.setStorageSync('userInfo', detailedUserInfo);
          
          // 更新后端用户信息
          this.updateUserInfoToBackend(detailedUserInfo);
          
          console.log('✅ 用户详细信息更新完成:', detailedUserInfo);
          resolve(detailedUserInfo);
        },
        fail: (err) => {
          console.log('❌ 用户拒绝授权或获取失败:', err);
          reject(err);
        }
      });
    });
  },

  /**
   * 更新用户信息到后端
   */
  updateUserInfoToBackend(userInfo) {
    if (!this.globalData.openid) {
      console.log('⚠️ 没有openid，跳过用户信息更新');
      return;
    }
    
    console.log('📤 开始更新用户信息到后端...');
    console.log('🔑 使用openid:', this.globalData.openid);
    console.log('👤 用户信息:', userInfo);
    
    api.request('/api/auth/user/update', {
      method: 'POST',
      data: {
        openid: this.globalData.openid,
        nickname: userInfo.nickname,
        avatar: userInfo.avatar,
        gender: userInfo.gender || 0
      }
    }).then(res => {
      console.log('📥 后端响应:', res);
      if (res.success) {
        console.log('✅ 用户信息更新到后端成功');
        console.log('👤 更新后的用户信息:', res.user);
        
        // 更新本地用户信息
        this.globalData.userInfo = {
          ...this.globalData.userInfo,
          ...res.user,
          isLogin: true
        };
        wx.setStorageSync('userInfo', this.globalData.userInfo);
        
      } else {
        console.log('⚠️ 用户信息更新失败:', res.message);
        if (res.message === '用户不存在') {
          console.log('💡 用户不存在，可能需要先进行完整登录');
          // 尝试重新登录创建用户
          this.retryCreateUser();
        }
      }
    }).catch(err => {
      console.error('❌ 用户信息更新到后端失败:', err);
      console.error('📄 错误详情:', {
        message: err.message,
        openid: this.globalData.openid,
        userInfo: userInfo
      });
      
      // 显示更友好的错误信息
      if (err.message.includes('用户不存在')) {
        console.log('💡 提示：用户需要先完成微信登录');
      } else if (err.message.includes('请求失败')) {
        console.log('💡 提示：网络请求失败，请检查网络连接');
      }
    });
  },

  /**
   * 重试创建用户
   */
  retryCreateUser() {
    console.log('🔄 尝试重新创建用户...');
    
    // 重新执行登录流程
    wx.login({
      success: (loginRes) => {
        if (loginRes.code) {
          console.log('🔑 重新获取登录code:', loginRes.code);
          
          api.request('/api/auth/wechat/login', {
            method: 'POST',
            data: { code: loginRes.code }
          }).then(res => {
            console.log('📥 重新登录响应:', res);
            if (res.success && res.openid) {
              console.log('✅ 重新登录成功，用户已创建');
              this.globalData.openid = res.openid;
              wx.setStorageSync('openid', res.openid);
              
              // 重新尝试更新用户信息
              if (this.globalData.userInfo) {
                this.updateUserInfoToBackend(this.globalData.userInfo);
              }
            } else {
              console.log('❌ 重新登录失败:', res.message);
            }
          }).catch(err => {
            console.error('❌ 重新登录请求失败:', err);
          });
        }
      },
      fail: (err) => {
        console.error('❌ 重新获取登录code失败:', err);
      }
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