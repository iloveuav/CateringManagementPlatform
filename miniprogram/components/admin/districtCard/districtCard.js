// components/classCard.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    objectArray: {
      type: Object,
      value: '数据加载有误',
    },
    intoBtnName: {
      type: String,
      value: '数据加载有误',
    },
    pageName: {
      type: String,
      value: '数据加载有误',
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    currentSwiperIndex:0,
    objectArray: [
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {

    swiperBindchange(e) {
      this.setData({
        currentSwiperIndex: e.detail.current,
        courseDetail: this.data.objectArray[e.detail.current]
      })
      let currentCourse = {
        currentIndex: e.detail.current,
        courseDetail: this.data.objectArray[e.detail.current]
      }
      this.triggerEvent('changeCourse', currentCourse )
    },

    toClass(e) {
      // let islogin = wx.getStorageSync(islogin);
      // if (islogin == false || islogin == undefined) {
      //   wx.showModal({
      //     title: '提示',
      //     content: '您还没有登录 课程内容将不被记录',
      //     showCancel: false
      //   })
      let currentChooseCard = this.data.currentSwiperIndex;
      if (this.data.pageName == "admin")
      {
        wx.navigateTo({
          //这里传值
          url: "../../AddEngClassContent/AddEngClassContent?currentChooseCard=" + currentChooseCard ,
        })
      }
      
      return;
      // }


    },



    touchCardEnd() {
      this.setData({
        scrollLeft: this.data.currentChooseCard * 130,
      });
    },

    chooseCardScroll(e) {
      let currentCard;
      let temp;
      let item4 = 375.5;
      let item3 = 210;
      if (this.data.objectArray.length == 4) {
        temp = item4 / 4;
        if (e.detail.scrollLeft <= temp - 10) {
          currentCard = 0;
        } else if (e.detail.scrollLeft <= temp * 2) {
          currentCard = 1;
        } else if (e.detail.scrollLeft <= temp * 3 + 10) {
          currentCard = 2;
        } else {
          currentCard = 3;
        }
      } else if (this.data.objectArray.length == 3) {
        temp = item3 / 3;
        if (e.detail.scrollLeft <= temp - 10) {
          currentCard = 0;
        } else if (e.detail.scrollLeft <= temp * 2 + 10) {
          currentCard = 1;
        } else {
          currentCard = 2;
        }
      }
      this.setData({
        currentChooseCard: currentCard,

      });
    },
    touchCardEnd() {
      this.setData({
        scrollLeft: this.data.currentChooseCard * 130
      });
    },

  },



})