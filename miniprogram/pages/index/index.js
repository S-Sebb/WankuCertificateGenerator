// pages/index/index.js
Page({
  navigateToJumu: function () {
    wx.navigateTo({
      url: '/pages/jumu/jumu'
    });
  },

  navigateToHezuo: function () {
    wx.navigateTo({
      url: '/pages/hezuo/hezuo'
    });
  }
});
