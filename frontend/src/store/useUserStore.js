import { create } from "zustand";
import api from "@/api/axiosInstance";

export const useUserStore = create((set) => ({
  user: null,
  loading: true,

  // Save user after login
  setUser: (user) => set({ user, loading: false }),

  // Logout: clear state + storage
  logout: () => {
    localStorage.removeItem("accessToken");
    set({ user: null });
  },

  // Load user from /me (on page refresh)
  fetchUser: async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return set({ loading: false });

      const res = await api.get("/api/auth/me");
      set({ user: res.data.user, loading: false });
    } catch (err) {
      set({ user: null, loading: false });
    }
  },
}));
