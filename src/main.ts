import Vue from "vue";
import App from "./App.vue";
import VueSocketIO from "vue-socket.io";
import firebase from "firebase/compat/app";

import vuetify from "./plugins/vuetify";
import router from "@/router";
import store from "@/store/store";
import { URL } from "@/utils/utils";

const firebaseConfig = {
  apiKey: "AIzaSyDlrLrXnIi2t2hxT7tVpZ24I6-0gPnS_aw",
  authDomain: "videochatapp-1a9cf.firebaseapp.com",
  projectId: "videochatapp-1a9cf",
  storageBucket: "videochatapp-1a9cf.appspot.com",
  messagingSenderId: "237440825705",
  appId: "1:237440825705:web:1c51cfbb530b97dca0a5f8",
  measurementId: "G-HQT5049VFR",
};

firebase.initializeApp(firebaseConfig);

Vue.config.productionTip = false;

Vue.use(
  new VueSocketIO({
    debug: true,
    connection: `${URL}/chat`,
    vuex: {
      store,
      actionPrefix: "SOCKET_",
      mutationPrefix: "SOCKET_",
    },
  })
);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
}).$mount("#app");
