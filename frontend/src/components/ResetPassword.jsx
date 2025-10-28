import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { resetPassword } from "../api/auth";

export default function ResetPassword({ token }) {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await resetPassword({ token, password });
      setMessage("Password reset successful! Redirecting to login...");

      // Redirect after 2 seconds
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Reset failed");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded shadow max-w-md mx-auto"
    >
      <h2 className="text-2xl font-bold mb-4">Reset Password</h2>

      <input
        type="password"
        placeholder="New Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
        required
      />

      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-2 rounded"
      >
        Reset Password
      </button>

      {message && (
        <p className="mt-2 text-center text-red-500">{message}</p>
      )}
    </form>
  );
}
