// my-doc.js
let ArrayList = require("../../utils/arrayList.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: {},
    old_my_doc: [],
    no_data: false,
    edit_show:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let old_my_doc = wx.getStorageSync("old_my_doc");

    if (old_my_doc == '') {
      old_my_doc = { arr: [] };
    }
    let list = new ArrayList(old_my_doc.arr);
    list.setType("number")

    this.setData({
      old_my_doc: list
    })

    wx.showLoading({
      title: '加载中',
    })
    this.get_data()
  },
  get_data() {
    wx.request({
      url: getApp().api.get_v2_my_doc,
      method: 'post',
      data: { ids: this.data.old_my_doc.toArray() },
      success: (res) => {
        this.setData({
          data: res.data
        })
        if (res.data.length > 0) {
          this.setData({
            no_data: false
          })
        } else {
          this.setData({
            no_data: true
          })
        }
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
  del_my_doc: function (event) {
    let id = event.currentTarget.dataset.id;
    let o = this.data.old_my_doc;
    o.remove(id);
    this.setData({
      old_my_doc: o
    })
    wx.setStorage({
      key: 'old_my_doc',
      data: o,
    })
    this.get_data()
  },
  edit_show:function(){
    this.setData({
      edit_show: !this.data.edit_show
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
    let old_my_doc = wx.getStorageSync("old_my_doc");
    if (old_my_doc == '') {
      old_my_doc = { arr: [] };
    }
    let list = new ArrayList(old_my_doc.arr);
    list.setType("number")

    this.setData({
      old_my_doc: list,
      edit_show: false
    })
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