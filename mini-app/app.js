//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  getOpenID:function(cb){
    var that = this;
    if (this.globalData.openID) {
      typeof cb == "function" && cb(this.globalData.openID)
    } else {
      // 登录
      wx.login({
        success: res => {
          if (res.code) {
            //发起网络请求
            wx.request({
              url: 'https://api.weixin.qq.com/sns/jscode2session?appid=wxa8a8eee3f1e9dda2&secret=1533bcfde1d861a267a8d52a73047179&js_code=' + res.code + '&grant_type=authorization_code',
              success: function (res) {
                that.globalData.openID = res.data.openid;
                typeof cb == "function" && cb(that.globalData.openID)
                wx.request({
                  url: 'http://www.zhangyuhan.xin/mini-app/data/addUser.php?openID=' + res.data.openid,
                  success: function (res) {
                    if (res.data.code == 200) console.log("openID储存成功");
                  }
                })
              }
            })
          } else {
            console.log('获取用户登录态失败！' + res.errMsg)
          }
        }
      })
    }
  },
  globalData: {
    userInfo: null,
    openID:null
  }
})