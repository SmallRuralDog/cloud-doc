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
    menu: [],
    list_menu: []
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
            title: res.data.data.title,
          })
          wx.updateShareMenu({

          })
          wx.hideLoading()
          if (this.data.menu.length <= 0) {
            this.get_menu()
          }

          /*wx.pageScrollTo({
            scrollTop: 0
          })*/


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
    return {
      title: this.data.info.title
    }
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
      url: getApp().api.get_v3_doc_page_menu,
      data: {
        doc_id: this.data.info.doc_id,
        page_id: this.data.page_id
      },
      success: (res) => {
        this.setData({
          menu: res.data.data.menu,
          list_menu: res.data.data.list_menu,
        })
        wx.stopPullDownRefresh()
      },
      complete: () => {
        wx.hideLoading();
      }
    })
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
  up_page() {
    let list_menu = this.data.list_menu
    let page_index = false
    list_menu.map((id, index) => {
      if (id == this.data.page_id) {
        page_index = index
      }
    })

    let up_id = list_menu[page_index - 1]

    if (up_id <= 0 || typeof (up_id) == 'undefined') {
      wx.showToast({
        title: '没有上一篇了',
      })
      return
    }

    this.setData({
      show_menu: false,
      page_id: up_id,
      article: '加载中'
    });
    wx.showLoading({
      title: '加载中',
    })
    this.get_data()
  },
  next_page() {
    let list_menu = this.data.list_menu
    let page_index = false
    list_menu.map((id, index) => {
      if (id == this.data.page_id) {
        page_index = index
      }
    })

    let up_id = list_menu[page_index + 1]

    if (up_id <= 0 || typeof (up_id) == 'undefined') {
      wx.showToast({
        title: '没有下一篇了',
      })
      return
    }

    this.setData({
      show_menu: false,
      page_id: up_id,
      article: '加载中'
    });
    wx.showLoading({
      title: '加载中',

    })
    this.get_data()
  },
  show_more() {
    wx.showActionSheet({
      itemList: ['收藏', '报错/举报', '文档主页'],
      success: (res) => {
        switch (res.tapIndex) {
          case 0:
            this.collect()
            break;
          case 1:
            wx.navigateTo({
              url: '../doc-back/doc-back?page_id=' + this.data.page_id
            })
            break;
          case 2:
            wx.redirectTo({
              url: '../doc-info/doc-info?doc_id=' + this.data.info.doc_id
            })
            break;
        }
      }
    })
  },
  collect() {
    getApp().user.isLogin(token => {
      wx.showLoading({
        title: '正在收藏',
      })
      wx.request({
        url: getApp().api.v3_user_like,
        header: {
          'Authorization': 'Bearer ' + getApp().user.ckLogin()
        },
        data: {
          'key': this.data.page_id,
          'type': 'doc-page'
        }, success: res => {
          if (res.data.status_code == 200) {
            if (res.data.data.attached.length > 0) {
              wx.showToast({
                title: '收藏成功',
              })
              try {
                getApp().pages.get('pages/user/user').get_data();
              } catch (e) {

              }
            } else {
              wx.showToast({
                title: '已收藏',
              })
            }
          } else {
            wx.showToast({
              title: '操作失败',
            })
          }
        }, complete: () => {
        }
      })
    })
  }
})