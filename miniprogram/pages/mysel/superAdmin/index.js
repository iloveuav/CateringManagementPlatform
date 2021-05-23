// page/one/index.js
  // "mp-badge": "/miniprogram_npm/weui-miniprogram/badge/badge",
  // "mp-cells": "/miniprogram_npm/weui-miniprogram/cells/cells",
  // "mp-cell": "/miniprogram_npm/weui-miniprogram/cell/cell",
  // "mp-dialog": "/miniprogram_npm/weui-miniprogram/dialog/dialog",
Page({
  data: {
    open: false,
    remind: "remind",
    mark: 0,
    newmark: 0,
    startmark: 0,
    endmark: 0,
    windowWidth: wx.getSystemInfoSync().windowWidth,
    staus: 1,
    translate: '',
    // ----------------------------------------以上为yzm data 以下为ss data------------------------------------------------------
    pageFlag: 0,
    dialogShow: false,
    buttons: [{
      text: '取消'
    }, {
      text: '查询'
    }],
    dialogFlag: -1,
    time: '',
    defaultValue: '',
    list: [],
    inputValue: '',
    list_index: [],
    allCourseDemo: [{
      name:"工业园区",
      value:0,
    },
    {
      name:"吴中区",
      value:0,
    },
    {
      name:"昆山",
      value:0,
    },
  ],
  },
  tap_ch: function (e) {
    if (this.data.open) {
      this.setData({
        translate: 'transform: translateX(0px)'
      })
      this.data.open = false;
    } else {
      this.setData({
        translate: 'transform: translateX(' + this.data.windowWidth * 0.4 + 'px)'
      })
      this.data.open = true;
    }
  },
  tap_start: function (e) {
    this.data.mark = this.data.newmark = e.touches[0].pageX;
    if (this.data.staus == 1) {
      // staus = 1指默认状态
      this.data.startmark = e.touches[0].pageX;
    } else {
      // staus = 2指屏幕滑动到右边的状态
      this.data.startmark = e.touches[0].pageX;
    }

  },
  tap_drag: function (e) {
    /*
     * 正在用日期组件时 不执行
     * 
     */
    // if(useselectByDate)x


    /*
     * 手指从左向右移动
     * @newmark是指移动的最新点的x轴坐标 ， @mark是指原点x轴坐标
     */
    this.data.newmark = e.touches[0].pageX;
    if (this.data.mark < this.data.newmark) {
      if (this.data.staus == 1) {
        if (this.data.windowWidth * 0.4 > Math.abs(this.data.newmark - this.data.startmark)) {
          this.setData({
            translate: 'transform: translateX(' + (this.data.newmark - this.data.startmark) + 'px)'
          })
        }
      }

    }
    /*
     * 手指从右向左移动
     * @newmark是指移动的最新点的x轴坐标 ， @mark是指原点x轴坐标
     */
    if (this.data.mark > this.data.newmark) {
      if (this.data.staus == 1 && (this.data.newmark - this.data.startmark) > 0) {
        this.setData({
          translate: 'transform: translateX(' + (this.data.newmark - this.data.startmark) + 'px)'
        })
      } else if (this.data.staus == 2 && Math.abs(this.data.startmark - this.data.newmark) > this.data.windowWidth * 0.4) {
        // console.log( Math.abs(this.data.startmark - this.data.newmark))
        this.setData({
          translate: 'transform: translateX(' + (this.data.newmark + this.data.windowWidth * 0.4 - this.data.startmark) + 'px)'
        })
      }

    }

    this.data.mark = this.data.newmark;

  },
  tap_end: function (e) {
    if (this.data.staus == 1 && this.data.startmark < this.data.newmark) {
      if (Math.abs(this.data.newmark - this.data.startmark) < (this.data.windowWidth * 0.2)) {
        this.setData({
          translate: 'transform: translateX(0px)'
        })
        this.data.staus = 1;
      } else {
        this.setData({
          translate: 'transform: translateX(' + this.data.windowWidth * 0.4 + 'px)'
        })
        this.data.staus = 2;
      }
    } else {
      if (Math.abs(this.data.newmark - this.data.startmark) < (this.data.windowWidth * 0.2)) {
        this.setData({
          // translate: 'transform: translateX(' + this.data.windowWidth * 0.4 + 'px)'  //注掉 避免触发菜单
        })
        this.data.staus = 2;
      } else {
        // 左边向右边滑动
        this.setData({
          translate: 'transform: translateX(0px)'
        })
        this.data.staus = 1;
      }
    }

    this.data.mark = 0;
    this.data.newmark = 0;
  },

  // 解决子组件上传图片后出现菜单的现象
  helpUploadPic: function () {
    // 左边向右边滑动
    this.setData({
      translate: 'transform: translateX(0px)'
    })
    console.log('help');
    this.data.staus = 1;
  },

  bindChange: function (e) {
    this.data.message = e.detail.value
  },

  edit: function () {

    this.setData({
      remind: "加载中"
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
        NdaText: this.data.message,
      },
      success: res => {

        wx.showModal({
          title: '操作成功',
          content: '保密协议已更新',
          showCancel: false,
        })

      },
      fail: err => {
        // handle error
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


  touchEdit_NDA: function () {

    this.setData({
      remind: '加载中'
    })
    // 获取云端上保密协议的内容
    wx.cloud.init()
    //  下面是云函数的调用
    // wx.cloud.callFunction({
    //   name: 'get_Nda',
    //   data: {},
    //   success: res => {

    //   },
    //   fail: err => {
    //     // handle error
    //     wx.showModal({
    //       title: '获取失败',
    //       content: '请检查网络',
    //       showCancel: false,
    //     })
    //   },
    //   complete: res => {
    //     console.log('callFunction test result: ', res)
    //     this.setData({
    //       remind: '',
    //       message: res.result.Nda.data[0].NdaText
    //     })
    //   }
    // })

    this.setData({
      pageFlag: 2,
      // translate: 'transform: translateX(0px)'
    })
  },

  touchEdit_Food: function () { 
    wx.navigateTo({
      url: '../superAdmin/AddFood/index',
    })
  //   this.setData({
  //   pageFlag: 6,
  //   translate: 'transform: translateX(0px)'
  // })
},
  touchAnalyse_Data: function () {  
    wx.navigateTo({
      url: '../superAdmin/admin/train/train',
    })
  },

  touchHome: function () {

    this.setData({
      remind: '加载中'
    })
    var time = require('../../../utils/util');
    let nowtime = time.formatDayTime(new Date, 'Y/M/D');
    console.log(nowtime)
    // 获取云端上保密协议的内容
    wx.cloud.init()
    //  下面是云函数的调用
    // wx.cloud.callFunction({
    //   name: 'get_indexCardMess',
    //   data: {
    //     today: nowtime
    //   },
    //   success: res => {
    //     this.setData({
    //       remind: '',
    //       allVisitorNumber: res.result.allVisitorNumber,
    //       todayVisitorNumber: res.result.todayVisitorNumber,
    //       nowtime: nowtime,
    //       appSetting:res.result.appSetting.data[0]
    //     })
    //     wx.setStorageSync('appSetting', res.result.appSetting.data[0])
    //   },
    //   fail: err => {
    //     // handle error
    //     wx.showModal({
    //       title: '获取失败',
    //       content: '请检查网络',
    //       showCancel: false,
    //     })
    //   },
    //   complete: res => {
    //     console.log('callFunction test result: ', res)
    //     this.setData({
    //       remind: '',
    //       appSetting:{}
    //     })
    //   }
    // })
    this.setData({
      pageFlag: 0,
      nowtime: nowtime,
      appSetting:{}
      // translate: 'transform: translateX(0px)'
    })
    console.log("返回首页")
  },
  // ————————————————————————————————以上为yzm function 以下为 ss function——————————————————————————————————————

  touchVisitors: function () {
    // 获取当天日期以便datePicker加标记
    // let date = new Date()
    // let y = date.getFullYear()
    // let m = date.getMonth() + 1 > 10 ? date.getMonth() + 1 : `0${date.getMonth()+1}`
    // let d = date.getDate() > 10 ? date.getDate() : `0${date.getDate()}`
    // let nowValue = `${y}-${m}-${d}`
    // console.log(nowValue)
    this.setData({
      pageFlag: 1,
      translate: 'transform: translateX(0px)',
      // defaultValue: nowValue
    })
  },

  editNda(){
    wx.navigateTo({
      url: '../superAdmin/admin/editNda/index',
    })
  },

  setting(){
    wx.navigateTo({
      url: '../superAdmin/admin/setting/setting',
    })
  },

  touchAddFrom: function () {
    this.setData({
      // pageFlag: 3,
      translate: 'transform: translateX(0px)'
    })
    wx.navigateTo({
      url: '../superAdmin/visitorFromList/visitorFromList',
    })
  },
  selectByName(e) {
    this.setData({
      dialogShow: true,
      dialogFlag: 0
    })
  },
  selectByDate(e) {
    this.setData({
      pageFlag: 5
    })
  },
  selectByPhoneNumber(e) {
    this.setData({
      dialogShow: true,
      dialogFlag: 1
    })
  },
  selectByTeam(e) {
    this.setData({
      dialogShow: true,
      dialogFlag: 2
    })
  },
  //取消dialog显示
  tapDialogButton(e) {
    // 按姓名查询
    if (this.data.dialogFlag == 0) {
      // 点击查询
      if (e.detail.index == 1) {
        wx.showLoading({
          title: '查询中',
          mask: true
        })
        wx.cloud.callFunction({
          name: "query_record",
          data: {
            visitorName: this.data.inputValue,
            select_flag: this.data.dialogFlag
          }
        }).then(res => {
          console.log(res)
          wx.hideLoading({
          })
          this.setData({
            list: res.result.listData.list
          })
          if (this.data.list.length <= 0) {
            wx.showModal({
              title: '没有对应数据',
              content: '',
              showCancel: false
            })
          }
        })
      }
    }
    // 按手机号查询
    else if (this.data.dialogFlag == 1) {
      // 点击查询
      if (e.detail.index == 1) {
        wx.showLoading({
          title: '查询中',
          mask: true
        })
        wx.cloud.callFunction({
          name: "query_record",
          data: {
            visitorPhonenum: this.data.inputValue,
            select_flag: this.data.dialogFlag
          }
        }).then(res => {
          console.log(res)
          wx.hideLoading({
          })
          this.setData({
            list: res.result.listData.list
          })
          if (this.data.list.length <= 0) {
            wx.showModal({
              title: '没有对应数据',
              content: '',
              showCancel: false
            })
          }
        })
      }
    }
    // 按公司名查询
    else if (this.data.dialogFlag == 2) {
      // 点击查询
      if (e.detail.index == 1) {
        wx.showLoading({
          title: '查询中',
          mask: true
        })
        console.log(this.data)
        wx.cloud.callFunction({
          name: "query_record",
          data: {
            visitorTeamName: this.data.inputValue,
            select_flag: this.data.dialogFlag
          }
        }).then(res => {
          console.log(res)
          wx.hideLoading({
          })
          this.setData({
            list: res.result.listData.list
          })

          if (this.data.list.length <= 0) {
            wx.showModal({
              title: '没有对应数据',
              content: '',
              showCancel: false
            })
          }
        })
      }
    }
    // 点击取消或查询都隐藏dialog
    this.setData({
      dialogFlag: -1
    })
  },
  //按日期查询
  //点击指定日期
  dateChange(e) {
    console.log(e.detail.value);
    this.setData({
      pageFlag: 1
    })
    wx.showLoading({
      title: '查询中',
      mask: true
    })
    wx.cloud.callFunction({
      name: "query_record",
      data: {
        chooseDate: e.detail.value,
        select_flag: -1
      }
    }).then(res => {
      console.log(res)
      wx.hideLoading({
      })
      this.setData({
        list: res.result.listData
      })
      if (this.data.list.length <= 0) {
        wx.showModal({
          title: '没有对应数据',
          content: '',
          showCancel: false
        })
      }
    })
  },
  //点击列表中的某一项
  click(e) {
    console.log("按了：", e.currentTarget.id);
    this.setData({
      pageFlag: 4,
      list_index: this.data.list[e.currentTarget.id]
    })
    console.log(this.data.list_index)
  },
  delete(e) {
    let that = this;
    wx.showModal({
      cancelColor: 'cancelColor',
      cancelText: '放弃',
      confirmColor: 'red',
      confirmText: '删除',
      content: '你确定要删除 '+ that.data.list[e.currentTarget.id].visitorName+" 这条记录吗？",
      showCancel: true,
      title: '警告',
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({
            title: '删除中',
            mask: true
          })
          wx.cloud.callFunction({
            name: 'deleteItem',
            data:{
              visitData: that.data.list[e.currentTarget.id].visitData
            },
            success (res) {
              console.log(res)
              console.log(that.data.list)
              wx.hideLoading({
              })
              wx.showToast({
                title: '删除成功',
              })
              that.data.list.splice(e.currentTarget.id,1)
              that.setData({
                list: that.data.list
              })
            },
            fail (err) {
              wx.hideLoading({
              })
              console.log(err)
              wx.showToast({
                title: '删除失败',
              })
            }
          })
        } else if (res.cancel) {

        }
        
      }
    })
  },
  //input输入
  bindkeyInput(e) {
    console.log(e)
    this.setData({
      inputValue: e.detail.value
    })
  },
  getExcel(e) {
    console.log(this.data)
    if (this.data.list.length <= 0) {
      wx.showModal({
        title: '提示',
        content: '请先查询再导出Excel',
        showCancel: false
      })
    } else {
      wx.showLoading({
        title: '导出中',
        mask: true
      })
      wx.cloud.callFunction({
        name: 'get_excel',
        data: {
          userdata: this.data.list
        },
        success: function (res) {
          console.log(res.result.fileID);
          let first = res.result.fileID.indexOf('.');
          let end = res.result.fileID.indexOf('/', first);
          let httpsrc = 'https://' + res.result.fileID.slice(first + 1, end) + '.tcb.qcloud.la/' + res.result.fileID.slice(end + 1, res.result.fileID.length);
          console.log("httpsrc", httpsrc);
          var filePath = ''
          wx.hideLoading({
          })
          wx.downloadFile({
            url: httpsrc,
            success(res) {
              console.log(res)
              // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
              if (res.statusCode === 200) {
                filePath = res.tempFilePath
                wx.saveFile({
                  tempFilePath: filePath,
                  success(res) {
                    const savedFilePath = res.savedFilePath
                    // that.setData({
                    //   downLoading: false
                    // })
                    wx.openDocument({
                      filePath: savedFilePath,
                      fileType: "xlsx",
                      showMenu: true,
                      success: function (response) {
                        console.log('文件下载成功，打开中')

                      },
                      fail: function (res) {
                        console.log('文件下载成功，打开失败，请手动打开')
                      }
                    })
                  },
                  fail(err) {
                    console.log('文件保存失败')
                  }
                })
              } else {
                console.log('文件下载失败')
              }
            },

            fail(err) {
              console.log(err)
              console.log('文件为空，下载失败')
            }
          })
        }

      })
    }

  },
  changePage(e) {
    console.log(e)
    this.setData({
      pageFlag: e.detail.pageflag
    })
  },

  // -----------------------------------这里是function公共区域------------------------------------------------------------

  onLoad: function (e) {
    var identity = wx.getStorageSync("useridentity");
    this.setData({
      identity
      // remind:'1'
    })
    this.touchHome();
    wx.showShareMenu({
      withShareTicket: true
    })
   

  },
  onShow: function (e) {
    this.setData({
      translate: 'transform: translateX(' + this.data.windowWidth * 0.4 + 'px)',
      remind: ' '
    })

  }



















  // ------------------------------------------------------------------------------------------------------------------
})