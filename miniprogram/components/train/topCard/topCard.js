// components/train/topCard/topCard.js


Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {

    topImg:'http://q9uen5wtx.bkt.clouddn.com/topCard.gif',
    trainType: [
      {
        className: '英语',
        src: 'http://q9uen5wtx.bkt.clouddn.com/engTrain.gif',
        classid: '',
        where: '',
        classdetail: '',
      },
      {
        className: '日语',
        src: 'http://q9uen5wtx.bkt.clouddn.com/jaTrain.gif',

        where: '',
        classdetail: '',
      },
      {
        className: '待上线',
        src: '',
        classid: 2,
        where: '',
        classdetail: '制作中。。。',
      },
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
