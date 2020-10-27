<template>
  <div class="header">
    <!-- 分为三个部分 -->
    <h1 class="header-logo">COLORMARK</h1>
    <!-- 页头菜单 -->
    <ul class="header-menu">
      <li><nuxt-link to="./home">首页</nuxt-link></li>
      <li><nuxt-link to="./search">发现</nuxt-link></li>
      <li><nuxt-link to="./activity">活动</nuxt-link></li>
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
      <span class="register">注册</span>
      <el-dropdown trigger="click" placement="bottom-start">
        <span class="user-logo">
          <img src="@/static/img/位图_5.png" /><i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item icon="el-icon-plus">我的作品</el-dropdown-item>
          <el-dropdown-item icon="el-icon-circle-plus">我的关注</el-dropdown-item>
          <el-dropdown-item icon="el-icon-circle-plus-outline"
            >我的收藏</el-dropdown-item
          >
          <el-dropdown-item icon="el-icon-check">个人资料</el-dropdown-item>
          <el-dropdown-item icon="el-icon-circle-check"
            >退出</el-dropdown-item
          >
        </el-dropdown-menu>
      </el-dropdown>
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