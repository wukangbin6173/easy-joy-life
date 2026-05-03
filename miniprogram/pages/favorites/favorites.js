const app = getApp();

Page({
  data: {
    favorites: [],
    countText: ''
  },

  onShow() {
    this.loadFavorites();
  },

  onPullDownRefresh() {
    this.loadFavorites();
    wx.stopPullDownRefresh();
  },

  loadFavorites() {
    const rawList = wx.getStorageSync('favorites') || [];
    const favorites = rawList
      .map(item => this.normalizeFavorite(item))
      .filter(item => item.id);
    wx.setStorageSync('favorites', favorites);
    this.setData({
      favorites,
      countText: favorites.length ? `共 ${favorites.length} 家收藏门店` : ''
    });
  },

  normalizeFavorite(item = {}) {
    const images = Array.isArray(item.images) && item.images.length
      ? item.images
      : [item.coverImage || item.coverUrl || item.logoUrl || '/images/banner.png'];
    return {
      ...item,
      id: String(item.id || item.storeId || ''),
      merchantId: item.merchantId || item.merchantID || '',
      name: item.name || item.storeName || item.displayName || '门店信息待同步',
      address: item.address || item.storeAddress || '门店地址待同步',
      phone: item.phone || item.contactPhone || '',
      images,
      coverImage: images[0] || '/images/banner.png'
    };
  },

  goToStore(e) {
    const { id, merchantid } = e.currentTarget.dataset;
    if (!id) {
      wx.showToast({ title: '门店信息缺失', icon: 'none' });
      return;
    }
    if (merchantid && app.setActiveMerchantId) app.setActiveMerchantId(merchantid);
    wx.navigateTo({ url: `/pages/store-detail/store-detail?id=${id}&merchantId=${merchantid || ''}` });
  },

  removeFavorite(e) {
    const id = String(e.currentTarget.dataset.id || '');
    wx.showModal({
      title: '取消收藏',
      content: '确定取消收藏该门店吗？',
      confirmText: '取消收藏',
      cancelText: '再看看',
      success: (res) => {
        if (!res.confirm) return;
        const favorites = (wx.getStorageSync('favorites') || [])
          .filter(item => String(item.id || item.storeId || '') !== id)
          .map(item => this.normalizeFavorite(item));
        wx.setStorageSync('favorites', favorites);
        this.setData({
          favorites,
          countText: favorites.length ? `共 ${favorites.length} 家收藏门店` : ''
        });
        wx.showToast({ title: '已取消收藏', icon: 'success' });
      }
    });
  },

  goBrowseStores() {
    wx.navigateTo({ url: '/pages/nearby-stores/nearby-stores' });
  }
});
