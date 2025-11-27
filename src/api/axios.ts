import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 10000,
});

// REQUEST Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// RESPONSE Interceptor
axiosInstance.interceptors.response.use(
  (response) => response, // Pass through successful responses
  (error) => {
    // Handle 401 Unauthorized - auto-logout and redirect
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login"; // Full page redirect to avoid state issues
    }
    // Pass through other errors to be handled by components
    return Promise.reject(error);
  }
);

export default axiosInstance;
