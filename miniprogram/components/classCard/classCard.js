// components/classCard.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    corseArray: {
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
    currentChooseCard: 0,
   
  },

  /**
   * 组件的方法列表
   */
  methods: {

    onLoad: function() {
      this.data.paramA // 页面参数 paramA 的值

    },

    toClass(e) {
      // let islogin = wx.getStorageSync(islogin);
      // if (islogin == false || islogin == undefined) {
      //   wx.showModal({
      //     title: '提示',
      //     content: '您还没有登录 课程内容将不被记录',
      //     showCancel: false
      //   })
      let currentChooseCard = this.data.currentChooseCard;
      if (this.data.pageName == "admin")
      {
        wx.navigateTo({
          //这里传值
          url: "../../AddEngClassContent/AddEngClassContent?currentChooseCard=" + currentChooseCard ,
        })
      }
      else{
       
        let userEngCId = -1;
        let userJaCId = -1;
        if (wx.getStorageSync('userEngclassId')) {
          userEngCId = wx.getStorageSync('userEngclassId');
        }
        if (wx.getStorageSync('userJaclassId')) {
          userJaCId = wx.getStorageSync('userJaclassId');
        }
        let cid = currentChooseCard == 0 ? userEngCId : userJaCId;
        wx.navigateTo({
          //这里传值
          url: "../../pages/TalkBot/TalkBot?currentChooseCard=" + currentChooseCard + "&classid=" + cid,
        })
      }
      return;
      // }


    },



    touchCardEnd() {
      this.setData({
        scrollLeft: this.data.currentChooseCard * 130,
        allClass: [{
            className: '英语',
            src: '',
          },
          {
            className: '日语',
            src: '',
          },
          {
            className: '操作系统',
            src: '',
          },
        ],

      });
    },

    chooseCardScroll(e) {
      let currentCard;
      let temp;
      let item4 = 375.5;
      let item3 = 210;
      if (this.data.allClass.length == 4) {
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
      } else if (this.data.allClass.length == 3) {
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