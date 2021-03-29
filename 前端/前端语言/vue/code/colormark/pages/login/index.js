export default {
    name: 'Login',
    data() {
        return {
            telephone: '', //电话号码
            password: '', //密码
            verify: '', //验证码
            agree: '', //是否同意协议

            actionType: '', //操作方式
            loginType: '', //登录方式
            socialItems: [{
                src: require('@/static/img/login/wechat.png'),
                alt: '微信'
            }, {
                src: require('@/static/img/login/qq.png'),
                alt: 'QQ'
            }] //
        }
    },
    methods: {
        // 发送验证码
        sentVerify() {
            console.log("发送验证码")
        },
        // 切换操作方式
        switchAction(action) {
            this.actionType = action
        },
        // 切换登录方式
        handleClick(tab, event) {
            console.log(tab, event)
        },
        // 节点关键字
        vnodeKey(name, index) {
            return name + index
        }
    }
}