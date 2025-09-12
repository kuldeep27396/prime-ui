import api from './api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  company: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: {
    id: string;
    email: string;
    name: string;
    company_id: string;
    role: string;
  };
}

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const formData = new FormData();
    formData.append('username', credentials.email);
    formData.append('password', credentials.password);
    
    const response = await api.post('/api/v1/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    
    // Store token in localStorage
    localStorage.setItem('auth_token', response.data.access_token);
    
    return response.data;
  },

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post('/api/v1/auth/register', {
      email: userData.email,
      password: userData.password,
      name: userData.name,
      company_name: userData.company,
    });
    
    // Store token in localStorage
    localStorage.setItem('auth_token', response.data.access_token);
    
    return response.data;
  },

  async logout(): Promise<void> {
    localStorage.removeItem('auth_token');
  },

  async getCurrentUser() {
    const response = await api.get('/api/v1/auth/me');
    return response.data;
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  },

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  },
};