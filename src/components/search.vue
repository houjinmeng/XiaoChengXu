<template>
    <div class="search">
        <navigator url="/pages/search/main" class="search-input">
            <icon type="search" size="16" color="#bbb" /> 搜索
        </navigator>
    </div>
</template>

<script>
export default {

}
</script>

<style scoped>
.search {
    width: 100%;
    padding: 20rpx;
    box-sizing: border-box;
    background: #ff2d4a;
}
.search .search-input {
    width: 100%;
    height: 60rpx;
    background-color: #fff;
    font-size: 16px;
    color: #999;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
