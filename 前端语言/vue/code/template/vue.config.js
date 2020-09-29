module.exports = {
    css: {
        loaderOptions: {
            less: {
                globalVars: {
                    hack: `true; @import '~@/css/index.less';`
                }
            }
        }
    },
    chainWebpack: config => {
        console.log(config)
    }
}