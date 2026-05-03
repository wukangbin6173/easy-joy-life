const { roomApi } = require('../../utils/api.js');

const app = getApp();

const WEEK_DAYS = [
  { value: 1, label: '周一' },
  { value: 2, label: '周二' },
  { value: 3, label: '周三' },
  { value: 4, label: '周四' },
  { value: 5, label: '周五' },
  { value: 6, label: '周六' },
  { value: 7, label: '周日' }
];

const STATUS_OPTIONS = [
  { value: 0, label: '空闲', bookable: true },
  { value: 1, label: '预订中', bookable: true },
  { value: 2, label: '占用中', bookable: true },
  { value: 3, label: '维护中', bookable: false },
  { value: 4, label: '停用', bookable: false },
  { value: 5, label: '休息中', bookable: false }
];

function todayDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function decodeOption(value, fallback = '') {
  if (!value) return fallback;
  try {
    return decodeURIComponent(value);
  } catch (e) {
    return value;
  }
}

Page({
  data: {
    merchantId: '',
    storeId: '',
    resourceId: '',
    resourceName: '房间排班',
    mode: 'weekly',
    weekDays: WEEK_DAYS,
    selectedDay: 1,
    scheduleDate: todayDate(),
    isEnabled: true,
    isRestDay: false,
    timeSlots: [
      { start: '09:00', end: '22:00' }
    ],
    statusOptions: STATUS_OPTIONS,
    selectedStatusIndex: '',
    selectedStatusLabel: '',
    changeReason: '',
    batchResourceIdsText: '',
    previewDate: todayDate(),
    durationMinutes: 60,
    slotStepMinutes: 60,
    availableSlots: [],
    availableSlotsText: '保存排班后会刷新可约时间',
    loadingSlots: false,
    scheduleResultText: '',
    savingSchedule: false,
    savingStatus: false
  },

  onLoad(options = {}) {
    const merchantId = options.merchantId ||
      (app && typeof app.getActiveMerchantId === 'function' ? app.getActiveMerchantId() : '');
    const resourceId = options.resourceId || options.roomId || '';
    const resourceName = decodeOption(options.resourceName || options.roomName, '房间排班');

    this.setData({
      merchantId,
      storeId: options.storeId || '',
      resourceId,
      resourceName,
      batchResourceIdsText: resourceId ? `${resourceId}` : ''
    });

    wx.setNavigationBarTitle({ title: '房间排班' });
    if (merchantId && resourceId) this.refreshAvailableSlots();
  },

  switchMode(e) {
    const mode = e.currentTarget.dataset.mode;
    if (!mode || mode === this.data.mode) return;
    this.setData({ mode }, () => this.refreshAvailableSlots());
  },

  selectDay(e) {
    const value = Number(e.currentTarget.dataset.value);
    if (!value) return;
    this.setData({ selectedDay: value });
  },

  onDateChange(e) {
    this.setData({
      scheduleDate: e.detail.value,
      previewDate: this.data.mode === 'date' ? e.detail.value : this.data.previewDate
    }, () => this.refreshAvailableSlots());
  },

  onPreviewDateChange(e) {
    this.setData({ previewDate: e.detail.value }, () => this.refreshAvailableSlots());
  },

  onDurationInput(e) {
    this.setData({ durationMinutes: e.detail.value });
  },

  onStepInput(e) {
    this.setData({ slotStepMinutes: e.detail.value });
  },

  onBatchIdsInput(e) {
    this.setData({ batchResourceIdsText: e.detail.value });
  },

  onEnabledChange(e) {
    this.setData({ isEnabled: !!e.detail.value });
  },

  onRestDayChange(e) {
    this.setData({ isRestDay: !!e.detail.value });
  },

  onStartTimeChange(e) {
    this.updateTimeSlot(Number(e.currentTarget.dataset.index), 'start', e.detail.value);
  },

  onEndTimeChange(e) {
    this.updateTimeSlot(Number(e.currentTarget.dataset.index), 'end', e.detail.value);
  },

  updateTimeSlot(index, key, value) {
    const timeSlots = this.data.timeSlots.slice();
    if (!timeSlots[index]) return;
    timeSlots[index] = {
      ...timeSlots[index],
      [key]: value
    };
    this.setData({ timeSlots });
  },

  addTimeSlot() {
    const timeSlots = this.data.timeSlots.slice();
    const last = timeSlots[timeSlots.length - 1] || { end: '18:00' };
    timeSlots.push({
      start: last.end || '09:00',
      end: '22:00'
    });
    this.setData({ timeSlots });
  },

  removeTimeSlot(e) {
    const index = Number(e.currentTarget.dataset.index);
    const timeSlots = this.data.timeSlots.slice();
    if (timeSlots.length <= 1) {
      this.setData({ timeSlots: [{ start: '09:00', end: '22:00' }] });
      return;
    }
    timeSlots.splice(index, 1);
    this.setData({ timeSlots });
  },

  onStatusChange(e) {
    const index = e.detail.value;
    const option = this.data.statusOptions[Number(index)];
    this.setData({
      selectedStatusIndex: index,
      selectedStatusLabel: option ? option.label : ''
    });
  },

  onReasonInput(e) {
    this.setData({ changeReason: e.detail.value });
  },

  saveSchedule() {
    if (!this.ensureRequiredIds()) return;
    const payload = this.buildSchedulePayload();
    if (!payload) return;
    const resourceIds = this.getTargetResourceIds();
    if (!resourceIds.length) {
      wx.showToast({ title: '请输入资源ID', icon: 'none' });
      return;
    }

    this.setData({ savingSchedule: true });
    const request = resourceIds.length > 1 || String(resourceIds[0]) !== String(this.data.resourceId)
      ? roomApi.batchSetSchedules({
        merchantId: Number(this.data.merchantId),
        resourceIds,
        schedule: payload
      })
      : roomApi.setSchedule(this.data.resourceId, this.data.merchantId, payload);

    request
      .then(res => {
        const resultText = this.formatScheduleResult(res, resourceIds.length);
        wx.showToast({ title: '排班已保存', icon: 'success' });
        this.setData({ scheduleResultText: resultText });
        this.refreshAvailableSlots();
      })
      .catch(err => {
        wx.showToast({ title: err.message || '保存失败', icon: 'none' });
      })
      .finally(() => {
        this.setData({ savingSchedule: false });
      });
  },

  saveStatus() {
    if (!this.ensureRequiredIds()) return;
    if (this.data.selectedStatusIndex === '') {
      wx.showToast({ title: '请选择房间状态', icon: 'none' });
      return;
    }
    const index = Number(this.data.selectedStatusIndex);
    const option = this.data.statusOptions[index];
    if (!option) {
      wx.showToast({ title: '请选择房间状态', icon: 'none' });
      return;
    }

    this.setData({ savingStatus: true });
    roomApi.updateStatus(this.data.resourceId, this.data.merchantId, {
      status: option.value,
      changeReason: this.data.changeReason
    })
      .then(() => {
        wx.showToast({ title: '状态已更新', icon: 'success' });
        this.refreshAvailableSlots();
      })
      .catch(err => {
        wx.showToast({ title: err.message || '更新失败', icon: 'none' });
      })
      .finally(() => {
        this.setData({ savingStatus: false });
      });
  },

  buildSchedulePayload() {
    const isDateMode = this.data.mode === 'date';
    const timeSlots = this.normalizeTimeSlots();
    if (!this.data.isRestDay && !timeSlots.length) {
      wx.showToast({ title: '请至少设置一个营业时间段', icon: 'none' });
      return null;
    }

    if (!this.data.isRestDay) {
      const invalid = timeSlots.some(slot => slot.start >= slot.end);
      if (invalid) {
        wx.showToast({ title: '结束时间必须晚于开始时间', icon: 'none' });
        return null;
      }
    }

    const payload = {
      scheduleType: isDateMode ? 2 : 1,
      isEnabled: this.data.isEnabled ? 1 : 0,
      isRestDay: this.data.isRestDay ? 1 : 0,
      timeSlots: this.data.isRestDay ? [] : timeSlots
    };

    if (isDateMode) {
      payload.scheduleDate = this.data.scheduleDate;
    } else {
      payload.dayOfWeek = this.data.selectedDay;
    }
    return payload;
  },

  normalizeTimeSlots() {
    return this.data.timeSlots
      .map(slot => ({
        start: slot.start,
        end: slot.end
      }))
      .filter(slot => slot.start && slot.end)
      .sort((a, b) => this.timeToMinutes(a.start) - this.timeToMinutes(b.start));
  },

  getTargetResourceIds() {
    const ids = this.parseResourceIds(this.data.batchResourceIdsText);
    return ids.length ? ids : this.parseResourceIds(this.data.resourceId);
  },

  parseResourceIds(value) {
    return [...new Set(String(value || '')
      .split(/[,\s，、]+/)
      .map(item => Number(item))
      .filter(item => Number.isFinite(item) && item > 0))];
  },

  refreshAvailableSlots() {
    if (!this.data.merchantId || !this.data.resourceId) return;
    const date = this.data.mode === 'date' ? this.data.scheduleDate : this.data.previewDate;
    const durationMinutes = this.normalizePositiveNumber(this.data.durationMinutes, 60);
    const slotStepMinutes = this.normalizePositiveNumber(this.data.slotStepMinutes, 60);

    this.setData({
      loadingSlots: true,
      availableSlotsText: '正在刷新可约时间'
    });

    roomApi.getAvailableSlots(this.data.merchantId, this.data.resourceId, date, {
      storeId: this.data.storeId || undefined,
      durationMinutes,
      slotStepMinutes
    })
      .then(res => {
        const availableSlots = this.normalizeAvailableSlots(res.data);
        this.setData({
          availableSlots,
          availableSlotsText: availableSlots.length
            ? `已同步 ${date} 的可约时间`
            : `${date} 暂无可约时间`
        });
      })
      .catch(err => {
        this.setData({
          availableSlots: [],
          availableSlotsText: err.message || '可约时间刷新失败'
        });
      })
      .finally(() => {
        this.setData({ loadingSlots: false });
      });
  },

  normalizeAvailableSlots(data) {
    const source = this.extractSlotList(data);
    return source.map(item => {
      if (!item) return null;
      if (typeof item === 'string') {
        const match = item.match(/(\d{1,2}:\d{2})\s*[-~至]\s*(\d{1,2}:\d{2})/);
        return match ? { start: match[1], end: match[2], statusText: '可约' } : { start: item, end: '', statusText: '可约' };
      }
      if (typeof item !== 'object') return null;
      const start = this.firstText(item.start, item.startTime, item.beginTime, item.begin);
      const end = this.firstText(item.end, item.endTime, item.finishTime, item.finish);
      const statusText = item.statusText || item.statusName || (item.available === false || item.isAvailable === false ? '不可约' : '可约');
      return { ...item, start, end, statusText };
    }).filter(item => item && (item.start || item.end));
  },

  extractSlotList(data) {
    if (Array.isArray(data)) return data;
    if (!data || typeof data !== 'object') return [];
    if (Array.isArray(data.list)) return data.list;
    if (Array.isArray(data.records)) return data.records;
    if (Array.isArray(data.slots)) return data.slots;
    if (Array.isArray(data.availableSlots)) return data.availableSlots;
    if (Array.isArray(data.timeSlots)) return data.timeSlots;
    if (data.data && data.data !== data) return this.extractSlotList(data.data);
    if (data.result && data.result !== data) return this.extractSlotList(data.result);
    return [];
  },

  normalizePositiveNumber(value, fallback) {
    const number = Number(value);
    return Number.isFinite(number) && number > 0 ? number : fallback;
  },

  formatScheduleResult(res, targetCount) {
    const data = res && res.data ? res.data : {};
    if (targetCount > 1 && data.total) {
      return `共 ${data.total} 个资源，成功 ${data.successCount || 0} 个，失败 ${data.failedCount || 0} 个`;
    }
    return `已保存 ${targetCount} 个资源的排班`;
  },

  firstText(...values) {
    for (const value of values) {
      if (value === undefined || value === null) continue;
      const text = String(value).trim();
      if (text) return text;
    }
    return '';
  },

  timeToMinutes(value) {
    const match = String(value || '').match(/^(\d{1,2}):(\d{2})$/);
    if (!match) return -1;
    return Number(match[1]) * 60 + Number(match[2]);
  },

  ensureRequiredIds() {
    if (!this.data.merchantId) {
      wx.showToast({ title: '缺少商户ID', icon: 'none' });
      return false;
    }
    if (!this.data.resourceId) {
      wx.showToast({ title: '缺少房间ID', icon: 'none' });
      return false;
    }
    return true;
  }
});
