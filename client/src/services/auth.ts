const STORAGE_KEY = 'auth_token';
const USER_STORAGE_KEY = 'auth_user';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

class AuthService {
  /**
   * Save authentication token to localStorage
   */
  saveToken(token: string): void {
    localStorage.setItem(STORAGE_KEY, token);
  }

  /**
   * Get authentication token from localStorage
   */
  getToken(): string | null {
    return localStorage.getItem(STORAGE_KEY);
  }

  /**
   * Remove authentication token from localStorage
   */
  removeToken(): void {
    localStorage.removeItem(STORAGE_KEY);
  }

  /**
   * Save user info to localStorage
   */
  saveUser(user: User): void {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  }

  /**
   * Get user info from localStorage
   */
  getUser(): User | null {
    const userStr = localStorage.getItem(USER_STORAGE_KEY);
    if (!userStr) {
      return null;
    }
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  /**
   * Remove user info from localStorage
   */
  removeUser(): void {
    localStorage.removeItem(USER_STORAGE_KEY);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  /**
   * Logout - clear token and user info
   */
  logout(): void {
    this.removeToken();
    this.removeUser();
  }

  /**
   * Get Authorization header value
   */
  getAuthHeader(): string | null {
    const token = this.getToken();
    return token ? `Bearer ${token}` : null;
  }
}

export default new AuthService();
