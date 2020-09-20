const cloud = require("wx-server-sdk")
cloud.init()
const db=cloud.database()
exports.main=async(event,context)=>{
  let {id,isSetting,name,headPortait,sex,phone,qq,age,sign,isAuthentication}=event
  return await db.collection("userInfo").where({uid:id}).update({
    data:{
      name,
      isSetting,
      headPortait,
      sex,
      phone,
      qq,
      age,
      sign,
      isAuthentication
    }
  })
}