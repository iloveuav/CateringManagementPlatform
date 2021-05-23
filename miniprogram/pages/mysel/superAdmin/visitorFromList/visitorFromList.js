// miniprogram/pages/index/visitorFrom/visitorFrom.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    step1:{},
    signature:{
      ndaSignPath:''
    },
    VPHOTO: '',
    NPHOTO: '',
    visitorPhoto:{
      visitorPhoto:''
    },
    fromList:[
      {
        step:1,
        fromName:"访客信息",
      },
      {
        step:2,
        fromName:"Nda及手签",
      },
      {
        step:3,
        fromName:"自动拍照及提交",
      }
    ],
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

  // -------------------------提交新的访客信息 并且发送邮件给访客填写的邮件-------------------

  submit(e){

    let that = this;
    if (Object.keys(this.data.step1).length === 0 ) {
      wx.showModal({
        title: '提示',
        content: 'step1访客表单数据未提交 请重试',
        showCancel: false
      })
      return;
    }

    if (this.data.signature.ndaSignPath == '') {
      wx.showModal({
        title: '提示',
        content: 'step2请签字确认保密协议',
        showCancel: false
      })
      return;
    }
    if (this.data.visitorPhoto.visitorPhoto == '') {
      wx.showModal({
        title: '提示',
        content: 'step3请点击相机icon拍照后重试',
        showCancel: false
      })
      return;
    }

    // 确认无误后  开始提交 
    wx.showLoading({
      title: '系统提交中~',
      mask: true
    })
    wx.cloud.init()

    // 先上传两个图片分别获取对应的url
    let NdaSignatureCloudUrl = this.uploadImgweb('NdaSignature',this.data.signature.ndaSignPath);
    
    let VisortorPhotoCloudUrl = this.uploadImgweb("VisortorPhoto",this.data.visitorPhoto.visitorPhoto);
    

    var waittime = setTimeout(function() {
    // console.log(that.data.NdaSignature)
    // console.log(that.data.VisortorPhoto)
    let first1 = that.data.VisortorPhoto.indexOf('.');
    let end1 = that.data.VisortorPhoto.indexOf('/', first1);
    let VPHOTO = 'https://' + that.data.VisortorPhoto.slice(first1 + 1, end1) + '.tcb.qcloud.la/' + that.data.VisortorPhoto.slice(end1 + 1, that.data.VisortorPhoto.length);
    console.log(VPHOTO);

    let first2 = that.data.NdaSignature.indexOf('.');
    let end2 = that.data.NdaSignature.indexOf('/', first2);
    let NPHOTO = 'https://' + that.data.NdaSignature.slice(first2 + 1, end2) + '.tcb.qcloud.la/' + that.data.NdaSignature.slice(end2 + 1, that.data.NdaSignature.length);
    console.log(NPHOTO);
    that.setData({
      VPHOTO: VPHOTO,
      NPHOTO: NPHOTO
    })
      var time = require('../../../utils/util');
      let nowtime = time.formatTime(new Date, 'Y/M/D h:m:s');
      that.setData({
        nowtime: nowtime
      })
      wx.cloud.callFunction({
        name: 'add_visitor',
        data: {
          newVisitor:that.data.step1,
          visitorName:that.data.step1.name,
          visitorPhonenum:that.data.step1.phonenum,
          visitorId_num : that.data.step1.id_num,
          visitorTeamName: that.data.step1.teamName,

          ndaSignPath:that.data.NPHOTO,
          visitorPhoto:that.data.VPHOTO,

          visitData :  nowtime,
        },
        success(res) {
          console.log(res.result);
          
          if (res.result.mess.state == "上传成功") {
            // wx.hideLoading();
            // wx.showModal({
            //   title: '提交成功',
            //   content: '欢迎参观，祝您一切顺利',
            //   cancelText: "返回首页",
            //   confirmText: "继续新增",
            //   success(res) {
            //     if (res.cancel == true) {
            //       //回到首页
            //      wx.navigateTo({
            //        url: '../../../pages/index/index',
            //      })
            //     }
            //     if (res.confirm == true) {
            //       wx.navigateTo({
            //         url: '../../../pages/index/visitorFromList/visitorFromList',
            //       })
            //     }
            //   }
            // })
             
          }
          else{
            wx.showModal({
              title: '提交失败',
              content: '请检查网络后重新提交',
              showCancel: false
            })
          }

        },
        fail(err) {
          console.log(err);
          wx.showModal({
            title: '网络错误',
            content: '网络出现问题，请稍后再试!',
          })
          wx.hideLoading();
        }
      })
    }, 4000)


    //数据上传完  给访客发送邮件
    var waittime = setTimeout(function() {
    
  //    wx.showLoading({
  //   title: '发送邮件中请稍等~',
  //   mask: true
  // })
    // let appsetting = wx.getStorageSync('appSetting');
    // console.log(appsetting)
      wx.cloud.callFunction({
                    name: 'sendEmail',
                    data: {
                      // path : tempFilePath,
                      visitorName:that.data.step1.name,
                      visitData:that.data.nowtime,
                      cause:that.data.step1.cause,
                      visitorEmail:that.data.step1.email,
                      
                      ndaSignPath:that.data.NPHOTO,
                      visitorPhoto:that.data.VPHOTO,

                      // sendEmail: appsetting.email,
                      // sendEmailPassword:appsetting.emailPassword

                    },
                    success(res){
                      wx.hideLoading();
                      console.log('发送邮件成功',res)

                      wx.showModal({
                        title: '提交成功',
                        content: '欢迎参观，祝您一切顺利',
                        cancelText: "返回首页",
                        confirmText: "继续新增",
                        success(res) {
                          if (res.cancel == true) {
                            //回到首页
                           wx.navigateTo({
                             url: '../../../pages/index/index',
                           })
                          }
                          if (res.confirm == true) {
                            wx.navigateTo({
                              url: '../../../pages/index/visitorFromList/visitorFromList',
                            })
                          }
                        }
                      })

                      
                      // wx.showModal({
                      //   title: '温馨提示',
                      //   content: '邮件发送成功，可在邮件中查看',
                      //   showCancel: false,
                      //   success(res) {
                      //     wx.clear
                      //     if (res.confirm) {
                      //       that.setData({
                      //         isShow: true
                      //       })
                      //     }
                      //   }
                      // })
                    },
                    fail(err){
                      wx.hideLoading();
                      wx.showModal({
                        title: '邮件发送失败',
                        content: '请检查邮箱格式或网络连接~',
                        showCancel:false
                      })
                    }
                  })
                }, 4000)




  },


  //通用 将本地图片上传到云端 where文件夹下  并返回url 存到CloudUrl
  uploadImgweb(where,imgUrl) {
    // wx.showLoading({
    //   title: '上传中请稍等~',
    //   mask: true
    // })
    let that = this;
    wx.cloud.uploadFile({
      cloudPath: where + '/' + imgUrl.slice(imgUrl.length - 20, imgUrl.length),
      filePath: imgUrl,
      success: res => {
  
        that.setData({
          CloudUrl: res.fileID,
         [where]: res.fileID,
        })
        return res.fileID;
      },
      fail: err => {
        // wx.hideLoading();
        console.log("上传失败", err)
      }
    })
    // that.onLoad();
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

   getStep1(e)
   {
     console.log(e);
     this.setData({
       step1:e.detail,
       current:1
     })
   },

   toStep3(e){
    if(this.data.signature.ndaSignPath=='')
    {
      wx.showModal({
        title: '提示',
        content: '您没有签字哦，请点击签字icon',
        showCancel: false
      })
      return;
    }
    this.setData({
      current:2
    })
   },


  
})