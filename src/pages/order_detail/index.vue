<template>
  <div class="box">
    <!-- 当存在收件人信息 -->
    <div class="message" @click="getAddress">
      <div class="m-top">
        <div class="name">{{address.name}}</div>
        <div class="phone">{{address.phone}}</div>
      </div>
      <div class="m-button">{{address.addr}}</div>
      <image src="/static/images/cart_border@2x(1).png" mode="aspectFill" />
    </div>
    <!-- 商品标题 -->
    <div class="title">
      <span class="iconfont iconGroup-"></span>商品列表
    </div>
    <!-- 商品列表 -->
    <div class="goods" v-for="(value, key) in goods" :key="key">
      <div class="right">
        <div class="goods_img">
          <image mode="aspcetFill" v-bind:src="value.goods_small_logo" />
        </div>
        <div class="goods_msg">
          <h4>{{value.goods_name}}</h4>
          <div class="price">
            <div class="price_detail">￥{{value.goods_price}}</div>
            <div class="price_num">
              <span class="num">{{value.num}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 总计 -->
    <div class="total">
      总计： ￥{{total}}
    </div>
    <button type="primary" @click="pay">微信支付</button>
  </div>
</template>

<script>
// 引入 reqest
import request from '../../utils/myrequest.js'
export default {
  data() {
    return {
      address: {},
      goods: {}, // 已经选中的
      noSelected: {}, // 没有被选中商品信息
      order_num: '', // 订单号
      total: 0, // 总价格
    }
  },
  methods: {
    pay() {
      // 请求微信支付接口
      request.auth('https://itjustfun.cn/api/public/v1/my/orders/req_unifiedorder', 'POST', {
        "order_number": this.order_num
      }).then(res => {
        // 在 res.wxorder 中有很多的数据这些数据是提供支付的参数
        let { wxorder } = res.data.data
        // 完成支付
        wx.requestPayment({
          timeStamp: wxorder.timeStamp,
          nonceStr: wxorder.nonceStr,
          package: wxorder.package,
          signType: wxorder.signType,
          paySign: wxorder.paySign,
          success(res) {
            console.log('支付成功')
          },
          fail: res => {
            // 删除已经购买的商品
            // 重新存储到 storage 中
            wx.setStorageSync('goods', this.noSelected)
            // 跳转回购物车
            wx.switchTab({
              url: '/pages/cart/main'
            })
          }
        })
      })
    }
  },
  // 获取订单号
  onLoad(query) {
    // 判断是否存在订单号和价格
    if (!query.number || !query.total) {
      wx.showToast({
        title: '用户信息不完整，请求重新填写',
        icon: 'none',
        duration: 2000,
        success: function() {
          setTimeout(function() {
            wx.switchTab({
              url: '/pages/cart/main'
            })
          }, 2000);
        }
      })
      return
    }
    // 给总价格赋值
    this.total = query.total
    // 给订单号赋值
    this.order_num = query.number
    // 得到用户信息
    this.address = wx.getStorageSync('user')
    // 得到商品信息
    var data = wx.getStorageSync('goods')
    this.goods = {}
    this.noSelected = {}
    Object.keys(data).forEach(v => {
      if (data[v].isSelected === true) {
        this.goods[v] = { ...data[v] }
      } else {
        this.noSelected[v] = { ...data[v] }
      }
    })
  }
}
</script>

<style lang="scss">
@import "style.scss";
</style>
