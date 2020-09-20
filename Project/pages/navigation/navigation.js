const util=require("../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uid:""
  },
  clickMale(e){
    this.getAddUserInfo("男","../../images/anonymity_male.png")
    wx.switchTab({
      url: "../home/home",
      success(res){}
    })
  }
  ,clickFemale(e){
    this.getAddUserInfo("女","../../images/anonymity_female.png")
    wx.switchTab({
      url: "../home/home",
      success(res){}
    })
  },
  getAddUserInfo(sex,headPortait){
    let that=this;
    return wx.cloud.callFunction({
      name:"addUserInfo",
      data:{
        id:that.data.uid,
        isSetting:false,
        name:util.randomWork(6),
        headPortait,
        dateTime:util.formatTime(new Date()),
        sex,
        phone:"",
        qq:"",
        age:"",
        school:"",
        address:"",
        studentID:"",
        major:"",
        sign:"",
        isAuthentication:false,
        realName:"",
        positionId:""
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      uid:options.uid
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