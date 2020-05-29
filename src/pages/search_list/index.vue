<template>
  <div>
    <!-- 搜索框 -->
    <div class="search">
      <div class="search-input">
        <icon type="search" size="16" color="#bbb" /> {{ key }}
      </div>
    </div>
    <!-- 头部 tab 栏 -->
    <div class="tab">
      <div class="tab-item" @click="handlerClick(index)" :class="{active: selectedIndex == index}" v-for="(item, index) in tabList" :key="index">
        {{ item }}
      </div>
    </div>
    <!-- 商品列表 -->
    <div class="goodsList">
      <navigator :url="'/pages/detail/main?goods_id=' + item.goods_id" class="item" v-for="(item, index) in goodsList" :key="index">
        <div class="left">
          <image mode="aspectFill" :src="item.goods_small_logo" />
        </div>
        <div class="right">
          <p class="detail">{{ item.goods_name }}</p>
          <p class="price">
            ￥
            <span>{{ item.goods_price }}</span>.00
          </p>
        </div>
      </navigator>
    </div>
    <div class="endLine" v-if="isLoadingEnd">
      -- 我是有底线的 --
    </div>
  </div>
</template>

<script>
// 引入 request
import request from '../../utils/myrequest.js'

export default {
  data() {
    return {
      tabList: ['综合', '销量', '价格'],
      selectedIndex: 0,
      goodsList: [], // 保存商品列表数据
      key: '', // 搜索的关键字
      pagenum: 1, // 分页的页数
      pagesize: 20, // 分页中每页的条数
      isEnd: true, // 当前请求是否响应完成
      isLoadingEnd: false, // 标识当前关键字的数据是否加载完
    }
  },
  methods: {
    handlerClick(index) {
      this.selectedIndex = index
    },
    // 获取数据的方法
    getGoodsList() {
      // 判断是否请求正在执行,如果正在执行，直接结束本次请求
      if (!this.isEnd || this.isLoadingEnd) {
        return
      }

      // 当发送请求时，将标识设置为 false
      this.isEnd = false
      // // 在发送请求之前，最好将页面有一个动态的加载
      // wx.showLoading({
      //   title: '加载中',
      // })
      request.get('https://itjustfun.cn/api/public/v1/goods/search', {
        query: this.key,
        pagenum: this.pagenum,
        pagesize: this.pagesize
      }).then(res => {
        // 应该是两个数组时行合并
        // this.goodsList = res.data.data.goods
        this.goodsList = this.goodsList.concat(res.data.message.goods)
        console.log(this.goodsList)
        // 当请求完成时，重新将标识设置为 true
        this.isEnd = true
        // 判断当前页返回的数据是否小于页容量
        if (res.data.data.goods.length < this.pagesize) {
          this.isLoadingEnd = true
        }
        // // 关闭 loading
        // wx.hideLoading()
      })
    }
  },
  mounted() {
    // 发送请求去得到数据
    // request('https://itjustfun.cn/api/public/v1/goods/search', 'get', {
    //   query: '小米'
    // }).then( res => {
    //   console.log(res.data.data)
    //   this.goodsList = res.data.data.goods
    // })
    this.getGoodsList()
  },
  // 小程序中页面的生命周期函数
  onLoad(query) {
    // query: 页面 url 传递过来的参数
    this.key = query.key
  },
  // 当上拉触底时执行
  onReachBottom() {
    this.pagenum++
    console.log(this.pagenum)
    // 重新请求数据
    this.getGoodsList()
  },
  // 解决重复打开一个页面，但是数据不变
  onUnload() {
    // 相当于浅拷贝
    // 将 this.$options 中的 data 重新赋值给 this
    Object.assign(this, this.$options.data())
  }
}
</script>

<style scoped lang="scss">
@import "style.scss";
</style>
