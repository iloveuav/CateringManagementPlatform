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
    allVisitorNumber: {
      type: Number,
      value: '数据加载有误',
    },
    todayVisitorNumber: {
      type: Number,
      value: '数据加载有误',
    },
    nowtime: {
      type: String,
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

  }
})