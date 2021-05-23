// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  traceUser: true,
  env: 'talkbot-56sn5'
})
const db = cloud.database()
const _ = db.command
cloud.init()

// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()

  try {
    return await db.collection(event.classCollection).where({
      classId: event.classId,
      className: event.className,
      chapterName:event.chapterName,
    }).remove()
  } catch(e) {
    console.error(e)
  }

  return {
  event
  }
}