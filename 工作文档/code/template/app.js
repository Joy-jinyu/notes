const Koa = require('koa'),
    cors = require('koa2-cors'),
    KoaParser = require('koa-bodyparser'),
    createController = require('./controllers/index'),
    webpack = require('webpack'),
    webpackDevMiddleware = require('koa-webpack-dev-middleware'),
    webpackHotMiddleware = require('koa-webpack-hot-middleware'),
    webpackConfig = require('./config/webpack.config'),
    compiler = webpack(webpackConfig)

const app = new Koa(),
    parser = KoaParser(),
    routes = createController()

app.use(webpackDevMiddleware(compiler, {
    watchOptions: {
        ignored: /node_modules/,
    },
    reload: true,
    publicPath: webpackConfig.output.publicPath,
    hot: true,
    noInfo: false,
    inline: true,
    stats: {
        cached: false,
        colors: true
    }
}))

app.use(webpackHotMiddleware(compiler))
/**
 * 中间件的演示，可忽略
 */
app.use(async (ctx, next) => {
    /**
     * 为什么要调用await next()？
     * 原因是koa把很多async函数组成一个处理链，每个async函数都可以做一些自己的事情，然后用await next()来调用下一个async函数。我们把每个async函数称为middleware，这些middleware可以组合起来，完成很多有用的功能。
     */
    await next()
})

app.use(cors())
app.use(parser)
app.use(routes)

app.listen(3000)
console.log('program has start on 3000')