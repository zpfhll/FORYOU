//index.js
//获取应用实例
var app = getApp()
var that
var userName
var animation
Page({
  data: {
    motto: ',你好!',
    animationData: {},
    showView: true,
    background:''

  },
  onShow: function () {
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'linear',
    })
    that = this
    this.animation = animation
    wx.cloud.getTempFileURL({
      fileList: ['cloud://fo-5f0c75.666f-fo-5f0c75/appImg/background.png'],
      success: res => {
        that.setData({
          background: res.fileList[0].tempFileURL
        })
      },
      fail: console.error
    })
  },
  //计时器的动画，动画结束后请求API，API成功后画面迁移
  move: function () {
    this.setData({
      showView: false
    })
    this.animation
      .translateY(200).step({ timingFunction: 'ease-in' })
      .translateY(100).step({ timingFunction: 'ease-out' })
      .translateY(200).step({ timingFunction: 'ease-in' })
      .translateY(150).step({ timingFunction: 'ease-out' })
      .translateY(200).step({ timingFunction: 'ease-in' })
      .translateY(180).step({ timingFunction: 'ease-out' })
      .translateY(200).step({ timingFunction: 'ease-in' })
      .translateY(195).step({ timingFunction: 'ease-out' })
      .translateY(200).step({ timingFunction: 'ease-in' })
    this.setData({
      animationData: this.animation.export()
    })
    setTimeout(function () {
      that.refreshData()
    }.bind(this), 4000)
  },

  random:function(){
    wx.redirectTo({
      url: '../ywindex/ywindex'
    })
  },

  //事件处理函数
  refreshData: function () {
    wx.redirectTo({
      url: '../top/top'
    })
  },
  onLoad: function () {
    that = this
    // 调用应用实例的方法获取全局数据
    app.getUserInfo()
  }
})
