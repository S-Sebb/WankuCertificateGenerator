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
  },

  onShareAppMessage: function (options) {
    return {
      title: '玩库版权平台',  // 转发时的标题
      imageUrl: 'cloud://wanku-1grdi7z2e884c9f1.7761-wanku-1grdi7z2e884c9f1-1330554170/images/share_thumbnail.jpg',
      path: '/pages/jumu/jumu',
      success: function (res) {
        console.log('转发成功', res);
      },
      fail: function (res) {
        console.log('转发失败', res);
      }
    };
  },

  onShareTimeline: function () {
    return {
      title: '玩库版权平台',  // 转发时的标题
      imageUrl: 'cloud://wanku-1grdi7z2e884c9f1.7761-wanku-1grdi7z2e884c9f1-1330554170/images/share_thumbnail.jpg',
      success: function (res) {
        console.log('分享成功', res);
      },
      fail: function (res) {
        console.log('分享失败', res);
      }
    };
  }
});
