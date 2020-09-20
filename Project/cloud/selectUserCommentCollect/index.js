const cloud=require("wx-server-sdk")
cloud.init()
const db=cloud.database()
exports.main=async(event,context)=>{
  let {uid,commectuid,like}=event
  if(like!=null&&uid==null){
    return await db.collection("userCommentCollect").where({like}).get()
  }else if(like!=null&&uid!=null){
    return await db.collection("userCommentCollect").where({like,uid}).get()
  }
}