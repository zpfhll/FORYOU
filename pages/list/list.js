//一览画面
var app = getApp()
var that
var requesturl = 'https://www.zqiyis.xyz/WXController/wxList'
/**
 * 请求数据，
 * requestPage：请求关键字
 * requestType：范围（tag or search）
 */
var requestData = {
    requestPage: '全部',
    requestType: 'search',
}
Page({
    data: {
        showData: [],
        scrollHeight: 100,
        itemWidth: 20,
        title: ''
    },
    onLoad: function (options) {
        that = this
        var windowHeight = 200
        var windowWdith = 80

        requestData.requestPage = options.listTag
        requestData.requestType = options.type

        console.log("listTag:" + options.listTag)
        console.log("type:" + options.type)
        that.setData({
            title: requestData.requestPage
        })
        wx.getSystemInfo({
            success: function (res) {
                // success
                windowHeight = res.windowHeight
                windowWdith = res.screenWidth
                windowHeight = (750 * res.windowHeight) / res.screenWidth
                that.setData({
                    itemWidth: windowWdith / 2 - 10,
                    scrollHeight: windowHeight
                })
            }
        })
    },
    onShow: function () {
        app.sendrequest(requesturl, requestData, true, function (result) {
            that.setData({
                showData: result.cookings
            })
        })
    },

    itemClick: function (event) {
        var id = event.currentTarget.dataset.index
        wx.navigateTo({
            url: '../detail/detail?cookingid=' + id
        })
    }
})
