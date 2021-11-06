import ReaderTimer from '../views/ReaderTimer'
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/timer',
    name: 'ReaderTimer',
    component: ReaderTimer,
  },
  {
    path: '/timerMini',
    name: 'ReaderTimerMini',
    component: ReaderTimer,
  },
  {
    path: '/setting',
    name: 'ReaderSetting',
    component: () =>
      import(
        /* webpackChunkName: "setting" */
        '../views/ReaderSetting'
      ),
  },
  {
    path: '/history',
    name: 'ReaderHistory',
    component: () =>
      import(
        /* webpackChunkName: "history" */
        '../views/ReaderHistory'
      ),
  },
  {
    path: '/spotStatistics',
    name: 'ReaderSpotStatistics',
    component: () =>
      import(
        /* webpackChunkName: "spotStatistics" */
        '../views/ReaderSpotStatistics'
      ),
  },
]

const router = new VueRouter({
  routes,
})

export default router
