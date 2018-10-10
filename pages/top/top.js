
//获取应用实例
var app = getApp()
var that
var requesturl = 'https://www.zqiyis.xyz/WXController/wxTop'
var getTagUrl = 'https://www.zqiyis.xyz/WXController/wxGetTag'
var requestData = {
    requestPage: 'top'
}
// var userId
var windowHeight = 200
var windowWdith = 80
var showView = false
var topResult = []
var searchKey = ''
var searchLevel = 2
var keys = new Array()
var itemTags = []
Page({
    data: {
        scrollHeight: 100,
        itemWidth: 20,
        recommends: [],
        breakfast: [],
        lunch: [],
        dinner: [],
        showButton: false,
        searchKeys: [],
        tags: ['*请选择标签', '早餐', '午餐', '晚餐 '],
        background:''
    },
    onLoad: function () {
        that = this
        showView = app.globalData.showView
        that.setData({
            showButton: showView
        })

        wx.getSystemInfo({
            success: function (res) {
                // success
                console.log('windowHeight--->' + res.screenHeight)
                windowHeight = res.windowHeight
                windowWdith = res.screenWidth
                windowHeight = (750 * res.windowHeight) / res.screenWidth

                that.setData({
                    itemWidth: windowWdith / 2 - 10,
                    scrollHeight: windowHeight
                })
            }
        })
        wx.cloud.getTempFileURL({
          fileList: ['cloud://fo-5f0c75.666f-fo-5f0c75/appImg/top-background.png'],
          success: res => {
            that.setData({
              background: res.fileList[0].tempFileURL
            })
          },
          fail: console.error
        })
        topResult = []
        that.getTopCooking('早餐')
        that.getTopCooking('午餐')
        that.getTopCooking('晚餐')
    },

    onShow: function () {
      //所有tags 的取得
      wx.cloud.callFunction({
        name:'cookingTool',
        data:{
          flag:'tags'
        },
        success: function (res) {
          if (res.result.errMsg == ''){
            itemTags = res.result.data
            that.setData({
              tags: itemTags
            })
          }
        },
        fail: console.error
      })
    },

    //获取早餐，午餐，晚餐
    getTopCooking:function(tag){
      wx.cloud.callFunction({
        name: 'cookingTool',
        data: {
          flag: 'cookingsByTag',
          tag: tag,
          count: 10
        },
        success: function (res) {
          //推荐
          topResult.push(res.result.data[0])

          if (res.result.errMsg == '') {
            if (tag == '早餐'){
              that.setData({
                breakfast: res.result.data,
                recommends: topResult
              })
            } else if (tag == '午餐'){
              that.setData({
                lunch: res.result.data,
                recommends: topResult
              })
            } else if (tag == '晚餐') {
              that.setData({
                dinner: res.result.data,
                recommends: topResult
              })
            }
          }
        },
        fail: console.error
      })

    },

    searchTag: function (e) {
        if (e.detail.value) {
            var tag = itemTags[e.detail.value]
            console.log("selected:"+tag)
            wx.navigateTo({
                url: '../list/list?listTag=' + tag + '&type=tag'
            })
        }
    },

    random:function(){
      wx.redirectTo({
        url: '../ywindex/ywindex'
      })
    },

    itemClick: function (event) {
        console.log(event.currentTarget.dataset.index)
        var id = event.currentTarget.dataset.index

        wx.navigateTo({
            url: '../detail/detail?cookingid=' + id
        })

    },
    makeFood: function () {
        wx.navigateTo({
            url: '../make/make'
        })
    },

    showMoreCooking: function (event) {
        var listTag = event.currentTarget.dataset.index
        console.log("索引:" + listTag)
        wx.navigateTo({
            url: '../list/list?listTag=' + listTag + '&type=tag'
        })
    },

    searchCooking: function (event) {
        if (event.currentTarget.dataset.index) {
            searchKey = event.currentTarget.dataset.index
        }
        if (event.detail.value) {
            searchKey = event.detail.value
        }

        if (searchKey == "") {
            return
        }

        console.log("检索内容:" + searchKey)
        try {
            var key = searchKey
            var searchTimes = wx.getStorageSync(key);
            if (!searchTimes) {
                searchTimes = 0;
            }
            searchTimes = searchTimes + 1;
            wx.setStorageSync(key, searchTimes)
        } catch (e) {

        }
        wx.navigateTo({
            url: '../list/list?listTag=' + searchKey + '&type=search'
        })
    },
    searchInput: function (event) {
        searchKey = event.detail.value
    }


})