const cloud=require("wx-server-sdk");
cloud.init();
exports.main=async(event,context)=>{
  let {userInfo}=event
  return userInfo
}