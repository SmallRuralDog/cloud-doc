//app.js
const Towxml = require('/towxml/main');
const User = require('/utils/user');
const Pages = require('/utils/pages');
const HOST = "https://cloud-doc.leyix.com";
//const HOST = "http://192.168.10.54:91";

App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  towxml: new Towxml(),
  user: new User(),
  pages: new Pages(),
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
    get_v3_info: HOST + "/api/v3/info",
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

    /**
     * V3版本接口
     */
    get_v3_index: HOST + "/api/v3/index",

    get_v3_2_doc_info: HOST + "/api/v3/doc-info-2",
    get_v3_doc_page: HOST + "/api/v3/doc-page",
    get_v3_article_index: HOST + "/api/v3/article-index",
    get_v3_article_page: HOST + "/api/v3/article-page",
    get_v3_class_doc: HOST + "/api/v3/class-list",
    get_v3_user_index: HOST + "/api/v3/user-index",
    v3_user_follow: HOST + "/api/v3/user-follow",
    v3_user_like: HOST + "/api/v3/user-like",
    v3_user_follow_cancel: HOST + "/api/v3/user-follow-cancel",

    login: HOST + "/api/v3/login",
    v3_scan_code_login: HOST + "/api/v3/scan-login",

    //问答
    v3_wenda_index: HOST + "/api/v3/wenda-index",
    v3_wenda_page: HOST + "/api/v3/wenda-page",
    v3_wenda_upload_image: HOST + "/api/v3/wenda-upload-image",
    v3_wenda_post: HOST + "/api/v3/wenda-post",
    v3_wenda_reply_post: HOST + "/api/v3/wenda-reply-post",
  }
})
