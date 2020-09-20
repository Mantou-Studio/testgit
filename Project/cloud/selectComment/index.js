const cloud=require("wx-server-sdk")
cloud.init()
const db=cloud.database()
exports.main=async(event,context)=>{
  let {id,dynamicStateID,reviewID,uid,targetID,content,dateTime}=event
  if(dynamicStateID!=null&&id==null&&reviewID==null&&uid==null&&targetID==null&&content==null&&dateTime==null){
    return await db.collection("userComment").where({dynamicStateID,targetID:null}).orderBy('dateTime','desc').get()
  }else if(dynamicStateID==null&&uid==null&&dateTime==null&&reviewID!=null&&content==null&&targetID==null){
    return await db.collection("userComment").where({reviewID}).get()
  }
}