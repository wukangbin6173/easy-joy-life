// pages/profile/profile.js
const app = getApp();
const { request, uploadApi, userApi } = require('../../utils/api.js');
const userProfile = require('../../utils/user-profile.js');
const { ensureUserIdentity } = require('../../utils/user-session.js');

Page({
  data: {
    userInfo: {
      isLogin: false,
      nickname: '',
      avatar: '',
      phone: '',
      isVip: false
    },
    stats: {
      totalOrders: 0,
      totalHours: 0,
      totalAmount: 0
    },
    wallet: {
      balance: 0
    },
    coupons: {
      available: 0
    },
    avatarText: '雀',
    displayAvatar: '',
    avatarLoadFailed: false,
    hasAvatar: false,
    savingAvatar: false,
    maskedPhone: '未绑定手机号',
    currentBooking: null,
    serviceItems: [
      { title: '账号与手机号', icon: '/images/账号与手机号.png', action: 'profile' },
      { title: '收藏门店', icon: '/images/门店.png', action: 'favorites' },
      { title: '消息通知', icon: '/images/消息通知.png', action: 'message' },
      { title: '帮助中心', icon: '/images/帮助中心.png', action: 'help' },
      { title: '关于雀玺', icon: '/images/提示-2.png', action: 'about' }
    ]
  },

  onLoad: function() {
    this.loadUserInfo();
  },

  onShow: function() {
    this.loadUserInfo();
  },

  loadUserInfo: function() {
    const app = getApp();
    const openid = app.globalData.openid;
    if (!openid) {
      this.setProfileView({ isLogin: false, nickname: '微信用户', avatar: '', phone: '', isVip: false });
      return;
    }

    request(`/api/auth/user/info?openid=${openid}`).then(res => {
      const user = res.user || {};
      const cached = app.globalData.userInfo || wx.getStorageSync('userInfo') || {};
      const avatar = userProfile.resolveAvatar(
        user,
        cached,
        userProfile.avatarOptions({ allowLocal: true })
      );
      const userInfo = {
        isLogin: true,
        nickname: userProfile.resolveNickname(cached, user),
        avatar,
        avatarUrl: avatar,
        avatarUpdatedAt: user.avatarUpdatedAt || user.updatedTime || cached.avatarUpdatedAt || '',
        phone: user.phone || '未绑定手机号',
        isVip: false
      };
      // 同步到全局和缓存
      app.globalData.userInfo = { ...app.globalData.userInfo, ...userInfo };
      wx.setStorageSync('userInfo', app.globalData.userInfo);
      this.setProfileView(userInfo);
      this.loadUserStats();
    }).catch(() => {
      // 接口失败降级用缓存，但手机号不显示
      const cached = app.globalData.userInfo || {};
      this.setProfileView({
        isLogin: true,
        nickname: userProfile.resolveNickname(cached),
        avatar: userProfile.resolveAvatar(cached, userProfile.avatarOptions({ allowLocal: true })),
        phone: '未绑定手机号',
        isVip: false
      });
      this.loadUserStats();
    });
  },

  setProfileView(userInfo) {
    const nickname = userInfo.nickname || '微信用户';
    const phone = userInfo.phone || '';
    const maskedPhone = this.maskPhone(phone);
    const rawAvatar = userProfile.resolveAvatar(
      userInfo,
      userProfile.avatarOptions({ allowLocal: true })
    );
    const displayAvatar = userProfile.withCacheBuster(rawAvatar, userInfo.avatarUpdatedAt);
    this.setData({
      userInfo: { ...userInfo, avatar: rawAvatar, avatarUrl: rawAvatar },
      avatarText: userProfile.getAvatarText(nickname),
      displayAvatar,
      avatarLoadFailed: false,
      hasAvatar: !!rawAvatar,
      maskedPhone
    });
  },

  resolveAvatar(...sources) {
    return userProfile.resolveAvatar(...sources);
  },

  normalizeAvatarUrl(value) {
    return userProfile.normalizeAvatarUrl(value);
  },

  onAvatarError(e) {
    console.warn('头像加载失败:', e && e.detail, this.data.displayAvatar);
    this.setData({ avatarLoadFailed: true, hasAvatar: false });
  },

  noop() {},

  onChooseAvatar(e) {
    const tempAvatar = e.detail && e.detail.avatarUrl;
    if (!tempAvatar) {
      wx.showToast({ title: '未选择头像', icon: 'none' });
      return;
    }

    const nextUserInfo = {
      ...(app.globalData.userInfo || {}),
      ...this.data.userInfo,
      avatar: tempAvatar,
      avatarUrl: tempAvatar
    };
    this.setProfileView(nextUserInfo);
    this.setData({
      displayAvatar: tempAvatar,
      avatarLoadFailed: false
    });
    this.saveWechatAvatar(tempAvatar, nextUserInfo);
  },

  saveWechatAvatar(tempAvatar, userInfo) {
    let uploadedAvatar = '';
    this.setData({ savingAvatar: true });
    ensureUserIdentity().then(identity => {
      const openid = identity.openid || app.globalData.openid || wx.getStorageSync('openid');
      if (!openid) throw new Error('请先登录');
      return uploadApi.uploadImage(tempAvatar).then(res => ({ res, openid }));
    }).then(({ res, openid }) => {
      uploadedAvatar = userProfile.normalizeAvatarUrl(res.url || (res.data && (res.data.url || res.data.avatar)));
      if (!uploadedAvatar) throw new Error('头像上传失败');
      const data = { openid, avatar: uploadedAvatar };
      const nickname = userProfile.resolveNickname(userInfo, this.data.userInfo);
      if (!userProfile.isDefaultNickname(nickname)) data.nickname = nickname;
      return userApi.updateUserProfile(data);
    }).then(res => {
      const user = res.user || res.data || {};
      const savedAvatar = userProfile.resolveAvatar(user, { avatar: uploadedAvatar, avatarUrl: uploadedAvatar });
      const avatarUpdatedAt = Date.now();
      const savedUser = {
        ...(app.globalData.userInfo || {}),
        ...userInfo,
        ...user,
        avatar: savedAvatar,
        avatarUrl: savedAvatar,
        avatarUpdatedAt,
        isLogin: true
      };
      app.globalData.userInfo = savedUser;
      wx.setStorageSync('userInfo', savedUser);
      this.setProfileView(savedUser);
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

  loadUserStats: function() {
    const app = getApp();
    const userId = app.globalData.userId || wx.getStorageSync('userId');
    if (!userId) {
      ensureUserIdentity().then(() => {
        this.loadUserStats();
      }).catch(err => {
        console.error('restore user identity failed:', err);
        this.setData({ currentBooking: null });
      });
      return;
    }

    const merchantId = app.getActiveMerchantId ? app.getActiveMerchantId() : (app.globalData.currentMerchantId || app.globalData.defaultMerchantId || 23);

    const lastPaidOrderId = wx.getStorageSync('lastPaidBillingOrderId');
    const pendingBooking = wx.getStorageSync('pendingBillingBooking') || {};
    const detailIds = [lastPaidOrderId, pendingBooking.orderId].filter(Boolean)
      .map(id => String(id))
      .filter((id, index, arr) => arr.indexOf(id) === index);
    const detailOrdersPromise = Promise.all(detailIds.map(id =>
      request(`/api/billing/order/${id}`).catch(err => {
        console.warn('load billing order detail failed:', id, err);
        return null;
      })
    ));

    // 从真实订单数据统计
    Promise.all([
      request(`/api/billing/order/list?externalUserId=${encodeURIComponent(userId)}&merchantId=${merchantId}&pageNo=1&pageSize=100`),
      detailOrdersPromise,
      request(`/api/rooms?merchantId=${merchantId}&pageNo=1&pageSize=100`).catch(() => null),
      request(`/api/stores?merchantId=${merchantId}&pageNo=1&pageSize=50`).catch(() => null),
      request(`/api/stores/merchants/${merchantId}`).catch(() => null)
    ]).then(([res, detailOrderResList, roomRes, storeRes, merchantRes]) => {
      const roomMap = this.buildRoomMap(roomRes);
      const storeMap = this.buildStoreMap(storeRes);
      const merchant = this.extractResponseData(merchantRes);
      let list = this.extractResponseList(res).filter(order => (
        !order.externalUserId || String(order.externalUserId) === String(userId)
      ));
      (detailOrderResList || []).forEach(detailOrderRes => {
        const detailOrder = this.extractResponseObject(detailOrderRes);
        if (detailOrder && !this.hasOrder(list, detailOrder)) list = [detailOrder, ...list];
      });
      list = this.mergeLocalPaidOrder(list);
      const normalizedList = list.map(order => ({
        ...order,
        status: this.normalizeOrderStatus(order.status || order.orderStatus || order.payStatus || order.tradeStatus)
      })).map(order => this.enrichOrderDisplay(order, roomMap, storeMap, merchant));
      const totalOrders = normalizedList.filter(o => o.status !== 60).length;
      const currentOrder = this.pickCurrentOrder(normalizedList);
      // 已结算订单的消费金额（分转元）
      const totalAmount = normalizedList
        .filter(o => o.status === 40)
        .reduce((sum, o) => sum + (o.prepaidAmount || 0), 0);
      this.setData({
        stats: {
          totalOrders,
          totalAmount: (totalAmount / 100).toFixed(0)
        },
        currentBooking: this.formatCurrentBooking(currentOrder)
      });
    }).catch(() => {
      this.setData({ stats: { totalOrders: 0, totalAmount: 0 } });
    });
  },

  buildRoomMap(roomRes) {
    const map = {};
    this.extractResponseList(roomRes).forEach(room => {
      const id = room.id || room.resourceId;
      if (!id) return;
      map[id] = {
        storeId: room.storeId || room.shopId || '',
        name: this.pickFirstText(room, ['resourceName', 'name', 'roomName', 'title']),
        image: this.pickUsableImage(room, ['resourcePhoto', 'coverImage', 'imageUrl', 'image']),
        tags: room.tags || '',
        capacity: room.capacity || room.maxCapacity || room.peopleNum || ''
      };
    });
    return map;
  },

  buildStoreMap(storeRes) {
    const map = {};
    this.extractResponseList(storeRes).forEach(store => {
      const id = store.id || store.storeId;
      if (!id) return;
      map[id] = {
        name: this.pickFirstText(store, ['storeName', 'name', 'shortName', 'title']),
        image: this.pickUsableImage(store, ['coverUrl', 'logoUrl', 'image', 'imageUrl']),
        address: this.pickFirstText(store, ['address', 'storeAddress', 'detailAddress']),
        latitude: store.latitude || store.lat,
        longitude: store.longitude || store.lng || store.lon
      };
    });
    return map;
  },

  enrichOrderDisplay(order, roomMap, storeMap, merchant) {
    const resourceId = order.resourceId || order.roomId;
    const room = roomMap[resourceId] || {};
    const storeId = order.storeId || room.storeId;
    const store = storeMap[storeId] || {};
    const merchantName = this.pickFirstText(merchant, ['shortName', 'merchantName', 'name', 'storeName']);
    return {
      ...order,
      resourceId,
      storeId,
      storeName: this.pickFirstText(order, ['storeName', 'merchantName', 'shopName', 'storeTitle']) || store.name || merchantName || '',
      roomName: this.pickFirstText(order, ['roomName', 'resourceName', 'resourceTitle', 'resourceNo']) || room.name || '',
      address: this.pickFirstText(order, ['address', 'storeAddress', 'detailAddress']) || store.address || this.pickFirstText(merchant, ['address', 'storeAddress', 'detailAddress']) || '',
      latitude: order.latitude || order.storeLatitude || store.latitude || merchant.latitude,
      longitude: order.longitude || order.storeLongitude || store.longitude || merchant.longitude,
      resourcePhoto: this.pickUsableImage(order, ['resourcePhoto', 'coverImage', 'roomImage', 'imageUrl']) || room.image || store.image || this.pickUsableImage(merchant, ['logoUrl', 'coverUrl', 'imageUrl'])
    };
  },

  pickCurrentOrder(list) {
    const candidates = list.filter(o => o.status === 10 || o.status === 20 || o.status === 30);
    if (!candidates.length) return null;
    const now = Date.now();
    return candidates.sort((a, b) => {
      const aStart = this.parseDate(a.bookingStartTime || a.startTime);
      const bStart = this.parseDate(b.bookingStartTime || b.startTime);
      const aTime = aStart ? aStart.getTime() : 0;
      const bTime = bStart ? bStart.getTime() : 0;
      const aFuture = aTime >= now;
      const bFuture = bTime >= now;
      if (aFuture !== bFuture) return aFuture ? -1 : 1;
      if (aFuture) return aTime - bTime;
      return bTime - aTime;
    })[0];
  },

  extractResponseList(source) {
    const queue = [source];
    const seen = [];
    const listKeys = ['list', 'records', 'rows', 'items', 'content', 'orders'];
    while (queue.length) {
      const current = queue.shift();
      if (Array.isArray(current)) return current;
      if (!current || typeof current !== 'object' || seen.includes(current)) continue;
      seen.push(current);

      for (const key of listKeys) {
        if (Array.isArray(current[key])) return current[key];
      }

      ['data', 'result', 'page'].forEach(key => {
        if (current[key] && current[key] !== current) queue.push(current[key]);
      });
    }
    return [];
  },

  extractResponseObject(source) {
    if (!source || typeof source !== 'object' || Array.isArray(source)) return null;
    const isOrderObject = obj => obj && typeof obj === 'object' && !Array.isArray(obj) &&
      (obj.id || obj.orderId || obj.billingOrderId || obj.billingId || obj.resourceId || obj.bookingStartTime || obj.startTime);
    if (isOrderObject(source.order)) return source.order;
    const data = source.data && typeof source.data === 'object' ? source.data : null;
    if (data && !Array.isArray(data)) {
      if (isOrderObject(data.order)) return data.order;
      if (isOrderObject(data.data)) return data.data;
      return isOrderObject(data) ? data : null;
    }
    return isOrderObject(source) ? source : null;
  },

  extractResponseData(source) {
    if (!source || typeof source !== 'object') return {};
    if (source.data && source.data.data && typeof source.data.data === 'object' && !Array.isArray(source.data.data)) return source.data.data;
    if (source.data && typeof source.data === 'object' && !Array.isArray(source.data)) return source.data;
    if (source.result && typeof source.result === 'object' && !Array.isArray(source.result)) return source.result;
    return source;
  },

  pickFirstText(source, fields) {
    if (!source) return '';
    for (const field of fields) {
      const value = source[field];
      if (value !== undefined && value !== null && String(value).trim()) return String(value).trim();
    }
    return '';
  },

  pickUsableImage(source, fields) {
    const value = this.pickFirstText(source, fields);
    if (!value || value.startsWith('file://')) return '';
    return value;
  },

  hasOrder(list, target) {
    const targetId = this.getOrderIdentity(target);
    if (!targetId) return false;
    return list.some(order => this.getOrderIdentity(order) === targetId);
  },

  getOrderIdentity(order) {
    if (!order) return '';
    const id = order.id || order.orderId || order.billingOrderId || order.billingId;
    return id === undefined || id === null ? '' : String(id);
  },

  mergeLocalPaidOrder(list) {
    const booking = wx.getStorageSync('lastPaidBooking') || {};
    if (!booking.orderId && !booking.resourceId) return list;
    if (!booking.startTime) return list;

    const orderId = booking.orderId ? String(booking.orderId) : '';
    const exists = orderId && list.some(order => String(order.id || order.orderId || order.billingOrderId || '') === orderId);
    if (exists) return list;

    const start = this.parseDate(booking.startTime);
    const durationMinutes = Number(booking.durationMinutes || 60);
    const end = start ? new Date(start.getTime() + durationMinutes * 60000) : null;
    const amount = Number(booking.amount || 0);
    return [{
      id: booking.orderId || `local-paid-${booking.paidAt || Date.now()}`,
      orderId: booking.orderId || '',
      merchantId: booking.merchantId || (app.getActiveMerchantId ? app.getActiveMerchantId() : app.globalData.defaultMerchantId),
      resourceId: booking.resourceId || '',
      status: 10,
      bookingStartTime: booking.startTime,
      bookingEndTime: end ? this.formatBackendTime(end) : '',
      prepaidAmount: amount,
      paidAmount: amount,
      localPaid: true
    }, ...list];
  },

  normalizeOrderStatus(status) {
    if (status === undefined || status === null || status === '') return 40;
    const value = Number(status);
    if (!Number.isNaN(value)) return value;

    const text = String(status).toUpperCase();
    if (['WAIT_PAY', 'PENDING', 'NOTPAY', 'UNPAID'].includes(text)) return 0;
    if (['PAID', 'WAIT_USE', 'WAITING_USE', 'RESERVED', 'BOOKED'].includes(text)) return 10;
    if (['USING', 'IN_USE', 'STARTED'].includes(text)) return 20;
    if (['COMPLETED', 'FINISHED', 'DONE'].includes(text)) return 40;
    if (['REFUNDING', 'REFUND_APPLY'].includes(text)) return 50;
    if (['REFUNDED'].includes(text)) return 55;
    if (['CLOSED', 'CANCEL', 'CANCELED', 'CANCELLED'].includes(text)) return 60;
    return 40;
  },

  parseDate(value) {
    if (!value) return null;
    if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
    if (typeof value === 'number') {
      const ms = value < 10000000000 ? value * 1000 : value;
      const date = new Date(ms);
      return Number.isNaN(date.getTime()) ? null : date;
    }
    const normalized = String(value).replace(/-/g, '/');
    const date = new Date(normalized);
    return Number.isNaN(date.getTime()) ? null : date;
  },

  formatBackendTime(date) {
    if (!date || Number.isNaN(date.getTime())) return '';
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const h = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    const s = String(date.getSeconds()).padStart(2, '0');
    return `${y}-${m}-${d} ${h}:${min}:${s}`;
  },

  formatCurrentBooking(order) {
    if (!order) return null;
    const start = this.parseDate(order.bookingStartTime || order.startTime);
    const end = this.parseDate(order.bookingEndTime || order.endTime);
    const fmt = d => d ? `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}` : '--:--';
    const dateText = start ? (this.isToday(start) ? '今天' : `${start.getMonth() + 1}/${start.getDate()}`) : '今天';
    return {
      id: order.id,
      storeId: order.storeId,
      merchantId: order.merchantId,
      latitude: order.latitude || order.storeLatitude,
      longitude: order.longitude || order.storeLongitude,
      address: order.address || order.storeAddress,
      storeName: order.storeName || order.merchantName || '门店信息待同步',
      roomName: order.roomName || order.resourceName || '资源信息待同步',
      timeText: `${dateText} ${fmt(start)} - ${fmt(end)}`,
      statusText: order.status === 10 ? '待到店' : '使用中',
      image: order.resourcePhoto || order.coverImage || '/images/棋牌预约.png'
    };
  },

  isToday(date) {
    const now = new Date();
    return now.getFullYear() === date.getFullYear() && now.getMonth() === date.getMonth() && now.getDate() === date.getDate();
  },

  // 点击头像区域完善信息
  onAvatarTap: function() {
    wx.navigateTo({ url: '/pages/user-profile/user-profile' });
  },

  goToOrders: function() {
    wx.switchTab({
      url: '/pages/orders/orders'
    });
  },

  goToHome: function() {
    wx.switchTab({ url: '/pages/index/index' });
  },

  goToFavorites: function() {
    wx.navigateTo({ url: '/pages/favorites/favorites' });
  },

  goToCoupons: function() {
    wx.navigateTo({ url: '/pages/messages/messages?type=coupon' });
  },

  goToWallet: function() {
    wx.navigateTo({
      url: '/pages/wallet/wallet'
    });
  },

  goToAddress: function() {
    wx.navigateTo({ url: '/pages/nearby-stores/nearby-stores' });
  },

  goToSettings: function() {
    wx.navigateTo({ url: '/pages/settings/settings' });
  },

  goToHelp: function() {
    wx.navigateTo({ url: '/pages/help-center/help-center' });
  },

  contactService: function() {
    wx.navigateTo({ url: '/pages/customer-service/customer-service' });
  },

  viewCurrentBookingOrder: function() {
    const booking = this.data.currentBooking;
    if (booking && booking.id) {
      wx.navigateTo({ url: `/pages/order-detail/order-detail?orderId=${booking.id}` });
      return;
    }
    wx.switchTab({ url: '/pages/orders/orders' });
  },

  navigateCurrentBooking: function() {
    const booking = this.data.currentBooking;
    if (!booking) {
      wx.navigateTo({ url: '/pages/nearby-stores/nearby-stores' });
      return;
    }

    if (booking.latitude && booking.longitude) {
      wx.openLocation({
        latitude: parseFloat(booking.latitude),
        longitude: parseFloat(booking.longitude),
        name: booking.storeName || '门店位置',
        address: booking.address || '',
        scale: 18
      });
      return;
    }

    if (booking.storeId) {
      const { storeApi } = require('../../utils/api.js');
      wx.showLoading({ title: '获取位置...' });
      storeApi.getStoreById(booking.storeId).then(res => {
        wx.hideLoading();
        const store = res.data || {};
        if (store.latitude && store.longitude) {
          wx.openLocation({
            latitude: parseFloat(store.latitude),
            longitude: parseFloat(store.longitude),
            name: store.storeName || store.name || booking.storeName,
            address: store.address || booking.address || '',
            scale: 18
          });
        } else {
          this.showAddressFallback(store.address || booking.address, store.storeName || store.name || booking.storeName);
        }
      }).catch(() => {
        wx.hideLoading();
        this.showAddressFallback(booking.address, booking.storeName);
      });
      return;
    }

    this.showAddressFallback(booking.address, booking.storeName);
  },

  showAddressFallback(address, name) {
    if (address) {
      wx.showModal({
        title: name || '门店地址',
        content: `${address}\n\n该门店缺少经纬度，暂无法直接打开地图。`,
        confirmText: '复制地址',
        cancelText: '关闭',
        success: (res) => {
          if (res.confirm) wx.setClipboardData({ data: address });
        }
      });
    } else {
      wx.showToast({ title: '暂无门店位置信息', icon: 'none' });
    }
  },

  onServiceTap: function(e) {
    const action = e.currentTarget.dataset.action;
    if (action === 'profile') return this.onAvatarTap();
    if (action === 'favorites') return this.goToFavorites();
    if (action === 'message') return wx.navigateTo({ url: '/pages/messages/messages' });
    if (action === 'help') return this.goToHelp();
    if (action === 'about') return wx.navigateTo({ url: '/pages/about/about' });
  },

  logout: function() {
    const app = getApp();
    if (!app.globalData.openid) return;
    
    wx.showModal({
      title: '确认退出',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          app.logout();
          
          this.setData({
            userInfo: {
              isLogin: false,
              nickname: '微信用户',
              avatar: '',
              phone: '',
              isVip: false
            },
            avatarText: '雀',
            displayAvatar: '',
            avatarLoadFailed: false,
            hasAvatar: false,
            maskedPhone: '未绑定手机号',
            currentBooking: null,
            stats: {
              totalOrders: 0,
              totalHours: 0,
              totalAmount: 0
            },
            wallet: {
              balance: 0
            },
            coupons: {
              available: 0
            }
          });
          
          wx.showToast({
            title: '已退出登录',
            icon: 'success'
          });
        }
      }
    });
  }
});
