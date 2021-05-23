// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  traceUser: true,
  env: 'talkbot-56sn5'
})
cloud.init()
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  var classContent = await db.collection(event.classCollection)
    .where({
      classId: event.classId,
      className:event.className,
      chapterName:event.chapterName
    })
    .get()

  return {
    // event,
    classContent,
    // openid: wxContext.OPENID,
    // appid: wxContext.APPID,
    // unionid: wxContext.UNIONID,
  }
}