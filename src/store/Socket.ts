import { Module, VuexModule, getModule } from 'vuex-module-decorators';

import store from '@/store/store';
import { Status } from '@/enums/Status';

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
	status = Status.AVAILABLE;
	rooms = [];
}

export const SocketModule = getModule(Socket);
