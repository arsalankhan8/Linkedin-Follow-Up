import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/auth`,
  headers: { "Content-Type": "application/json" },
});

export const registerUser = (data) => API.post("/register", data);
export const loginUser = (data) => API.post("/login", data);
export const googleLogin = (data) => API.post("/google-login", data);
export const sendOtp = (data) => API.post("/resend-otp", data); 
export const verifyOtp = (data) => API.post("/verify-otp", data);
export const forgotPassword = (data) => API.post("/forgot-password", data);
export const resetPassword = (data) => API.post("/reset-password", data);
