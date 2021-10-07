import {
  Module,
  VuexModule,
  getModule,
  Action,
  Mutation,
} from "vuex-module-decorators";

import store from "@/store/store";
import { Status } from "@/enums/Status";
import { Room } from "@/interfaces/Room";

export interface SocketState {
  room: string;
  status: Status;
  rooms: Room[];
}

@Module({ dynamic: true, store, name: "socket" })
class Socket extends VuexModule implements SocketState {
  status = Status.AVAILABLE;
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

  @Action
  changeStatus(): void {
    this.CHANGE_STATUS();
  }
}

export const SocketModule = getModule(Socket);
