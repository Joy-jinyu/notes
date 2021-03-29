module.exports = {
    css: {
        loaderOptions: {
            less: {
                globalVars: {
                    // 设置全局css参数
                    hack: `true; @import '~@/css/index.less';`
                }
            }
        }
    },
    chainWebpack: config => {}
}