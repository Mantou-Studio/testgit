const cloud=require("wx-server-sdk")
cloud.init()
const db=cloud.database()
exports.main=async(event,centext)=>{
  let {id,headPortait,name}=event
  return await db.collection("dynamicStateInfo").where({uid:id}).update({
    data:{
      headPortait,
      name
    }
  })
}