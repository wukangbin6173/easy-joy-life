// 环境配置
const DEFAULT_MERCHANT_ID = 23;
const ASSET_BASE_URL = 'https://www.quexitai.com';
const DEFAULT_STORE_IMAGE = '/images/banner.png';
const DEFAULT_ROOM_IMAGE = '/images/棋牌预约.png';
const DEFAULT_EMPTY_IMAGE = '/images/提示.png';

const config = {
  // 开发环境
  development: {
    baseUrl: 'https://www.quexitai.com',
    assetBaseUrl: ASSET_BASE_URL,
    uploadBaseUrl: ASSET_BASE_URL,
    debug: true,
    defaultMerchantId: DEFAULT_MERCHANT_ID
  },
  
  // 生产环境
  production: {
    baseUrl: 'https://www.quexitai.com',
    assetBaseUrl: ASSET_BASE_URL,
    uploadBaseUrl: ASSET_BASE_URL,
    debug: false,
    defaultMerchantId: DEFAULT_MERCHANT_ID
  }
};

// 自动检测环境
function getEnvironment() {
  try {
    const accountInfo = wx.getAccountInfoSync();
    const envVersion = accountInfo && accountInfo.miniProgram && accountInfo.miniProgram.envVersion;
    if (envVersion === 'release' || envVersion === 'trial') {
      return 'production';
    }
  } catch (e) {
    // 非微信运行环境下默认开发环境，方便本地调试。
  }
  
  return 'development';
}

// 获取当前环境配置
function getCurrentConfig() {
  const env = getEnvironment();
  const currentConfig = config[env] || config.development;
  
  if (currentConfig.debug) {
    console.log('当前环境:', env);
    console.log('配置信息:', currentConfig);
  }
  
  return {
    ...currentConfig,
    env
  };
}

module.exports = {
  DEFAULT_MERCHANT_ID,
  DEFAULT_STORE_IMAGE,
  DEFAULT_ROOM_IMAGE,
  DEFAULT_EMPTY_IMAGE,
  getCurrentConfig,
  getEnvironment
};
