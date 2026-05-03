const app = getApp();
const { storeApi, roomApi } = require('../../utils/api.js');
const config = require('../../utils/config.js');
const resourceStatus = require('../../utils/resource-status.js');
const locationUtil = require('../../utils/location.js');

const CATEGORY_CONFIG = {
  all: {
    title: '全部',
    shortName: '门店',
    serviceName: '服务',
    serviceUnit: '项',
    icon: '◇',
    defaultPrice: 36,
    keywords: []
  },
  mahjong: {
    title: '棋牌',
    shortName: '棋牌',
    serviceName: '包间',
    serviceUnit: '间',
    icon: '♙',
    defaultPrice: 68,
    fallbackImage: '/images/棋牌预约.png',
    keywords: ['棋牌', '麻将', '包间', '包房', '棋牌室', 'mahjong']
  },
  billiards: {
    title: '台球',
    shortName: '台球',
    serviceName: '球台',
    serviceUnit: '张',
    icon: '◇',
    defaultPrice: 36,
    fallbackImage: '/images/台球预约.png',
    keywords: ['台球', '桌球', '球台', '8球', '八球', 'billiard', 'billiards', 'pool']
  },
  carwash: {
    title: '洗车',
    shortName: '洗车',
    serviceName: '洗车机',
    serviceUnit: '台',
    icon: '♧',
    defaultPrice: 18,
    fallbackImage: '/images/自助洗车.png',
    keywords: ['洗车', '洗车机', '自助洗车', 'carwash', 'car wash', 'car']
  }
};

