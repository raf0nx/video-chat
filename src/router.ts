import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';

import Dashboard from '@/components/Dashboard.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
	{
		path: '/',
		name: 'Dashboard',
		component: Dashboard,
	},
];

const router = new VueRouter({
	mode: 'history',
	routes,
	linkActiveClass: 'font-weight-bold',
	scrollBehavior(_, __, savedPosition) {
		return savedPosition ?? { x: 0, y: 0 };
	},
});

export default router;
