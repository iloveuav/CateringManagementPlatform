const monthList = [
  { active: false, value: '1', label: '一月' }, { active: false, value: '2', label: '二月' },
  { active: false, value: '3', label: '三月' }, { active: false, value: '4', label: '四月' },
  { active: false, value: '5', label: '五月' }, { active: false, value: '6', label: '六月' },
  { active: false, value: '7', label: '七月' }, { active: false, value: '8', label: '八月' },
  { active: false, value: '9', label: '九月' }, { active: false, value: '10', label: '十月' },
  { active: false, value: '11', label: '十一月' }, { active: false, value: '12', label: '十二月' }
]
let date = new Date()
const y = date.getFullYear()
const m = date.getMonth() + 1 > 10 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`
let d = date.getDate() > 10 ? date.getDate() : `0${date.getDate()}`
let nowValue = `${y}/${m}/${d}`
Component({
  properties: {
    start: {
      type: String,
      value: ''
    },
    end: {
      type: String,
      value: ''
    }
  },
  data: {
    isArrayYear: false,
    selectionMode: 'day',
    year: y,
    yearList: [],
    month: m >10 ? m : m.substr(1),
    monthList: [...monthList],
    week: ['日', '一', '二', '三', '四', '五', '六'],
    dateArr: []
  },
  attached () {
    this.dateInit()
  },
  methods: {
    getDay (e) {
      const { item } = e.currentTarget.dataset
      if (item.able) {
        console.log(item)
        this.triggerEvent('change', { value: item.value })
      }
    },
    //显示日期选择
    selDay (e) {
      let { month } = e.currentTarget.dataset
      this.setData({ month, selectionMode: 'day' })
      month--
      this.dateInit(this.data.year, month)
    },
    //显示月份选择
    selMonth (e) {
      switch (this.data.selectionMode) {
        case 'day':
          this.setData({ selectionMode: 'month' });
          break;
        case 'year':
          const { year } = e.currentTarget.dataset
          this.setData({ isArrayYear: false, year, selectionMode: 'month' })
          break
      }
    },
    //显示年份选择
    selYear () {
      if (this.data.selectionMode == 'year') return
      const list = this.buildArrayYear(this.data.year)
      this.setData({ isArrayYear: true, year: [list[0], list[list.length - 1]], yearList: list, selectionMode: 'year' })
    },
    // 增减月份
    changeMonth (e) {
      const { value } = e.currentTarget.dataset
      let month = this.data.month * 1 + value * 1
      if (month == 0 || month > 12) return
      this.setData({ month })
      if (this.data.selectionMode == 'day') {
        month--
        this.dateInit(this.data.year, month)
      }
    },
    // 增减年份
    changeYear (e) {
      const { num, value } = e.currentTarget.dataset
      if (this.data.selectionMode == 'year') {
        let start = this.data.year[0] * 1 + num * 1
        const list = this.buildArrayYear(start)
        this.setData({ year: [list[0], list[list.length - 1]], yearList: list })
      } else {
        let year = this.data.year * 1 + value * 1
        if (this.data.selectionMode == 'day') {
          this.dateInit(year, this.data.month - 1)
        }
        this.setData({ year })
      }
    },
    // 生成年份
    buildArrayYear (start) {
      start = Math.floor(start / 10) * 10
      const list = [start]
      for (let i = 0; i < 9; i++) {
        start++
        list.push(start)
      }
      return list
    },
    //生成日历
    dateInit (setYear, setMonth) {
      if (setYear) {
        setYear = setYear * 1
      }
      if (setMonth) {
        setMonth = setMonth * 1
      }
      let dateArr = [];                       //需要遍历的日历数组数据
      let arrLen = 0;                         //dateArr的数组长度
      let now = setYear ? new Date(setYear, setMonth) : new Date();
      let year = setYear || now.getFullYear();
      let nextYear = 0;
      let month = setMonth || now.getMonth();                 //没有+1方便后面计算当月总天数
      let nextMonth = month + 1 > 11 ? 1 : month + 1;
      let startWeek = new Date(year + '/' + (month + 1) + '/' + 1).getDay();                          //目标月1号对应的星期
      let dayNums = new Date(year, nextMonth, 0).getDate();               //获取目标月有多少天
      let obj = {};
      let num = 0;
      if (month + 1 > 11) {
        nextYear = year + 1;
        dayNums = new Date(nextYear, nextMonth, 0).getDate();
      }
      arrLen = startWeek + dayNums;
      for (let i = 0; i < arrLen; i++) {
        if (i >= startWeek) {
          num = i - startWeek + 1;
          let m = month + 1 > 9 ? month + 1 : `0${month+1}`
          let d = num + 1 > 9 ? num : `0${num}`
          let value = `${year}/${m}/${d}`
          let times = new Date(value).getTime()
          let active = false
          let isToday = times == new Date(nowValue).getTime()
          let able = false
          let start = ''
          let end = ''
          if (this.data.start) {
            start = new Date(this.data.start)
            able = start <= times
          }
          if (this.data.end) {
            end = new Date(this.data.end)
            able = times <= end
          }
          if (start && end) {
            able = start <= times && times <= end
          }
          if (!start && !end) {
            able = true
          }
          obj = { able, isToday, active, label: num, value }
        } else {
          obj = {};
        }
        dateArr[i] = obj;
      }
      this.setData({ dateArr })
    }
  }
})