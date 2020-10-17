<template>
  <div>
    <el-container>
      <color-header></color-header>
      <nuxt-child></nuxt-child>
      <color-footer></color-footer>
    </el-container>
  </div>
</template>

<script>
import layout from './colorMark/index'
export default layout
</script>

<style lang="less" scoped>
@import url('./colorMark/index.less');
</style>