import {
	Module,
	VuexModule,
	getModule,
	Action,
	Mutation,
} from "vuex-module-decorators";

import store from "@/store/store";
import axios, { AxiosResponse } from "axios";
import { URL } from "@/utils/utils";
import { SocketModule } from "./Socket";
import { User as UserModel } from "@/interfaces/User";

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
	async getAuthUser(): Promise<AxiosResponse<UserModel> | null> {
		try {
			const response = await axios.get(`${URL}/auth/user`, {
				withCredentials: true,
			});
			this.setAuthUser(response.data);
			SocketModule.joinRoom(SocketModule.room);
			return response.data;
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
