import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAuth from "../hooks/useAuth";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState("jobseeker");
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await register({ ...form, role });
      toast.success("Account created! Please check your email to verify.");
      navigate(role === "recruiter" ? "/recruiter" : "/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10">
      <div className="glass rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-white text-center mb-1">Create Your Account</h1>
        <p className="text-gray-500 text-center text-sm mb-6">Join Bangladesh's largest career platform</p>

        <div className="flex bg-dark-700 rounded-xl p-1 mb-6">
          <button
            onClick={() => setRole("jobseeker")}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
              role === "jobseeker" ? "bg-primary-500 text-white" : "text-gray-400"
            }`}
          >
            Job Seeker
          </button>
          <button
            onClick={() => setRole("recruiter")}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
              role === "recruiter" ? "bg-primary-500 text-white" : "text-gray-400"
            }`}
          >
            Recruiter
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Full Name</label>
            <input required className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Email</label>
            <input type="email" required className="input-field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Phone</label>
            <input className="input-field" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Password</label>
            <input type="password" required minLength={6} className="input-field" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          <button disabled={loading} className="btn-primary w-full">
            {loading ? "Creating account..." : `Sign Up as ${role === "jobseeker" ? "Job Seeker" : "Recruiter"}`}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-primary-400 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
