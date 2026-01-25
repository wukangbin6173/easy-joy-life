// API服务模块
const config = require('./config.js');

/**
 * 发起HTTP请求 - 所有数据来自MySQL数据库
 */
function request(url, options = {}) {
  return new Promise((resolve, reject) => {
    // 获取当前配置
    const currentConfig = config.getCurrentConfig();
    
    // 真实API请求 - 直接连接MySQL数据库
    const baseUrl = currentConfig.baseUrl;
    const fullUrl = baseUrl + url;
    
    console.log('发起API请求:', fullUrl);
    console.log('请求参数:', options);
    
    const requestOptions = {
      url: fullUrl,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'Content-Type': 'application/json',
        ...options.header
      },
      success: (res) => {
        console.log('API请求成功:', fullUrl, res);
        if (res.data && res.data.code === 200) {
          resolve(res.data);
        } else {
          console.error('API返回错误:', res.data);
          reject(new Error(res.data?.message || '请求失败'));
        }
      },
      fail: (err) => {
        console.error('API请求失败:', fullUrl, err);
        console.error('错误详情:', {
          errMsg: err.errMsg,
          statusCode: err.statusCode,
          data: err.data
        });
        reject(err);
      }
    };

    // 尝试获取token（如果app已初始化）
    try {
      const app = getApp();
      if (app && app.globalData && app.globalData.token) {
        requestOptions.header.Authorization = `Bearer ${app.globalData.token}`;
      }
    } catch (e) {
      console.log('获取app实例失败，跳过token设置');
    }

    console.log('wx.request配置:', requestOptions);
    wx.request(requestOptions);
  });
}

/**
 * 门店API
 */
const storeApi = {
  // 获取所有门店
  getStores() {
    return request('/api/stores');
  },

  // 根据ID获取门店详情
  getStoreById(id) {
    return request(`/api/stores/${id}`);
  },

  // 搜索门店
  searchStores(keyword) {
    return request('/api/stores/search', {
      method: 'GET',
      data: { keyword }
    });
  },

  // 创建门店
  createStore(storeData) {
    return request('/api/stores', {
      method: 'POST',
      data: storeData
    });
  },

  // 更新门店
  updateStore(id, storeData) {
    return request(`/api/stores/${id}`, {
      method: 'PUT',
      data: storeData
    });
  },

  // 删除门店
  deleteStore(id) {
    return request(`/api/stores/${id}`, {
      method: 'DELETE'
    });
  }
};

/**
 * 房间API
 */
const roomApi = {
  // 根据门店ID获取房间列表
  getRoomsByStoreId(storeId) {
    return request(`/api/rooms/store/${storeId}`);
  },

  // 根据ID获取房间详情
  getRoomById(id) {
    return request(`/api/rooms/${id}`);
  },

  // 获取所有房间
  getAllRooms() {
    return request('/api/rooms');
  },

  // 创建房间
  createRoom(roomData) {
    return request('/api/rooms', {
      method: 'POST',
      data: roomData
    });
  },

  // 更新房间
  updateRoom(id, roomData) {
    return request(`/api/rooms/${id}`, {
      method: 'PUT',
      data: roomData
    });
  },

  // 删除房间
  deleteRoom(id) {
    return request(`/api/rooms/${id}`, {
      method: 'DELETE'
    });
  }
};

/**
 * 用户API
 */
const userApi = {
  // 微信登录
  wechatLogin(code) {
    return request('/api/auth/wechat-login', {
      method: 'POST',
      data: { code }
    });
  },

  // 获取用户信息
  getUserProfile() {
    return request('/api/user/profile');
  },

  // 更新用户信息
  updateUserProfile(userData) {
    return request('/api/user/profile', {
      method: 'PUT',
      data: userData
    });
  }
};

/**
 * 订单API
 */
const orderApi = {
  // 创建订单
  createOrder(orderData) {
    return request('/api/orders', {
      method: 'POST',
      data: orderData
    });
  },

  // 获取用户订单列表
  getUserOrders(status) {
    const params = status ? `?status=${status}` : '';
    return request(`/api/orders/user${params}`);
  },

  // 根据ID获取订单详情
  getOrderById(id) {
    return request(`/api/orders/${id}`);
  },

  // 取消订单
  cancelOrder(id) {
    return request(`/api/orders/${id}/cancel`, {
      method: 'PUT'
    });
  }
};

module.exports = {
  request,
  storeApi,
  roomApi,
  userApi,
  orderApi
};