Page({
  data: {
    id: 0,
    title: '',
    article: {},
    read_type: 'light',
    can_type: wx.canIUse('setNavigationBarColor')
  },
  onLoad: function (option) {
    let id = option.id
    this.setData({
      id: id
    })
    wx.showLoading({
      title: '加载中',
    })
    this.get_data()
  },
  get_data() {
    wx.request({
      url: getApp().api.get_v3_article_page,
      data: {
        id: this.data.id
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
            article: data,
            title: res.data.data.title
          });
          wx.setNavigationBarTitle({
            title: res.data.data.title,
          })
          this.s
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
  onShareAppMessage: function () {
    return {
      title: this.data.title
    }
  },
  previewImage: function (event) {
    let src = event.currentTarget.dataset.src;
    wx.previewImage({
      current: src,
      urls: [src]
    })
  }
})