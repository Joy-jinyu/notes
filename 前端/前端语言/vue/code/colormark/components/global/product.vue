<template>
  <div class="product-list__item">
    <img class="product-img" :src="product.contImg" alt="" />
    <div class="product-body">
      <h4>{{ product.title }}</h4>
      <div class="product-body__detail">
        <img :src="product.headImg" alt="" />
        <span class="detail-name">{{ product.name }}</span>
        <span class="detail-body">
          <span>{{ product.time }}</span>
          <span><img src="@/assets/img/view.png" alt="" />{{ product.views }}</span>
          <span>
            <img src="@/assets/img/like.png" alt="" />{{
              product.like
            }}
          </span>
        </span>
      </div>
    </div>
  </div>
</template>
<script>
// 空白占位符
export default {
  name: 'Product',
  props: {
    product: {
      required: true,
    },
  },
};
</script>

<style lang="less" scoped>
.product-list__item {
  flex: 0 0 auto;
  border-radius: @basic-radius;
  height: 3rem;
  width: 3.2rem;

  .product-img {
    width: 100%;
    height: 2.4rem;
    border-radius: @basic-radius;
  }

  .product-body {
    width: 100%;
    height: 0.6rem;

    h4 {
      width: 100%;
      height: 30px;
      font-size: 14px;
      font-family: PingFangSC, PingFangSC-Medium;
      font-weight: 500;
      text-align: left;
      color: #333333;
      line-height: 30px;
    }

    img {
      width: 20px;
      height: 20px;
      border: 1px solid #f7f7f7;
      border-radius: 10px;
    }

    &__detail {
      height: 30px;
      font-size: 14px;
      font-family: PingFangSC, PingFangSC-Regular;
      font-weight: 400;

      .detail-name {
        text-align: left;
        color: #666666;
      }

      .detail-body {
        float: right;
        color: #999999;
        margin-right: 8px;
      }
    }
  }
}
</style>