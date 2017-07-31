// doc-page.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page_id: {},
    article: {},
    read_type: 'light',
    can_type: wx.canIUse('setNavigationBarColor')
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {


    let id = option.page_id
    this.setData({
      page_id: id
    });
    let s_type = wx.getStorageSync('read_type');
    if (s_type === 'light' || s_type === 'dark') {
      this.setData({
        read_type: s_type
      })
    }
    wx.showLoading({
      title: '加载中',
    })
    this.get_data()
  },
  get_data() {
    wx.request({
      url: getApp().api.get_v2_page,
      data: {
        page_id: this.data.page_id
      },
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        try {
          let data = getApp().towxml.toJson(res.data.data.content, 'markdown');
          data.theme = this.data.read_type;
          this.set_nav_type(this.data.read_type)
          this.setData({
            article: data
          });
          wx.setNavigationBarTitle({
            title: res.data.data.doc_title + '-' + res.data.data.title,
          })

          wx.hideLoading()
        } catch (error) {
          console.log(error)
          wx.hideLoading()
          wx.showModal({
            title: '提示',
            content: '文档解析失败',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
                wx.navigateBack()
              }
            }
          })
        }
      },
      fail: (error) => {
        wx.hideLoading()
      },
      complete: () => {

      }
    })
  },
  change_read_type() {
    if (!this.data.can_type) {
      return;
    }

    let data = this.data.article
    if (data.theme == 'dark') {
      data.theme = 'light'
    } else {
      data.theme = 'dark'
    }
    this.set_nav_type(data.theme)
    wx.setStorageSync('read_type', data.theme)
    this.setData({
      article: data
    })
  },
  set_nav_type(t) {
    if (t === 'dark') {
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#000000',
        animation: {
          duration: 300,
          timingFunc: 'easeIn'
        }
      })
    } else if (t === 'light') {
      wx.setNavigationBarColor({
        frontColor: '#000000',
        backgroundColor: '#ffffff',
        animation: {
          duration: 300,
          timingFunc: 'easeIn'
        }
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

  }
})