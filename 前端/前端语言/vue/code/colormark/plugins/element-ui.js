import Element from 'element-ui'
import locale from 'element-ui/lib/locale/lang/en'

const element = {
    install(Vue) {
        Vue.use(Element, { locale })
    }
}

export default element
