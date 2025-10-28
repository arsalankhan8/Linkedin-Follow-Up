// src/pages/VerifyEmail.jsx
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import OTPVerification from "../components/OTPVerification";

export default function VerifyEmail() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Optional: pass email from registration page via state
  const emailFromState = location.state?.email || "";
  
  const [email] = useState(emailFromState);
  const [verified, setVerified] = useState(false);

  const handleVerified = () => {
    setVerified(true);
    // Redirect to login page after 2 seconds
    setTimeout(() => navigate("/login"), 2000);
  };

  if (!email) {
    return (
      <p className="text-red-500 text-center mt-10">
        No email provided. Please register first.
      </p>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      {!verified ? (
        <OTPVerification email={email} onVerified={handleVerified} />
      ) : (
        <p className="text-green-600 text-center mt-4">
          Email verified successfully! Redirecting to login...
        </p>
      )}
    </div>
  );
}
