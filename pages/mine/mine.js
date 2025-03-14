// pages/mine/mine.js

Page({
  data: {

    userphono: '/images/蛇红包.png',
    inputClass: 'input-empty',
    username: '',
    buttonHidden: false,
    phoneNumber:'账号',
  },
  onLoad() {
    // this.getUserInfo();
  },
  onButtonClick1: function() {//快捷登录
    wx.navigateTo({
      url: '/pages/go_login/go_login'
    });
  },
  onButtonClick: function() {//快捷登录
    this.setData({
      buttonHidden: true
    });
  },
  getPhoneNumber(event) {
    console.log(event)

    console.log(event.detail.code)  // 动态令牌
    console.log(event.detail.errMsg) // 回调信息（成功失败都会返回）
    console.log(event.detail.errno)  // 错误码（失败时返回）
    wx.request({
    //   url: 'http://localhost:8000/login/',
      url: 'http://39.105.111.133:8001/login/',
      data: { code: event.detail.code },
      dataType: 'json',
      header: this.data.header,
      method: "POST",
      responseType: this.data.responseType,
      timeout: 100000, // 设置超时时间为100秒
      success: (result) => {
        console.log('请求成功', result);
        this.setData({
          phoneNumber:result.data.phoneNumber
        });
        
      },
      fail: (err) => {
        console.log('请求失败', err);
      },
      complete: (res) => {
        console.log('请求完成', res);
      },
    })
  },

  choosePhoto(event) {//获取头像
    console.log(event)
    this.setData({
      userphono: event.detail.avatarUrl
    })
  },
  onInput: function (e) {//获取昵称
    let username = e.detail.value;
    this.setData({
      username: username,
      inputClass: username.length === 0 ? "input-empty" : "input-filled"
    });
    console.log(this.data.username);
  },
  // goToContact() {
  //   console.log('Navigating to Contact');//注=====wx.redirectTo跳转之后会删除上一级页面，navigateTo只有10层
  //   wx.navigateTo({
  //     url: '/pages/contact/contact'
  //   });
  // },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})