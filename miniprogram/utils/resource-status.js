const RESOURCE_BLOCKED_STATUS_CODES = [1, 2, 3, 4, 5];
const ROOM_BLOCKED_STATUS_CODES = [1, 2, 3, 4, 5];

const CLEANING_KEYWORDS = [
  '\u5f85\u6253\u626b', '\u5f85\u6e05\u6d01', '\u5f85\u4fdd\u6d01',
  '\u6e05\u626b', '\u6e05\u6d01', '\u4fdd\u6d01', '\u6e05\u7406',
  'clean', 'cleaning'
];
const MAINTENANCE_KEYWORDS = ['\u7ef4\u62a4', '\u7ef4\u4fee', 'maintain', 'maintenance', 'repair'];
const DISABLED_KEYWORDS = [
  '\u505c\u7528', '\u5173\u95ed', '\u9501\u5b9a', '\u4e0b\u67b6',
  '\u4e0d\u53ef\u7ea6', '\u4e0d\u53ef\u7528', '\u7981\u7528',
  'disabled', 'disable', 'closed', 'locked', 'unavailable', 'offline'
];
const REST_KEYWORDS = ['\u4f11\u606f', '\u5e97\u4f11', 'rest'];
const BOOKED_KEYWORDS = [
  '\u9884\u8ba2\u4e2d', '\u9884\u7ea6\u4e2d', '\u5df2\u9884\u8ba2',
  '\u5df2\u9884\u7ea6', '\u5df2\u7ea6', '\u5360\u7528', '\u4f7f\u7528\u4e2d',
  '\u5df2\u652f\u4ed8', 'booked', 'reserved', 'occupied', 'using', 'paid'
];

const RESOURCE_STATUS_CODE_KEYS = [
  'status',
  'resourceStatus',
  'state',
  'statusCode',
  'resourceStatusCode'
];

const ROOM_STATUS_CODE_KEYS = [
  'roomStatus',
  'roomStatusCode',
  'cleanStatus',
  'cleaningStatus',
  'cleanState'
];

const STATUS_TEXT_KEYS = [
  'rawStatusText',
  'statusText',
  'statusName',
  'statusDesc',
  'statusLabel',
  'resourceStatusText',
  'resourceStatusName',
  'resourceStatusDesc',
  'resourceState',
  'resourceStateText',
  'roomStatusText',
  'roomStatusName',
  'stateText',
  'stateName',
  'availableStatus',
  'availabilityStatus',
  'bookingStatus',
  'bookingStatusText',
  'cleanStatus',
  'cleanStatusText',
  'cleanStatusName',
  'cleaningStatus',
  'cleaningStatusText',
  'cleaningStatusName',
  'cleanState',
  'cleanStateText',
  'cleanStateName'
];

function normalizeText(value) {
  return String(value || '').trim().toLowerCase();
}

function includesAny(text, keywords) {
  const normalized = normalizeText(text);
  return keywords.some(keyword => normalized.includes(normalizeText(keyword)));
}

function isOffFlag(value) {
  return value === 0 || value === false ||
    value === '0' || value === 'false' || value === 'FALSE' ||
    value === 'N' || value === 'n' || value === 'no' || value === 'NO';
}

function isOnFlag(value) {
  return value === 1 || value === true ||
    value === '1' || value === 'true' || value === 'TRUE' ||
    value === 'Y' || value === 'y' || value === 'yes' || value === 'YES';
}

function getFirstNumericCode(room = {}, keys = []) {
  for (const key of keys) {
    const value = room[key];
    if (value === undefined || value === null || value === '') continue;
    const num = Number(value);
    if (Number.isFinite(num)) return num;
  }
  return null;
}

function getResourceStatusCode(room = {}) {
  return getFirstNumericCode(room, RESOURCE_STATUS_CODE_KEYS);
}

function getRoomStatusCode(room = {}) {
  return getFirstNumericCode(room, ROOM_STATUS_CODE_KEYS);
}

