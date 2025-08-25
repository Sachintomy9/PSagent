import axios from 'axios';
import { refreshToken, getTokens } from './AuthService';

const API_URL = 'https://v1-api.propertyseller.com/api/v1/';

const api = axios.create({
  baseURL: API_URL,
});

// Request Interceptor: Add Authorization header
api.interceptors.request.use(
  async (config) => {
    const tokens = await getTokens();
    if (tokens?.accessToken) {
      config.headers.Authorization = `Bearer ${tokens.accessToken}`; 
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Refresh token on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    console.log("Refreshing accessTokens in ApiClient");
    if (
                (error.response?.status === 401 || error.response?.status === 403) &&
                !originalRequest._retry // prevent infinite loops
            ) {
      originalRequest._retry = true;
      
      const newAccessToken = await refreshToken();

      if (newAccessToken) {
        console.log("Successfully used new AccessToken");
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        // ⚠️ use `api` not `axios` to preserve interceptors
        return api(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
