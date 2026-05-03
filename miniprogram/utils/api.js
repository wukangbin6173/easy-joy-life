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
    const debug = !!currentConfig.debug;

    if (debug) console.log('发起API请求:', fullUrl);

    const requestOptions = {
      url: fullUrl,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'Content-Type': 'application/json',
        ...options.header
      },
      success: (res) => {
        if (debug) console.log('API响应:', fullUrl, res.statusCode, typeof res.data);

        if (res.statusCode === 200) {
          // 兼容 res.data 为字符串的情况
          let data = res.data;
          if (typeof data === 'string') {
            try { data = JSON.parse(data); } catch(e) {}
          }

          // 兼容多种响应格式
          if (url.includes('/auth/wechat/login') || url.includes('/auth/wechat/test') || url.includes('/auth/wechat/phone')) {
            resolve(data);
          } else if (data && data.success) {
            resolve(data);
          } else if (data && data.code == 200) {
            resolve(data);
          } else {
            console.error('API业务错误:', data);
            const error = new Error(data?.message || '请求失败');
            error.data = data;
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
 * 上传文件
 */
function uploadFile(url, filePath, name = 'file', formData = {}) {
  return new Promise((resolve, reject) => {
    const currentConfig = config.getCurrentConfig();
    const uploadBaseUrls = [];
    [currentConfig.uploadBaseUrl, currentConfig.assetBaseUrl, currentConfig.baseUrl].forEach(base => {
      const normalized = String(base || '').replace(/\/+$/, '');
      if (normalized && uploadBaseUrls.indexOf(normalized) === -1) uploadBaseUrls.push(normalized);
    });
    const fullUrl = (uploadBaseUrls[0] || '') + url;
    const debug = !!currentConfig.debug;
    const header = {};

    try {
      const app = getApp();
      if (app && app.globalData && app.globalData.token) {
        header.Authorization = `Bearer ${app.globalData.token}`;
      }
    } catch (e) {}

    if (debug) console.log('上传文件:', fullUrl);

    wx.uploadFile({
      url: fullUrl,
      filePath,
      name,
      formData,
      header,
      success: (res) => {
        if (debug) console.log('上传响应:', fullUrl, res.statusCode, res.data);
        let data = res.data;
        if (typeof data === 'string') {
          try { data = JSON.parse(data); } catch (e) {}
        }

        if (res.statusCode === 200 && (data && (data.success || data.code == 200))) {
          resolve(data);
        } else {
          const error = new Error(data?.message || '上传失败');
          error.data = data;
          reject(error);
        }
      },
      fail: reject
    });
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

  // 获取门店列表（merchantId 可选）
  getStores(merchantId, pageNo = 1, pageSize = 20) {
    const data = { pageNo, pageSize };
    if (merchantId) data.merchantId = merchantId;
    return request('/api/stores', { method: 'GET', data });
  },

  // 获取门店详情
  getStoreById(storeId) {
    return request(`/api/stores/${storeId}`, {
      method: 'GET',
      data: { _t: Date.now() }
    });
  },

  // 查询附近门店
  getNearbyStores(longitude, latitude, radius, limit = 20) {
    const data = { longitude, latitude };
    if (radius !== undefined && radius !== null) {
      data.radius = radius;
      const radiusNumber = Number(radius);
      if (Number.isFinite(radiusNumber)) {
        data.radiusKm = Math.max(1, Math.ceil(radiusNumber / 1000));
      }
    }
    if (limit) data.limit = limit;
    return request('/api/stores/nearby', {
      method: 'GET',
      data
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
  getRooms(merchantId, pageNo = 1, pageSize = 20, storeId) {
    const data = { merchantId, pageNo, pageSize };
    if (storeId) data.storeId = storeId;
    return request('/api/rooms', {
      method: 'GET',
      data
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

  // 设置房间排班
  setSchedule(resourceId, merchantId, data) {
    return request(`/api/rooms/${resourceId}/schedule?merchantId=${merchantId}`, {
      method: 'PUT',
      data
    });
  },

  // 批量设置房间排班
  batchSetSchedules(data) {
    return request('/api/rooms/schedules/batch', {
      method: 'POST',
      data
    });
  },

  // 更新房间状态
  updateStatus(resourceId, merchantId, data) {
    return request(`/api/rooms/${resourceId}/status?merchantId=${merchantId}`, {
      method: 'PUT',
      data
    });
  },

  // 查询可用预约时间段
  getAvailableSlots(merchantId, resourceId, date, options = {}) {
    const bookingDate = options.bookingDate || date;
    const data = {
      ...options,
      merchantId,
      bookingDate,
      date: bookingDate
    };
    if (resourceId) data.resourceId = resourceId;

    return request('/api/rooms/booking/available-slots', {
      method: 'GET',
      data
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

const uploadApi = {
  uploadImage(filePath) {
    return uploadFile('/api/upload/image', filePath, 'file');
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
  uploadFile,
  storeApi,
  roomApi,
  userApi,
  uploadApi,
  paymentApi,
  orderApi,
  walletApi,
  smsApi,
  bankCardApi,
  payPasswordApi
};
