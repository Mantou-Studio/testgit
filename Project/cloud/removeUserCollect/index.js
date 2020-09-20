const cloud=require("wx-server-sdk")
cloud.init()
const db=cloud.database()
exports.main=async(event,context)=>{
  let {id,like,collect}=event
  if(like!=null){
    return await db.collection("userCollect").where({like,uid:id}).remove()
  }else{
    return await db.collection("userCollect").where({collect,uid:id}).remove()
  }
}