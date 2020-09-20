const cloud=require("wx-server-sdk")
cloud.init()
const db=cloud.database()
exports.main=async(event,context)=>{
  let {uid,commectuid,like}=event
  return await db.collection("userCommentCollect").where({uid,like}).remove()
}