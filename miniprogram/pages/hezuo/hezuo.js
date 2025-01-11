Page({
  navigateBack: function () {
    wx.navigateBack();
  },

  data: {
    title: '合作方式',
    images: [
      'cloud://wanku-1grdi7z2e884c9f1.7761-wanku-1grdi7z2e884c9f1-1330554170/images/合作方式/1.jpg',
      'cloud://wanku-1grdi7z2e884c9f1.7761-wanku-1grdi7z2e884c9f1-1330554170/images/合作方式/2.jpg',
      'cloud://wanku-1grdi7z2e884c9f1.7761-wanku-1grdi7z2e884c9f1-1330554170/images/合作方式/3.jpg'
    ],
    bgImages: [
      'cloud://wanku-1grdi7z2e884c9f1.7761-wanku-1grdi7z2e884c9f1-1330554170/images/index_background.png'
    ],
    showBackToTop: false,  // 控制“回到顶部”按钮的显示
  },

  // 滚动到顶部函数
  scrollToTop: function () {
    wx.pageScrollTo({
      scrollTop: 0,  // 设置滚动到顶部的位置
      duration: 300  // 滚动动画持续时间，300毫秒
    });
  },

  // 页面滚动事件
  onPageScroll: function (event) {
    // 当页面滚动超过100rpx时，显示“回到顶部”按钮
    const scrollTop = event.scrollTop;
    this.setData({
      showBackToTop: scrollTop > 100  // 根据滚动距离显示/隐藏按钮
    });
  },

  // 图片预览功能
  previewImage: function (e) {
    const current = e.currentTarget.dataset.src;  // 当前点击的图片地址
    const urls = this.data.images;  // 图片列表

    wx.previewImage({
      current: current,  // 当前显示图片的链接
      urls: urls  // 需要预览的图片链接列表
    });
  },

  onShareAppMessage: function (options) {
    return {
      title: '玩库版权平台',  // 转发时的标题
      imageUrl: 'cloud://wanku-1grdi7z2e884c9f1.7761-wanku-1grdi7z2e884c9f1-1330554170/images/share_thumbnail.jpg',
      path: '/pages/index/index',
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
