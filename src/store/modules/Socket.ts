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
  room = "";

  @Mutation
  private JOIN_ROOM(room: string): void {
    this.room = room;
  }

  @Action
  joinRoom(room: string): void {
    this.JOIN_ROOM(room);
  }
}

export const SocketModule = getModule(Socket);
