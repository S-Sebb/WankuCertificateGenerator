Page({
  navigateBack: function () {
    wx.navigateBack();
  },

  data: {
    title: '',
    subPages: [],
    pageId: '' // 保存当前页面的 ID
  },

  onLoad: function (options) {
    const pageId = options.id;
    this.setData({
      pageId: pageId, // 存储当前页面的 ID
    });

    // 获取 pagesConfig 数据
    const app = getApp();
    const pagesConfig = app.globalData.pagesConfig;

    if (pagesConfig) {
      this.initializePageData(pagesConfig, pageId);
    } else {
      // 如果 pagesConfig 尚未加载完成，监听全局事件，等数据加载后再初始化页面
      app.loadPagesConfig(); // 确保配置加载
      app.configReadyCallback = (config) => {
        this.initializePageData(config, pageId);
      };
    }
  },

  // 初始化页面数据
  initializePageData: function (pagesConfig, pageId) {
    const pageData = pagesConfig.mainPages.find(page => page.id === pageId);

    if (pageData) {
      this.setData({
        title: pageData.title,
        subPages: pageData.subPages,
      });
    }
  },

  navigateToSubPage: function (event) {
    const subPageId = event.currentTarget.dataset.pageId;
    wx.navigateTo({
      url: `/pages/commonJumuPage/commonJumuPage?id=${subPageId}`,
    });
  },

  onShareAppMessage: function (options) {
    const pageId = this.data.pageId; // 获取当前页面的 ID
    return {
      title: '玩库版权平台', // 转发时的标题
      imageUrl:
        'cloud://wanku-1grdi7z2e884c9f1.7761-wanku-1grdi7z2e884c9f1-1330554170/images/share_thumbnail.jpg',
      path: `/pages/commonMainPage/commonMainPage?id=${pageId}`, // 转发的路径，带上当前页面的 ID
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
    const pageId = this.data.pageId; // 获取当前页面的 ID
    return {
      title: this.data.title || '玩库版权平台', // 分享时的标题
      query: `id=${pageId}`, // 自定义 query 参数，带上当前页面的 ID
      imageUrl:
        'cloud://wanku-1grdi7z2e884c9f1.7761-wanku-1grdi7z2e884c9f1-1330554170/images/share_thumbnail.jpg',
    };
  },
});
