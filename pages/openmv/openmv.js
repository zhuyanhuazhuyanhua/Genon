// start.js

Page({
  data: {

  },
  //跳转到天气页面
  goToOneNet: function() {
      wx.navigateTo({
          url: '../wifi_station/tianqi/tianqi',
      })
  },
  goToOpMV: function() {
    wx.navigateTo({
        url: '../wifi_station/shipin/shipin',
    })
}
})