<template>
  <div>
    <!-- 完成搜索框 -->
    <div class="search">
      <div class="search-box">
        <div class="input">
          <icon type="search" size="16"></icon>
          <input @input="handleInput" @confirm="handleConfirm" type="text" v-model="searchKey" placeholder="请输入你想要的商品" />
        </div>
        <div class="btn" v-if="searchKey.length != 0">
          <button @click="handleCancle" size="mini">取消</button>
        </div>
      </div>
      <!-- 联想内容 -->
      <div class="content" v-if="searchKey.length != 0">
        <div class="item" @click="thinkClick(item.goods_name)" v-for="(item, index) in thinkList" :key="index">{{item.goods_name}}</div>
      </div>
    </div>
    <!-- 完成历史搜索 -->
    <div class="his">
      <div class="title">
        <h4>历史搜索</h4>
        <icon @click="clearHistory" type="clear" size="14"></icon>
      </div>
      <div class="item-box">
        <navigator :url="'/pages/search_list/main?key=' + item" class="item" v-for="(item, index) in keyList" :key="index">{{item}}</navigator>
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
      searchKey: '', // 搜索关键字
      keyList: [],
      thinkList: [], // 联想数组
      timer: null // 搜索页面的定时器
    }
  },
  methods: {
    handleCancle() {
      this.searchKey = ''
    },
    handleConfirm() {
      if (this.searchKey.trim().length <= 0) {
        // 不执行后面的搜索代码
        return
      }
      // 跳转到 search_list 中
      wx.navigateTo({
        url: `/pages/search_list/main?key=${this.searchKey}`
      })
      // // 判断当前搜索的数据在数据源中是否存在
      // for (var i = 0; i < this.keyList.length; i++) {
      //   if (this.keyList[i] == this.searchKey) {
      //     return
      //   }
      // }
      // 将当前的关键字保存到小程序的 stroage
      this.keyList.unshift(this.searchKey)
      // 使用 set 进行去重
      this.keyList = [...new Set(this.keyList)]
      wx.setStorageSync('history', this.keyList)
      // 将原本的搜索页面中的关键字清除
      this.searchKey = ''
    },
    clearHistory() {
      // 清除小程序缓存中的数据
      wx.removeStorageSync('history')
      // 清除 keyList 中的数据
      this.keyList = []
    },
    handleInput(ev) {
      // 判断是否为空
      if (this.searchKey.trim().length === 0) {
        return
      }
      // 让搜索中只有一个定时器
      if(this.timer) {
        // 清除之前的定时器
        clearTimeout(this.timer)
      }
      // 搜索：
      this.timer = setTimeout(() => {
        // 发送请求到服务器拿到与搜索内容相关的数据
        var keyword = ev.target.value
        request.get('https://itjustfun.cn/api/public/v1/goods/qsearch', {
          query: keyword
        }).then(res => {
          console.log(res)
          this.thinkList = res.data.message
        })
      }, 500)
    },
    thinkClick(key) {
      this.searchKey = key
      this.handleConfirm()
    }
  },
  mounted() {
    // 当每次新进来时重新给 keyList 赋值
    this.keyList = wx.getStorageSync('history') || []
  }
}
</script>

<style scoped lang="scss">
@import "style.scss";
</style>
