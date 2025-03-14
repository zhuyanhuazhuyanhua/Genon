Page({
  data: {
    username: '',
    password: '',
    Identity: '',
  },
  onUsernameInput(e) {
    this.setData({ username: e.detail.value });
  },
  onPasswordInput(e) {
    this.setData({ password: e.detail.value });
  },
  onrePasswordInput(e) {
    this.setData({ Identity: e.detail.value });
  },
  
  register() {
    const { username, password,Identity} = this.data;
    if (!username || !password || !Identity) {
      wx.showToast({ title: '请填写完整信息', icon: 'none' });
      return;
    }
    console.log('用户名',username)
    console.log('密码',password)
    console.log('确认密码',Identity)
    wx.request({
      url: 'http://39.105.111.133:8082/user/createUser', // 确保 URL 是正确的
    method: 'POST',
    header: {
        'accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded' // 根据后端要求设置
    },
    data: {
        name: username, // 假设 username 是你的变量
        password: password, // 假设 password 是你的变量
        Identity: Identity, // 根据你的需求添加，如果 Identity 不需要传递可以移除
    },
      success(res) {
        console.log(res)
        if (res.statusCode === 200 & res.data.code === 0) {
          wx.showToast({
            title: '注册成功',
            icon: 'success',
            duration: 1000, // 设置 toast 的显示时长（单位：毫秒）
            success: () => {
              // 在 toast 显示结束后延迟跳转
              setTimeout(() => {
                wx.navigateTo({
                  url: '/pages/go_login/go_login'
                });
              }, 1000); // 这里的延时时间可以根据需要调整
            }
          });
        } else {
          wx.showToast({ title: '注册失败：' + res.data.message, icon: 'none' });
        }
      },
      fail(err) {
        console.error(err);
        wx.showToast({ title: '网络错误', icon: 'none' });
      }
    });
  }
});