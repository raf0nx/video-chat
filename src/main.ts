import Vue from 'vue';
import App from './App.vue';
import VueSocketIO from 'vue-socket.io';

import vuetify from './plugins/vuetify';
import router from '@/router';
import store from '@/store/store';
import { URL } from '@/utils/utils';

Vue.config.productionTip = false;

Vue.use(
	new VueSocketIO({
		debug: true,
		connection: `${URL}/chat`,
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
