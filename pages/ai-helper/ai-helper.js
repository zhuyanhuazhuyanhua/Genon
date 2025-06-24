const markdown = require("../../wxcomponents/towxml/parse/markdown/markdown");
const mark = require("../../wxcomponents/towxml/parse/markdown/plugins/mark");
const app = getApp();

Page({
  data: {
    chatHistory: [],
    inputMessage: '',
    extractedTime:'',
    extractedLocation:'',
    extractedCrop:'',
    date:'2020-12-25',
    responseData:'',
    articleInfo:{},
    isLoading: false
  },
 
  extractInfo() {
    const { inputMessage } = this.data;

    // 提取时间
    const timePattern = /\d{4}年/;
    const timeMatch = inputMessage.match(timePattern);
    const time = timeMatch ? timeMatch[0] : "未找到时间";

    // 提取地点
    const locationPattern = /市(\S+区)/;
    const locationMatch = inputMessage.match(locationPattern);
    const location = locationMatch ? locationMatch[1] : "未找到地点";

    // 提取作物种类
    const cropPattern = /种植(\S+)/;
    const cropMatch = inputMessage.match(cropPattern);
    const crop = cropMatch ? cropMatch[1] : "未找到作物种类";

    this.setData({
      extractedTime: time,
      extractedLocation: location,
      extractedCrop: crop
    });
  },

  onInputChange(e) {
    this.setData({
      inputMessage: e.detail.value
    });
    this.extractInfo();
    console.log("tm:",this.data.extractedTime,"lo:",this.data.extractedLocation,"cp:",this.data.extractedCrop)
  },

  // 优化发送消息函数
    // 优化发送消息函数
    onSubmit() {
      this.setData({
        inputMessage: this.data.extractedTime + this.data.extractedLocation + '农业政策'
      });
      const query = this.data.inputMessage;
      console.log("this.data.inputMessage1",this.data.inputMessage)
      if (!query) {
        wx.showToast({
          title: '请输入查询内容',
          icon: 'none'
        });
        return;
      }
      wx.request({
        url: 'http://113.44.163.234:5000/process_query', // 替换为你的云服务器 IP 和端口
        method: 'POST',
        data: {
          query: query
        },
        header: {
          'content-type': 'application/json'
        },
        success: (res) => {
          console.log('Response:', res.data);
          if (res.data.result) {
            this.setData({
              result: res.data.result
            });
            wx.showToast({
              title: '查询成功',
              icon: 'none'
            });
            this.continueAfterSubmit(); // 在成功回调中调用新的函数
          } else {
            console.error('Error:', res.data.error);
            wx.showToast({
              title: 'Error: ' + res.data.error,
              icon: 'none'
            });
          }
        },
        fail: (error) => {
          console.error('Request failed:', error);
          wx.showToast({
            title: 'Request failed',
            icon: 'none'
          });
        }
      });
    },
  
    async continueAfterSubmit() {
      const message = this.data.result + "\n" + this.data.extractedCrop + "价格:" + this.data.responseData + "元/斤";
      console.log("message", message);
      if (!message.trim()) {
        return;
      }
      try {
        console.log("Starting request...");
        const res = await new Promise((resolve, reject) => {
          wx.request({
            url: 'https://free.v36.cm/v1/chat/completions',
            method: 'POST',
            header: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer sk-WfnocR0iNZ1qfKF85fE5E4Bb2fDd49Ca87Ee6fF353D76bA4'
            },
            data: {
              model: 'gpt-3.5-turbo',
              store: true,
              messages: [
                {
                  role: 'system',
                  content: '你是一个专业的农业咨询助手，可以对用户输入的政策信息和农产品价格做总结，保留关键信息如时间、地名、数字等，同时做到输出分点且简洁'
                },
                ...this.data.chatHistory,  // 添加历史对话记录
                {
                  role: 'user',
                  content: message
                }
              ]
            },
            success: (response) => {
              console.log("Request succeeded:", response);
              resolve(response);
            },
            fail: (error) => {
              console.error("Request failed:", error);
              reject(error);
            }
          });
        });
    
        console.log("ai");
        if (res.statusCode === 200 && res.data?.choices?.[0]) {
          const reply = res.data.choices[0].message.content;
          this.addToChat('assistant', reply);
          let rs = app.towxml(res.data.choices[0].message.content,'markdown')
          this.setData({
            articleInfo: rs
          })
          // 提取图片 URL
          const imageUrl = this.extractImageUrl(reply);
          if (imageUrl) {
            this.addToChat('assistant', '', imageUrl); // 添加图片到聊天记录
          }
        } else {
          throw new Error('API响应错误');
        }
      } catch (err) {
        console.error('请求失败:', err);
        wx.showToast({
          title: err.message || '网络请求失败',
          icon: 'none'
        });
      } finally {
        this.setData({
          isLoading: false
        });
      }
      console.log("chatHistory:",this.data.chatHistory)
    },

    fetchData() {
      const { extractedLocation, extractedCrop, date } = this.data;
      console.log('发起请求', extractedLocation, extractedCrop, date);
      const host = 'https://agroprice.market.alicloudapi.com';
      const path = '/aliyun/market/category/detail';
      const appcode = 'f4b1c88a274f407aa6a9839f89d46cf9';
      const querys = `areaName=${encodeURIComponent(extractedLocation)}&categoryName=${encodeURIComponent(extractedCrop)}&date=${encodeURIComponent(date)}`;
      const url = `${host}${path}?${querys}`;
  
      console.log('请求URL:',extractedLocation, extractedCrop, date );
      console.log('请求头:', {
        'Authorization': `APPCODE ${appcode}`
      });
      wx.request({
        url,
        method: 'GET',
        header: {
          'Authorization': `APPCODE ${appcode}`
        },
        success: (res) => {
          console.log('请求成功:', res);
          console.log('响应数据:', res.data);
          if (res.statusCode === 200) {
            if (res.data.code === 0) {
              this.setData({
                responseData: res.data.data[0].nowAvgPrice,
                errorMsg: ''
              });
            } else {
              this.setData({
                responseData: null,
                errorMsg: ''
              });
            }
          } else {
            this.setData({
              responseData: null,
              errorMsg: `请求失败，状态码: ${res.statusCode}，请稍后重试`
            });
          }
          console.log('responseData:',this.data.responseData,"res.data.msg",res.data.msg)
        },
        fail: (err) => {
          this.setData({
            responseData: null,
            errorMsg: '网络错误: ${err.errMsg}, 请检查网络连接'
          });
          console.error('请求失败:', err);
        },
  
      });
    },

  async sendMessage() {
    const message = this.data.inputMessage;
    console.log("this.data.inputMessage",this.data.inputMessage)
    if (!message.trim()) {
      return;
    }
    this.addToChat('user', message);
    this.setData({
      isLoading: true
    });
    console.log("isLoading",this.data.isLoading)
    this.fetchData();
    this.onSubmit();
    this.setData({
      inputMessage: '',
      isLoading: false
    });
    
  },

  // 提取图片 URL 的方法
  extractImageUrl(reply) {
    const regex = /配图：\((.*?)\)/; // 正则表达式匹配配图格式
    const match = reply.match(regex);
    return match ? match[1] : null; // 返回图片 URL
  },

  // 优化添加消息到聊天记录的方法
  addToChat(role, content, imageUrl = null) {
    this.setData({
      chatHistory: [...this.data.chatHistory, { role, content, imageUrl }]
    });
  }
});