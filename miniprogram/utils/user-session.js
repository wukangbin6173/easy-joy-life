const { request } = require('./api.js');

function normalizeUser(raw = {}) {
  const user = raw.user || raw.data || raw || {};
  return {
    ...user,
    id: user.id || user.userId,
    phone: user.phone || user.phoneNumber || ''
  };
}

function cacheUser(app, user, openid) {
  const normalized = normalizeUser(user);
  if (!normalized.id) return null;

  app.globalData.openid = app.globalData.openid || openid || normalized.openid || wx.getStorageSync('openid');
  app.globalData.userId = normalized.id;
  app.globalData.userInfo = {
    ...(app.globalData.userInfo || wx.getStorageSync('userInfo') || {}),
    ...normalized,
    isLogin: true
  };

  wx.setStorageSync('userId', normalized.id);
  wx.setStorageSync('userInfo', app.globalData.userInfo);
  if (app.globalData.openid) wx.setStorageSync('openid', app.globalData.openid);

  return {
    openid: app.globalData.openid,
    userId: normalized.id,
    userInfo: app.globalData.userInfo
  };
}

function ensureUserIdentity(options = {}) {
  const app = getApp();
  const cachedOpenid = app.globalData.openid || wx.getStorageSync('openid');
  const cachedUserId = app.globalData.userId || wx.getStorageSync('userId');
  const cachedUserInfo = app.globalData.userInfo || wx.getStorageSync('userInfo') || {};
  const shouldRefresh = !!options.refresh && !!cachedOpenid;

  if (!cachedOpenid) {
    return loginWithWechatCode(app);
  }

  if (cachedUserId && !shouldRefresh) {
    app.globalData.openid = cachedOpenid || app.globalData.openid;
    app.globalData.userId = cachedUserId;
    app.globalData.userInfo = {
      ...cachedUserInfo,
      id: cachedUserInfo.id || cachedUserId,
      isLogin: true
    };
    return Promise.resolve({
      openid: app.globalData.openid,
      userId: cachedUserId,
      userInfo: app.globalData.userInfo
    });
  }

  return request('/api/auth/user/info', {
    method: 'GET',
    data: { openid: cachedOpenid }
  }).then(res => {
    const identity = cacheUser(app, res.user || res.data || res, cachedOpenid);
    if (!identity || !identity.userId) throw new Error('用户信息未同步，请重新进入小程序');
    return identity;
  }).catch(err => {
    const message = (err && (err.message || (err.data && err.data.message))) || '';
    if (String(message).includes('用户映射不存在') || String(message).includes('App用户映射不存在')) {
      wx.removeStorageSync('openid');
      wx.removeStorageSync('userId');
      wx.removeStorageSync('userInfo');
      app.globalData.openid = '';
      app.globalData.userId = '';
      app.globalData.userInfo = null;
      return loginWithWechatCode(app);
    }
    throw err;
  });
}

function loginWithWechatCode(app) {
  return new Promise((resolve, reject) => {
    wx.login({
      success: loginRes => {
        if (!loginRes.code) {
          reject(new Error('wechat login failed'));
          return;
        }

        request('/api/auth/wechat/login', {
          method: 'POST',
          data: { code: loginRes.code }
        }).then(res => {
          if (!res || !res.success || !res.openid || !res.user) {
            throw new Error((res && res.message) || 'login failed');
          }

          if (res.sessionKey) {
            app.globalData.sessionKey = res.sessionKey;
            wx.setStorageSync('sessionKey', res.sessionKey);
          }

          const identity = cacheUser(app, res.user, res.openid);
          if (!identity || !identity.userId) throw new Error('user identity not synchronized');
          resolve(identity);
        }).catch(reject);
      },
      fail: reject
    });
  });
}

module.exports = {
  ensureUserIdentity
};
