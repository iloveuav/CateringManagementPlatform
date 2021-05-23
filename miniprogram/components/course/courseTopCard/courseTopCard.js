// components/course/courseTopCard/courseTopCard.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    courseObject:{
      type:Object,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    
    selectArray: []
  },

  /**
   * 组件的方法列表
   */
  methods: {

    getcurrentChapter: function (e) {
      // console.log(e.detail)
      let currentChapter = e.detail
      this.triggerEvent('changeChapter', currentChapter)
    },
  }
})
