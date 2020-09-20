const utils=require("../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dynamicState:[],
    dateTime:"",
    likeUserHeadPortait:[],
    uid:"",
    dynamicStateID:"",
    issueUserId:"",
    isLike:false,
    isCollect:false,
    likeSum:0,
    commentContent:"",
    commentNum:0,
    comments:[],
    commentDateTimes:[],
    userInfos:[],
    focus:false,
    placeholder:"写评论...",
    reviewID:null,
    targetID:null,
    commentLike:[],
    commentLikeNums:[],
    reviewName:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this
    const {uid}=options
    const {id}=options
    that.setData({
      dynamicStateID:id,
      issueUserId:uid
    })
    that.getDynamicState(null,uid).then(res=>{
      res.result.data.forEach((v,i)=>{
        if(v._id===id){
          that.setData({
            dynamicState:v,
            dateTime:utils.getTimeDifference(v.dateTime)
          })
        }
      })
    })
    that.getLikeUserHeadPortait()
    that.getUserID().then(res=>{
      that.setData({
        uid:res.result.openId
      })
      that.getSelectUserCollect(that.data.uid,id,null,null).then(res=>{
        res.result.data.length!=0?that.data.isLike=true:that.data.isLike=false
        that.setData({
          isLike:that.data.isLike
        })
      })
      that.getSelectUserCollect(that.data.uid,null,id,null).then(res=>{
        res.result.data.length!=0?that.data.isCollect=true:that.data.isCollect=false
        that.setData({
          isCollect:that.data.isCollect
        })
      })
    })
    that.getAllComment()
  },
  getSelectUserCommentCollect(uid,commectuid,like){
    return wx.cloud.callFunction({
      name:"selectUserCommentCollect",
      data:{
        uid,commectuid,like
      }
    })
  },
  getAllComment(){
    let that=this
    that.getSelectUserComment(null,that.data.dynamicStateID,null,null,null,null,null).then(res=>{
      that.data.commentNum=res.result.data.length
      that.setData({
        commentNum:that.data.commentNum
      })
      res.result.data.forEach((v,i)=>{
        that.data.commentDateTimes[i] = utils.getTimeDifference(v.dateTime)
        that.data.comments[i]={comment:res.result.data[i],reviews:[]}
        that.setData({
          comments:that.data.comments,
          commentDateTimes:that.data.commentDateTimes
        })
        that.getSelectUserCommentCollect(null,null,res.result.data[i]._id).then(res=>{
          if(res.result.data.length!=0){
            that.data.commentLikeNums[i]=res.result.data.length
          }else{
            that.data.commentLikeNums[i]=res.result.data.length
          }
          that.setData({
            commentLikeNums:that.data.commentLikeNums
          })
          console.log(that.data.commentLikeNums)
        })
        that.getSelectUserCommentCollect(that.data.uid,null,res.result.data[i]._id).then(res=>{
          if(res.result.data.length!=0){
            that.data.commentLike[i]=true
          }else{
            that.data.commentLike[i]=false
          }
          that.setData({
            commentLike:that.data.commentLike
          })
        })
        that.getReview(v._id,i)
        that.getSelectUserInfo(v.uid).then(res=>{
          that.data.userInfos[i]=res.result.data
          that.setData({
            userInfos:that.data.userInfos
          })
        })
      })
    })
  },
  getReview(reviewID,index){
    let that=this
    that.getSelectUserComment(null,null,reviewID,null,null,null,null).then(res=>{
      if(res.result.data.length!=0){
        res.result.data.forEach((v,i)=>{
          that.getSelectUserInfo(v.uid).then(res=>{
            let userInfos=res.result.data
            that.getSelectUserInfo(v.targetID).then(res=>{
              if(res.result.data.length==0){
                that.data.comments[index].reviews=that.data.comments[index].reviews.concat([{name:"",userInfos,dateTime:utils.getTimeDifference(v.dateTime),review:v}])
              }else{
                that.data.comments[index].reviews=that.data.comments[index].reviews.concat([{name:res.result.data[0].name,userInfos,dateTime:utils.getTimeDifference(v.dateTime),review:v}])
              }
              that.setData({
                comments:that.data.comments,
              })
            })
            that.getReview(v._id,index)
          })
        })
      }
    })
  },
  getUserID(){
    return wx.cloud.callFunction({
      name:"userId"
    })
  },
  getSelectUserInfo(id){
    return wx.cloud.callFunction({
      name:"selectUserInfo",
      data:{
        id
      }
    })
  },
  getDynamicState(text,id){
    return wx.cloud.callFunction({
      name:"selectDynamicState",
      data:{
        text,
        id
      }
    })
  },
  getSelectUserCollect(id,like,collect,issueUserId){
    return wx.cloud.callFunction({
      name:"selectUserCollect",
      data:{
        id,
        like,
        collect,
        issueUserId
      }
    })
  },
  getLikeUserHeadPortait(){
    let that=this
    that.setData({
      likeUserHeadPortait:[],
    })
    that.getSelectUserCollect(null,that.data.dynamicStateID,null,null).then(res=>{
      res.result.data.forEach((v,i)=>{
        that.getSelectUserInfo(v.uid).then(res=>{
          that.data.likeUserHeadPortait[i]=res.result.data[0].headPortait
          that.setData({
            likeUserHeadPortait:that.data.likeUserHeadPortait,
            likeSum:that.data.likeUserHeadPortait.length
          })
        })
      })
    })
  },
  bindtapCollect(e){
    let that=this
    that.data.isCollect?that.data.isCollect=false:that.data.isCollect=true
    that.setData({
      isCollect:that.data.isCollect
    })
    that.getUserID().then(res=>{
      that.setData(res=>{
        uid=res.result.openId
      })
      that.getSelectUserCollect(that.data.uid,null,that.data.dynamicState._id).then(res=>{
        if(res.result.data.length==0){
          that.getSelectUserCollect(that.data.uid,that.data.dynamicState._id,null).then(res=>{
            if(res.result.data.length==0){
              that.getAddUserCollect(that.data.uid,"",that.data.dynamicState._id)
            }else{
              that.getUpdateUserCollect(that.data.uid,null,that.data.dynamicState._id)
            }
          })
        }else{
          console.log(res)
          that.getSelectUserCollect(that.data.uid,that.data.dynamicState._id,null).then(res=>{
            if(res.result.data.length!=0){
              that.grtCancelCollect(that.data.uid,that.data.dynamicState._id)
            }else{
              console.log(res)
              that.getRemoveUserCollect(that.data.uid,null,that.data.dynamicState._id)
            }
          })
        }
      })
    })
  },
  /**
   * 评论点赞
   * @param {} e 
   */
  bindtapCommentPraise(e){
    let that=this
    let {index}=e.currentTarget.dataset
    let {uid} = that.data.comments[index].comment
    let {_id} = that.data.comments[index].comment
    that.data.commentLike[index]?that.data.commentLikeNums[index]=that.data.commentLikeNums[index]-1:that.data.commentLikeNums[index]=that.data.commentLikeNums[index]+1
    that.data.commentLike[index]?that.data.commentLike[index]=false:that.data.commentLike[index]=true
    that.setData({
      commentLikeNums:that.data.commentLikeNums,
      commentLike:that.data.commentLike
    })
    that.getUserID().then(res=>{
      that.setData({
        uid:res.result.openId
      })
      if(that.data.commentLike[index]){
        that.getAddUserCommentCollect(that.data.uid,uid,_id)
      }else{
        that.getRemoveUserCommentCollect(that.data.uid,null,_id)
      }
    })
  },
  getRemoveUserCommentCollect(uid,commectuid,like){
    return wx.cloud.callFunction({
      name:"removeUserCommentCollect",
      data:{
        uid,commectuid,like
      }
    })
  },
  getAddUserCommentCollect(uid,commectuid,like){
    return wx.cloud.callFunction({
      name:"addUserCommentCollect",
      data:{
        uid,commectuid,like
      }
    })
  },
  bindtapFocus(e){
    let that=this
    let {index}=e.currentTarget.dataset
    if(index==null){
      that.data.placeholder="写评论..."
      that.data.reviewID=null
      that.data.targetID=null
      this.setData({
        focus:true,
        placeholder:that.data.placeholder,
        reviewID:that.data.reviewID,
        targetID:that.data.targetID
      })
    }else{
      that.getUserID().then(res=>{
        if(res.result.openId==that.data.userInfos[index][0].uid){
          wx.showToast({
            title: '不能回复自己的评论哟',
            icon:"none"
          })
          return
        }else{
          that.data.placeholder="回复"+that.data.userInfos[index][0].name+"的评论"
          that.data.reviewID=that.data.comments[index].comment._id
          that.data.targetID=that.data.comments[index].comment.uid
          this.setData({
            focus:true,
            placeholder:that.data.placeholder,
            reviewID:that.data.reviewID,
            targetID:that.data.targetID
          })
        }
      })
    }
  },
  bindtapReply(e){
    let that=this
    that.getUserID().then(res=>{
      if(res.result.openId==e.currentTarget.dataset.uid){
        wx.showToast({
          title: '不能回复自己的评论哟',
          icon:"none"
        })
        return
      }else{
        console.log(e)
        that.data.placeholder="回复"+e.currentTarget.dataset.username+"的评论"
        that.data.reviewID=e.currentTarget.dataset.id
        that.data.targetID=e.currentTarget.dataset.uid
        this.setData({
          focus:true,
          placeholder:that.data.placeholder,
          reviewID:that.data.reviewID,
          targetID:that.data.targetID
        })
      }
    })
  },
  /**
   * 获取文本框内容
   * @param {} e 
   */
  bindinputComment(e){
    this.data.commentContent=e.detail.value
    this.setData({
      commentContent:this.data.commentContent
    })
  },
  /**
   * 发布评论
   * @param {*} e 
   */
  bindtapIssue(e){
    wx.showLoading({
      title: '发布中...',
    })
    let that=this
    if(that.data.commentContent==""){
      wx.hideLoading({
        success: (res) => {},
      })
      wx.showToast({
        title: '内容不能为空',
        icon:"none"
      })
      return
    }
    that.getUserID().then(res=>{
      that.getAddUserComment(that.data.dynamicStateID,that.data.reviewID,res.result.openId,that.data.targetID,that.data.commentContent,utils.formatTime(new Date())).then(res=>{
        wx.hideLoading({
          success: (res) => {
            that.setData({
              commentContent:""
            })
            that.getAllComment()
          },
        })
      })
    })
  },
  getSelectUserComment(id,dynamicStateID,reviewID,uid,targetID,content,dateTime){
    return wx.cloud.callFunction({
      name:"selectComment",
      data:{
        id,dynamicStateID,reviewID,uid,targetID,content,dateTime
      }
    })
  },
  getAddUserComment(dynamicStateID,reviewID,uid,targetID,content,dateTime){
    return wx.cloud.callFunction({
      name:"addComment",
      data:{
        dynamicStateID,
        reviewID,
        uid,
        targetID,
        content,
        dateTime
      }
    })
  },
  /**
   * 放大图片预览
   */
  bindtapPreview(e){
    let {array}=e.currentTarget.dataset
    let {src}=e.currentTarget.dataset
    wx.previewImage({
      current:src,
      urls: array,
    })
  },
  /**
   * 点赞
   */
  bindtapLike(e){
    let that=this
    that.data.isLike?that.data.likeSum=that.data.likeSum-1:that.data.likeSum=that.data.likeSum+1
    that.data.isLike?that.data.isLike=false:that.data.isLike=true
    that.setData({
      isLike:that.data.isLike,
      likeSum:that.data.likeSum
    })
    that.getUserID().then(res=>{
      that.setData({
        uid:res.result.openId
      })
      that.getSelectUserCollect(that.data.uid,that.data.dynamicState._id,null).then(res=>{
        if(res.result.data.length==0){
          that.getSelectUserCollect(that.data.uid,null,that.data.dynamicState._id).then(res=>{
            if(res.result.data.length==0){
              that.getAddUserCollect(that.data.uid,that.data.dynamicState._id,"",that.data.dynamicState.uid).then(res=>{
                that.getLikeUserHeadPortait()
              })
            }else{
              that.getUpdateUserCollect(that.data.uid,that.data.dynamicState._id,null).then(res=>{
                that.getLikeUserHeadPortait()
              })
            }
          })
        }else{
          console.log(res)
          that.getSelectUserCollect(that.data.uid,null,that.data.dynamicState._id).then(res=>{
            if(res.result.data.length!=0){
              that.getCancelLike(that.data.uid,that.data.dynamicState._id).then(res=>{
                that.getLikeUserHeadPortait()
              })
            }else{
              that.getRemoveUserCollect(that.data.uid,that.data.dynamicState._id,null).then(res=>{
                that.getLikeUserHeadPortait()
              })
            }
          })
        }
      })
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
   grtCancelCollect(uid,collect){
     let that=this
     return wx.cloud.callFunction({
       name:"cancelCollect",
       data:{
         id:uid,
         collect
       }
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let that =this;
    return {
      title: '校园小唤·带你了解你所不知道的校园生活', // 转发后 所显示的title
      path: '/pages/commentDatails/commentDatails?uid='+that.data.issueUserId+'&id='+that.data.dynamicStateID, // 相对的路径
      success: (res)=>{  
      },
      fail: function (res) {
      }
    }
  }
})