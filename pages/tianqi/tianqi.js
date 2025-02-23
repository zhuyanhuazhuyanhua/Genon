Page({
  data: {
    region: ['北京市', '北京市', '东城区'],
    now: {
      temp: 0,
      text: '未知',
      icon: '999',
      humidity: 0,
      pressure: 0,
      vis: 0,
      windDir: 0,
      windSpeed: 0,
      windScale: 0
    }
  },
 
  onLoad: function(options) {
    this.getWeather();
    const hours = new Date().getHours();
    this.setData({
      isDay: hours >= 6 && hours < 18,
    });
  },
 
  regionChange: function(e) {
    this.setData({ region: e.detail.value });
    this.getWeather();
  },
 
  getWeather: function() {
    var that = this;
 
    wx.request({
      url: 'https://geoapi.qweather.com/v2/city/lookup',
      data: {
        location: that.data.region[1],
        key: 'aff1ccc4f9494e7a8b8576bfad380d61'
      },
      success: function(res) {
        if (res.data && res.data.code === "200") {
          var cityId = res.data.location[0].id;
 
          wx.request({
            url: 'https://devapi.qweather.com/v7/weather/now',
            data: {
              location: cityId,
              key: 'aff1ccc4f9494e7a8b8576bfad380d61'
            },
            success: function(res) {
              console.log("icon value:", res.data.now.icon);
              that.setData({ now: res.data.now });
            },
            fail: function(error) {
              console.error("获取天气信息失败：", error);
            }
          });
        } else {
          console.error("城市编号获取失败：", res.data.code);
        }
      },
      fail: function(error) {
        console.error("地理位置搜索失败：", error);
      }
    });
  }
});