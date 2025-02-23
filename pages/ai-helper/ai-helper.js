Page({
  data: {
    chatHistory: [],
    inputMessage: '',
    isLoading: false
  },
 
  onInputChange(e) {
    this.setData({
      inputMessage: e.detail.value
    });
  },

  // 优化发送消息函数
  async sendMessage() {
    const message = this.data.inputMessage;
    if (!message.trim()) {
      return;
    }

    this.addToChat('user', message);
    
    this.setData({
      inputMessage: '',
      isLoading: true
    });

    try {
      const res = await new Promise((resolve, reject) => {
        wx.request({
        //   url: 'https://api3.apifans.com/v1/chat/completions',
        //   method: 'POST',
        //   header: {
        //     'Content-Type': 'application/json',
        //     'Authorization': 'Bearer sk-f9k3ErfzcFYXD19D7756Af762bBd4b5b8fA11f7aF7D5984a'
        //   },
            url: 'https://free.v36.cm/v1/chat/completions',
            method: 'POST',
            header: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer sk-WfnocR0iNZ1qfKF85fE5E4Bb2fDd49Ca87Ee6fF353D76bA4'
            },
          data: {
            model: 'gpt-3.5-turbo',
            store:true,
            messages: [
              {
                role: 'system',
                content: '你是一个专业的花卉园艺助手，根据专业的论文知识和花卉网的知识，可以回答关于花卉养护、种植、病虫害等问题。请确保你的回答包含以下信息：\n' +
                  '1. 作物类别\n' +
                  '2. 作物功能\n' +
                  '3. 作物科属\n' +
                  '4. 习性\n' +
                  '5. 应用环境\n' +
                  '6. 培育难度\n' +
                  '7.配图\n\n'+
                  '请用专业且易懂的语言回答，并确保引用相关的参考文献。\n' +
                  '示例格式：\n' +
                  '作物类别：xxx\n' +
                  '作物功能：xxx\n' +
                  '作物科属：xxx\n' +
                  '习性：xxx\n' +
                  '应用环境：xxx\n' +
                  '培育难度：xxx\n' +
                  '配图：xxx\n'+
                  '参考文献：\n' +
                  '[1] 作者. (年份). 标题. 期刊.\n' +
                  '[2] 作者. (年份). 标题. 期刊.\n'
              },
              ...this.data.chatHistory,  // 添加历史对话记录
              {
                role: 'user',
                content: message
              }
            ]
          },
          success: resolve,
          fail: reject
        });
      });

      if (res.statusCode === 200 && res.data?.choices?.[0]) {
        const reply = res.data.choices[0].message.content;
        this.addToChat('assistant', reply);

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