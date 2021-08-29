import {
	Module,
	VuexModule,
	Mutation,
	Action,
	getModule,
} from 'vuex-module-decorators';

import store from '@/store/store';

export interface SocketState {
	room: string;
	username: string;
	status: string;
	rooms: { id: number; name: string }[];
}

@Module({ dynamic: true, store, name: 'socket' })
class Socket extends VuexModule implements SocketState {
	room = '';
	username = '';
	status = '';
	rooms = [];
}

export const SocketModule = getModule(Socket);
