<template>
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
          <div class="grid-content">Copyright C 2019-2020 COLORMARK</div>
        </el-col>
      </el-row>
    </div>
  </el-footer>
</template>

<script>
import footer from './index';
export default footer
</script>

<style lang="less" scoped>
@import url("./index.less");
</style>