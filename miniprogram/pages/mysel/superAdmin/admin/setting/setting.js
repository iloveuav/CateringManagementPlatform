// miniprogram/pages/admin/setting/setting.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    notice:'',
    logo:'',
    conpanyPic:'',
    companyEmail:'',
    CloudUrl:'',
    localLogo:'',
    localPic:'',

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  },



  // 设置公告
  noticeChange(e){
    this.setData({
     notice: e.detail.value,
    })
  },
  // 设置EMAIL
  emailChange(e){
    this.setData({
     email: e.detail.value,
    })
  },
  // 设置EMAIL 授权码
  emailPasswordChange(e){
    this.setData({
      emailPassword: e.detail.value,
    })
  },

  //确认设置公告
  confirmNotice(){
    this.setData({
      remind: "更新中"
    })

    wx.showLoading({
      title: '上传中请稍等~',
      mask: true
    })
    wx.cloud.init({
      // env 参数说明：
      //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
      //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
      //   如不填则使用默认环境（第一个创建的环境）
      env: 'fangkejilu-jcgws',
      traceUser: true,
    })
    //  下面是云函数的调用
    wx.cloud.callFunction({
      name: 'update_notice',
      data: {
        // NdaText: this.data.message,
        newNotice:this.data.notice
      },
      success: res => {
        wx.hideLoading();
        wx.showModal({
          title: '操作成功',
          content: '公告已更新 重启后生效',
          showCancel: false,
        })

      },
      fail: err => {
        // handle error
        wx.hideLoading();
        wx.showModal({
          title: '提示',
          content: '上传出错 请检查网络',
          showCancel: false,
        })
        return;
      },
      complete: res => {
        console.log('callFunction test result: ', res)
        this.setData({
          remind: ''
        })
      }
    })
  },
  //确认设置邮件
  confirmEmail(){
    this.setData({
      remind: "更新中"
    })

    wx.showLoading({
      title: '上传中请稍等~',
      mask: true
    })
    wx.cloud.init({
      // env 参数说明：
      //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
      //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
      //   如不填则使用默认环境（第一个创建的环境）
      env: 'fangkejilu-jcgws',
      traceUser: true,
    })
    //  下面是云函数的调用
    wx.cloud.callFunction({
      name: 'update_email',
      data: {
        // NdaText: this.data.message,
        email:this.data.email,
        emailPassword:this.data.emailPassword
      },
      success: res => {
        wx.hideLoading();
        wx.showModal({
          title: '操作成功',
          content: '邮箱已更新 重启后生效',
          showCancel: false,
        })

      },
      fail: err => {
        // handle error
        wx.hideLoading();
        wx.showModal({
          title: '提示',
          content: '上传出错 请检查网络',
          showCancel: false,
        })
        return;
      },
      complete: res => {
        console.log('callFunction test result: ', res)
        this.setData({
          remind: ''
        })
      }
    })
  },
  

  //通用 选择图片  本地存储路径存到this.data.localImage
  uploadimg(whick) {
    let that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        let imgUrl = res.tempFilePaths[0];
        that.setData({
          [which]: imgUrl,
        })
        // that.uploadImgweb(imgUrl) 
      },
      fail(res)
      {
        wx.showModal({
          title: '提示',
          content: '没有选择照片',
          showCancel: false,
        })
        return;
      }
    })
  },


  //通用 将本地图片上传到云端 并返回url 存到CloudUrl
  uploadImgweb(where,imgUrl) {
    wx.showLoading({
      title: '上传中请稍等~',
      mask: true
    })
    let that = this;
    wx.cloud.uploadFile({
      cloudPath: where + '/' + imgUrl.slice(imgUrl.length - 20, imgUrl.length),
      filePath: imgUrl,
      success: res => {
        wx.hideLoading();
        that.setData({
          CloudUrl: res.fileID,
        })
      },
      fail: err => {
        wx.hideLoading();
        console.log("上传失败", err)
      }
    })
    // that.onLoad();
  },

  //设置logo 存路径到this.data.localLogo
  uploadLogo(){
    let that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        let imgUrl = res.tempFilePaths[0];
        that.setData({
         localLogo: imgUrl,
        })
        // that.uploadImgweb(imgUrl) 
      },
      fail(res)
      {
        // wx.showModal({
        //   title: '提示',
        //   content: '出错 请退出重试',
        //   showCancel: false,
        // })
        return;
      }
    })
  },

  uploadpic(){
    let that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        let imgUrl = res.tempFilePaths[0];
        that.setData({
         localPic: imgUrl,
        })
        // that.uploadImgweb(imgUrl) 
      },
      fail(res)
      {
        wx.showModal({
          title: '提示',
          content: '没有选择照片',
          showCancel: false,
        })
        return;
      }
    })
  },

  
   //确认设置logo
   confirmLogo(){
     let that = this;
     if(this.data.localLogo=='')
     {
      wx.showModal({
        title: '没有选择照片 请重试~',
        mask: true,
        showCancel:false
      })
      return
     }
    this.uploadImgweb('logo',this.data.localLogo);
    let wait = setTimeout(() => {
      this.setData({
        remind: "更新中"
      })
      wx.showLoading({
        title: '上传中请稍等~',
        mask: true
      })
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'fangkejilu-jcgws',
        traceUser: true,
      })
      console.log(that.data.CloudUrl)
      //  下面是云函数的调用
      wx.cloud.callFunction({
        name: 'update_logo',
        data: {
          newLogo:that.data.CloudUrl
        },
        success: res => {
          wx.hideLoading();
          wx.showModal({
            title: '操作成功',
            content: 'LOGO已更新 重启后生效',
            showCancel: false,
          })
  
        },
        fail: err => {
          // handle error
          wx.hideLoading();
          wx.showModal({
            title: '提示',
            content: '上传出错 请检查网络',
            showCancel: false,
          })
          return;
        },
        complete: res => {
          console.log('callFunction test result: ', res)
          this.setData({
            remind: '',
            CloudUrl:'',
          })
        }
      })
    }, 2500);
  },


  //确认设置pic
  confirmPic(){
    let that = this;
    if(this.data.localPic=='')
    {
     wx.showModal({
       title: '没有选择照片 请重试~',
       mask: true,
       showCancel:false
     })
     return
    }
   this.uploadImgweb('pic',this.data.localPic);
   let wait = setTimeout(() => {
     this.setData({
       remind: "更新中"
     })
     wx.showLoading({
       title: '上传中请稍等~',
       mask: true
     })
     wx.cloud.init({
       // env 参数说明：
       //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
       //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
       //   如不填则使用默认环境（第一个创建的环境）
       env: 'fangkejilu-jcgws',
       traceUser: true,
     })
     console.log(that.data.CloudUrl)
     //  下面是云函数的调用
     wx.cloud.callFunction({
       name: 'update_cPic',
       data: {
         newPic:that.data.CloudUrl
       },
       success: res => {
         wx.hideLoading();
         wx.showModal({
           title: '操作成功',
           content: '展示图片已更新,重启后生效',
           showCancel: false,
         })
 
       },
       fail: err => {
         // handle error
         wx.hideLoading();
         wx.showModal({
           title: '提示',
           content: '上传出错 请检查网络',
           showCancel: false,
         })
         return;
       },
       complete: res => {
         console.log('callFunction test result: ', res)
         this.setData({
           remind: '',
           CloudUrl:'',
         })
       }
     })
   }, 2500);
 },


  
})