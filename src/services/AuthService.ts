import axios, { AxiosResponse } from "axios";

import { URL } from "@/utils/utils";
import { RegisterData } from "@/interfaces/RegisterData";
import { User } from "@/interfaces/User";

class AuthServiceClass {
  private readonly AUTH_ENDPOINT_PREFIX = `${URL}/auth`;

  login({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<AxiosResponse<User>> {
    return axios.post(`${this.AUTH_ENDPOINT_PREFIX}/login`, {
      email,
      password,
    });
  }

  register({
    name,
    email,
    password,
    passwordConfirm,
  }: RegisterData): Promise<AxiosResponse<void>> {
    return axios.post(`${this.AUTH_ENDPOINT_PREFIX}/register`, {
      name,
      email,
      password,
      passwordConfirm,
    });
  }

  logout(): Promise<AxiosResponse<void>> {
    return axios.post(`${this.AUTH_ENDPOINT_PREFIX}/logout`);
  }

  getAuthUser(): Promise<AxiosResponse<User>> {
    return axios.get(`${this.AUTH_ENDPOINT_PREFIX}/user`);
  }
}

export const AuthService = new AuthServiceClass();
