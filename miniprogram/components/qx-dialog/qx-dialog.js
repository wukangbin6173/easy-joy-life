Component({
  properties: {
    dialog: {
      type: Object,
      value: {
        visible: false
      },
      observer(value) {
        if (value && value.visible) {
          this.setData({
            inputValue: value.inputValue || ''
          });
        }
      }
    }
  },

  data: {
    inputValue: ''
  },

  methods: {
    noop() {},

    onInput(e) {
      this.setData({
        inputValue: e.detail.value
      });
    },

    onConfirm() {
      this.triggerEvent('confirm', {
        content: this.data.inputValue
      });
    },

    onCancel() {
      this.triggerEvent('cancel');
    }
  }
});
