// miniprogram/pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    remind : '加载中',


    // -------------用户卡片本地假数据--------
    user: {
      userName: "访客", //用户名
      userRank: 3, //用户等级
      integral: 5620000, //积分
      clockDays: 25, //连续打卡天数
      weekClock: 5, //本周学习天数
      rankIcon: 'https://one.zzux.net/image/level.png' //根据用户级别显示Icon
    },
    engcourseArray: [
      //   {
      //   courseName: "英语入门", //课程名称
      //   courseId: -1, //课程Id
      //   courseType: 'eng', //课程类型
      //   courseProgress: "Grammar - 课程 1 / 4", //课程进度
      //   courseSrc: "https://one.zzux.net/image/engcover.jpg" //课程封面
      // }, 
      // {
      //   courseName: "英语初级", //课程名称
      //   courseId: 9, //课程Id
      //   courseType: 'eng', //课程类型
      //   courseProgress: "Vocabulary - 课程 1 / 3", //课程进度
      //   courseSrc: "https://one.zzux.net/image/engcover.jpg" //课程封面
      // }, {
      //   courseName: "英语高级", //课程名称
      //   courseId: 19, //课程Id
      //   courseType: 'eng', //课程类型
      //   courseProgress: "Vocabulary - 课程 1 / 2", //课程进度
      //   courseSrc: "https://one.zzux.net/image/engcover.jpg" //课程封面
      // }, 
    ],

    jacorseArray: [
      //   {
      //   courseName: "日语入门", //课程名称
      //   courseId: -1, //课程Id
      //   courseType: 'ja', //课程类型
      //   courseProgress: "Grammar - 课程 1 / 4", //课程进度
      //   courseSrc: "http://imgchatbot.uavserve.online/%E8%AF%BE%E6%9C%AC%E5%B0%81%E9%9D%A2.png" //课程封面
      // }, {
      //   courseName: "日语初级", //课程名称
      //   courseId: 9, //课程Id
      //   courseType: 'ja', //课程类型
      //   courseProgress: "Vocabulary - 课程 1 / 2", //课程进度
      //   courseSrc: "http://imgchatbot.uavserve.online/%E8%AF%BE%E6%9C%AC%E5%B0%81%E9%9D%A2.png" //课程封面
      // }, {
      //   courseName: "日语高级", //课程名称
      //   courseId: 19, //课程Id
      //   courseType: 'ja', //课程类型
      //   courseProgress: "Vocabulary - 课程 1 / 2", //课程进度
      //   courseSrc: "http://imgchatbot.uavserve.online/%E8%AF%BE%E6%9C%AC%E5%B0%81%E9%9D%A2.png" //课程封面
      // },
    ],


    currentIndex: 0,


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({
      remind : '加载中',
    })
    this.getAllCourse();
    
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
    // this.onLoad();
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

  getcurrentCourse: function (e) {
    console.log(e.detail)
  },
  getcurrentCourse: function (e) {
    console.log(e.detail)
  },



  getAllCourse() {

    wx.cloud.init({
      env: 'talkbot-56sn5'
    })
    //  下面是云函数的调用
    // console.log(wx.getStorageSync("openid"));
    // console.log(this.data.classCollection);
    // console.log(this.data.nowclassid*1);
    wx.cloud.callFunction({
      name: 'HW-get_allClientMess',
      data: {},
      success: res => {
        console.log(res)
        console.log('callFunction test result: ', res)
        let allCourse = []

        let courseFrontImgArray = res.result.allCourseMess.data
        let UserCourseMess = wx.getStorageSync('UserCourseMess')
        let progress
        let num = 1
        // 处理日语------------------------------------------------------------------------------------
        let children = res.result.jaAllCourse.list
        // 因为后面需要echart数据可视化 属性名改一下

        var map = {},
          nList = []
        //对章节按照课程分组--------------------------------------------------------------------------------
        children.forEach(v => {
          let item = v
          // console.log(!map[item])
          // console.log(item._id.className)
          if (!map[item._id.className]) {
            nList.push({
              name: item._id.className,
              value: item.courseNum,
              courseType: 'ja',
              data: [item]
            })
            map[item._id.className] = item
          } else {
            //遍历nList
            for (var j = 0; j < nList.length; j++) {
              var nItem = nList[j]
              //如查找到date符合则添加
              if (nItem.name == item._id.className) {
                nItem.data.push(item)
                //跳出循环
                break
              }
            }
          }
        })
        //对章节按照课程分组end----------------------------------------------------------------------
        num = 1
        // let courseMess = nList
        // console.log(courseMess)
        nList.forEach(v => {
          // 进一步处理 加上课程进度 课程封面 并且将章节数组根据classId排序
          // 设置为升序
          function compare(key) {
            return function (value1, value2) {
              var val1 = value1[key];
              var val2 = value2[key];
              return val1 - val2;
            }
          }
          v.data.sort(compare('courseId'));
          v.courseProgress = "课程进度 -  " + '0%';
          v.progress = v.data[0].courseId
          // v.forEach(ch=>{
          if (UserCourseMess == '') {
            v.progress = v.data[0].courseId
            let progress = 0
            v.courseProgress = "课程进度 -  " + progress + '%';
          } else {
            UserCourseMess.forEach(v2 => {
              let progress = 0
             
              if (v.name == v2.className) {
                progress = Number((v2.courseId / v.data.length)).toFixed(2) * 100;
                // console.log(v)
                v.courseProgress = "课程进度 -  " + progress + '%';
                v.progress = v2.courseId
              }
            })
          }
          // })

          courseFrontImgArray.forEach(v3 => {
            if (v.name == v3.courseMess.name) {
              v.frontImg = v3.courseMess.frontImg
            }
          })
          v.id = num++;
        })
        let jaCourse = {
          value: res.result.jaAllCourse.list.length,
          id: 'jacourse',
          name: '吴中',
          children: nList
        }
        allCourse.push(jaCourse)
        //处理日语end-----------------------------------------------------------------------------------
        //处理英语------------------------------------------------------------------------------------
        children = res.result.engAllCourse.list
        // 因为后面需要echart数据可视化 属性名改一下 对children进行章节分组


        map = {},
          nList = []
        //对章节按照课程分组--------------------------------------------------------------------------------
        children.forEach(v => {
          let item = v
          // console.log(!map[item])
          // console.log(item._id.className)
          if (!map[item._id.className]) {
            nList.push({
              name: item._id.className,
              value: item.courseNum,
              courseType: 'eng',
              data: [item]
            })
            map[item._id.className] = item
          } else {
            //遍历nList
            for (var j = 0; j < nList.length; j++) {
              var nItem = nList[j]
              //如查找到date符合则添加
              if (nItem.name == item._id.className) {
                nItem.data.push(item)
                //跳出循环
                break
              }
            }
          }
        })
        //对章节按照课程分组end----------------------------------------------------------------------
        num = 1
        // courseMess = nList
        // console.log(courseMess)
        nList.forEach(v => {
          // 进一步处理 加上课程进度 课程封面 并且将章节数组根据classId排序
          // 设置为升序
          function compare(key) {
            return function (value1, value2) {
              var val1 = value1[key];
              var val2 = value2[key];
              return val1 - val2;
            }
          }
          v.data.sort(compare('courseId'));
          // 初始化 
          v.progress = v.data[0].courseId
          v.courseProgress = "课程进度 -  " +  '0%';
          // v.forEach(ch=>{
          if (UserCourseMess == '') {
            v.progress = v.data[0].courseId
            let progress = 0
            v.courseProgress = "课程进度 -  " + progress + '%';
          } else {
            UserCourseMess.forEach(v2 => {
              if (v.name == v2.className) {
                console.log(v.name+v2.className+v2.courseId)
                progress = Number((v2.courseId / v.data.length)).toFixed(2) * 100;
                console.log(progress)
                v.courseProgress = "课程进度 -  " + progress + '%';
                v.progress = v2.courseId
              }
            })
          }
          // })

          courseFrontImgArray.forEach(v3 => {
            if (v.name == v3.courseMess.name) {
              v.frontImg = v3.courseMess.frontImg
            }
          })
          v.id = num++;
        })

        // console.log(nList)
        let engCourse = {
          value: res.result.engAllCourse.list.length,
          id: 'engcourse',
          name: '工业园区',
          children: nList
        }
        allCourse.push(engCourse)
        // 处理英语end---------------------------------------------------------------------------------

         // 处理其他课程-----------------------------------------------------------------------------
         children = res.result.otherAllCourse.list
         // 因为后面需要echart数据可视化 属性名改一下
 
          map = {},
           nList = []
         //对章节按照课程分组--------------------------------------------------------------------------------
         children.forEach(v => {
           let item = v
           // console.log(!map[item])
           // console.log(item._id.className)
           if (!map[item._id.className]) {
             nList.push({
               name: item._id.className,
               value: item.courseNum,
               courseType: 'other',
               data: [item]
             })
             map[item._id.className] = item
           } else {
             //遍历nList
             for (var j = 0; j < nList.length; j++) {
               var nItem = nList[j]
               //如查找到date符合则添加
               if (nItem.name == item._id.className) {
                 nItem.data.push(item)
                 //跳出循环
                 break
               }
             }
           }
         })
         //对章节按照课程分组end----------------------------------------------------------------------
         num = 1
         // let courseMess = nList
         // console.log(courseMess)
         nList.forEach(v => {
           // 进一步处理 加上课程进度 课程封面 并且将章节数组根据classId排序
           // 设置为升序
           function compare(key) {
             return function (value1, value2) {
               var val1 = value1[key];
               var val2 = value2[key];
               return val1 - val2;
             }
           }
           v.data.sort(compare('courseId'));
           v.courseProgress = "课程进度 -  " + progress + '%';
           // v.forEach(ch=>{
           if (UserCourseMess == '') {
            v.progress = v.data[0].courseId
             let progress = 0
             v.courseProgress = "课程进度 -  " + progress + '%';
           } else {
             UserCourseMess.forEach(v2 => {
               let progress = 0
               v.courseProgress = "课程进度 -  " + progress + '%';
               v.progress = v.data[0].courseId
               if (v.name == v2.className) {
                 progress = Number((v2.courseId / v.data.length)).toFixed(2) * 100;
                 // console.log(v)
                 v.courseProgress = "课程进度 -  " + progress + '%';
                 v.progress = v2.courseId
               }
             })
           }
           // })
 
           courseFrontImgArray.forEach(v3 => {
             if (v.name == v3.courseMess.name) {
               v.frontImg = v3.courseMess.frontImg
             }
           })
           v.id = num++;
         })
         let otherCourse = {
           value: res.result.jaAllCourse.list.length,
           id: 'othercourse',
           name: '昆山',
           children: nList
         }
         allCourse.push(otherCourse)
         //处理其他课程end------------------------------------------------------------------------------
     

        wx.setStorageSync('allCourseMess', allCourse);
        // wx.setStorageSync('usercourseMess', allCourse);
        this.setData({
          allCourseMess: allCourse,
          allCourse: allCourse,
          remind : '',
        })
      },
      fail: err => {
        // handle error
      },
      complete: res => {

      }
    })
  },

})