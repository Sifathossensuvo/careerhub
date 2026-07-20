import { useEffect, useState } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { FiBriefcase, FiBookmark, FiUser, FiCreditCard, FiBell, FiActivity } from "react-icons/fi";
import useAuth from "../hooks/useAuth";
import { fetchMyApplications } from "../services/applicationService";
import { fetchSavedJobsList } from "../services/dashboardHelpers";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import JobCard from "../components/JobCard";
import Profile from "./Profile";
import PaymentHistory from "./PaymentHistory";
import Notifications from "./Notifications";

const NAV = [
  { to: "", label: "Applied Jobs", icon: <FiBriefcase />, end: true },
  { to: "saved", label: "Saved Jobs", icon: <FiBookmark /> },
  { to: "profile", label: "Profile & Resume", icon: <FiUser /> },
  { to: "payments", label: "Subscription", icon: <FiCreditCard /> },
  { to: "notifications", label: "Notifications", icon: <FiBell /> },
];

const STATUS_COLORS = {
  applied: "bg-blue-500/15 text-blue-400",
  viewed: "bg-purple-500/15 text-purple-400",
  shortlisted: "bg-amber-500/15 text-amber-400",
  rejected: "bg-rose-500/15 text-rose-400",
  hired: "bg-primary-500/15 text-primary-400",
};

const Dashboard = () => {
  const { user } = useAuth();
  const location = useLocation();
  const base = "/dashboard";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid md:grid-cols-4 gap-6">
      <aside className="glass rounded-2xl p-5 h-fit">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-400 font-bold text-lg">
            {user?.name?.[0]}
          </div>
          <div>
            <p className="font-semibold text-white text-sm">{user?.name}</p>
            {user?.isPremium ? (
              <span className="badge bg-amber-500/20 text-amber-400 capitalize">★ {user.premiumPlan}</span>
            ) : (
              <span className="badge bg-dark-600 text-gray-400">Free Plan</span>
            )}
          </div>
        </div>
        <nav className="space-y-1">
          {NAV.map((item) => {
            const path = `${base}/${item.to}`;
            const active = item.end ? location.pathname === base || location.pathname === `${base}/` : location.pathname.startsWith(path);
            return (
              <Link
                key={item.to}
                to={path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition ${
                  active ? "bg-primary-500/15 text-primary-400" : "text-gray-400 hover:bg-white/5"
                }`}
              >
                {item.icon} {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="md:col-span-3">
        <Routes>
          <Route index element={<AppliedJobs />} />
          <Route path="saved" element={<SavedJobs />} />
          <Route path="profile" element={<Profile />} />
          <Route path="payments" element={<PaymentHistory />} />
          <Route path="notifications" element={<Notifications />} />
        </Routes>
      </div>
    </div>
  );
};

const AppliedJobs = () => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyApplications().then(setApps).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;
  if (apps.length === 0) return <EmptyState title="No applications yet" subtitle="Browse jobs and start applying to see them here." icon={<FiBriefcase />} />;

  return (
    <div className="space-y-3">
      <h1 className="text-xl font-bold text-white mb-4">Applied Jobs ({apps.length})</h1>
      {apps.map((a) => (
        <div key={a._id} className="glass rounded-xl p-4 flex items-center justify-between gap-4">
          <div>
            <Link to={`/jobs/${a.job?._id}`} className="font-semibold text-white hover:text-primary-400">
              {a.job?.title}
            </Link>
            <p className="text-sm text-gray-500">{a.job?.company?.name} • {a.job?.location}</p>
          </div>
          <span className={`badge capitalize ${STATUS_COLORS[a.status] || "bg-dark-600 text-gray-400"}`}>{a.status}</span>
        </div>
      ))}
    </div>
  );
};

const SavedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSavedJobsList().then(setJobs).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;
  if (jobs.length === 0) return <EmptyState title="No saved jobs" subtitle="Save jobs while browsing to view them here later." icon={<FiBookmark />} />;

  return (
    <div>
      <h1 className="text-xl font-bold text-white mb-4">Saved Jobs ({jobs.length})</h1>
      <div className="grid md:grid-cols-2 gap-4">
        {jobs.map((job) => (
          <JobCard key={job._id} job={job} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
