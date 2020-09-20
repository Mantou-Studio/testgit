const cloud=require("wx-server-sdk")
cloud.init()
const db=cloud.database()
exports.main=async(event,context)=>{
  let {id,like,collect,issueUserId}=event
  if(like!=null&&collect==null&&id!=null&&issueUserId==null){
    return await db.collection("userCollect").where({like,uid:id}).get()
  }else if(like!=null&&id==null&&collect==null&&issueUserId==null){
    return await db.collection("userCollect").where({like}).get()
  }else if(collect!=null&&like==null){
    return await db.collection("userCollect").where({collect,uid:id}).get()
  }else if(id!=null&&like==null&&collect==null&&issueUserId==null){
    return await db.collection("userCollect").where({uid:id}).get()
  }else if(issueUserId!=null){
    return await db.collection("userCollect").where({issueUserId}).get()
  }else{
    return await db.collection("userCollect").where({like,collect,uid:id}).get()
  }
}