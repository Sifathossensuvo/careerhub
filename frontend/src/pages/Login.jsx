import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import useAuth from "../hooks/useAuth";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(form.email, form.password);
      toast.success("Welcome back!");
      const dest = data.role === "admin" ? "/admin" : data.role === "recruiter" ? "/recruiter" : "/dashboard";
      navigate(location.state?.from || dest);
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="glass rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-white text-center mb-1">Welcome Back</h1>
        <p className="text-gray-500 text-center text-sm mb-6">Log in to continue your career journey</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Email</label>
            <input
              type="email"
              required
              className="input-field"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Password</label>
            <input
              type="password"
              required
              className="input-field"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <Link to="/forgot-password" className="text-xs text-primary-400 mt-1 inline-block hover:underline">
              Forgot password?
            </Link>
          </div>
          <button disabled={loading} className="btn-primary w-full">
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="text-primary-400 hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
