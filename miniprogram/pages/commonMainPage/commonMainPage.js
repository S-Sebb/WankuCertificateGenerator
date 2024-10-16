const pagesConfig = require('../../config/pagesConfig');

Page({
  navigateBack: function () {
    wx.navigateBack();
  },

  data: {
    title: '',
    subPages: []
  },

  onLoad: function (options) {
    const pageId = options.id;
    const pageData = pagesConfig.mainPages.find(page => page.id === pageId);

    if (pageData) {
      this.setData({
        title: pageData.title,
        subPages: pageData.subPages
      });
    }
  },

  navigateToSubPage: function (event) {
    const subPageId = event.currentTarget.dataset.pageId;
    wx.navigateTo({
      url: `/pages/commonJumuPage/commonJumuPage?id=${subPageId}`
    });
  }
});
