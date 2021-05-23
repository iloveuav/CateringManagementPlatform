// miniprogram/pages/index/index.js
import * as echarts from '../../../ec-canvas/echarts';

const app = getApp();
var allCourseMess = wx.getStorageSync('allCourseMess');


function initChart(canvas, width, height, dpr) {
  // 拿到全局变量
  var parameter = app.globalData.parameter;
  allCourseMess = wx.getStorageSync('allCourseMess');

  const chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(chart);
  var data = [];

  for (var i = 0; i <= 360; i++) {
    var t = i / 180 * Math.PI;
    var r = Math.sin(2 * t) * Math.cos(2 * t);
    data.push([r, i]);
  }

  var option = {
    title: {
      text: '苏州餐饮数据中心',
      left: 'center',
      textStyle: {

        color: '#1a1b4e',

        fontStyle: 'normal',

        fontSize: 24
      },
      subtext: '数据来源：苏州各区'
    },
    tooltip: {
      formatter: '{b}:<br />课程数据： {c}项数据'
    },
    series: [{
      name: '苏州各区',
      type: 'treemap',
      visibleMin: 100,
      itemStyle: {
        normal: {
          label: {
            show: true,
            formatter: "{b}"
          },
          borderWidth: 2
        },
        emphasis: {
          label: {
            show: true
          }
        }
      },
      label: {
        normal: {
          fontSize: 14
        }
      },

      data: [ // 注意，最外层是一个数组，而非从某个根节点开始。
        {
          value: 100,
          children: [{
            value: allCourseMess[0].children.length, // value字段的值，对应到面积大小。
            // 也可以是数组，如 [2323, 43, 55]，则数组第一项对应到面积大小。
            // 数组其他项可以用于额外的视觉映射，详情参见 series-treemp.levels。
            id: 'someid-1', // id 不是必须设置的。
            // 但是如果想使用 API 来改变某个节点，需要用 id 来定位。
            name: allCourseMess[0].name, // 显示在矩形中的描述文字。
            children: allCourseMess[0].children,
            label: { // 此节点特殊的 label 定义（如果需要的话）。
              // ...         // label的格式参见 series-treemap.label。
            },
            itemStyle: { // 此节点特殊的 itemStyle 定义（如果需要的话）。
              // ...         // label的格式参见 series-treemap.itemStyle。
            }
          }, {
              value: allCourseMess[1].children.length,
            id: 'someid-2',
            name: allCourseMess[1].name,
              children: allCourseMess[1].children,
          }, {
            value: allCourseMess[2].children.length,
          id: 'someid-3',
          name: allCourseMess[2].name,
            children: allCourseMess[2].children,
        }
        ]
        },
      ],

      leafDepth: 2,
      color: ["#FFA54F", "#FF8040", "#FFD39B", "#FF4500"]
    }]
  };

  chart.setOption(option);
  return chart;
}
Page({

  /**
   * 页面的初始数据
   */
  data: {

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

    ec: {
      onInit: initChart
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    allCourseMess = wx.getStorageSync('allCourseMess');
    this.data.allCourseDemo.forEach(v=>{
      allCourseMess.forEach(v1=>{
        if(v.name==v1.name)
        {
          v.value = v1.children.length
        }
      })
    })
    this.setData({
      allCourseDemo:this.data.allCourseDemo
    })

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

  },

  getAllClient() { 
    wx.cloud.init({
      env: 'talkbot-56sn5'
    })
    wx.cloud.init()
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
        let num = 0
        // 处理日语
        let children = res.result.jaAllCourse.list
        // 因为后面需要echart数据可视化 属性名改一下
        children.forEach(v => {
          v.name = v._id;
          v.value = v.courseNum;
          v.courseType = 'ja'
          v.courseId = num++
          // console.log(UserCourseMess=='')
          if (UserCourseMess == '') {
            let progress = 0
            v.courseProgress = "课程进度 -  " + progress + '%';
            v.progress = 1
          } else {
            UserCourseMess.forEach(v2 => {
              let progress = 0
              v.courseProgress = "课程进度 -  " + progress + '%';
              if (v.name == v2.name) {
                let progress = (v2.courseId / v.courseNum) * 100;
                v.courseProgress = "课程进度 -  " + progress + '%';
                v.progress = v2.courseId
              }
            })
          }
        })
        let jaCourse = {
          value: res.result.jaAllCourse.list.length,
          id: 'jacourse',
          name: '日语课程',
          children: children
        }
        allCourse.push(jaCourse)

        //处理英语
        children = res.result.engAllCourse.list
        // 因为后面需要echart数据可视化 属性名改一下 对children进行章节分组


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
        num = 0
        let courseMess = nList
        // console.log(courseMess)
        courseMess.forEach(v => {
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

          // v.forEach(ch=>{
            if (UserCourseMess == '') {
              v.progress = 1
              let progress = 0
              v.courseProgress = "课程进度 -  " + progress + '%';
            } else {
              UserCourseMess.forEach(v2 => {
                let progress = 0
                v.courseProgress = "课程进度 -  " + progress + '%';
                v.progress = 1
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
          v.courseId = num++;
        })

        // console.log(nList)
        let engCourse = {
          value: res.result.engAllCourse.list.length,
          id: 'engcourse',
          name: '英语课程',
          children: nList
        }
        allCourse.push(engCourse)
        this.setData({
          allCourse: allCourse
        })

        wx.setStorageSync('allCourseMess', allCourse);
        // wx.setStorageSync('usercourseMess', allCourse);
        this.setData({
          allCourseMess: allCourse
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
