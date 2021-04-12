<template>
    <!-- 产品 -->
    <div class="fans-body">
        <div class="fans-list">
            <div class="fans"
                 v-for="(fans, index) in fansList"
                 :key="vnodeKey('fans', index)">
                <img class="fans-logo"
                     :src="fans.logo" />
                <div class="fans-center">
                    <span class="name">{{ fans.name }}</span>
                    <div class="position">
                        <span>{{ fans.location }}</span>
                        <span>{{ fans.position }}</span>
                    </div>
                    <div class="parameter">
                        <div>
                            <span class="number">{{ fans.projectNum }}</span>
                            <span class="type">项目</span>
                        </div>
                        <div>
                            <span class="number">{{ fans.fansNum }}</span>
                            <span class="type">粉丝</span>
                        </div>
                        <div>
                            <span class="number">{{ fans.focusNum }}</span>
                            <span class="type">关注</span>
                        </div>
                    </div>
                    <div class="buttons">
                        <el-button>互相关注</el-button>
                        <el-button>私信</el-button>
                    </div>
                </div>
                <img class="fans-product"
                     v-for="(product, index) in fans.products"
                     :key="vnodeKey('fansProduct', index)"
                     :src="product" />
            </div>
        </div>

        <color-space />

        <el-pagination background
                       layout="prev, pager, next"
                       :total="1000"></el-pagination>
    </div>
</template>
<script>
// 空白占位符
export default {
    name: 'Person-Fans',
    props: {
        fansList: {
            required: true
        }
    },
    methods: {
        vnodeKey(name, index) {
            return name + index++
        }
    }
}
</script>

<style lang="less" scoped>
.fans-body {
}
</style>
