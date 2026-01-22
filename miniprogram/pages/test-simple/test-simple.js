Page({
  data: {
    message: '测试页面'
  },

  onLoad() {
    console.log('测试页面加载成功');
  },

  testClick() {
    wx.showToast({
      title: '点击成功！',
      icon: 'success'
    });
    console.log('按钮点击测试成功');
  }
});