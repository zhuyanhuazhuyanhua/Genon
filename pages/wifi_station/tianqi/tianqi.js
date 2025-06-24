var myCharts = require("../../../utils/wxcharts.js")//引入一个绘图的插件
const app = getApp()

Page({
  data: {},
  touchHandler: function (e) {
    this.lineChart_emo.scrollStart(e); // 使用正确的图表实例
  },
  moveHandler: function (e) {
    this.lineChart_emo.scroll(e); // 使用正确的图表实例
  },
  touchEndHandler: function (e) {
    this.lineChart_emo.scrollEnd(e); // 使用正确的图表实例
    this.lineChart_emo.showToolTip(e, {
      format: function (item, category) {
        return category + ' ' + item.name + ':' + item.data 
      }
    });        
  },
  /**
   * @description 页面下拉刷新事件
   */
  onPullDownRefresh: function () {
    wx.showLoading({
      title: "正在获取"
    })
    this.getDatapoints().then(datapoints => {
      this.update(datapoints)
      wx.hideLoading()
    }).catch((error) => {
      wx.hideLoading()
      console.error(error)
    })
  },

  /**
   * @description 页面加载生命周期
   */
  onLoad: function () {


    //每隔6s自动获取一次数据进行更新
    const timer = setInterval(() => {
      this.getDatapoints().then(datapoints => {
        this.update(datapoints)
      })
    }, 5000)

    wx.showLoading({
      title: '加载中'
    })

    this.getDatapoints().then((datapoints) => {
      wx.hideLoading()
      this.firstDraw(datapoints)
    }).catch((err) => {
      wx.hideLoading()
      console.error(err)
      clearInterval(timer) //首次渲染发生错误时禁止自动刷新
    })
  },

  /**
   * 向OneNet请求当前设备的数据点
   * @returns Promise
   */
  getDatapoints: function () {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `https://iot-api.heclouds.com/thingmodel/query-device-property?product_id=872J3JNuv6&device_name=mqtt1`,
        header: {
          'content-type': 'application/json',
          'authorization': app.data.master_api_key
        },
        success: (res) => {
          const response = res.data.data[0];
          console.log('准备上报的属性值:',res.data.data[0]);
          // 提取温度和湿度数据
          const temperatureData = response;
          const humidityData = response;
          const temperature = temperatureData ? temperatureData.value : null;
          const humidity = humidityData ? humidityData.value : null;
          console.log('准备上报的属性值-1:',temperature);
    
          // 获取当前时间戳
          const timestamp = new Date().toISOString();
          console.log('时间戳',timestamp);
  
          // 累积温度数据
          let tempData = this.data.temperatureData || [];
          tempData.push({ value: temperature, at: timestamp });
          if (tempData.length > 10) {
            tempData.shift(); // 移除最早的数据点以保持最大长度为10
          }
          this.setData({ temperatureData: tempData });
  
          // 累积湿度数据
          let humiData = this.data.humidityData || [];
          humiData.push({ value: humidity, at: timestamp });
          if (humiData.length > 10) {
            humiData.shift(); // 移除最早的数据点以保持最大长度为30
          }
          this.setData({ humidityData: humiData });

          let categoryData = this.data.categoryData || { above70: 0, between50And70: 0, below50: 0 , total: 0};
          if (temperature > 70) {
            categoryData.above70++;
            categoryData.total++;
          } else if (temperature >= 50 && temperature <= 70) {
            categoryData.between50And70++;
            categoryData.total++;
          } else {
            categoryData.below50++;
            categoryData.total++;
          }
          this.setData({ categoryData: categoryData });
  
          // 返回累积数据
          resolve({
            temperature: tempData,
            humidity: humiData,
            categoryData: categoryData 
          });
        },
        fail: (err) => {
          reject(err);
        }
      });
    });
  },
  
  
 

  /**
   * @param {Object[]} datapoints 从OneNet云平台上获取到的数据点
   * 传入获取到的数据点, 函数自动更新图标
   */
  update: function (datapoints) {
    const wheatherData = this.convert(datapoints);

    this.lineChart_emo.updateData({
      categories: wheatherData.categories,
      series: [{
        name: '健康指数',
        data: wheatherData.humidity,
        format: (val, name) => val.toFixed(0),
        color: '#3580E8'
      }],
    })

    this.lineChart_tempe.updateData({
      series: [{
        name: '优',
        data: wheatherData.categoryData[0].above70/wheatherData.categoryData[0].total*100,
        color:'#48C024'
      },{
        name: '良',
        data: wheatherData.categoryData[0].between50And70/wheatherData.categoryData[0].total*100,
        color:'#C0E545'
      },{
        name: '差',
        data: wheatherData.categoryData[0].below50/wheatherData.categoryData[0].total*100,
        color:'#F1A650'
      }],
    })

  },

  /**
   * 
   * @param {Object[]} datapoints 从OneNet云平台上获取到的数据点
   * 传入数据点, 返回使用于图表的数据格式
   */
  convert: function (datapoints) {
    var categories = [];
    var humidity = [];
    var tempe = [];
    var categoryData = [];

    var length = datapoints.humidity.length
    console.log("数据集：",datapoints)
    for (var i = 0; i < length; i++) {
      categories.push(datapoints.humidity[i].at.slice(5, 19));
      humidity.push(datapoints.humidity[i].value);
      tempe.push(datapoints.temperature[i].value);
      categoryData.push(datapoints.categoryData);
    }
    return {
      categories: categories,
      humidity: humidity,
      tempe: tempe,
      categoryData: categoryData
    }
  },

  /**
   * 
   * @param {Object[]} datapoints 从OneNet云平台上获取到的数据点
   * 传入数据点, 函数将进行图表的初始化渲染
   */
  firstDraw: function (datapoints) {
    //得到屏幕宽度
    var windowWidth = 320;
    try {
      var res = wx.getWindowInfo();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }

    var wheatherData = this.convert(datapoints);

    //新建湿度图表
    this.lineChart_emo = new myCharts({
      canvasId: 'humidity',
      type: 'line',
      categories: wheatherData.categories,
      animation: false,
      background: '#f5f5f5',
      series: [{
        name: '健康指数',
        data: wheatherData.humidity,
        format: function (val, name) {
          console.log("健康指数:",name);
          return val.toFixed(2);
        },
        color: '#3580E8'
      }],
      xAxis: {
        disableGrid: true
      },
      yAxis: {
        title:'作物健康指数 (%)',
        format: function (val) {
          return val.toFixed(0);
        },
        min: 0, // 设置Y轴最小值
        max: 100, // 设置Y轴最大值
      },
      width: windowWidth,
      height: 200,
      dataLabel: false,
      dataPointShape: true,
      extra: {
        lineStyle: 'curve'
      }
    });
    console.log("above70:",wheatherData.categoryData[0].above70)
    //新建温度图表
    this.lineChart_tempe = new myCharts({
      canvasId: 'tempe',
      type: 'pie',
      animation: false,
      background: '#ffffff',
      series: [{
        name: '优',
        data: wheatherData.categoryData[0].above70/wheatherData.categoryData[0].total*100,
        color:'#48C024',
      },{
        name: '良',
        data: wheatherData.categoryData[0].between50And70/wheatherData.categoryData[0].total*100,
        color:'#C0E545'
      },{
        name: '差',
        data: wheatherData.categoryData[0].below50/wheatherData.categoryData[0].total*100,
        color:'#F1A650'
      }],
      width: windowWidth,
      height: 300,
      dataLabel: true,
      dataPointShape: true,
      enableScroll: true,
      extra: {
        lineStyle: 'curve'
      }
    });
  },
})
