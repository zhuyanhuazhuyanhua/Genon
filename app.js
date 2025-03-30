App({
  onLaunch() {
      //默认开启调试
    wx.setEnableDebug({
        enableDebug: false
      });
    // 初始化云环境
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        traceUser: true,
        env: 'gen-6g41ip5beb54cfa4' // 这里替换为你的云环境 ID
      });
    }

    // 使用异步加载
    setTimeout(() => {
      // 将非必要的初始化操作放在这里
    }, 0);
  },

  // 使用 onShow 替代部分 onLaunch 的逻辑
  onShow() {
    // 放置一些需要在小程序显示时才执行的代码
  },

  globalData: {
    star:[]// 预定义全局变量，避免运行时动态创建
  }
});