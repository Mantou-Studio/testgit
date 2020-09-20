const cloud=require("wx-server-sdk")
cloud.init()
const db=cloud.database()
exports.main=async(event,context)=>{
  let {id}=event
  return await db.collection("userInfo").where({uid:id}).get()
}