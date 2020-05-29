<template>
  <div>
    <button open-type="getUserInfo" @getuserinfo="onGotUserInfo">用户授权</button>
  </div>
</template>

<script>
// 引入 request
import request from '../../utils/myrequest.js'
export default {
  data() {
    return {
      params: {
        code: '',
        encryptedData: '',
        iv: '',
        rawData: '',
        signature: ''
      }
    }
  },
  methods: {
    onGotUserInfo(res) {
      // 保存用户登录信息
      let { detail } = res.mp;
      this.params.encryptedData = detail.encryptedData
      this.params.iv = detail.iv
      this.params.rawData = JSON.stringify(detail.rawData)
      console.log(this.params.rawData)
      this.params.signature = detail.signature
      // 发送登录请求: 获取 token
      request.post('https://itjustfun.cn/api/public/v1/users/wxlogin', {
        code: this.params.code,
        encryptedData: detail.encryptedData,
        iv: detail.iv,
        rawData: detail.rawData,
        signature: detail.signature
      })
        .then(res => {
          // 得到 token 、 id
          // 将 token 保存到 storage 中
          wx.setStorageSync('token', res.data.data.token)
          wx.setStorageSync('user_id', res.data.data.user_id)
          wx.showToast({
            title: '授权成功',
            icon: 'success',
            duration: 2000,
            success: function() {
              // 重新回到购物车(回到上一次的页面)
              wx.navigateBack({
                delta: 1
              })
            }
          })
        })
    }
  },
  onLoad() {
    // 调用 wx.login 得到 code
    wx.login({
      success: res => {
        this.params.code = res.code
        console.log(this.params.code)
      }
    })
  }
}
</script>

<style>

</style>
