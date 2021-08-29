import Vue from 'vue';
import Vuex from 'vuex';
import { SocketState } from './Socket';

Vue.use(Vuex);

export interface RootState {
	socket: SocketState;
}

export default new Vuex.Store<RootState>({});
