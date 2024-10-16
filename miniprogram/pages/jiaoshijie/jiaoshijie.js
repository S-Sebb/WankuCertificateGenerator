Page({
  data: {
    teacherName: '',
    studentName: ''
  },

  bindTeacherNameInput: function(e) {
    this.setData({
      teacherName: e.detail.value
    });
  },

  bindStudentNameInput: function(e) {
    this.setData({
      studentName: e.detail.value
    });
  },

  submitText: function() {
    const teacherNameLength = this.data.teacherName.length;
    const studentNameLength = this.data.studentName.length;

    if (teacherNameLength < 1 || teacherNameLength > 4 || studentNameLength < 1 || studentNameLength > 4) {
      wx.showModal({
        title: '提示',
        content: '请输入1到4个字的教师姓名和学生姓名',
        showCancel: false
      });
      return;
    }

    const that = this;
    wx.request({
      url: 'https://www.wankuwang.com/generate-image',
      method: 'POST',
      data: {
        text_list: [this.data.studentName, this.data.teacherName],
        type: 'jiaoshijie'
      },
      header: {
        'Content-Type': 'application/json'
      },
      success(res) {
        if (res.data.image_url) {
          wx.navigateTo({
            url: `/pages/result/result?imageSrc=${encodeURIComponent(res.data.image_url)}&type=jiaoshijie`
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
