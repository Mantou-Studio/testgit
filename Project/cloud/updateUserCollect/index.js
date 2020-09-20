const cloud=require("wx-server-sdk")
cloud.init()
const db=cloud.database()
exports.main=async(event,context)=>{
  let {id,like,collect}=event
  if(like!=null&&collect==null){
    return await db.collection("userCollect").where({uid:id,collect:like}).update({
      data:{
        like
      }
    })
  }else if(like==null&&collect!=null){
    return await db.collection("userCollect").where({uid:id,like:collect}).update({
      data:{
        collect
      }
    })
  }else{
    return await db.collection("userCollect").where({uid:id,collect:like,like:collect}).update({
      data:{
        like,
        collect
      }
    })
  }

}