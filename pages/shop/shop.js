// pages/shop.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 花卉分类ID数组
    flowerCategories: [1, 35,36], // 可以手动编辑，添加更多花卉分类ID
    // 花卉数据源链接数组
    flowerDataSources: [
      'cloud://gen-6g41ip5beb54cfa4.6765-gen-6g41ip5beb54cfa4-1344129462/shop-0328/products观果.json',
      'cloud://gen-6g41ip5beb54cfa4.6765-gen-6g41ip5beb54cfa4-1344129462/shop-0328/products观茎.json',
      // 可以在这里添加更多花卉数据源
    ],

    // 搜索相关数据
    searchValue: '', // 搜索框的值
    isSearching: false, // 是否正在搜索
    showCartPopup: false, // 是否显示购物车弹窗
    
    // 分页相关数据
    pageSize: 10, // 每页显示的商品数量
    currentPage: 1, // 当前页码
    totalGoods: [], // 所有商品数据
    isLoading: false, // 是否正在加载
    hasMore: true, // 是否还有更多数据

    // 分类相关数据
    categories: [

      { id: 2, name: '种子种苗' },

    ],
    currentCategory: 1, // 当前选中的分类ID

    // 商品列表数据
    goodsList: [

      {
        id: 2,
        categoryId: 2,
        name: '有机蔬菜种子',
        price: 15.8,
        image: '/images/products/seeds.png',
        description: '优质蔬菜种子，发芽率高'
      }
      // 更多商品数据...
    ],

    // 购物车数据
    cartItems: [],
    cartTotal: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 初始化页面数据
    this.loadGoodsList()
  },



  /**
   * 切换页面
   */
  prevPage: function() {
    if (this.data.currentPage > 1 && !this.data.isLoading) {
      this.setData({
        currentPage: this.data.currentPage - 1,
        goodsList: []
      }, () => {
        this.loadGoodsList()
      })
    }
  },

  nextPage: function() {
    if (!this.data.isLoading && this.data.hasMore) {
      this.setData({
        currentPage: this.data.currentPage + 1,
        goodsList: []
      }, () => {
        this.loadGoodsList()
      })
    }
  },

  /**
   * 加载商品列表
   */
  loadGoodsList: async function() {
    if (this.data.isLoading || !this.data.hasMore) return

    this.setData({ isLoading: true })
    wx.showLoading({ title: '加载中...' })
    console.log('加载商品列表，当前页码：', this.data.currentPage)

    try {
      if (this.data.currentPage === 1) {
        // 首次加载，获取所有数据
        const shopResult = await wx.cloud.downloadFile({
          fileID: 'cloud://gen-6g41ip5beb54cfa4.6765-gen-6g41ip5beb54cfa4-1344129462/shop-0328/shop_data.json'
        })
        const fs = wx.getFileSystemManager()
        const shopFileData = fs.readFileSync(shopResult.tempFilePath, 'utf8')
        const shopData = JSON.parse(shopFileData)

        // 加载所有花卉数据源
        let allFlowerGoods = []
        for (const fileID of this.data.flowerDataSources) {
          const flowerResult = await wx.cloud.downloadFile({ fileID })
          const flowerFileData = fs.readFileSync(flowerResult.tempFilePath, 'utf8')
          const flowerData = JSON.parse(flowerFileData)
          
          const flowerGoods = flowerData.map(flower => ({
            id: parseInt(flower.id),
            categoryId: flower.categoryId,
            name: flower.name,
            description: flower.description,
            price: flower.price,
            image: flower.imageUrl,
            stock: flower.stock,
            sales: flower.sales
          }))
          
          allFlowerGoods = [...allFlowerGoods, ...flowerGoods]
        }

        const allGoods = [...shopData.goods, ...allFlowerGoods]
        
        // 更新总数据和分类数据
        this.setData({
          categories: shopData.categories,
          totalGoods: allGoods
        })
      }

      // 根据当前分类过滤商品
      const categoryGoods = this.data.totalGoods.filter(item => {
        if (this.data.flowerCategories.includes(this.data.currentCategory)) {
          // 如果当前选中的是花卉分类，显示所有花卉商品
          return this.data.flowerCategories.includes(item.categoryId)
        }
        // 否则按照具体分类显示商品
        return item.categoryId === this.data.currentCategory
      })
      
      // 计算当前页的数据
      const start = (this.data.currentPage - 1) * this.data.pageSize
      const end = start + this.data.pageSize
      const pageGoods = categoryGoods.slice(start, end)
      
      // 计算是否还有更多数据
      const hasMoreData = end < categoryGoods.length
      const remainingItems = categoryGoods.length - end
      console.log('分类商品总数:', categoryGoods.length, '当前页起始索引:', start, '结束索引:', end, '剩余商品:', remainingItems, '是否有更多:', hasMoreData)

      // 更新商品列表和分页状态
      let newGoodsList;
      if (this.data.currentPage === 1) {
        newGoodsList = pageGoods;
      } else {
        // 将新的商品追加到现有列表中
        newGoodsList = this.data.goodsList.concat(pageGoods);
      }
      
      // 确保列表中没有重复的商品
      const uniqueIds = new Set();
      newGoodsList = newGoodsList.filter(item => {
        if (!uniqueIds.has(item.id)) {
          uniqueIds.add(item.id);
          return true;
        }
        return false;
      });
      
      this.setData({
        goodsList: newGoodsList,
        hasMore: remainingItems > 0
      }, () => {
        console.log('当前商品列表长度:', newGoodsList.length,'、、、hasMore状态：',remainingItems > 0);
      })
    } catch (error) {
      console.error('加载商品数据失败:', error)
      wx.showToast({
        title: '加载失败',
        icon: 'error'
      })
    } finally {
      const categoryGoods = this.data.totalGoods.filter(item => {
        if (this.data.flowerCategories.includes(this.data.currentCategory)) {
          return this.data.flowerCategories.includes(item.categoryId)
        }
        return item.categoryId === this.data.currentCategory
      })
      const start = (this.data.currentPage - 1) * this.data.pageSize
      const end = start + this.data.pageSize
      
      this.setData({
        isLoading: false,
        hasMore: end < categoryGoods.length
      })
      console.log('当前商品列表长度:', this.data.goodsList.length)
      console.log('是否有更多数据:', this.data.hasMore)
      console.log('end状态:', end)
      console.log('categoryGoods.length数量:', categoryGoods.length)
      wx.hideLoading()
    }
  },

  /**
   * 搜索商品
   */
  onSearch: function(e) {
    const value = e.detail.value
    this.setData({
      searchValue: value,
      isSearching: value.length > 0
    })
    // TODO: 实现搜索逻辑
  },

  /**
   * 切换商品分类
   */
  switchCategory: function(e) {
    const categoryId = e.currentTarget.dataset.id
    this.setData({
      currentCategory: categoryId,
      currentPage: 1,
      goodsList: [],
      hasMore: true
    }, () => {
      this.loadGoodsList()
    })
},

  /**
   * 添加商品到购物车
   */
  addToCart: function(e) {
    const goodsId = e.currentTarget.dataset.id
    const goods = this.data.goodsList.find(item => item.id === goodsId)
    
    if (goods) {
      let cartItems = [...this.data.cartItems]
      const cartItemIndex = cartItems.findIndex(item => item.id === goodsId)
      
      if (cartItemIndex > -1) {
        // 已存在则数量+1
        cartItems[cartItemIndex].quantity += 1
      } else {
        // 不存在则添加新商品
        cartItems.push({
          ...goods,
          quantity: 1
        })
      }

      // 计算购物车总价
      const total = cartItems.reduce((sum, item) => {
        return sum + (item.price * item.quantity)
      }, 0)

      this.setData({
        cartItems,
        cartTotal: total.toFixed(2)
      })

      wx.showToast({
        title: '已添加到购物车',
        icon: 'success'
      })
    }
  },

  /**
   * 增加购物车商品数量
   */
  increaseQuantity: function(e) {
    const goodsId = e.currentTarget.dataset.id
    let cartItems = [...this.data.cartItems]
    const cartItem = cartItems.find(item => item.id === goodsId)
    
    if (cartItem) {
      cartItem.quantity += 1
      const total = cartItems.reduce((sum, item) => {
        return sum + (item.price * item.quantity)
      }, 0)

      this.setData({
        cartItems,
        cartTotal: total.toFixed(2)
      })
    }
  },

  /**
   * 减少购物车商品数量
   */
  decreaseQuantity: function(e) {
    const goodsId = e.currentTarget.dataset.id
    let cartItems = [...this.data.cartItems]
    const cartItemIndex = cartItems.findIndex(item => item.id === goodsId)
    
    if (cartItemIndex > -1) {
      if (cartItems[cartItemIndex].quantity > 1) {
        cartItems[cartItemIndex].quantity -= 1
      } else {
        cartItems.splice(cartItemIndex, 1)
      }

      const total = cartItems.reduce((sum, item) => {
        return sum + (item.price * item.quantity)
      }, 0)

      this.setData({
        cartItems,
        cartTotal: total.toFixed(2)
      })
    }
  },

  /**
   * 查看购物车
   */
  viewCart: function() {
    this.setData({
      showCartPopup: true
    })
  },

  /**
   * 关闭购物车弹窗
   */
  closeCartPopup: function() {
    this.setData({
      showCartPopup: false
    })
  },

  /**
   * 结算购物车
   */
  checkout: function() {
    if (this.data.cartItems.length === 0) {
      wx.showToast({
        title: '购物车为空',
        icon: 'none'
      })
      return
    }
    
    // TODO: 实现结算功能
    wx.showToast({
      title: '结算功能开发中',
      icon: 'none'
    })
  },
  /**
   * 滚动到底部时触发加载更多
   */
  onScrollToLower: function() {
    if (!this.data.isLoading && this.data.hasMore) {
      this.setData({
        currentPage: this.data.currentPage + 1
      }, () => {
        this.loadGoodsList()
      })
    }
  },

})
