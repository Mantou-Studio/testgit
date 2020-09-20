export const userId=()=>{
  return new Promise((resolve,reject)=>{
    wx.cloud.callFunction({
      name:"userId",
      success:(res)=>{
        resolve(res)
      },
      fail:(err)=>{
        reject(err)
      }
    })
  })
}

export const selectUserInfo=(id)=>{
  return new Promise((resolve,reject)=>{
    wx.cloud.callFunction({
      name:"selectUserInfo",
      data:{
        id
      },
      success:(res=>{
        resolve(res)
      }),
      fail:(err=>{
        reject(err)
      })
    })
  })
}

export const selectUserCollect=(id,like,collect,issueUserId)=>{
  return new Promise((resolve,reject)=>{
    wx.cloud.callFunction({
      name:"selectUserCollect",
      data:{
        id,like,collect,issueUserId
      },
      success(res){
        resolve(res)
      },fail(err){
        reject(err)
      }
    })
  })
}

export const selectDynamicState=(text,id,_id)=>{
  return new Promise((resolve,reject)=>{
    wx.cloud.callFunction({
      name:"selectDynamicState",
      data:{
        text,id,_id
      },
      success(res){
        resolve(res)
      },
      fail(err){
        reject(err)
      }
    })
  })
}

export const selectComment=(id,dynamicStateID,reviewID,uid,targetID,content,dateTime)=>{
  return new Promise((resolve,reject)=>{
    wx.cloud.callFunction({
      name:"selectComment",
      data:{id,dynamicStateID,reviewID,uid,targetID,content,dateTime},
      success(res){
        resolve(res)
      },
      fail(err){
        reject(err)
      }
    })
  })
}

export const homeSwiper=()=>{
  return new Promise((resolve,reject)=>{
    wx.cloud.callFunction({
      name:"homeSwiper",
      success(res){
        resolve(res)
      },
      fail(err){
        reject(err)
      }
    })
  })
}

export const homeNavtab=()=>{
  return new Promise((resolve,reject)=>{
    wx.cloud.callFunction({
      name:"homeNavtab",
      success(res){
        resolve(res)
      },
      fail(err){
        reject(err)
      }
    })
  })
}

export const addUserCollect=(id,like,collect,issueUserId)=>{
  return new Promise((resolve,reject)=>{
    wx.cloud.callFunction({
      name:"addUserCollect",
      data:{
        id,like,collect,issueUserId
      },
      success(res){
        resolve(res)
      },
      fail(err){
        reject(err)
      }
    })
  })
}

export const updateUserCollect=(id,like,collect)=>{
  return new Promise((resolve,reject)=>{
    wx.cloud.callFunction({
      name:"updateUserCollect",
      data:{
        id,like,collect
      },
      success(res){
        resolve(res)
      },
      fail(err){
        reject(err)
      }
    })
  })
}

export const cancelCollect=(id,collect)=>{
  return new Promise((resolve,reject)=>{
    wx.cloud.callFunction({
      name:"cancelCollect",
      data:{
        id,collect
      },
      success(res){
        resolve(res)
      },
      fail(err){
        reject(err)
      }
    })
  })
}

export const removeUserCollect=(id,like,collect)=>{
  return new Promise((resolve,reject)=>{
    wx.cloud.callFunction({
      name:"removeUserCollect",
      data:{
        id,like,collect
      },
      success(res){
        resolve(res)
      },
      fail(err){
        reject(err)
      }
    })
  })
}

export const cancelLike=(id,like)=>{
  return new Promise((resolve,reject)=>{
    wx.cloud.callFunction({
      name:"cancelLike",
      data:{
        id,like
      },
      success(res){
        resolve(res)
      },
      fail(err){
        reject(err)
      }
    })
  })
}