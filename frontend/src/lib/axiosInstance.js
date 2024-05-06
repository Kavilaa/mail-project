import axios from "axios";

// Define the base URL using an environment variable
const baseURL = import.meta.env.VITE_EXPRESS_URL;

// Create an Axios instance with the correct base URL and credentials configuration
const axiosInstance = axios.create({
  baseURL: baseURL,
  withCredentials: true, // Send cookies with requests and responses
});

// Add an interceptor to handle unauthorized errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle 401 Unauthorized errors
      console.error("Unauthorized access. Redirecting to login page.");
      window.location.href = "/login"; // Redirect user to login page
    }
    return Promise.reject(error);
  }
);

export { axiosInstance };
