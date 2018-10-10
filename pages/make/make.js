

var app = getApp()
var requesturl = 'https://www.zqiyis.xyz/WXController/wxUpload'
var upLoadUrl = 'https://www.zqiyis.xyz/WXController/wxUploadImage'
var getTagUrl = 'https://www.zqiyis.xyz/WXController/wxGetTag'
var addTagUrl = 'https://www.zqiyis.xyz/WXController/wxInsertTag'
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
var startX = 0;
var distance = 0;
var isShowDelete = false;
var deleteWidth = 200
var touchItemCode
var itemTags = []
var animation
var moveDistance = 0;
Page({
    data: {
        steps: [],
        isShowDoneButton: false,
        describeImage: '/images/v/nothing.png',
        tags: ['*请选择标签', '早餐', '午餐', '晚餐 '],
        index: 0,
        addTag: false,
        animationData: {},
    },
    onLoad: function () {
        that = this
        console.log("onLoad:" )
        app.sendrequest(getTagUrl, "", true, function (result) {
            itemTags = result.tags
            that.setData({
                tags: result.tags
            })
        })

        wx.getSystemInfo({
            success: function (res) {
              moveDistance = (400 * res.screenWidth) / 750
            }
        })
        newItem.steps = new Array()
    },

    onShow: function () {
        console.log("onShow:")
        
        var now = Date.now()
        wx.getStorage({
            key: 'userId',
            success: function (res) {
                newItem.id = res.data + now
            }
        })

        var animation = wx.createAnimation({
            duration: 500,
            timingFunction: 'linear',
        })
        this.animation = animation
    },

    showAddTag: function () {
        that.animation
            .translateY(moveDistance).step({ timingFunction: 'linear' })
        that.setData({
            animationData: that.animation.export()
        })

        setTimeout(function () {
            that.setData({
                addTag: true
            })
        }.bind(this), 500)

    },

    hideAddTag: function () {
        that.animation
            .translateY(-moveDistance).step({ timingFunction: 'linear' })
        that.setData({
            animationData: that.animation.export()
        })
        that.setData({
            addTag: false
        })
    },

    addTag: function (e) {
        this.hideAddTag()
        if (e.detail.value) {
            var newTag = {
                name: e.detail.value
            }
            app.sendrequest(addTagUrl, newTag, true, function (result) {
                app.sendrequest(getTagUrl, "", true, function (result) {
                    itemTags = result.tags
                    that.setData({
                        tags: result.tags
                    })
                })
            })
        }
    },

    setName: function (e) {
        console.log("newItem_id:" + newItem.id)
        newItem.name = e.detail.value
    },

    setTag: function (e) {
        if (e.detail.value) {
            console.log("newItem_tag:" + e.detail.value)
            newItem.tag = itemTags[e.detail.value]
            that.setData({
                index: e.detail.value
            })
        }
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
        step.marginR = 0
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
        console.log("index:" + index)
        wx.chooseImage({
            count: 1, // 最多可以选择的图片张数，默认9
            sizeType: ['compressed'], // original 原图，compressed 压缩图，默认二者都有
            sourceType: ['album'], // album 从相册选图，camera 使用相机，默认二者都有
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
            },
            complete:function(){
              console.log("complete:")
              console.log(newItem)
            }
        })
    },

    //提交输入内容
    doneInput: function () {
        this.checkInputData();
    },

    touchStart: function (e) {
        touchItemCode = e.currentTarget.dataset.index
        distance = 0;
        startX = 0;
        if (e.touches.length == 1) {
            startX = e.touches[0].clientX
        }
    },
    touchMove: function (e) {
        if (e.touches.length == 1) {
            var moveX = e.touches[0].clientX
            distance = startX - moveX
            if (distance > deleteWidth) {
                distance = deleteWidth
            } else if (distance < -deleteWidth) {
                distance = -deleteWidth
            }
            if (distance > 0 && !isShowDelete) {
                if (distance >= deleteWidth) {
                    isShowDelete = true
                }
                newItem.steps[touchItemCode - 1].marginR = distance
                that.setData({
                    steps: newItem.steps
                })
            } else if (distance < 0 && isShowDelete) {
                if (distance <= -deleteWidth) {
                    isShowDelete = false
                }
                newItem.steps[touchItemCode - 1].marginR = deleteWidth + distance
                that.setData({
                    steps: newItem.steps
                })
            }
        }
    },
    touchEnd: function (e) {
        if (distance < deleteWidth) {
            isShowDelete = false
            newItem.steps[touchItemCode - 1].marginR = 0
            that.setData({
                steps: newItem.steps
            })
        }

    },
    touchCancel: function (e) {
        newItem.steps[touchItemCode - 1].marginR = 0
        that.setData({
            steps: newItem.steps
        })
    },
    deleteStep: function (e) {
        var stepCode = e.currentTarget.dataset.index
        newItem.steps.splice(stepCode - 1, 1)
        for (var i = 0; i < newItem.steps.length; i++) {
            newItem.steps[i].stepCode = i + 1;
        }
        that.setData({
            steps: newItem.steps
        })
        if (newItem.steps.length == 0) {
            that.setData({
                isShowDoneButton: false
            })
        }
    }

})