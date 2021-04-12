<template>
    <div class="color-page person">
        <!-- 主体内容板块 -->
        <div class="main-body">
            <aside>
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
                    <el-button type="primary">开始创作</el-button>
                </div>
                <div class="person-menu">
                    <span
                        v-for="(item, index) of asideMenus"
                        :class="{ active: item.code === activeAside }"
                        :key="vnodeKey('asideMenu', index)"
                        @click="selectAside(item)"
                    >
                        {{ item.name }}
                    </span>
                </div>
            </aside>
            <section>
                <div class="section-menu">
                    <span
                        v-for="(item, index) of sectionMenus"
                        :class="{ active: item.code === activeSection }"
                        :key="vnodeKey('sectionMenu', index)"
                        @click="selectSection(item)"
                    >
                        {{ item.name }}
                    </span>
                </div>

                <div class="section-body">
                    <component
                        :is="showPage"
                        :products="products"
                        :fans-list="fansList"
                    ></component>
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
