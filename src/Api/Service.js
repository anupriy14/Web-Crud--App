import axios from 'axios';

// Create a  Axios instance with custom configuration
const API = axios.create({
  baseURL: 'http://localhost:5000', // Centralized Server URL
  timeout: 5000,                   
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Network Layer Exception:', error);
    return Promise.reject(error);
  }
);

export default API;