import { VueConstructor } from 'vue/types/umd'

const boot = async (Vue: VueConstructor) => {
    console.log(Vue)
}

export default boot