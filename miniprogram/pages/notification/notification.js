
var app = getApp();
var util = require("../../utils/util.js")
var time = require('../../utils/util.js');
var message = '';
var text = '';
var user = {};
var length;
var zx_info_id;
var openid_talk;

Page({
  data: {
    userInfo: {},

    news: '',
    scrollTop: 0,
    message: '',
    text: text,
    centendata: [],
    nickName: '',
    avatarUrl: '',
    news_input_val: '',
    tabdata: ''
  },
  onLoad: function (options) {

    openid_talk = options.openid_talk;
    zx_info_id = options.zx_info_id;
    console.log(openid_talk)
    //调用应用实例的方法获取全局数据
    this.setData({
      zx_info_id: zx_info_id,
      nickName: app.nickName,
      avatarUrl: app.avatarUrl,
    });
    this.loaddata()
    // this.template();
    this.getunReadcomNum();

    var plugin = requirePlugin("QCloudTBP")
    plugin.SetQCloudSecret("AKIDVmJMEA8cgaKKDxnu0s6C4iBWL0UpnORH", "p4kBcLupY1TkxywgIkRs7LY8Y7Zry0pV") //设置腾讯云账号信息，重要！！


    plugin.GetBots({
      Version: '2019-03-11',
      PageNumber: 1,
      PageSize: 50,
      success: function (data) {
        console.log("获取robot列表成功：", data)
      },
      fail: function (err) {
        console.error("获取robot列表失败：", err)
      }
    })

    // plugin.PostText({

    //   Version: '2019-03-11',
    //   BotId: '3f1d2bd7-f55a-44dd-b4e3-18132281fe48',
    //   BotEnv: "release",
    //   InputText: '我想订机票',
    //   TerminalId: "300180199810091921",
    //   success: function (resData) {
    //     console.log("robot调用成功：", resData)
    //   },
    //   fail: function (err) {
    //     console.error("robot调用失败", err)
    //   }
    // })

    this.template();

  },

  onShow: function () {
    this.getunReadcomNum();
  },

  template:function(e){
    var data = {
      // program_id: app.jtappid,
      // openid: app._openid,
      // zx_info_id: zx_info_id,
      content: "猜你想问：\n 1、积分可以怎么花？\n2、怎么向店家提意见？\n 3、如何提前预约包厢？\n4、WIFI密码是多少？\n5、怎么赚钱？\n回复数字即可",
      // openid_talk: openid_talk,
      // time: time.formatTime(new Date, 'Y/M/D'),
      is_show_right: 2,
    }

    this.data.centendata.push(data);
    this.setData({
      centendata: this.data.centendata
    })
  },



  response:function(e){
  
    var that = this
    console.log(e.Response.ResponseText);
    var data = {
      program_id: app.jtappid,
      openid: app._openid,
      zx_info_id: zx_info_id,
      content: e.Response.ResponseText,
      openid_talk: openid_talk,
      time: time.formatTime(new Date, 'Y/M/D'),
      is_show_right: 2,
    }

    this.data.centendata.push(data);
    that.setData({
      // news_input_val: '',
      centendata: that.data.centendata
    })

    this.bottom();
  },



  bindChange: function (e) {
    message = e.detail.value
  },
  
  //事件处理函数
  add: function (e) {
    if(message=="1")
    {
      message="飞手都是经过认证的吗？"
    }
    if (message == "2") {
      message = "如何成为飞手？"
    }
    if(message =="3")
    {
      message = "如何投诉举报飞手？"
    }
    if (message == "4") {
      message = "如何申请成为飞手接单？"
    }
    if (message == "5") {
      message = "如何在我的约飞中取消约飞？"
    }
    var that = this
    var data = {
      program_id: app.jtappid,
      openid: app._openid,
      zx_info_id: zx_info_id,
      content: message,
      openid_talk: openid_talk,
      time: time.formatTime(new Date, 'Y/M/D'),
      is_show_right:1,
    }

    var plugin = requirePlugin("QCloudTBP")
    plugin.SetQCloudSecret("AKIDVmJMEA8cgaKKDxnu0s6C4iBWL0UpnORH", "p4kBcLupY1TkxywgIkRs7LY8Y7Zry0pV") //设置腾讯云账号信息，重要！！
    plugin.PostText({

      Version: '2019-03-11',
      BotId: '3f1d2bd7-f55a-44dd-b4e3-18132281fe48',
      BotEnv: "release",
      InputText: message,
      TerminalId: "300180199810091921",
      success: function (resData) {
        console.log("robot调用成功：", resData)
        that.response(resData);
      },
      fail: function (err) {
        console.error("robot调用失败", err)
      }
    })

    this.data.centendata.push(data);
        that.setData({
          news_input_val: '',
          centendata: that.data.centendata
        })
            // that.loaddata(a);
    // util.request('/session_submit', 'post', data, '正在加载数据', function (res) {
    //   if (res.data.state == 1) {
    //     var a = true;
    //     that.loaddata(a);
    //     that.setData({
    //       news_input_val: ''
    //     })
    //     message = ''
    //   } else {
    //     wx.showToast({
    //       title: '网络错误,请稍后',
    //     })
    //   }
    // })

    this.bottom();
  },


  // 页面加载
  loaddata: function (a) {
    var that = this;
    var is_img = true;
    var data = {
      program_id: app.jtappid,
      openid: app._openid,
      zx_info_id: zx_info_id,
      openid_talk: openid_talk
    }
    // util.request('/session_page', 'post', data, '', function (res) {
    //   if (res.data.k1) {
    //     res.data.k1.time_agree = util.js_date_time(res.data.k1.time_agree)
    //   }
    //   for (var i = 0; i < res.data.k2.length; i++) {
    //     res.data.k2[i].time = util.js_date_time(res.data.k2[i].time)
    //     var n = res.data.k2[i].content.charAt(res.data.k2[i].content.length - 1);
    //     switch (n) {
    //       case 'g':
    //         res.data.k2[i].is_img = is_img
    //         break;
    //       default:
    //     }
    //   }
    //   that.setData({
    //     tabdata: res.data.k1,
    //     centendata: res.data.k2.reverse()
    //   })
    //   wx.setNavigationBarTitle({ title: that.data.tabdata.nickname });
    //   if (a) {
    //     setTimeout(function () {
    //       that.bottom()
    //     }, 500);
    //   }
    // })
    setTimeout(function () {
      if (that.data.centendata.length != length) {
        length = that.data.centendata.length
      }
      that.loaddata()
    }, 3000);

  },
  // 获取hei的id节点然后屏幕焦点调转到这个节点
  bottom: function () {
    var query = wx.createSelectorQuery()  // 创建节点查询器 query
    query.select('#hei').boundingClientRect()//获取节点位置信息的查询请求
    query.selectViewport().scrollOffset()//这段代码的意思是获取页面滑动位置的查询请求
    query.exec(function (res) {
      wx.pageScrollTo({
        // scrollTop: res[0].bottom  // #the-id节点的下边界坐标
        // scrollTop: res[0].bottom ,// #the-id节点的下边界坐标
        scrollTop: res[1].scrollHeight // 显示区域的竖直滚动位置
      })
      // res[1].scrollTop // 显示区域的竖直滚动位置
    })
  },

  toSysMessList() {
    wx.navigateTo({
      //这里传值
      url: '/pages/SystemMessageList/SystemMessageList',
    })
  },
  // 选择图片并把图片保存  
  upimg1: function () {
    var that = this;
    wx.chooseImage({
      success: function (res) {
        var data = {
          program_id: app.jtappid,
          openid: app._openid,
          zx_info_id: zx_info_id,
        }
        var tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: '/session_submit', //提交信息至后台
          filePath: tempFilePaths[0],
          name: 'content', //文件对应的参数名字(key)
          formData: data,  //其它的表单信息
          success: function (res) {
            var a = true;
            that.loaddata(a);
            message = ''
          }
        })
      }
    })
  },

  getunReadcomNum: function (e) {
    let that = this
    // wx.cloud.callFunction({
    //   name: 'get_unReadSysMessNum',
    //   data: {
    //   },
    //   success: res => {
    //   },
    //   fail: err => {
    //     console.log('fail result: ', err)
    //   },
    //   complete: res => {
    //     console.log('unreadnum callFunction test result: ', res.result)
    //     // console.log('res.result.orderFlyers: ', res) 
    //     let unReadNum = res.result.unReadNum

    //     that.setData({
    //          unReadNum: unReadNum
    //     })
    //   }
    // })
    
  },

  
})  
