import axios from 'axios';
import { useContext, useEffect } from 'react';
// import { AuthContext } from '../context/AuthContext'; // Import your Auth context
import { API_BASE_URL } from './api';
// import { AuthContext } from '../components/contexts/AuthContext';

// Create an Axios instance -- I am not sure how this work????
const api = axios.create({
    baseURL: API_BASE_URL
});

export default api;
