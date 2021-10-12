import {
  Module,
  VuexModule,
  getModule,
  Action,
  Mutation,
} from "vuex-module-decorators";

import store from "@/store/store";
import { Room } from "@/interfaces/Room";

export interface SocketState {
  room: string;
  rooms: Room[];
}

@Module({ dynamic: true, store, name: "socket" })
class Socket extends VuexModule implements SocketState {
  rooms: Room[] = [
    { id: 1, name: "GENERAL" },
    { id: 2, name: "OFFICE" },
    { id: 3, name: "EXPERIMENTAL" },
  ];
  room = this.rooms[0].name;

  @Mutation
  private JOIN_ROOM(room: string): void {
    this.room = room;
  }

  @Mutation
  private CHANGE_ROOM(room: string): void {
    this.room = room;
  }

  @Mutation
  private LEAVE_CHAT() {
    this.room = "";
  }

  @Action
  joinRoom(room: string): void {
    this.JOIN_ROOM(room);
  }

  @Action
  changeRoom(room: string): void {
    this.CHANGE_ROOM(room);
  }

  @Action
  async leaveChat(): Promise<void> {
    this.LEAVE_CHAT();
  }
}

export const SocketModule = getModule(Socket);
