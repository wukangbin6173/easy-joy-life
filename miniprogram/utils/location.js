const CACHE_TTL = 5 * 60 * 1000;
const cityData = require('./city-data.js');

const COMMON_CITIES = cityData.CITY_CENTERS;

function toNumber(value) {
  if (value === undefined || value === null || value === '') return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function isValidLatitude(value) {
  return Number.isFinite(value) && value >= -90 && value <= 90;
}

function isValidLongitude(value) {
  return Number.isFinite(value) && value >= -180 && value <= 180;
}

function normalizeCoordinates(latitude, longitude) {
  const lat = toNumber(latitude);
  const lng = toNumber(longitude);

  if (isValidLatitude(lat) && isValidLongitude(lng)) {
    return { latitude: lat, longitude: lng };
  }

  if (isValidLatitude(lng) && isValidLongitude(lat)) {
    return { latitude: lng, longitude: lat, swapped: true };
  }

  return null;
}

function pickFirst(source, keys) {
  if (!source) return null;
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    if (source[key] !== undefined && source[key] !== null && source[key] !== '') {
      return source[key];
    }
  }
  return null;
}

function resolveStoreLocation(store = {}) {
  const latitude = pickFirst(store, [
    'latitude',
    'lat',
    'storeLatitude',
    'storeLat',
    'coordY',
    'y'
  ]);
  const longitude = pickFirst(store, [
    'longitude',
    'lng',
    'lon',
    'storeLongitude',
    'storeLng',
    'coordX',
    'x'
  ]);
  const normalized = normalizeCoordinates(latitude, longitude);
  if (normalized) return normalized;

  const nested = store.location || store.coordinate || store.coordinates || store.geo || {};
  return normalizeCoordinates(
    pickFirst(nested, ['latitude', 'lat', 'y']),
    pickFirst(nested, ['longitude', 'lng', 'lon', 'x'])
  );
}

function normalizeCityName(value) {
  if (!value) return '';
  const text = String(value)
    .replace(/\s+/g, '')
    .replace(/^.*省/, '')
    .replace(/^.*自治区/, '');
  if (!text) return '';
  if (/^(北京市|上海市|天津市|重庆市)$/.test(text)) return text;
  if (/(特别行政区|自治州|自治县|地区|林区|县|旗|盟|市)$/.test(text)) return text;
  return `${text}市`;
}

function cityCompareKey(value) {
  return normalizeCityName(value).replace(/(特别行政区|自治州|自治县|地区|林区|县|旗|盟|市)$/g, '');
}

function extractCityFromText(value) {
  if (!value) return '';
  const text = String(value).replace(/\s+/g, '');
  const direct = text.match(/(北京市|上海市|天津市|重庆市)/);
  if (direct) return direct[1];

  const cities = text.match(/[\u4e00-\u9fa5]{2,12}(?:自治州|地区|盟|市)/g);
  if (cities && cities.length) {
    const cleaned = cities[cities.length - 1]
      .replace(/^.*省/, '')
      .replace(/^.*自治区/, '');
    if (cleaned.includes('市')) {
      const parts = cleaned.split('市').filter(Boolean);
      if (parts.length) return normalizeCityName(`${parts[parts.length - 1]}市`);
    }
    return normalizeCityName(cleaned);
  }

  return '';
}

function getStoreCity(store = {}) {
  const city = pickFirst(store, [
    'city',
    'cityName',
    'storeCity',
    'storeCityName',
    'locationCity'
  ]);
  const normalized = normalizeCityName(city);
  if (normalized) return normalized;

  return extractCityFromText(pickFirst(store, [
    'address',
    'storeAddress',
    'fullAddress'
  ]));
}

function getCityCenter(cityName) {
  const key = cityCompareKey(cityName);
  return COMMON_CITIES.find(city => cityCompareKey(city.name) === key) || null;
}

function flattenCityGroups(groups = cityData.CITY_GROUPS) {
  const seen = {};
  const list = [];
  groups.forEach(group => {
    (group.cities || []).forEach(city => {
      const name = normalizeCityName(city);
      const key = cityCompareKey(name);
      if (!key || seen[key]) return;
      seen[key] = true;
      list.push({
        name,
        province: group.province,
        center: getCityCenter(name)
      });
    });
  });
  return list;
}

