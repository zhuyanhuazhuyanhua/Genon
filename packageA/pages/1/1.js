Page({
  data: {
    depsVtabs: []
  },
  goToAnotherPage: function () {
    wx.navigateTo({
      url: '/packageA/pages/1kg/1kg'
    });
  },
  star:function(event){
    var app = getApp();
    const item = event.currentTarget.dataset.item;
    
    const exists = app.globalData.star.some((existingItem) => existingItem.name === item.name);

    if (!exists) {
      app.globalData.star.push(item);
      console.log(app.globalData.star,"收藏成功");
    } else {
      console.log("该元素已收藏");
    }
  },
  onLoad: function() {
    this.downloadFile();
  },
  downloadFile: function() {
    wx.cloud.downloadFile({
      fileID: 'cloud://gen-6g41ip5beb54cfa4.6765-gen-6g41ip5beb54cfa4-1344129462/coordinates地被.json',
      success: result => {
        let fs = wx.getFileSystemManager();
        let depJson = fs.readFileSync(result.tempFilePath, "utf-8");
        let parsedJson = JSON.parse(depJson); // 解析 JSON 数据
        console.log("下载的 JSON 数据：", parsedJson); // 打印 JSON 数据到调试台
        this.setData({
          depsVtabs: JSON.parse(depJson)
        }, () => {
          wx.hideLoading();
        });
      },
      fail: error => {
        console.error("下载文件失败", error);
      }
    });
  }
});