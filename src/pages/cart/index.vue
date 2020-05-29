<template>
  <div class="box">
    <!-- 当存在收件人信息 -->
    <div class="message" v-if="address.name" @click="getAddress">
      <div class="m-top">
        <div class="name">{{address.name}}</div>
        <div class="phone">{{address.phone}}</div>
      </div>
      <div class="m-button">{{address.addr}}</div>
      <image src="/static/images/cart_border@2x(1).png" mode="aspectFill" />
    </div>
    <!-- 当不存在收件人信息 -->
    <div v-else>
      <div class="setUser" @click="getAddress">
        设置收件人信息
      </div>
      <image class="imgBottom" src="/static/images/cart_border@2x(1).png" mode="aspectFill" />
    </div>
    <!-- 商品标题 -->
    <div class="title">
      <span class="iconfont iconGroup-"></span>优购生活馆
    </div>
    <!-- 商品列表 -->
    <div class="goods" v-for="(value, key) in goods" :key="key">
      <div class="left">
        <icon type="success" @click="chageState(value)" size="16" :color="value.isSelected ? 'red': 'gray'" />
      </div>
      <div class="right">
        <div class="goods_img">
          <image mode="aspcetFill" v-bind:src="value.goods_small_logo" />
        </div>
        <div class="goods_msg">
          <h4>{{value.goods_name}}</h4>
          <div class="price">
            <div class="price_detail">￥{{value.goods_price}}</div>
            <div class="price_num">
              <span class="sub" @click="sub(value)">-</span>
              <span class="num">{{value.num}}</span>
              <span class="add" @click="add(value)">+</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 商品结算 -->
    <div class="count">
      <div class="left">
        <icon type="success" @click="isAll" size="16" :color="isSelectedAll ? 'red': 'gray'" /> 全选
      </div>
      <div class="center">
        <div class="total">合计：
          <span>￥ {{totalPrice}}.00</span>
        </div>
        <div class="msg">包含运费</div>
      </div>
      <div class="right">
        <button size="mini" @click="jiesuan" type="warn">结算({{selectedCount}})</button>
      </div>
    </div>
  </div>
</template>

