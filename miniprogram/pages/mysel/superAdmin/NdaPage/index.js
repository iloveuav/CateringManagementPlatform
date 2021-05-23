// miniprogram/pages/NdaPage/index.jsconst app = getApp();
 
/*
小程序利用canvas实现一键保存图片功能 */
Page({
 
  /**
   * 页面的初始数据
   */
  data: {
    cname: '',
    renwu: '',
    yuyan: '',
    fan: '',
    xg: '',
    imgurl: '', 
    canvasHidden: true,     //设置画板的显示与隐藏，画板不隐藏会影响页面正常显示
    wxappName: '页面生成图片',    //小程序名称
    shareImgPath: '',
    screenWidth: '',       //设备屏幕宽度
    shareImgSrc: '',
 
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
 
    wx.getImageInfo({
      src: '../../images/bj.png',
      success: function (res) {
        console.log(res)
       that.setData({
         shareImgSrc: '../../' + res.path
       });
      }
    })
 
    wx.getImageInfo({
      src: '../../images/11.png',
      success: function (res) {
        console.log(res)
        that.setData({
          shareImgPath: '../../' + res.path
        });
      }
    })
 
    //获取用户设备信息，屏幕宽度
    wx.getSystemInfo({
      success: res => {
        that.setData({
          screenWidth: res.screenWidth
        })
        console.log(that.data.screenWidth)
      }
    })
 
 
    that.setData({
      cname: options.id
    });
    var yuyan = new Array('多注意外表，近期将有桃花运', '不要留钱在手，近期将走财运', '留意新认识的人，将遇改变人生的贵人', '走路留意，可能会走狗屎运', '放开吃喝，三个月内你不会发胖', '身边有人正在准备一个惊喜给你');
    var c = Math.floor(Math.random() * 6);
    var renwu = new Array('富察容音', '弘历', '魏璎珞', '娴妃', '高贵妃', '叶太医', '富察·傅恒', '海兰察', '陆晚晚', '明玉');
    var a = Math.floor(Math.random() * 6);
    var fan = new Array('因皇子去世一直耿耿于怀，内心苦闷。富察容音常有胸闷、乳房疼痛的症状，是情志失意导致的乳腺问题。', '前朝政务繁多，后宫妃嫔争宠，后宫女人几乎都有乳腺困扰，皇上命叶太医制出乳丹，帮助解决嫔妃的乳腺问题。', '长期想着复仇，情志不畅，所以月经紊乱，乳房有肿块都不知道。幸得叶太医乳丹相助，帮其解决乳腺问题。', '不能保家人周全，无奈黑化，也一直深受乳腺问题的烦恼。', '唯恐失去皇上宠爱，天天苦于宫斗，饱受乳腺问题烦恼。', '苦于没有疑难杂症给他医治，后被皇上指派解决嫔妃的乳腺问题，研发出乳丹。', '因为没有和心爱的女人在一起，从而抱恨终身。', '心爱的女人在成亲当天自杀，让海兰察心痛一生。', '自身实力与家庭背景都很薄弱，不求富贵，只求安保。', '因体内被纯贵妃扎的针重伤加之受顺嫔挑唆，以金剪插心，自尽而亡。');
    var xg = new Array('内心温柔，心胸宽广，最终别人，也能得到别人尊重。', '爱憎分明、内心骄傲，做人做事不会选择将就。', '客观理智、内心透彻，内心善良富有正义，重视承诺。', '追求单纯但是内心又自卑，遇到失望的事情，会变得偏执。', '喜形于色，为人处世情绪化，从不压抑内心想法。', '本是江湖游医却救阿哥、激皇上（治病）、怼太医，萌萌的外表下藏着一颗济世救人的医者仁心。', '深得皇上的宠爱和重视，表面上看是一个冷清的人，实际上是一个专情热血的男子。', '心性善良，智勇双全，屡经战阵，注重研习兵法，受众尊崇的将领。', '温婉贤淑的大家闺秀，才貌出众，天性善良，不争名利，清新脱俗。', '性格直爽，忠肝义胆，说话毒舌但是心地善良。');
    var img = new Array('http://login.pink333.com/uploads/20180828/4c9b626b59d6a0b38a03089d1da4d906.jpg',
      'http://login.pink333.com/uploads/20180828/d942b0f1bccc4e6c6081bd5f3398fd4e.jpg',
      'http://login.pink333.com/uploads/20180828/29af4184e336f82a38ecd3de07a01569.jpg',
 'http://login.pink333.com/uploads/20180828/eacea6d98f57fdcda835003fd8734c14.jpg',
      'http://login.pink333.com/uploads/20180828/9416f7ac87e99efd8a179dedec15d0c0.jpg',
      'http://login.pink333.com/uploads/20180828/1ee16bba3d950f8fce32d8e6d01025b3.jpg',
      'http://login.pink333.com/uploads/20180828/2114ed95f319b23afa498b6064b90517.jpg',
      'http://login.pink333.com/uploads/20180828/07682aa82440bd48bec9cfcdf8830fb0.jpg',
      'http://login.pink333.com/uploads/20180828/2f71cd25f32922035c08071042cda134.jpg',
      'http://login.pink333.com/uploads/20180828/ff6f46a6ad3c15200f1d380aa1ccde25.jpg');
 
    if (a == 0) {
      that.setData({
        fan: fan[0],
        xg: xg[0],
      });
      wx.getImageInfo({
        src: '../../images/fcry.png',
        success: function (res) {
          console.log(res)
          that.setData({
            imgurl: '../../' + res.path
          });
        }
      })
    }
    if (a == 1) {
      that.setData({
        fan: fan[1],
        xg: xg[1]
      });
      wx.getImageInfo({
        src: '../../images/hl.png',
        success: function (res) {
          console.log(res)
          that.setData({
            imgurl: '../../' + res.path
          });
        }
      })
    }
    if (a == 2) {
      that.setData({
        fan: fan[2],
        xg: xg[2]
      });
      wx.getImageInfo({
        src: '../../images/wyl.png',
        success: function (res) {
          console.log(res)
          that.setData({
            imgurl: '../../' + res.path
          });
        }
      })
    }
    if (a == 3) {
      that.setData({
        fan: fan[3],
        xg: xg[3]
      });
      wx.getImageInfo({
        src: '../../images/xf.jpg',
        success: function (res) {
          console.log(res)
          that.setData({
            imgurl: '../../' + res.path
          });
        }
      })
    }
    if (a == 4) {
      that.setData({
        fan: fan[4],
        xg: xg[4]
      });
      wx.getImageInfo({
        src: '../../images/ggf.png',
        success: function (res) {
          console.log(res)
          that.setData({
            imgurl: '../../' + res.path
          });
        }
      })
    }
    if (a == 5) {
      that.setData({
        fan: fan[5],
        xg: xg[5]
      });
      wx.getImageInfo({
        src: '../../images/yty.png',
        success: function (res) {
          console.log(res)
          that.setData({
            imgurl: '../../' + res.path
          });
        }
      })
    }
     if (a == 6) {
      that.setData({
        fan: fan[6],
        xg: xg[6]
      });
       wx.getImageInfo({
         src: '../../images/fcfh.jpg',
         success: function (res) {
           console.log(res)
           that.setData({
             imgurl: '../../' + res.path
           });
         }
       })
    }
    if (a == 7) {
      that.setData({
        fan: fan[7],
        xg: xg[7]
      });
      wx.getImageInfo({
        src: '../../images/hnc.png',
        success: function (res) {
          console.log(res)
          that.setData({
            imgurl: '../../' + res.path
          });
        }
      })
    }
    if (a == 8) {
      that.setData({
        fan: fan[8],
        xg: xg[8]
      });
      wx.getImageInfo({
        src: '../../images/lww.png',
        success: function (res) {
          console.log(res)
          that.setData({
            imgurl: '../../' + res.path
          });
        }
      })
    }
    if (a == 9) {
      that.setData({
        fan: fan[9],
        xg: xg[9]
      });
      wx.getImageInfo({
        src: '../../images/my.png',
        success: function (res) {
          console.log(res)
          that.setData({
            imgurl: '../../' + res.path
          });
        }
      })
    }
    that.setData({
      yuyan:yuyan[c],
      renwu: renwu[a]
    });
 
  },
 
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    var context = wx.createCanvasContext('share')
    context.setStrokeStyle("#00ff00")
    context.setLineWidth(1)
    context.stroke()
    context.draw(false, this.getTempFilePath)
  },
 
  //获取临时路径
  getTempFilePath: function () {
    wx.canvasToTempFilePath({
      canvasId: 'share',
      success: (res) => {
        this.setData({
          shareTempFilePath: res.tempFilePath
        })
      }
    })
  },
  /**
   * 绘制多行文本，由于文字比较多，这里我们写了一个函数处理
   */
  drawText: function (ctx, str, leftWidth, initHeight, titleHeight, canvasWidth) {
    var lineWidth = 0;
    var lastSubStrIndex = 0; //每次开始截取的字符串的索引
    for (let i = 0; i < str.length; i++) {
      lineWidth += ctx.measureText(str[i]).width;
      if (lineWidth > canvasWidth) {
        ctx.fillText(str.substring(lastSubStrIndex, i), leftWidth, initHeight); //绘制截取部分
        initHeight += 16; //16为字体的高度
        lineWidth = 0;
        lastSubStrIndex = i;
        titleHeight += 30;
      }
      if (i == str.length - 1) { //绘制剩余部分
        ctx.fillText(str.substring(lastSubStrIndex, i + 1), leftWidth, initHeight);
      }
    }
    // 标题border-bottom 线距顶部距离
    titleHeight = titleHeight + 10;
    return titleHeight
  },
 
  //保存至相册
  saveImageToPhotosAlbum: function () {
   var that = this;
    var unit = that.data.screenWidth / 375
    //2. canvas绘制文字和图片
    const ctx = wx.createCanvasContext('share');
    var bgImgPath = that.data.shareImgSrc;
    var fanstr = '前世烦恼：' + that.data.fan;
    var rwxg = '人物性格：' + that.data.xg;
 
 //这里很重要，主要就是布局
    ctx.drawImage(bgImgPath, 0, 0, 375, 580);
    ctx.drawImage(that.data.shareImgPath, 50, 450, 284, 80);
    ctx.drawImage(that.data.imgurl, 146, 100, 100, 100);
    ctx.setFontSize(13)
    ctx.setFillStyle('#5e7436')
    ctx.fillText('姓名：' + that.data.cname, 50, 241)
    ctx.fillText('人物匹配：' + that.data.renwu, 50, 271);
    ctx.fillText('近期预言：' + that.data.yuyan, 50, 300);
 
    this.drawText(ctx, fanstr, 50, 330, 145, 280);
    this.drawText(ctx, rwxg, 50, 400, 145, 280);
    //ctx.fillText('前世烦恼：' + that.data.fan, 50, 330);
    //ctx.fillText('人物性格：' + that.data.xg, 50, 360);
    ctx.stroke()
    ctx.draw(false, function() {
      // 3. canvas画布转成图片
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: 375,
        height: 580,
        destWidth: 375,
        destHeight: 580,
        canvasId: 'share',
        success: function (res) {
          console.log(res);
          that.setData({
            shareImgSrc: res.tempFilePath
          })
          if (!res.tempFilePath) {
            wx.showModal({
              title: '提示',
              content: '图片绘制中，请稍后重试',
              showCancel: false
            })
          }
          //4. 当用户点击分享到朋友圈时，将图片保存到相册
          wx.saveImageToPhotosAlbum({
            filePath: that.data.shareImgSrc,
            success(res) {
              console.log(res);
              wx.showModal({
                title: '图片保存成功',
                content: '图片成功保存到相册了，去发圈噻~',
                showCancel: false,
                confirmText: '好哒',
                confirmColor: '#72B9C3',
                success: function (res) {
                  if (res.confirm) {
                    console.log('用户点击确定');
                  }
                  that.setData({
                    canvasHidden: true
                  })
                }
              })
            }
          })
        },
        fail: function (res) {
          console.log(res)
        }
      })
    });
  },
  /**
   * 生命周期函数--监听页面显示 
   */
  onShow: function () {
    const that = this;
    wx.downloadFile({
      url: that.data.shareImgSrc,
      success: function (res) {
        that.data.shareImgSrc = res.tempFilePath
      }, fail: function (res) {
      }
    })
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