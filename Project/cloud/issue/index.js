const cloud=require("wx-server-sdk")
cloud.init()
const db=cloud.database()
exports.main=async(event,context)=>{
  let {uid,cloudImage,content,tab,isAnonymity,current,name,headPortait}=event
  return await db.collection("dynamicStateInfo").add({
    data:{
      uid,
      cloudImage:cloudImage,
      content:content,
      tab:tab,
      isAnonymity:isAnonymity,
      dateTime:current,
      name:name,
      headPortait:headPortait
    }
  })
}