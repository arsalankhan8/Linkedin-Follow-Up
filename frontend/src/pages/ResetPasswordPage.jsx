// src/pages/ResetPasswordPage.jsx
import { useParams } from "react-router-dom";
import ResetPassword from "../components/ResetPassword";

export default function ResetPasswordPage() {
  const { token } = useParams();

  if (!token) {
    return (
      <p className="text-red-500 text-center mt-10">
        Invalid or missing password reset link.
      </p>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <ResetPassword token={token} />
    </div>
  );
}
