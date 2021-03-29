
import Vue from 'vue'
import { CreateElement } from 'vue/types/umd';
import App from "./App.vue";
import createRouter from "./router";
import createStore from "./store";
import boot from "./boot/index";

export default async function () {
    const store = await createStore(Vue)

    const router = await createRouter(Vue)

    await boot(Vue)

    const app = {
        store,
        router,
        render: (h: CreateElement) => h(App)
    }

    return {
        app,
        store,
        router
    }
}