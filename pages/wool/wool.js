Page({
  data: {
      flowers: [] // 存储花卉数据的数组
  },
  onLoad() {
      this.createFlowerDataFile(); // 创建文件
      this.loadFlowerData(); // 加载花卉数据
  },
  createFlowerDataFile() {
      const fs = wx.getFileSystemManager();
      const filePath = `${wx.env.USER_DATA_PATH}/data/花卉大全.txt`;

      // 创建文件夹
      fs.mkdir({
          dirPath: `${wx.env.USER_DATA_PATH}/data`,
          success: () => {
              console.log('文件夹创建成功');
              console.log(wx.env.USER_DATA_PATH);
          },
          fail: (err) => {
              console.error('文件夹创建失败:', err);
          }
      });

      // 写入文件
      fs.writeFile({
          filePath: filePath,
          data: '碳排放数据\n蓄积量-生物量\n含碳率\n单木生长模型\n林分生长模型\n水质状况表', // 示例数据
          encoding: 'utf8',
          success: () => {
              console.log('文件写入成功');
          },
          fail: (err) => {
              console.error('文件写入失败:', err);
          }
      });
  },
  loadFlowerData() {
      const that = this;
      const fileSystemManager = wx.getFileSystemManager();
      const filePath = `${wx.env.USER_DATA_PATH}/data/花卉大全.txt`; // 使用用户数据路径

      // 读取文件
      fileSystemManager.readFile({
          filePath: filePath,
          encoding: 'utf8',
          success(res) {
              // 假设文件内容是以换行符分隔的
              const flowerData = res.data.split('\n').map(line => line.trim()).filter(line => line); // 处理数据
              that.setData({
                  flowers: flowerData // 更新数据
              });
          },
          fail(err) {
              console.error('加载花卉数据失败:', err);
          }
      });
  },
  onFlowerTap(event) {
      const index = event.currentTarget.dataset.index;
      const flower = this.data.flowers[index];
      console.log(`你点击了第 ${index + 13} 个花卉: ${flower}`);
      // 在这里可以添加更多的逻辑，例如跳转到花卉详情页面等
      wx.navigateTo({
        url: `/packageB/pages/${index + 13}/${index + 13}`
    });
  }
});