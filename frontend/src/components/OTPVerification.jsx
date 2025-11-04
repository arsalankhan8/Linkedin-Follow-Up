// src/components/OTPVerification.jsx
import { useState } from "react";
import { verifyOtp } from "../api/auth";

export default function OTPVerification({ email, onVerified }) {
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
     await verifyOtp({ email, otp: token });

      setMessage("Email verified!");
      onVerified?.();
    } catch (err) {
      setMessage(err.response?.data?.message || "Verification failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Verify Email</h2>
      <input
        type="text"
        placeholder="Enter OTP"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
        required
      />
      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">Verify</button>
      {message && <p className="mt-2 text-red-500">{message}</p>}
    </form>
  );
}
