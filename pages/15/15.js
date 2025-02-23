Page({
  data: {
    depsVtabs: []
  },
  
  onLoad: function() {
    wx.showLoading({
      title: '加载中...',
    });
    this.downloadFile();
  },
  goToAnotherPage: function () {
    wx.navigateTo({
      url: '/pages/15kg/15kg'
    });
  },
  downloadFile: function() {
    wx.cloud.downloadFile({
      fileID: 'cloud://gen-6g41ip5beb54cfa4.6765-gen-6g41ip5beb54cfa4-1344129462/new_file含碳率.json',
      success: result => {
        console.log("文件下载成功", result);
        let fs = wx.getFileSystemManager();
        let depJson = fs.readFileSync(result.tempFilePath, "utf-8");
        console.log("文件内容", depJson);
        try {
          let data = JSON.parse(depJson);
          console.log("解析后的数据", data);
          this.setData({
            depsVtabs: data
          }, () => {
            console.log("更新后的depsVtabs", this.data.depsVtabs);
            wx.hideLoading();
          });
        } catch (e) {
          console.error("解析 JSON 失败", e);
          wx.showToast({
            title: '解析文件失败，请检查文件内容是否为有效的 JSON 格式',
            icon: 'none',
            duration: 2000
          });
          wx.hideLoading();
          // 尝试重新下载文件
          setTimeout(() => {
            this.downloadFile();
          }, 2000);
        }
      },
      fail: error => {
        console.error("下载文件失败", error);
        wx.showToast({
          title: '下载文件失败，请检查网络连接或文件路径',
          icon: 'none',
          duration: 2000
        });
        wx.hideLoading();
      }
    });
  }
});