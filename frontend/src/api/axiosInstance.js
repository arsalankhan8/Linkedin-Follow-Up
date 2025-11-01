// src/api/axiosInstance.js
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

/**
 * axios instance
 * - withCredentials: true so browser sends httpOnly refresh cookie
 * - baseURL: backend root
 */
const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

/**
 * Attach access token (if present) to Authorization header
 */
api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    // ignore
  }
  return config;
});

/**
 * Response interceptor: on 401 attempt refresh (once) then retry original request.
 * Uses a lock/queue so multiple parallel requests don't call refresh simultaneously.
 */
let isRefreshing = false;
let refreshQueue = [];

function processQueue(error, token = null) {
  refreshQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  refreshQueue = [];
}

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;
    // If no response or not 401 -> just reject
    if (!err.response || err.response.status !== 401) {
      return Promise.reject(err);
    }

    // Prevent infinite loop
    if (originalRequest._retry) {
      return Promise.reject(err);
    }
    originalRequest._retry = true;

    if (isRefreshing) {
      // Queue the request until refresh finishes
      return new Promise(function (resolve, reject) {
        refreshQueue.push({
          resolve: (token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          },
          reject,
        });
      });
    }

    isRefreshing = true;

    try {
      // call refresh endpoint (cookie will be sent because withCredentials = true)
      const refreshResp = await axios.post(
        `${API_BASE}/api/auth/refresh`,
        {},
        { withCredentials: true }
      );

      const newToken = refreshResp.data.accessToken;
      if (!newToken) throw new Error("No accessToken in refresh response");

      // store new token
      localStorage.setItem("accessToken", newToken);

      // process queued requests
      processQueue(null, newToken);

      // set header & retry original
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      // If refresh fails -> clear tokens and redirect to login (frontend should handle)
      localStorage.removeItem("accessToken");
      // optionally remove any other client state here
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
