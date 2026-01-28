// 完整的用户信息获取测试脚本
// 在微信开发者工具控制台运行

console.log('========================================');
console.log('用户信息获取完整测试');
console.log('========================================');

// 测试1: 检查 app 实例
const app = getApp();
console.log('1. App 实例:', app ? '✓ 存在' : '✗ 不存在');

if (app) {
  console.log('2. GlobalData:', app.globalData ? '✓ 存在' : '✗ 不存在');
  
  if (app.globalData) {
    console.log('3. 用户信息:', app.globalData.userInfo);
    console.log('4. OpenID:', app.globalData.openid);
    console.log('5. SessionKey:', app.globalData.sessionKey ? '✓ 存在' : '✗ 不存在');
  }
}

// 测试2: 检查缓存
console.log('========================================');
console.log('缓存检查');
console.log('========================================');

const cachedUserInfo = wx.getStorageSync('userInfo');
const cachedOpenid = wx.getStorageSync('openid');
const cachedSessionKey = wx.getStorageSync('sessionKey');

console.log('6. 缓存用户信息:', cachedUserInfo);
console.log('7. 缓存 OpenID:', cachedOpenid);
console.log('8. 缓存 SessionKey:', cachedSessionKey ? '✓ 存在' : '✗ 不存在');

// 测试3: 检查授权状态
console.log('========================================');
console.log('授权状态检查');
console.log('========================================');

wx.getSetting({
  success: (res) => {
    console.log('9. 授权设置:', res.authSetting);
    console.log('10. 用户信息授权:', res.authSetting['scope.userInfo'] ? '✓ 已授权' : '✗ 未授权');
  },
  fail: (err) => {
    console.log('9. 获取授权设置失败:', err);
  }
});

// 测试4: 测试登录
console.log('========================================');
console.log('登录测试');
console.log('========================================');

wx.login({
  success: (res) => {
    console.log('11. 微信登录:', res.code ? '✓ 成功' : '✗ 失败');
    console.log('12. 登录 Code:', res.code);
    
    if (res.code) {
      // 测试后端 API
      wx.request({
        url: 'https://xx.aieo.cn/api/auth/wechat/login',
        method: 'POST',
        data: { code: res.code },
        success: (apiRes) => {
          console.log('13. 后端 API 响应:', apiRes.data);
          if (apiRes.data.success) {
            console.log('14. 后端登录: ✓ 成功');
            console.log('15. 获取到 OpenID:', apiRes.data.openid);
            console.log('16. 用户信息:', apiRes.data.user);
          } else {
            console.log('14. 后端登录: ✗ 失败');
            console.log('15. 错误信息:', apiRes.data.message);
          }
        },
        fail: (apiErr) => {
          console.log('13. 后端 API 调用失败:', apiErr);
        }
      });
    }
  },
  fail: (err) => {
    console.log('11. 微信登录失败:', err);
  }
});

// 测试5: 手动获取用户信息
console.log('========================================');
console.log('手动获取用户信息测试');
console.log('========================================');

function testGetUserProfile() {
  wx.getUserProfile({
    desc: '测试获取用户信息',
    success: (res) => {
      console.log('17. 手动获取用户信息: ✓ 成功');
      console.log('18. 用户信息:', res.userInfo);
      console.log('19. 昵称:', res.userInfo.nickName);
      console.log('20. 头像:', res.userInfo.avatarUrl);
    },
    fail: (err) => {
      console.log('17. 手动获取用户信息: ✗ 失败');
      console.log('18. 错误信息:', err.errMsg);
    }
  });
}

console.log('运行 testGetUserProfile() 来测试手动获取用户信息');

// 测试6: 检查首页用户信息显示
console.log('========================================');
console.log('首页用户信息显示测试');
console.log('========================================');

function testIndexUserInfo() {
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  
  if (currentPage.route === 'pages/index/index') {
    console.log('21. 当前在首页');
    console.log('22. 页面用户信息:', currentPage.data.userInfo);
    console.log('23. 显示用户卡片:', currentPage.data.showUserCard);
  } else {
    console.log('21. 当前不在首页，路由:', currentPage.route);
  }
}

testIndexUserInfo();

console.log('========================================');
console.log('测试完成');
console.log('========================================');