import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";

import Home from "@/components/Home.vue";
import Chat from "@/components/Chat.vue";
import Register from "@/components/Register.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
  },
  {
    path: "/chat",
    name: "Chat",
    component: Chat,
  },
];

const router = new VueRouter({
  mode: "history",
  routes,
  linkActiveClass: "font-weight-bold",
  scrollBehavior(_, __, savedPosition) {
    return savedPosition ?? { x: 0, y: 0 };
  },
});

export default router;
