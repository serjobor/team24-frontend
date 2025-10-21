import { makeAutoObservable, toJS } from "mobx";
import AuthService from "@services/AuthService";
//import { API_URL } from "@http";
//import axios from "axios";
//import type { AuthResponse } from "../types/AuthResponse";
//import $api from "@http";

export default class AuthStore {
  email = '';
  password = '';
  role = '';
  isAuth = false;

  constructor() {
    makeAutoObservable(this);
  }

  setAuth(bool: boolean) {
    this.isAuth = bool;
  }

  setEmail(email: string) {
    this.email = email;
  }

  setPassword(password: string) {
    this.password = password;
  }

  setRole(role: string) {
    this.role = role;
  }

  reset() {
    this.email = '';
    this.password = '';
    this.role = '';
    this.isAuth = false;
  }

  async login() {
    try {
      const response = await AuthService.login(this.email, this.password);
      // const response = {
      //   data: {
      //     accessToken: 'test accessToken',
      //     role: 'ADMIN'
      //   }
      // };
      console.log(toJS(response));
      localStorage.setItem('token', response.data.accessToken);
      // localStorage.setItem('accessToken', response.data.accessToken);
      // localStorage.setItem('refreshToken', response.data.refreshToken);
      this.setAuth(true);
      this.setRole(response.data.role);
    } catch (e :any) {
      console.log(e.response?.data?.message);
      throw e;
    }
  }

  async logout() {
    try {
      const response = await AuthService.logout();
      console.log(toJS(response));
      localStorage.removeItem('token');
      // localStorage.removeItem('accessToken');
      // localStorage.removeItem('refreshToken');
      this.reset();
    } catch (e :any) {
      console.log(e.response?.data?.message);
      throw e;
    }
  }
/*
  async checkAuth() {
     try {
       const response = await axios.put<AuthResponse>(`${API_URL}/auth`, null, {withCredentials: true});
       // const response = {
       //   data: {
       //     accessToken: 'test accessToken'
       //   }
       // };
       console.log(toJS(response));
       localStorage.setItem('token', response.data.accessToken);
       // localStorage.setItem('refreshToken', response.data.refreshToken);
       this.setAuth(true);
       this.setRole(response.data.role);
     } catch (e :any) {
       console.log(e.response?.data?.message);
       throw e;
     }
  }
*/
  /*async checkAuth() {
    try {
      const response = await $api.put<AuthResponse>('/auth');
      console.log(toJS(response));
      localStorage.setItem('token', response.data.accessToken);
      this.setAuth(true);
      this.setRole(response.data.role);
    } catch (e :any) {
      console.log(e.response?.data?.message);
      throw e;
    }
  }*/
};
