import Vue from 'vue';
import App from './App.vue';
import VueSocketIO from 'vue-socket.io';
import vuetify from './plugins/vuetify';
import router from '@/router';
import store from '@/store/store';

Vue.config.productionTip = false;

Vue.use(
	new VueSocketIO({
		debug: true,
		connection: 'http://localhost:8080',
		vuex: {
			store,
			actionPrefix: 'SOCKET_',
			mutationPrefix: 'SOCKET_',
		},
	})
);

new Vue({
	router,
	store,
	vuetify,
	render: h => h(App),
}).$mount('#app');
