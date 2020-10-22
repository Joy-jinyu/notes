<template>
  <div class="header">
    <!-- 分为三个部分 -->
    <h1 class="header-logo">COLORMARK</h1>
    <!-- 页头菜单 -->
    <ul class="header-menu">
      <li>首页</li>
      <li>发现</li>
      <li>活动</li>
    </ul>
    <!-- 占位符 -->
    <color-space />
    <!-- 页头操作项 -->
    <div class="header-action">
      <el-input
        v-model="search"
        placeholder="搜索"
        suffix-icon="el-icon-search"
      >
      </el-input>
      <span>
        <el-badge :value="12" class="item">
          <img src="@/assets/img/notice.png" alt="" />
        </el-badge>
      </span>
      <el-button type="primary" round>
        <i class="el-icon-upload2"></i>
        上传作品
      </el-button>
      <span class="login">登录</span>
      <span class="login">注册</span>
    </div>
  </div>
</template>

<script>
import header from './index';
export default header;
</script>

<style lang="less" scoped>
@import url('./index.less');
</style>