const cloud=require("wx-server-sdk");
cloud.init();
let db=cloud.database();
exports.main=async(event,context)=>{
  return db.collection("dynamicStateTab").where({
    isManage:false
  }).get();
}