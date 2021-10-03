import Screen from '../views/Screen'
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Screen',
    component: Screen,
  },
]

const router = new VueRouter({
  routes,
})

export default router
