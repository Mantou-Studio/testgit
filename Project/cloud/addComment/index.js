const cloud=require("wx-server-sdk")
cloud.init()
const db=cloud.database()
exports.main=async(event,context)=>{
  let {dynamicStateID,reviewID,uid,targetID,content,dateTime}=event
  return await db.collection("userComment").add({
    data:{
      dynamicStateID,
      reviewID,
      uid,
      targetID,
      content,
      dateTime
    }
  })
}