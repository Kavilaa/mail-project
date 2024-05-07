import axios from "axios";

const baseURL = import.meta.env.VITE_EXPRESS_URL;

const axiosInstance = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("Unauthorized access. Redirecting to login page.");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export { axiosInstance };
