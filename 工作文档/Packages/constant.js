// 安装模块，将其挂载在Vue实例上
const ConstantServer = {
    install: (Vue) => {
        Vue.prototype.$constant = loadData()
    }
}

const loadData = function () {
    const constants = {}
    const dictionaryModules = require.context('./data', true, /\.js$/)
    dictionaryModules.keys().forEach((fileName) => {
        const module = dictionaryModules(fileName)
        let moduleName = fileName.match(/\.\/(\S*)\.js/)[1] || ''
        moduleName = moduleName.toLocaleUpperCase()
        Object.keys(module).forEach((constant) => {
            constants[`${moduleName}_${constant}`] = module[constant]
        })
    })
    return constants
}

export default ConstantServer
