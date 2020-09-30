import { RouteConfig } from 'vue-router';
import { HOME } from './_home';
// component: () =>
//   import(/* webpackChunkName: "about" */ "../views/About.vue")

const routeArray: Array<RouteConfig> = [
    ...HOME
]

export default routeArray