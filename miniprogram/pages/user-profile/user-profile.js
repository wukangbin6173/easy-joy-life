const app = getApp();
const { smsApi, request, uploadApi, userApi } = require('../../utils/api.js');
const userProfile = require('../../utils/user-profile.js');
const { ensureUserIdentity } = require('../../utils/user-session.js');

Page({
  data: {
    avatarUrl: '',
    avatarText: '雀',
    avatarLoadFailed: false,
    savingAvatar: false,
    nickname: '微信用户',
    boundPhone: '',
    maskedPhone: '未绑定手机号',
    isPhoneBound: false,
    phone: '',
    phoneFromWechat: false,
    smsCode: '',
    countdown: 0,
    loading: false,
    showPhoneEditor: false
  },

  onLoad() {
    this.applyUserInfo(app.getUserInfo() || wx.getStorageSync('userInfo') || {});
    this.loadUserInfo();
  },

  onShow() {
    this.applyUserInfo(app.getUserInfo() || wx.getStorageSync('userInfo') || {});
  },

  onUnload() {
    if (this._timer) clearInterval(this._timer);
  },

  loadUserInfo() {
    const openid = app.globalData.openid || wx.getStorageSync('openid');
    if (!openid) return;

    request('/api/auth/user/info', {
      method: 'GET',
      data: { openid }
    }).then(res => {
      const user = res.user || res.data || {};
      this.applyUserInfo({
        ...(app.globalData.userInfo || {}),
        ...user,
        isLogin: true
      });
    }).catch(() => {});
  },

  applyUserInfo(userInfo = {}) {
    const cached = app.globalData.userInfo || wx.getStorageSync('userInfo') || {};
    const phone = userInfo.phone || userInfo.phoneNumber || '';
    const nickname = userProfile.resolveNickname(cached, userInfo);
    const avatar = userProfile.resolveAvatar(
      userInfo,
      cached,
      userProfile.avatarOptions({ allowLocal: true })
    );
    const normalizedUser = {
      ...cached,
      ...userInfo,
      phone,
      nickname,
      avatar,
      avatarUrl: avatar,
      avatarUpdatedAt: userInfo.avatarUpdatedAt || userInfo.updatedTime || cached.avatarUpdatedAt || '',
      isLogin: true
    };

    app.globalData.userInfo = normalizedUser;
    if (normalizedUser.id) app.globalData.userId = normalizedUser.id;
    wx.setStorageSync('userInfo', normalizedUser);
    if (normalizedUser.id) wx.setStorageSync('userId', normalizedUser.id);

    this.setData({
      avatarUrl: userProfile.withCacheBuster(avatar, normalizedUser.avatarUpdatedAt),
      avatarText: userProfile.getAvatarText(nickname),
      avatarLoadFailed: false,
      nickname,
      boundPhone: phone,
      maskedPhone: this.maskPhone(phone),
      isPhoneBound: !!phone
    });
  },

  onAvatarError(e) {
    console.warn('账号页头像加载失败:', e && e.detail, this.data.avatarUrl);
    this.setData({ avatarLoadFailed: true });
  },

  onChooseAvatar(e) {
    const tempAvatar = e.detail && e.detail.avatarUrl;
    if (!tempAvatar) {
      wx.showToast({ title: '未选择头像', icon: 'none' });
      return;
    }

    this.applyUserInfo({
      ...(app.globalData.userInfo || {}),
      avatar: tempAvatar,
      avatarUrl: tempAvatar
    });
    this.uploadAndSaveAvatar(tempAvatar);
  },

  uploadAndSaveAvatar(tempAvatar) {
    let uploadedAvatar = '';
    this.setData({ savingAvatar: true });
    ensureUserIdentity().then(identity => {
      const openid = identity.openid || app.globalData.openid || wx.getStorageSync('openid');
      if (!openid) throw new Error('请先登录');
      return uploadApi.uploadImage(tempAvatar).then(res => ({ res, openid }));
    }).then(({ res, openid }) => {
      uploadedAvatar = userProfile.normalizeAvatarUrl(res.url || (res.data && (res.data.url || res.data.avatar)));
      if (!uploadedAvatar) throw new Error('上传头像失败');
      const data = { openid, avatar: uploadedAvatar };
      if (!userProfile.isDefaultNickname(this.data.nickname)) data.nickname = this.data.nickname;
      return userApi.updateUserProfile(data);
    }).then(res => {
      const user = res.user || res.data || {};
      const savedAvatar = userProfile.resolveAvatar(user, { avatar: uploadedAvatar, avatarUrl: uploadedAvatar });
      const avatarUpdatedAt = Date.now();
      this.applyUserInfo({
        ...(app.globalData.userInfo || {}),
        ...user,
        avatar: savedAvatar,
        avatarUrl: savedAvatar,
        avatarUpdatedAt
      });
      wx.showToast({ title: '头像已更新', icon: 'success' });
    }).catch(err => {
      console.error('头像保存失败:', err);
      wx.showToast({ title: err.message || '头像保存失败', icon: 'none' });
    }).finally(() => {
      this.setData({ savingAvatar: false });
    });
  },

  maskPhone(phone) {
    if (!phone || phone === '未绑定手机号' || phone === '点击完善信息') return '未绑定手机号';
    const text = `${phone}`;
    if (text.length < 7) return text;
    return `${text.slice(0, 3)}****${text.slice(-4)}`;
  },

  startChangePhone() {
    this.setData({
      showPhoneEditor: true,
      phone: '',
      phoneFromWechat: false,
      smsCode: ''
    });
  },

  closePhoneEditor() {
    this.setData({ showPhoneEditor: false });
  },

  showBindHelp() {
    wx.showModal({
      title: '绑定说明',
      content: '手机号用于预约、到店核验、接收订单通知，并与商起点会员身份绑定。更换手机号后需重新通过短信验证码验证。',
      confirmText: '知道了',
      showCancel: false
    });
  },

  onGetPhoneNumber(e) {
    if (e.detail.errMsg !== 'getPhoneNumber:ok') {
      wx.showToast({ title: '授权已取消', icon: 'none' });
      return;
    }

    const code = e.detail.code;
    if (!code) {
      wx.showToast({ title: '获取手机号失败', icon: 'none' });
      return;
    }

    wx.showLoading({ title: '获取中...' });
    request('/api/auth/wechat/phone', {
      method: 'POST',
      data: { code }
    }).then(res => {
      wx.hideLoading();
      const phone = res.phone || res.phoneNumber || (res.data && (res.data.phone || res.data.phoneNumber));
      if (res.success && phone) {
        this.setData({ phone, phoneFromWechat: true });
        wx.showToast({ title: '请获取验证码', icon: 'none' });
      } else {
        wx.showToast({ title: res.message || '获取手机号失败', icon: 'none' });
      }
    }).catch(err => {
      wx.hideLoading();
      wx.showToast({ title: err.message || '获取手机号失败', icon: 'none' });
    });
  },

  onPhoneInput(e) {
    this.setData({ phone: e.detail.value });
  },

  onCodeInput(e) {
    this.setData({ smsCode: e.detail.value });
  },

  sendSmsCode() {
    const phone = this.data.phone.trim();
    if (!/^1\d{10}$/.test(phone)) {
      wx.showToast({ title: '请输入正确的手机号', icon: 'none' });
      return;
    }

    smsApi.sendCode(phone, 'LOGIN').then(() => {
      wx.showToast({ title: '验证码已发送', icon: 'success' });
      this.startCountdown();
    }).catch(err => {
      wx.showToast({ title: err.message || '发送失败', icon: 'none' });
    });
  },

  startCountdown() {
    if (this._timer) clearInterval(this._timer);
    this.setData({ countdown: 60 });
    this._timer = setInterval(() => {
      if (this.data.countdown <= 1) {
        clearInterval(this._timer);
        this.setData({ countdown: 0 });
      } else {
        this.setData({ countdown: this.data.countdown - 1 });
      }
    }, 1000);
  },

  saveUserInfo() {
    const phone = this.data.phone.trim();
    const code = this.data.smsCode.trim();

    if (!/^1\d{10}$/.test(phone)) {
      wx.showToast({ title: '请输入正确的手机号', icon: 'none' });
      return;
    }

    if (!code) {
      wx.showToast({ title: '请输入验证码', icon: 'none' });
      return;
    }

    const userId = app.globalData.userId || wx.getStorageSync('userId');
    if (!userId) {
      wx.showToast({ title: '请先登录', icon: 'none' });
      return;
    }

    this.setData({ loading: true });
    const wasPhoneBound = this.data.isPhoneBound;
    request('/api/auth/phone/bind', {
      method: 'POST',
      data: { userId, phone, code }
    }).then(res => {
      const user = res.user || res.data || {};
      this.applyUserInfo({
        ...(app.globalData.userInfo || {}),
        ...user,
        phone
      });
      this.setData({
        showPhoneEditor: false,
        phone: '',
        smsCode: '',
        phoneFromWechat: false
      });
      wx.showToast({ title: wasPhoneBound ? '更换成功' : '绑定成功', icon: 'success' });
    }).catch(err => {
      wx.showToast({ title: err.message || '绑定失败', icon: 'none' });
    }).finally(() => {
      this.setData({ loading: false });
    });
  }
});