<script>
// 引入 request
import request from '../../utils/myrequest.js'
export default {
  data() {
    return {
      address: {
        name: '',
        phone: '',
        addr: ''
      },
      // data 中的数据都是响应式： data 中的数据一旦更新，视图了也会更新
      goods: {
        // "347869": {
        //   "goods_id": '347869',
        //   "isSelected": true,
        //   "num": 1
        // }
      }
    }
  },
  methods: {
    getAddress() {
      // 使用 wx.chooseAddress,可以打开微信的收货地址
      wx.chooseAddress({
        success: res => {
          console.log(res)
          // 将收件人的信息保存到 address 中
          this.address.addr = `${res.provinceName}${res.cityName}${res.countyName}${res.detailInfo}`
          this.address.name = res.userName
          this.address.phone = res.telNumber
          // 将用户信息保存起来 storgae
          wx.setStorageSync('user', this.address)
        }
      })
    },
    // 改变元素的选中状态
    chageState(item) {
      // ---------- 2.0 解决选中按钮无法使用的 bug 方法2 ---------
      // 用来存放 goods 中的所有内容
      var list = {}
      Object.keys(this.goods).forEach(v => {
        // 判断当前点击的数据
        if (item.goods_id == v) {
          // 修改当前对象的 isSelected
          list[v] = { ...this.goods[v], isSelected: !this.goods[v].isSelected }
        } else {
          list[v] = { ...this.goods[v] }
        }
      })
      // 将新的数据重新赋值给 goods
      this.goods = list
      // // 重新将数据保存到 storage 中
      wx.setStorageSync('goods', this.goods)
      // ---------- 2.0 解决选中按钮无法使用的 bug 方法2 ---------
      // ---------- 1.0 解决选中按钮无法使用的 bug 方法1 ---------
      // // 更新对象中的 isSelected 属性
      // item.isSelected = !item.isSelected
      // // 将 goods 中的 item 对应的数据进行更新
      // this.$set(this.goods, item.goods_id, item)
      // // 重新将数据保存到 storage 中
      // wx.setStorageSync('goods', this.goods)
      // ---------- 1.0 解决选中按钮无法使用的 bug 方法1 ---------
    },
    sub(item) {
      // 创建一个将来重新给 goods 赋值的对象
      var list = {}
      Object.keys(this.goods).forEach(v => {
        if (item.goods_id == v) {
          list[v] = { ...this.goods[v], num: this.goods[v].num - 1 }
        } else {
          list[v] = { ...this.goods[v] }
        }
      })
      // 判断当前数据中的 Num 是否为 0
      if (list[item.goods_id].num == 0) {
        // 弹出一个弹出框，询问是否删除
        wx.showModal({
          title: '警告',
          content: '是否删除当前商品',
          success: (res) => {
            if (res.confirm) {
              // 点击确定，删除当前数据
              delete list[item.goods_id]
            } else {
              // 点击取消
              list[item.goods_id].num = list[item.goods_id].num + 1
            }
            // 重新给 goods 赋值
            this.goods = list
            // 保存到 storage 中
            wx.setStorageSync('goods', list)
          }
        })
      } else {
        // 重新给 goods 赋值
        this.goods = list
        // 保存到 storage 中
        wx.setStorageSync('goods', list)
      }
    },
    add(item) {
      // 创建一个新的信息，将来来对 goods 进行重新赋值
      var list = {}
      Object.keys(this.goods).forEach(v => {
        if (item.goods_id == v) {
          list[v] = { ...this.goods[v], num: this.goods[v].num + 1 }
        } else {
          list[v] = { ...this.goods[v] }
        }
      })
      // 重新给 goods 赋值
      this.goods = list
      // 保存到 storage 中
      wx.setStorageSync('goods', list)
    },
    // 点击以后所有商品的状态与当前全选相同
    isAll() {
      // 打开之前将状态保存起来
      var selcted = this.isSelectedAll
      // 得到当前全选的状态
      Object.keys(this.goods).forEach(item => {
        this.goods[item].isSelected = !selcted
      })
      wx.setStorageSync('goods', this.goods)
    },
    jiesuan() {
      // 订单总价： totalPrice
      // 收件地址： this.address.addr
      // 商品信息: goods
      var goods = [];
      Object.keys(this.goods).forEach(item => {
        if (this.goods[item].isSelected) {
          var newGoodsItem = {};
          newGoodsItem.goods_id = this.goods[item].goods_id
          newGoodsItem.goods_number = this.goods[item].num
          newGoodsItem.goods_price = this.goods[item].goods_price
          // 添加到 goods 中
          goods.push(newGoodsItem)
        }
      })
      request.auth('https://itjustfun.cn/api/public/v1/my/orders/create', 'POST', {
        order_price: this.totalPrice,
        consignee_addr: this.address.addr,
        goods: goods
      }).then(res => {
        // 跳转到订单详情页面,带上订单号
        var order_num = res.data.data.order_number
        wx.navigateTo({
          url: `/pages/order_detail/main?number=${order_num}&total=${this.totalPrice}`
        })
      })
    }
  },
  computed: {
    // 计算总价
    totalPrice: function() {
      var total = 0
      // 遍历 goods 中的商品，得到价格进行相加，乘以当前商品的数量
      // 判断 当前商品是否选中
      Object.keys(this.goods).forEach(item => {
        if (this.goods[item].isSelected) {
          total += this.goods[item].goods_price * this.goods[item].num
        }
      })
      return total
    },
    // 计算选中的个数
    selectedCount: function() {
      var count = 0
      Object.keys(this.goods).forEach(item => {
        if (this.goods[item].isSelected) {
          count++
        }
      })
      return count
    },
    // 判断是否全选
    isSelectedAll: function() {
      var isAll = true;
      Object.keys(this.goods).forEach(item => {
        if (this.goods[item].isSelected == false) {
          isAll = false
        }
      })
      return isAll
    }
  },
  // 当界面打开时，要加载用户信息
  onShow() {
    // 得到已经存储好的用户信息
    this.address = wx.getStorageSync('user') || {}
    // 得到已经存储好的商品数据
    this.goods = wx.getStorageSync('goods') || {}
  }
}
</script>

<style lang="scss">
@import "style.scss";
</style>
