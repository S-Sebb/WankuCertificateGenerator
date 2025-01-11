Page({
  data: {
    certPageId: '',
    title: '',
    logoUrl: '',
    buttonText: '',
    requestUrl: '',
    inputs: [],
    values: {}
  },

  onLoad(options) {
    // 获取传入的子页面ID，比如：commonInputPage?id=alun
    const certPageId = options.id || '';
    this.setData({ certPageId: certPageId });

    // 获取全局 app 实例
    const app = getApp();
    const pagesConfig = app.globalData.pagesConfig;

    if (pagesConfig) {
      this.initializePageData(pagesConfig, certPageId);
    } else {
      // 如果 pagesConfig 尚未加载完成，先调用一次加载函数
      app.loadPagesConfig(); // 再次确保发起加载
      app.configReadyCallback = (config) => {
        this.initializePageData(config, certPageId);
      };
    }
  },

  // 根据全局配置和 certPageId 初始化当前页面的数据
  initializePageData(pagesConfig, certPageId) {
    let certPageData = null;

    for (let i = 0; i < pagesConfig.certPages.length; i++) {
      const certPage = pagesConfig.certPages[i];
      const foundCertPage = certPage.certPageId === certPageId ? certPage : null;
      if (foundCertPage) {
        certPageData = foundCertPage;
        break;
      }
    }

    if (!certPageData) {
      console.error('未在配置中找到对应 certPageId:', certPageId);
      return;
    }

    // 设置页面所需的数据
    this.setData({
      title: certPageData.title || '',
      logoUrl: certPageData.logoUrl || '',
      buttonText: certPageData.buttonText || '提交',
      requestUrl: certPageData.requestUrl || '',
      inputs: certPageData.inputs || [],
    });
  },

  // 输入框事件
  handleInput(e) {
    const key = e.currentTarget.dataset.key;  // 拿到 inputs[i].key
    const value = e.detail.value;
    this.setData({
      [`values.${key}`]: value
    });
  },

  // 提交按钮事件
  submitText() {
    const { certPageId, inputs, values, requestUrl} = this.data;

    for (let i = 0; i < inputs.length; i++) {
      const { key, minLength, maxLength } = inputs[i];
      const val = values[key] || '';
      const len = val.length;
      if (len < minLength || len > maxLength) {
        const tip = `请输入${minLength}到${maxLength}个字的${key}`;
        wx.showModal({
          title: '提示',
          content: tip,
          showCancel: false
        });
        return;
      }
    }

    const text_list = inputs.map(input => values[input.key]);

    // 发起请求
    wx.request({
      url: requestUrl,
      method: 'POST',
      data: {
        text_list: text_list,
        type: certPageId
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: (res) => {
        if (res.data && res.data.image_url) {
          wx.navigateTo({
            url: `/pages/result/result?imageSrc=${encodeURIComponent(res.data.image_url)}&type=${certPageId}`
          });
        } else {
          console.error('No image URL returned');
        }
      },
      fail: (error) => {
        console.error('Request failed', error);
      }
    });
  }
});
