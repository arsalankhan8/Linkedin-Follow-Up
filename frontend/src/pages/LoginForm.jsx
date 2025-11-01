// src/pages/Login.jsx
import { useState } from "react";
import LoginForm from "../components/LoginForm";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { googleLogin } from "../api/auth";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "@/store/useUserStore";
export default function Login() {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const setUser = useUserStore((s) => s.setUser);
  const handleGoogleLogin = async (credentialResponse) => {
    
    try {
      const { data } = await googleLogin({
        tokenId: credentialResponse.credential,
      });
      localStorage.setItem("accessToken", data.accessToken);
      
      setUser(data.user); 
      setMessage(`Welcome, ${data.user.email}`);
         navigate("/dashboard");  
    } catch (err) {
      setMessage(err.response?.data?.message || "Google login failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      {/* Email/Password login */}
      <LoginForm />
     <p className="text-center mt-4">
  <Link to="/forgot-password" className="text-blue-600 hover:underline">
    Forgot Password?
  </Link>
</p>
      {/* Divider */}
      <div className="flex items-center my-4">
        <hr className="flex-grow border-gray-300" />
        <span className="px-2 text-gray-500">or</span>
        <hr className="flex-grow border-gray-300" />
      </div>

      {/* Google login */}
<GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => setMessage("Google login failed")}
          />
        </div>
      </GoogleOAuthProvider>

      {/* Message display */}
      {message && <p className="mt-4 text-center text-red-500">{message}</p>}
    </div>
  );
}
