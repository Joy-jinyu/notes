import SingleDictionary from './instance'

const dictionaryInstance = () => {
    return SingleDictionary.getInstance()
}

// 安装模块，将其挂载在Vue实例上
const DictionaryServer = {
    install: (Vue, dictionaryData) => {
        const dictionary = SingleDictionary.getInstance(dictionaryData)
        Vue.prototype.$dictionary = dictionary
    }
}

export { dictionaryInstance, DictionaryServer }
