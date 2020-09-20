// pages/my/my.js
import {selectUserCollect, selectDynamicState,userId,selectUserInfo} from "../../request/index.js"
import regeneratorRuntime, { async } from "../../lib/runtime/runtime.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    itemTitle:["钱包","秘豆","信用","段位"],
    lists:['￥100',"100g","100",'青铜'],
    imageicons:[{
      src:"../../images/xiaomi.png",
      title:"我的小秘"
    },{
      src:"../../images/information.png",
      title:"我的消息"
    },{
      src:"../../images/bazaar.png",
      title:"我的易宝"
    },{
      src:"../../images/more_two.png",
      title:"更多"
    }],
    titleList:[
    {
      action:true,
      title:"评论"
    },{
      action:false,
      title:"收藏"
    }],
    info:{},
    collects:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let that=this
    let res=await userId()
    res = await selectUserInfo(res.result.openId)
    that.setData({
      info:res.result.data[0]
    })
  },
  async bindtapchange(e){
    let that=this
    let {index}=e.currentTarget.dataset
    let {titleList}=that.data
    let j=0;
    if(!that.data.titleList[index].action){
      switch (index) {
        case 0:
          that.setData({
            collects:[]
          })
          break;
        case 1:
          let res=await selectUserCollect(that.data.info.uid,null,null,null)
          let array=[]
          res.result.data.forEach((v,i)=>{
            if(v.collect!=""){
              array[j]=v.collect
              j++
              array.forEach((o,j)=>{
                that.getDynamicState(o,j)
              })
            }
          })
          break;
      
        default:
          break;
      }
    }
    titleList.forEach((v,i)=>{
      i===index?v.action=true:v.action=false
    })
    that.setData({
      titleList:that.data.titleList
    })
  },
  handledataset(e){
    wx.navigateTo({
      url: '/pages/dataSet/dataSet',
    })  
  },
  async getDynamicState(object,j){
    let res=await selectDynamicState(null,null,object)
    this.data.collects[j]=res.result.data[0]
    this.setData({
      collects:this.data.collects
    })
  },
  getSelectUserCollect(id,like,collect,issueUserId){
    return wx.cloud.callFunction({
      name:"selectUserCollect",
      data:{
        id,like,collect,issueUserId
      }
    })
  },
  bindtapComment(e){
    let {id}=e.currentTarget.dataset
    let {uid}=e.currentTarget.dataset
    wx.navigateTo({
      url: '/pages/commentDetails/commentDetails?uid='+uid+'&id='+id
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

  }
})