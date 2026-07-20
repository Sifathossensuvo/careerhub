import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMenu, FiX, FiBell, FiUser } from "react-icons/fi";
import useAuth from "../hooks/useAuth";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const dashboardPath =
    user?.role === "admin" ? "/admin" : user?.role === "recruiter" ? "/recruiter" : "/dashboard";

  return (
    <header className="sticky top-0 z-50 glass border-b border-white/5">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-extrabold text-xl text-white">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-sm">
            CH
          </span>
          CareerHub <span className="text-primary-400">BD</span>
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-300">
          <Link to="/jobs" className="hover:text-primary-400 transition">Find Jobs</Link>
          <Link to="/companies" className="hover:text-primary-400 transition">Companies</Link>
          <Link to="/pricing" className="hover:text-primary-400 transition">Pricing</Link>
          {user?.role === "recruiter" && (
            <Link to="/recruiter/post-job" className="hover:text-primary-400 transition">Post a Job</Link>
          )}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <Link to={`${dashboardPath}/notifications`} className="p-2 rounded-lg hover:bg-white/5 text-gray-300">
                <FiBell />
              </Link>
              <Link to={dashboardPath} className="flex items-center gap-2 text-sm text-gray-200 hover:text-primary-400">
                <FiUser />
                {user.name?.split(" ")[0]}
                {user.isPremium && <span className="badge bg-amber-500/20 text-amber-400">★ {user.premiumPlan}</span>}
              </Link>
              <button onClick={handleLogout} className="btn-secondary !py-2 !px-4 text-sm">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary !py-2 !px-4 text-sm">Login</Link>
              <Link to="/register" className="btn-primary !py-2 !px-4 text-sm">Sign Up Free</Link>
            </>
          )}
        </div>

        <button className="md:hidden text-gray-200 text-2xl" onClick={() => setOpen(!open)}>
          {open ? <FiX /> : <FiMenu />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden glass border-t border-white/5 px-4 py-4 space-y-3 text-gray-300">
          <Link to="/jobs" onClick={() => setOpen(false)} className="block">Find Jobs</Link>
          <Link to="/companies" onClick={() => setOpen(false)} className="block">Companies</Link>
          <Link to="/pricing" onClick={() => setOpen(false)} className="block">Pricing</Link>
          {user ? (
            <>
              <Link to={dashboardPath} onClick={() => setOpen(false)} className="block">Dashboard</Link>
              <button onClick={handleLogout} className="btn-secondary w-full">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setOpen(false)} className="btn-secondary block text-center">Login</Link>
              <Link to="/register" onClick={() => setOpen(false)} className="btn-primary block text-center">Sign Up Free</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
