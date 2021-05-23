// pages/signature/signature.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgs: [],
    codeImg: '',
    tempFilePaths: [],
    ndaSignPath:'',
    //上面为合成图片数据 下面为签名数据
    canvasName: 'handWriting',
    ctx: '',
    canvasWidth: 0,
    canvasHeight: 0,
    canvasWidth1: 0,
    canvasHeight1: 0,
    transparent: 1, // 透明度
    selectColor: 'black',
    lineColor: '#1A1A1A', // 颜色
    lineSize: 1.5, // 笔记倍数
    lineMin: 0.5, // 最小笔画半径
    lineMax: 4, // 最大笔画半径
    pressure: 1, // 默认压力
    smoothness: 60, //顺滑度，用60的距离来计算速度
    currentPoint: {},
    currentLine: [], // 当前线条
    firstTouch: true, // 第一次触发
    radius: 1, //画圆的半径
    cutArea: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    }, //裁剪区域
    bethelPoint: [], //保存所有线条 生成的贝塞尔点；
    lastPoint: 0,
    chirography: [], //笔迹
    currentChirography: {}, //当前笔迹
    linePrack: [] //划线轨迹 , 生成线条的实际点
  },

  /*======所有自定义函数======*/

  // 笔迹开始
  uploadScaleStart(e) {
    if (e.type != 'touchstart') return false;
    let ctx = this.data.ctx;
    ctx.setFillStyle(this.data.lineColor); // 初始线条设置颜色
    ctx.setGlobalAlpha(this.data.transparent); // 设置半透明
    let currentPoint = {
      x: e.touches[0].x,
      y: e.touches[0].y
    }
    let currentLine = this.data.currentLine;
    currentLine.unshift({
      time: new Date().getTime(),
      dis: 0,
      x: currentPoint.x,
      y: currentPoint.y
    })
    this.setData({
      currentPoint,
      // currentLine
    })
    if (this.data.firstTouch) {
      this.setData({
        cutArea: {
          top: currentPoint.y,
          right: currentPoint.x,
          bottom: currentPoint.y,
          left: currentPoint.x
        },
        firstTouch: false
      })
    }
    this.pointToLine(currentLine);
  },
  // 笔迹移动
  uploadScaleMove(e) {
    if (e.type != 'touchmove') return false;
    if (e.cancelable) {
      // 判断默认行为是否已经被禁用
      if (!e.defaultPrevented) {
        e.preventDefault();
      }
    }
    let point = {
      x: e.touches[0].x,
      y: e.touches[0].y
    }

    //测试裁剪
    if (point.y < this.data.cutArea.top) {
      this.data.cutArea.top = point.y;
    }
    if (point.y < 0) this.data.cutArea.top = 0;

    if (point.x > this.data.cutArea.right) {
      this.data.cutArea.right = point.x;
    }
    if (this.data.canvasWidth - point.x <= 0) {
      this.data.cutArea.right = this.data.canvasWidth;
    }
    if (point.y > this.data.cutArea.bottom) {
      this.data.cutArea.bottom = point.y;
    }
    if (this.data.canvasHeight - point.y <= 0) {
      this.data.cutArea.bottom = this.data.canvasHeight;
    }
    if (point.x < this.data.cutArea.left) {
      this.data.cutArea.left = point.x;
    }
    if (point.x < 0) this.data.cutArea.left = 0;

    this.setData({
      lastPoint: this.data.currentPoint,
      currentPoint: point
    })
    let currentLine = this.data.currentLine
    currentLine.unshift({
      time: new Date().getTime(),
      dis: this.distance(this.data.currentPoint, this.data.lastPoint),
      x: point.x,
      y: point.y
    })
    // this.setData({
    //   currentLine
    // })
    this.pointToLine(currentLine);
  },
  // 笔迹结束
  uploadScaleEnd(e) {
    if (e.type != 'touchend') return 0;
    let point = {
      x: e.changedTouches[0].x,
      y: e.changedTouches[0].y
    }
    this.setData({
      lastPoint: this.data.currentPoint,
      currentPoint: point
    })
    let currentLine = this.data.currentLine
    currentLine.unshift({
      time: new Date().getTime(),
      dis: this.distance(this.data.currentPoint, this.data.lastPoint),
      x: point.x,
      y: point.y
    })
    // this.setData({
    //   currentLine
    // })
    if (currentLine.length > 2) {
      var info = (currentLine[0].time - currentLine[currentLine.length - 1].time) / currentLine.length;
      //$("#info").text(info.toFixed(2));
    }
    //一笔结束，保存笔迹的坐标点，清空，当前笔迹
    //增加判断是否在手写区域；
    this.pointToLine(currentLine);
    var currentChirography = {
      lineSize: this.data.lineSize,
      lineColor: this.data.lineColor
    };
    var chirography = this.data.chirography
    chirography.unshift(currentChirography);
    this.setData({
      chirography
    })
    var linePrack = this.data.linePrack
    linePrack.unshift(this.data.currentLine);
    this.setData({
      linePrack,
      currentLine: []
    })
  },

  retDraw() {
    this.data.ctx.clearRect(0, 0, 700, 730)
    this.data.ctx.draw();

    //设置canvas背景
    this.setCanvasBg("#fff");
  },

  //画两点之间的线条；参数为:line，会绘制最近的开始的两个点；
  pointToLine(line) {
    this.calcBethelLine(line);
    return;
  },
  //计算插值的方式；
  calcBethelLine(line) {
    if (line.length <= 1) {
      line[0].r = this.data.radius;
      return;
    }
    let x0, x1, x2, y0, y1, y2, r0, r1, r2, len, lastRadius, dis = 0,
      time = 0,
      curveValue = 0.5;
    if (line.length <= 2) {
      x0 = line[1].x
      y0 = line[1].y
      x2 = line[1].x + (line[0].x - line[1].x) * curveValue;
      y2 = line[1].y + (line[0].y - line[1].y) * curveValue;
      //x2 = line[1].x;
      //y2 = line[1].y;
      x1 = x0 + (x2 - x0) * curveValue;
      y1 = y0 + (y2 - y0) * curveValue;;

    } else {
      x0 = line[2].x + (line[1].x - line[2].x) * curveValue;
      y0 = line[2].y + (line[1].y - line[2].y) * curveValue;
      x1 = line[1].x;
      y1 = line[1].y;
      x2 = x1 + (line[0].x - x1) * curveValue;
      y2 = y1 + (line[0].y - y1) * curveValue;
    }
    //从计算公式看，三个点分别是(x0,y0),(x1,y1),(x2,y2) ；(x1,y1)这个是控制点，控制点不会落在曲线上；实际上，这个点还会手写获取的实际点，却落在曲线上
    len = this.distance({
      x: x2,
      y: y2
    }, {
      x: x0,
      y: y0
    });
    lastRadius = this.data.radius;
    for (let n = 0; n < line.length - 1; n++) {
      dis += line[n].dis;
      time += line[n].time - line[n + 1].time;
      if (dis > this.data.smoothness) break;
    }
    this.setData({
      radius: Math.min(time / len * this.data.pressure + this.data.lineMin, this.data.lineMax) * this.data.lineSize
    });
    line[0].r = this.data.radius;
    //计算笔迹半径；
    if (line.length <= 2) {
      r0 = (lastRadius + this.data.radius) / 2;
      r1 = r0;
      r2 = r1;
      //return;
    } else {
      r0 = (line[2].r + line[1].r) / 2;
      r1 = line[1].r;
      r2 = (line[1].r + line[0].r) / 2;
    }
    let n = 5;
    let point = [];
    for (let i = 0; i < n; i++) {
      let t = i / (n - 1);
      let x = (1 - t) * (1 - t) * x0 + 2 * t * (1 - t) * x1 + t * t * x2;
      let y = (1 - t) * (1 - t) * y0 + 2 * t * (1 - t) * y1 + t * t * y2;
      let r = lastRadius + (this.data.radius - lastRadius) / n * i;
      point.push({
        x: x,
        y: y,
        r: r
      });
      if (point.length == 3) {
        let a = this.ctaCalc(point[0].x, point[0].y, point[0].r, point[1].x, point[1].y, point[1].r, point[2].x, point[2].y, point[2].r);
        a[0].color = this.data.lineColor;
        // let bethelPoint = this.data.bethelPoint;
        // console.log(a)
        // console.log(this.data.bethelPoint)
        // bethelPoint = bethelPoint.push(a);
        this.bethelDraw(a, 1);
        point = [{
          x: x,
          y: y,
          r: r
        }];
      }
    }
    this.setData({
      currentLine: line
    })
  },
  //求两点之间距离
  distance(a, b) {
    let x = b.x - a.x;
    let y = b.y - a.y;
    return Math.sqrt(x * x + y * y);
  },
  ctaCalc(x0, y0, r0, x1, y1, r1, x2, y2, r2) {
    let a = [],
      vx01, vy01, norm, n_x0, n_y0, vx21, vy21, n_x2, n_y2;
    vx01 = x1 - x0;
    vy01 = y1 - y0;
    norm = Math.sqrt(vx01 * vx01 + vy01 * vy01 + 0.0001) * 2;
    vx01 = vx01 / norm * r0;
    vy01 = vy01 / norm * r0;
    n_x0 = vy01;
    n_y0 = -vx01;
    vx21 = x1 - x2;
    vy21 = y1 - y2;
    norm = Math.sqrt(vx21 * vx21 + vy21 * vy21 + 0.0001) * 2;
    vx21 = vx21 / norm * r2;
    vy21 = vy21 / norm * r2;
    n_x2 = -vy21;
    n_y2 = vx21;
    a.push({
      mx: x0 + n_x0,
      my: y0 + n_y0,
      color: "#1A1A1A"
    });
    a.push({
      c1x: x1 + n_x0,
      c1y: y1 + n_y0,
      c2x: x1 + n_x2,
      c2y: y1 + n_y2,
      ex: x2 + n_x2,
      ey: y2 + n_y2
    });
    a.push({
      c1x: x2 + n_x2 - vx21,
      c1y: y2 + n_y2 - vy21,
      c2x: x2 - n_x2 - vx21,
      c2y: y2 - n_y2 - vy21,
      ex: x2 - n_x2,
      ey: y2 - n_y2
    });
    a.push({
      c1x: x1 - n_x2,
      c1y: y1 - n_y2,
      c2x: x1 - n_x0,
      c2y: y1 - n_y0,
      ex: x0 - n_x0,
      ey: y0 - n_y0
    });
    a.push({
      c1x: x0 - n_x0 - vx01,
      c1y: y0 - n_y0 - vy01,
      c2x: x0 + n_x0 - vx01,
      c2y: y0 + n_y0 - vy01,
      ex: x0 + n_x0,
      ey: y0 + n_y0
    });
    a[0].mx = a[0].mx.toFixed(1);
    a[0].mx = parseFloat(a[0].mx);
    a[0].my = a[0].my.toFixed(1);
    a[0].my = parseFloat(a[0].my);
    for (let i = 1; i < a.length; i++) {
      a[i].c1x = a[i].c1x.toFixed(1);
      a[i].c1x = parseFloat(a[i].c1x);
      a[i].c1y = a[i].c1y.toFixed(1);
      a[i].c1y = parseFloat(a[i].c1y);
      a[i].c2x = a[i].c2x.toFixed(1);
      a[i].c2x = parseFloat(a[i].c2x);
      a[i].c2y = a[i].c2y.toFixed(1);
      a[i].c2y = parseFloat(a[i].c2y);
      a[i].ex = a[i].ex.toFixed(1);
      a[i].ex = parseFloat(a[i].ex);
      a[i].ey = a[i].ey.toFixed(1);
      a[i].ey = parseFloat(a[i].ey);
    }
    return a;
  },
  bethelDraw(point, is_fill, color) {
    let ctx = this.data.ctx;
    ctx.beginPath();
    ctx.moveTo(point[0].mx, point[0].my);
    if (undefined != color) {
      ctx.setFillStyle(color);
      ctx.setStrokeStyle(color);
    } else {
      ctx.setFillStyle(point[0].color);
      ctx.setStrokeStyle(point[0].color);
    }
    for (let i = 1; i < point.length; i++) {
      ctx.bezierCurveTo(point[i].c1x, point[i].c1y, point[i].c2x, point[i].c2y, point[i].ex, point[i].ey);
    }
    ctx.stroke();
    if (undefined != is_fill) {
      ctx.fill(); //填充图形 ( 后绘制的图形会覆盖前面的图形, 绘制时注意先后顺序 )
    }
    ctx.draw(true)
  },
  selectColorEvent(event) {
    console.log(event)
    var color = event.currentTarget.dataset.colorValue;
    var colorSelected = event.currentTarget.dataset.color;
    this.setData({
      selectColor: colorSelected,
      lineColor: color
    })
  },


  async paintSign() {
    let that = this
    wx.canvasToTempFilePath({
      canvasId: 'handWriting',
      fileType: 'png',
      quality: 1, //图片质量
      success(res) {
        console.log(res)
        that.setData({
          codeImg: res.tempFilePath
        })
      }
    })
  },
  //完成
  subCanvas() {
    this.paintSign()

    //---------合成图片--------
    setTimeout(() => {
      this.combinedPhoto()
    }, 1000)

  },
  // 合成图片并自动保存在相册函数
  combinedPhoto() {
    let that = this
    let imgs = that.data.imgs


    if(imgs.length==0)
    {
      wx.showModal({
        title: '提示',
        content: '本机需要重新上传一次NDA图片，请联系管理员',
        showCancel: false
      })
      return;
    }
    
    // 提示用户正在合成，否则用户可能有不当操作或者以为手机卡死
    wx.showLoading({
      title: '合成中......',
      mask: true
    })

    // 创建画布对象
    const ctx = wx.createCanvasContext("myCanvas", that)
    // 获取图片信息，要按照原图来绘制，否则图片会变形 
    wx.getImageInfo({
      src: that.data.imgs[0],
      success: function (res) {
        let _this = that
        // 根据 图片的大小 绘制底图 的大小
        console.log(" 绘制底图 的图片信息》》》", res)
        let imgW = res.width
        let imgH = res.height
        let imgPath = res.path

        that.setData({
          canvasHeight1: imgH,
          canvasWidth1: imgW
        })
        // 绘制底图 用原图的宽高比绘制
        ctx.drawImage(imgPath, 0, 0, imgW, imgH)
        console.log(" 绘制底图 的图片信息》》》", _this.data)
        wx.getImageInfo({
          src: _this.data.codeImg, // 签名图片的路径（签名要提前保存在codeImg里）
          success: function (res) {
            console.log(" 绘制签名》》》", res)
            // 绘制签名
            ctx.drawImage(res.path, 540, imgH - 110, 170, 100)
            ctx.draw()




            setTimeout(() => {
              wx.canvasToTempFilePath({
                canvasId: 'myCanvas',
                success: function (res) {
                  console.log("合成的带有签名的图片success》》》", res)
                  let tempFilePath = res.tempFilePath

                  // 把合成好的照片作为参数 返回时一起传

                  var pages = getCurrentPages();
                  var prevPage = pages[pages.length - 2]; //上一个页面
                  //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
                  prevPage.setData({
                    signature: {
                      ndaSignPath: tempFilePath,
                    }
                  })
                  wx.navigateBack({
                    // 合成图
                    delta: 1, // 返回上一级页面。
                    complete: (res) => {},
                  })



                  // wx.showLoading({
                  //   title: '正在发送邮件',
                  //   mask: true
                  // })
                  console.log("合成的签名的图片的信息》》》", res)
                  // that.setData({
                  //   tempFilePath: res.tempFilePath
                  // })
                  // wx.cloud.callFunction({
                  //   name: 'sendEmail',
                  //   data: {
                  //     path : tempFilePath
                  //   },
                  //   success(res){
                  //     wx.hideLoading({})
                  //     console.log('发送邮件成功',res)
                  //     wx.showModal({
                  //       title: '温馨提示',
                  //       content: '邮件发送成功，可在邮件中查看',
                  //       showCancel: false,
                  //       success(res) {
                  //         wx.clear
                  //         if (res.confirm) {
                  //           that.setData({
                  //             isShow: true
                  //           })
                  //         }
                  //       }
                  //     })
                  //   }
                  // })

                  // // 保存到相册————————————————————此处方便你查看合成好的图片（写好之后删掉）
                  // wx.saveImageToPhotosAlbum({
                  //   filePath: tempFilePath,
                  //   success(res) {
                  //     wx.showModal({
                  //       title: '温馨提示',
                  //       content: '图片保存成功，可在相册中查看',
                  //       showCancel: false,
                  //       success(res) {
                  //         wx.clear
                  //         if (res.confirm) {
                  //           that.setData({
                  //             isShow: true
                  //           })
                  //         }
                  //       }
                  //     })

                  //     that.setData({
                  //       imgs: imgs,
                  //     })
                  //   },

                  //   fail(res) {
                  //     wx.showModal({
                  //       title: '温馨提示',
                  //       content: '图片保存失败，请重试',
                  //       showCancel: false
                  //     })
                  //   }
                  // })
                },
                fail: function (res) {
                  // console.log("生成的图拍呢 失败 fail fail fail ", res)
                  wx.hideLoading()
                  wx.showModal({
                    title: '温馨提示',
                    content: '签名图片合成失败，请重试',
                    showCancel: false
                  })
                }
              }, that)
            }, 1500)
          },
          fail(res) {
            wx.hideLoading()
            wx.showModal({
              title: '温馨提示',
              content: '签名获取失败，请重试',
              showCancel: false
            })
          }
        })

      },
      fail(res) {
        wx.hideLoading()
        wx.showModal({
          title: '温馨提示',
          content: '图片信息获取失败，请重试',
          showCancel: false
        })
      }
    })

  },
  // uploadNDA() {
  //   var _this = this;
  //   //选取本地NDA图片
  //   wx.chooseImage({
  //     count: 1, // 默认9
  //     sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
  //     sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
  //     success: function (res) {
  //       //￥￥￥￥￥￥￥￥￥￥￥选取的NDA图片要放在imgs里作为合成图的背景图片
  //       _this.setData({
  //         imgs: res.tempFilePaths
  //       })
  //     }
  //   })
  //   //上传到NDAImage云存储文件夹
  //   //   wx.showLoading({
  //   //     title: '上传NDA......',
  //   //     mask: true
  //   //   })
  //   //   wx.cloud.uploadFile({
  //   //     cloudPath: 'NDAImage/' + _this.data.imgs.slice(_this.data.imgs.length - 20, _this.data.imgs.length),
  //   //     filePath: _this.data.imgs,
  //   //     success: res => {
  //   //       wx.hideLoading();
  //   //       console.log("上传成功",res);
  //   //     },
  //   //     fail: err => {
  //   //       wx.hideLoading();
  //   //       console.log("上传失败", err)
  //   //     }
  //   //   })
  // },

  // ----------------------------获取NDA图片---------------

  // getNda: function () {
  //   // 获取云端上保密协议的内容
  //   wx.cloud.init()
  //   //  下面是云函数的调用
  //   wx.cloud.callFunction({
  //     name: 'get_Nda',
  //     data: {},
  //     success: res => {
  //       this.setData({
  //         // remind: '',
  //         instructions: res.result.Nda.data[0].NdaText,
  //         nowNdaUrl: res.result.Nda.data[0].NDAimageUrl,
  //         imgs: "https://6661-fangkejilu-jcgws-1302869141.tcb.qcloud.la/NDAImages/deb95c8f07f92fc7.png?sign=30accdd0f187d279635ea3cbabec0234&t=1599535231"
  //         // imgs:res.result.Nda.data[0].NDAimageUrl
  //       })
  //     },
  //     fail: err => {
  //       // handle error
  //       wx.showModal({
  //         title: '获取失败',
  //         content: '请检查网络',
  //         showCancel: false,
  //       })
  //     },
  //     complete: res => {
  //       console.log('callFunction test result: ', res)
  //     }
  //   })
  // },

  //预览
  previewCanvasImg() {
    wx.canvasToTempFilePath({
      canvasId: 'handWriting',
      fileType: 'jpg',
      quality: 1, //图片质量
      success(res) {
        // console.log(res.tempFilePath, 'canvas生成图片地址');


        wx.previewImage({
          urls: [res.tempFilePath], //预览图片 数组
        })

      }

    })













  },






  /*======所有自定义函数=END=====*/





  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    let canvasName = this.data.canvasName
    let ctx = wx.createCanvasContext(canvasName)
    this.setData({
      ctx: ctx
    })
    var query = wx.createSelectorQuery();
    query.select('.handCenter').boundingClientRect(rect => {

      this.setData({
        canvasWidth: rect.width,
        canvasHeight: rect.height
      })

      /* 将canvas背景设置为 白底，不设置  导出的canvas的背景为透明 */
      // this.setCanvasBg('#fff');


    }).exec();

   let NDAtempUrl =  wx.getStorageSync('NDAtempUrl');
   let arr = [];
   if(NDAtempUrl=='')
   {
    this.setData({
      imgs:arr
     })
   }
   else{
    arr.push(NDAtempUrl);
    this.setData({
     imgs:arr
    })
   }
 
    // this.uploadNDA(); //$$$$$$$$$$$$$$$$$$$$复制直接用的上传NDA函数
    // this.getNda();//获取NDA作为背景图片
  },







  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})