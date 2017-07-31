//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    data: {},
    page: 1,
    more_data: "加载更多中..",
    no_more: false,
    no_data: false,
    more: false,
    ls_load: false
  },
  //事件处理函数
  go_info: function (event) {
    let id = event.currentTarget.dataset.id;
    console.log(id)

    wx.navigateTo({
      url: '../doc-info/doc-info?doc_id=' + id
    })
  },
  onLoad: function () {
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
      url: getApp().api.get_v2_index,
      data: {
        page: this.data.page
      },
      success: (res) => {
        if (res.data.current_page == 1) {
          this.setData({
            data: res.data
          })
        } else {
          let o_data = this.data.data;
          console.log(o_data)
          for (var index in res.data.data) {
            o_data.data.push(res.data.data[index])
          }
          this.setData({
            data: o_data
          })
        }

        getApp().set_page_more(this, res)

        wx.stopPullDownRefresh()
      }, complete: () => {
        wx.hideLoading()
      }
    })
  },
  go_search() {
    wx.navigateTo({
      url: '../doc-search/doc-search',
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      page: 1,
      more: false,
      no_more: false,
      no_data: false
    })
    this.get_data()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.more && !this.data.ls_load) {
      this.setData({
        page: this.data.page + 1,
        more_data: "正在加载更多.."
      })
      this.get_data()
    }

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
