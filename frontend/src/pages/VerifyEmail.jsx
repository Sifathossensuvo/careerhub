import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";

const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState("verifying");

  useEffect(() => {
    api.get(`/auth/verify-email/${token}`)
      .then(() => setStatus("success"))
      .catch(() => setStatus("error"));
  }, [token]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      {status === "verifying" && <p className="text-gray-400">Verifying your email...</p>}
      {status === "success" && (
        <>
          <h1 className="text-2xl font-bold text-white mb-2">Email Verified ✓</h1>
          <p className="text-gray-400 mb-6">Your account is now verified.</p>
          <Link to="/login" className="btn-primary">Go to Login</Link>
        </>
      )}
      {status === "error" && (
        <>
          <h1 className="text-2xl font-bold text-white mb-2">Verification Failed</h1>
          <p className="text-gray-400 mb-6">This link is invalid or has expired.</p>
          <Link to="/" className="btn-primary">Go Home</Link>
        </>
      )}
    </div>
  );
};

export default VerifyEmail;
