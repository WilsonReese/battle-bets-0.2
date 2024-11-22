import axios from 'axios';
import { useContext, useEffect } from 'react';
// import { AuthContext } from '../context/AuthContext'; // Import your Auth context
import { API_BASE_URL } from './api';
import { AuthContext } from '../components/contexts/AuthContext';

// Create an Axios instance -- I am not sure how this work????
const api = axios.create({
    baseURL: API_BASE_URL
});

// Axios request interceptor to automatically add JWT token to requests
export const useAxiosWithAuth = () => {
  const { token } = useContext(AuthContext);

  useEffect(() => {
    // Add request interceptor
    const requestInterceptor = api.interceptors.request.use(
      (config) => {
        if (token) {
          console.log("Attaching token:", token);
          config.headers.Authorization = `Bearer ${token}`; // Attach token to Authorization header
        } else {
          console.log("No token found, skipping Authorization header");
        }
        console.log("Final Axios Request Config:", config);
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
