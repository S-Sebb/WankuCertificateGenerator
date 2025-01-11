// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || [];
    logs.unshift(Date.now());
    wx.setStorageSync('logs', logs);

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    });

    // 加载云端配置文件
    this.loadPagesConfig();
  },

  globalData: {
    userInfo: null,
    pagesConfig: null, // 用于存储从云端加载的配置
  },

  loadPagesConfig() {
    let serverUrl = "https://7761-wanku-1grdi7z2e884c9f1-1330554170.tcb.qcloud.la/config/pagesConfig.json?sign=9db3e01cd76882d2646bc1f155a4528a&t=1732694713";
    const now = Date.now(); // 当前毫秒时间戳
    serverUrl += `&noCache=${now}`;

    wx.request({
      url: serverUrl,
      method: "GET",
      header: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
      success: (res) => {
        if (res.statusCode === 200) {
          console.log("PagesConfig loaded successfully:", res.data);
          this.globalData.pagesConfig = res.data;

          if (this.configReadyCallback) {
            this.configReadyCallback(res.data);
          }
        } else {
          console.error("Failed to load pagesConfig:", res);
        }
      },
      fail: (err) => {
        console.error("Error while loading pagesConfig:", err);
      },
    });
  },
});
