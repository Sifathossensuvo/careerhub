import { useEffect, useState } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FiGrid, FiUsers, FiHome, FiBriefcase, FiCreditCard, FiMail, FiBell,
} from "react-icons/fi";
import StatCard from "../components/StatCard";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import {
  fetchAdminStats, fetchAllUsers, toggleBanUser, fetchAllCompaniesAdmin, approveCompanyAdmin,
  toggleBanCompanyAdmin, toggleFeatureCompanyAdmin, fetchAllJobsAdmin, toggleFeatureJobAdmin,
  closeJobAdmin, fetchPendingPayments, approvePaymentAdmin, rejectPaymentAdmin, sendBroadcast,
} from "../services/adminService";
import Notifications from "./Notifications";

const NAV = [
  { to: "", label: "Overview", icon: <FiGrid />, end: true },
  { to: "users", label: "Users", icon: <FiUsers /> },
  { to: "companies", label: "Companies", icon: <FiHome /> },
  { to: "jobs", label: "Jobs", icon: <FiBriefcase /> },
  { to: "payments", label: "Payments", icon: <FiCreditCard /> },
  { to: "broadcast", label: "Broadcast", icon: <FiMail /> },
  { to: "notifications", label: "Notifications", icon: <FiBell /> },
];

const AdminDashboard = () => {
  const location = useLocation();
  const base = "/admin";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid md:grid-cols-5 gap-6">
      <aside className="glass rounded-2xl p-5 h-fit md:col-span-1">
        <p className="font-semibold text-white text-sm mb-4">Admin Panel</p>
        <nav className="space-y-1">
          {NAV.map((item) => {
            const path = `${base}/${item.to}`;
            const active = item.end ? location.pathname === base || location.pathname === `${base}/` : location.pathname.startsWith(path);
            return (
              <Link key={item.to} to={path} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition ${active ? "bg-primary-500/15 text-primary-400" : "text-gray-400 hover:bg-white/5"}`}>
                {item.icon} {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="md:col-span-4">
        <Routes>
          <Route index element={<Overview />} />
          <Route path="users" element={<UsersPanel />} />
          <Route path="companies" element={<CompaniesPanel />} />
          <Route path="jobs" element={<JobsPanel />} />
          <Route path="payments" element={<PaymentsPanel />} />
          <Route path="broadcast" element={<BroadcastPanel />} />
          <Route path="notifications" element={<Notifications />} />
        </Routes>
      </div>
    </div>
  );
};

const Overview = () => {
  const [stats, setStats] = useState(null);
  useEffect(() => { fetchAdminStats().then(setStats).catch(() => {}); }, []);
  if (!stats) return <Loader />;

  return (
    <div>
      <h1 className="text-xl font-bold text-white mb-5">Dashboard Overview</h1>
      <div className="grid md:grid-cols-3 gap-4">
        <StatCard icon={<FiUsers />} label="Total Users" value={stats.totalUsers} accent="primary" />
        <StatCard icon={<FiUsers />} label="Job Seekers" value={stats.totalJobseekers} accent="blue" />
        <StatCard icon={<FiHome />} label="Recruiters" value={stats.totalRecruiters} accent="purple" />
        <StatCard icon={<FiBriefcase />} label="Active Jobs" value={`${stats.activeJobs} / ${stats.totalJobs}`} accent="amber" />
        <StatCard icon={<FiHome />} label="Companies" value={stats.totalCompanies} accent="primary" />
        <StatCard icon={<FiCreditCard />} label="Premium Users" value={stats.premiumUsers} accent="amber" />
        <StatCard icon={<FiBriefcase />} label="Total Applications" value={stats.totalApplications} accent="blue" />
        <StatCard icon={<FiCreditCard />} label="Pending Payments" value={stats.pendingPayments} accent="rose" />
        <StatCard icon={<FiCreditCard />} label="Total Revenue" value={`৳${stats.totalRevenue.toLocaleString()}`} accent="primary" />
      </div>
    </div>
  );
};

const UsersPanel = () => {
  const [data, setData] = useState({ users: [] });
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    fetchAllUsers({ search, role }).then(setData).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, [role]);

  const handleBan = async (id) => {
    try {
      await toggleBanUser(id);
      toast.success("User status updated");
      load();
    } catch { toast.error("Failed"); }
  };

  return (
    <div>
      <h1 className="text-xl font-bold text-white mb-4">Users</h1>
      <div className="flex gap-3 mb-4">
        <input className="input-field" placeholder="Search name/email" value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === "Enter" && load()} />
        <select className="input-field w-40" value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="">All Roles</option>
          <option value="jobseeker">Job Seeker</option>
          <option value="recruiter">Recruiter</option>
        </select>
      </div>
      {loading ? <Loader /> : (
        <div className="space-y-2">
          {data.users.map((u) => (
            <div key={u._id} className="glass rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-white font-medium text-sm">{u.name} <span className="text-gray-500 capitalize text-xs">({u.role})</span></p>
                <p className="text-xs text-gray-500">{u.email}</p>
              </div>
              <button onClick={() => handleBan(u._id)} className={`btn-secondary !py-1.5 !px-3 text-xs ${u.isBanned ? "text-primary-400" : "text-rose-400"}`}>
                {u.isBanned ? "Unban" : "Ban"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const CompaniesPanel = () => {
  const [data, setData] = useState({ companies: [] });
  const [loading, setLoading] = useState(true);

  const load = () => fetchAllCompaniesAdmin().then(setData).catch(() => {}).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const act = async (fn, id) => { await fn(id); toast.success("Updated"); load(); };

  return (
    <div>
      <h1 className="text-xl font-bold text-white mb-4">Companies</h1>
      {loading ? <Loader /> : data.companies.length === 0 ? <EmptyState title="No companies yet" /> : (
        <div className="space-y-2">
          {data.companies.map((c) => (
            <div key={c._id} className="glass rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <p className="text-white font-medium text-sm">{c.name} {c.isFeatured && <span className="badge bg-amber-500/15 text-amber-400 ml-1">Featured</span>}</p>
                <p className="text-xs text-gray-500">Owner: {c.owner?.name} • {c.owner?.email} • {c.isApproved ? "Approved" : "Pending"}</p>
              </div>
              <div className="flex gap-2">
                {!c.isApproved && <button onClick={() => act(approveCompanyAdmin, c._id)} className="btn-secondary !py-1.5 !px-3 text-xs text-primary-400">Approve</button>}
                <button onClick={() => act(toggleFeatureCompanyAdmin, c._id)} className="btn-secondary !py-1.5 !px-3 text-xs text-amber-400">{c.isFeatured ? "Unfeature" : "Feature"}</button>
                <button onClick={() => act(toggleBanCompanyAdmin, c._id)} className="btn-secondary !py-1.5 !px-3 text-xs text-rose-400">{c.isBanned ? "Unban" : "Ban"}</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const JobsPanel = () => {
  const [data, setData] = useState({ jobs: [] });
  const [loading, setLoading] = useState(true);

  const load = () => fetchAllJobsAdmin().then(setData).catch(() => {}).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const act = async (fn, id) => { await fn(id); toast.success("Updated"); load(); };

  return (
    <div>
      <h1 className="text-xl font-bold text-white mb-4">Jobs</h1>
      {loading ? <Loader /> : data.jobs.length === 0 ? <EmptyState title="No jobs" /> : (
        <div className="space-y-2">
          {data.jobs.map((j) => (
            <div key={j._id} className="glass rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <p className="text-white font-medium text-sm">{j.title} {j.isFeatured && <span className="badge bg-amber-500/15 text-amber-400 ml-1">Featured</span>}</p>
                <p className="text-xs text-gray-500">{j.company?.name} • <span className="capitalize">{j.status}</span></p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => act(toggleFeatureJobAdmin, j._id)} className="btn-secondary !py-1.5 !px-3 text-xs text-amber-400">{j.isFeatured ? "Unfeature" : "Feature"}</button>
                {j.status === "active" && <button onClick={() => act(closeJobAdmin, j._id)} className="btn-secondary !py-1.5 !px-3 text-xs text-rose-400">Close</button>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const PaymentsPanel = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState({});

  const load = () => fetchPendingPayments().then(setPayments).catch(() => {}).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const handleApprove = async (id) => {
    try { await approvePaymentAdmin(id); toast.success("Payment approved & plan activated"); load(); }
    catch (err) { toast.error(err.response?.data?.message || "Failed"); }
  };

  const handleReject = async (id) => {
    try { await rejectPaymentAdmin(id, note[id] || "Could not verify transaction"); toast.success("Payment rejected"); load(); }
    catch { toast.error("Failed"); }
  };

  return (
    <div>
      <h1 className="text-xl font-bold text-white mb-4">Pending Payments</h1>
      {loading ? <Loader /> : payments.length === 0 ? <EmptyState title="No pending payments" subtitle="All caught up!" /> : (
        <div className="space-y-3">
          {payments.map((p) => (
            <div key={p._id} className="glass rounded-xl p-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <p className="text-white font-medium text-sm capitalize">{p.planName} Plan — ৳{p.amount} ({p.method.toUpperCase()})</p>
                  <p className="text-xs text-gray-500">{p.user?.name} • {p.user?.email} • TrxID: {p.transactionId} • Sender: {p.senderNumber}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleApprove(p._id)} className="btn-secondary !py-1.5 !px-3 text-xs text-primary-400">Approve</button>
                  <button onClick={() => handleReject(p._id)} className="btn-secondary !py-1.5 !px-3 text-xs text-rose-400">Reject</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const BroadcastPanel = () => {
  const [form, setForm] = useState({ role: "all", title: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await sendBroadcast(form);
      toast.success(res.message);
      setForm({ role: "all", title: "", message: "" });
    } catch { toast.error("Failed to send"); }
    finally { setSending(false); }
  };

  return (
    <div>
      <h1 className="text-xl font-bold text-white mb-4">Send Broadcast Notification</h1>
      <form onSubmit={handleSend} className="glass rounded-2xl p-6 space-y-4 max-w-xl">
        <select className="input-field" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option value="all">All Users</option>
          <option value="jobseeker">Job Seekers Only</option>
          <option value="recruiter">Recruiters Only</option>
        </select>
        <input required className="input-field" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <textarea required rows={4} className="input-field" placeholder="Message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
        <button disabled={sending} className="btn-primary">{sending ? "Sending..." : "Send Broadcast"}</button>
      </form>
    </div>
  );
};

export default AdminDashboard;
