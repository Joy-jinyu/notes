<template>
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
</template>
<script>
// 空白占位符
export default {
    name: 'Person-Product',
    props: {
        products: {
            required: true
        }
    },
    methods: {
        vnodeKey (name, index) {
            return name + index++
        }
    }
}
</script>

<style lang="less" scoped>
.product {
    @distant: 0.32rem;

    .product-list {
        &__item {
            margin: @distant / 2 0;
            &:nth-child(3n + 2) {
                margin: @distant / 2 @distant;
            }
        }
    }
}
</style>
