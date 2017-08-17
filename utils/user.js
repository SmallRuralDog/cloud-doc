class user {
  /**
   * 检测是否登录 无操作
   */
  ckLogin() {
    try {
      let AuthToken = wx.getStorageSync('AuthToken')
      if (AuthToken) {
        return AuthToken
      } else {
        throw false;
      }
    } catch (e) {
      return false
    }
  }
  /**
   * 检测用户是否登录，未登录进行登录操作
   */
  isLogin(cb) {
    try {
      let AuthToken = wx.getStorageSync('AuthToken')
      if (AuthToken) {
        typeof cb == "function" && cb(AuthToken)
      } else {
        throw false;
      }
    } catch (e) {
      this.getUser(res => {
        typeof cb == "function" && cb(res)
      })
    }
  }

  getUser(cb) {
    var that = this
    this.getUserInfo(function (info, code) {
      that.goLogin(code, info, function (userInfo) {
        typeof cb == "function" && cb(userInfo)
      });
    });
  }

  goLogin(code, res, cb) {
    wx.showNavigationBarLoading()
    wx.request({
      url: getApp().api.login,
      data: {
        code: code,
        encryptedData: res.encryptedData,
        iv: res.iv
      },
      method: 'POST',
      success: function (re) {
        if (re.data.status_code == 200) {
          //console.log(re.data)
          wx.setStorageSync('UserInfo', re.data.data)
          wx.setStorageSync('AuthToken', re.data.data.token)
          typeof cb == "function" && cb(re.data.data.token)
        } else {
          wx.showModal({
            content: '登录失败',
          })
        }
      },
      complete: function () {
        wx.hideNavigationBarLoading();
        wx.hideLoading();
      }
    })
  }
  /**
   * 获取微信用户信息
   */
  getUserInfo(cb) {
    var that = this

    console.log("getUserInfo")
    //调用登录接口
    wx.login({
      success: function (res) {
        var code = res.code;
        wx.getUserInfo({
          success: function (res) {
            typeof cb == "function" && cb(res, code)
          },
          fail: function (res) {
            wx.showModal({
              content: '您拒绝了用户授权，如需重新授权，请到个人中心点击立即登录按钮授权！',
              success: function (res) {
                if (res.confirm) {
                  wx.switchTab({
                    url: '/pages/user/user',
                  })
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
          }
        })
      }
    })
  }
}
module.exports = user;