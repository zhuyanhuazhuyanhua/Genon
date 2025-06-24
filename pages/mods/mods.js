Page({
  data: {
    lon: '', // 经度
    lat: '', // 纬度
    result: '' // 用于存储格式化的返回数据
  },

  // 经度输入框绑定
  onLonInput(e) {
    this.setData({
      lon: e.detail.value
    });
  },

  // 纬度输入框绑定
  onLatInput(e) {
    this.setData({
      lat: e.detail.value
    });
  },

  // 发送请求
  sendRequest() {
    const { lon, lat } = this.data;
    if (!lon || !lat) {
      console.error('请输入完整的经纬度！');
      wx.showToast({
        title: '请输入完整的经纬度！',
        icon: 'none'
      });
      return;
    }

    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzY29wZSI6WyJzZGMtYXBpIiwic2RjLWFwcCJdLCJleHAiOjE3NDM1OTc2NzUsImp0aSI6ImE1NDEwZTRlLTE4NTMtNGYzYS05NWEzLWI5NTM3MTk3NTBhMiIsImNsaWVudF9pZCI6Im1hcmtldF9hcGkwMSJ9.pDiZWveUDgqEb6oup4S3TLawpXzSTnhac4v-Mp52suM';
    const url = 'https://market.myvessel.cn/sdc/v1/mkt/weather/forecast/wind';

    wx.request({
      url: url,
      method: 'POST',
      header: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      data: JSON.stringify({
        lon: parseFloat(lon),
        lat: parseFloat(lat)
      }),
      success: (res) => {
        console.log('请求成功，返回数据：', res.data);
        if (res.data && res.data.data) {
          // 假设 res.data.data 是一个数组
          let formattedData = ''; // 用于存储格式化后的数据字符串
          res.data.data.forEach((windData, index) => {
            formattedData += `
              第${index + 1}条数据：
              时间：${windData.dateHourString}，
              风速：${windData.windSpeed}，
              风型：${windData.windSpeedDescCn}，
              风级：${windData.windLevelDescCn}，
              风向：${windData.windDirectionDescCn}
            `;
          });
          this.setData({
            result: formattedData
          });
        } else {
          this.setData({
            result: '未获取到有效的数据'
          });
        }
      },
      fail: (err) => {
        console.error('请求失败，错误信息：', err);
        wx.showToast({
          title: '请求失败，请稍后重试',
          icon: 'none'
        });
      }
    });
  }
});