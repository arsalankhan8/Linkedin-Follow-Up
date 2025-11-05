// src/App.jsx
import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/LoginForm.jsx";
import Register from "./pages/Register.jsx";
import VerifyEmail from "./pages/VerifyEmail.jsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";
import ResetPasswordPage from "./pages/ResetPasswordPage.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import DashboardLayout from "./components/layout/DashboardLayout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ProtectedRoute from "./routes/ProtectedRoute";
import { useUserStore } from "@/store/useUserStore";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ContactsPage from "./pages/ContactsPage.jsx";
import { Toaster } from "sonner";

export default function App() {
  const fetchUser = useUserStore((s) => s.fetchUser);

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

        {/* Protected + Layout */}

        <Route element={<ProtectedRoute />}>
          {/* Dashboard */}
          <Route
            path="/dashboard"
            element={
              <DashboardLayout
                title="Dashboard"
                onContactAdded={() => {
                  // trigger refresh in Dashboard via custom event
                  window.dispatchEvent(new Event("contactAdded"));
                }}
              >
                <Dashboard />
              </DashboardLayout>
            }
          />

          {/* Contacts */}
          <Route
            path="/contacts"
            element={
              <DashboardLayout
                title="Contacts Dashboard"
                onContactAdded={() => {
                  // ✅ trigger global refresh event
                  window.dispatchEvent(new Event("contactAdded"));
                }}
                action={
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-1" /> Add Contact
                  </Button>
                }
              >
                <ContactsPage />
              </DashboardLayout>
            }
          />

        </Route>


      </Routes>
      <Toaster
        position="bottom-right"
        richColors
        closeButton
      />
    </Router>
  );
}