interface AuthUser {
  email: string;
}

interface LoginResponse {
  token: string;
}

const TOKEN_KEY = "token";
const API_URL = import.meta.env.VITE_API_URL;

export const auth = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  },

  removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  getAuthHeaders(): Record<string, string> {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  },

  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      this.setToken(data.token);
      return data;
    } else {
      throw new Error(data.message || "Login failed");
    }
  },

  async getCurrentUser(): Promise<AuthUser> {
    const token = this.getToken();
    if (!token) {
      throw new Error("No token found");
    }

    // For now, we'll decode the email from token or use a placeholder
    // Since the API doesn't seem to have a /me endpoint, we'll use the stored email
    const storedEmail = localStorage.getItem("user_email");
    if (storedEmail) {
      return { email: storedEmail };
    }

    throw new Error("User not found");
  },

  setUserEmail(email: string): void {
    localStorage.setItem("user_email", email);
  },

  logout(): void {
    this.removeToken();
    localStorage.removeItem("user_email");
  },
};

export type { AuthUser, LoginResponse };
