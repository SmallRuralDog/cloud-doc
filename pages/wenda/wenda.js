Page({
  data: {
    show_page: false,
    data: {},
    page: 1,
    class_id: 0,
    more_data: "加载更多中..",
    no_more: false,
    no_data: false,
    more: false,
    ls_load: false
  },
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    this.get_data()
  },
  get_data() {
    this.setData({
      is_load: true
    })
    wx.request({
      url: getApp().api.v3_wenda_index,
      header: {
        'Authorization': 'Bearer ' + getApp().user.ckLogin()
      },
      data: {
        page: this.data.page
      },
      success: res => {
        if (res.data.current_page == 1) {
          this.setData({
            data: res.data,
            show_page: true
          })
        } else {
          let o_data = this.data.data;
          for (var index in res.data.data) {
            o_data.data.push(res.data.data[index])
          }
          this.setData({
            data: o_data
          })
        }
        getApp().set_page_more(this, res)
        wx.stopPullDownRefresh()
      }, complete: res => {
        wx.hideLoading()
      }
    })
  },
  onPullDownRefresh: function () {
    this.setData({
      page: 1,
      more: false,
      no_more: false
    })
    this.get_data()
  },
  onReachBottom: function () {
    if (this.data.more && !this.data.ls_load) {
      this.setData({
        page: this.data.page + 1,
        more_data: "正在加载更多.."
      })
      this.get_data()
    }
  },
  onShareAppMessage: function () {

  }
})