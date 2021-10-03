import FishList from '@/entries/fish-v2/views/FishList'
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'FishList',
    component: FishList,
  },
]

const router = new VueRouter({
  routes,
})

export default router
