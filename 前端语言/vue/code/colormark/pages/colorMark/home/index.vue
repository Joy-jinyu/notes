<template>
  <div class="co_main">
    <!-- 轮播图部分 -->
    <div class="block">
      <color-swiper :height="'350px'" :swipers="[]"></color-swiper>
    </div>
    <!-- 主体内容板块 -->
    <div class="co_main_body">
      <!-- 主体内容副内容板块 -->
      <div class="co_main_recommend">
        <ul>
          <li class="recommend_li" style="background-color: skyblue">1</li>
          <li class="recommend_li" style="background-color: lightblue">2</li>
          <li class="recommend_li">3</li>
          <li class="recommend_li" style="background-color: pink">4</li>
          <li class="recommend_li">5</li>
        </ul>
      </div>
      <!-- 主体内容导航 -->
      <div class="co_main_nav">
        <el-menu
          :default-active="activeIndex"
          class="el-menu-demo"
          mode="horizontal"
          @select="handleSelect"
        >
          <el-menu-item index="1">所有领域</el-menu-item>
          <el-menu-item index="2">平面设计</el-menu-item>
          <el-menu-item index="3">数字艺术</el-menu-item>
          <el-menu-item index="4">用户界面</el-menu-item>
          <el-menu-item index="5">动态图像设计</el-menu-item>
          <el-menu-item index="6">品牌推广</el-menu-item>
          <el-menu-item index="7">工业设计</el-menu-item>
          <el-menu-item index="8">摄影</el-menu-item>
          <el-menu-item index="9">插画</el-menu-item>
          <el-menu-item index="10">包装</el-menu-item>
          <el-menu-item index="11">
            最新发布
            <i class="el-icon-arrow-down"></i>
          </el-menu-item>
          <el-menu-item index="12">
            按推荐排列
            <i class="el-icon-arrow-down"></i>
          </el-menu-item>
        </el-menu>
      </div>
      <!-- 导航内容展示区 -->
      <div class="co_main_content">
        <ul class="co_main_content_ul">
          <li v-for="item in contentList" :key="item.id">
            <img class="co_main_content_img" :src="item.contImg" alt="" />
            <div class="co_main_content_c">
              <h4>{{ item.title }}</h4>
              <div>
                <img :src="item.headImg" alt="" />
                <span class="co_main_content_c_name">{{ item.name }}</span>
                <span class="co_main_content_c_msg">
                  <span>{{ item.time }}</span>
                  <span><i class="el-icon-view"></i>{{ item.views }}</span>
                  <span>
                    <img
                      src="@/assets/img/act_icon_like_default.png"
                      alt=""
                    />{{ item.like }}
                  </span>
                </span>
              </div>
            </div>
          </li>
        </ul>
        <div class="more">
          <a href="javascript:void(0)">更多精彩等你</a>
        </div>
      </div>
      <!-- 主体内容下方占位区 -->
      <div class="co_main_space">
        <img :src="space" />
      </div>
      <!-- 主体内容推荐板块  使用上面的板块，内容控制为四个-->
      <div class="co_main_content">
        <p>为您推荐</p>
        <ul class="co_main_content_ul">
          <li v-for="item in forrecomendList" :key="item.id">
            <img class="co_main_content_img" :src="item.contImg" alt="" />
            <div class="co_main_content_c">
              <h4>{{ item.title }}</h4>
              <div>
                <img :src="item.headImg" alt="" />
                <span class="co_main_content_c_name">{{ item.name }}</span>
                <span class="co_main_content_c_msg">
                  <span>{{ item.time }}</span>
                  <span><i class="el-icon-view"></i>{{ item.views }}</span>
                  <span>
                    <img
                      src="@/assets/img/act_icon_like_default.png"
                      alt=""
                    />{{ item.like }}
                  </span>
                </span>
              </div>
            </div>
          </li>
        </ul>
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
