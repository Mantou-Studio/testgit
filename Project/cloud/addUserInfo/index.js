const cloud=require("wx-server-sdk")
cloud.init();
const db=cloud.database()
exports.main=async(event,context)=>{
      let {id,isSetting,name,headPortait,dateTime,sex,phone,qq,age,school,address,studentID,major,sign,isAuthentication,realName,positionId}=event
  return await db.collection("userInfo").add({
    data:{
      uid:id,
      name,
      isSetting,
      headPortait,
      dateTime,
      sex,
      phone,
      qq,
      age,
      school,
      address,
      studentID,
      major,
      sign,
      isAuthentication,
      realName,
      positionId,
    }
  })
}