function getStoreCities(stores = []) {
  const seen = {};
  return stores
    .map(getStoreCity)
    .filter(Boolean)
    .filter(city => {
      const key = cityCompareKey(city);
      if (!key || seen[key]) return false;
      seen[key] = true;
      return true;
    });
}

function matchesCityKeyword(cityName, keyword = '') {
  const key = String(keyword || '').trim().toLowerCase();
  if (!key) return true;
  const city = normalizeCityName(cityName);
  return city.toLowerCase().includes(key) ||
    cityCompareKey(city).toLowerCase().includes(key);
}

function createCityItem(cityName, province = '') {
  const name = normalizeCityName(cityName);
  return {
    name,
    province,
    center: getCityCenter(name)
  };
}

function getHotCities(stores = [], currentCity = '') {
  const storeCities = getStoreCities(stores);
  const names = [currentCity]
    .concat(storeCities)
    .concat(cityData.HOT_CITY_NAMES)
    .filter(Boolean);
  const seen = {};
  return names
    .map(name => createCityItem(name))
    .filter(item => {
      const key = cityCompareKey(item.name);
      if (!key || seen[key]) return false;
      seen[key] = true;
      return true;
    });
}

function buildCityGroups(stores = [], currentCity = '', keyword = '') {
  const normalizedKeyword = String(keyword || '').trim();
  const cityCatalogKeys = {};
  flattenCityGroups().forEach(city => {
    cityCatalogKeys[cityCompareKey(city.name)] = true;
  });

  const storeCities = getStoreCities(stores)
    .filter(city => !cityCatalogKeys[cityCompareKey(city)])
    .map(city => createCityItem(city, '商户城市'))
    .filter(city => matchesCityKeyword(city.name, normalizedKeyword));

  const groups = [];
  if (storeCities.length) {
    groups.push({ province: '商户覆盖城市', cities: storeCities });
  }

  cityData.CITY_GROUPS.forEach(group => {
    const cities = (group.cities || [])
      .map(city => createCityItem(city, group.province))
      .filter(city => matchesCityKeyword(city.name, normalizedKeyword));
    if (cities.length) groups.push({ province: group.province, cities });
  });

  if (currentCity && !normalizedKeyword) {
    const key = cityCompareKey(currentCity);
    const hasCurrent = groups.some(group =>
      group.cities.some(city => cityCompareKey(city.name) === key)
    );
    if (!hasCurrent) {
      groups.unshift({ province: '当前城市', cities: [createCityItem(currentCity)] });
    }
  }

  return groups;
}

function guessCityFromCoordinates(location) {
  const normalized = location && normalizeCoordinates(location.latitude, location.longitude);
  if (!normalized) return '';

  let closest = null;
  COMMON_CITIES.forEach(city => {
    const distance = calculateDistance(
      normalized.latitude,
      normalized.longitude,
      city.latitude,
      city.longitude
    );
    if (distance !== null && (!closest || distance < closest.distance)) {
      closest = { ...city, distance };
    }
  });
  return closest ? closest.name : '';
}

function getCityFromMapSelection(selection = {}) {
  return extractCityFromText(selection.address) ||
    extractCityFromText(selection.name) ||
    guessCityFromCoordinates(selection);
}

function isStoreInCity(store = {}, cityName) {
  const city = normalizeCityName(cityName);
  if (!city) return true;
  const key = cityCompareKey(city);
  const storeCity = getStoreCity(store);
  if (storeCity && cityCompareKey(storeCity) === key) return true;

  const text = [
    store.address,
    store.storeAddress,
    store.fullAddress,
    store.displayName,
    store.storeName,
    store.name
  ].filter(Boolean).join('');
  return text.includes(city) || text.includes(key);
}

function buildCityOptions(stores = [], currentCity = '') {
  const cityMap = {};
  [currentCity].concat(stores.map(getStoreCity)).filter(Boolean).forEach(city => {
    cityMap[cityCompareKey(city)] = normalizeCityName(city);
  });

  flattenCityGroups().forEach(city => {
    if (!cityMap[cityCompareKey(city.name)]) cityMap[cityCompareKey(city.name)] = city.name;
  });

  return Object.keys(cityMap).map(key => ({
    name: cityMap[key],
    center: getCityCenter(cityMap[key])
  }));
}

