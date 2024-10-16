Page({
  data: {
    imageSrc: '',
    type: ''  // 保存传递过来的 type 参数
  },

  onLoad: function(options) {
    this.setData({
      imageSrc: decodeURIComponent(options.imageSrc),
      type: options.type || ''  // 从 options 获取 type 参数
    });
  },

  previewImage: function() {
    wx.previewImage({
      current: this.data.imageSrc,  // 当前显示图片的http链接
      urls: [this.data.imageSrc]    // 需要预览的图片http链接列表
    });
  },

  saveImage: function() {
    const that = this;
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              that.saveToAlbum();
            },
            fail() {
              wx.showModal({
                title: '提示',
                content: '请授权保存到相册',
                showCancel: false
              });
            }
          });
        } else {
          that.saveToAlbum();
        }
      }
    });
  },

  saveToAlbum: function() {
    const that = this;
    wx.downloadFile({
      url: that.data.imageSrc,
      success(res) {
        if (res.statusCode === 200) {
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success() {
              wx.showToast({
                title: '保存成功',
                icon: 'success'
              });
            },
            fail(err) {
              wx.showToast({
                title: '保存失败',
                icon: 'none'
              });
              console.log('保存失败', err);
            }
          });
        } else {
          wx.showToast({
            title: '下载失败',
            icon: 'none'
          });
          console.log('下载失败，状态码：', res.statusCode);
        }
      },
      fail(err) {
        wx.showToast({
          title: '下载失败',
          icon: 'none'
        });
        console.log('下载失败', err);
      }
    });
  },

  regenerate: function() {
    // 动态跳转回不同的生成页面
    let targetPage = '/pages/index/index';
    if (this.data.type) {
      targetPage = `/pages/${this.data.type}/${this.data.type}`;
    }

    wx.navigateTo({
      url: targetPage
    });
  },

  onImageLoadError: function() {
    wx.showModal({
      title: '提示',
      content: '图像已失效，请重新生成',
      showCancel: false,
      success(res) {
        if (res.confirm) {
          wx.navigateBack({
            delta: 1
          });
        }
      }
    });
  }
});
