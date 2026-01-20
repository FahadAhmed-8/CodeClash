import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL;

const instance = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api/users`
});

export const registerUser = (data) => instance.post('/register', data);
export const loginUser = (data) => instance.post('/login', data);

export const getCurrentUser = () => {
  const token = localStorage.getItem("token");
  return instance.get('/me', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};