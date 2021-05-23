// 云函数入口文件
const cloud = require('wx-server-sdk')
const CryptoJS = require('crypto-js')
const WebSocket = require('ws')
var log = require('log4node')
var fs = require('fs')

cloud.init()

// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()


  // 系统配置 
  const config = {
    // 请求地址
    hostUrl: "wss://tts-api.xfyun.cn/v2/tts",
    host: "tts-api.xfyun.cn",
    //在控制台-我的应用-在线语音合成（流式版）获取
    appid: "5ec5251c",
    //在控制台-我的应用-在线语音合成（流式版）获取
    apiSecret: "2bbc2d07ff582ebc5d2773eca698ce5a",
    //在控制台-我的应用-在线语音合成（流式版）获取
    apiKey: "07752490a2f7e49f5f3428c0414a44fe",
    text: event.content,
    uri: "/v2/tts",
  }

  // 获取当前时间 RFC1123格式
  let date = (new Date().toUTCString())
  // 设置当前临时状态为初始化
  let wssUrl = config.hostUrl + "?authorization=" + getAuthStr(date) + "&date=" + date + "&host=" + config.host
  let ws = new WebSocket(wssUrl)

  console.log(date);

  // 连接建立完毕，读取数据进行识别
  ws.on('open', () => {
    log.info("websocket connect!")
    send()
    // 如果之前保存过音频文件，删除之
    // if (fs.existsSync('./test.pcm')) {
    //   fs.unlink('./test.pcm', (err) => {
    //     if (err) {
    //       log.error('remove error: ' + serr)
    //     }
    //   })
    // }
  })


  // 得到结果后进行处理，仅供参考，具体业务具体对待
  const audioData = ws.on('message', (data, err) => {
    if (err) {
      log.error('message error: ' + err)
      return
    }
    let res = JSON.parse(data)
    if (res.code != 0) {
      log.error(`${res.code}: ${res.message}`)
      ws.close()
      return
    }
    let audio = res.data.audio
    let audioBuf = Buffer.from(audio, 'base64')
    const resultData = {
      res:res,
      audioBuf: audioBuf,
      audio: audio
    }
    console.log(audioBuf)

    // save(audioBuf)

    if (res.code == 0 && res.data.status == 2) {
      ws.close()
    }
  })

  // 资源释放
  ws.on('close', () => {
    log.info('connect close!')
  })

  // 连接错误
  ws.on('error', (err) => {
    log.error("websocket connect err: " + err)
  })


  // 鉴权签名
  function getAuthStr(date) {
    let signatureOrigin = `host: ${config.host}\ndate: ${date}\nGET ${config.uri} HTTP/1.1`
    let signatureSha = CryptoJS.HmacSHA256(signatureOrigin, config.apiSecret)
    let signature = CryptoJS.enc.Base64.stringify(signatureSha)
    let authorizationOrigin = `api_key="${config.apiKey}", algorithm="hmac-sha256", headers="host date request-line", signature="${signature}"`
    let authStr = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(authorizationOrigin))
    return authStr
  }

  // 传输数据
  function send() {
    let frame = {
      // 填充common
      "common": {
        "app_id": config.appid
      },
      // 填充business
      "business": {
        "aue": "raw",
        "auf": "audio/L16;rate=16000",
        "vcn": "xiaoyan",
        "speed": "50",
        "reg": 2,
        "tte": "UTF8", //小语种必须使用UNICODE编码，合成的文本需使用utf16小端的编码方式
        "bgs": 1,
      },
      // 填充data
      "data": {
        "text": Buffer.from(config.text).toString('base64'),
        "status": 2
      }
    }
    ws.send(JSON.stringify(frame))
  }

  // 保存文件
  // function save(data) {
  //   fs.writeFile('./test.pcm', data, {
  //     flag: 'a'
  //   }, (err) => {
  //     if (err) {
  //       log.error('save error: ' + err)
  //       return
  //     }

  //     log.info('文件保存成功')
  //   })
  // }

  return {
    audioBuf: audioData,
    // mess: mess
  }
}