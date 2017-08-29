// doc-class-list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: {},
    tag_id:0,
    page: 1,
    class_id: 0,
    more_data: "加载更多中..",
    no_more: false,
    no_data: false,
    more: false,
    ls_load: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    let id = option.class_id
    this.setData({
      class_id: id
    })
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
      url: getApp().api.get_v3_class_doc,
      data: {
        page: this.data.page,
        class_id: this.data.class_id
      },
      success: (res) => {
        if (res.data.current_page == 1) {
          this.setData({
            data: res.data,
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
  go_info: function (event) {
    let id = event.currentTarget.dataset.id;
    console.log(id)

    wx.navigateTo({
      url: '../doc-info/doc-info?doc_id=' + id
    })
  },
  go_page: function (event) {
    let id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../article-page/article-page?id=' + id
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      page: 1,
      more: false,
      no_more: false
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