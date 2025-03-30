Page({
  data: {
    username: '',
    password: ''
  },


  register: function () {
    wx.navigateTo({
      url: '/pages/register/register'
    });
  },
  onUsernameInput(e) {
    this.setData({ username: e.detail.value });
  },
  onPasswordInput(e) {
    this.setData({ password: e.detail.value });
  },
  login() {
    const { username, password } = this.data;
    console.log('用户名:', username);
    console.log('密码:', password);
    if (!username || !password) {
      wx.showToast({ title: '用户名和密码不能为空', icon: 'none' });
      return;
    }

    // 添加体验账号逻辑
    if (username === '1' && password === '1') {
      wx.showToast({ title: '登录成功', icon: 'success' });
      // 登录成功后，可以将用户信息存储到本地或跳转到主页
      wx.setStorageSync('userInfo', { name: '体验账号', role: 'guest' }); // 示例用户信息

      // 添加延时，例如延时 1000 毫秒（1 秒）
      setTimeout(() => {
        wx.reLaunch({ url: '/pages/mine/mine' });
      }, 1000);
      return;
    }

    const url = `http://39.105.111.133:8082/user/findUserByNameAndPwd?name=${username}&password=${password}`;
    console.log('路由', url);
    wx.request({
      url: url,
      method: 'POST',
      success(res) {
        console.log(res);
        if (res.statusCode === 200 && res.data.code === 0) {
          wx.showToast({ title: '登录成功', icon: 'success' });
          // 登录成功后，可以将用户信息存储到本地或跳转到主页
          wx.setStorageSync('userInfo', res.data.user);

          // 添加延时，例如延时 1000 毫秒（1 秒）
          setTimeout(() => {
            wx.reLaunch({ url: '/pages/mine/mine' });
          }, 1000);
        } else {
          wx.showToast({ title: '登录失败：' + res.data.message, icon: 'none' });
        }
      },
      fail(err) {
        console.error(err);
        wx.showToast({ title: '网络错误', icon: 'none' });
      }
    });
  }
});