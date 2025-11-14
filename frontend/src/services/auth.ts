import API from "./api";
import { User, AuthResponse, LoginData, RegisterData } from "../types";

export const authService = {
  async login(loginData: LoginData): Promise<AuthResponse> {
    const response = await API.post<AuthResponse>("/auth/login", loginData);
    return response.data;
  },

  async register(registerData: RegisterData): Promise<AuthResponse> {
    const response = await API.post<AuthResponse>(
      "/auth/register",
      registerData
    );
    return response.data;
  },

  logout(): void {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  },

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  getToken(): string | null {
    return localStorage.getItem("access_token");
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};
