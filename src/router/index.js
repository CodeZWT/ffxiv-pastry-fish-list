import Vue from "vue";
import VueRouter from "vue-router";
import FishList from "@/views/FishList";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "FishList",
    component: FishList
  }
  // {
  //   path: "/about",
  //   name: "About",
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () =>
  //     import(/* webpackChunkName: "about" */ "../views/XXXX.vue")
  // }
];

const router = new VueRouter({
  routes
});

export default router;
