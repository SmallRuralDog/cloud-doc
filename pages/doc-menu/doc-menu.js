// doc-menu.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    doc_id: 0,
    data: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    let id = option.doc_id
    this.setData({
      doc_id: id
    })
    wx.showLoading({
      title: '加载中',
    })
    this.get_data()
  },
  get_data() {
    wx.request({
      url: getApp().api.get_v2_doc_page,
      data: { doc_id: this.data.doc_id },
      success: (res) => {
        this.setData({
          data: res.data.data
        })
        wx.stopPullDownRefresh()
      },
      complete:()=>{
        wx.hideLoading();
      }
    })
  },
  go_page: function (event) {
    let page_id = event.currentTarget.dataset.id;
    console.log(page_id)
    wx.navigateTo({
      url: '../doc-page/doc-page?page_id=' + page_id
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
    this.get_data()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})