import Vue from "vue";
import createApp from './app'

Vue.config.productionTip = false;

async function entry() {
  const { app } = await createApp()
  new Vue(app).$mount("#app");
}

entry()
