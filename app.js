App({
  towxml: require('./wxcomponents/towxml/index.js'),
  data:{
    master_api_key:'version=2022-05-01&res=userid%2F432462&et=1904034657&method=md5&sign=4I2DxVpvMIXgeNuqD8Hf%2BA%3D%3D',
  },
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
    this.startInterval();
  },

  // 使用 onShow 替代部分 onLaunch 的逻辑
  onShow() {
    // 放置一些需要在小程序显示时才执行的代码
  },

  globalData: {
    star:[],// 预定义全局变量，避免运行时动态创建
    queryName:'玫瑰',
    numberRange:[],

    location:'苏州市'
  },

  startInterval() {
    setInterval(() => {
      this.globalFunction();
    }, 10000);
  },

  globalFunction() {
    const { queryName } = this.globalData;
    wx.cloud.callFunction({
      name: 'top5_re',
      data: { name: queryName },
      success: (res) => {
        console.log('云函数',queryName);
        console.log('云函数top5调用成功:', res.result);
        const results = res.result.similarNodes;
        const dataResults = results.map(item => item.name)
        const unique = [...new Set(dataResults)]
        console.log("unique:",unique)
        if (unique) {
          this.globalData.numberRange = unique
        } else {
          this.globalData.numberRange = ['玫瑰','月季','康乃馨','桂花','樱花','桃花','杏花','丁香']
        }
      },
      fail: (err) => {
        console.error('云函数top5调用失败:', err);
        // wx.showToast({
        //   title: '查询失败',
        //   icon: 'none'
        // });
      }
    });
    console.log('每隔30秒执行一次的函数');
  }
});