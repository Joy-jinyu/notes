import VueRouter, { NavigationGuardNext, Route, RouteConfig } from "vue-router";
import { VueConstructor } from 'vue/types/umd';
import routeArray from './routes'

const router = async (Vue: VueConstructor): Promise<VueRouter> => {
  Vue.use(VueRouter);

  const routes = routeArray;

  const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes
  });

  router.beforeEach((to: Route, from: Route, next: NavigationGuardNext) => {
    next();
  });

  return router;
}

export default router

