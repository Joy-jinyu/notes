<template>
  <div>
    <el-container>
      <div class="co_header">
        <!-- 分为三个部分 -->
        <el-row>
          <el-col :span="10">
            <div class="grid-content bg-purple">
              <h1>COLORMARK</h1>
              <ul class="header_view">
                <li><el-link :underline="false">首页</el-link></li>
                <li><el-link :underline="false">发现</el-link></li>
                <li><el-link :underline="false">活动</el-link></li>
              </ul>
            </div>
          </el-col>
          <el-col :span="14">
            <div class="grid-content bg-purple-light">
              <ul class="header_right">
                <li>
                  <el-input
                    v-model="searchData"
                    placeholder="搜索"
                    suffix-icon="el-icon-search"
                  >
                  </el-input>
                </li>
                <li>
                  <a href="javascript:void(0)">
                    <img src="@/assets/img/notice.png" alt="" />
                  </a>
                </li>
                <li>
                  <el-button type="primary" round>
                    <i class="el-icon-upload2"></i>
                    上传作品
                  </el-button>
                </li>
                <li>
                  <el-link :underline="false">登录</el-link>
                  <span class="divideFlag">|</span>
                  <el-link :underline="false">注册</el-link>
                </li>
              </ul>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="co_main">
        <!-- 轮播图部分 -->
        <div class="block">
          <el-carousel trigger="click" height="350px">
            <el-carousel-item v-for="item in 4" :key="item">
              <h3 class="small">{{ item }}</h3>
            </el-carousel-item>
          </el-carousel>
        </div>
        <!-- 主体内容板块 -->
        <div class="co_main_body">
          <!-- 主体内容副内容板块 -->
          <div class="co_main_recommend">
            <ul>
              <li class="recommend_li" style="background-color: skyblue">1</li>
              <li class="recommend_li" style="background-color: lightblue">
                2
              </li>
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
              <!-- <el-submenu index="11">
                <template slot="title">按推荐排列</template>
              </el-submenu>
              <el-submenu index="12">
                <template slot="title">最新发布</template>
              </el-submenu> -->
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
      <el-footer>
        <div class="footer_top">
          <h3>COLORMARK</h3>
          <ul>
            <li><a href="javascript:void(0)">关于我们</a></li>
            <li><a href="javascript:void(0)">用户协议</a></li>
            <li><a href="javascript:void(0)">隐私政策</a></li>
            <li><a href="javascript:void(0)">侵权申诉</a></li>
            <li><a href="javascript:void(0)">企业服务</a></li>
            <li><a href="javascript:void(0)">帮助中心</a></li>
            <li><a href="javascript:void(0)">联系我们</a></li>
          </ul>
        </div>
        <div class="footer_bottom">
          <el-row>
            <el-col :span="12">
              <div class="grid-content">
                粤公网安备 44030902001XXX号 粤ICP备19041XXX号-X
              </div>
            </el-col>
            <el-col :span="12">
              <div class="grid-content">
                Copyright C 2019-2020 COLORMARK
              </div>
            </el-col>
          </el-row>
        </div>
      </el-footer>
    </el-container>
  </div>
</template>
<script>
import home from "./index";
export default home;
</script>
<style lang="less" scoped>
@import url("./index.less");
</style>
