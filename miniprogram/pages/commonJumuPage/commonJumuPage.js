const pagesConfig = require('../../config/pagesConfig');

Page({
  navigateBack: function () {
    wx.navigateBack();
  },

  data: {
    title: '',
    images: [],
    bgImages: [
        '/images/index_background.png'
    ],
    showBackToTop: false,  // 控制“回到顶部”按钮的显示
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

    // 调整标题的字体大小
    this.adjustTitleFontSize();
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

  // 调整标题字体大小
  adjustTitleFontSize: function () {
    const query = wx.createSelectorQuery();
    query.select('#pageTitle').boundingClientRect((rect) => {
      const titleWidth = rect.width; // 获取标题的宽度
      const screenWidth = wx.getSystemInfoSync().screenWidth; // 获取屏幕宽度

      // 如果标题的宽度超过屏幕的80%，则缩小字体
      if (titleWidth > screenWidth * 0.79) {
        this.setData({
          titleFontSize: '32rpx' // 动态调整字体大小
        });
      } else {
        this.setData({
          titleFontSize: '40rpx' // 保持原有字体大小
        });
      }
    }).exec();
  }
});
