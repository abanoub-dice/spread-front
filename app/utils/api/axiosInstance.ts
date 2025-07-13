import axios from 'axios';

export interface ErrorResponse {
  message: string;
}

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

axiosInstance.interceptors.request.use(
  function (config: any) {
    if (!config.url?.includes('/login')) {
      const token = localStorage.getItem('token');
      config.headers.Authorization = token ? `Bearer ${JSON.parse(token)}` : '';
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);
axiosInstance.interceptors.response.use(
  (res: any) => {
    return res;
  },
  async (err: any) => {
    if (err.response) {
      // Access Token was expired
      if (err.response.status === 401 && !window.location.pathname.includes('/login')) {
        setTimeout(() => {
          window.location.href = '/dicer/login';
          localStorage.clear();
        }, 2000);
        return Promise.reject(err);
      }
      // if (err.response.status === 403) {
      // }

      // if (err.response.status === 500) {
      // }
      // if (err.response.status === 404) {
      // }
    }
    return Promise.reject(err);
  }
);

export default axiosInstance;
