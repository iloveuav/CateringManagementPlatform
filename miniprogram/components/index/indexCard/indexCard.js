// components/OrderCard/orderCard.js
Component({
  /**
   * 组件的属性列表
   */
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  properties: {
    user: {
      type: Object,
      value: '数据加载有误',
    },
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    toFeedBack: function(e) {
      if (this.data.islogin == false) {
        wx.showModal({
          title: '提示',
          content: '您还没有登录',
          showCancel: false
        })
        return;
      }
      wx.showLoading({
        title: '加载中',
      })
      wx.navigateTo({
        url: '/pages/mysel/FeedBack/FeedBack',
      })
      wx.hideLoading()
    },
  }
})