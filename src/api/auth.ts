import axios from 'axios';
import { UserCredentials } from '../types/user';

const API_URL = 'http://localhost/api';

export const authService = {
  login: async (credentials: UserCredentials) => {
    const response = await axios.post(`${API_URL}/login`, credentials);
    return response.data;
  },

  register: async (userData: UserCredentials) => {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  },

  logout: async () => {
    const response = await axios.post(`${API_URL}/logout`);
    return response.data;
  }
};

export default authService;
