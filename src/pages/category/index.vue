<template>
  <div>
    <!-- 搜索框 -->
    <search></search>
    <!-- 内容区域 -->
    <div class="content">
      <div class="left">
        <div class="menu" @click="handleTabClick(index)" :class="{active: selectedIndex == index}" v-for="(item, index) in menuList" :key="index">
          {{ item.cat_name }}
        </div>
      </div>
      <div class="right">
        <image class="topImg" mode="aspectFill" src="https://img.alicdn.com/simba/img/TB1aA.9GCzqK1RjSZFjSuvlCFXa.jpg" />
        <div class="goods" v-for="(item, index) in goodsList" :key="index">
          <div class="title">
            <span>/</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ item.cat_name }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <span>/</span>
          </div>
          <div class="goods_items">
            <div class="item" v-for="(subitem, subindex) in item.children" :key="subindex">
              <navigator :url="'/pages/search_list/main?key=' + subitem.cat_name">
                <image :src="'https://itjustfun.cn/' + subitem.cat_icon" mode="aspectFill" />
                <p>{{subitem.cat_name}}</p>
              </navigator>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 引入
import search from '../../components/search.vue'
// 引入 request
import request from '../../utils/myrequest.js'

export default {
  data() {
    return {
      selectedIndex: 0, // 默认选中的菜单选项
      menuList: [], // 用来保存左侧菜单内容
      goodsList: [], // 用来存放菜单栏中对应的数据
    }
  },
  methods: {
    handleTabClick(index) {
      this.selectedIndex = index
      // 每次点击时，将点击元素的对应的商品数据赋值给 goodsList
      this.goodsList = this.menuList[index].children
      console.log(this.goodsList)
    }
  },
  mounted() {
    // 请求分类数据
    request('https://itjustfun.cn/api/public/v1/categories')
      .then(res => {
        console.log(res)
        this.menuList = res.data.message
        // 给 goodsList 设置默认值
        this.goodsList = this.menuList[this.selectedIndex].children
      })
  },
  components: {
    search
  }
}
</script>

<style scope lang='scss'>
@import 'style.scss';
</style>
