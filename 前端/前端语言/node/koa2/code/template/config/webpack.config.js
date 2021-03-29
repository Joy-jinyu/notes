const webpack = require('webpack')
const path = require('path')

module.exports = {
    entry: {
        main: [
            'webpack-hot-middleware/client?noInfo=true&reload=true', // 生产环境的入口建议把这个去掉
            './build/index.js'
        ]
    },
    output:{
        filename: 'bundle.[name].js',
        path: path.resolve(__dirname, "./build/src"),
        publicPath: '/dist/'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]
}