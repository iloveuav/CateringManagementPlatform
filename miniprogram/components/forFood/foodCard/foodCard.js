// components/playWhat/playWhat.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    
    scenery: {
      type: Object,
      value: '数据加载有误',
    },
    hotalArray: {
      type: Object,
      value: '数据加载有误',
    },
   city: {
      type: String,
      value: '数据加载有误',
    },
   
  },

  /**
   * 组件的初始数据
   */
  data: {
    HotelId:0,
    checked:false
  },

  /**
   * 组件的方法列表
   */
  methods: {

    getHotelId(e){
      // console.log(e.currentTarget.dataset)
      this.setData({
        HotelId:e.currentTarget.dataset.classId,
        checked:!this.data.checked
      })
    },

    addCityToPK(e){
      // console.log(e)
      let that = this
      setTimeout(function() {
        // console.log(that.data.HotelId)
        let hotel = {
          hotelId: that.data.HotelId,
        }
        that.triggerEvent('getHotalId', hotel)
      }, 500);
    }

  }
})
