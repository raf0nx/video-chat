import {
  Module,
  VuexModule,
  getModule,
  Action,
  Mutation,
} from "vuex-module-decorators";
import axios from "axios";

import store from "@/store/store";
import { Status } from "@/enums/Status";
import { URL } from "@/utils/utils";
import { Room } from "@/interfaces/Room";

export interface SocketState {
  room: string;
  username: string;
  status: Status;
  rooms: Room[];
}

@Module({ dynamic: true, store, name: "socket" })
class Socket extends VuexModule implements SocketState {
  room = "";
  username = "";
  status = Status.AVAILABLE;
  rooms: Room[] = [];

  @Mutation
  private SET_ROOMS(rooms: Room[]): void {
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
    this.room = "";
    this.username = "";
  }

  @Mutation
  private CHANGE_STATUS(): void {
    let nextStatus: Status;

    switch (this.status) {
      case Status.AVAILABLE:
        nextStatus = Status.AWAY;
        break;
      case Status.AWAY:
        nextStatus = Status.UNAVAILABLE;
        break;
      case Status.UNAVAILABLE:
        nextStatus = Status.AVAILABLE;
        break;
    }

    this.status = nextStatus;
  }

  @Action
  setRooms(rooms: Room[]): void {
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
  async leaveChat(): Promise<void> {
    try {
      await axios.post(`${URL}/auth/logout`);
      this.LEAVE_CHAT();
    } catch (error) {
      console.error(error);
    }
  }

  @Action
  changeStatus(): void {
    this.CHANGE_STATUS();
  }
}

export const SocketModule = getModule(Socket);
