
Page({
  data: {
    id: null,
    disabled: true,
    d_type: 1,
    items: [
      { name: '1', value: '报错', checked: 'true' },
      { name: '2', value: '举报' },
    ]
  },
  onLoad: function (options) {
    this.setData({
      id: options.page_id
    })
  },
  radioChange: function (e) {
    this.setData({
      d_type: e.detail.value
    })
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },
  reply_input: function (e) {
    if (e.detail.value.length > 0) {
      this.setData({
        disabled: false
      })
    } else {
      this.setData({
        disabled: true
      })
    }
  },
  bindFormSubmit: function (e) {
    var content = e.detail.value.textarea;
    getApp().user.isLogin(token => {
      wx.showLoading({
        title: '提交中',
      })
      wx.request({
        url: getApp().api.v3_doc_back,
        method: 'post',
        header: {
          'Authorization': 'Bearer ' + getApp().user.ckLogin()
        },
        data: {
          'id': this.data.id,
          'content': content,
          'type': this.data.d_type
        }, success: res => {
          wx.showToast({
            title: res.data.message
          })
          setTimeout(() => {
            wx.navigateBack()
          }, 1500);
        }, fail: error => {
          wx.showToast({
            title: '请求失败'
          })
          setTimeout(() => {
            wx.navigateBack()
          }, 1500);
        }, complete: () => {

        }
      })
    })
  }
})