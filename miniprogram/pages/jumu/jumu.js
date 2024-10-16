Page({
  navigateBack: function () {
    wx.navigateBack();
  },

  // 通用跳转函数
  navigateToPage: function (event) {
    const pageId = event.currentTarget.dataset.pageId;
    wx.navigateTo({
      url: `/pages/commonMainPage/commonMainPage?id=${pageId}`
    });
  }
});
