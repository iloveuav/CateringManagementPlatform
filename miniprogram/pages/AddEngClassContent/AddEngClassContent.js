// miniprogram/pages/AddEngClassContent/AddEngClassContent.js
var app = getApp();
var util = require("../../utils/util.js")
var time = require('../../utils/util.js');

const qiniuUploader = require("../../utils/qiniuUploader");
const ImgUrl = '';
let ClassCollection = '';

var message = '';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    message: '',
    classId: '',
    className: '',
    chapterName: '',
    value: '',
    imgUrl: '',
    textimgTitle: '',
    uptoken: '',
    centendata: [],
    interactData: [],
    textImgArray: [],

    tempimg: [] //临时数组  等点击发送的时候一起走
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if (options.currentChooseCard == "0") {
      ClassCollection = 'Hanalyse-IndustrialPark'
    } else if (options.currentChooseCard == "1") {
      ClassCollection = 'Hanalyse-WuZhong'
    } else if (options.currentChooseCard == "2") {
      //其他课程
      ClassCollection = 'Hanalyse-kunShan'
    }

    console.log(ClassCollection);
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

  // 把当前图文Data放到数组中  等待触发submit一起上传
  addOneItem: function (e) {
    var newData = {
      textimgTitle: this.data.textimgTitle,
      chapterName: this.data.chapterName,
      content: this.data.message,
      src: this.data.imgUrl,
    }
    let textImgArray = this.data.textImgArray;
    textImgArray.push(newData);

    this.setData({
      textImgArray: textImgArray,
      textimgTitle: '',
      message: '',
      imgUrl: '',
      imageObject: '',
      answer: '',
    })
  },


  //  ------------------addText & addImg & addTextImg -------------
  //事件处理函数
  add: function (e) {
    var that = this;
    console.log("进入add函数")
    // 设置封面
    if (this.data.setFrontImg) {
      if (this.data.className == '') {
        wx.showModal({
          title: '提示',
          content: '课程名不能为空',
          showCancel: false
        })
        return;
      }
      if (this.data.textimgTitle != this.data.className) {
        wx.showModal({
          title: '提示',
          content: '课程名不一致~',
          showCancel: false
        })
        return;
      }
      let courseMess = {
        name: this.data.className,
        frontImg: this.data.imgUrl,
      }
      wx.cloud.init({
        env: 'talkbot-56sn5'
      })
      wx.cloud.init()
      //  下面是云函数的调用
      console.log(wx.getStorageSync("openid"));
      wx.cloud.callFunction({
        name: 'HW-update_allClientMess',
        data: {
          courseMess: courseMess,
        },
        success: res => {
          let mess = {
            content: '成功设置封面'
          }
          that.data.centendata.push(mess);
          this.setData({
            // news_input_val: '',
            centendata: that.data.centendata,
            imgUrl: '',
            imageObject: '',
            message: '',
            setTextImg: false,
            textimgTitle: '',
            imgfile: '',
            btnDie: false,
            textImgArray: [],
            answer: '',
            setFrontImg: '',
          })
          this.bottom();
        },
        fail: err => {
          // handle error
          wx.showModal({
            title: '提示',
            content: '课程内容上传出错 请检查网络',
            showCancel: false,
          })
          return;
        },
        complete: res => {
          console.log('callFunction test result: ', res)
        }
      })
    } else { //这个else一直到最后

      // --------设置封面end-----------------------
      if (this.data.classId == '') {
        wx.showModal({
          title: '提示',
          content: '课程id不能为空,设置封面',
          showCancel: false
        })
        return;
      } else if (this.data.className == '') {
        wx.showModal({
          title: '提示',
          content: '课程名不能为空~',
          showCancel: false
        })
        return;
      } else if (this.data.message == '' && this.data.imgUrl == null) {
        wx.showModal({
          title: '提示',
          content: '课程内容得有内容 亲~',
          showCancel: false
        })
        return;
      } else if (this.data.chapterName == '' && this.data.imgUrl == null) {
        wx.showModal({
          title: '提示',
          content: '章节名不能为空~',
          showCancel: false
        })
        return;
      } else {

        // console.log(this.data.imageObject.imageURL)
        let imgobj = this.data.imageObject;
        // console.log(imgobj==null);
        // console.log(imgobj==undefined);
        // console.log(imgobj=='');
        console.log(imgobj);
        if (imgobj != '' && imgobj != undefined) {
          this.setData({
            imgUrl: 'http://' + imgobj.imageURL
          })
        }
        let newcontentType;
        if (that.data.textImgArray.length <= 0) {
          newcontentType = that.data.imgUrl == '' ? 'text' : 'img';
        } else {
          newcontentType = 'textImg';
        }
        var newData = {
          contentType: newcontentType,

          isBot: true,

          classCollection: ClassCollection,
          // classCollection: 'EngClassContents',
          classId: parseInt(that.data.classId),
          className: that.data.className,
          classType: ClassCollection,
          chapterName: this.data.chapterName,

          detail: {},
          textimgTitle: that.data.textimgTitle,
          textImgArray: that.data.textImgArray,
          content: that.data.message,
          src: that.data.imgUrl,
          imgfile: that.data.tempimg,
          time: time.formatTime(new Date, 'Y/M/D'),
          is_show_right: 1,
        }
        // console.log(newData);
        // this.data.centendata.push(newData);
        this.setData({
          newData: newData,
          // centendata: that.data.centendata,
          // imgUrl: '',
          // message: '',
        })

        this.bottom();

        wx.cloud.init({
          env: 'talkbot-56sn5'
        })
        wx.cloud.init()
        //  下面是云函数的调用
        console.log(wx.getStorageSync("openid"));
        wx.cloud.callFunction({
          name: 'HW-add_foodContent',
          data: {
            contentData: that.data.newData,
          },
          success: res => {
            console.log(res)
            that.data.centendata.push(this.data.newData);
            this.setData({
              // news_input_val: '',
              centendata: that.data.centendata,
              imgUrl: '',
              imageObject: '',
              message: '',
              setTextImg: false,
              textimgTitle: '',
              imgfile: '',
              btnDie: false,
              textImgArray: [],
              answer: '',
              setFrontImg: '',

            })
            this.bottom();
          },
          fail: err => {
            // handle error
            wx.showModal({
              title: '提示',
              content: '课程内容上传出错 请检查网络',
              showCancel: false,
            })
            return;
          },
          complete: res => {
            console.log('callFunction test result: ', res)
          }
        })

      }

    }
  },


  useTecentCloud() {
    wx.cloud.init()
    let timestamp = (new Date()).valueOf();
    var cloudimgs = [];
    wx.cloud.uploadFile({
      // 指定上传到的云路径
      cloudPath: timestamp + '.png',
      // 指定要上传的文件的小程序临时文件路径
      filePath: this.data.tempimg,

      // 成功回调
      success: res => {
        console.log('腾讯云上传成功', res)
        if (res.fileID) {
          cloudimgs.push(res.fileID);
          this.setData({
            zhaopian: '图片如下',
            imgUrl: res.fileID,
            cloudimgs: cloudimgs,
          })

          wx.hideLoading()
          wx.showToast({
            title: '上传成功',
            icon: 'success',
            duration: 1000
          })
          console.log('that.data.textimgTitle');
          console.log(this.data.textimgTitle);
          // 设置封面
          if (this.data.setFrontImg) {
            if (this.data.className == '') {
              wx.showModal({
                title: '提示',
                content: '课程名不能为空',
                showCancel: false
              })
              return;
            } else {
              this.add();
            }

          }
          //单个图片
          else if (this.data.textimgTitle == '' || this.data.textimgTitle == undefined) {
            console.log("上传单个图片或封面");
            this.add();
          }
          //图文 
          else {
            this.addOneItem();
          }
          return;
        }
      },
    })
  },

  // ----------------上传图片上传src  返回-------------

  addimgToCloud() {
    //init!!!!!!!!!!!!!!!!

    wx.showLoading({
      title: '上传中',
    })
    var that = this;
    // ===============上传图片==================


    // 方式一 用七牛云  上传到自己的仓库------------------

    /**
     * 上传七牛返回key
     */
    // ---------------
    let url = 'http://localhost:8080/qiniu/getToken'
    wx.request({
      url: url,
      header: { //这里写你借口返回的数据是什么类型，这里就体现了微信小程序的强大，直接给你解析数据，再也不用去寻找各种方法去解析json，xml等数据了
        'Content-Type': 'application/json'
      },
      data: {},

      success: function (result) {
        console.log("初始化七牛返回token:", result); //token: 后端返回的上传验证信息
        that.setData({
          uptoken: result.data.uptoken,
        })
        initQiniu(result.data);
        qiniuUploader.upload(that.data.tempimg, (res) => {
            // let that = this
            var obj = JSON.stringify(res.imageURL)
            that.setData({
              'imageObject': res,
            })

            let imgobj = that.data.imageObject;
            // console.log(imgobj);
            if (imgobj != '') {
              that.setData({
                imgUrl: 'http://' + imgobj.imageURL
              })
            }

            if (that.data.textimgTitle == '') {
              that.add();
            } else {
              that.addOneItem();
            }

            // //对象存储中外链默认域名 http://p2mksxx.bkt.clouddn.com/
          },
          (error) => {
            //   console.error('error: ' + JSON.stringify(error));
          }, {
            region: 'SCN', // 华南
            // ECN, SCN, NCN, NA, ASG，分别对应七牛的：华东，华南，华北，北美，新加坡 5 个区域
            qiniuUploadToken: that.data.uptoken,
            domain: 'imgchatbot.uavserve.online', // bucket 域名，下载资源时用到。如果设置，会在 success callback 的 res 参数加上可以直接使用的 ImageURL 字段。否则需要自己拼接。
            shouldUseQiniuFileName: false,
          },
          // null, // 可以使用上述参数，或者使用 null 作为参数占位符
          progress => {
            console.log("上传进度", progress.progress);
            console.log("已经上传的数据长度", progress.totalBytesSent);
            console.log(
              "预期需要上传的数据总长度",
              progress.totalBytesExpectedToSend
            );
            that.log = "上传进度" + progress.progress;
          },
          cancelTask => {
            // that.setData({ cancelTask });
            // this.cancelTask = cancelTask;
          }
        );

        wx.hideLoading()
        wx.showToast({
          title: '上传成功2',
          icon: 'success',
          duration: 1000
        })

      },
      fail: err => {
        // handle error
        wx.showModal({
          title: '提示',
          content: '七牛token获取失败 转腾讯云备用上传',
          showCancel: false
        })

        that.useTecentCloud();
        return;
      },
      complete: res => {

        // that.add();
      }
    })



    // ------------七牛官方sdk--------------

    // var url = app.globalData.url
    // // 初始化七牛相关参数
    function initQiniu(res) {
      var options = {
        region: 'SCN', // 华南
        // ECN, SCN, NCN, NA, ASG，分别对应七牛的：华东，华南，华北，北美，新加坡 5 个区域
        uptoken: res.uptoken,
        // uptokenURL: 'https://[yourserver.com]/api/uptoken',
        // uptoken: 'xxxx',
        domain: 'imgchatbot.uavserve.online', // bucket 域名，下载资源时用到。如果设置，会在 success callback 的 res 参数加上可以直接使用的 ImageURL 字段。否则需要自己拼接。
        shouldUseQiniuFileName: false
      };
      qiniuUploader.init(options);
    }
  },


  // ----------------选择图片 ----------------
  uploadimg() {
    if (this.data.classId == '') {
      wx.showModal({
        title: '提示',
        content: '课程id不能为空',
        showCancel: false
      })
      return;
    } else if (this.data.className == '') {
      wx.showModal({
        title: '提示',
        content: '课程名不能为空',
        showCancel: false
      })
      return;
    }
    var that = this;
    // that.data.imgnum
    wx.chooseImage({
      count: 1,
      //最多4个
      //         原图           压缩     相册   相机
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        var imgs = res.tempFilePaths[0];

        that.setData({
          tempimg: imgs, //临时数组
          imgnum: imgs.length
        });

        that.addimgToCloud();
      }
    })
  },

  // --------------- 左侧 上传特殊类型功能方法集

  setInteract() {
    this.setData({
      setwait: true,
      btnDie: true,
    });
    this.bottom();
  },

  //、、、、、设置图文
  setTextImg() {
    this.setData({
      setTextImg: true,
      btnDie: true,
    });
    this.bottom();
  },
  // 、、、、设置封面
  setFrontImg() {
    this.setData({
      setFrontImg: true,
      btnDie: true,
    });
    this.bottom();
  },

  getbtnNum: function (e) {
    this.data.interactData = [] //先清空

    var regNum = new RegExp('[0-9]', 'g');
    var rsNum = regNum.exec(e.detail.value);
    console.log(typeof (rsNum))

    // if(!rsNum){
    //     setTimeout(()=>{
    //         wx.showToast({
    //             title: '输入数字',
    //             icon: 'none'
    //         })
    //     },1000);
    //     return
    //   }

    let btnNum = e.detail.value
    if (btnNum > 4) {
      wx.showModal({
        title: '超额了',
        content: '暂时最多支持4个互动按钮',
        showCancel: false
      })
      this.setData({
        btnNum: 0,
      });
      return;
    }
    //  else if(typeof(btnNum)!='Number')
    // {

    //   console.log(typeof(btnNum))
    //   wx.showModal({
    //     title: '恐怕不是数字吧',
    //     content: '皇上请输入数字~',
    //     showCancel: false
    //   })
    // }
    else {
      // console.log(typeof(btnNum))
      this.setData({
        btnNum: btnNum,
      });
    }
  },

  getAnswer(e) {
    if (e.detail.value) {
      let answer = e.detail.value;
      this.setData({
        answer: answer,
      });
    }
  },

  getInputValue(e) {
    // console.log(e);
    if (e.detail.value) {
      let interactData = this.data.interactData;
      interactData[this.data.btnIndex] = e.detail.value;
      this.setData({
        interactData: interactData,
      });
    }
  },

  updateInteractData(e) {
    // console.log(e);
    let index = e.currentTarget.dataset.i;
    // console.log(index)
    // if (e.detail.value)
    // {
    //   let interactData = [];
    //   interactData[index] = e.detail.value;
    this.setData({
      btnIndex: index,
    });
    // }
  },

  // ----------------上传图文准备---------------

  getTitle(e) {
    if (e.detail.value) {
      let value = e.detail.value;
      this.setData({
        textimgTitle: value,
      });
    }
  },

  getContent(e) {
    if (e.detail.value) {
      let value = e.detail.value;
      this.setData({
        message: value,
      });
    }
  },

  getSrc(e) {
    if (e.detail.value) {
      let value = e.detail.value;
      this.setData({
        imgUrl: value,
      });
    }
  },

  // ----------  上传互动  -----------------
  submitInteract() {
    if (this.data.classId == '') {
      wx.showModal({
        title: '提示',
        content: '课程id不能为空',
        showCancel: false
      })
      return;
    } else if (this.data.className == '') {
      wx.showModal({
        title: '提示',
        content: '课程名不能为空',
        showCancel: false
      })
      return;
    } else if (this.data.btnNum == null || this.data.btnNum == 0 || this.data.interactData.length <= 0) {
      wx.showModal({
        title: '提示',
        content: '不能没有任何互动按钮',
        showCancel: false
      })
      return;
    }

    wx.cloud.init({
      env: 'talkbot-56sn5'
    })
    wx.cloud.init()
    //  下面是云函数的调用
    // console.log(wx.getStorageSync("openid"));
    var btnNum = this.data.btnNum;
    let contentData = {
      contentType: 'Interact',
      isBot: true,
      classCollection: ClassCollection,
      classId: parseInt(this.data.classId),
      className: this.data.className,
      chapterName: this.data.chapterName,

      detail: {
        btnNum: this.data.btnNum,
        interactData: this.data.interactData,
        answer: this.data.answer,
      },

    }
    let that = this;

    var newInteract = {
      content: 'this is a newInteract which have' + btnNum + '个Btn',
      src: '',
      imgfile: '',
      time: time.formatTime(new Date, 'Y/M/D'),
      is_show_right: 1,
    }
    this.setData({
      contentData: contentData,
      interactData: [],
      btnNum: 0,
      newData: newInteract
    })


    wx.cloud.callFunction({
      name: 'HW-add_foodContent',
      data: {
        contentData: that.data.contentData,
      },
      success: res => {
        // console.log(res.result)
        that.data.centendata.push(newInteract);
        // that.data.centendata.push(this.data.newData);
        this.setData({
          // news_input_val: '',
          centendata: that.data.centendata,
          imgUrl: '',
          message: '',
          setwait: false,
          btnDie: false,
          answer: '',
        })
        this.bottom();
      },
      fail: err => {
        // handle error
        wx.showModal({
          title: '提示',
          content: '课程内容上传出错 请检查网络',
          showCancel: false
        })
        return;
      },
      complete: res => {
        console.log('callFunction test result: ', res)
      }
    })

    // this.setData({
    //   centendata: that.data.centendata,
    // });

  },

  close(e) {
    this.setData({
      setwait: false,
      setTextImg: false,
      btnDie: false,
      setFrontImg: false,
    });
  },




  // -------------辅助交互 自动化调用方法------------

  // 获取hei的id节点然后屏幕焦点调转到这个节点
  bottom: function () {
    var query = wx.createSelectorQuery() // 创建节点查询器 query
    query.select('#hei').boundingClientRect() //获取节点位置信息的查询请求
    query.selectViewport().scrollOffset() //这段代码的意思是获取页面滑动位置的查询请求
    query.exec(function (res) {
      wx.pageScrollTo({
        // scrollTop: res[0].bottom  // #the-id节点的下边界坐标
        // scrollTop: res[0].bottom ,// #the-id节点的下边界坐标
        scrollTop: res[1].scrollHeight + 50 // 显示区域的竖直滚动位置
      })
      // res[1].scrollTop // 显示区域的竖直滚动位置
    })
  },

  bindChange: function (e) {
    this.data.message = e.detail.value
  },

  bindChange1: function (e) {
    this.data.classId = e.detail.value
  },

  bindChange2: function (e) {
    this.data.className = e.detail.value
  },
  bindChange3: function (e) {
    this.data.chapterName = e.detail.value
  },

  preimage(e) {
    var imgurl = this.data.centendata[e.currentTarget.dataset.i];
    var final_url = JSON.stringify(imgurl);
    if (this.data.tempimg.length != 0) {
      wx.previewImage({
        current: imgurl,
        urls: [this.data.tempimg],
      })
    }
    // console.log(final_url);
    // console.log(e);
    // console.log(this.data.tempimg[e.currentTarget.dataset.i]);
  },

  del() {

    let that = this;
    if (this.data.className == '') {
      wx.showModal({
        title: '提示',
        content: '课程名不能为空',
        showCancel: false
      })
      return;
    } else if (this.data.classId == '') {
      wx.showModal({
        title: '提示',
        content: '章节ID不能为空',
        showCancel: false
      })
      return;
    } else if (this.data.chapterName == '') {
      wx.showModal({
        title: '提示',
        content: '章节名不能为空',
        showCancel: false
      })
      return;
    } else {
      wx.showModal({
        title: "确认删除？",
        content: "本次删除不可恢复~",
        showCancel: true,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')

            wx.showModal({
              title: '提示',
              content: '小朋友,我不能给你这个权限',
              showCancel: false
            })
            return;


            //调用云函数
            wx.cloud.init({
              env: 'talkbot-56sn5'
            })
            wx.cloud.init()
            console.log(that.data.className)
            console.log(ClassCollection)
            // wx.cloud.callFunction({
            //   name: 'del_chapter',
            //   data: {
            //     classCollection: ClassCollection,
            //     classId: parseInt(that.data.classId),
            //     className: that.data.className,
            //     chapterName: that.data.chapterName,
            //   },
            //   success: res => {
            //     wx.showModal({
            //       title: '提示',
            //       content: '成功删除该章节~',
            //       showCancel: false,
            //     })
            //     return;
            //   },
            //   fail: err => {
            //     // handle error
            //     wx.showModal({
            //       title: '提示',
            //       content: '删除失败 请检查网络~',
            //       showCancel: false,
            //     })
            //     return;
            //   },
            //   complete: res => {
            //     console.log('callFunction test result: ', res)
            //   }
            // })

            // ----------- 云函数 end---------------

          } else {
            console.log('用户点击取消')
          }
        }
      })
    }

  },
})