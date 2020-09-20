const cloud=require("wx-server-sdk")
cloud.init()
const db=cloud.database()
exports.main=async(event,context)=>{
  let {id,attentionId}=event
  if(id==null&&attentionId!=null){
    return db.collection("userAttention").where({attentionId}).get()
  }else{
    return db.collection("userAttention").where({uid:id,attentionId}).get()
  }
}