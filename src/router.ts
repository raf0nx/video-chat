import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";

import Home from "@/components/Home.vue";
import Chat from "@/components/Chat.vue";
import Register from "@/components/Register.vue";
import Error from "@/components/Error.vue";
import SuccessPage from "@/components/SuccessPage.vue";
import { UserModule } from "./store/User";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/auth/success",
    name: "AuthSuccess",
    component: SuccessPage,
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
    meta: { requiresAuth: true },
  },
  {
    path: "/error",
    name: "Error",
    component: Error,
  },
];

const router = new VueRouter({
  mode: "history",
  routes,
  linkActiveClass: "font-weight-bold",
  scrollBehavior(_, _2, savedPosition) {
    return savedPosition ?? { x: 0, y: 0 };
  },
});

router.beforeEach(async (to, _, next) => {
  const authUser = UserModule.authUser;

  if (to.matched.some(record => record.meta.requiresAuth)) {
    authUser || (await UserModule.getAuthUser())
      ? next()
      : next({ name: "Home" });
  } else {
    authUser && to.name === "Home" ? next({ name: "Chat" }) : next();
  }
});

export default router;
