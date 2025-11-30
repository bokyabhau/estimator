/**
 * Determine API base URL based on environment
 * In production: uses relative path (same domain as client)
 * In development: uses localhost with explicit port
 */
const getApiBaseUrl = (): string => {
  if (import.meta.env.VITE_NODE_ENV === 'production') {
    // In production, client and server are on the same domain
    return '/api';
  }
  // In development, server runs on port 3000
  return 'http://localhost:3000/api';
};

const API_BASE_URL = getApiBaseUrl();

// Import auth service for getting auth token
import authService from './auth';

interface CreateClientPayload {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  password: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

interface ApiResponse<T> {
  data: T;
  message?: string;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Add auth token if available
    const authHeader = authService.getAuthHeader();
    if (authHeader) {
      defaultHeaders['Authorization'] = authHeader;
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  }

  /**
   * Register a new client
   */
  async registerClient(payload: CreateClientPayload): Promise<ApiResponse<any>> {
    return this.request('/clients', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  /**
   * Login with email and password
   */
  async loginClient(payload: LoginPayload): Promise<LoginResponse> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  /**
   * Verify Google token and login user
   */
  async verifyGoogleToken(token: string): Promise<LoginResponse> {
    return this.request('/auth/google/verify', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }

  /**
   * Get all clients
   */
  async getAllClients(): Promise<ApiResponse<any>> {
    return this.request('/clients', {
      method: 'GET',
    });
  }

  /**
   * Get a specific client by ID
   */
  async getClientById(id: string): Promise<ApiResponse<any>> {
    return this.request(`/clients/${id}`, {
      method: 'GET',
    });
  }

  /**
   * Update a client
   */
  async updateClient(id: string, payload: Partial<CreateClientPayload>): Promise<ApiResponse<any>> {
    return this.request(`/clients/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  }

  /**
   * Delete a client
   */
  async deleteClient(id: string): Promise<void> {
    return this.request(`/clients/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Upload file for a client (stamp or logo)
   */
  async uploadClientFile(
    clientId: string,
    fileType: 'stamp' | 'logo',
    file: File,
  ): Promise<ApiResponse<any>> {
    const url = `${API_BASE_URL}/clients/${clientId}`;
    const formData = new FormData();
    formData.append(fileType, file);

    const authHeader = authService.getAuthHeader();
    const headers: HeadersInit = {};
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    const response = await fetch(url, {
      method: 'PATCH',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  }
}

export default new ApiService();
