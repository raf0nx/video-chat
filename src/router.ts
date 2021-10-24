import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";

import Home from "@/components/Home.vue";
import Chat from "@/components/Chat.vue";
import Register from "@/components/Register.vue";
import Error from "@/components/Error.vue";
import SuccessPage from "@/components/SuccessPage.vue";
import { UserModule } from "./store/modules/User";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: { preventAuthUser: true },
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
    meta: { preventAuthUser: true },
  },
  {
    path: "/chat",
    name: "Chat",
    component: Chat,
    meta: { requiresAuth: true },
  },
  {
    path: "/auth/success",
    name: "AuthSuccess",
    component: SuccessPage,
  },
  {
    path: "/error",
    name: "Error",
		props: true,
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
	if (to.name === "Error") {
		next();
	}

	const authUser = UserModule.authUser || (await UserModule.getAuthUser());

  if (to.matched.some(record => record.meta.requiresAuth)) {
    authUser ? next() : next({ name: "Home" });
  } else if (to.matched.some(record => record.meta.preventAuthUser)) {
    authUser ? next({ name: "Chat" }) : next();
  } else {
    next();
  }
});

export default router;
