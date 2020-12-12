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
    path: '/oceanFishing',
    name: 'OceanFishingPage',
    component: () =>
      import(
        /* webpackChunkName: "oceanFishing" */
        '@/views/OceanFishingPage'
      ),
  },
  {
    path: '/migration',
    name: 'MigrationPage',
    component: MigrationPage,
  },
]

const router = new VueRouter({
  // mode: 'history',
  routes,
})

export default router
