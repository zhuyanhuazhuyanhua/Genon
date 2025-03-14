// pages/kg/kg.js

Page({
    /**
     * 页面的初始数据
     */
    data: {
      name1: '', // 存储用户输入的第一个节点名称
      name2: '', // 存储用户输入的第二个节点名称
      similarityResult: null, // 相似度结果
    },
  
    // 监听输入框变化
    onInputChange(event) {
      const field = event.currentTarget.dataset.field; // 获取 data-field 的值
      this.setData({
        [field]: event.detail.value, // 动态更新 name1 或 name2
      });
    },
  
    // 计算相似度
    calculateSimilarity() {
      const { name1, name2 } = this.data;
  
      if (!name1 || !name2) {
        wx.showToast({
          title: '请输入完整的节点名称',
          icon: 'none'
        });
        return;
      }
  
      // 调用云函数
      wx.cloud.callFunction({
        name: 'try1', // 云函数名称
        data: { name1, name2 }, // 传入用户输入的节点名称
        success: (res) => {
          console.log('云函数调用成功:', res.result);
          if (res.result && res.result.similarity !== undefined) {
            this.setData({
              similarityResult: res.result.similarity.toFixed(2), // 保留两位小数
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