function collectStatusText(room = {}) {
  const values = STATUS_TEXT_KEYS
    .map(key => room[key])
    .filter(value => value !== undefined && value !== null && value !== '')
    .map(value => String(value));

  ['status', 'state', 'roomStatus', 'cleanStatus'].forEach(key => {
    if (room[key] !== undefined && room[key] !== null && Number.isNaN(Number(room[key]))) {
      values.push(String(room[key]));
    }
  });

  return values.join(' ');
}

function hasBlockedFlag(room = {}) {
  if (isOffFlag(room.isAcceptBooking) || isOffFlag(room.acceptBooking) || isOffFlag(room.bookingEnabled)) return true;
  if (isOffFlag(room.isEnabled) || isOffFlag(room.enabled)) return true;
  if (isOffFlag(room.isShowInApp) || isOffFlag(room.showInApp)) return true;
  if (isOffFlag(room.isAvailable) || isOffFlag(room.available)) return true;
  if (isOffFlag(room.bookable) || isOffFlag(room.canBook) || isOffFlag(room.canBooking) || isOffFlag(room.canReserve)) return true;
  if (isOnFlag(room.isDeleted) || isOnFlag(room.deleted)) return true;
  return false;
}

function hasBlockedStatusCode(room = {}) {
  const resourceStatusCode = getResourceStatusCode(room);
  if (RESOURCE_BLOCKED_STATUS_CODES.includes(resourceStatusCode)) return true;

  const roomStatusCode = getRoomStatusCode(room);
  if (ROOM_BLOCKED_STATUS_CODES.includes(roomStatusCode)) return true;

  return false;
}

function isResourceBookable(room = {}) {
  if (!room || typeof room !== 'object') return false;
  if (hasBlockedFlag(room)) return false;
  if (hasBlockedStatusCode(room)) return false;

  const statusText = collectStatusText(room);
  if (includesAny(statusText, CLEANING_KEYWORDS)) return false;
  if (includesAny(statusText, MAINTENANCE_KEYWORDS)) return false;
  if (includesAny(statusText, DISABLED_KEYWORDS)) return false;
  if (includesAny(statusText, REST_KEYWORDS)) return false;
  if (includesAny(statusText, BOOKED_KEYWORDS)) return false;

  return true;
}

function getResourceStatusText(room = {}) {
  const statusText = collectStatusText(room);
  const resourceStatusCode = getResourceStatusCode(room);
  const roomStatusCode = getRoomStatusCode(room);

  if (includesAny(statusText, CLEANING_KEYWORDS) || roomStatusCode === 3) return '\u5f85\u6e05\u6d01';
  if (includesAny(statusText, MAINTENANCE_KEYWORDS) || resourceStatusCode === 3) return '\u7ef4\u62a4\u4e2d';
  if (includesAny(statusText, DISABLED_KEYWORDS) || resourceStatusCode === 4) return '\u5df2\u505c\u7528';
  if (includesAny(statusText, REST_KEYWORDS) || resourceStatusCode === 5 || roomStatusCode === 5) return '\u4f11\u606f\u4e2d';
  if (includesAny(statusText, BOOKED_KEYWORDS) || resourceStatusCode === 1 || roomStatusCode === 1) return '\u9884\u8ba2\u4e2d';
  if (resourceStatusCode === 2 || roomStatusCode === 2) return '\u4f7f\u7528\u4e2d';
  if (hasBlockedFlag(room)) return '\u4e0d\u53ef\u7ea6';
  if (!isResourceBookable(room)) return '\u4e0d\u53ef\u7ea6';
  return '\u53ef\u7ea6';
}

function getResourceStatusClass(room = {}) {
  const statusText = collectStatusText(room);
  const resourceStatusCode = getResourceStatusCode(room);
  const roomStatusCode = getRoomStatusCode(room);

  if (includesAny(statusText, CLEANING_KEYWORDS) || roomStatusCode === 3) return 'cleaning';
  if (includesAny(statusText, BOOKED_KEYWORDS) || resourceStatusCode === 1 || resourceStatusCode === 2 || roomStatusCode === 1 || roomStatusCode === 2) return 'booked';
  if (!isResourceBookable(room)) return 'disabled';
  return 'available';
}

module.exports = {
  collectStatusText,
  getResourceStatusClass,
  getResourceStatusCode,
  getRoomStatusCode,
  getResourceStatusText,
  isResourceBookable
};
