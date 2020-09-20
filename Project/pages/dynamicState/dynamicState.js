const util = require("../../utils/util");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageList:[],
    tabList:[],
    isAnonymity:true,
    isClick:false,
    isLoading:false,
    isAction:true,
    content:"",
    cloudImage:[],
    name:"",
    headPortait:"",
    uid:""
  },
  clickSwitch(e){
    this.setData({
      isClick:this.data.isClick?false:true
    })
  },
  clickUpload(e){
    let that=this;
    wx.chooseImage({
      count:9,
      success(res){
        that.setData({
          imageList:res.tempFiles
        })
      }
    })
  },
  clickIssue(e){
    let that=this;
    // var uid=""
    wx.showLoading({
      title: '发布中...',
    })
    // if(that.data.isAction){
      if(that.data.imageList.length!=0){
        let {imageList}=that.data;
        imageList.forEach((v,i)=>{
          let date=util.formatDate(new Date())
          let random=util.randomWork(10)
          let suffix= v.path.split('.')
          let fileName=date+random+'.'+suffix[suffix.length-1]
          wx.cloud.uploadFile({
              cloudPath:"user/dynamicState/"+fileName,
              filePath: v.path,
              success(res){
                  that.data.cloudImage[i]=res.fileID
                  that.setData({
                    cloudImage:that.data.cloudImage
                  })
                  if(that.data.cloudImage.length==imageList.length){
                    wx.cloud.callFunction({
                      name:"userId",
                      success(res){
                        var tab=""
                        // uid=res.result.openId
                        that.setData({
                          uid:res.result.openId
                        })
                        const {tabList} = that.data
                        tabList.forEach((v,i)=>{
                          if(v.isAction){
                            tab = v.tab
                          }
                        })
                        wx.cloud.callFunction({
                          name:"issue",
                          data:{
                            uid:that.data.uid,
                            cloudImage:that.data.cloudImage,
                            content:that.data.content,
                            tab,
                            isAnonymity:that.data.isClick,
                            current:util.formatTime(new Date()),
                            name:that.data.name,
                            headPortait:that.data.headPortait
                          }
                        }).then(res=>{
                          console.log(that.data.name)
                          that.setData({
                            content:"",
                            cloudImage:[],
                            imageList:[]
                          })
                          wx.hideLoading()
                          wx.showToast({
                            title: '发布成功',
                            icon:"success",
                            duration:900
                          })
                          setTimeout(function(){
                            wx.switchTab({
                              url: '/pages/home/home',
                            })
                          },900)
                        }).catch(err=>{
                          wx.showToast({
                            title: '发布失败',
                            icon:"none",
                            duration:900
                          })
                         wx.hideLoading()
                        })
                      }
                    })
                  }
              },fail(res){
                wx.showToast({
                  title: '图片上传失败，请您的检查网络配置',
                  icon:"none",
                  duration:900
                })
              }
            })
        })
      }else if(that.data.content!=""&&that.data.imageList.length==0){
        wx.cloud.callFunction({
          name:"userId",
          success(res){
            var tab=""
            that.setData({
              uid:res.result.openId
            })
            const {tabList} = that.data
            tabList.forEach((v,i)=>{
              if(v.isAction){
                tab = v.tab
              }
            })
            wx.cloud.callFunction({
              name:"issue",
              data:{
                uid:that.data.uid,
                cloudImage:that.data.cloudImage,
                content:that.data.content,
                tab,
                isAnonymity:that.data.isClick,
                current:util.formatTime(new Date()),
                name:that.data.name,
                headPortait:that.data.headPortait
              }
            }).then(res=>{
              that.setData({
                content:"",
                cloudImage:[],
                imageList:[]
              })
              wx.hideLoading()
              wx.showToast({
                title: '发布成功',
                icon:"success",
                duration:900
              })
              setTimeout(function(){
                wx.switchTab({
                  url: '/pages/home/home',
                })
              },900)
            }).catch(err=>{
              console.log(err);
              wx.hideLoading()
              wx.showToast({
                title: '发布失败',
                icon:"none",
                duration:900
              })
            })
          }
        })
      }else{
        wx.showToast({
          title: '请编写内容',
          icon:"none",
          duration:900
        })
      }
    // }else{
    //   wx.showToast({
    //     title: '请选择消息类型',
    //     icon:"none",
    //     duration:900
    //   })
    // }
  },
  getContent(e){
    this.setData({
      content:e.detail.value
    })
  },
  clickAction(e){
    let that=this;
    wx.showLoading({
      title: '加载中...',
    })
    // that.setData({
    //   isAction:true
    // })
    const {index}=e.currentTarget.dataset;
    const {tabList}=this.data;
    tabList.forEach((v,i)=>{
      i===index?v.isAction=true:v.isAction=false;
      if(i===index&&v.Anonymity){
        v.isAnonymity=true;
      }else{
        v.isAnonymity=false;
      }
    })
    that.setData({
      tabList,
      isAnonymity:tabList[index].isAnonymity
    })
    wx.hideLoading()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this;
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
          headPortait:res.result.data[0].headPortait
        })
      })
      that.setData({
        isLoading:true
      })  
      wx.cloud.callFunction({
        name:"dynamicStateTab",
        success(res){
          that.setData({
            tabList:res.result.data
          })
          setTimeout(function(){
            that.setData({
              isLoading:false
            })
          },1500)
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})