import Vue from 'vue'
import VueRouter from 'vue-router'
import MigrationPage from '@/views/MigrationPage'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'ListPage',
    component: () =>
      import(
        /* webpackChunkName: "fish" */
        '@/views/FishPage'
      ),
  },
  {
    path: '/wiki',
    name: 'WikiPage',
    component: () =>
      import(
        /* webpackChunkName: "wiki" */
        '@/views/WikiPage'
      ),
  },
  {
    path: '/migration',
    name: 'MigrationPage',
    component: MigrationPage,
  },
  // {
  //   path: "/about",
  //   name: "About",
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () =>
  //     import(/* webpackChunkName: "about" */ "../views/XXXX.vue")
  // }
]

const router = new VueRouter({
  // mode: 'history',
  routes,
})

export default router
