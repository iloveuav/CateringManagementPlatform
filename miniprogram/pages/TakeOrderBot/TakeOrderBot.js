// miniprogram/pages/TalkBot/TalkBot.js

const app = getApp();
const plugin = requirePlugin("WechatSI")
const windowHeight = wx.getSystemInfoSync().windowHeight;
const windowWidth = wx.getSystemInfoSync().windowWidth;
// 课程内容获取状态管理
const classCollection = ''; //请求集合名 目前就只有英语和日语两个集合
var Centendata = []; //当前课程内容  
var CurrentChapter = {}; //当前章节对象 {courseId,className,chapterName}
// 历史  （暂时不考虑记忆历史了）

let EngchatHistory = [];
let JachatHistory = [];
let LeftOverClassConten = []; //待输出的课程内容（剩余内容）

//待输出的课程内容  （暂时停用）
// let EngLeftOverClassConten = wx.getStorageSync('EngloClassContent');
// let JaLeftOverClassConten = wx.getStorageSync('JaloClassContent');
let EngLeftOverClassConten = [];
let JaLeftOverClassConten = [];

//用户课程记录
let UserCourseMess = wx.getStorageSync('UserCourseMess');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    userbtns: [],
    test: 0,
    wait: false,
    growid: 0,
    btnDie: false,
    start: false,
    autoReadingAloud: false, //自动读开关

    classLength: 0,

    className: "",
    centendata: [],



    // chatHistory: chatHistory,
    currentDataItem: {},
    isVoicePlay: true,
    // 后两个用来设置scroll-view的scroll-into-view
    scrollHeight: '',
    startPageX: 0,
    currentChooseCard: 1,
    scrollLeft: 130,
    chooseList: [1, 2, 3],

    classCollection: '',
    continueBtn: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let corseObject = JSON.parse(options.course);
    let Cc = JSON.parse(options.Cc);
    CurrentChapter = Cc //正确获取index页面传过来的课程信息 
    // console.log(nowclassid);
    // console.log(corseObject);

    var that = this;
    this.setData({
      corseObject: corseObject,
    })


    // this.getNewClassContent(classCollection);
  },

  onShareAppMessage: function () {

  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.updateScrollHeightByFooter();

    //创建内部 audio 上下文 InnerAudioContext 对象。
    this.innerAudioContext = wx.createInnerAudioContext();
    this.innerAudioContext.onError(function (res) {
      // console.log(res);
      wx.showToast({
        title: '语音播放失败',
        icon: 'none',
      })
    })
    // this.onShow();

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {



    // this.onLoad();
    // 暂时停用 历史缓存
    // let EngchatHistory = wx.getStorageSync('EnghistoryContent');
    // // let EngchatHistory = [];
    // let JachatHistory = wx.getStorageSync('JahistoryContent');
    // // let JachatHistory = [];
    // let LeftOverClassConten = wx.getStorageSync('loClassContent');
    // // let LeftOverClassConten = [];

    // let EngLeftOverClassConten = wx.getStorageSync('EngloClassContent');
    // let JaLeftOverClassConten = wx.getStorageSync('JaloClassContent');
    // // let EngLeftOverClassConten = [];
    // // let JaLeftOverClassConten = [];

    let corseObject = this.data.corseObject;
    // --------------新历史缓存--------------------
    // 从缓存中找当前课本的缓存记录 并注入
    LeftOverClassConten = wx.getStorageSync(corseObject.name);
    //注入当前课本的历史数据
    Centendata = wx.getStorageSync('history' + corseObject.name)
    let cen = Centendata.length
    console.log("cen" + cen)
    if (cen <= 0) {
      Centendata = []
      console.log('木有历史记录')
    }
    // ------------新历史缓存end----------------

    // console.log(corseObject);
    var classCollection = '';
    let continueBtn = false;
    var that = this;
    // console.log('是否还能继续' + LeftOverClassConten.length);



    if (corseObject.courseType == 'eng') {
      classCollection = "Hanalyse-IndustrialPark";
    } else if (corseObject.courseType == 'ja') {
      classCollection = "Hanalyse-WuZhong";
    } else if (corseObject.courseType == 'other') {
      classCollection = "Hanalyse-kunShan";
    }
    let hisdataLength = LeftOverClassConten.length
    if (hisdataLength > 0) {
      // continue按钮
      continueBtn = true;
    } else {
      LeftOverClassConten = []
    }

    // if (LeftOverClassConten.length != 0) {
    //   continueBtn = true;
    // }
    // if (LeftOverClassConten != '' && LeftOverClassConten != undefined && LeftOverClassConten != '') {
    //   continueBtn = true
    // }


    this.setData({
      classCollection: classCollection,
      centendata: Centendata,
      hisclassLength: Centendata.length,
      continueBtn: continueBtn,
      classLength: LeftOverClassConten.length,
      className: this.data.corseObject.name
    })

    this.bottom();
    if (continueBtn == false && this.data.classLength != 0) {
      this.showTeach();
    }

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

  changeautoRA: function () {
    this.data.autoReadingAloud = !this.data.autoReadingAloud
  },

  // ============================================================

  showTeach: function () {
    this.setData({
      start: true,
      continueBtn: false,
      classLength: LeftOverClassConten.length,
    })
    let that = this;
    // let classContent = wx.getStorageSync('newClassContent');
    // console.log(classContent);
    // LeftOverClassConten = wx.getStorageSync('loClassContent');

    if (LeftOverClassConten == '' || null || undefined) {
      // console.log(LeftOverClassConten);
      this.getNewClassContent();
    } else {
      // console.log(NewclassContent);
      // 遍历注入新的课程内容到Centendata
      // var loDataArray = LeftOverClassConten.splice(this.data.growid, LeftOverClassConten.length);
      var loclassLength = LeftOverClassConten.length;
      // console.log(loclassLength)
      for (let i = 0; i < loclassLength; i++) {
        let that = this;
        // this.bottom();
        // -------------------拿出首项  并移除----------------
        let data = LeftOverClassConten[0];
        LeftOverClassConten.splice(0, 1);
        // console.log(LeftOverClassConten);
        // ----------------------更新剩余LO----------------
        if (data.contentType == 'Interact') {
          //  先显示互动内容
          // centendata = this.data.centendata;
          this.data.centendata.push(data);
          that.setData({
            centendata: this.data.centendata
          })
          this.bottom();
          this.sleep(100);
          // this.bottom();
          // 为互动设置样式
          this.setData({
            wait: true,
            time: 60,
            btnDie: false,
          })
          // 暂时没用定时需求
          // that.init(that);          //这步很重要，没有这步，重复点击会出现多个定时器
          // var time = that.data.time;
          // console.log("倒计时开始")
          // var interval = setInterval(function() {
          //   that.setData({
          //     // time: that.data.time - 1,
          //   })
          // }, 1000)
          break; //跳出当前遍历   相当于暂停
        } else {
          // 不是互动 显示即可
          // console.log(data);
          // centendata = this.data.centendata;

          Centendata.push(data);
          that.setData({
            centendata: Centendata
          })
          if (this.data.autoReadingAloud) {
            this.speach(data.content);
          }

          this.bottom();
          this.sleep(100);
          // 更新本地历史记录
          wx.setStorageSync('history' + this.data.corseObject.name, this.data.centendata)
          //剩余内容更新
          wx.setStorageSync(this.data.corseObject.name, LeftOverClassConten)
        }
        this.sleep(500);
      }

      //  进入下一课
      // this.toNextClass();
      if (LeftOverClassConten.length == 0) {
        this.setData({
          // continueBtn: true,
          classLength: 0
        })
      }
    }

  },

  // 判断本地NewclassContent有没有数据 没用就获取新的注入
  getNewClassContent: function (e) {
    // let classcollection = e;
    let that = this
    console.log("即将请求获得  参数：" + CurrentChapter)
    if (CurrentChapter == '' || CurrentChapter == undefined || JSON.stringify(CurrentChapter) == "{}") {
      wx.showModal({
        title: '提示',
        content: '没有选择章节~',
        showCancel: false
      })
      return;
    }
    // 如果需要请求新的课程内容 （已经遍历注入完最后一条课程内容）
    if (LeftOverClassConten == '' || null || undefined) {
      // console.log("get class----" + e);
      wx.cloud.init({
        env: 'talkbot-56sn5'
      })
      wx.cloud.init()
      //  下面是云函数的调用
      // console.log(wx.getStorageSync("openid"));
      // console.log(this.data.classCollection);
      wx.cloud.callFunction({
        name: 'HW-getFoodContent',
        data: {
          // classCollection:'EngClassContents',
          classCollection: this.data.classCollection,
          classId: CurrentChapter.courseId,
          className: CurrentChapter.className,
          chapterName: CurrentChapter.chapterName,
        },
        success: res => {
          let classContent = res.result.classContent.data;
          // console.log(res.result)
          if (res.result.classContent.data.length <= 0 || null || undefined) {
            wx.showModal({
              title: '提示',
              content: '当前课程暂未开放 请切换课程id',
              showCancel: false
            })
          } else {
            // wx.setStorageSync('loClassContent', classContent)
            LeftOverClassConten = classContent;

            if (UserCourseMess == '' || null || undefined) {
              UserCourseMess = [{
                className: CurrentChapter.className,
                courseId: CurrentChapter.courseId,
                chapterName: CurrentChapter.chapterName,
                id: CurrentChapter.id,
              }]
              console.log(UserCourseMess)
              wx.setStorageSync('UserCourseMess', UserCourseMess);
            } else {
              let exit = false;
              //更新 用户课程使用记录
              console.log("更新 用户课程使用记录  exit:" + exit)
              UserCourseMess.forEach(v => {
                if (v.className == CurrentChapter.className) {
                  v.courseId = CurrentChapter.courseId
                  v.chapterName = CurrentChapter.chapterName
                  v.id = CurrentChapter.id
                  exit = true;
                  return
                }
              })
              console.log(exit);
              if (exit == false) {
                let newCrouseMess = {
                  className: CurrentChapter.className,
                  courseId: CurrentChapter.courseId,
                  chapterName: CurrentChapter.chapterName,
                  id: CurrentChapter.id,
                }
                UserCourseMess.push(newCrouseMess);
              }
              wx.setStorageSync('UserCourseMess', UserCourseMess);
            }
          }

          this.setData({
            classLength: LeftOverClassConten.length,
            LeftOverClassConten: LeftOverClassConten,
            // growid: 0
          })
        },
        fail: err => {
          // handle error
        },
        complete: res => {
          console.log('callFunction test result: ', res)
          // wx.setStorageSync("newEngClass", classContent);
          if (res.result.classContent.data.length > 0) {
            this.showTeach();
          }

        }
      })
    } else {
      this.showTeach();
    }
  },


  dealInteract: function (e) {

    // console.log(e);
    // this.stopTap();
    // console.log(e.currentTarget.dataset.id);
    if (e != undefined) {
      let that = this;
      // console.log(e.currentTarget.dataset.answer);
      let btnValue = e.currentTarget.dataset.detail.interactData[e.currentTarget.dataset.id];
      let answer = e.currentTarget.dataset.detail.answer;
      let growid = e.currentTarget.dataset.growid;
      // console.log(growid);
      // console.log('index:'+btnValue);
      // ----------为点击过的按钮修改样式------------
      let leng = Centendata.length;
      // if(leng == )
      console.log("拿到刚刚点击的按钮" + leng);
      console.log("给按钮加属性" + Centendata[leng - 1].detail);
      Centendata[leng - 1].detail.choosed = e.currentTarget.dataset.id;
      // console.log("给按钮加属性" + this.data.centendata[1]);

      if (answer != '') {
        if (btnValue && answer) {
          var data = {}
          if (btnValue == answer) {
            data = {
              contentType: 'text',
              isBot: true,
              content: '小朋友  你答对啦~  👍👍👍',
            }
            // growid = growid + 1;
          } else {
            data = {
              contentType: 'text',
              isBot: true,
              content: '小朋友你心中是否有很多问号？ 正确答案是：' + answer,
            }
          }
        }

        Centendata.push(data);
        // this.updateScrollHeightByFooter();
        this.setData({
          centendata: Centendata,
          wait: false,
          growid: growid,
          btnDie: true,
        })
      
        this.bottom();
        // this.toScrollBottom();
      }
    }
    // ------------上面是执行从互动按过来的处理 
    if (this.data.classLength != 0) {
      this.showTeach();
    }

  },






  sleep: function (delay) {
    for (var t = Date.now(); Date.now() - t <= delay;);
  },

  /**
   * 暂停倒计时
   */
  stopTap: function () {
    var that = this;
    // console.log("倒计时暂停")
    this.clearTimeInterval(this)
  },



  template: function (e) {
    var data = {
      content: ".....",
      // time: time.formatTime(new Date, 'Y/M/D'),
      is_show_right: 2,
    }
    this.data.centendata.push(data);
    this.setData({
      centendata: this.data.centendata
    })
    this.bottom();
    // this.toScrollBottom();
  },

  todetail(e) {
    // console.log(e.currentTarget.dataset.i);
    // console.log(e);
    // var imgurl = this.data.centendata[e.currentTarget.dataset.i].img;

    // if (imgurl != '') {
    //   var final_url = JSON.stringify(imgurl);
    //   wx.previewImage({
    //     current: final_url,
    //     urls: [],
    //   })
    // }

    // wx.navigateTo({
    //   //这里传值
    //   url: '/pages/order_detail/order_detail?ispublic=false',
    // })
  },

  preimage(e) {
    // console.log(e);
    var imgurl = this.data.centendata[e.currentTarget.dataset.i].src;
    // var imgurl = this.data.centendata[e.currentTarget.dataset.i];
    // console.log(imgurl)
    var final_url = JSON.stringify(imgurl);
    if (imgurl) {
      wx.previewImage({
        current: imgurl,
        urls: [imgurl],
      })
    }
  },



  bottom: function () {

    // console.log(`item${this.data.centendata.length }`);
    this.setData({
      toLast: `item${this.data.centendata.length+1}`
    })
    // --------------

    let that = this;
    var query = wx.createSelectorQuery() // 创建节点查询器 query
    query.select('#hei').boundingClientRect() //获取节点位置信息的查询请求
    query.selectViewport().scrollOffset() //这段代码的意思是获取页面滑动位置的查询请求
    query.exec(function (res) {
      // console.log("function-bottom:", res)
      // console.log("function-bottom:", res[1].scrollHeight)

      if (that.data.centendata.length > 2) {
        wx.pageScrollTo({
          // scrollTop: res[0].bottom  // #the-id节点的下边界坐标
          // scrollTop: res[0].bottom, // #the-id节点的下边界坐标
          scrollTop: res[1].scrollHeight, // 显示区域的竖直滚动位置
          // select:'.hei',
          duration: 700
        })
      }

      // console.log(res[1].scrollHeight);
      // res[1].scrollTop // 显示区域的竖直滚动位置
    })
  },

  toScrollBottom: function () {
    // console.log('msg-' + (this.data.centendata.length - 1));
    // this.setData({
    //   // toMessageBottom: 'msg-' + (this.data.chatHistory.length - 1)
    //   toMessageBottom: 'msg-' + (this.data.centendata.length - 1)
    // });
  },

  // 根据footer的高度 自动调整ScrollView的高度
  updateScrollHeightByFooter: function () {
    let that = this;
    let query = wx.createSelectorQuery();
    query.select('#hei').boundingClientRect()
    query.exec(function (res) {
      // console.log()
      // let scrollHeight = windowHeight - res[0].height;
      let scrollHeight = windowHeight;
      that.setData({
        scrollHeight: scrollHeight + "px"
      })
    })
  },


  checkAnswer(e) {
    // console.log(e); 
    this.stopTap();
    // console.log(e.currentTarget.dataset.id);
    // console.log(e.currentTarget.dataset.answer);
    let btnValue = e.currentTarget.dataset.id;
    let answer = e.currentTarget.dataset.answer.answer;
    if (btnValue == answer) {
      let data = {
        type: 'text',
        is_show_right: 1,
        contentData: {
          content: '你答对啦',
        }
      }
      this.data.centendata.push(data);

    } else {
      let data = {
        type: 'text',
        is_show_right: 1,
        contentData: {
          content: '你答错啦',
        }
      }
      this.data.centendata.push(data);

    }
    this.setData({
      centendata: this.data.centendata,
      wait: false
    })
    this.bottom();
    // this.toScrollBottom();
    // 更新历史缓存
    wx.setStorageSync('history' + this.data.corseObject.name, this.data.centendata)
    //剩余内容更新
    wx.setStorageSync(this.data.corseObject.name, LeftOverClassConten)

  },

  startTeach() {
    this.getNewClassContent();
  },

  toNextClass() {
    // this.setData({
    //   nowclassid: this.data.nowclassid + 1
    // })
    let lastCc = CurrentChapter
    if (lastCc.courseId < this.data.corseObject.data.length) {
      CurrentChapter = {
        className: this.data.corseObject.data[lastCc.courseId]._id.className,
        chapterName: this.data.corseObject.data[lastCc.courseId]._id.chapterName,
        courseId: lastCc.courseId + 1,
      }
      console.log(CurrentChapter)
      this.getNewClassContent();
    } else {
      wx.showModal({
        title: '提示',
        content: '当前课程暂未开放 请切换课程id',
        showCancel: false
      })
    }

  },

  speach(e) {
    console.log(e);
    let that = this
    let lto = '';
    let content = '';
    lto = 'en_US';
    if (this.data.classCollection == 'otherClassContents' || this.data.classCollection == 'JaClassContents') {
      lto = 'zh_CN'
    }
    if (this.data.autoReadingAloud == true) {
      // console.log(e);
      content = e
      // console.log(e);
      // console.log(lto);
    } else {
      if (e.currentTarget.dataset.content != undefined && this.data.autoReadingAloud == false) {
        content = e.currentTarget.dataset.content;
        console.log(content)
      }
    }


    // console.log(e.currentTarget.dataset.content);

    //   // console.log(e.currentTarget.dataset.content);
    //   lto = 'en_US';

    // } else {
    //   // lto = 'en_US';
    //   // console.log(e);
    //   // content = e.detail.content;
    // }
    // console.log(content);
    // // ---------------通过云函数调用讯飞接口----------
    // wx.cloud.init({
    //   env: 'talkbot-56sn5'
    // })
    // wx.cloud.init()
    // //  下面是云函数的调用
    // // console.log(wx.getStorageSync("openid"));
    // wx.cloud.callFunction({
    //   name: 'xftts',
    //   data: {
    //     content: content
    //   },
    //   success: res => {
    //     console.log(res)
    //     // wx.setStorageSync("my", items);
    //   },
    //   fail: err => {
    //     // handle error
    //   },
    //   complete: res => {
    //     console.log('callFunction test result: ', res)
    //     that.setData({
    //       voicePath : res.result.audioBuf.url
    //     })

    //     that.yuyinPlay();
    //   }
    // })

    // --------------调用API----------------

    // wx.request({
    //   url: 'http://api.xfyun.cn/v1/service/v1/tts', //这里填写你的接口路径
    //   header: { //这里写你借口返回的数据是什么类型，这里就体现了微信小程序的强大，直接给你解析数据，再也不用去寻找各种方法去解析json，xml等数据了
    //     'Content-Type': 'application/json'
    //   },
    //   data: {//这里写你要请求的参数
    //     API_KEY: '07752490a2f7e49f5f3428c0414a44fe',
    //     APP_ID: '5ec5251c',
    //     TEXT: content 
    //   },

    //   success: function (res) {
    //     //这里就是请求成功后，进行一些函数操作
    //     console.log(res.data)
    //   }
    // })

    // -------------下面是同声传译插件的-----------

    if (content && lto) {
      plugin.textToSpeech({
        lang: lto,
        content: content,
        success: resTrans => {
          console.log(resTrans);
          if (resTrans.retcode == 0) {
            // let tmpTranslate = Object.assign({}, item, {
            autoPlay: true, // 自动播放背景音乐
            that.setData({
              voicePath: resTrans.filename,
            })
            that.yuyinPlay();
          }
          else {
            // console.warn("语音合成失败", resTrans, item)
            console.warn("语音合成失败", resTrans, item)
          }
        },
        fail: function (resTrans) {
          console.warn("语音合成失败")
          wx.showToast({
            title: '取消自动朗读后重试',
            icon: 'none',
          })
        }
      })
    }

  },

  //播放语音
  yuyinPlay: function (e) {
    if (this.data.voicePath == '') {
      // console.log("暂无语音");
      return;
    }
    this.innerAudioContext.src = this.data.voicePath
    this.innerAudioContext.play();
  },


  // 结束语音
  end: function (e) {
    this.innerAudioContext.pause();
  },

  // 监听滚动条坐标
  onPageScroll: function (e) {
    // console.log(e)
    var that = this
    var scrollTop = e.scrollTop
    var backTopValue = scrollTop > 500 ? true : false
    that.setData({
      backTopValue: backTopValue
    })
  },

  // 滚动到顶部
  backTop: function () {
    // 控制滚动
    wx.pageScrollTo({
      scrollTop: 0
    })
  },

  //根据顶部信息 动态改变课程内容
  getcurrentChapter: function (e) {
    console.log(e.detail)
    CurrentChapter = e.detail
    var that = this
    //由于第一次进入页面会自动调用这个函数  需要先判断排除
    if (this.data.start != false) {
      wx.showModal({
        title: '准备好上课了吗？',
        content: '（切换章节会让你失去目前的进度）',
        cancelText: "取消",
        confirmText: "继续",
        success(res) {
          if (res.cancel == true) {
            return;
          }
          if (res.confirm == true) {
            // 更新章节
            CurrentChapter = e.detail
            Centendata = []
            LeftOverClassConten = [] //得把已经注入的待上课内容清空 不然会导致新内容排在后面
            that.setData({
              centendata: Centendata
            })
            // 调用获取课程内容的函数
            that.getNewClassContent();
          }
        }
      })
      // ---------- 
    } else {
      this.data.start = true
    }

  },

})