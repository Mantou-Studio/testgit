const cloud=require("wx-server-sdk")
cloud.init()
const db=cloud.database()
exports.main=async(event,context)=>{
  let {id,attentionId}=event
  return db.collection("userAttention").where({uid:id,attentionId}).remove()
}