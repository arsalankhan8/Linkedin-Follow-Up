// src/pages/Register.jsx
import { useState } from "react";
import RegisterForm from "../components/RegisterForm";
import OTPVerification from "../components/OTPVerification";

export default function Register() {
  const [email, setEmail] = useState(null);
  const [verified, setVerified] = useState(false);

  return (
    <div className="mt-10">
      {!email && <RegisterForm onOtpSent={setEmail} />}
      {email && !verified && (
        <OTPVerification email={email} onVerified={() => setVerified(true)} />
      )}
      {verified && (
        <p className="text-green-600 text-center mt-4">
          Registration complete! You can now login.
        </p>
      )}
    </div>
  );
}
