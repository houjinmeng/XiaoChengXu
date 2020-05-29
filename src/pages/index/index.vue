<template>
  <div>
    <!-- 搜索框区域 -->
    <search />
    <!-- 轮播图区域 -->
    <swiper class="swiper" indicator-dots autoplay>
      <navigator :url="'/pages/detail/main?goods_id=' + item.goods_id" v-for="(item, index) in imgList" :key="index">
        <swiper-item>
          <image :src="item.image_src" class="slide-image" mode="aspectFit" />
        </swiper-item>
      </navigator>
    </swiper>
    <!-- 分类区域 -->
    <div class="cate">
      <image v-for="(item, index) in cateList" :key="index" :src="item.image_src" mode="aspectFill" />
    </div>
    <!-- 楼层区域 -->
    <div class="floor" v-for="(item, index) in floorList" :key="index">
      <div class="title">
        <image :src="item.floor_title.image_src" mode="aspectFill" />
      </div>
      <div class="content">
        <navigator :url="'/pages/search_list/main?key=' + item.product_list[0].keyword" class="left">
          <image :src="item.product_list[0].image_src" mode="aspectFill" />
        </navigator>
        <div class="right">
          <navigator v-if="subindex != 0" v-for="(subitem, subindex) in item.product_list" :key="subindex" :url="'/pages/search_list/main?key=' + subitem.keyword">
            <image :src="subitem.image_src" mode="aspectFill" />
          </navigator>
        </div>
      </div>
    </div>
    <!-- 回到顶部 -->
    <div class="backTop" @click="backTop" v-if="isShow">
      顶部
    </div>
  </div>
</template>

<script>
// 导入 myrequest
import request from '../../utils/myrequest.js'

import search from '../../components/search'

export default {
  data: function() {
    return {
      imgList: [],
      cateList: [],
      floorList: [],
      isShow: false, // 控制返回顶部是否显示
    }
  },
  methods: {
    async getData() {
      // 请求轮播图的数据
      try {
        const res = await request('https://itjustfun.cn/api/public/v1/home/swiperdata')
        this.imgList = res.data.message
      } catch (err) {
        console.log('将错误信息记录到日志文件中')
      }

      // 请求分类选项的数据
      try {
        const res = await request('https://itjustfun.cn/api/public/v1/home/catitems')
        this.cateList = res.data.message
      } catch (err) {
        console.log('将错误信息记录到日志文件中')
      }

      // 请求楼层的数据
      try {
        const res = await request('https://itjustfun.cn/api/public/v1/home/floordata')
        this.floorList = res.data.message
      } catch (err) {
        console.log('将错误信息记录到日志文件中')
      }

      // 关闭下拉框
      wx.stopPullDownRefresh()
    },
    backTop() {
      // 滚动到最上
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 300
      })
    }
  },
  mounted() {
    // -------------------------- 4.0 版本 -----------------------------------
    this.getData()
    // -------------------------- 4.0 版本 -----------------------------------
    // -------------------------- 3.0 版本 -----------------------------------
    // request('https://itjustfun.cn/api/public/v1/home/swiperdata')
    //   .then( res => {
    //     this.imgList = res.data.data
    //     return request('https://itjustfun.cn/api/public/v1/home/catitems')
    //   }).then( res => {
    //     this.cateList = res.data.data
    //     return request('https://itjustfun.cn/api/public/v1/home/floordata')
    //   }).then( res => {
    //     this.floorList = res.data.data
    //   })
    // -------------------------- 3.0 版本 -----------------------------------
    // -------------------------- 2.0 版本 -----------------------------------
    // 使用自己封装的方法
    // request('https://itjustfun.cn/api/public/v1/home/swiperdata')
    //   .then( res => {
    //     this.imgList = res.data.data
    //     request('https://itjustfun.cn/api/public/v1/home/catitems')
    //       .then( res1 => {
    //         this.cateList = res1.data.data
    //         request('https://itjustfun.cn/api/public/v1/home/floordata')
    //           .then( res2 => {
    //             this.floorList = res2.data.data
    //           })
    //       })
    //   })
    // -------------------------- 2.0 版本 -----------------------------------
    //  ----------------------------- 1.0 版本 --------------------------------------
    // // 请求轮播图数据
    // wx.request({
    //   url: 'https://itjustfun.cn/api/public/v1/home/swiperdata', 
    //   method: 'GET',
    //   success: res => {
    //     //  箭头函数中的 this 指向的是上一层作用域中的 this 
    //     // 将轮播图图片列表数据保存起来
    //     // console.log(res)
    //     this.imgList = res.data.data
    //   }
    // })
    // // 请求分类的数据
    // wx.request({
    //   url: 'https://itjustfun.cn/api/public/v1/home/catitems',
    //   method: 'GET',
    //   success: res => {
    //     // 将分类数据保存到 cateList 中
    //     this.cateList = res.data.data
    //   }
    // })
    // // 请求楼层数据
    // wx.request({
    //   url: 'https://itjustfun.cn/api/public/v1/home/floordata',
    //   method: 'GET',
    //   success: res => {
    //     console.log(res)
    //     this.floorList = res.data.data
    //   }
    // })
    //  ----------------------------- 1.0 版本 --------------------------------------
  },
  components: {
    search
  },
  onPullDownRefresh() {
    // 重新请求当前页面的数据
    this.getData()
  },
  onPageScroll(query) {
    console.log(query.scrollTop)
    if(query.scrollTop < 50) {
      this.isShow = false
    } else {
      this.isShow = true
    }
  }
}
</script>

<style scope lang="scss">
@import 'style.scss';
</style>
