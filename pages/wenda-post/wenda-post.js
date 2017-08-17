let ArrayList = require("../../utils/arrayList.js");
Page({
  data: {
    title: '',
    desc: '',
    disabled: true,
    is_load: false,
    pics: [],
    pics_array: [],
    ok_pics: [],
    source:'',
    source_id:0,
  },
  onLoad: function (options) {
    this.setData({
      source: options.source,
      source_id: options.source_id,
    })
    let list = new ArrayList();
    this.setData({
      pics: list,
      pics_array: list.toArray()
    })
  },
  bind_title(e) {
    if (e.detail.value.length > 5) {
      this.setData({
        title: e.detail.value,
        disabled: false
      })
    } else {
      this.setData({
        title: e.detail.value,
        disabled: true
      })
    }
  },
  bind_desc(e) {
    this.setData({
      desc: e.detail.value
    })
  },
  wenda_post() {
    getApp().user.isLogin(token => {
      this.setData({
        disabled: true,
        is_load: true,
      })
      console.log(this.data.pics_array.length)
      if (this.data.pics_array.length > 0) {
        this.data.pics_array.map((item, index) => {
          if (!item.upload) {//判断当前图片是否已经上传
            var pics_array = this.data.pics_array
            pics_array[index].upload = true
            pics_array[index].progress = 0
            this.setData({
              pics_array: pics_array
            })
            const uploadTask = wx.uploadFile({
              url: getApp().api.v3_wenda_upload_image,
              filePath: item.path,
              name: 'img',
              header: {
                'Authorization': 'Bearer ' + getApp().user.ckLogin()
              },
              formData: {
                data_id: 1,
                name: 'img',
                index: index
              }, success: res => {
                let obj = JSON.parse(res.data)
                this.data.ok_pics.push(obj.data)
                this.setData({
                  ok_pics: this.data.ok_pics
                })

                //所有图片上传完成
                if (this.data.ok_pics.length == this.data.pics_array.length) {
                  //开始提交文档数据
                  this.wenda_post_data(token)
                }
              }, fail: error => {//有图片上传失败
                var pics_array = this.data.pics_array
                pics_array[index].upload = false
                pics_array[index].progress = 0 //标记当前图片回到初始状态
                this.setData({
                  pics_array: pics_array,
                  disabled: false,
                  is_load: false,
                })
              }
            })
            if (wx.canIUse('uploadTask')) {//监听图片上传
              uploadTask.onProgressUpdate((res) => {
                var pics_array = this.data.pics_array
                pics_array[index].upload = true
                pics_array[index].progress = res.progress
                this.setData({
                  pics_array: pics_array
                })
              })
            }
          }else{
            //所有图片上传完成
            if (this.data.ok_pics.length == this.data.pics_array.length) {
              //开始提交文档数据
              this.wenda_post_data(token)
            }
          }

        })
      } else {
        this.wenda_post_data(token)
      }
    })
  },
  wenda_post_data(token) {
    wx.request({
      url: getApp().api.v3_wenda_post,
      method: 'post',
      header: {
        'Authorization': 'Bearer ' + getApp().user.ckLogin()
      },
      data: {
        parent_id: 0,
        res_id: 0,
        title: this.data.title,
        desc: this.data.desc,
        source: this.data.source,
        source_id: this.data.source_id,
        pics: this.data.ok_pics
      },
      success: res => {
        if (res.data.status_code == 200) {
          wx.showToast({
            title: res.data.message
          })
          setTimeout(() => {
            wx.navigateBack()
          }, 1500);

        } else {
          this.setData({
            disabled: false,
            is_load: false,
          })
        }
      }, fail: error => {
        this.setData({
          disabled: false,
          is_load: false,
        })
      }, complete: res => {

      }
    })
  },
  add_pic() {
    wx.chooseImage({
      count: 9 - this.data.pics_array.length,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        console.log(res)
        var tempFilePaths = res.tempFilePaths


        tempFilePaths.map(a => {
          this.data.pics.add(a)

        })

        var pics_array = new Array()
        this.data.pics.toArray().map(path => {
          pics_array.push({
            path: path,
            upload: false,
            progress: 0
          })
        })



        this.setData({
          pics: this.data.pics,
          pics_array: pics_array
        })
        console.log(this.data.pics_array)
      }
    })
  },
  show_pic(event) {
    let item = event.currentTarget.dataset.src;
    wx.previewImage({
      current: item,
      urls: this.data.pics_array,
    })
  },
  del_pic(event) {
    let item = event.currentTarget.dataset.src;
    wx.showActionSheet({
      itemList: ['删除'],
      success: (res) => {
        if (res.tapIndex == 0) {
          this.data.pics.remove(item);

          var pics_array = new Array()
          this.data.pics.toArray().map(path => {
            pics_array.push({
              path: path,
              upload: false,
              progress: 0
            })
          })
          this.setData({
            pics: this.data.pics,
            pics_array: pics_array
          })
        }
      },
      fail: (res) => {
        console.log(res.errMsg)
      }
    })
  },
  toDetail: function (event) {
    let that = this;
    var touchTime = that.data.touch_end - that.data.touch_start;
    if (touchTime < 350) {
      this.show_pic(event)
    } else {
      this.del_pic(event)
    }

  },
  mytouchstart: function (e) {
    let that = this;
    that.setData({
      touch_start: e.timeStamp
    })
  },
  mytouchend: function (e) {
    let that = this;
    that.setData({
      touch_end: e.timeStamp
    })
  }
})