import api from "./api";
import toast from "react-hot-toast";

const authService = {

  // =============================
  // LOGIN
  // =============================
  login: async (credentials) => {
    try {
      console.log("🔐 Login attempt:", credentials.email);

      const response = await api.post("/auth/login", credentials);

      if (response.data && response.data.token) {

        const token = response.data.token;
        const user = response.data.user;

        localStorage.setItem("adminToken", token);
        localStorage.setItem("adminUser", JSON.stringify(user));

        toast.success("Login successful!");

        return response.data;
      }

      throw new Error("Invalid response from server");

    } catch (error) {
      console.error("❌ Login error:", error);

      const message =
        error.response?.data?.message ||
        error.message ||
        "Login failed";

      toast.error(message);

      throw error;
    }
  },

  // =============================
  // LOGOUT
  // =============================
  logout: () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");

    toast.success("Logged out successfully");

    window.location.href = "/login";
  },

  // =============================
  // GET CURRENT USER
  // =============================
  getCurrentUser: () => {
    try {
      const user = localStorage.getItem("adminUser");
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error("Error reading user:", error);
      return null;
    }
  },

  // =============================
  // CHECK AUTH
  // =============================
  isAuthenticated: () => {
    const token = localStorage.getItem("adminToken");
    return !!token;
  },

  // =============================
  // VERIFY TOKEN
  // =============================
  verifyToken: async () => {
    try {
      const response = await api.get("/auth/verify");
      return response.data;
    } catch (error) {
      console.error("Token verification failed:", error);

      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");

      return { valid: false };
    }
  }
};

export default authService;