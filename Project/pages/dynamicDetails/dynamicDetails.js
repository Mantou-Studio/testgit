const utils=require("../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    headPortait:"",
    name:"",
    address:"",
    isAuthentication:false,
    school:"",
    uid:"",//自己的ID
    attentionId:"",
    isShow:false,
    isAttention:false,
    praiseNum:0,
    attentionNum:0,
    dynamicStateNum:0,
    dynamicStates:[],
    dateTimes:[],
    likes:[],
    collects:[],
    likeSum:[],
    userId:"",
    tab:"",
    displayNum:6,
    pageNum:1,
    currentPageSize:1
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {uid}=options;
    const {tab}=options;
    let that=this;
    that.setData({
      attentionId:uid
    })
    that.getUserId().then(res=>{
      that.setData({
        uid:res.result.openId,
        userId:uid,
        tab:tab
      })
      switch(tab){
        case "官方":
          break;
        case "#话题":
          break;
        case "树洞":
          break;
        default:
          that.getSelectAttention(null,uid).then(res=>{
            that.setData({
              attentionNum:res.result.data.length
            })
          })
          that.getLikeNum(uid).then(res=>{
            that.setData({
              praiseNum:res.result.data.length
            })
          })
          that.getDynamicState(null,uid).then(res=>{
            that.setData({
              dynamicStateNum:res.result.data.length,
              dynamicStates:res.result.data
            })
            that.data.dynamicStates.forEach((v,i)=>{
              that.data.dateTimes[i]=utils.getTimeDifference(v.dateTime)
              that.getLikeSum(i,v._id,null)
              that.getSelectUserCollect(that.data.uid,v._id,null).then(res=>{
                let {likes}=that.data
                if(res.result.data.length!=0)
                {
                  if(res.result.data[0].uid==that.data.uid){
                    likes[i] = true
                  }else{
                    likes[i] = false
                  }
                  that.setData({
                    likes
                  })
                }else{
                  likes[i] = false
                }
                that.setData({
                  likes
                })
              })
              that.getSelectUserCollect(that.data.uid,null,v._id).then(res=>{
                let {collects} = that.data
                if(res.result.data.length!=0)
                {
                  if(res.result.data[0].uid==that.data.uid){
                    collects[i] = true
                  }else{
                    collects[i] = false
                  }
                  that.setData({
                    collects
                  })
                }else{
                  collects[i] = false
                }
                that.setData({
                  collects
                })
              })
              that.setData({
                dateTimes:that.data.dateTimes
              })
            })
          })
          that.getSelectAttention(that.data.uid,uid).then(res=>{
            res.result.data.length==0?that.data.isAttention=false:that.data.isAttention=true
            that.setData({
              isAttention:that.data.isAttention
            })
          })
          that.getUserInfo(uid).then(res=>{
            if(uid==that.data.uid){
              that.getDetailsData(res.result.data[0],false)
            }else{
              that.getDetailsData(res.result.data[0],true)
            }
          })
          break;
      }
    })
  },
  getLikeNum(issueUserId){
    return wx.cloud.callFunction({
      name:"selectUserCollect",
      data:{
        issueUserId
      }
    })
  },
  getDetailsData(data,option){
    let that=this;
    that.setData({
      headPortait:data.headPortait,
      name:data.name,
      isAuthentication:data.isAuthentication,
      address:data.address,
      school:data.school,
      isShow:option
    })
  },
  getDynamicState(text,uid){
    return wx.cloud.callFunction({
      name:"selectDynamicState",
      data:{
        text,
        id:uid
      }
    })
  },
  /**
   * 查询对应用户ID的用户信息
   * @param {用户ID} uid 
   */
  getUserInfo(uid){
    return wx.cloud.callFunction({
      name:"selectUserInfo",
      data:{
        id:uid
      }
    })
  },
  /**
   * 图片放大预览
   */
  bindtapPreview(e){
    let {array}=e.currentTarget.dataset
    let {src}=e.currentTarget.dataset
    wx.previewImage({
      urls: array,
      current:src
    })
  },
  /**
   * 关注
   */
  bindtapAttention(e){
    let that=this;
    that.data.isAttention?that.data.attentionNum = that.data.attentionNum-1:that.data.attentionNum = that.data.attentionNum+1
    that.data.isAttention?that.data.isAttention=false:that.data.isAttention=true
    that.setData({
      isAttention:that.data.isAttention,
      attentionNum:that.data.attentionNum
    })
    that.getUserId().then(res=>{
      that.setData({
        uid:res.result.openId
      })
      that.getSelectAttention(that.data.uid,that.data.attentionId).then(res=>{
        if(res.result.data.length==0){
          that.getAddAttention(that.data.uid,that.data.attentionId)
        }else{
          that.getRemoveAttention(that.data.uid,that.data.attentionId)
        }
      })
    })
  },
  /**
   * 收藏
   */
  bindtapCollect(e){
    let that=this
    let {index}=e.currentTarget.dataset
    that.data.collects[index]?that.data.collects[index]=false:that.data.collects[index]=true
    that.setData({
      collects:that.data.collects
    })
    that.getUserId().then(res=>{
      that.setData(res=>{
        uid=res.result.openId
      })
      that.getSelectUserCollect(that.data.uid,null,that.data.dynamicStates[index]._id).then(res=>{
        if(res.result.data.length==0){
          that.getSelectUserCollect(that.data.uid,that.data.dynamicStates[index]._id,null).then(res=>{
            if(res.result.data.length==0){
              that.getAddUserCollect(that.data.uid,"",that.data.dynamicStates[index]._id)
            }else{
              that.getUpdateUserCollect(that.data.uid,null,that.data.dynamicStates[index]._id)
            }
          })
        }else{
          that.getSelectUserCollect(that.data.uid,that.data.dynamicStates[index]._id,null).then(res=>{
            if(res.result.data.length!=0){
              that.grtCancelCollect(that.data.uid,that.data.dynamicStates[index]._id)
            }else{
              that.getRemoveUserCollect(that.data.uid,null,that.data.dynamicStates[index]._id)
            }
          })
        }
      })
    })
  },
  grtCancelCollect(uid,collect){
    return wx.cloud.callFunction({
      name:"cancelCollect",
      data:{
        id:uid,
        collect
      }
    })
  },
  getUserId(){
    return wx.cloud.callFunction({
      name:"userId"
    })
  },
  getAddAttention(uid,attentionId){
    return wx.cloud.callFunction({
      name:"addAttention",
      data:{
        id:uid,
        attentionId
      }
    })
  },
  getSelectAttention(uid,attentionId){
    return wx.cloud.callFunction({
      name:"selectAttention",
      data:{
        id:uid,
        attentionId,
      }
    })
  },
  getRemoveAttention(uid,attentionId){
    return wx.cloud.callFunction({
      name:"removeAttention",
      data:{
        id:uid,
        attentionId
      }
    })
  },
  getLikeSum(index,like){
    let that=this
    wx.cloud.callFunction({
      name:"selectUserCollect",
      data:{
        like
      }
    }).then(res=>{
      that.data.likeSum[index]=res.result.data.length
      that.setData({
        likeSum:that.data.likeSum
      })
    })
  },
  getCancelLike(uid,like){
    let that=this
    return wx.cloud.callFunction({
      name:"cancelLike",
      data:{
        id:uid,
        like
      }
    })
  },
  getRemoveUserCollect(uid,like,collect){
    return wx.cloud.callFunction({
      name:"removeUserCollect",
      data:{
        id:uid,
        like,
        collect
      }
    })
  },
  getUpdateUserCollect(uid,like,collect){
    return wx.cloud.callFunction({
      name:"updateUserCollect",
      data:{
        id:uid,
        like,
        collect
      }
    })
  },
  getSelectUserCollect(uid,like,collect){
    return wx.cloud.callFunction({
         name:"selectUserCollect",
         data:{
           id:uid,
           like,
           collect
         }
       })
   },
   getAddUserCollect(uid,like,collect,issueUserId){
    return wx.cloud.callFunction({
      name:"addUserCollect",
      data:{
        id:uid,
        like,
        collect,
        issueUserId
      }
    })
  },
  /**
   * 点赞
   */
  bindtapLike(e){
    let that=this
    let {index}=e.currentTarget.dataset
    that.data.likes[index]?that.data.likeSum[index]=that.data.likeSum[index]-1:that.data.likeSum[index]=that.data.likeSum[index]+1
    that.data.likes[index]?that.data.likes[index]=false:that.data.likes[index]=true
    that.setData({
      likes:that.data.likes,
      likeSum:that.data.likeSum
    })
    that.getUserId().then(res=>{
      that.setData({
        uid:res.result.openId
      })
      that.getSelectUserCollect(that.data.uid,that.data.dynamicStates[index]._id,null).then(res=>{
        console.log(res)
        if(res.result.data.length==0){
          that.getSelectUserCollect(that.data.uid,null,that.data.dynamicStates[index]._id).then(res=>{
            if(res.result.data.length==0){
              console.log(res)
              that.getAddUserCollect(that.data.uid,that.data.dynamicStates[index]._id,"",that.data.dynamicStates[index].uid)
            }else{
              console.log(that.data.dynamicStates[index]._id)
              that.getUpdateUserCollect(that.data.uid,that.data.dynamicStates[index]._id,null)
            }
          })
        }else{
          console.log(res)
          that.getSelectUserCollect(that.data.uid,null,that.data.dynamicStates[index]._id).then(res=>{
            if(res.result.data.length!=0){
              that.getCancelLike(that.data.uid,that.data.dynamicStates[index]._id)
            }else{
              console.log(res)
              that.getRemoveUserCollect(that.data.uid,that.data.dynamicStates[index]._id,null)
            }
          })
        }
      })
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that=this
    wx.showLoading({
      title: '加载中...',
    })
     that.setData({
       pageNum: Math.ceil(that.data.dynamicStates.length / 6),
     })
     if(that.data.currentPageSize<=that.data.pageNum){
      that.setData({
        currentPageSize: ++that.data.currentPageSize
      })
      wx.hideLoading({
        success: (res) => {},
      })
     }else{
       wx.hideLoading({
         success: (res) => {},
       })
       wx.showToast({
         title: '已加载全部',
         icon:"none"
       })
     }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let that=this
    return {
      title: '校园小唤·带你了解你所不知道的校园生活', // 转发后 所显示的title
      path: '/pages/dynamicDetails/dynamicDetails?uid='+that.data.userId+'&tab='+that.data.tab, // 相对的路径
      success: (res)=>{ 
      },
      fail: function (res) {
      }
    }
  }
})