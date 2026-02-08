Page({
  data: {
    cards: [],
    loading: false
  },

  onLoad() {
    this.loadBankCards();
  },

  onShow() {
    this.loadBankCards();
  },

  // 加载银行卡列表
  loadBankCards() {
    const app = getApp();
    const userId = app.globalData.userId;

    if (!userId) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      });
      return;
    }

    this.setData({ loading: true });

    wx.request({
      url: `${app.globalData.apiBaseUrl}/api/user/bank-cards/${userId}`,
      method: 'GET',
      success: (res) => {
        if (res.statusCode === 200 && res.data.success) {
          const cards = res.data.cards || [];
          this.setData({
            cards: cards.map(card => ({
              ...card,
              cardNoMasked: this.maskCardNo(card.cardNo)
            })),
            loading: false
          });
        } else {
          console.error('获取银行卡列表失败:', res.data);
          this.setData({ loading: false });
        }
      },
      fail: (err) => {
        console.error('请求银行卡列表失败:', err);
        this.setData({ loading: false });
        wx.showToast({
          title: '加载失败，请重试',
          icon: 'none'
        });
      }
    });
  },

  // 遮罩卡号
  maskCardNo(cardNo) {
    if (!cardNo || cardNo.length < 8) return cardNo;
    const first4 = cardNo.substring(0, 4);
    const last4 = cardNo.substring(cardNo.length - 4);
    return `${first4} **** **** ${last4}`;
  },

  // 添加银行卡
  addBankCard() {
    wx.navigateTo({
      url: '/pages/add-bank-card/add-bank-card'
    });
  },

  // 设置默认卡
  setDefaultCard(e) {
    const cardId = e.currentTarget.dataset.id;
    const app = getApp();
    const userId = app.globalData.userId;

    wx.showLoading({ title: '设置中...' });

    wx.request({
      url: `${app.globalData.apiBaseUrl}/api/user/bank-cards/set-default`,
      method: 'POST',
      data: {
        userId: userId,
        cardId: cardId
      },
      success: (res) => {
        wx.hideLoading();
        if (res.statusCode === 200 && res.data.success) {
          wx.showToast({
            title: '设置成功',
            icon: 'success'
          });
          this.loadBankCards();
        } else {
          wx.showToast({
            title: res.data.message || '设置失败',
            icon: 'none'
          });
        }
      },
      fail: (err) => {
        wx.hideLoading();
        wx.showToast({
          title: '设置失败，请重试',
          icon: 'none'
        });
      }
    });
  },

  // 删除银行卡
  deleteCard(e) {
    const cardId = e.currentTarget.dataset.id;
    const app = getApp();
    const userId = app.globalData.userId;

    wx.showModal({
      title: '确认删除',
      content: '确定要删除这张银行卡吗？',
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({ title: '删除中...' });

          wx.request({
            url: `${app.globalData.apiBaseUrl}/api/user/bank-cards/${cardId}?userId=${userId}`,
            method: 'DELETE',
            success: (res) => {
              wx.hideLoading();
              if (res.statusCode === 200 && res.data.success) {
                wx.showToast({
                  title: '删除成功',
                  icon: 'success'
                });
                this.loadBankCards();
              } else {
                wx.showToast({
                  title: res.data.message || '删除失败',
                  icon: 'none'
                });
              }
            },
            fail: (err) => {
              wx.hideLoading();
              wx.showToast({
                title: '删除失败，请重试',
                icon: 'none'
              });
            }
          });
        }
      }
    });
  },

  // 查看卡详情
  viewCardDetail(e) {
    const cardId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/bank-card-detail/bank-card-detail?id=${cardId}`
    });
  }
});
