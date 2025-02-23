Page({
  data: {
    userInput: '',
    messages: [] // 存储消息的数组
  },
  // 处理输入框的输入
  handleInput(e) {
    this.setData({
      userInput: e.detail.value
    });
  },
  // 发送请求到 API
  sendChatMessage() {
    const that = this;
    const userMessage = {
      role: 'user-message', // 用户消息的样式
      content: that.data.userInput
    };

    // 将用户消息添加到消息数组
    that.setData({
      messages: [...that.data.messages, userMessage],
      userInput: '' // 清空输入框
    });

    wx.request({
      url: 'https://agentapi.baidu.com/assistant/conversation?appId=WHNtFgW5SyWUFmXRevTMhm0ugTIkKAbr&secretKey=qADNcRPAyM4OcvbUe5XwcBPaQbClKea8',
      timeout:100000,
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
        console.log(res); // 添加调试信息，查看完整的响应
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
                    messages.push({
                      role: 'ai-message', // AI 消息的样式
                      content: item.data.text // 提取文本内容
                    });
                    combinedMessage += item.data.text + '\n'; // 合并消息
                  } else if (item.data === null) {
                    // 处理 data 为 null 的情况
                    console.error('未输入有效的响应数据，请检查输入');
                  }
                });
              } else {
                console.error('未输入有效的响应数据，请检查输入');
              }
            } else {
              console.error('响应数据格式不正确:', jsonData);
              messages.push({
                role: 'ai-message',
                content: jsonData.message || '发生错误，请稍后再试。'
              });
            }
          }
        });

        // 更新消息数组
        if (messages.length > 0) {
          that.setData({
            messages: [...that.data.messages, ...messages] // 将 AI 消息添加到消息数组
          });
        }

        // 将合并后的消息添加到消息数组
        if (combinedMessage.trim() !== '') {
          that.setData({
            messages: [...that.data.messages, {
              role: 'ai-message',
              content: combinedMessage.trim() // 添加合并后的消息
            }]
          });
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
      }
    });
  }
});