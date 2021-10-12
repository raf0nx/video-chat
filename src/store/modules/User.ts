import {
  Module,
  VuexModule,
  getModule,
  Action,
  Mutation,
} from "vuex-module-decorators";

import store from "@/store/store";
import { SocketModule } from "./Socket";
import { User as UserModel } from "@/interfaces/User";
import { AuthService } from "@/services/AuthService";
import { Status } from "@/enums/Status";

export interface UserState {
  authUser: UserModel | null;
  status: string;
}

@Module({ dynamic: true, store, name: "user" })
class User extends VuexModule implements UserState {
  authUser: UserModel | null = null;
  status = Status.AVAILABLE;

  get username(): string | null {
    return this.authUser && this.authUser.name;
  }

  @Mutation
  private SET_AUTH_USER(user: UserModel | null): void {
    this.authUser = user;
  }

  @Mutation
  private CHANGE_STATUS(): void {
    switch (this.status) {
      case Status.AVAILABLE:
        this.status = Status.AWAY;
        break;
      case Status.AWAY:
        this.status = Status.UNAVAILABLE;
        break;
      case Status.UNAVAILABLE:
        this.status = Status.AVAILABLE;
        break;
    }
  }

  @Action
  setAuthUser(user: UserModel | null): void {
    this.SET_AUTH_USER(user);
  }

  @Action
  async getAuthUser(): Promise<UserModel | null> {
    try {
      const { data: authUser } = await AuthService.getAuthUser();
      this.setAuthUser(authUser);
      SocketModule.joinRoom(SocketModule.room);
      return authUser;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  @Action
  changeStatus(): void {
    this.CHANGE_STATUS();
  }
}

export const UserModule = getModule(User);
