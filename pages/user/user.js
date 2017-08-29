// user.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page_show: false,
    is_login: false,
    token: getApp().user.ckLogin(),
    user: [],
    user_data: {
      scan_code_title: '扫一扫',
      doc: [],
      doc_page: []
    },
    show_tab: 1
  },
  onLoad: function (options) {
    getApp().pages.add(this);
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    if (getApp().user.ckLogin()) {
      wx.showLoading({
        title: '加载中',
      })
      this.get_data()
    } else {
      this.setData({
        page_show: true
      })
    }
  },
  onShow: function () {
    this.setData({
      is_login: getApp().user.ckLogin()
    })
  },
  login() {
    getApp().user.isLogin(token => {
      console.log(token)
      this.setData({
        token: token
      })
      wx.showLoading({
        title: '加载中',
      })
      this.get_data()
    })
  },
  getuserinfo(res) {
    if (res.detail.errMsg == "getUserInfo:ok") {
      this.login()
    }
  },
  get_data() {
    wx.request({
      url: getApp().api.get_v3_user_index,
      header: {
        'Authorization': 'Bearer ' + getApp().user.ckLogin()
      },
      data: {

      }, success: res => {
        console.log(res)
        if (res.data.status_code == 200) {
          this.setData({
            page_show: true,
            is_login: true,
            user: res.data.data.user,
            user_data: res.data.data.user_data,
          })
        }

      }, fail: error => {
      }
      , complete: res => {
        wx.hideLoading()
        wx.stopPullDownRefresh()
      }
    })
  },
  scan_code() {
    getApp().user.isLogin(token => {
      if (this.data.user.length <= 0) {
        this.get_data()
      }
      wx.scanCode({
        onlyFromCamera: true,
        success: res => {
          let data = res.result
          var obj = JSON.parse(data);
          if (obj.type == 'login') {
            this.scan_login(obj.key)
          }
        },
        fail: function (res) {

        },
        complete: function (res) {

        },
      })
    })
  },
  scan_login(key) {
    wx.showModal({
      content: '是否登录网页版？',
      success: res => {
        if (res.confirm) {
          wx.showLoading({
            title: '正在登录',
          })
          wx.request({
            url: getApp().api.v3_scan_code_login,
            header: {
              'Authorization': 'Bearer ' + getApp().user.ckLogin()
            },
            data: {
              key: key
            }, success: res => {
              if (res.data.status_code == 200) {
                wx.showToast({
                  title: '登录成功',
                })
              } else {
                wx.showToast({
                  title: res.data.message,
                })
              }
            }, complete: res => {

            }
          })
        }
      }
    })
  },
  del_my_doc: function (event) {
    let id = event.currentTarget.dataset.id;
    getApp().user.isLogin(token => {
      wx.showLoading({
        title: '',
      })
      wx.request({
        url: getApp().api.v3_user_follow_cancel,
        header: {
          'Authorization': 'Bearer ' + getApp().user.ckLogin()
        },
        data: {
          'key': id,
          'type': 'doc'
        }, success: res => {
          if (res.data.status_code == 200) {
            this.get_data()
          } else {

          }
        }, complete: res => {
          wx.hideLoading()
        }
      })
    })

  },
  edit_show: function () {
    this.setData({
      edit_show: !this.data.edit_show
    })
  },
  set_tab(event) {
    this.setData({
      show_tab: event.currentTarget.dataset.type
    })
  },
  un_collect(event) {
    let id = event.currentTarget.dataset.id
    getApp().user.isLogin(token => {
      wx.showLoading({
        title: '正在删除',
      })
      wx.request({
        url: getApp().api.v3_user_like,
        header: {
          'Authorization': 'Bearer ' + getApp().user.ckLogin()
        },
        data: {
          'key': id,
          'type': 'doc-page',
          'act':'unlike'
        }, success: res => {
          if (res.data.status_code == 200) {
            if (res.data.data == 1) {
              wx.showToast({
                title: '删除成功',
              })
              this.get_data()
            } else {
              wx.showToast({
                title: '已删除',
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