function calculateDistance(lat1, lng1, lat2, lng2) {
  const point1 = normalizeCoordinates(lat1, lng1);
  const point2 = normalizeCoordinates(lat2, lng2);
  if (!point1 || !point2) return null;

  const rad = Math.PI / 180;
  const a = (point1.latitude - point2.latitude) * rad;
  const b = (point1.longitude - point2.longitude) * rad;
  const s = 2 * Math.asin(Math.sqrt(
    Math.pow(Math.sin(a / 2), 2) +
    Math.cos(point1.latitude * rad) *
      Math.cos(point2.latitude * rad) *
      Math.pow(Math.sin(b / 2), 2)
  ));
  return s * 6378.137;
}

function resolveDistanceKm(store = {}, userLocation) {
  const storeLocation = resolveStoreLocation(store);
  if (userLocation && storeLocation) {
    return calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      storeLocation.latitude,
      storeLocation.longitude
    );
  }

  const distanceKm = toNumber(pickFirst(store, ['distanceKm', 'distance_km']));
  if (distanceKm !== null) return distanceKm;

  const distanceMeters = toNumber(pickFirst(store, [
    'distanceMeters',
    'distanceMeter',
    'distance_meters',
    'distance_meter'
  ]));
  if (distanceMeters !== null) return distanceMeters / 1000;

  const rawDistance = toNumber(store.distance);
  if (rawDistance === null) return null;
  return rawDistance > 50 ? rawDistance / 1000 : rawDistance;
}

function formatDistance(distance) {
  if (distance === null || distance === undefined || distance === '') return '--';
  const value = Number(distance);
  if (!Number.isFinite(value)) return '--';
  return value < 1 ? `${Math.round(value * 1000)}m` : `${value.toFixed(1)}km`;
}

function getCachedLocation() {
  const app = getApp();
  const location = app && app.globalData && app.globalData.currentLocation;
  if (!location) return null;
  const normalized = normalizeCoordinates(location.latitude, location.longitude);
  if (!normalized) return null;
  const timestamp = location.timestamp || 0;
  return {
    ...normalized,
    accuracy: location.accuracy,
    city: location.city ? normalizeCityName(location.city) : '',
    timestamp
  };
}

function cacheLocation(location) {
  const app = getApp();
  const normalized = normalizeCoordinates(location.latitude, location.longitude);
  if (!app || !app.globalData || !normalized) return normalized;
  const cached = {
    ...normalized,
    accuracy: location.accuracy,
    city: location.city ? normalizeCityName(location.city) : '',
    timestamp: Date.now()
  };
  app.globalData.currentLocation = cached;
  return cached;
}

function getCurrentLocation(options = {}) {
  const cached = getCachedLocation();
  if (!options.force && cached && cached.timestamp && Date.now() - cached.timestamp < CACHE_TTL) {
    return Promise.resolve(cached);
  }

  return new Promise((resolve, reject) => {
    wx.getLocation({
      type: options.type || 'gcj02',
      isHighAccuracy: true,
      highAccuracyExpireTime: options.highAccuracyExpireTime || 4000,
      success: (res) => {
        const normalized = normalizeCoordinates(res.latitude, res.longitude);
        if (!normalized) {
          reject(new Error('invalid location'));
          return;
        }
        resolve(cacheLocation({ ...normalized, accuracy: res.accuracy }));
      },
      fail: reject
    });
  });
}

function formatLocationText(location) {
  if (!location) return '未开启定位';
  if (location.city) return normalizeCityName(location.city);
  return guessCityFromCoordinates(location) || '当前位置';
}

module.exports = {
  buildCityGroups,
  buildCityOptions,
  cacheLocation,
  calculateDistance,
  cityCompareKey,
  COMMON_CITIES,
  flattenCityGroups,
  extractCityFromText,
  formatDistance,
  formatLocationText,
  getCachedLocation,
  getCityCenter,
  getCityFromMapSelection,
  getCurrentLocation,
  getHotCities,
  getStoreCity,
  guessCityFromCoordinates,
  isStoreInCity,
  matchesCityKeyword,
  normalizeCoordinates,
  normalizeCityName,
  resolveDistanceKm,
  resolveStoreLocation
};
