const cloud=require("wx-server-sdk")
cloud.init()
const db=cloud.database()
exports.main=async(event,context)=>{
  let {id,like,collect,issueUserId}=event
  return await db.collection("userCollect").add({
    data:{
      uid:id,
      like,
      collect,
      issueUserId
    }
  })
}