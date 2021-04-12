const component = {
    install(Vue) {
        /**
         * @params1 遍历的文件目录
         * @params2 是否遍历该目录下的子目录
         * @params3 遍历文件的格式
         */
        const components = require.context(
            '@/components/global/',
            false,
            /.vue$/
        )
        components.keys().forEach((component) => {
            const componentContext = components(component)

            const componentInstance =
                componentContext.default || componentContext

            const componentName = `color-${componentInstance.name}`.toLocaleLowerCase()

            Vue.component(componentName, componentInstance)
        })
    }
}

export default component
