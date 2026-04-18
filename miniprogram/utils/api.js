// API服务模块 - 对接商起点开放平台
const config = require('./config.js');

/**
 * 发起HTTP请求
 */
function request(url, options = {}) {
  return new Promise((resolve, reject) => {
    const currentConfig = config.getCurrentConfig();
    const baseUrl = currentConfig.baseUrl;
    const fullUrl = baseUrl + url;

    console.log('发起API请求:', fullUrl);

    const requestOptions = {
      url: fullUrl,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'Content-Type': 'application/json',
        ...options.header
      },
      success: (res) => {
        console.log('API响应:', fullUrl, res.statusCode);

        if (res.statusCode === 200) {
          // 兼容多种响应格式
          if (url.includes('/auth/wechat/login') || url.includes('/auth/wechat/test')) {
            resolve(res.data);
          } else if (res.data && res.data.success) {
            resolve(res.data);
          } else if (res.data && res.data.code == 200) {
            resolve(res.data);
          } else {
            console.error('API业务错误:', res.data);
            const error = new Error(res.data?.message || '请求失败');
            error.data = res.data;
            reject(error);
          }
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${res.data?.message || '请求失败'}`));
        }
      },
      fail: (err) => {
        console.error('API请求失败:', fullUrl, err);
        reject(err);
      }
    };

    // 附加token
    try {
      const app = getApp();
      if (app && app.globalData && app.globalData.token) {
        requestOptions.header.Authorization = `Bearer ${app.globalData.token}`;
      }
    } catch (e) {}

    wx.request(requestOptions);
  });
}

/**
 * 商户/门店API - 数据来源：商起点
 */
const storeApi = {
  // 获取商户列表
  getMerchants(pageNo = 1, pageSize = 20) {
    return request('/api/stores/merchants', {
      method: 'GET',
      data: { pageNo, pageSize }
    });
  },

  // 获取商户详情
  getMerchant(merchantId) {
    return request(`/api/stores/merchants/${merchantId}`);
  },

  // 商户注册（入驻）
  registerMerchant(data) {
    return request('/api/stores/merchants/register', {
      method: 'POST',
      data
    });
  },

  // 获取商户下的门店列表
  getStores(merchantId, pageNo = 1, pageSize = 20) {
    return request('/api/stores', {
      method: 'GET',
      data: { merchantId, pageNo, pageSize }
    });
  },

  // 获取门店详情
  getStoreById(storeId) {
    return request(`/api/stores/${storeId}`);
  },

  // 查询附近门店
  getNearbyStores(longitude, latitude, radius) {
    return request('/api/stores/nearby', {
      method: 'GET',
      data: { longitude, latitude, radius }
    });
  },

  // 获取门店营业时间
  getBusinessHours(storeId) {
    return request(`/api/stores/${storeId}/business-hours`);
  },

  // 创建门店
  createStore(data) {
    return request('/api/stores', {
      method: 'POST',
      data
    });
  },

  // 更新门店
  updateStore(storeId, data) {
    return request(`/api/stores/${storeId}`, {
      method: 'PUT',
      data
    });
  },

  // 删除门店
  deleteStore(storeId) {
    return request(`/api/stores/${storeId}`, {
      method: 'DELETE'
    });
  }
};

/**
 * 房间/资源API - 数据来源：商起点可预订资源
 */
const roomApi = {
  // 获取商户下的房间列表
  getRooms(merchantId, pageNo = 1, pageSize = 20) {
    return request('/api/rooms', {
      method: 'GET',
      data: { merchantId, pageNo, pageSize }
    });
  },

  // 获取房间详情
  getRoomById(resourceId, merchantId) {
    return request(`/api/rooms/${resourceId}`, {
      method: 'GET',
      data: { merchantId }
    });
  },

  // 查询房间可用性
  getAvailability(resourceId, merchantId, date) {
    return request(`/api/rooms/${resourceId}/availability`, {
      method: 'GET',
      data: { merchantId, date }
    });
  },

  // 查询可用预约时间段
  getAvailableSlots(merchantId, resourceId, date) {
    return request('/api/rooms/booking/available-slots', {
      method: 'GET',
      data: { merchantId, resourceId, date }
    });
  },

  // 创建预约
  createBooking(data) {
    return request('/api/rooms/booking', {
      method: 'POST',
      data
    });
  },

  // 查询预约列表
  getBookings(merchantId, pageNo = 1, pageSize = 20) {
    return request('/api/rooms/booking/list', {
      method: 'GET',
      data: { merchantId, pageNo, pageSize }
    });
  },

  // 查询预约详情
  getBooking(orderId, merchantId) {
    return request(`/api/rooms/booking/${orderId}`, {
      method: 'GET',
      data: { merchantId }
    });
  },

  // 取消预约
  cancelBooking(orderId, merchantId) {
    return request(`/api/rooms/booking/${orderId}/cancel`, {
      method: 'POST',
      data: { merchantId }
    });
  },

  // 开台
  startService(orderId, merchantId) {
    return request(`/api/rooms/booking/${orderId}/start`, {
      method: 'POST',
      data: { merchantId }
    });
  },

  // 结台
  completeService(orderId, merchantId) {
    return request(`/api/rooms/booking/${orderId}/complete`, {
      method: 'POST',
      data: { merchantId }
    });
  },

  // 资源统计
  getStatistics(merchantId) {
    return request('/api/rooms/statistics', {
      method: 'GET',
      data: { merchantId }
    });
  }
};

/**
 * 用户API - 保留原有微信登录逻辑
 */
const userApi = {
  wechatLogin(code) {
    return request('/api/auth/wechat/login', {
      method: 'POST',
      data: { code }
    });
  },

  getUserInfo(openid) {
    return request('/api/auth/user/info', {
      method: 'GET',
      data: { openid }
    });
  },

  updateUserProfile(data) {
    return request('/api/auth/user/update', {
      method: 'POST',
      data
    });
  }
};

/**
 * 支付/订单API - 数据来源：商起点
 */
const paymentApi = {
  // 创建收银台支付（商起点）
  createCashier(data) {
    return request('/api/sqd/payment/cashier/create', {
      method: 'POST',
      data
    });
  },

  // 查询支付结果（商起点）
  queryPayment(tradeNo) {
    return request('/api/sqd/payment/query', {
      method: 'GET',
      data: { tradeNo }
    });
  },

  // 创建订单（商起点）
  createOrder(data) {
    return request('/api/sqd/payment/orders', {
      method: 'POST',
      data
    });
  },

  // 查询订单列表（商起点）
  getOrders(merchantId, externalUserId, status, pageNo = 1, pageSize = 20) {
    return request('/api/sqd/payment/orders', {
      method: 'GET',
      data: { merchantId, externalUserId, status, pageNo, pageSize }
    });
  },

  // 查询订单详情（商起点）
  getOrder(orderId, merchantId) {
    return request(`/api/sqd/payment/orders/${orderId}`, {
      method: 'GET',
      data: { merchantId }
    });
  },

  // 订单支付
  payOrder(orderId, merchantId, data) {
    return request(`/api/sqd/payment/orders/${orderId}/pay?merchantId=${merchantId}`, {
      method: 'POST',
      data
    });
  },

  // 取消订单
  cancelOrder(orderId, merchantId) {
    return request(`/api/sqd/payment/orders/${orderId}/cancel`, {
      method: 'POST',
      data: { merchantId }
    });
  },

  // 申请退款
  refundOrder(orderId, merchantId, data) {
    return request(`/api/sqd/payment/orders/${orderId}/refund?merchantId=${merchantId}`, {
      method: 'POST',
      data
    });
  },

  // 订单评价
  reviewOrder(orderId, merchantId, data) {
    return request(`/api/sqd/payment/orders/${orderId}/review?merchantId=${merchantId}`, {
      method: 'POST',
      data
    });
  }
};

/**
 * 短信API - 保留原有逻辑
 */
const smsApi = {
  sendCode(phone, type = 'GENERAL') {
    return request('/api/sms/send-code', {
      method: 'POST',
      data: { phone, type }
    });
  },

  verifyCode(phone, code, type = 'GENERAL') {
    return request('/api/sms/verify-code', {
      method: 'POST',
      data: { phone, code, type }
    });
  }
};

/**
 * 银行卡API - 保留原有逻辑
 */
const bankCardApi = {
  getBankCards(userId) {
    return request(`/api/user/bank-cards/${userId}`);
  },

  addBankCard(data) {
    return request('/api/user/bank-cards', {
      method: 'POST',
      data
    });
  },

  setDefault(userId, cardId) {
    return request('/api/user/bank-cards/set-default', {
      method: 'POST',
      data: { userId, cardId }
    });
  },

  deleteBankCard(cardId, userId) {
    return request(`/api/user/bank-cards/${cardId}?userId=${userId}`, {
      method: 'DELETE'
    });
  },

  identifyBank(cardNo) {
    return request('/api/user/bank-cards/identify', {
      method: 'POST',
      data: { cardNo }
    });
  }
};

/**
 * 支付密码API - 保留原有逻辑
 */
const payPasswordApi = {
  hasPayPassword(userId) {
    return request(`/api/user/has-pay-password/${userId}`);
  },

  setPayPassword(data) {
    return request('/api/user/pay-password', {
      method: 'POST',
      data
    });
  },

  verifyPayPassword(data) {
    return request('/api/user/verify-pay-password', {
      method: 'POST',
      data
    });
  }
};

// 向后兼容：保留旧的 orderApi 和 walletApi 名称
const orderApi = paymentApi;
const walletApi = {
  getTransactions(userId) {
    return request(`/api/wallet/${userId}/transactions`);
  }
};

module.exports = {
  request,
  storeApi,
  roomApi,
  userApi,
  paymentApi,
  orderApi,
  walletApi,
  smsApi,
  bankCardApi,
  payPasswordApi
};