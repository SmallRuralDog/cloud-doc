// doc-class.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    this.get_data()

   
  },
  get_data() {
    wx.request({
      url: getApp().api.get_v2_class,
      success: (res) => {
        this.setData({
          data: res.data
        })
      },
      complete: () => {
        wx.hideLoading()
        wx.stopPullDownRefresh()
      }
    })
  },
  go_class_list(event){
    let id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../doc-class-list/doc-class-list?class_id=' + id,
    })
  },
  go_search(){
    wx.navigateTo({
      url: '../doc-search/doc-search',
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