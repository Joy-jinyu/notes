<template>
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
</template>

<script>
import header from './index'
export default header;
</script>

<style lang="less" scoped>
@import url("./index.less");
</style>