const util = require("../../utils/util");
import {userId,selectUserCollect,selectComment,homeSwiper,homeNavtab,selectDynamicState,addUserCollect,updateUserCollect,cancelCollect,removeUserCollect,cancelLike, selectUserInfo} from "../../request/index.js"
import regeneratorRuntime from "../../lib/runtime/runtime.js"
// pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageList:[],
    navtabList:[],
    dynamicStates:[],
    uid:"",
    dynamicState:[],
    dateTime:[],
    pageNum:6,
    pageSum:1,
    currentPageIndex:1,
    likes:[],
    collects:[],
    likeSum:[],
    commentNums:[]
  },




  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...',
    })
    let that=this;
    const cache=wx.getStorageSync('dynamicState')
    const navtab=wx.getStorageSync('navtabList')
    if(!cache){
      that.getPageData(0)
    }else{
      if(new Date(util.formatTime(new Date())).getTime()-new Date(cache.time).getTime()>1000*60*3){
        that.setData({
          dynamicStates:[],
          dynamicState:[],
          likes:[],
          collects:[],
          likeSum:[],
        })
        that.getPageData(0)
      }else{
        that.setData({
          imageList:cache.data.imageList,
          dynamicStates:cache.data.dynamicStates,
          navtabList:navtab.data,
        })
        that.data.dynamicStates.forEach((v,i)=>{
          if(v.uid==0){
            that.setData({
              // dynamicState:v.content,
              ['dynamicState['+that.data.dynamicState.length+']']:v.content,
            })
            console.log(that.data.dynamicState)
            v.content.forEach((o,j)=>{
              that.getDynamicState(o,j)
            })
          }
        })
        wx.hideLoading({
          success: (res) => {},
        })
      }
    }
  },
  async getDynamicState(o,j){
    let that=this
    let res = await userId()
    that.setData({
      uid:res.result.openId
    })
    that.data.dateTime[j]=util.getTimeDifference(o.dateTime)
    that.setData({
      dateTime:that.data.dateTime
    })
    that.getLikeSum(j,o._id)
    that.getCommentNums(o,j)
    that.getUserLike(that.data.uid,o._id,j)
    that.getUserCollect(that.data.uid,o._id,j)
  },
  async getUserLike(id,like,j){
    let that=this
    let res =await selectUserCollect(id,like,null,null)
    let {likes}=that.data
    if(res.result.data.length!=0)
    {
      if(res.result.data[0].uid==that.data.uid){
        likes[j] = true
      }else{
        likes[j] = false
      }
      that.setData({
        likes
      })
    }else{
      likes[j] = false
    }
    that.setData({
      likes
    })
  },
  async getUserCollect(id,collect,j){
    let that=this
    let res =await selectUserCollect(id,null,collect,null)
    let {collects}=that.data
    if(res.result.data.length!=0)
    {
      if(res.result.data[0].uid==that.data.uid){
        collects[j] = true
      }else{
        collects[j] = false
      }
      that.setData({
        collects
      })
    }else{
      collects[j] = false
    }
    that.setData({
      collects
    })
  },
  async getCommentNums(o,j){
    let that=this
    let res=await selectComment(null,o._id,null,null,null,null,null)
    that.data.commentNums[j] = res.result.data.length
    that.setData({
      commentNums:that.data.commentNums
    })
  },
  async getPageData(index){
    let that=this
    //获取homeSwiper里的数据进行绑定
    let res=await homeSwiper()
    that.setData({
      imageList:res.result.data
    })
      //获取homeNavtab里的数据进行绑定
    res=await homeNavtab()
    that.setData({
      navtabList:res.result.data
    })
    wx.setStorageSync('navtabList', {data:res.result.data})
    that.getAllData(index)
  },
  async getAllData(index){
    let that=this
    const {navtabList}=this.data
    let res = await userId()
    navtabList.forEach((v,i)=>{
      if(v.title!="个人动态"){
        that.getDynamicStates(v.title,null,index,i)
      }else{
        that.getDynamicStates(null,res.result.openId,index,i)
      }
    })
  },
  async getDynamicStates(text,id,index,i){
    let that=this
    let res=await selectDynamicState(text,id,null,null)
    that.setData({
      // dynamicStates:that.data.dynamicStates.concat([{content:res.result.data,uid:i}])
      ['dynamicStates['+that.data.dynamicStates.length+']']:{content:res.result.data,uid:i}
    })
    that.setCache('dynamicState',index)
  },
  displayPage(index){
    let that=this;
    let navtab=[]
    const cache=wx.getStorageSync('dynamicState');
    if(cache.data.dynamicStates.length==that.data.navtabList.length){
      that.judgeUser()
      cache.data.dynamicStates.forEach((v,i)=>{
        if(v.uid==index){
          that.setData({
            ['dynamicState['+that.data.dynamicState.length+']']:v.content,
            imageList:cache.data.imageList,
            ['dynamicStates['+that.data.dynamicStates.length+']']:cache.data.dynamicStates,
          })
          v.content.forEach((o,j)=>{
            that.getDynamicState(o,j)
          })
        }
      })
      wx.stopPullDownRefresh({
        success: (res) => {
          wx.hideLoading({
            success: (res) => {
            },
          })
        },
      })
    }
  },
  setCache(e,index){
    let that=this
    wx.setStorageSync(e, {
      time:util.formatTime(new Date()),
      data:{
        imageList:that.data.imageList,
        dynamicStates:that.data.dynamicStates,
      }
    })
    that.displayPage(index)
  },
  /*
    切换页面
  */
  async getLikeSum(index,like){
    let that=this
    let res=await selectUserCollect(null,like,null)
    that.data.likeSum[index]=res.result.data.length
    that.setData({
      likeSum:that.data.likeSum
    })
  },
  ItemChange(e){
    let that=this;
    const {index}=e.detail;
    const {navtabList}=this.data;
    const {dynamicStates}=this.data;
    if(!navtabList[index].isAction){
      that.setData({
        termination:true,
        isRefresh:true
      })
    }
    navtabList.forEach((v,i)=>{
      i===index?v.isAction=true:v.isAction=false
    })
    console.log(that.data.dynamicStates)
    dynamicStates.forEach((v,i)=>{
      if(v.uid==index){
        that.setData({
          dynamicState:[],
          commentNums:[],
          ['dynamicState['+that.data.dynamicState.length+']']:v.content
        })
        v.content.forEach((o,j)=>{
          that.getCommentNums(o,j)
        })
      }
    })
    that.setData({
      navtabList
    })
  },
  async bindtapCollect(e){
    let that=this
    let {index}=e.currentTarget.dataset
    that.data.collects[index]?that.data.collects[index]=false:that.data.collects[index]=true
    that.setData({
      collects:that.data.collects
    })
    let res= await userId()
    that.setData(res=>{
      uid=res.result.openId
    })
    res=await selectUserCollect(that.data.uid,null,that.data.dynamicState[that.data.dynamicState.length-1][index]._id)
    if(res.result.data.length==0){
      res = await selectUserCollect(that.data.uid,that.data.dynamicState[that.data.dynamicState.length-1][index]._id,null)
      if(res.result.data.length==0){
        addUserCollect(that.data.uid,"",that.data.dynamicState[that.data.dynamicState.length-1][index]._id)
      }else{
        updateUserCollect(that.data.uid,null,that.data.dynamicState[that.data.dynamicState.length-1][index]._id)
      }
    }else{
      res= await selectUserCollect(that.data.uid,that.data.dynamicState[that.data.dynamicState.length-1][index]._id,null)
      if(res.result.data.length!=0){
        cancelCollect(that.data.uid,that.data.dynamicState[that.data.dynamicState.length-1][index]._id)
      }else{
        removeUserCollect(that.data.uid,null,that.data.dynamicState[that.data.dynamicState.length-1][index]._id)
      }
    }
  },
  getUserId(){
    return wx.cloud.callFunction({
      name:"userId"
    })
  },
  async bindtapLike(e){
    let that=this
    let {index}=e.currentTarget.dataset
    that.data.likes[index]?that.data.likeSum[index]=that.data.likeSum[index]-1:that.data.likeSum[index]=that.data.likeSum[index]+1
    that.data.likes[index]?that.data.likes[index]=false:that.data.likes[index]=true
    that.setData({
      likes:that.data.likes,
      likeSum:that.data.likeSum
    })
    let res = await userId()
    that.setData({
      uid:res.result.openId
    })
    res=await selectUserCollect(that.data.uid,that.data.dynamicState[that.data.dynamicState.length-1][index]._id,null)
    if(res.result.data.length==0){
      res=await selectUserCollect(that.data.uid,null,that.data.dynamicState[that.data.dynamicState.length-1][index]._id)
      if(res.result.data.length==0){
        addUserCollect(that.data.uid,that.data.dynamicState[that.data.dynamicState.length-1][index]._id,"",that.data.dynamicState[that.data.dynamicState.length-1][index].uid)
      }else{
        updateUserCollect(that.data.uid,that.data.dynamicState[that.data.dynamicState.length-1][index]._id,null)
      }
    }else{
      res= await selectUserCollect(that.data.uid,null,that.data.dynamicState[that.data.dynamicState.length-1][index]._id)
      if(res.result.data.length!=0){
        cancelLike(that.data.uid,that.data.dynamicState[that.data.dynamicState.length-1][index]._id)
      }else{
        removeUserCollect(that.data.uid,that.data.dynamicState[that.data.dynamicState.length-1][index]._id,null)
      }
    }
  },
  /*
    发布动态
  */
  dynamicState(e){
    let that=this;
    wx.showToast({
      title: '加载中...',
      icon:"loading",
      duration:600
    })
    wx.navigateTo({
      url: '../dynamicState/dynamicState',
      success: (result) => {
        setTimeout(function(){
          that.setData({
            isPro:false
          })
        },500)
      },
      fail: (res) => {},
      complete: (res) => {},
    })
  },
  /*
    图片预览
  */ 
  bindtapPreview(e){
    let {array}=e.currentTarget.dataset
    let {src}=e.currentTarget.dataset
    wx.previewImage({
      current:src,
      urls: array,
    })
  },
  async judgeUser(){
    let that=this
    let res=await userId()
    that.setData({
      uid:res.result.openId
    })
    res = await selectUserInfo(that.data.uid)
    if(res.result.data.length==0){
      wx.navigateTo({
        url: '../navigation/navigation?uid='+that.data.uid,
        success(res){}
      })
    }else{
      if(!res.result.data[0].isSetting){
        wx.showModal({
          title: '提示：头像或昵称暂未设置',
          content: '是否前往信息设置页设置头像或昵称',
          success(res){
            if (res.confirm) {
              wx.navigateTo({
                url: '../dataSet/dataSet',
              }) 
            }
          }
        })
      }
    }
  },
  /**
   * 点击头像或者文本跳转详情页
   */
  bindtapDetails(e){
    let that=this;
    const {index}=e.currentTarget.dataset
    const {tab}=that.data.dynamicState[that.data.dynamicState.length-1][index]
    const userId=that.data.dynamicState[that.data.dynamicState.length-1][index].uid
    wx.navigateTo({
      url: '../../pages/dynamicDetails/dynamicDetails?uid='+userId+'&tab='+tab,
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
  /*
  *分享
  */

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showLoading({
      title: '加载中...',
    })
    let that=this;
    if(that.data.navtabList==null){
      that.getPageData(0)
      wx.hideLoading({
        success: (res) => {},
      })
      return;
    }
    that.data.navtabList.forEach((v,i)=>{
      if(v.isAction){
        that.setData({
          dynamicStates:[],
          dynamicState:[],
          imageList:wx.getStorageSync('dynamicState').data.imageList,
          dateTime:[],
          likes:[],
          collects:[]
        })
        that.getAllData(i)
      }
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    wx.showLoading({
      title: '加载中...',
    })
    let that=this
    that.setData({
      pageSum:Math.ceil(that.data.dynamicState.length/that.data.pageNum),
    })
    if(that.data.currentPageIndex<=that.data.pageSum){
      that.setData({
        currentPageIndex:++that.data.currentPageIndex,
        pageNum:that.data.pageNum*that.data.currentPageIndex
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
    let that =this;
    return {
      title: '校园小唤·带你了解你所不知道的校园生活', // 转发后 所显示的title
      path: '/pages/home/home', // 相对的路径
      success: (res)=>{  
      },
      fail: function (res) {
      }
    }
  },
    /**
   * 跳转评论详情页
   * */
  bindtapComment(e){
    let that=this
    let {index}=e.currentTarget.dataset
    let {uid}=that.data.dynamicState[that.data.dynamicState.length-1][index]
    let {_id}=that.data.dynamicState[that.data.dynamicState.length-1][index]
    wx.navigateTo({
      url: '/pages/commentDetails/commentDetails?uid='+uid+'&id='+_id
    })
  },
})