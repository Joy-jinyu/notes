<template>
  <el-carousel trigger="click" :height="height">
    <el-carousel-item v-for="(item, index) of swipers" :key="vnodeKey('swiper', index)">
      <h3 class="small">{{ item }}</h3>
    </el-carousel-item>
  </el-carousel>
</template>

<script>
export default {
  name: 'Swiper',
  props: {
    height: {
      required: true,
    },
    swipers: {
      default: [],
    },
  },
  data() {
      return {
          
      }
  },
  methods: {
      vnodeKey(name, index) {
          return name + index
      }
  }
};
</script>