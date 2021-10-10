import { User } from "@/interfaces/User";
import axios, { AxiosResponse } from "axios";

class UserServiceClass {
  private readonly USER_ENDPOINT_PREFIX = `${URL}/users`;

  getUsers(): Promise<AxiosResponse<User[]>> {
    return axios.get(`${this.USER_ENDPOINT_PREFIX}`);
  }

  getUser(id: number): Promise<AxiosResponse<User>> {
    return axios.get(`${this.USER_ENDPOINT_PREFIX}/${id}`);
  }

  editUser(user: User): Promise<AxiosResponse<User>> {
    return axios.patch(`${this.USER_ENDPOINT_PREFIX}/${user.id}`);
  }

  deleteUser(id: number): Promise<AxiosResponse<void>> {
    return axios.delete(`${this.USER_ENDPOINT_PREFIX}/${id}`);
  }
}

export const UserService = new UserServiceClass();
