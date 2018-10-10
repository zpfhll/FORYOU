// ywadd.js
var app = getApp()
var that
var foodName
var foodTag
var foodUrl
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageUrl:'/images/v/nothing.png'
  },

  setName: function (e) {
    foodName = e.detail.value
    console.log("name:" + foodName)
  },

  setTag: function (e) {
    foodTag = e.detail.value
    console.log("tag:" + foodTag)
  },

  showImage:function(){
    
    wx.chooseImage({
      count: 1, // 最多可以选择的图片张数，默认9
      sizeType: ['compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        foodUrl = res.tempFilePaths[0]
        console.log("image:" + foodUrl)
        that.setData({
          imageUrl: foodUrl
        })
      }
    })
  },
  ok:function(){
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    var foodStr = "";
    if (foodUrl == ""){
      wx.getStorage({
        key: 'ywfoods',
        success: function (res) {
          foodStr = res.data;
        },
        fail: function (res) {
          foodStr = "";
        },
        complete: function () {
          wx.hideLoading()
          if (foodStr == null || foodStr == "") {
            foodStr = foodName + "," + foodTag + "," + foodUrl
          } else {
            foodStr = foodStr + ";" + foodName + "," + foodTag + "," + foodUrl
          }
          console.log("foodStr:" + foodStr)
          wx.setStorage({
            key: 'ywfoods',
            data: foodStr,
            complete: function () {
              wx.navigateBack({
                delta: 1
              })
            }
          })
        }
      })
    }else{
      wx.saveFile({
        tempFilePath: foodUrl,
        success: function (res) {
          foodUrl = res.savedFilePath
        },
        complete: function () {
          wx.getStorage({
            key: 'ywfoods',
            success: function (res) {
              foodStr = res.data;
            },
            fail: function (res) {
              foodStr = "";
            },
            complete: function () {
              wx.hideLoading()
              if (foodStr == null || foodStr == "") {
                foodStr = foodName + "," + foodTag + "," + foodUrl
              } else {
                foodStr = foodStr + ";" + foodName + "," + foodTag + "," + foodUrl
              }
              console.log("foodStr:" + foodStr)
              wx.setStorage({
                key: 'ywfoods',
                data: foodStr,
                complete: function () {
                  wx.navigateBack({
                    delta: 1
                  })
                }
              })
            }
          })
        }
      })
    }


    
    

   
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    foodUrl = ""
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
    that = this
    foodUrl = ""
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