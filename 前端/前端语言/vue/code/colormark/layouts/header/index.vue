<template>
    <div class="header">
        <!-- 分为三个部分 -->
        <h1 class="header-logo">COLORMARK</h1>
        <!-- 页头菜单 -->
        <ul class="header-menu">
            <li><nuxt-link to="/colorMark/home">首页</nuxt-link></li>
            <li><nuxt-link to="/colorMark/search">发现</nuxt-link></li>
            <li><nuxt-link to="/colorMark/activity">活动</nuxt-link></li>
        </ul>
        <!-- 占位符 -->
        <color-space />
        <!-- 页头操作项 -->
        <div class="header-action">
            <!-- 搜索框 -->
            <el-input
                v-model="search"
                placeholder="搜索"
                suffix-icon="el-icon-search"
            ></el-input>
            <!-- 消息 -->
            <el-popover placement="bottom" width="217" trigger="click">
                <div class="notify-card">
                    <div class="notify-header">
                        <span>消息</span>
                        <color-space />
                        <span class="clear">清空</span>
                    </div>
                    <div class="notify-body">
                        <div class="message" v-if="false">
                            <span>
                                <i class="el-icon-share"></i>
                                收到0颗赞
                            </span>
                            <span>
                                <i class="el-icon-share"></i>
                                收到2条新消息
                            </span>
                            <span>
                                <i class="el-icon-share"></i>
                                收到5条评论
                            </span>
                            <span>
                                <i class="el-icon-share"></i>
                                收到1个关注
                            </span>
                            <span>
                                <i class="el-icon-share"></i>
                                收到1个私信
                            </span>
                        </div>
                        <img src="@/static/img/lack/msg.png" v-else />
                    </div>
                    <div class="notify-action">
                        <span>查看更多</span>
                    </div>
                </div>
                <span slot="reference">
                    <el-badge :value="12" class="item">
                        <img src="@/assets/img/notice.png" alt="" />
                    </el-badge>
                </span>
            </el-popover>
            <!-- 上传作品 -->
            <el-button type="primary" round>
                <i class="el-icon-upload2"></i>
                上传作品
            </el-button>
            <!-- 游客执行注册或者登陆 -->
            <div class="custom" v-if="loginStatus">
                <span class="login">登录</span>
                <span class="register">注册</span>
            </div>
            <!-- 登陆后头像 -->
            <el-dropdown trigger="click" placement="bottom-start" v-else>
                <span class="user-logo">
                    <img src="@/static/img/位图_5.png" />
                    <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item icon="el-icon-plus">
                        我的作品
                    </el-dropdown-item>
                    <el-dropdown-item icon="el-icon-circle-plus">
                        我的关注
                    </el-dropdown-item>
                    <el-dropdown-item icon="el-icon-circle-plus-outline">
                        我的收藏
                    </el-dropdown-item>
                    <el-dropdown-item icon="el-icon-check">
                        个人资料
                    </el-dropdown-item>
                    <el-dropdown-item icon="el-icon-circle-check">
                        退出
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>
</template>

<script>
import header from './index'
export default header
</script>

<style lang="less" scoped>
@import url('./index.less');
</style>
