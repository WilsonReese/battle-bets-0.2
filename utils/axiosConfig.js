import axios from 'axios';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext'; // Import your Auth context

// Create an Axios instance -- I am not sure how this work????
const api = axios.create({
  baseURL: process.env.API_BASE_URL || 'YOUR_API_BASE_URL', // Add your API base URL here
});

// Axios request interceptor to automatically add JWT token to requests
export const useAxiosWithAuth = () => {
  const { token } = useContext(AuthContext);

  useEffect(() => {
    // Add request interceptor
    const requestInterceptor = api.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`; // Attach token to Authorization header
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Cleanup the interceptor when the component using it unmounts
    return () => {
      api.interceptors.request.eject(requestInterceptor);
    };
  }, [token]);

  return api;
};

export default api;
