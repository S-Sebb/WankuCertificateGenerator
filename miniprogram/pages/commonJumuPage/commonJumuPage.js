Page({
  navigateBack: function () {
    wx.navigateBack();
  },

  data: {
    title: '',
    images: [],
    bgImages: [
      'cloud://wanku-1grdi7z2e884c9f1.7761-wanku-1grdi7z2e884c9f1-1330554170/images/index_background.png'
    ],
    showBackToTop: false, // 控制“回到顶部”按钮的显示
    subPageId: '', // 当前页面的子页面 ID
  },

  onLoad: function (options) {
    const subPageId = options.id; // 获取子页面的 ID
    this.setData({
      subPageId: subPageId, // 存储当前页面的子页面 ID
    });

    // 获取 pagesConfig 数据
    const app = getApp();
    const pagesConfig = app.globalData.pagesConfig;

    if (pagesConfig) {
      this.initializePageData(pagesConfig, subPageId);
    } else {
      // 如果 pagesConfig 尚未加载完成，监听全局事件，等数据加载后再初始化页面
      app.loadPagesConfig(); // 确保配置加载
      app.configReadyCallback = (config) => {
        this.initializePageData(config, subPageId);
      };
    }
  },

  // 初始化页面数据
  initializePageData: function (pagesConfig, subPageId) {
    let subPageData = null;

    // 使用普通的 for 循环替代 for...of
    for (let i = 0; i < pagesConfig.mainPages.length; i++) {
      const mainPage = pagesConfig.mainPages[i];
      subPageData = mainPage.subPages.find(subPage => subPage.id === subPageId);
      if (subPageData) {
        break; // 找到后立即退出循环
      }
    }

    // 设置页面标题和图片数据
    if (subPageData) {
      this.setData({
        title: subPageData.title,
        images: subPageData.images,
      });
    }

    // 调整标题的字体大小
    this.adjustTitleFontSize();
  },

  // 滚动到顶部函数
  scrollToTop: function () {
    wx.pageScrollTo({
      scrollTop: 0, // 设置滚动到顶部的位置
      duration: 300, // 滚动动画持续时间，300毫秒
    });
  },

  // 页面滚动事件
  onPageScroll: function (event) {
    // 当页面滚动超过100rpx时，显示“回到顶部”按钮
    const scrollTop = event.scrollTop;
    this.setData({
      showBackToTop: scrollTop > 100, // 根据滚动距离显示/隐藏按钮
    });
  },

  // 调整标题字体大小
  adjustTitleFontSize: function () {
    const query = wx.createSelectorQuery();
    query.select('#pageTitle').boundingClientRect((rect) => {
      const titleWidth = rect.width; // 获取标题的宽度
      const screenWidth = wx.getSystemInfoSync().screenWidth; // 获取屏幕宽度

      // 如果标题的宽度超过屏幕的80%，则缩小字体
      if (titleWidth > screenWidth * 0.79) {
        this.setData({
          titleFontSize: '32rpx', // 动态调整字体大小
        });
      } else {
        this.setData({
          titleFontSize: '40rpx', // 保持原有字体大小
        });
      }
    }).exec();
  },

  previewImage: function (e) {
    const current = e.currentTarget.dataset.src; // 当前点击的图片地址
    const urls = this.data.images; // 图片列表

    wx.previewImage({
      current: current, // 当前显示图片的链接
      urls: urls, // 需要预览的图片链接列表
    });
  },

  // 自定义分享给好友
  onShareAppMessage: function () {
    const subPageId = this.data.subPageId;
    const imageUrl =
      this.data.images[1] ||
      'cloud://wanku-1grdi7z2e884c9f1.7761-wanku-1grdi7z2e884c9f1-1330554170/images/share_thumbnail.jpg';
    return {
      title: this.data.title || '玩库版权平台', // 转发时的标题
      path: `/pages/commonJumuPage/commonJumuPage?id=${subPageId}`, // 转发的路径，带上当前页面的 ID
      imageUrl: imageUrl,
      success: function (res) {
        console.log('转发成功', res);
      },
      fail: function (res) {
        console.log('转发失败', res);
      },
    };
  },

  // 自定义分享到朋友圈
  onShareTimeline: function () {
    const subPageId = this.data.subPageId;
    const imageUrl =
      this.data.images[1] ||
      'cloud://wanku-1grdi7z2e884c9f1.7761-wanku-1grdi7z2e884c9f1-1330554170/images/share_thumbnail.jpg';
    return {
      title: this.data.title || '玩库版权平台', // 分享时的标题
      query: `id=${subPageId}`, // 自定义 query 参数，带上当前页面的 ID
      imageUrl: imageUrl,
    };
  },
});
