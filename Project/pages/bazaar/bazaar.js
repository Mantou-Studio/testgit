// pages/bazaar/bazaar.js
import {userId,selectUserInfo} from "../../request/index.js"
import regeneratorRuntime from "../../lib/runtime/runtime"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    typeclass:["全部商品","书籍","电子数码","衣服服饰","日用百货","学习用品","其他"],
    timeclass:["按发布时间","热度","价格排序","价格升序"],
    type:"分类·全部",
    time:"按发布时间"
  },
  bindchangeType(e){
    let {value}=e.detail
    let that=this
    let {type}=that.data
    switch(that.data.typeclass[value]){
      case "全部商品":
        type="分类·全部"
        break;
      case "书籍":
        type="分类·书籍"
        break;
      case "其他":
        type="分类·其他"
        break;
      default:
        type=that.data.typeclass[value]
        break
    }
    that.setData({
      type
    })
  },
  bindchangeTime(e){
    let {value}=e.detail
    let that=this
    let {time}=that.data
    time=that.data.timeclass[value]
    that.setData({
      time
    })
  },
  async handleissue(e){
    wx.showLoading({
      title: '请稍等...',
    })
    let that=this;
    let res=await userId()
    let {openId}=res.result
    res=await selectUserInfo(openId)
    let {qq,phone,isAuthentication}=res.result.data[0]
    if(qq==""&&phone==""){
      wx.hideLoading({
        success: (res) => {},
      })
      wx.showModal({
        title: '提示：暂未设置联系方式',
        content:"需要前往信息设置页设置您的联系QQ或者电话，以便于买家/卖家及时联系到您"
      }).then(res=>{
        if(res.confirm){
          wx.navigateTo({
            url: '/pages/dataSet/dataSet',
          })
        }
      })
    }else if(!isAuthentication){
      wx.hideLoading({
        success: (res) => {},
      })
      wx.showModal({
        title:"提示:发布易宝需要实名认证",
        content:"需要前往实名认证页进行认证您的信息"
      }).then(res=>{
        if(res.confirm){
          wx.showToast({
            title: '实名认证页尚未开发完成',
            icon:"none"
          })
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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