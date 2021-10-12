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

export interface UserState {
  authUser: UserModel | null;
}

@Module({ dynamic: true, store, name: "user" })
class User extends VuexModule implements UserState {
  authUser: UserModel | null = null;

  @Mutation
  private SET_AUTH_USER(user: UserModel | null): void {
    this.authUser = user;
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

  get username(): string | null {
    return this.authUser && this.authUser.name;
  }
}

export const UserModule = getModule(User);
