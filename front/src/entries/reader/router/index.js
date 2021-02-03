import Vue from 'vue'
import VueRouter from 'vue-router'
import ReaderTimer from '../views/ReaderTimer'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'ReaderTimer',
    component: ReaderTimer,
  },
]

const router = new VueRouter({
  routes,
})

export default router
