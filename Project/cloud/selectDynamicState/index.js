const cloud=require("wx-server-sdk")
cloud.init()
const db=cloud.database()
exports.main=async(event,content)=>{
  let {text,id,_id} = event
  if(id!=null){
    return db.collection("dynamicStateInfo").orderBy('dateTime','desc').where({uid:id}).get()
  }else if(text=="全部"){
    return db.collection("dynamicStateInfo").orderBy('dateTime','desc').get()
  }else if(_id!=null){
    return db.collection("dynamicStateInfo").where({_id}).get()
  }
  return db.collection("dynamicStateInfo").orderBy('dateTime','desc').where({tab:text}).get()
}