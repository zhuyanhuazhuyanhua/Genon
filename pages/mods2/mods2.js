// pages/mods2/mods2.js
Page({

        data: {
          messages: [],
          inputValue: '',
          isLoading: false
        },
        handleInput: function (e) {
          this.setData({
            inputValue: e.detail.value
          });
        },
        sendChatMessage: function () {
          this.setData({
            isLoading: true
          });
          // 这里可以添加发送消息的逻辑，例如调用 API 发送消息
          // 当消息发送成功或失败后，需要将 isLoading 设置为 false
          setTimeout(() => {
            // 模拟发送消息的延迟，实际应用中应替换为真实的 API 调用
            const newMessage = {
              role: 'user',
              content: this.data.inputValue
            };
            this.setData({
              messages: [...this.data.messages, newMessage],
              inputValue: '',
              isLoading: false
            });
          }, 2000);
        },

  /**
   * 页面的初始数据
   */


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