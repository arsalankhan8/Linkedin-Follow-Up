// src/routes/ProtectedRoute.jsx
import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import api from "@/api/axiosInstance";

/**
 * Helper: decode JWT payload (no dependency)
 */
function getTokenPayload(token) {
  try {
    const b64 = token.split(".")[1];
    const json = atob(b64.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
}

export default function ProtectedRoute() {
  const location = useLocation();
  const [status, setStatus] = useState("checking"); // checking | ok | unauthorized

  useEffect(() => {
    let mounted = true;

    async function checkAuth() {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        if (mounted) setStatus("unauthorized");
        return;
      }

      const payload = getTokenPayload(token);
      const exp = payload?.exp ? payload.exp * 1000 : 0;
      const now = Date.now();

      // token is still valid
      if (exp && exp > now + 5000) {
        if (mounted) setStatus("ok");
        return;
      }

      // token expired (or very near expiry) -> attempt silent refresh
      try {
        const resp = await api.post("/api/auth/refresh", {}, { withCredentials: true });
        const newToken = resp.data.accessToken;
        if (newToken) {
          localStorage.setItem("accessToken", newToken);
          if (mounted) setStatus("ok");
          return;
        } else {
          if (mounted) setStatus("unauthorized");
        }
      } catch (err) {
        if (mounted) setStatus("unauthorized");
      }
    }

    checkAuth();

    return () => {
      mounted = false;
    };
  }, [location]);

  if (status === "checking") {
    // simple loading UI while we try refresh
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-sm text-slate-600">Checking authentication…</div>
      </div>
    );
  }

  if (status === "unauthorized") {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // authenticated
  return <Outlet />;
}
