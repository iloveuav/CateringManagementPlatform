// components/index/indexCourseCard/courseCard.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    corseArray: {
      type: Object,
      value: '数据加载有误',
    },
    currentIndex: {
      type: Number,
      value: '数据加载有误',
    },
    remind: {
      type: String,
    }


  },

  /**
   * 组件的初始数据
   */
  data: {
    currentSwiperIndex: 0,
    remind: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    swiperBindchange(e) {
      this.setData({
        currentSwiperIndex: e.detail.current,
        courseDetail: this.data.corseArray[e.detail.current]
      })
      let currentCourse = {
        currentIndex: e.detail.current,
        courseDetail: this.data.corseArray[e.detail.current]
      }
      this.triggerEvent('changeCourse', currentCourse)
    },

    toCourse(e) {
      // console.log(this.data.corseArray);
      let corseArray = this.data.corseArray;
      let currentSwiperIndex = this.data.currentSwiperIndex;

      // console.log(corseArray[currentSwiperIndex].data)
      // console.log(corseArray[currentSwiperIndex].data[0]._id)
      let CurrentChapter = {
        courseId: corseArray[currentSwiperIndex].data[0].courseId,
        className: corseArray[currentSwiperIndex].data[0]._id.className,
        chapterName: corseArray[currentSwiperIndex].data[0]._id.chapterName,
        id : corseArray[currentSwiperIndex].data[0].id,
        reset : false
      }
      // console.log(CurrentChapter)

      let str = JSON.stringify(corseArray[currentSwiperIndex]);
      let Cc = JSON.stringify(CurrentChapter);
      wx.navigateTo({
        //这里传值
        url: "../../pages/TakeOrderBot/TakeOrderBot?course=" + str + "&Cc=" + Cc,
      })

      // let userEngCId = 1;
      // let userJaCId = 1;
      // let cid = 1;
      // if (wx.getStorageSync('userEngclassId')) {
      //   userEngCId = wx.getStorageSync('userEngclassId');
      // }
      // if (wx.getStorageSync('userJaclassId')) {
      //   userJaCId = wx.getStorageSync('userJaclassId');
      // }
      // if (corseArray[currentSwiperIndex].courseType=='eng')
      // {
      //   cid = userEngCId
      // }
      // else
      // {
        // cid = userJaCId
      // }

      
        // let cid = currentChooseCard == 0 ? userEngCId : userJaCId;
       
    },
  }
})