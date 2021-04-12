<template>
    <el-carousel trigger="click" :height="height">
        <el-carousel-item
            v-for="(item, index) of swipers"
            :key="vnodeKey('swiper', index)"
        >
            <img :src="item.src" />
        </el-carousel-item>
    </el-carousel>
</template>

<script>
export default {
    name: 'Swiper',
    props: {
        height: {
            required: true
        },
        swipers: {
            default: []
        }
    },
    data() {
        return {}
    },
    methods: {
        vnodeKey(name, index) {
            return name + index
        }
    }
}
</script>

<style lang="less" scoped>
img {
    width: 100%;
}
</style>
