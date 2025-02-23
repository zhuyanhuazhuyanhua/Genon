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
            data: '地被草坪花卉\n垂吊类花卉\n果蔬类花卉\n水培类花卉\n盆栽类花卉\n节庆类花卉\n芳香类花卉\n观叶类花卉\n观果类花卉\n观花类花卉\n观茎类花卉\n趣味类花卉', // 示例数据
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
        console.log(`你点击了第 ${index + 1} 个花卉: ${flower}`);
        // 在这里可以添加更多的逻辑，例如跳转到花卉详情页面等
        wx.navigateTo({
          url: `/pages/${index + 1}/${index + 1}`
      });
    }
  });