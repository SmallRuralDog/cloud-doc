//app.js
const Towxml = require('/towxml/main');
const HOST = "https://cloud-doc.leyix.com";
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  towxml: new Towxml(),
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.getUserInfo({
        withCredentials: false,
        success: function (res) {
          that.globalData.userInfo = res.userInfo
          typeof cb == "function" && cb(that.globalData.userInfo)
        }
      })
    }
  },
  globalData: {
    userInfo: null
  },
  set_page_more(tis, res) {
    if (res.data.total <= 0) {
      tis.setData({
        no_data: true,
        no_more: false,
        more: false,
      })
    }
    if (res.data.last_page == tis.data.page) {
      tis.setData({
        no_more: true,
        more: false,
        more_data: "没有更多了"
      })
    } else if (res.data.last_page > tis.data.page) {
      tis.setData({
        more: true,
      })
    }
    tis.setData({
      is_load: false
    })
  },
  api: {
    get_list: HOST + "/api/list",
    get_info: HOST + "/api/info",
    get_menu: HOST + "/api/menu",
    get_page: HOST + "/api/page",
    get_v2_index: HOST + "/api/v2/index",
    get_v2_class: HOST + "/api/v2/class-list",
    get_v2_class_doc: HOST + "/api/v2/list", 
    get_v2_doc_page: HOST + "/api/v2/doc-page",
    get_v2_page: HOST + "/api/v2/page",
    get_v2_my_doc: HOST + "/api/v2/get-my-doc",
    get_v2_search: HOST + "/api/v2/search",
    get_v2_search_index: HOST + "/api/v2/search-index",
    get_v2_search_tip: HOST + "/api/v2/title-tip",

    get_v3_index: HOST + "/api/v3/index",
    get_v3_article_index: HOST + "/api/v3/article-index",
    get_v3_article_page: HOST + "/api/v3/article-page",
  }
})
