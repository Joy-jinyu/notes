<template>
    <div class="login-page">
        <div class="login-body">
            <div class="login-body__logo">
                <span class="logo">colormark</span>
                <p class="tips">灵感，</p>
                <p class="tips">一触即发。</p>
            </div>

            <!-- 注册账号 -->
            <div class="login-body__action" v-if="actionType === 'register'">
                <span class="action-title">注册账号</span>
                <!-- 手机号码 -->
                <div class="action-first">
                    <el-input
                        v-model="telephone"
                        placeholder="请输入您的手机号"
                    ></el-input>
                </div>

                <!-- 密码 -->
                <div class="action-content">
                    <el-input
                        v-model="password"
                        placeholder="请输入您的密码"
                    ></el-input>
                </div>

                <!-- 校验码 -->
                <div class="action-content">
                    <el-input v-model="verify" placeholder="请输入您的密码">
                        <template #append>
                            <span class="verify" @click="sentVerify()">
                                验证码
                            </span>
                        </template>
                    </el-input>
                </div>

                <!-- 协议 -->
                <el-checkbox v-model="agree" class="action-agree">
                    <span>
                        我已阅读并接受
                        <strong @click.prevent="sentVerify()">用户协议</strong>
                        和
                        <strong @click.prevent="sentVerify()">隐私政策</strong>
                    </span>
                </el-checkbox>

                <el-button type="primary">创建账号</el-button>

                <el-button @click="switchAction('login')">
                    已有账号，去登陆
                </el-button>
            </div>

            <!-- 登录 -->
            <div class="login-body__action" v-else>
                <div class="login-tabs">
                    <span class="active">密码登录</span>
                    <span>验证码登录</span>
                </div>

                <!-- 手机号码 -->
                <div class="action-first">
                    <el-input
                        v-model="telephone"
                        placeholder="请输入您的手机号"
                    ></el-input>
                </div>

                <!-- 密码 -->
                <div class="action-content">
                    <el-input
                        v-model="password"
                        placeholder="请输入您的密码"
                    ></el-input>
                </div>

                <!-- 协议 -->
                <el-checkbox v-model="agree" class="action-agree">
                    <span>忘记密码</span>
                </el-checkbox>

                <el-button type="primary">登录</el-button>

                <el-button @click="switchAction('register')">注册</el-button>

                <div class="social-login">
                    <span
                        class="social-item"
                        v-for="(social, index) of socialItems"
                        :key="vnodeKey('socail', index)"
                    >
                        <img :src="social.src" />
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import login from './index'
export default login
</script>

<style lang="less" scoped>
@import url('./index.less');
</style>
