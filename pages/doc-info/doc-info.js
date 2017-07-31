// doc-info.js
let ArrayList = require("../../utils/arrayList.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    doc_id: 0,
    data: {},
    my_doc: [],
    is_add: true,
    add_text:"已加入"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {

    let old_my_doc = wx.getStorageSync("old_my_doc");
    if (old_my_doc == '') {
      old_my_doc = { arr: [] };
    }
    let list = new ArrayList(old_my_doc.arr);
    list.setType("number")
    let id = option.doc_id
    this.setData({
      doc_id: id,
      my_doc: list
    })
    wx.showLoading({
      title: '加载中',
    })
    this.get_data()

  },
  get_data() {
    wx.request({
      url: getApp().api.get_info,
      data: { doc_id: this.data.doc_id },
      success: (res) => {
        this.setData({
          data: res.data.data
        })
        let boolb = this.data.my_doc.contains(res.data.data.id);
        if (!boolb) {
          this.setData({
            is_add: false,
            add_text:"加入档库"
          })
        }
        wx.setNavigationBarTitle({
          title: res.data.data.title
        })
      }, complete: () => {
        wx.hideLoading()
      }
    })
  },
  go_menu: function (event) {
    let doc_id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../doc-menu/doc-menu?doc_id=' + doc_id
    })
  },
  add_my_doc: function (event) {
    let doc_id = event.currentTarget.dataset.id;
    let bool = this.data.my_doc.contains(doc_id);
    console.log(bool)
    if (!bool) {
      console.log(this.data.my_doc)
      this.data.my_doc.add(doc_id)
      wx.setStorageSync("old_my_doc", this.data.my_doc)
      this.setData({
        is_add: true,
        add_text:"已加入"
      })
    }


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
    return {
      title: "云档-免费在线文档"
    }
  }
})