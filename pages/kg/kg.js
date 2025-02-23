// pages/kg/kg.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    similarityResult: null, 
  },
  
  calculateSimilarity() {
    // 在微信小程序中调用云函数
    wx.cloud.callFunction({
      name: 'caltimate_neibor', // 云函数名称
      data: {
        name1: '花卉类别', // 输入的第一个节点名称
        name2: '花卉大全'    // 输入的第二个节点名称
      },
      success: (res) => {
        console.log('云函数调用成功:', res.result.similarity);
        if (res.result && res.result.similarity !== undefined) {
          this.setData({
            similarityResult: res.result.similarity.toFixed(2) // 将相似度结果保留两位小数并更新到页面数据
          });
        } else {
          this.setData({
            similarityResult: null
          });
        }
      },
      fail: (err) => {
        console.error('云函数调用失败:', err);
        wx.showToast({
          title: '计算失败',
          icon: 'none'
        });
      }
    });
  },
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