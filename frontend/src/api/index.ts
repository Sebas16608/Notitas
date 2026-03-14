import type { AuthResponse, RefreshResponse, Notita } from "./types";

const API_URL = "http://localhost:3000";

class ApiService {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  setTokens(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  }

  clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }

  getAccessToken() {
    if (!this.accessToken) {
      this.accessToken = localStorage.getItem("accessToken");
    }
    return this.accessToken;
  }

  getRefreshToken() {
    if (!this.refreshToken) {
      this.refreshToken = localStorage.getItem("refreshToken");
    }
    return this.refreshToken;
  }

  private async refreshAccessToken(): Promise<boolean> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) return false;

    try {
      const res = await fetch(`${API_URL}/users/refresh-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (!res.ok) return false;

      const data: RefreshResponse = await res.json();
      this.accessToken = data.accessToken;
      localStorage.setItem("accessToken", data.accessToken);
      return true;
    } catch {
      return false;
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit,
    retry = true
  ): Promise<T> {
    const token = this.getAccessToken();
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    const res = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (res.status === 401 && retry) {
      const refreshed = await this.refreshAccessToken();
      if (refreshed) {
        return this.request(endpoint, options, false);
      }
      this.clearTokens();
      throw new Error("Unauthorized");
    }

    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: "Request failed" }));
      throw new Error(error.error || "Request failed");
    }

    return res.json();
  }

  async register(name: string, email: string, password: string) {
    const data = await this.request<AuthResponse>("/users/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
    this.setTokens(data.accessToken, data.refreshToken);
    return data;
  }

  async login(email: string, password: string) {
    const data = await this.request<AuthResponse>("/users/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    this.setTokens(data.accessToken, data.refreshToken);
    return data;
  }

  logout() {
    this.clearTokens();
  }

  async getUsers() {
    return this.request<{ users: any[] }>("/users", { method: "GET" });
  }

  async getNotitas() {
    return this.request<{ notitas: Notita[] }>("/notitas", { method: "GET" });
  }

  async createNotita(title: string, content: string) {
    return this.request<{ notita: Notita }>("/notitas", {
      method: "POST",
      body: JSON.stringify({ title, content }),
    });
  }

  async updateNotita(id: number, title: string, content: string) {
    return this.request<{ notita: Notita }>(`/notitas/${id}`, {
      method: "PUT",
      body: JSON.stringify({ title, content }),
    });
  }

  async deleteNotita(id: number) {
    return this.request<{ message: string }>(`/notitas/${id}`, {
      method: "DELETE",
    });
  }
}

export const api = new ApiService();
