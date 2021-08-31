import {
	Module,
	VuexModule,
	getModule,
	Action,
	Mutation,
} from 'vuex-module-decorators';
import axios from 'axios';

import store from '@/store/store';
import { Status } from '@/enums/Status';
import { URL } from '@/utils/URL';

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

	@Mutation
	private CHANGE_ROOM(room: string): void {
		this.room = room;
	}

	@Mutation
	private LEAVE_CHAT() {
		this.room = '';
		this.username = '';
	}

	@Action
	setRooms(rooms: []): void {
		this.SET_ROOMS(rooms);
	}

	@Action
	joinRoom(payload: { username: string; room: string }): void {
		this.JOIN_ROOM(payload);
	}

	@Action
	changeRoom(room: string): void {
		this.CHANGE_ROOM(room);
	}

	@Action
	async leaveChat(username: string): Promise<void> {
		try {
			await axios.post(`${URL}/auth/logout`, { username });
			this.LEAVE_CHAT();
		} catch (error) {
			console.error(error);
		}
	}
}

export const SocketModule = getModule(Socket);
