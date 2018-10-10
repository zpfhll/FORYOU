

var app = getApp()
var requesturl = 'https://www.zqiyis.xyz/WXController/wxGetCookingById'
var requestDeleteurl = 'https://www.zqiyis.xyz/WXController/wxDeleteCookingById'
var requestData = {
    requestPage: '',
}
var that
//步骤内容
var newItem = {
    id: "",
    name: "",
    tag: "",
    describeImage: "/images/v/nothing.png",
    describe: "",
    steps: new Array()
}
var cookingId
Page({
    data: {
        steps: [],
        isShow: true,
        isShowDoneButton: false,
        describeImage: '',
        cookingName: '',
        cookingTag: '',
        cookingDescribe: '',
        isCanDelete: false
    },
    onLoad: function (options) {
        requestData.requestPage = options.cookingid
        console.log('cooking id:' + requestData.requestPage)
        that = this

        

    },

    onShow: function () {

      that.setData({
        isCanDelete: app.globalData.showView
      })

      app.sendrequest(requesturl, requestData, true, function (result) {
        newItem.id = result.cooking.id
        newItem.name = result.cooking.name
        newItem.tag = result.cooking.tag
        newItem.describe = result.cooking.des
        newItem.describeImage = result.cooking.desImage
        newItem.steps = new Array()
        for (var i = 0; i < result.cooking.steps.length; i++) {
          var step = new Object();
          var stepId = result.cooking.steps[i].id
          step.stepCode = i + 1
          step.stepContent = result.cooking.steps[i].stepDes
          if (result.cooking.steps[i].stepImage) {
            step.isShowImage = true
            step.stepImage = result.cooking.steps[i].stepImage
          } else {
            step.isShowImage = false
            step.stepImage = "https://www.zqiyis.xyz/public/images/itemImage/default.png"
          }
          newItem.steps[i] = step
        }
        that.setData({
          cookingName: newItem.name,
          cookingTag: newItem.tag,
          cookingDescribe: newItem.describe,
          describeImage: result.cooking.desImage,
          steps: newItem.steps,
        })
        console.log(newItem)
      })

        newItem.steps = new Array()
        var now = Date.now()
        wx.getStorage({
            key: 'userId',
            success: function (res) {
                newItem.id = res.data + now
            }
        })
    },

    setName: function (e) {
        console.log("newItem_id:" + newItem.id)
        newItem.name = e.detail.value
    },

    setTag: function (e) {
        newItem.tag = e.detail.value
    },

    setDescribe: function (e) {
        newItem.describe = e.detail.value
    },

    //check输入的内容
    checkInputData: function () {
        if (newItem.name == "") {
            this.showMessage("请为这道世纪名菜起个响亮的名字！")
        } else if (newItem.tag == "") {
            this.showMessage("请为这道菜添加标签，以便让世界都看到！")
        } else if (newItem.steps[0].stepContent == "") {
            this.showMessage("还没有做就关火了，说出你的步骤吧，别藏着！")
        } else {
            app.sendrequest(requesturl, newItem, false, function (result) {
                console.log(result);
                that.upLoadImage()
            })
        }
    },

    upLoadImage: function () {
        wx.uploadFile({
            url: upLoadUrl,
            filePath: newItem.describeImage,
            name: 'image',
            // header: {}, // 设置请求的 header
            formData: {
                'name': newItem.id + "describe"
            }, // HTTP 请求中其他额外的 form data
            success: function (res) {
                // success
            },
            fail: function (res) {
                // fail
            },
            complete: function (res) {
                // complete
                wx.hideLoading()
            }
        })
        for (var i = 0; i < newItem.steps.length; i++) {
            var step = newItem.steps[i]
            var imageName = newItem.id + i
            wx.uploadFile({
                url: upLoadUrl,
                filePath: step.stepImage,
                name: 'image',
                // header: {}, // 设置请求的 header
                formData: {
                    'name': imageName
                }, // HTTP 请求中其他额外的 form data
                success: function (res) {
                    // success
                },
                fail: function (res) {
                    // fail
                },
                complete: function (res) {
                    // complete
                    wx.hideLoading()
                }
            })
        }
        wx.showModal({
            title: "",
            content: "上菜成功！",
            showCancel: false,
            success: function (res) {
                wx.navigateBack({
                    delta: 1, // 回退前 delta(默认为1) 页面
                    complete: function (res) {
                        // complete
                        newItem.steps = new Array()
                    }
                })
            }
        })
    },

    showMessage(content) {
        wx.showModal({
            title: "提示",
            content: content,
            showCancel: false,
            success: function (res) {
                if (res.confirm) {

                }
            }
        })
    },

    setSetpItem() {
        that.setData({
            steps: newItem.steps,
            isShowDoneButton: true
        })
    },

    //添加步骤
    addStep: function () {
        var stepNum = newItem.steps.length + 1
        var step = new Object();
        step.stepCode = stepNum
        step.stepContent = ""
        step.stepImage = "/images/v/nothing.png"
        newItem.steps.push(step)
        this.setSetpItem()
    },
    saveStepContent: function (e) {
        var index = e.currentTarget.dataset.index
        newItem.steps[index - 1].stepContent = e.detail.value
        this.setSetpItem()
    },

    changeImage: function (e) {
        var index = e.currentTarget.dataset.index
        wx.chooseImage({
            count: 1, // 最多可以选择的图片张数，默认9
            sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
            sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
            success: function (res) {
                if (index == -1) {
                    newItem.describeImage = res.tempFilePaths[0]
                    that.setData({
                        describeImage: newItem.describeImage
                    })
                } else {
                    newItem.steps[index - 1].stepImage = res.tempFilePaths[0]
                    that.setSetpItem()
                }
            }
        })
    },

    //提交输入内容
    doneInput: function () {
        this.checkInputData();
    },

    deleteCooking: function () {
        wx.showModal({
            title: '提示',
            content: '确认要删除这么好吃的菜吗？',
            success: function (res) {
                if (res.confirm) {
                    app.sendrequest(requestDeleteurl, requestData, true, function (result) {
                        if (result.code = 'ok') {
                            wx.navigateBack({
                                delta: 1, // 回退前 delta(默认为1) 页面
                            })
                        } else {
                            wx.showModal({
                                title: '提示',
                                content: '删除失败',
                                showCancel: false,
                                success: function (res) {
                                }
                            })
                        }
                    })
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },

    preview: function (e) {
        var images = [];
        console.log(e.currentTarget.dataset.index)
        if (e.currentTarget.dataset.index == '-1') {
            images[0] = newItem.describeImage;
            wx.previewImage({
                // current: 'String', // 当前显示图片的链接，不填则默认为 urls 的第一张
                urls: images,
                success: function (res) {
                    // success
                },
                fail: function (res) {
                    // fail
                },
                complete: function (res) {
                    // complete
                }
            })
        } else {
            for (var i = 0; i < newItem.steps.length; i++) {
                images[i] = newItem.steps[i].stepImage
            }

            wx.previewImage({
                current: e.currentTarget.dataset.index, // 当前显示图片的链接，不填则默认为 urls 的第一张
                urls: images,
                success: function (res) {
                    // success
                },
                fail: function (res) {
                    // fail
                },
                complete: function (res) {
                    // complete
                }
            })
        }
    }

})