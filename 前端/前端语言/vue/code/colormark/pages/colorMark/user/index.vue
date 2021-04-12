<template>
    <div class="color-page person">
        <!-- 广告位 -->
        <div class="advertisemnet">
            <img :src="space" />
        </div>
        <!-- 主体内容板块 -->
        <div class="main-body">
            <section>
                <div class="person-center">
                    <img src="@/static/img/位图_5.png" />
                    <span class="name">AUEDC Design</span>
                    <div class="position">
                        <span>珠海</span>
                        <span>UI设计师</span>
                    </div>
                    <div class="parameter">
                        <div>
                            <span class="number">18</span>
                            <span class="type">项目</span>
                        </div>
                        <div>
                            <span class="number">278</span>
                            <span class="type">粉丝</span>
                        </div>
                        <div>
                            <span class="number">449</span>
                            <span class="type">关注</span>
                        </div>
                    </div>
                    <div class="buttons">
                        <el-button type="primary">关注</el-button>
                        <el-button>私信</el-button>
                    </div>
                </div>
                <div class="section-menu">
                    <span v-for="(item, index) of menus"
                          :class="{ active: item.code === activeMenu }"
                          :key="vnodeKey('activeMenu', index)"
                          @click="selectMenu(item)">
                        {{ item.name }}
                    </span>
                </div>
                <div class="section-body">
                    <!-- 产品 -->
                    <div class="product">
                        <div class="product-list">
                            <color-product v-for="(item, index) in products"
                                           :product="item"
                                           :key="vnodeKey('product', index)"></color-product>
                        </div>
                        <el-pagination background
                                       layout="prev, pager, next"
                                       :total="1000"></el-pagination>
                    </div>
                </div>
            </section>
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
