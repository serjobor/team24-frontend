import axios from "axios";

// адрес бека
export const API_URL = `http://team24.innoca.local:8080/api/v1`;

const $api = axios.create({
  withCredentials: true,
  baseURL: API_URL
});

// $api.interceptors.request.use((config) => {
//     config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
//     return config;
// });

$api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  config.headers = config.headers ?? {};
  if (token) {
    (config.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  } else {
    delete (config.headers as Record<string, string>)['Authorization'];
  }
  return config;
});

$api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Попытка обновить токен или редирект на логин
      localStorage.removeItem('token');
      window.location.href = `/auth`;
    }
    return Promise.reject(error);
  }
);

export default $api;