import axios from "axios";
import toast from "react-hot-toast";

const API_URL = "http://localhost:5000/api";

console.log("🔌 API URL:", API_URL);

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// =======================
// REQUEST INTERCEPTOR
// =======================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log(
      `🚀 ${config.method?.toUpperCase()} ${config.url}`,
      config.data || config.params
    );

    return config;
  },
  (error) => Promise.reject(error)
);

// =======================
// RESPONSE INTERCEPTOR
// =======================
api.interceptors.response.use(
  (response) => {
    console.log(
      `✅ ${response.config.method?.toUpperCase()} ${response.config.url}`,
      response.data
    );
    return response;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      if (status === 401) {
        toast.error("Session expired. Please login again.");

        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");

        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      } else {
        toast.error(data?.message || "Something went wrong");
      }
    } else {
      toast.error("Server not reachable");
    }

    return Promise.reject(error);
  }
);

export default api;