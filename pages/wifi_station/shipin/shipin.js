//shipin.js
//获取应用实例

const my = require('../../../utils/util.js');
const app = getApp()

Page({
  data:{
    device_id: 'http1',
    datastreamsImage: 'image',
    datastreamsData: 'direction',
    index:"607169499_1593272113910_image",
    imgSrc: 'https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg',
    timer: "",      //定时器
    name:'',
    Class_name:'识别中……',
    Confidence:'识别中……',
    list_1: ["tWyRidBI638ge10KoMzH","j05RHYMFnNd5dBrnLRXP","niFf2zTr9oKJRAA9YBur","GDyK19jM4c3pgarSAJxS","NiFt8PADXu4VjEEU4UCF"],
    newIndex: 0,
    date:''
  },
  
  onLoad: function () {
    var _this = this;
     console.log(this.data.device_id);// 打印设备ID
    console.log(app.data.master_api_key);// 打印API_KEY
    var indexes = _this.data.newIndex;
    _this.timer = setInterval(function () {
      indexes = _this.data.newIndex;
      wx.request({
        url: `https://iot-api.heclouds.com/device/file-list`, 
        method: 'GET',
        header: {
          'Content-Type': 'application/json',
          'authorization': app.data.master_api_key
        },
        
        success: function(res){
          console.log("fid:",res)
          _this.setData(
            {
              index: res.data.data.list[indexes].fid,
              name: res.data.data.list[indexes].name,
              date: res.header.Date
            }
          )
        },
        fail: function(res){
          console.log(res)
        }
      });
      _this.downloadFile();
      console.log("indexes:",indexes);
    }, 6000);
  },

  sendCmdlt: function(){
    if(!this.data.newIndex){
      wx.showToast({
        title: '没有更新的照片了',
        icon: 'none'
      });
    }else{
      wx.showToast({
        title: '请稍等',
        icon: 'none'
      });
      this.setData({
        newIndex: this.data.newIndex - 1,
      })
    }
  },

  sendCmdrt: function(){
    if(this.data.newIndex == 7){
      wx.showToast({
        title: '预览完成',
        icon: 'none'
      });
    }else{
      wx.showToast({
        title: '请稍等',
        icon: 'none'
      });
      this.setData({
        newIndex: this.data.newIndex + 1,
      })
    }
  },

  sendCmd: function(event){
    var _this = this;
    let query = event.currentTarget.dataset['index'];
    wx.request({
      url: 'https://api.heclouds.com/devices/' + this.data.device_id + '/datapoints',
      header: {
        'api-key': app.data.master_api_key
      },
      method: 'POST',
      data: {
        "datastreams": [{
                "id": "direction",
                "datapoints": [{
                        "value": query
                }]
            }
        ]
    },
      success: function(res){
        console.log(res)
      },
      fail: function(res){
        //console.log(res)
      }
    })
  },
  downloadFile: function(){
    var _this = this;
    if (_this.data.newIndex >= 5) {
      console.log("_this.data.newIndex == 5")
      _this.setData({
        newIndex: 0
      })
    }
    console.log("开始下载")
    wx.request({
      url: `https://iot-api.heclouds.com/device/file-download?fid=`+_this.data.index,
      header: {
        'Content-Type': 'application/json',
        'authorization': app.data.master_api_key
      },
      method: 'GET',
      responseType: 'arraybuffer',
      success: function(res){
        console.log("index:",_this.data.index,"图像数据:",res.data)
        _this.setData({
          expressData: res.data,
        })
        var base64 = my.arrayBufferToBase64(res.data);
         console.log('ok,base64:',base64);
        _this.setData({
          imgSrc: 'data:image/jpg;base64,' + base64,
          //newIndex: _this.data.newIndex + 1
        })
        _this.onSubmit();
      },
      fail: function(res){
        console.log(res)
      }
    })
    console.log("newIndex",_this.data.newIndex)
  },

  onSubmit: function() {
    const query = '/root/6e723/datasets/images/train/'+this.data.name;
    if (!query) {
      wx.showToast({
        title: '请输入查询内容',
        icon: 'none'
      });
      return;
    }
    wx.request({
      url: 'http://113.44.232.32:5000/predict', // 替换为你的云服务器 IP 和端口
      method: 'POST',
      data: {
        image_path: query
      },
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        console.log('Response:', res.data.model1_predictions[0].class_name);
        if (res.data.model1_predictions) {
          this.setData({
            Class_name: res.data.model1_predictions[0].class_name,
            Confidence: res.data.model1_predictions[0].confidence.toFixed(3)
          });
          wx.showToast({
            title: '查询成功',
            icon: 'none'
          });
        } else {
          console.error('Error:', res.data.error);
          wx.showToast({
            title: 'Error: ' + res.data.error,
            icon: 'none'
          });
        }
        console.log('class_name:', this.data.Confidence);
      },
      fail: (error) => {
        console.error('Request failed:', error);
      }
    });
  },

  onUnload: function () {
    clearInterval(this.timer)
    console.log("==onUnload==");
  },

  onHide: function(){
    clearInterval(this.timer)
    console.log("==onHide==");
  },

  onShow: function(){
    var _this = this;
    var index = 1;
    // wx.request({
    //   url: 'https://api.heclouds.com/devices/' + this.data.device_id + '/datapoints',
    //   header: {
    //     'api-key': app.data.master_api_key
    //   },
    //   method: 'POST',
    //   data: {
    //     "datastreams": [{
    //             "id": "direction",
    //             "datapoints": [{
    //                     "value": 0
    //             }]
    //         }
    //     ]
    // },
    //   success: function(res){
    //     console.log(res)
    //   },
    //   fail: function(res){
    //     console.log(res)
    //   }
    // })

    // _this.timer = setInterval(function () {
    //   _this.receiveCmd()
    // }, 200);
  },
})
