// ywindex.js
var app = getApp()
var that
var userName
var foodStr
var foodArray = new Array()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    motto: ',你好!',
    userInfo: {},
    foodName:'无名',
    foodUrl:'/images/v/nothing.png'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    // 调用应用实例的方法获取全局数据
    wx.getUserInfo({
      success: function (res) {
        console.log(res.userInfo)
        that.setData({
          userInfo: res.userInfo
        })
      }
    })
  },

  getFoods: function () {
    foodArray = new Array()
    var foods = foodStr.split(';')
    if (foods.length == 1){
      var foodItem = foods[0].split(',')
      var food = new Object();
      food.foodName = foodItem[0]
      food.foodTag = foodItem[1]
      food.foodUrl = foodItem[2]
      console.log(food)
      if (food.foodUrl == "") {
        food.foodUrl = '/images/v/nothing.png'
      }
      foodArray.push(food)
    }else{
      for(var i = 0; i<foods.length; i++){
        var foodItem = foods[i].split(',')
        var food = new Object();
        food.foodName = foodItem[0]
        food.foodTag = foodItem[1]
        food.foodUrl = foodItem[2]
        console.log("food:" + food)
        if (food.foodUrl == ""){
          food.foodUrl = '/images/v/nothing.png'
        }
        foodArray.push(food)
      }
    }
    console.log(foodArray)
  },

  random:function(){
    that.setData({
      foodName: '无名',
      foodUrl: '/images/v/nothing.png'
    })
    console.log(foodArray.length)
    if (foodArray.length < 1){
      wx.showModal({
        content: '快去先记录下自己都想吃什么吧！',
        showCancel:false
      })
    }else{
      setTimeout(function () {
        var randomNum = parseInt(Math.random() * foodArray.length)
        console.log("randomNum:" + randomNum)
        that.setData({
          foodName: foodArray[randomNum].foodName,
          foodUrl: foodArray[randomNum].foodUrl
        })
      }.bind(this), 100)

      setTimeout(function () {
        var randomNum = parseInt(Math.random() * foodArray.length)
        console.log("randomNum:" + randomNum)
        that.setData({
          foodName: foodArray[randomNum].foodName,
          foodUrl: foodArray[randomNum].foodUrl
        })
      }.bind(this), 200)

      setTimeout(function () {
        var randomNum = parseInt(Math.random() * foodArray.length)
        console.log("randomNum:" + randomNum)
        that.setData({
          foodName: foodArray[randomNum].foodName,
          foodUrl: foodArray[randomNum].foodUrl
        })
      }.bind(this), 300)

      setTimeout(function () {
        var randomNum = parseInt(Math.random() * foodArray.length)
        console.log("randomNum:" + randomNum)
        that.setData({
          foodName: foodArray[randomNum].foodName,
          foodUrl: foodArray[randomNum].foodUrl
        })
      }.bind(this), 400)

      setTimeout(function () {
        var randomNum = parseInt(Math.random() * foodArray.length)
        console.log("randomNum:" + randomNum)
        that.setData({
          foodName: foodArray[randomNum].foodName,
          foodUrl: foodArray[randomNum].foodUrl
        })
      }.bind(this), 500)

      setTimeout(function () {
        var randomNum = parseInt(Math.random() * foodArray.length)
        console.log("randomNum:" + randomNum)
        that.setData({
          foodName: foodArray[randomNum].foodName,
          foodUrl: foodArray[randomNum].foodUrl
        })
      }.bind(this), 800)


      setTimeout(function () {
        var randomNum = parseInt(Math.random() * foodArray.length)
        console.log("randomNum:" + randomNum)
        that.setData({
          foodName: foodArray[randomNum].foodName,
          foodUrl: foodArray[randomNum].foodUrl
        })
      }.bind(this), 1000)

      setTimeout(function () {
        var randomNum = parseInt(Math.random() * foodArray.length)
        console.log("randomNum:" + randomNum)
        that.setData({
          foodName: foodArray[randomNum].foodName,
          foodUrl: foodArray[randomNum].foodUrl
        })
      }.bind(this), 1200)
    }
  },

  add: function () {
    wx.navigateTo({
      url: '../ywadd/ywadd'
    })
  },

  make: function () {
    wx.redirectTo({
      url: '../top/top'
    })
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
    wx.getStorage({
      key: 'ywfoods',
      success: function (res) {
        foodStr = res.data
        that.getFoods()
      },
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