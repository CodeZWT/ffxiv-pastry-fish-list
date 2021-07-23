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
    meta: {
      title: '鱼糕 - 钓鱼时钟',
      metaTags: [
        {
          name: 'title',
          property: 'og:title',
          content: '鱼糕 - 钓鱼时钟',
        },
        // {
        //   name: 'description',
        //   property: 'og:description',
        //   content: '钓鱼时钟，支持固定鱼，设置闹钟，支持按鱼饵，版本，等各种条件筛选。',
        // },
      ],
    },
  },
  {
    path: '/wiki',
    name: 'WikiPage',
    component: () =>
      import(
        /* webpackChunkName: "wiki" */
        '../views/WikiPage'
      ),
    meta: {
      title: '鱼糕 - 钓鱼图鉴',
      metaTags: [
        {
          name: 'title',
          property: 'og:title',
          content: '鱼糕 - 钓鱼图鉴',
        },
      ],
    },
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
    meta: {
      title: '鱼糕 - 海钓',
      metaTags: [
        {
          name: 'title',
          property: 'og:title',
          content: '鱼糕 - 海钓',
        },
      ],
    },
  },
  {
    path: '/diadem',
    name: 'DiademPage',
    component: () =>
      import(
        /* webpackChunkName: "diadem" */
        '../views/DiademPage'
      ),
    meta: {
      title: '鱼糕 - 云冠群岛',
      metaTags: [
        {
          name: 'title',
          property: 'og:title',
          content: '鱼糕 - 云冠群岛',
        },
      ],
    },
  },
  {
    path: '/aquarium',
    name: 'AquariumPage',
    component: () =>
      import(
        /* webpackChunkName: "aquarium" */
        '../views/AquariumPage'
      ),
    meta: {
      title: '鱼糕 - 水族馆',
      metaTags: [
        {
          name: 'title',
          property: 'og:title',
          content: '鱼糕 - 水族馆',
        },
      ],
    },
  },
  {
    path: '/competition',
    name: 'CompetitionPage',
    component: () =>
      import(
        /* webpackChunkName: "competition" */
        '../views/CompetitionPage'
      ),
    meta: {
      title: '鱼糕 - 光之渔夫钓鱼大赛',
      metaTags: [
        {
          name: 'title',
          property: 'og:title',
          content: '鱼糕 - 光之渔夫钓鱼大赛',
        },
      ],
    },
  },
  {
    path: '/record',
    name: 'RecordPage',
    component: () =>
      import(
        /* webpackChunkName: "record" */
        '../views/RecordPage'
      ),
    meta: {
      title: '鱼糕 - 数据统计（内侧）',
      metaTags: [
        {
          name: 'title',
          property: 'og:title',
          content: '鱼糕 - 数据统计（内侧）',
        },
      ],
    },
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
