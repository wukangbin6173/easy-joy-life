const { storeApi, roomApi } = require('../../utils/api.js');
const app = getApp();

Page({
  data: {
    storeId: null,
    merchantId: null,
    store: {},
    rooms: [],
    walletBalance: 0,
    userPoints: 0,
    pointsRate: 2,
    // 时间轴
    timelineHours: [],
    defaultTimeline: [],
    // 预订弹窗
    showBooking: false,
    selectedRoom: {},
    bookingMode: 'time',
    roomCount: 1,
    dates: [],
    selectedDate: '',
    // 时长快捷筛选
    selectedDuration: 0,
    // 时间格子
    timeSlots: [],
    selectedHours: 0,
    totalPrice: 0,
    // 套餐
    packages: [],
    packageNames: [],
    selectedPackageIdx: -1
  },

  onLoad(options) {
    this.setData({
      storeId: options.id,
      merchantId: options.merchantId || null
    });
    this.initDates();
    this.initTimeline();
    this.loadStoreDetail();
    this.loadRooms();
    this.loadWalletInfo();
  },

  onShow() {
    this.loadWalletInfo();
  },

  // ========== 初始化 ==========

  initDates() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const fmt = d => `${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    const dates = [fmt(today), fmt(tomorrow)];
    this.setData({ dates, selectedDate: dates[0] });
  },

  initTimeline() {
    // 生成时间轴刻度 0-24
    const hours = [];
    for (let i = 0; i <= 24; i += 2) {
      hours.push(i);
    }
    // 生成默认时间轴段（模拟数据）
    const now = new Date();
    const currentHour = now.getHours();
    const timeline = [];
    for (let h = 0; h < 24; h++) {
      let status = 'available';
      if (h < currentHour) status = 'past';
      timeline.push({ hour: h, status, width: 100 / 24 });
    }
    this.setData({ timelineHours: hours, defaultTimeline: timeline });
  },

  // ========== 数据加载 ==========

  loadStoreDetail() {
    storeApi.getStoreById(this.data.storeId).then(res => {
      let store = res.data || {};
      if (store.images && typeof store.images === 'string') store.images = [store.images];
      else if (!store.images || !store.images.length) store.images = ['/images/default-store.jpg'];
      this.setData({ store });
    }).catch(err => {
      console.error('加载门店详情失败:', err);
      // 模拟数据（嘉善亭桥路店）
      this.setData({
        store: {
          name: '嘉善亭桥路店',
          images: ['/images/store-detail-banner.jpg'],
          hasWifi: true,
          phone: '18057322566',
          address: '嘉兴市嘉善县罗星街道亭桥南路229号'
        }
      });
    });
  },

  loadRooms() {
    if (!this.data.merchantId) {
      this.setMockRooms();
      return;
    }
    roomApi.getRooms(this.data.merchantId).then(res => {
      let rooms = [];
      const data = res.data;
      if (data && data.list) rooms = data.list;
      else if (Array.isArray(data)) rooms = data;
      this.attachTimeline(rooms);
      this.setData({ rooms });
    }).catch(err => {
      console.error('加载房间失败:', err);
      this.setMockRooms();
    });
  },

  setMockRooms() {
    const rooms = [
      { id: 1, name: '奔驰', pricePerHour: 15, status: 'available', image: '/images/room-benchi.jpg' },
      { id: 2, name: '宝马', pricePerHour: 15, status: 'available', image: '/images/room-benchi.jpg' },
      { id: 3, name: '保时捷', pricePerHour: 15, status: 'available', image: '/images/room-baoshijie.jpg' }
    ];
    this.attachTimeline(rooms);
    this.setData({ rooms });
  },

  attachTimeline(rooms) {
    const now = new Date();
    const ch = now.getHours();
    rooms.forEach(room => {
      const tl = [];
      const bookedHours = this.getBookedHoursForRoom(room.id);
      for (let h = 0; h < 24; h++) {
        let status = 'available';
        if (h < ch) status = 'past';
        else if (bookedHours.includes(h)) status = 'booked';
        tl.push({ hour: h, status, width: 100 / 24 });
      }
      room.timeline = tl;
    });
  },

  getBookedHoursForRoom(roomId) {
    // 模拟各房间的已预约时间段（参照截图）
    const bookings = {
      1: [15, 16, 17, 18],        // 奔驰：15:19-19:00 已预约
      2: [19, 20, 21],            // 宝马：19:00-22:00 已预约
      3: [14, 15, 16, 17, 18, 19] // 保时捷：14:00-20:00 已预约
    };
    return bookings[roomId] || [];
  },

  loadWalletInfo() {
    const userId = app.globalData.userId;
    if (!userId) return;
    const { request } = require('../../utils/api.js');
    request(`/api/wallet/${userId}`).then(res => {
      if (res.success) {
        this.setData({
          walletBalance: res.wallet ? res.wallet.balance : 0,
          userPoints: res.points || 0
        });
      }
    }).catch(() => {});
    request('/api/wallet/points/earn-rate').then(res => {
      if (res.success) this.setData({ pointsRate: res.earnRate || 2 });
    }).catch(() => {});
  },

  // ========== 预订弹窗 ==========

  onRoomTap(e) {
    const room = e.currentTarget.dataset.room;
    this.setData({
      selectedRoom: room,
      showBooking: true,
      bookingMode: 'time',
      roomCount: 1,
      selectedPackageIdx: -1,
      selectedDuration: 0,
      selectedHours: 0,
      totalPrice: 0
    });
    this.generateTimeSlots();
    this.generatePackages(room);
  },

  closeBooking() {
    this.setData({ showBooking: false });
  },

  switchMode(e) {
    const mode = e.currentTarget.dataset.mode;
    this.setData({
      bookingMode: mode,
      selectedHours: 0,
      totalPrice: 0,
      selectedPackageIdx: -1,
      selectedDuration: 0
    });
    if (mode === 'time') this.generateTimeSlots();
  },

  changeCount(e) {
    let count = this.data.roomCount + parseInt(e.currentTarget.dataset.delta);
    if (count < 1) count = 1;
    if (count > 10) count = 10;
    this.setData({ roomCount: count });
    this.recalculate();
  },

  selectDate(e) {
    this.setData({ selectedDate: e.currentTarget.dataset.date, selectedDuration: 0 });
    this.generateTimeSlots();
  },

  // ========== 时长快捷筛选 ==========

  selectDuration(e) {
    const dur = parseInt(e.currentTarget.dataset.dur);
    this.setData({ selectedDuration: dur });

    if (dur === 0) {
      // "其他"模式：清除所有选中，让用户自由选
      const slots = this.data.timeSlots.map(s => ({ ...s, selected: false }));
      this.setData({ timeSlots: slots, selectedHours: 0, totalPrice: 0 });
      return;
    }

    // 自动选中从第一个可用时间段开始的连续N小时
    const slots = this.data.timeSlots.map(s => ({ ...s, selected: false }));
    let count = 0;
    for (let i = 0; i < slots.length && count < dur; i++) {
      if (slots[i].status !== 'booked') {
        slots[i].selected = true;
        count++;
      }
    }
    this.setData({ timeSlots: slots });
    this.recalculate();
  },

  // ========== 时间格子 ==========

  generateTimeSlots() {
    const now = new Date();
    const isToday = this.data.selectedDate === this.data.dates[0];
    const currentHour = isToday ? now.getHours() : 0;
    const currentMin = isToday ? now.getMinutes() : 0;
    const price = this.data.selectedRoom.pricePerHour || 15;
    const bookedHours = this.getBookedHoursForRoom(this.data.selectedRoom.id || 1);

    let startHour = isToday ? (currentMin > 0 ? currentHour + 1 : currentHour) : 6;
    if (startHour < 6 && !isToday) startHour = 6;

    let slots = [];
    for (let h = startHour; h < 24; h++) {
      const hNext = h + 1;
      const timeRange = `${String(h).padStart(2,'0')}:00-${String(hNext === 24 ? 0 : hNext).padStart(2,'0')}:00`;
      const booked = isToday && bookedHours.includes(h);
      slots.push({
        hour: h,
        time: `${String(h).padStart(2,'0')}:00`,
        timeRange,
        price,
        status: booked ? 'booked' : 'available',
        selected: false
      });
    }

    this.setData({ timeSlots: slots, selectedHours: 0, totalPrice: 0 });
  },

  toggleSlot(e) {
    const index = e.currentTarget.dataset.index;
    const slots = this.data.timeSlots;
    if (slots[index].status === 'booked') return;
    slots[index].selected = !slots[index].selected;
    this.setData({ timeSlots: slots, selectedDuration: 0 });
    this.recalculate();
  },

  recalculate() {
    const { timeSlots, roomCount, bookingMode, packages, selectedPackageIdx } = this.data;
    if (bookingMode === 'time') {
      const selected = timeSlots.filter(s => s.selected);
      const hours = selected.length;
      const pricePerHour = this.data.selectedRoom.pricePerHour || 15;
      this.setData({
        selectedHours: hours,
        totalPrice: (hours * pricePerHour * roomCount).toFixed(2)
      });
    } else if (bookingMode === 'package' && selectedPackageIdx >= 0) {
      const pkg = packages[selectedPackageIdx];
      this.setData({
        selectedHours: pkg.hours,
        totalPrice: (pkg.price * roomCount).toFixed(2)
      });
    }
  },

  // ========== 套餐 ==========

  generatePackages(room) {
    const packages = [
      { id: 1, name: '4小时套餐', hours: 4, price: 69.9 },
      { id: 2, name: '5小时套餐', hours: 5, price: 79 },
      { id: 3, name: '6小时套餐', hours: 6, price: 88 }
    ];
    this.setData({
      packages,
      packageNames: ['请选择套餐', ...packages.map(p => `${p.name}  ${p.price}元`)]
    });
  },

  selectPackage(e) {
    this.setData({ selectedPackageIdx: e.currentTarget.dataset.index });
    this.recalculate();
  },

  onPackageSelect(e) {
    const idx = parseInt(e.detail.value) - 1;
    this.setData({ selectedPackageIdx: idx < 0 ? -1 : idx });
    if (idx < 0) this.setData({ selectedHours: 0, totalPrice: 0 });
    else this.recalculate();
  },

  // ========== 操作 ==========

  confirmBooking() {
    if (this.data.selectedHours <= 0) {
      wx.showToast({ title: '请选择时间', icon: 'none' });
      return;
    }
    const userId = app.globalData.userId;
    if (!userId) {
      wx.showToast({ title: '请先登录', icon: 'none' });
      return;
    }

    const { selectedRoom, selectedDate, timeSlots, roomCount, totalPrice, selectedHours } = this.data;
    const selected = timeSlots.filter(s => s.selected).sort((a, b) => a.hour - b.hour);
    let startTime = '', endTime = '';
    if (selected.length > 0) {
      startTime = selected[0].time;
      endTime = `${String(selected[selected.length - 1].hour + 1).padStart(2, '0')}:00`;
    }

    wx.showModal({
      title: '确认预订',
      content: `${selectedRoom.name} × ${roomCount}间\n${selectedDate} ${startTime}-${endTime}\n${selectedHours}小时，共 ¥${totalPrice}`,
      success: (res) => { if (res.confirm) this.submitBooking(); }
    });
  },

  submitBooking() {
    wx.showLoading({ title: '提交中...' });
    const { selectedRoom, merchantId, selectedDate, timeSlots, roomCount } = this.data;

    if (merchantId) {
      const selected = timeSlots.filter(s => s.selected).sort((a, b) => a.hour - b.hour);
      roomApi.createBooking({
        merchantId, resourceId: selectedRoom.id, date: selectedDate,
        startTime: selected.length > 0 ? selected[0].time : '', quantity: roomCount
      }).then(() => {
        wx.hideLoading();
        wx.showToast({ title: '预订成功', icon: 'success' });
        this.setData({ showBooking: false });
      }).catch(err => {
        wx.hideLoading();
        wx.showToast({ title: err.message || '预订失败', icon: 'none' });
      });
    } else {
      setTimeout(() => {
        wx.hideLoading();
        wx.showToast({ title: '预订成功', icon: 'success' });
        this.setData({ showBooking: false });
      }, 1000);
    }
  },

  goToRecharge() {
    wx.navigateTo({ url: '/pages/recharge/recharge' });
  },

  callStore() {
    if (this.data.store.phone) wx.makePhoneCall({ phoneNumber: this.data.store.phone });
  },

  openMap() {
    const s = this.data.store;
    if (s.latitude && s.longitude) {
      wx.openLocation({ latitude: parseFloat(s.latitude), longitude: parseFloat(s.longitude), name: s.name, address: s.address });
    }
  }
});
