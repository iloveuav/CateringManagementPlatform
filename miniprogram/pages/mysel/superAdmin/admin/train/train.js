import * as echarts from '../../../../../ec-canvas/echarts';

const app = getApp();

function initChart(canvas, width, height, dpr) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(chart);

  var raderOption = {
    title: {
      text: ''
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      left: 'center',
      data: ['现在', '21天前']
    },
    radar: [

      {
        indicator: [{
            text: '天赋',
            max: 100
          },
          {
            text: '阅读',
            max: 100
          },
          {
            text: '听力',
            max: 100
          },
          {
            text: '语法',
            max: 100
          },
          {
            text: '单词',
            max: 100
          }
        ],
        radius: 80,
        center: ['50%', '45%'],
      },

    ],
    series: [
      {
        type: 'radar',
        radarIndex: 0,
        areaStyle: {},
        data: [{
            value: [85, 40, 10, 65, 15],
            name: '现在'
          },
          {
            value: [95, 80, 95, 90, 93],
            name: '21天前'
          }
        ]
      },
    ]
  };
  chart.setOption(raderOption);
  return chart;
}


function initCrossChart(canvas, width, height, dpr) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(chart);

  let corssOption = {
    title: {
      text: '本周XX菜品趋势'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    legend: {
      data: ['', '', '', '已获得积分', '总积分数']
    },
    toolbox: {
      feature: {
        saveAsImage: {}
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: [
      {
        name: '',
        type: 'line',
        stack: '总量',
        areaStyle: {},
        data: [0]
      },
      {
        name: '',
        type: 'line',
        stack: '总量',
        areaStyle: {},
        data: [0]
      },
      {
        name: '',
        type: 'line',
        stack: '总量',
        areaStyle: {},
        data: [0]
      },
      {
        name: '已获得积分',
        type: 'line',
        stack: '总量',
        areaStyle: {},
        data: [320, 332, 301, 334, 390, 330, 1220]
      },
      {
        name: '总积分数',
        type: 'line',
        stack: '总量',
        label: {
          normal: {
            show: true,
            position: 'top'
          }
        },
        areaStyle: {},
        data: [820, 932, 901, 934, 1290, 1330, 1330]
      }
    ]
  };
  chart.setOption(corssOption);
  return chart;
}

Page({
  onShareAppMessage: function(res) {
    return {
      title: 'ECharts 可以在微信小程序中使用啦！',
      path: '/pages/index/index',
      success: function() {},
      fail: function() {}
    }
  },
  data: {
    rader: {
      onInit: initChart
    },
    cross: {
      onInit: initCrossChart
    },


    
  },

  onReady() {}
});