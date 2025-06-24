Page({
  // pages/index/index.js

  data: {
    imageList: [
    
      'cloud://gen-6g41ip5beb54cfa4.6765-gen-6g41ip5beb54cfa4-1344129462/images/didanshenghuo.jpg',
      'cloud://gen-6g41ip5beb54cfa4.6765-gen-6g41ip5beb54cfa4-1344129462/images/guanghansenlin.jpg',
      'cloud://gen-6g41ip5beb54cfa4.6765-gen-6g41ip5beb54cfa4-1344129462/images/xidengyixioashi.jpg'
    
    ],
    currentIndex: 0, // 当前显示的图片索引
    autoplayInterval: 3000, // 自动播放的间隔时间（毫秒）
  },
  onLoad: function() {
    this.startAutoplay();
  },
  onUnload: function() {
    this.stopAutoplay();
  },
  startAutoplay: function() {
    this.autoplayTimer = setInterval(() => {
      let nextIndex = (this.data.currentIndex + 1) % this.data.imageList.length;
      this.setData({
        currentIndex: nextIndex
      });
      // 滚动到下一张图片
      //console.log("nextIndex:",nextIndex)
      //this.selectComponent('.scroll-view').scrollIntoView(this.data.imageList[nextIndex]);
    }, this.data.autoplayInterval);
  },
  stopAutoplay: function() {
    if (this.autoplayTimer) {
      clearInterval(this.autoplayTimer);
    }
  },
  onScroll: function(event) {
    // 你可以在这里处理滚动事件
    //console.log('滚动位置:', event.detail.scrollLeft);
  },


  goToAIHelper() {
    console.log('Navigating to AI Helper');
    wx.navigateTo({
      url: '/pages/ai-helper/ai-helper'
    });
  },


  goToPainter() {
    console.log('Navigating to Painter');//注=====wx.redirectTo跳转之后会删除上一级页面，navigateTo只有10层
    wx.navigateTo({
      url: '/pages/ai-painter/ai-painter'
    });
  },
  goToMods() {
    console.log('Navigating to Mods');
    wx.navigateTo({
      url: '/pages/shuiwenshuixiang/shuiwenshuixiang'
    });
  },
  goToContact() {
    console.log('Navigating to openmv');//注=====wx.redirectTo跳转之后会删除上一级页面，navigateTo只有10层
    wx.navigateTo({
      url: '/pages/openmv/openmv'
    });
  },
  goTomashang() {
    console.log('Navigating to mashang');//注=====wx.redirectTo跳转之后会删除上一级页面，navigateTo只有10层
    wx.navigateTo({
      url: '/pages/mashang/mashang'
    });
  },
  goTokg() {
    console.log('Navigating to kg');//注=====wx.redirectTo跳转之后会删除上一级页面，navigateTo只有10层
    wx.navigateTo({
      url: '/pages/kg/kg'
    });
  }
})