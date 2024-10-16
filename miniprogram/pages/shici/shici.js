Page({
  data: {
    text: ''
  },

  bindTextInput: function(e) {
    this.setData({
      text: e.detail.value
    });
  },

  submitText: function() {
    const textLength = this.data.text.length;

    if (textLength < 1 || textLength > 4) {
      wx.showModal({
        title: '提示',
        content: '请输入1到4个字',
        showCancel: false
      });
      return;
    }

    const that = this;
    wx.request({
      url: 'https://www.wankuwang.com/generate-image',
      method: 'POST',
      data: {
        text_list: [this.data.text],
        type: 'shici'
      },
      header: {
        'Content-Type': 'application/json'
      },
      success(res) {
        if (res.data.image_url) {
          wx.navigateTo({
            url: `/pages/result/result?imageSrc=${encodeURIComponent(res.data.image_url)}&type=shici`
          });
        } else {
          console.error("No image URL returned");
        }
      },
      fail(error) {
        console.error("Request failed", error);
      }
    });
  }
});
