// pages/xiaomi/xiaomi.js
import {userId,selectUserInfo} from "../../request/index.js"
import regeneratorRuntime from "../../lib/runtime/runtime.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  handlegetUserInfo(e){
    console.log(e)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  async bindtapIssue(e){
    wx.showLoading({
      title: '请稍等...',
    })
    let res=await userId()
    let {openId}=res.result
    res = await selectUserInfo(openId)
    let {isAuthentication}=res.result.data[0]
    if(!isAuthentication){
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