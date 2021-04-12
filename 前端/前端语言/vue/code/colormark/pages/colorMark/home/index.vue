<template>
    <div class="color-page home">
        <!-- 轮播图部分 -->
        <div class="swiper-body">
            <color-swiper :height="'350px'"
                          :swipers="swipers"></color-swiper>
        </div>
        <!-- 主体内容板块 -->
        <div class="main-body">
            <!-- 副内容 -->
            <div class="subContent">
                <img :src="item.src"
                     v-for="(item, index) of recommends"
                     :key="vnodeKey('subContent', index)" />
            </div>
            <!-- 导航 -->
            <div class="nav">
                <!-- 菜单项 -->
                <el-menu :default-active="activeMenu"
                         class="el-menu-demo"
                         mode="horizontal"
                         @select="handleSelect">
                    <el-menu-item v-for="(item, index) of navMenus"
                                  :index="vnodeIndex(index)"
                                  :key="vnodeKey('navMenu', index)">
                        {{ item }}
                    </el-menu-item>
                </el-menu>
                <color-space />
                <!-- 排序方式 -->
                <el-menu :default-active="activeSort"
                         class="el-menu-demo"
                         mode="horizontal"
                         @select="handleSelect">
                    <el-menu-item index="1">
                        最新发布
                        <i class="el-icon-arrow-down"></i>
                    </el-menu-item>
                    <el-menu-item index="2">
                        按推荐排列
                        <i class="el-icon-arrow-down"></i>
                    </el-menu-item>
                </el-menu>
            </div>
            <!-- 产品 -->
            <div class="product">
                <div class="product-list">
                    <color-product v-for="(item, index) in products"
                                   :product="item"
                                   :key="vnodeKey('product', index)"></color-product>
                </div>
                <div class="more-btn">
                    <a href="javascript:void(0)">更多精彩等你</a>
                </div>
            </div>
            <!-- 广告位 -->
            <div class="advertisemnet">
                <img :src="space" />
                <img :src="space" />
            </div>
            <!-- 推荐板块 -->
            <div class="recommend">
                <label class="recommend-title">为您推荐</label>
                <div class="product-list">
                    <color-product v-for="(item, index) in recommendProducts"
                                   :product="item"
                                   :key="vnodeKey('recommendProduct', index)"></color-product>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import home from './index'
export default home
</script>

<style lang="less" scoped>
@import url('./index.less');
</style>
