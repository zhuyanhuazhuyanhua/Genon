// index.js
Page({
  data: {
    showMessage: false,
    message: '',
    userphono: '/images/蛇红包.png',
    username: '',
    inputClass: "input-empty",
    name: '',
    userNickname: '',//
    buttonHidden: false
  },
// 在微信小程序的.js 文件中

  onButtonClick: function() {
    this.setData({
      buttonHidden: true
    });
  },


  onInput: function (e) {
    let username = e.detail.value;
    this.setData({
      username: username,
      inputClass: username.length === 0 ? "input-empty" : "input-filled"
    });
    console.log(this.data.username);
  },
  getPhoneNumber(event) {
    console.log(event)

    console.log(event.detail.code)  // 动态令牌
    console.log(event.detail.errMsg) // 回调信息（成功失败都会返回）
    console.log(event.detail.errno)  // 错误码（失败时返回）
    wx.request({
      url: 'http://localhost:8000/login/',
      data: { code: event.detail.code },
      dataType: 'json',
      header: this.data.header,
      method: "POST",
      responseType: this.data.responseType,
      timeout: 10000, // 设置超时时间为10秒
      success: (result) => {
        console.log('请求成功', result);
      },
      fail: (err) => {
        console.log('请求失败', err);
      },
      complete: (res) => {
        console.log('请求完成', res);
      },
    })
  },

  onLoad: function () {
    // this.getUserName();
  },

  choosePhoto(event) {
    console.log(event)
    this.setData({
      userphono: event.detail.avatarUrl
    })

  },
  onLoginButtonTap: function () {
    var that = this;
    wx.login({
      success: function (res) {
        if (res.code) {
          wx.request({
            url: 'https://your-server-url.com/login',
            data: {
              code: res.code
            },
            success: function (response) {
              // 服务器会使用 code 换取 openid 和 session_key 等信息
              console.log(response.data);
              that.setData({
                showMessage: true,
                message: '登录成功'
              });
            },
            fail: function (error) {
              that.setData({
                showMessage: true,
                message: '登录失败，请重试'
              });
              console.log(error);
            }
          });
        } else {
          that.setData({
            showMessage: true,
            message: '登录失败！' + res.errMsg
          });
          console.log('登录失败！' + res.errMsg);
        }
      }
    });
  },
  onShareAppMessage() {
    return {
      title: '神农再现modes',
      query: 'name=justin&age=19',
      imageUrl: '/images/生物能源-2.png'
    }
  },
  onShareTimeline() {
    return {
      title: '神农再现modes',
      query: 'name=justin&age=19',
      imageUrl: '/images/生物能源-2.png'
    }
  }
});