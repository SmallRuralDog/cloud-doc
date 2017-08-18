// doc-page.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page_id: {},
    article: {},
    info: [],
    read_type: 'light',
    can_type: wx.canIUse('setNavigationBarColor'),
    font_size: 28,
    show_set_font: false,
    show_menu: false,
    menu: []
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

    wx.getStorage({
      key: 'font_size',
      success: res => {
        this.setData({
          font_size: res.data
        })
      },
    })

    wx.showLoading({
      title: '加载中',
    })
    this.get_data()
  },
  go_page: function (event) {
    let page_id = event.currentTarget.dataset.id;
    this.setData({
      show_menu: false,
      page_id: page_id
    });
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
            article: data,
            info: res.data.data
          });
          wx.setNavigationBarTitle({
            title: res.data.data.doc_title + '-' + res.data.data.title,
          })
          wx.hideLoading()
          if (this.data.menu.length <= 0) {
            this.get_menu()
          }
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
      wx.showModal({
        content: '您当前微信版本不支持切换，请升级最新版！'
      })
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
      article: data,
      read_type: data.theme
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

  onPullDownRefresh: function () {

  },

  onReachBottom: function () {

  },
  onShareAppMessage: function () {

  },
  previewImage: function (event) {
    let src = event.currentTarget.dataset.src;
    wx.previewImage({
      current: src,
      urls: [src]
    })
  },
  sliderchange(event) {
    let value = event.detail.value

    wx.setStorageSync('font_size', value)

    this.setData({
      font_size: value
    })
  },
  main_click() {
    this.setData({
      show_set_font: false,
      show_menu: false,
    })
  },
  set_font() {
    this.setData({
      show_set_font: !this.data.show_set_font
    })
  },
  show_menu() {
    if (this.data.menu.length <= 0) {
      this.get_menu()
    }
    this.setData({
      show_menu: !this.data.show_menu
    })
  },
  get_menu() {
    wx.request({
      url: getApp().api.get_v3_doc_page,
      data: {
        doc_id: this.data.info.doc_id,
        page_id:this.data.page_id
      },
      success: (res) => {
        this.setData({
          menu: res.data.data
        })
        wx.stopPullDownRefresh()
      },
      complete: () => {
        wx.hideLoading();
      }
    })
  }
})