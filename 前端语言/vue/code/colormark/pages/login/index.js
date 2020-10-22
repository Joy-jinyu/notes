export default {
    name: 'Login',
    data() {
        return {
            telephone: '', //电话号码
            password: '', //密码
            verify: '', //验证码
            agree: '' //是否同意协议
        }
    },
    methods: {
        sentVerify() {
            console.log("发送验证码")
        }
    }
}