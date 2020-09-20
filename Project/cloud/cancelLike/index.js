const cloud=require("wx-server-sdk")
cloud.init()
const db=cloud.database()
exports.main=async(event,context)=>{
  let {id,like}=event
  return await db.collection("userCollect").where({uid:id,like}).update({
    data:{
      like:""
    }
  })
}