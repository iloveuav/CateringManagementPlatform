// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  traceUser: true,
  env: 'talkbot-56sn5'
})
cloud.init()
const db = cloud.database()
const _ = db.command
const $ = db.command.aggregate
// 云函数入口函数

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  var engAllCourse = await db.collection('Hanalyse-IndustrialPark').aggregate()
    .group({
      // 按 category 字段分组
      _id: {
        className: '$className',
        chapterName: '$chapterName',
      },
      courseNum: $.sum(1),
      courseId: $.first('$classId'),
      // first: 1,
      // data: $.data('$chapterName'),
      // 让输出的每组记录有一个 avgSales 字段，其值是组内所有记录的 sales 字段的平均值
      // avgSales: $.avg('$sales')
    })
    .end()
  // engAllCourse.forEach(v=>{

  // })


  var jaAllCourse = await db.collection('Hanalyse-WuZhong').aggregate()
    .group({
      // 按 category 字段分组
      _id: {
        className: '$className',
        chapterName: '$chapterName',
      },
      courseNum: $.sum(1),
      courseId: $.first('$classId'),
    })
    .end()


    var otherAllCourse = await db.collection('Hanalyse-kunShan').aggregate()
    .group({
      // 按 category 字段分组
      _id: {
        className: '$className',
        chapterName: '$chapterName',
      },
      courseNum: $.sum(1),
      courseId: $.first('$classId'),
    })
    .end()

  var allCourseMess = await db.collection('Hanalyse-allClientMess')
    .get()

  var userCourseMess = await db.collection('Hanalyse-allUser')
    .get()

  return {
    engAllCourse,
    jaAllCourse,
    otherAllCourse,
    allCourseMess,
  }
}