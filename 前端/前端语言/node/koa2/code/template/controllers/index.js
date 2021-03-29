const fs = require("fs"),
    createRouter = require('koa-router')

function addMapping(router, mapping) {
    for (let url in mapping) {
        if (url.startsWith('GET ')) {
            var path = url.substring(4)
            router.get(path, mapping[url])
            console.log(`register URL mapping: GET ${path}`);
        } else if (url.startsWith('POST ')) {
            var path = url.substring(5);
            router.post(path, mapping[url]);
            console.log(`register URL mapping: POST ${path}`);
        } else {
            console.log(`invalid URL: ${url}`);
        }
    }
}

function addControllers(router) {
    const controllefiles = fs.readdirSync(__dirname), // 查出当前目录所有文件
        js_files = controllefiles.filter((file) => file.endsWith('.js')) // 過濾出js的文件


        for (let file of js_files) {
            const mapping = require(`${__dirname}\\${file}`)
            addMapping(router, mapping)
        }
}

module.exports = function () {
    let router = createRouter()
    addControllers(router)
    return router.routes()
}