Page({
  data: {
    loading: true,
    stores: [],
    allStores: [],
    searchKeyword: '',
    activeCategory: 'all',
    sortMode: 'distance',
    location: null,
    locationText: '正在定位...',
    currentCity: '',
    selectedCity: '',
    citySource: 'auto',
    cityOptions: [],
    cityGroups: [],
    hotCities: [],
    citySearchKeyword: '',
    citySearchCandidate: '',
    showCityPanel: false,
    emptyText: '暂无附近门店',
    filters: {
      open: false,
      selfService: false,
      fullDay: false,
      hasImage: false
    },
    categoryTabs: [
      { type: 'all', title: '全部', active: true },
      { type: 'mahjong', title: '棋牌', active: false },
      { type: 'billiards', title: '台球', active: false },
      { type: 'carwash', title: '洗车', active: false }
    ]
  },

  onLoad(options = {}) {
    if (options.category) this.setActiveCategory(options.category);
    this.initLocationAndLoad();
  },

  onShow() {
    if (!this.data.allStores.length) return;
    this.applyFilters();
  },

  onPullDownRefresh() {
    this.initLocationAndLoad();
    setTimeout(() => wx.stopPullDownRefresh(), 1200);
  },

  initLocationAndLoad(options = {}) {
    locationUtil.getCurrentLocation({ force: !!options.force }).then(location => {
      const city = location.city || locationUtil.guessCityFromCoordinates(location);
      const located = locationUtil.cacheLocation({ ...location, city });
      this.setData({
        location: located,
        currentCity: city,
        selectedCity: city,
        citySource: 'auto',
        locationText: city || '当前位置'
      });
      this.loadNearbyStores(located);
    }).catch(() => {
      this.setData({ location: null, locationText: '未开启定位，展示默认门店' });
      this.loadAllStores();
    });
  },

  loadNearbyStores(location) {
    this.setData({ loading: true });
    storeApi.getNearbyStores(location.longitude, location.latitude, 10000).then(res => {
      const stores = this.normalizeResponseStores(res);
      this.setStores(stores, location);
    }).catch(err => {
      console.error('附近门店接口失败，降级门店列表:', err);
      this.loadAllStores();
    });
  },

  loadAllStores(location = this.data.location) {
    this.setData({ loading: true });
    storeApi.getStores(this.getMerchantId(), 1, 50).then(res => {
      const stores = this.normalizeResponseStores(res);
      this.setStores(stores, location);
    }).catch(err => {
      console.error('加载门店失败:', err);
      this.setData({ allStores: [], loading: false });
      this.applyFilters();
    });
  },

  normalizeResponseStores(res) {
    const data = res && res.data;
    if (data && Array.isArray(data.list)) return data.list;
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.records)) return data.records;
    return [];
  },

  setStores(rawStores, location) {
    const stores = rawStores.map((store, index) => {
      const normalized = this.normalizeStore(store, index, location);
      return normalized;
    }).sort((a, b) => (a.distanceValue ?? Number.MAX_SAFE_INTEGER) - (b.distanceValue ?? Number.MAX_SAFE_INTEGER));

    const inferredCity = this.resolveCityFromStores(stores, location);
    const selectedCity = this.data.citySource === 'manual'
      ? this.data.selectedCity
      : (inferredCity || this.data.selectedCity);
    const cityOptions = locationUtil.buildCityOptions(stores, selectedCity || inferredCity);
    const patch = {
      allStores: stores,
      loading: false,
      cityOptions,
      cityGroups: locationUtil.buildCityGroups(stores, selectedCity || inferredCity, this.data.citySearchKeyword),
      hotCities: locationUtil.getHotCities(stores, selectedCity || inferredCity)
    };

    if (inferredCity && this.data.citySource !== 'manual') {
      patch.currentCity = inferredCity;
      patch.selectedCity = inferredCity;
      patch.locationText = inferredCity;
      if (location) {
        patch.location = { ...location, city: inferredCity };
        locationUtil.cacheLocation(patch.location);
      }
    } else if (selectedCity) {
      patch.selectedCity = selectedCity;
      patch.locationText = selectedCity;
    }

    this.setData(patch);
    this.applyFilters();
    this.enrichStoresWithRooms(stores);
  },

  normalizeStore(store, index, location) {
    const categoryTypes = this.detectCategoryTypes(store);
    const categoryType = categoryTypes[0] || 'mahjong';
    const meta = CATEGORY_CONFIG[categoryType];
    const validCover = store.coverUrl && !store.coverUrl.startsWith('file://') ? store.coverUrl : null;
    const validLogo = store.logoUrl && !store.logoUrl.startsWith('file://') ? store.logoUrl : null;
    const realImage = validCover || validLogo || (store.images && store.images[0]) || '';
    const coverImage = realImage || meta.fallbackImage || '';
    const distanceValue = this.resolveDistanceValue(store, location);
    const priceInfo = this.getStorePriceInfo(store, meta);

    return {
      ...store,
      id: store.id || store.storeId || `fallback-${index}`,
      merchantId: store.merchantId || store.merchantID || this.getMerchantId(),
      displayName: store.storeName || store.name || '未命名门店',
      address: store.address || store.storeAddress || '暂无地址',
      city: locationUtil.getStoreCity(store),
      phone: store.contactPhone || store.phone || '',
      coverImage,
      hasRealImage: !!realImage,
      categoryTypes,
      categoryType,
      categoryTitle: meta.title,
      categoryShortName: meta.shortName,
      categoryIcon: meta.icon,
      serviceName: meta.serviceName,
      serviceUnit: meta.serviceUnit,
      roomCount: store.roomCount || store.resourceCount || 0,
      priceYuan: priceInfo.value,
      priceText: priceInfo.text,
      priceUnitText: priceInfo.unitText,
      hasPrice: priceInfo.hasPrice,
      distanceValue,
      distanceText: this.formatDistance(distanceValue),
      isOpenNow: this.isStoreOpenNow(store),
      supportsSelfService: this.supportsSelfService(store, categoryType),
      isFullDay: this.isFullDayStore(store),
      selfServiceText: categoryType === 'carwash' ? '自助洗车' : '可自助开门',
      extraTag: this.getExtraTag(store),
      availableText: store.availableText || '查询中'
    };
  },

  detectCategoryTypes(store) {
    const text = [
      store.name,
      store.storeName,
      store.category,
      store.categoryName,
      store.businessType,
      store.serviceType,
      store.storeType,
      store.description,
      store.facilities,
      store.tags
    ].filter(Boolean).join(' ').toLowerCase();

    const types = [];
    ['carwash', 'billiards', 'mahjong'].forEach(type => {
      if (CATEGORY_CONFIG[type].keywords.some(keyword => text.includes(keyword.toLowerCase()))) {
        types.push(type);
      }
    });
    return types.length ? types : ['mahjong'];
  },

  resolveCityFromStores(stores = [], location) {
    const sortedStores = [...stores].sort((a, b) =>
      (a.distanceValue ?? Number.MAX_SAFE_INTEGER) - (b.distanceValue ?? Number.MAX_SAFE_INTEGER)
    );
    const cityStore = sortedStores.find(store => locationUtil.getStoreCity(store));
    if (cityStore) return locationUtil.getStoreCity(cityStore);
    return locationUtil.guessCityFromCoordinates(location);
  },

  getMerchantId() {
    return (app.getActiveMerchantId && app.getActiveMerchantId()) ||
      app.globalData.currentMerchantId ||
      app.globalData.defaultMerchantId ||
      config.DEFAULT_MERCHANT_ID;
  },

  resolveDistanceValue(store, location) {
    return locationUtil.resolveDistanceKm(store, location);
  },

  getStorePrice(store) {
    return this.getStorePriceInfo(store).value || '';
  },

  getStorePriceInfo(source = {}, meta = {}) {
    const raw = this.pickPriceValue(source, [
      'minPrice',
      'lowestPrice',
      'startPrice',
      'startingPrice',
      'price',
      'unitPrice',
      'hourPrice',
      'pricePerHour',
      'salePrice',
      'packagePrice',
      'amount',
      'payAmount',
      'totalAmount'
    ]);
    const value = this.normalizeMoney(raw);
    return {
      value,
      text: value ? this.formatPrice(value) : '',
      unitText: this.getPriceUnitText(source, meta),
      hasPrice: value > 0
    };
  },

  pickPriceValue(source = {}, fields = []) {
    for (const field of fields) {
      const value = source[field];
      if (value !== undefined && value !== null && value !== '') return value;
    }
    return '';
  },

  normalizeMoney(value) {
    if (value === undefined || value === null || value === '') return 0;
    const num = Number(value);
    if (!Number.isFinite(num) || num <= 0) return 0;
    return num >= 100 ? num / 100 : num;
  },

  formatPrice(value) {
    const num = Number(value);
    if (!Number.isFinite(num) || num <= 0) return '';
    return Number.isInteger(num) ? `${num}` : num.toFixed(2).replace(/\.00$/, '');
  },

  getPriceUnitText(source = {}, meta = {}) {
    const unitText = `${source.unitName || source.priceUnit || source.unit || source.chargeUnit || ''}`;
    if (unitText.includes('次')) return '/次起';
    if (unitText.includes('小时') || unitText.toLowerCase().includes('hour')) return '/小时起';
    if ((meta && meta.serviceName) === '洗车机' || source.categoryType === 'carwash') return '/次起';
    return '/小时起';
  },

  getExtraTag(store) {
    const text = `${store.tags || ''}${store.facilities || ''}${store.description || ''}`;
    if (text.includes('停车')) return '停车方便';
    if (text.includes('地铁')) return '近地铁';
    return '服务便捷';
  },

  getStoreSearchText(store = {}) {
    return [
      store.displayName,
      store.name,
      store.storeName,
      store.address,
      store.categoryTitle,
      store.tags,
      store.facilities,
      store.description,
      store.businessHours,
      store.openingHours,
      store.serviceType,
      store.businessType
    ].filter(Boolean).join(' ').toLowerCase();
  },

  isTruthyFlag(value) {
    return value === true || value === 1 || value === '1' || value === 'true' || value === 'Y' || value === 'yes';
  },

  isStoreOpenNow(store = {}) {
    if (store.isOpen === false || store.open === false) return false;
    const text = this.getStoreSearchText(store);
    if (/停业|打烊|休息|关闭|暂停|closed/.test(text)) return false;
    if (this.isTruthyFlag(store.isOpen) || this.isTruthyFlag(store.open) || this.isTruthyFlag(store.openNow)) return true;
    if (/营业|开业|开放|open|24/.test(text)) return true;
    return true;
  },

  supportsSelfService(store = {}, categoryType = '') {
    if (this.isTruthyFlag(store.selfService) || this.isTruthyFlag(store.supportSelfService) || this.isTruthyFlag(store.autoUnlock)) return true;
    const text = this.getStoreSearchText(store);
    if (/非自助|人工接待/.test(text)) return false;
    return categoryType === 'carwash' || /自助|无人|智能开门|扫码|共享/.test(text);
  },

  isFullDayStore(store = {}) {
    if (this.isTruthyFlag(store.fullDay) || this.isTruthyFlag(store.open24Hours) || this.isTruthyFlag(store.is24h)) return true;
    const text = this.getStoreSearchText(store);
    return /24小时|24h|全天|00:00\s*-\s*24:00|0:00\s*-\s*24:00/.test(text);
  },

  enrichStoresWithRooms(stores) {
    stores.forEach(store => {
      if (!store.merchantId) return;
      roomApi.getRooms(store.merchantId, 1, 50, store.id || store.storeId).then(res => {
        const data = res.data;
        const rooms = data && Array.isArray(data.list)
          ? data.list
          : (data && Array.isArray(data.records) ? data.records : (Array.isArray(data) ? data : []));
        this.updateStoreByRooms(store, rooms);
      }).catch(err => {
        console.error('加载门店房间失败:', store.merchantId, err);
        this.updateStorePartial(store.id, {
          availableText: store.roomCount > 0 ? '今日可约' : '暂无可约'
        });
      });
    });
  },

  updateStoreByRooms(store, rooms) {
    const visibleRooms = this.filterRoomsForStore(rooms, store).filter(room => room.isShowInApp !== 0);
    const roomList = visibleRooms.filter(room => this.isBookableResource(room));
    const categorySource = roomList.length ? roomList : visibleRooms;
    const categoryTypes = this.detectCategoryTypesFromRooms(categorySource, store.categoryTypes);
    const categoryType = categoryTypes[0] || store.categoryType;
    const meta = CATEGORY_CONFIG[categoryType] || CATEGORY_CONFIG.mahjong;
    const minPriceInfo = this.getMinRoomPriceInfo(categorySource, meta);

    this.updateStorePartial(store.id, {
      categoryTypes,
      categoryType,
      categoryTitle: meta.title,
      categoryShortName: meta.shortName,
      categoryIcon: meta.icon,
      serviceName: meta.serviceName,
      serviceUnit: meta.serviceUnit,
      roomCount: roomList.length,
      priceYuan: minPriceInfo.hasPrice ? minPriceInfo.value : store.priceYuan,
      priceText: minPriceInfo.hasPrice ? minPriceInfo.text : store.priceText,
      priceUnitText: minPriceInfo.hasPrice ? minPriceInfo.unitText : store.priceUnitText,
      hasPrice: minPriceInfo.hasPrice || store.hasPrice,
      availableText: roomList.length > 0 ? '今日可约' : '暂无可约'
    });
  },

  filterRoomsForStore(rooms, store) {
    const storeId = String((store && (store.id || store.storeId)) || '');
    if (!storeId) return rooms;
    const roomsWithStoreId = rooms.filter(room => this.getRoomStoreId(room));
    if (!roomsWithStoreId.length) return rooms;
    return rooms.filter(room => String(this.getRoomStoreId(room)) === storeId);
  },

  getRoomStoreId(room = {}) {
    return room.storeId || room.storeID || room.store_id ||
      (room.store && room.store.id) ||
      (room.storeInfo && room.storeInfo.id) || '';
  },

  isBookableResource(room = {}) {
    return resourceStatus.isResourceBookable(room);
  },

  updateStorePartial(storeId, patch) {
    const allStores = this.data.allStores.map(store => (
      store.id === storeId ? { ...store, ...patch } : store
    ));
    this.setData({ allStores });
    this.applyFilters();
  },

  detectCategoryTypesFromRooms(rooms, fallbackTypes) {
    const types = [];
    rooms.forEach(room => {
      const roomTypes = this.detectCategoryTypes(room);
      roomTypes.forEach(type => {
        if (!types.includes(type)) types.push(type);
      });
    });
    return types.length ? types : fallbackTypes;
  },

  getMinRoomPrice(rooms) {
    return this.getMinRoomPriceInfo(rooms).value || '';
  },

  getMinRoomPriceInfo(rooms = [], meta = {}) {
    const list = rooms
      .map(room => ({
        room,
        price: this.normalizeMoney(this.pickPriceValue(room, [
          'unitPrice',
          'price',
          'pricePerHour',
          'hourPrice',
          'salePrice',
          'packagePrice',
          'amount',
          'payAmount',
          'totalAmount'
        ]))
      }))
      .filter(item => item.price > 0);
    if (!list.length) return { value: 0, text: '', unitText: this.getPriceUnitText({}, meta), hasPrice: false };
    const minItem = list.sort((a, b) => a.price - b.price)[0];
    return {
      value: minItem.price,
      text: this.formatPrice(minItem.price),
      unitText: this.getPriceUnitText(minItem.room, meta),
      hasPrice: true
    };
  },

  applyFilters() {
    const keyword = (this.data.searchKeyword || '').trim().toLowerCase();
    const category = this.data.activeCategory;
    const filters = this.data.filters || {};
    const selectedCity = this.data.selectedCity;
    let stores = this.data.allStores;

    if (selectedCity) {
      const cityStores = stores.filter(store => locationUtil.isStoreInCity(store, selectedCity));
      if (cityStores.length || this.data.citySource === 'manual') {
        stores = cityStores;
      }
    }

    if (category !== 'all') {
      stores = stores.filter(store => store.categoryTypes.includes(category));
    }

    if (keyword) {
      stores = stores.filter(store => {
        return this.getStoreSearchText(store).includes(keyword);
      });
    }

    if (filters.open) stores = stores.filter(store => store.isOpenNow);
    if (filters.selfService) stores = stores.filter(store => store.supportsSelfService);
    if (filters.fullDay) stores = stores.filter(store => store.isFullDay);
    if (filters.hasImage) stores = stores.filter(store => !!store.hasRealImage);

    if (this.data.sortMode === 'price') {
      stores = [...stores].sort((a, b) => this.getSortPrice(a) - this.getSortPrice(b));
    } else {
      stores = [...stores].sort((a, b) => (a.distanceValue ?? Number.MAX_SAFE_INTEGER) - (b.distanceValue ?? Number.MAX_SAFE_INTEGER));
    }

    const activeMeta = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.all;
    const cityPrefix = selectedCity ? `${selectedCity}` : '附近';
    const emptyText = keyword ? '没有找到匹配的门店' : `暂无${cityPrefix}${activeMeta.title === '全部' ? '' : activeMeta.title}门店`;
    this.setData({ stores, emptyText });
  },

  getSortPrice(store = {}) {
    if (!store.hasPrice) return Number.MAX_SAFE_INTEGER;
    const price = Number(store.priceYuan);
    return Number.isFinite(price) ? price : Number.MAX_SAFE_INTEGER;
  },

  onSearchInput(e) {
    this.setData({ searchKeyword: e.detail.value });
    this.applyFilters();
  },

  onCategoryTap(e) {
    this.setActiveCategory(e.currentTarget.dataset.category);
    this.applyFilters();
  },

  setActiveCategory(category) {
    const activeCategory = CATEGORY_CONFIG[category] ? category : 'all';
    this.setData({
      activeCategory,
      categoryTabs: this.data.categoryTabs.map(item => ({
        ...item,
        active: item.type === activeCategory
      }))
    });
  },

  setSortMode(e) {
    this.setData({ sortMode: e.currentTarget.dataset.sort || 'distance' });
    this.applyFilters();
  },

  toggleFilter(e) {
    const key = e.currentTarget.dataset.filter;
    if (!key || this.data.filters[key] === undefined) return;
    this.setData({ [`filters.${key}`]: !this.data.filters[key] }, () => this.applyFilters());
    wx.showToast({ title: '筛选已更新', icon: 'none' });
  },

  showMoreFilters() {
    wx.showActionSheet({
      itemList: ['仅看有图门店', '价格从低到高', '距离从近到远'],
      success: (res) => {
        if (res.tapIndex === 0) {
          this.setData({ 'filters.hasImage': !this.data.filters.hasImage }, () => this.applyFilters());
        } else if (res.tapIndex === 1) {
          this.setData({ sortMode: 'price' }, () => this.applyFilters());
        } else {
          this.setData({ sortMode: 'distance' }, () => this.applyFilters());
        }
      }
    });
  },

  chooseMapLocation() {
    const location = this.data.location || {};
    wx.chooseLocation({
      latitude: location.latitude,
      longitude: location.longitude,
      success: (res) => {
        const selectedLocation = locationUtil.cacheLocation({
          latitude: res.latitude,
          longitude: res.longitude,
          city: locationUtil.getCityFromMapSelection(res)
        });
        const city = selectedLocation.city || locationUtil.guessCityFromCoordinates(selectedLocation);
        this.setData({
          location: { ...selectedLocation, city },
          currentCity: city,
          selectedCity: city,
          citySource: 'map',
          locationText: city || '当前位置'
        });
        this.loadNearbyStores({ ...selectedLocation, city });
      },
      fail: (err) => {
        if (!err || !String(err.errMsg || '').includes('cancel')) {
          wx.showToast({ title: '地图打开失败', icon: 'none' });
        }
      }
    });
  },

  showCitySelector() {
    this.setData({
      ...this.buildCityPickerData(''),
      citySearchKeyword: '',
      showCityPanel: true
    });
  },

  hideCitySelector() {
    this.setData({ showCityPanel: false });
  },

  buildCityPickerData(keyword = '') {
    const cityGroups = locationUtil.buildCityGroups(this.data.allStores, this.data.selectedCity, keyword);
    return {
      cityGroups,
      hotCities: locationUtil.getHotCities(this.data.allStores, this.data.selectedCity),
      citySearchCandidate: this.getCitySearchCandidate(keyword, cityGroups)
    };
  },

  getCitySearchCandidate(keyword = '', cityGroups = []) {
    const normalized = locationUtil.normalizeCityName(keyword);
    if (!normalized) return '';
    const exists = cityGroups.some(group =>
      group.cities.some(city => locationUtil.cityCompareKey(city.name) === locationUtil.cityCompareKey(normalized))
    );
    return exists ? '' : normalized;
  },

  onCitySearchInput(e) {
    const keyword = e.detail.value || '';
    this.setData({
      citySearchKeyword: keyword,
      ...this.buildCityPickerData(keyword)
    });
  },

  onCitySearchConfirm(e) {
    const keyword = (e.detail && e.detail.value) || this.data.citySearchKeyword;
    const pickerData = this.buildCityPickerData(keyword);
    const firstCity = pickerData.cityGroups[0] &&
      pickerData.cityGroups[0].cities[0] &&
      pickerData.cityGroups[0].cities[0].name;
    const city = pickerData.citySearchCandidate || firstCity;
    if (city) this.selectCity(city);
  },

  clearCitySearch() {
    this.setData({
      citySearchKeyword: '',
      ...this.buildCityPickerData('')
    });
  },

  onUseSearchCity() {
    if (this.data.citySearchCandidate) this.selectCity(this.data.citySearchCandidate);
  },

  onCityTap(e) {
    const city = e.currentTarget.dataset.city;
    this.selectCity(city);
  },

  selectCity(city) {
    if (!city) return;
    const center = locationUtil.getCityCenter(city);
    const location = center
      ? locationUtil.cacheLocation({
          latitude: center.latitude,
          longitude: center.longitude,
          city
        })
      : (this.data.location ? { ...this.data.location, city } : null);

    this.setData({
      showCityPanel: false,
      citySearchKeyword: '',
      citySearchCandidate: '',
      selectedCity: city,
      currentCity: city,
      citySource: 'manual',
      location,
      locationText: city
    });
    this.loadAllStores(location);
  },

  relocate() {
    this.setData({
      loading: true,
      locationText: '正在定位...',
      showCityPanel: false,
      citySearchKeyword: '',
      citySearchCandidate: ''
    });
    this.initLocationAndLoad({ force: true });
  },

  goStoreDetail(e) {
    const storeId = e.currentTarget.dataset.id;
    const merchantId = e.currentTarget.dataset.merchantid || '';
    if (`${storeId}`.startsWith('fallback-')) {
      wx.showToast({ title: '门店加载中，请稍后重试', icon: 'none' });
      return;
    }
    if (merchantId && app.setActiveMerchantId) app.setActiveMerchantId(merchantId);
    wx.navigateTo({ url: `/pages/store-detail/store-detail?id=${storeId}&merchantId=${merchantId}` });
  },

  openStoreLocation(e) {
    const store = e.currentTarget.dataset.store;
    if (!store) return;
    const storeLocation = locationUtil.resolveStoreLocation(store);
    if (storeLocation) {
      wx.openLocation({
        latitude: storeLocation.latitude,
        longitude: storeLocation.longitude,
        name: store.displayName || store.name || '门店位置',
        address: store.address || '',
        scale: 18
      });
      return;
    }

    if (store.address && store.address !== '暂无地址') {
      wx.showModal({
        title: store.displayName || '门店地址',
        content: `${store.address}\n\n该门店缺少经纬度，暂无法直接打开地图。`,
        confirmText: '复制地址',
        cancelText: '关闭',
        success: (res) => {
          if (res.confirm) wx.setClipboardData({ data: store.address });
        }
      });
      return;
    }

    wx.showToast({ title: '暂无位置信息', icon: 'none' });
  },

  contactService() {
    wx.showModal({
      title: '联系客服',
      variant: 'service',
      servicePhone: '15157903339',
      serviceTime: '7×24小时在线',
      serviceDesc: '预约、支付、开门、退款等问题都可以联系人工客服',
      showCancel: true,
      cancelText: '知道了',
      confirmText: '拨打电话',
      success: (res) => {
        if (res.confirm) wx.makePhoneCall({ phoneNumber: '15157903339' });
      }
    });
  },

  goBack() {
    const pages = getCurrentPages();
    if (pages.length > 1) wx.navigateBack();
    else wx.switchTab({ url: '/pages/index/index' });
  },

  calculateDistance(lat1, lng1, lat2, lng2) {
    return locationUtil.calculateDistance(lat1, lng1, lat2, lng2);
  },

  formatDistance(distance) {
    return locationUtil.formatDistance(distance);
  },

  
});
