// miniprogram/pages/FeedBack/FeedBack.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  formSubmit(e) {
    if (e.detail.value.text == "") {
      wx.showModal({
        title: '提示',
        content: '你没有记录任何东西，请重试',
        showCancel: false
      })
      return;
    }
    if (e.detail.value.number == "") {
      wx.showModal({
        title: '提示',
        content: '请留下您的联系方式，请重试',
        showCancel: false
      })
      return;
    }

    var text = e.detail.value.text;
    var number = e.detail.value.number;
    var openid = wx.getStorageInfoSync("openid");
    wx.cloud.init()
    wx.cloud.callFunction({

      name: 'addFeedback',
      data: {
        text: text,
        number: number,
        useropenid: openid
      },
      success: res => {
        console.log(res.result)
      },
      fail: err => {

      },
      complete: res => {
        console.log('callFunction test result: ', res)
        wx.showToast({ //提交成功的提示框
            title: '提交成功',
            duration: 1100
          }),
          setTimeout(function() { //延时执行函数
            wx.navigateBack({
              delta: 1
            })
          }, 1200) //延迟时间 这里是1.5秒
      },
    })
    // wx.cloud.init()
    // //  下面是云函数的调用
    // // cloud.init()  测试通过
    // wx.cloud.callFunction({
    //   name: 'addFeedback',
    //   data: {
    //     text: text,
    //     number: number,
    //     useropenid: openid
    //   },
    //   success: res => {
    //     // output: res.result === 3
    //     // console.log(res.result)
    //     console.log(res.result)
    //   },
    //   fail: err => {
    //     // handle error
    //   },
    //   complete: res => {
    //     console.log('callFunction test result: ', res)
    //   }
    // })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})