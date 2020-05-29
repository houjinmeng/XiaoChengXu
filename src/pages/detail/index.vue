<template>
  <div>
    <!-- 轮播图 -->
    <swiper class="detail-swiper" indicator-dots autoplay>
      <block v-for="(item,index) in goods_detail.pics" :key="index">
        <swiper-item>
          <image :src="item.pics_big" class="slide-image" mode="aspectFill" />
        </swiper-item>
      </block>
    </swiper>
    <div class="introduce">
      <div class="price">￥ {{goods_detail.goods_price}}</div>
      <div class="word">
        <div class="left">{{ goods_detail.goods_name }}</div>
        <div class="right">
          <span class="iconfont iconshoucang"></span> 收藏
        </div>
      </div>
      <div class="postman">快递：&nbsp;&nbsp;免运费</div>
    </div>
    <!-- 存放商品说明的富文本信息 -->
    <div v-html="goods_detail.goods_introduce"></div>
    <div class="bottomTab">
      <button class="mybtn" open-type="contact"></button>
      <div class="left">
        <span class="iconfont icontongyong-lianxikefutubiao"></span>联系客服
      </div>
      <navigator open-type="switchTab" url="/pages/cart/main" class="left">
        <span class="iconfont icongouwuche"></span>购物车
      </navigator>
      <div class="right" @click="addToCart">加入购物车</div>
      <div class="right">立即购买</div>
    </div>
  </div>
</template>

<script>
// 引入 request
import request from "../../utils/myrequest.js";
export default {
  data() {
    return {
      goods_id: 0, // 详情数据对应的商品 id
      goods_detail: {},
      cartObj: {} // 在本地缓存中保存的购物车中的信息
    };
  },
  // 到 onLoad 事件的 参数 query 中可以得到
  onLoad(query) {
    this.goods_id = query.goods_id;
    // 当页面加载之前需要重新将购物车中的数据读取出来
    this.cartObj = wx.getStorageSync("goods") || {};
  },
  methods: {
    getGoodsDetail() {
      request
        .get("https://itjustfun.cn/api/public/v1/goods/detail", {
          goods_id: this.goods_id
        })
        .then(res => {
          this.goods_detail = res.data.message;
          console.log(res.data.data);
        });
    },
    // 将商品信息添加到本地缓存中
    addToCart() {
      // 添加一个提示框
      wx.showToast({
        title: "加入购物车成功", // 提示框的文本
        icon: "success", // 提示的框小图标
        duration: 2000 // 提示框的持续时间
      });
      // 当保存信息时，不能直接将商品信息保存到 goods 中，应该设置为一个数组，使用数组的方式来保存
      this.cartObj[this.goods_detail.goods_id] = this.goods_detail;
      // 除添加商品信息以外，还在添加商品选中及数量（默认为选中，数量为1）
      this.cartObj[this.goods_detail.goods_id].isSelected = true;
      this.cartObj[this.goods_detail.goods_id].num = 1;
      wx.setStorageSync("goods", this.cartObj);
    }
  },
  mounted() {
    this.getGoodsDetail();
  }
};
</script>

<style scoped lang="scss">
@import "style.scss";
</style>
