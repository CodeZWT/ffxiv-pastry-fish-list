import MigrationPage from '../views/MigrationPage'
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'HomePage',
    component: () =>
      import(
        /* webpackChunkName: "home" */
        '../views/HomePage'
      ),
    meta: {
      title: '鱼糕',
      metaTags: [
        {
          property: 'og:title',
          content: '鱼糕',
        },
      ],
    },
  },
  {
    path: '/list',
    name: 'ListPage',
    component: () =>
      import(
        /* webpackChunkName: "fish" */
        '../views/FishPage'
      ),
    meta: {
      title: '鱼糕 - 时钟列表',
      metaTags: [
        {
          property: 'og:title',
          content: '鱼糕 - 时钟列表',
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
    path: '/alarm',
    name: 'AlarmPage',
    component: () =>
      import(
        /* webpackChunkName: "alarm" */
        '../views/AlarmPage'
      ),
    meta: {
      title: '鱼糕 - 闹钟列表',
      metaTags: [
        {
          property: 'og:title',
          content: '鱼糕 - 闹钟列表',
        },
      ],
    },
  },
  {
    path: '/usage',
    name: 'UsagePage',
    component: () =>
      import(
        /* webpackChunkName: "usage" */
        '../views/UsagePage'
      ),
    meta: {
      title: '鱼糕 - 工票',
      metaTags: [
        {
          property: 'og:title',
          content: '鱼糕 - 工票',
        },
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
      title: '鱼糕 - 钓鱼笔记',
      metaTags: [
        {
          property: 'og:title',
          content: '鱼糕 - 钓鱼笔记',
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
      title: '鱼糕 - 数据统计（内测）',
      metaTags: [
        {
          property: 'og:title',
          content: '鱼糕 - 数据统计（内测）',
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

// This callback runs before every route change, including on page load.
router.beforeEach((to, from, next) => {
  // This goes through the matched routes from last to first, finding the closest route with a title.
  // e.g., if we have `/some/deep/nested/route` and `/some`, `/deep`, and `/nested` have titles,
  // `/nested`'s will be chosen.
  const nearestWithTitle = to.matched
    .slice()
    .reverse()
    .find(r => r.meta && r.meta.title)

  // Find the nearest route element with meta tags.
  const nearestWithMeta = to.matched
    .slice()
    .reverse()
    .find(r => r.meta && r.meta.metaTags)

  const previousNearestWithMeta = from.matched
    .slice()
    .reverse()
    .find(r => r.meta && r.meta.metaTags)

  // If a route with a title was found, set the document (page) title to that value.
  if (nearestWithTitle) {
    document.title = nearestWithTitle.meta.title
  } else if (previousNearestWithMeta) {
    document.title = previousNearestWithMeta.meta.title
  }

  // Remove any stale meta tags from the document using the key attribute we set below.
  Array.from(document.querySelectorAll('[data-vue-router-controlled]')).map(el =>
    el.parentNode.removeChild(el)
  )

  // Skip rendering meta tags if there are none.
  if (!nearestWithMeta) return next()

  // Turn the meta tag definitions into actual elements in the head.
  nearestWithMeta.meta.metaTags
    .map(tagDef => {
      const tag = document.createElement('meta')

      Object.keys(tagDef).forEach(key => {
        tag.setAttribute(key, tagDef[key])
      })

      // We use this to track which meta tags we create so we don't interfere with other ones.
      tag.setAttribute('data-vue-router-controlled', '')

      return tag
    })
    // Add the meta tags to the document head.
    .forEach(tag => document.head.appendChild(tag))

  next()
})

export default router
