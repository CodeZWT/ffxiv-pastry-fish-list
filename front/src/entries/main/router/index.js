import Vue from 'vue'
import VueRouter from 'vue-router'
import MigrationPage from '../views/MigrationPage'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'ListPage',
    component: () =>
      import(
        /* webpackChunkName: "fish" */
        '../views/FishPage'
      ),
  },
  {
    path: '/wiki',
    name: 'WikiPage',
    component: () =>
      import(
        /* webpackChunkName: "wiki" */
        '../views/WikiPage'
      ),
  },
  { path: '/oceanFishing54', redirect: { name: 'OceanFishingPage54' } },
  {
    path: '/oceanFishing',
    name: 'OceanFishingPage54',
    component: () =>
      import(
        /* webpackChunkName: "oceanFishing54" */
        '../views/OceanFishingPage54'
      ),
  },
  {
    path: '/diadem',
    name: 'DiademPage',
    component: () =>
      import(
        /* webpackChunkName: "diadem" */
        '../views/DiademPage'
      ),
  },
  {
    path: '/aquarium',
    name: 'AquariumPage',
    component: () =>
      import(
        /* webpackChunkName: "aquarium" */
        '../views/AquariumPage'
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
