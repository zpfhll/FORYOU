//app.js
var requesturl = 'https://www.zqiyis.xyz/WXController/wxGetId'
var requestData = {
  requestType: '',
  code: ''
}
var userContentId = 'odi0K0ZbKlGJRCA1cR9VqqkcOWgc'
var userContentId2 = 'odi0K0aUZw1TNO9PFTfNPc-uDJ-I'
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
    wx.cloud.init({
      traceUser: true
    })
  },

  //取用户的openID
  getUserInfo: function () {
    var that = this
    wx.cloud.callFunction({
      name:'cookingTool',
      data:{
        flag:'openid'
      },
      success:function(res){
        console.log(res.result)
        if (res.result.openId == userContentId || res.result.openId == userContentId2) {
          that.globalData.showView = true
        } else {
          that.globalData.showView = false
        }
      },
      fail:console.log
    })
  },

  //发送post请求
  sendrequest: function (requesturl, parameter, isHiddenLoading, resultFun) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    var result
    result = wx.request({
      url: requesturl,
      data: parameter,
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/json'
      }, // 设置请求的 header
      success: function (res) {
        result = res.data
        console.log("===data===" + JSON.stringify(result))
      },
      fail: function () {
        result = '------>请求失败'
      },
      complete: function () {
        console.log(result)
        if (typeof resultFun == 'function') {
          resultFun(result)
          if (isHiddenLoading) {
            wx.hideLoading()
          }
        } else {
          wx.hideLoading()
        }
      }
    })
  },

  //快速排序(inverse>true:升序 false:降序)
  quickSort: function (array, inverse) {
    var i = 0;
    var j = array.length - 1;
    var Sort = function (i, j) {

      if (i == j) {
        return
      };

      var key = array[i];
      var stepi = i; // 记录开始位置
      var stepj = j; // 记录结束位置
      if (inverse) {
        while (j > i) {
          if (array[j] >= key) {
            j--;
          } else {
            array[i] = array[j]
            while (j > ++i) {
              if (array[i] > key) {
                array[j] = array[i];
                break;
              }
            }
          }
        }
      } else {
        while (j > i) {
          if (array[j] <= key) {
            j--;
          } else {
            array[i] = array[j]
            while (j > ++i) {
              if (array[i] < key) {
                array[j] = array[i];
                break;
              }
            }
          }
        }
      }

      if (stepi == i) {
        Sort(++i, stepj);
        return;
      }
      
      array[i] = key;

      // 递归
      Sort(stepi, i);
      Sort(j, stepj);
    }

    Sort(i, j);

    return array;
  },
  globalData: {
    userInfo: null,
    showView: false
  }
})