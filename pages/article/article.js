// article.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tag_id:0,
    tag_name:'',
    swiper: [],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    data: {},
    page: 1,
    class_id: 0,
    more_data: "加载更多中..",
    no_more: false,
    no_data: false,
    more: false,
    ls_load: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    let tag_id = option.tag_id
    let tag_name = option.tag_name
    this.setData({
      tag_id: tag_id,
      tag_name: tag_name
    })
    if(tag_id>0){
      wx.setNavigationBarTitle({
        title: tag_name,
      })
    }
    wx.showLoading({
      title: '加载中',
    })
    this.get_data()
  },
  get_data() {
    this.setData({
      is_load: true
    })
    wx.request({
      url: getApp().api.get_v3_article_index,
      data: {
        tag_id: this.data.tag_id,
        page: this.data.page
      },
      success: (res) => {
        if (res.data.current_page == 1) {
          this.setData({
            data: res.data,
            swiper: res.data.swiper
          })
        } else {
          let o_data = this.data.data;
          console.log(o_data)
          for (var index in res.data.data) {
            o_data.data.push(res.data.data[index])
          }
          this.setData({
            data: o_data
        
          })
        }

        getApp().set_page_more(this, res)

        wx.stopPullDownRefresh()
      }, complete: () => {
        wx.hideLoading()
      }
    })
  },
  onPullDownRefresh: function () {
    this.setData({
      page: 1,
      more: false,
      no_more: false
    })
    this.get_data()
  },

  onReachBottom: function () {
    if (this.data.more && !this.data.ls_load) {
      this.setData({
        page: this.data.page + 1,
        more_data: "正在加载更多.."
      })
      this.get_data()
    }
  },
  go_page: function (event) {
    let id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../article-page/article-page?id=' + id
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})