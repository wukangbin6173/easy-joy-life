// 用户信息完善页面 - 使用微信新版组件
const app = getApp();

Page({
  data: {
    avatarUrl: '/images/default-avatar.png',
    nickname: '',
    loading: false,
    hasUserInfo: false
  },

  onLoad() {
    // 检查是否已有用户信息
    const userInfo = app.getUserInfo();
    if (userInfo && userInfo.nickname && userInfo.nickname !== '微信用户') {
      this.setData({
        avatarUrl: userInfo.avatar || '/images/default-avatar.png',
        nickname: userInfo.nickname,
        hasUserInfo: true
      });
    }
  },

  // 选择头像 - 使用新版组件
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail;
    console.log('选择头像:', avatarUrl);
    
    this.setData({
      avatarUrl: avatarUrl
    });
  },

  // 输入昵称 - 使用新版组件
  onNicknameInput(e) {
    const nickname = e.detail.value;
    console.log('输入昵称:', nickname);
    
    this.setData({
      nickname: nickname
    });
  },

  // 昵称输入确认
  onNicknameConfirm(e) {
    const nickname = e.detail.value;
    console.log('确认昵称:', nickname);
    
    this.setData({
      nickname: nickname
    });
  },

  // 保存用户信息
  saveUserInfo() {
    if (!this.data.nickname.trim()) {
      wx.showToast({
        title: '请输入昵称',
        icon: 'none'
      });
      return;
    }

    this.setData({ loading: true });

    const app = getApp();
    const userInfo = {
      ...app.globalData.userInfo,
      nickname: this.data.nickname.trim(),
      avatar: this.data.avatarUrl,
      isLogin: true
    };

    // 更新app中的用户信息
    app.globalData.userInfo = userInfo;
    wx.setStorageSync('userInfo', userInfo);

    // 更新后端用户信息
    if (app.globalData.openid) {
      app.updateUserInfoToBackend(userInfo);
    }

    wx.showToast({
      title: '保存成功',
      icon: 'success'
    });

    setTimeout(() => {
      // 返回上一页或跳转到首页
      const pages = getCurrentPages();
      if (pages.length > 1) {
        wx.navigateBack();
      } else {
        wx.switchTab({
          url: '/pages/index/index'
        });
      }
    }, 1500);

    this.setData({ loading: false });
  },

  // 跳过设置
  skipSetting() {
    wx.showModal({
      title: '跳过设置',
      content: '跳过后可以在个人中心重新设置',
      confirmText: '确定跳过',
      success: (res) => {
        if (res.confirm) {
          const pages = getCurrentPages();
          if (pages.length > 1) {
            wx.navigateBack();
          } else {
            wx.switchTab({
              url: '/pages/index/index'
            });
          }
        }
      }
    });
  }
});