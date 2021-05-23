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

  await db.collection(event.contentData.classCollection).add({
    data: {
      contentType: event.contentData.contentType,
      classId: event.contentData.classId,
      className: event.contentData.className,
      chapterName:event.contentData.chapterName,
      isBot: true,
      content: event.contentData.content,
      textImgArray: event.contentData.textImgArray,
      src: event.contentData.src,
      textimgTitle: event.contentData.textimgTitle,
      imgfile: event.contentData.imgfile,
      time: event.contentData.time,
      detail: event.contentData.detail,
    }
  }); //success!!!!!!!!!!!!!!!!!!!!!

  let sucess = {
    state: '200'
  }

  return {
    sucess
  }
}