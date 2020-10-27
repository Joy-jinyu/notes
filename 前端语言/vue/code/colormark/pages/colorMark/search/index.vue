<template>
  <div class="color-page search">
    <!-- 轮播图部分 -->
    <div class="search-body">
      <el-autocomplete
        v-model="search"
        placeholder="请输入你要查找的内容"
        :fetch-suggestions="querySuggestion"
        @select="handleSelect"
      >
        <el-button slot="suffix" type="primary">搜索</el-button>
      </el-autocomplete>
    </div>
    <!-- 主体内容板块 -->
    <div class="main-body">
      <!-- 导航 -->
      <div class="nav">
        <!-- 菜单项 -->
        <el-menu
          :default-active="activeMenu"
          class="el-menu-demo"
          mode="horizontal"
          @select="handleSelect"
        >
          <el-menu-item
            v-for="(item, index) of navMenus"
            :index="vnodeIndex(index)"
            :key="vnodeKey('navMenu', index)"
          >
            {{ item }}
          </el-menu-item>
        </el-menu>
        <color-space />
        <!-- 排序方式 -->
        <el-menu
          :default-active="activeSort"
          class="el-menu-demo"
          mode="horizontal"
          @select="handleSelect"
        >
          <el-menu-item index="1">
            最新发布
            <i class="el-icon-arrow-down"></i>
          </el-menu-item>
          <el-menu-item index="2">
            按推荐排列
            <i class="el-icon-arrow-down"></i>
          </el-menu-item>
        </el-menu>
      </div>
      <!-- 产品 -->
      <div class="product">
        <label class="product-title">搜索结果</label>
        <div class="product-list">
          <color-product
            v-for="(item, index) in products"
            :product="item"
            :key="vnodeKey('product', index)"
          >
          </color-product>
        </div>
        <div class="more">
          <a href="javascript:void(0)">更多精彩等你</a>
        </div>
      </div>
      <!-- 推荐板块 -->
      <div class="recommend">
        <label class="recommend-title">为您推荐</label>
        <div class="product-list">
          <color-product
            v-for="(item, index) in recommendProducts"
            :product="item"
            :key="vnodeKey('recommendProduct', index)"
          >
          </color-product>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import home from './index';
export default home;
</script>

<style lang="less" scoped>
@import url('./index.less');
</style>
