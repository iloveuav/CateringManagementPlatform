// miniprogram/pages/admin/editNda/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

    images: [],
    cloudimgs: [],
    hint: "点击方框上传照片",


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getNda();
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
    this.getNda();
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

  // ----------------------------获取NDA图片---------------

  getNda:function(){
    // 获取云端上保密协议的内容
 wx.cloud.init()
 //  下面是云函数的调用
 wx.cloud.callFunction({
   name: 'get_Nda',
   data: {
   },
   success: res => {
    this.setData({
      // remind: '',
      instructions:res.result.Nda.data[0].NdaText,
      nowNdaUrl:res.result.Nda.data[0].NDAimageUrl
    })
   },
   fail: err => {
     // handle error
     wx.showModal({
       title: '获取失败',
       content: '请检查网络',
       showCancel: false,
     })
   },
   complete: res => {
     console.log('callFunction test result: ', res)
     
   }
 })
 },



    // -------------------------------以下关于图片的方法---------------------------------
  removeImage(e) {
    const idx = e.target.dataset.idx
    this.data.images.splice(idx, 1)
    this.setData({
      images: [],
      localImage:'',
      imgUrl:""
    })
    // $digest(this)
  },

  handleImagePreview(e) {
    console.log(e)
    const idx = e.target.dataset.idx
    const images = this.data.images
    wx.previewImage({
      current: images[idx],
      urls: images,
    })
  },
  looknowNDA(e) {
    // console.log(e)
    const arr = []
    const image = this.data.nowNdaUrl
    arr.push(image);
    wx.previewImage({
      current: arr[0],
      urls: arr,
    })
  },



  uploadimg() {
    let that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        let imgUrl = res.tempFilePaths[0];
        let imgs2 = that.data.images;
        imgs2.push(imgUrl)

        wx.setStorageSync('NDAtempUrl',imgUrl);

        that.setData({
          images:imgs2,
          localImage: imgUrl,
        })
        that.uploadImgweb(imgUrl) 
        // // 左边向右边滑动 (调用父方法)
        // var myEventDetail = {} // detail对象，提供给事件监听函数
        // var myEventOption = {} // 触发事件的选项
        // that.triggerEvent('callHelp', myEventDetail, myEventOption) //成功解决bug
      },
      fail(res)
      {
        // var myEventDetail = {} // detail对象，提供给事件监听函数
        // var myEventOption = {} // 触发事件的选项
        // that.triggerEvent('callHelp', myEventDetail, myEventOption) //成功解决bug
      }
    })
    // var myEventDetail = {} // detail对象，提供给事件监听函数
    // var myEventOption = {} // 触发事件的选项
    // that.triggerEvent('callHelp', myEventDetail, myEventOption) //成功解决bug
  },

  uploadImgweb(imgUrl) {
    wx.showLoading({
      title: '上传中请稍等~',
      mask: true
    })
    let that = this;
    wx.cloud.uploadFile({
      cloudPath: 'NDAImages/' + imgUrl.slice(imgUrl.length - 20, imgUrl.length),
      filePath: imgUrl,
      success: res => {
        wx.hideLoading();
        that.setData({
          imgUrl: res.fileID,
        })
      },
      fail: err => {
        wx.hideLoading();
        console.log("上传失败", err)
      }
    })
    // that.onLoad();
  },

// toCloud(){
//   this.uploadImgweb(this.data.localImage)
// },

 updateNDA: function () {

  wx.showLoading({
    title: '更新中请稍等~',
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
      name: 'update_Nda',
      data: {
        // NdaText: this.data.message,
        NDAimageUrl:this.data.imgUrl
      },
      success: res => {
        wx.hideLoading();
        wx.showModal({
          title: '操作成功',
          content: '保密协议已更新',
          showCancel: false,
        })

      },
      fail: err => {
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
      }
    })
  },
})