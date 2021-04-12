<template>
    <div class="color-page activity">
        <!-- 广告位 -->
        <div class="advertisemnet">
            <img :src="space" />
        </div>
        <!-- 主体内容板块 -->
        <div class="main-body">
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
            </div>
            <!-- 活动 -->
            <div class="product">
                <div class="product-list">
                    <color-activity v-for="(item, index) of activities"
                                    :activity="item"
                                    :key="vnodeKey('activity', index)"></color-activity>
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
