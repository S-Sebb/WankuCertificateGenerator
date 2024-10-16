const pagesConfig = require('../../config/pagesConfig');

Page({
  navigateBack: function () {
    wx.navigateBack();
  },

  data: {
    title: '',
    images: [],
    bgImages: [
        '/images/jumu_background.png'
    ]
  },

  onLoad: function (options) {
    const subPageId = options.id; // 获取子页面的 ID
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
        images: subPageData.images
      });
    }
  }
});
