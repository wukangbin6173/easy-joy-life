const TRUE_VALUES = ['1', 'true', 'yes', 'y', 'on', 'open', 'opened', 'enable', 'enabled', 'show', 'shown', 'visible', '预约', '预订', '预定', '开启', '启用', '显示'];
const FALSE_VALUES = ['0', 'false', 'no', 'n', 'off', 'close', 'closed', 'disable', 'disabled', 'hide', 'hidden', 'invisible', '到店', '到店使用', '现场', '关闭', '停用', '隐藏'];

const BOOKING_FLAG_KEYS = [
  'showBooking'
];

const DISPLAY_CONFIG_KEYS = ['displayConfig', 'businessDisplayConfig', 'industryDisplayConfig'];
const BOOKING_CONFIG_KEYS = ['bookingConfig', 'bookingSetting', 'bookingSettings', 'bookingRule', 'bookingRules', 'reservationConfig', 'reserveConfig'];
const BOOKING_CONFIG_ENABLE_KEYS = ['enableBooking', 'bookingEnabled', 'bookingEnable', 'isBookingEnabled', 'reservationEnabled', 'enableReservation', 'enabled', 'isEnabled'];
const BOOKING_CONFIG_STATUS_KEYS = ['status', 'bookingStatus', 'configStatus'];
const STORE_WRAPPER_KEYS = ['data', 'store', 'storeInfo', 'storeDetail'];

function normalize(value) {
  return String(value === undefined || value === null ? '' : value).trim().toLowerCase();
}

function parseFlag(value) {
  if (value === true || value === 1) return true;
  if (value === false || value === 0) return false;
  const text = normalize(value);
  if (!text) return null;
  if (TRUE_VALUES.includes(text)) return true;
  if (FALSE_VALUES.includes(text)) return false;
  if (FALSE_VALUES.some(item => item.length > 2 && text.includes(item))) return false;
  if (TRUE_VALUES.some(item => item.length > 2 && text.includes(item))) return true;
  return null;
}

function parseObject(value) {
  if (!value || typeof value !== 'string') return value;
  const text = value.trim();
  if (!text || text[0] !== '{') return value;
  try {
    return JSON.parse(text);
  } catch (e) {
    return value;
  }
}

function readDeep(source, keys) {
  const stack = [parseObject(source)];
  const seen = [];
  while (stack.length) {
    const current = parseObject(stack.shift());
    if (!current || typeof current !== 'object' || seen.includes(current)) continue;
    seen.push(current);

    for (const key of keys) {
      if (current[key] !== undefined && current[key] !== null && current[key] !== '') {
        return current[key];
      }
    }

    DISPLAY_CONFIG_KEYS.concat(STORE_WRAPPER_KEYS).forEach(key => {
      const value = current[key];
      const parsed = parseObject(value);
      if (parsed && typeof parsed === 'object') stack.push(parsed);
    });
  }
  return undefined;
}

function readConfig(source) {
  return readDeep(source, BOOKING_CONFIG_KEYS);
}

function parseBookingConfigStatus(value) {
  if (value === undefined || value === null || value === '') return null;
  const text = normalize(value);
  if (text === '0' || text === 'normal' || text === 'enabled' || text === 'enable' || text === 'open' || text === '正常' || text === '开启' || text === '启用') return true;
  if (text === '1' || text === 'disabled' || text === 'disable' || text === 'closed' || text === 'close' || text === '关闭' || text === '停用' || text === '禁用') return false;
  return null;
}

function resolveBookingConfigEnabled(config) {
  if (!config || typeof config !== 'object') return null;
  const status = parseBookingConfigStatus(readDeep(config, BOOKING_CONFIG_STATUS_KEYS));
  if (status !== null) return status;

  const explicitFlag = parseFlag(readDeep(config, BOOKING_CONFIG_ENABLE_KEYS));
  if (explicitFlag !== null) return explicitFlag;

  return null;
}

function resolveSource(source) {
  const bookingConfigFlag = resolveBookingConfigEnabled(readConfig(source));
  const displayFlag = parseFlag(readDeep(source, BOOKING_FLAG_KEYS));

  if (bookingConfigFlag !== null) return bookingConfigFlag && displayFlag !== false;
  if (displayFlag !== null) return displayFlag;

  return null;
}

function resolveBookingEnabled(...sources) {
  const validSources = sources.filter(source => source && typeof source === 'object');
  if (!validSources.length) return false;

  const firstSourceValue = resolveSource(validSources[0]);
  return firstSourceValue === true;
}

function getBookingValue(source) {
  return readDeep(source, BOOKING_FLAG_KEYS);
}

module.exports = {
  getBookingValue,
  resolveBookingConfigEnabled,
  resolveBookingEnabled
};
