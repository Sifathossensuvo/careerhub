import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { forgotPassword } from "../services/authService";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await forgotPassword(email);
      setSent(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="glass rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-white text-center mb-1">Forgot Password</h1>
        <p className="text-gray-500 text-center text-sm mb-6">We'll email you a reset link</p>

        {sent ? (
          <p className="text-center text-primary-400">If that email exists, a reset link has been sent. Please check your inbox.</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="email" required placeholder="you@example.com" className="input-field" value={email} onChange={(e) => setEmail(e.target.value)} />
            <button disabled={loading} className="btn-primary w-full">{loading ? "Sending..." : "Send Reset Link"}</button>
          </form>
        )}
        <p className="text-center text-sm text-gray-500 mt-6">
          <Link to="/login" className="text-primary-400 hover:underline">Back to login</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
