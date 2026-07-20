import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { resetPassword } from "../services/authService";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await resetPassword(token, password);
      toast.success("Password reset! Please log in.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="glass rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-white text-center mb-6">Set a New Password</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="password" required minLength={6} placeholder="New password" className="input-field" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button disabled={loading} className="btn-primary w-full">{loading ? "Resetting..." : "Reset Password"}</button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
