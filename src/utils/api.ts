const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const api = {
  async testConnection() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return await response.json();
    } catch (error) {
      console.error('API connection failed:', error);
      throw error;
    }
  },

  async getRoot() {
    try {
      const response = await fetch(`${API_BASE_URL}/`);
      return await response.json();
    } catch (error) {
      console.error('API root failed:', error);
      throw error;
    }
  }
};