const app = getApp();
Page({
  data: {
    userInput: '',
    inputs: ['刺槐', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    filteredRange: ['玫瑰','月季','康乃馨','桂花','樱花','桃花','杏花','丁香'],
    selectedValue: [],
    showModal: false,
    chatHistory: [],
    messages: [], // 存储消息的数组
    isLoading: false,
    depsVtabs:[],
    queryName: '玫瑰',
    articleInfo:{}
  },
  //初始化数据
  onShow:function(){
    this.data.filteredRange = app.globalData.numberRange
    console.log("app.globalData.numberRange",this.data.filteredRange)
  },
  
  // 下载林木数据
  onLoad: function() {
    this.downloadFile();
  },
 
  downloadFile: function() {
    wx.cloud.downloadFile({
      fileID: 'cloud://gen-6g41ip5beb54cfa4.6765-gen-6g41ip5beb54cfa4-1344129462/coordinates案例.json',
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
  },


  // 处理输入框的输入
  showPicker: function() {
    this.setData({
      showModal: true
    });
  },
  onSearchInput: function(e) {
    const query = e.detail.value;
    const results = this.data.depsVtabs.filter(item => {
      // 检查 item 是否为对象，并且 item["主要树种 "] 是否存在
      return item && item["name"] && item["name"].includes(query);
    });
    const dataResults = results.map(item => item.name); 
    console.log("搜索数据",dataResults)
    this.setData({
      filteredRange: dataResults
    });
  },
  onSelectResult: function(e) {
    const value = e.currentTarget.dataset.value;
    const inputs = this.data.inputs;
    inputs[0] = value;
    this.setData({
      selectedValue: value,
      inputs: inputs,
      showModal: false,
      filteredRange: app.globalData.numberRange
    });
  },
  closePicker: function() {
    this.setData({
      showModal: false,
      filteredRange: app.globalData.numberRange
    });
  },


  handleInput: function(e) {
    const index = e.currentTarget.dataset.index;
    const value = e.detail.value;
    const inputs = this.data.inputs;
    inputs[index] = value;
    this.setData({
      inputs: inputs,
      showModal: false
    });
  },


  // 发送请求到 API
  sendChatMessage() {
    const concatenatedText = this.data.inputs[0]+', SDI='+ this.data.inputs[1]+', B='+ this.data.inputs[2]+', L='+ this.data.inputs[3]+', ELV='+ this.data.inputs[4]+', PMA='+ this.data.inputs[5]+', MAT='+ this.data.inputs[6]+'a='+ this.data.inputs[7]+', β='+ this.data.inputs[8]+', y0='+ this.data.inputs[9]+', SD='+ this.data.inputs[10]+', P='+ this.data.inputs[11]+', D='+ this.data.inputs[11]+', t='+ this.data.inputs[11];
    this.setData({
      userInput: concatenatedText
    });
    console.log("连接后的字符串：",concatenatedText)
    const that = this;
    const userMessage = {
      role: 'user-message', // 用户消息的样式
      content: that.data.userInput
    };

    // 将用户消息添加到消息数组
    that.setData({
      messages: [...that.data.messages, userMessage],
      userInput: '', // 清空输入框
      isLoading: true
    });
    console.log("that.data.messages:",that.data.messages)
    wx.request({
      url: 'https://agentapi.baidu.com/assistant/conversation?appId=wV197g94HAMTkwfOsL0YBwxZZsyxdRQh&secretKey=ZsqVRGpWGnRh3uObuwpF7E5JRRwNimA4',
      timeout: 100000,
      method: 'POST',
      header: {
        'Content-Type': 'application/json'
      },
      data: {
        message: {
          content: {
            type: 'text',
            value: {
              showText: userMessage.content
            }
          }
        },
        source: 'xxx',
        from: 'openapi',
        openId: 'xxx'
      },
      success(res) {
        console.log(res.data); // 添加调试信息，查看完整的响应
        const responseLines = res.data.split('\n'); // 按行分割响应
        let messages = [];
        let combinedMessage = ''; // 用于存储合并后的消息

        // 解析响应数据
        responseLines.forEach(line => {
          if (line.startsWith('data:')) {
            const jsonData = JSON.parse(line.substring(5)); // 提取并解析 JSON 数据
            if (jsonData.status === 0) {
              if (jsonData.data && jsonData.data.message) {
                const content = jsonData.data.message.content;
                content.forEach(item => {
                  if (item.data && item.data.text) {
                    combinedMessage += item.data.text; // 合并消息
                    console.log("combinedMessage:",combinedMessage);
                    that.setData({
                        isLoading: false
                      });
                  } else if (item.data === null) {
                    // 处理 data 为 null 的情况
                    console.error('未输入有效的响应数据，请检查输入');
                    that.setData({
                        isLoading: false
                      });
                  }
                });
              } else {
                console.error('未输入有效的响应数据，请检查输入');
                that.setData({
                    isLoading: false
                  });
              }
            } else {
              console.error('响应数据格式不正确:', jsonData);
              messages.push({
                role: 'ai-message',
                content: jsonData.message || '发生错误，请稍后再试。'
              });
              that.setData({
                isLoading: false
              });
            }
          }
        });

        // 将合并后的消息添加到消息数组
        if (combinedMessage) {
          console.log("combinedMessage111:",combinedMessage)
          that.setData({
            messages: [...that.data.messages, {
              role: 'ai-message',
              content: combinedMessage // 添加合并后的消息
            }]
          });
          let rs = app.towxml(combinedMessage,'markdown')
          that.setData({
            articleInfo: rs
          })
          console.log("that.data.messages:",that.data.messages)
        }
      },
      fail(err) {
        console.error(err);
        that.setData({
          messages: [...that.data.messages, {
            role: 'ai-message',
            content: '请求失败，请检查网络连接。'
          }]
        });
      },

    });
  }
});