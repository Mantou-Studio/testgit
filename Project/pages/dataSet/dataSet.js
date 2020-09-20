const util=require("../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:"",
    headPortait:"",
    sex:"",
    age:"",
    phone:"",
    qq:"",
    sign:"",
    displayPhone:"",
    settingAge:"",
    isAuthentication:false,
    httpFilePath:"",
    array:['男','女'],
    isFirst:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...',
    })
    const cache=wx.getStorageSync('userInfo')
    let that=this;
    if(!cache){
     that.setUserInfo()
    }else{
      if(new Date(util.formatTime(new Date())).getTime-new Date(cache.time).getTime>1000*60*60*24){
        that.setData({
          name:"",
          headPortait:"",
          sex:"",
          age:"",
          phone:"",
          qq:"",
          sign:"",
          studentID:"",
          displayPhone:"",
          isAuthentication:""
        })
        that.setUserInfo()
      }else{
        that.setData({
          name:cache.data.name,
          headPortait:cache.data.headPortait,
          sex:cache.data.sex,
          age:cache.data.age,
          phone:cache.data.phone,
          qq:cache.data.qq,
          sign:cache.data.sign,
          isAuthentication:cache.data.isAuthentication
        })
        if(that.data.age!=""){
          that.judgeAge(that.data.age)
        }
        if(that.data.phone!=""){
          that.setData({
            displayPhone:that.data.phone.substring(0,3)+"****"+that.data.phone.substring(that.data.phone.length-4,that.data.phone.length)
          })
        }
        wx.hideLoading({
          success: (res) => {},
        })
      }
    }
  },
  bindSaveData(e){
    let that=this
    wx.showModal({
      title:"提示：是否保存修改",
      content:"是否保存修改的所有数据"
    }).then(res=>{
      if(res.confirm){
        wx.showLoading({
          title: '修改中...'
        })
        if(that.data.httpFilePath!=""){
          let time=util.formatDate(new Date())
          let random=util.randomWork(10)
          let suffix=that.data.httpFilePath.split('.')
          let fileName=time+random+"."+suffix[suffix.length-1]
          wx.cloud.uploadFile({
            filePath: that.data.httpFilePath,
            cloudPath:"user/headPortait/"+fileName
          }).then(res=>{
            that.setData({
              httpFilePath:res.fileID
            })
            that.updateUserInfo(that.data.httpFilePath)
          })
        }else{
          that.updateUserInfo(that.data.headPortait)
        }
      }
    })
  },
  bindBlurName(e){
    if(e.detail.value==""){
      wx.showToast({
        title: '昵称不能为空',
        icon:"none"
      })
    }else{
      this.setData({
        name:e.detail.value
      })
    }
  },
  bindSexChange(e){
    this.setData({
      sex:this.data.array[e.detail.value]
    })
  },
  bindBlurPhone(e){
    if((/^1[3456789]\d{9}$/.test(e.detail.value))){
      this.setData({
        phone:e.detail.value,
        displayPhone:e.detail.value.substring(0,3)+"****"+e.detail.value.substring(e.detail.value.length-4,e.detail.value.length)
      })
    }else{
      wx.showToast({
        title: '请填写正确的手机号',
        icon:"none"
      })
      this.setData({
        displayPhone:""
      })
    }
  },
  bindBlurQQ(e){
    if((/^[1-9]\d{8,9}$/.test(e.detail.value))){
      this.setData({
        qq:e.detail.value
      })
    }else{
      wx.showToast({
        title: '请填写正确的QQ号',
        icon:"none"
      })
      this.setData({
        qq:""
      })
    }
  },
  bindInputSign(e){
    this.setData({
      sign:e.detail.value
    })
  },
  updateUserInfo(headPortait){
    let that=this
    wx.cloud.callFunction({
      name:"userId",
    }).then(res=>{
      that.updateDynamicState(res.result.openId,headPortait)
      wx.cloud.callFunction({
        name:"updateUserInfo",
        data:{
          id:res.result.openId,
          name:that.data.name,
          isSetting:true,
          headPortait,
          sex:that.data.sex,
          phone:that.data.phone,
          qq:that.data.qq,
          age:that.data.age,
          sign:that.data.sign,
          isAuthentication:that.data.isAuthentication
        }
      }).then(res=>{
        that.setUserInfo()
      })
    })
  },
  updateDynamicState(id,headPortait){
    let that=this
    wx.cloud.callFunction({
      name:"updateDynamicState",
      data:{
        id,
        name:that.data.name,
        headPortait
      }
    }).then(res=>{
      console.log(res)
    })
  },
  setUserInfo(){
    let that =this
    wx.cloud.callFunction({
      name:"userId",
    }).then(res=>{
      wx.cloud.callFunction({
        name:"selectUserInfo",
        data:{
          id:res.result.openId
        }
      }).then(res=>{
        that.setData({
          name:res.result.data[0].name,
          headPortait:res.result.data[0].headPortait,
          sex:res.result.data[0].sex,
          age:res.result.data[0].age,
          phone:res.result.data[0].phone,
          qq:res.result.data[0].qq,
          sign:res.result.data[0].sign,
          isAuthentication:res.result.data[0].isAuthentication
        })
        if(that.data.age!=""){
          that.judgeAge(that.data.age)
        }
        if(that.data.phone!=""){
          that.setData({
            displayPhone:that.data.phone.substring(0,3)+"****"+that.data.phone.substring(that.data.phone.length-4,that.data.phone.length)
          })
        }
        wx.setStorageSync('userInfo', {time:util.formatTime(new Date()),data:{
          name:that.data.name,
          headPortait:that.data.headPortait,
          sex:that.data.sex,
          age:that.data.age,
          phone:that.data.phone,
          qq:that.data.qq,
          sign:that.data.sign,
          isAuthentication:that.data.isAuthentication
        }})
        wx.hideLoading({
          success: (res) => {
            if(!that.data.isFirst){
             wx.showToast({
               title: '修改成功',
               icon:"success"
             })
            }
            that.setData({
              isFirst:false
            })
          },
        })
      })
    })
  },
  replaceHeadPortait(e){
    let that=this
    wx.chooseImage({
      count:1
    }).then(res=>{
      that.setData({
        httpFilePath:res.tempFilePaths[0],
        headPortait:res.tempFilePaths[0]
      })
    })
  },
  bindDateChange(e){
    if(new Date(util.formatTime(new Date())).getTime()<new Date(e.detail.value).getTime()){
      wx.showToast({
        title: '请选择正确的日期',
        icon:"none"
      })
    }else{
      this.setData({
        age:e.detail.value
      })
      this.judgeAge(e.detail.value)
    }
  },
  judgeAge(time){
    let start = parseInt(util.formatSelectDate(new Date()).split('-')[0])
    let end = parseInt(time.split('-')[0])
    let settingAge=""
    if(start-end==0){
      settingAge="刚出生"
    }else if(start-end>160){
      settingAge="时光老人"
    }else{
      settingAge=(start-end)+"岁"
    }
    this.setData({
      settingAge
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