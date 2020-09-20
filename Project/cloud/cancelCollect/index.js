const cloud=require("wx-server-sdk")
cloud.init()
const db=cloud.database()
exports.main=async(event,context)=>{
  let {id,collect}=event
  return await db.collection("userCollect").where({uid:id,collect}).update({
    data:{
      collect:""
    }
  })
}