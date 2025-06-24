Page({
  data: {
    areaName: '',
    categoryName: '',
    date: '',
    responseData: null,
    errorMsg: ''
  },

  // 处理区域名称输入
  handleAreaNameInput(e) {
    this.setData({
      areaName: e.detail.value
    });
  },

  // 处理品类名称输入
  handleCategoryNameInput(e) {
    this.setData({
      categoryName: e.detail.value
    });
  },

  // 处理日期输入
  handleDateInput(e) {
    this.setData({
      date: e.detail.value
    });
  },

  // 发起请求
  fetchData() {
    const { areaName, categoryName, date } = this.data;
    console.log('发起请求', areaName, categoryName, date);
    const host = 'https://agroprice.market.alicloudapi.com';
    const path = '/aliyun/market/category/detail';
    const appcode = 'f4b1c88a274f407aa6a9839f89d46cf9';
    const querys = `areaName=${encodeURIComponent(areaName)}&categoryName=${encodeURIComponent(categoryName)}&date=${encodeURIComponent(date)}`;
    const url = `${host}${path}?${querys}`;

    console.log('请求URL:', url);
    console.log('请求头:', {
      'Authorization': `APPCODE ${appcode}`
    });
    wx.request({
      url,
      method: 'GET',
      header: {
        'Authorization': `APPCODE ${appcode}`
      },
      success: (res) => {
        console.log('请求成功:', res);
        console.log('响应数据:', res.data);
        if (res.statusCode === 200) {
          if (res.data.code === 0) {
            this.setData({
              responseData: res.data,
              errorMsg: ''
            });
          } else {
            this.setData({
              responseData: null,
              errorMsg: res.data.msg
            });
          }
        } else {
          this.setData({
            responseData: null,
            errorMsg: `请求失败，状态码: ${res.statusCode}，请稍后重试`
          });
        }
      },
      fail: (err) => {
        this.setData({
          responseData: null,
          errorMsg: '网络错误: ${err.errMsg}, 请检查网络连接'
        });
        console.error('请求失败:', err);
      },

    });
  }
});