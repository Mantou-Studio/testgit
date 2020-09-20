// pages/components/navtab/navtab.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list:{
      type:Array,
      value:[],
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    clickAction(e){
      wx.showToast({
        title: '加载中...',
        icon:"loading",
        duration:900
      })
      const {index}=e.currentTarget.dataset;
      this.triggerEvent("itemChange",{index})
    }
  }
})
