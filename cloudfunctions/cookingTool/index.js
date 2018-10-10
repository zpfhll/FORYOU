// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {

  const database = cloud.database({
    env: 'fo-5f0c75'
  })
  //获取openId和appId
  if (event.flag == 'openid'){
    let { openId, appId } = event.userInfo 
    return {
      openId,
      appId
    }
  }else if (event.flag == 'tags') {//tags的处理

    const result = await database.collection('tags').get()
    
    var itemTags = []

    for (var i = 0; i < result.data.length; i++) {
      itemTags[i] = result.data[i].name
    }
    var message = ''
    if (itemTags.length < 1){
      message = 'error'
    }
    return {
      data: itemTags,
      errMsg: message
    }

  } else if (event.flag == 'cookingsByTag'){ //cookins的处理
    const cookingsC = database.collection('cooking')
    var result  = []

    //同步查询菜品
    if (event.count > 0){
      result = await cookingsC.where({
        tag: event.tag
      }).limit(event.count).get()
    }else{
      result = await cookingsC.where({
        tag: event.tag
      }).get()
    }

    //图片的fileID
    var paths = []
    for (var i = 0; i < result.data.length; i++) {
      paths[i] = result.data[i].desImage
    }
    //同步获取图片的临时文件路径
    const imgPaths = await cloud.getTempFileURL({
      fileList: paths
    })
    //临时文件路径的设定
    for (var i = 0; i < imgPaths.fileList.length; i++) {
      result.data[i].desImage = imgPaths.fileList[i].tempFileURL
    }

    return {
      data: result.data,
      errMsg: ''
    }

  }

  return {
    data: '',
    errMsg: 'error'
  }

}


