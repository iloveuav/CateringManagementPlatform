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
  try {
    return db.collection('allCourseMess').where({
      courseName: event.courseMess.name
    }).count()
      .then(res => {
        console.log('count', res)
        if (res.total <= 0) {
          return db.collection('allCourseMess').add({
            data: {
              courseName: event.courseMess.name,
              courseMess:event.courseMess
            }
          })
        } else {
          return db.collection('allCourseMess').where({
            courseName: event.courseMess.name
          }).update({
            data: {
              courseMess: event.courseMess
            },
          })
        }
      })
     
  } catch (e) {
    console.error(e)
  }


}