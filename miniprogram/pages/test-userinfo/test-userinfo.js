// 测试用户信息获取页面
const app = getApp();

Page({
  data: {
    appUserInfo: null,
    authSettings: null,
    testResults: []
  },

  onLoad() {
    this.runTests();
  },

  runTests() {
    const results = [];
    
    // 测试1: 检查app实例
    try {
      const appInstance = getApp();
      if (appInstance) {
        results.push('✓ App实例获取成功');
        
        // 测试2: 检查globalData
        if (appInstance.globalData) {
          results.push('✓ GlobalData存在');
          
          // 测试3: 检查用户信息
          if (appInstance.globalData.userInfo) {
            results.push('✓ 用户信息已获取: ' + appInstance.globalData.userInfo.nickname);
            this.setData({
              appUserInfo: appInstance.globalData.userInfo
            });
          } else {
            results.push('⚠ 用户信息未获取，尝试重新获取...');
            appInstance.autoGetUserInfo();
            
            // 延迟检查
            setTimeout(() => {
              if (appInstance.globalData.userInfo) {
                results.push('✓ 重新获取用户信息成功: ' + appInstance.globalData.userInfo.nickname);
                this.setData({
                  appUserInfo: appInstance.globalData.userInfo,
                  testResults: results
                });
              } else {
                results.push('✗ 重新获取用户信息失败');
                this.setData({
                  testResults: results
                });
              }
            }, 2000);
          }
        } else {
          results.push('✗ GlobalData不存在');
        }
      } else {
        results.push('✗ App实例获取失败');
      }
    } catch (e) {
      results.push('✗ 测试异常: ' + e.message);
    }

    // 测试4: 检查授权状态
    wx.getSetting({
      success: (res) => {
        results.push('✓ 获取设置成功');
        if (res.authSetting['scope.userInfo']) {
          results.push('✓ 用户信息已授权');
        } else {
          results.push('⚠ 用户信息未授权');
        }
        
        this.setData({
          authSettings: res.authSetting,
          testResults: results
        });
      },
      fail: (err) => {
        results.push('✗ 获取设置失败: ' + err.errMsg);
        this.setData({
          testResults: results
        });
      }
    });
  },

  // 手动获取用户信息
  manualGetUserInfo() {
    wx.getUserProfile({
      desc: '测试获取用户信息',
      success: (res) => {
        wx.showToast({
          title: '获取成功',
          icon: 'success'
        });
        
        const userInfo = {
          nickname: res.userInfo.nickName,
          avatar: res.userInfo.avatarUrl,
          gender: res.userInfo.gender,
          isLogin: false
        };
        
        // 更新app中的用户信息
        const app = getApp();
        app.globalData.userInfo = userInfo;
        wx.setStorageSync('basicUserInfo', userInfo);
        
        this.setData({
          appUserInfo: userInfo
        });
      },
      fail: (err) => {
        wx.showToast({
          title: '获取失败: ' + err.errMsg,
          icon: 'none'
        });
      }
    });
  },

  // 清除用户信息
  clearUserInfo() {
    const app = getApp();
    app.globalData.userInfo = null;
    wx.removeStorageSync('basicUserInfo');
    
    this.setData({
      appUserInfo: null
    });
    
    wx.showToast({
      title: '已清除',
      icon: 'success'
    });
  },

  // 重新运行测试
  rerunTests() {
    this.setData({
      testResults: [],
      appUserInfo: null,
      authSettings: null
    });
    
    setTimeout(() => {
      this.runTests();
    }, 500);
  }
});