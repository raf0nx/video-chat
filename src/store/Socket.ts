import {
	Module,
	VuexModule,
	getModule,
	Action,
	Mutation,
} from 'vuex-module-decorators';

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

	@Mutation
	private SET_ROOMS(rooms: []): void {
		this.rooms = rooms;
	}

	@Mutation
	private JOIN_ROOM({
		username,
		room,
	}: {
		username: string;
		room: string;
	}): void {
		this.username = username;
		this.room = room;
	}

	@Action
	setRooms(rooms: []): void {
		this.SET_ROOMS(rooms);
	}

	@Action
	joinRoom(payload: { username: string; room: string }): void {
		this.JOIN_ROOM(payload);
	}
}

export const SocketModule = getModule(Socket);
