import { VueConstructor } from 'vue/types/umd'
import Vuex from "vuex"

const createStore = async (Vue: VueConstructor) => {
  Vue.use(Vuex)

  const store = new Vuex.Store({
    state: {},
    mutations: {},
    actions: {},
    modules: {}
  });
  return store
}

export default createStore
