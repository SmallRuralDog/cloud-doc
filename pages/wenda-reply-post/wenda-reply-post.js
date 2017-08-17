
Page({
  data: {
    id: null,
    disabled: true
  },
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
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
      wx.request({
        url: getApp().api.v3_wenda_reply_post,
        method: 'post',
        header: {
          'Authorization': 'Bearer ' + getApp().user.ckLogin()
        },
        data: {
          id: this.data.id,
          content: content
        }, success: res => {
          if (res.data.status_code == 200) {
            wx.showToast({
              title: res.data.message
            })
            setTimeout(() => {
              wx.navigateBack()
            }, 1500);

          } else {
            wx.showToast({
              title: res.data.message,
            })
            setTimeout(() => {
              wx.navigateBack()
            }, 1500);
          }
        }, fail: error => {
          wx.showToast({
            title:'请求失败'
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