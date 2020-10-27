<template>
  <!-- 产品 -->
  <div class="fans-body">
    <div class="fans-list">
      <div
        class="fans"
        v-for="(fans, index) in fansList"
        :key="vnodeKey('fans', index)"
      >
        <img class="fans-logo" :src="fans.logo" />
        <div class="fans-center">
          <span class="name">{{ fans.name }}</span>
          <div class="position">
            <span>{{ fans.location }}</span>
            <span>{{ fans.position }}</span>
          </div>
          <div class="parameter">
            <div>
              <span class="number">{{ fans.projectNum }}</span
              ><span class="type">项目</span>
            </div>
            <div>
              <span class="number">{{ fans.fansNum }}</span
              ><span class="type">粉丝</span>
            </div>
            <div>
              <span class="number">{{ fans.focusNum }}</span
              ><span class="type">关注</span>
            </div>
          </div>
          <div class="buttons">
            <el-button>互相关注</el-button>
            <el-button>私信</el-button>
          </div>
        </div>
        <img
          class="fans-product"
          v-for="(product, index) in fans.products"
          :key="vnodeKey('fansProduct', index)"
          :src="product"
        />
      </div>
    </div>

    <color-space />

    <el-pagination background layout="prev, pager, next" :total="1000">
    </el-pagination>
  </div>
</template>
<script>
// 空白占位符
export default {
  name: 'Person-Fans',
  props: {
    fansList: {
      required: true,
    },
  },
  methods: {
    vnodeKey(name, index) {
      return name + index++;
    },
  },
};
</script>

<style lang="less" scoped>
.fans-body {
  height: 11.2rem;
  display: flex;
  flex-flow: column;
  align-items: center;

  .fans-list {
    display: flex;
    flex-flow: column;
    .fans {
      display: flex;
      height: 2.3rem;
      padding: 0.3rem 0;
      border-bottom: 1px solid #cccccc;
      .fans-logo {
        width: 0.8rem;
        height: 0.8rem;
        border-radius: 50%;
      }

      .fans-center {
        width: 2.12rem;
        display: flex;
        flex-flow: column;

        .name {
          display: block;
          font-size: 0.18rem;
          font-weight: 500;
          padding: 0 0.1rem;
          margin: 0 0 0.1rem;
        }

        .position {
          font-size: @mini-font-size;
          margin-bottom: 0.1rem;

          span {
            padding: 0 0.1rem;
            color: #999999;
          }
        }

        .parameter {
          display: flex;
          padding: 0 0.1rem;
          justify-content: space-between;
          width: 100%;

          div {
            span {
              display: block;
              text-align: center;
            }

            .number {
              font-size: 0.18rem;
              font-weight: 500;
            }

            .type {
              font-size: @mini-font-size;
              color: #999999;
            }
          }
        }

        .buttons {
          width: 100%;
          display: flex;
          justify-content: space-around;
          margin: 0.2rem 0 0.3rem;

          button {
            width: .88rem;
            padding: 0;
            height: 0.34rem;
            border-radius: @me-radius !important;
          }
        }
      }

      .fans-product {
        width: 2.27rem;
        height: 1.7rem;
      }

      > * {
        margin-left: 0.12rem;
        &:first-child {
          margin-left: 0;
        }
      }
    }
  }
}
</style>