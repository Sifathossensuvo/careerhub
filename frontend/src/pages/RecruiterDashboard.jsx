import { useEffect, useState } from "react";
import { Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiBriefcase, FiPlusCircle, FiUsers, FiHome, FiCreditCard } from "react-icons/fi";
import useAuth from "../hooks/useAuth";
import { fetchMyJobs, deleteJob } from "../services/jobService";
import { createCompany, updateCompany } from "../services/companyService";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import PostJob from "./PostJob";
import Applicants from "./Applicants";
import PaymentHistory from "./PaymentHistory";
import api from "../services/api";

const NAV = [
  { to: "", label: "My Jobs", icon: <FiBriefcase />, end: true },
  { to: "post-job", label: "Post a Job", icon: <FiPlusCircle /> },
  { to: "company", label: "Company Profile", icon: <FiHome /> },
  { to: "payments", label: "Plan & Billing", icon: <FiCreditCard /> },
];

const RecruiterDashboard = () => {
  const { user } = useAuth();
  const location = useLocation();
  const base = "/recruiter";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid md:grid-cols-4 gap-6">
      <aside className="glass rounded-2xl p-5 h-fit">
        <div className="mb-6">
          <p className="font-semibold text-white text-sm">{user?.name}</p>
          <span className="badge bg-dark-600 text-gray-400">Recruiter</span>
        </div>
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

      <div className="md:col-span-3">
        <Routes>
          <Route index element={<MyJobs />} />
          <Route path="post-job" element={<PostJob />} />
          <Route path="jobs/:jobId/applicants" element={<Applicants />} />
          <Route path="company" element={<CompanyProfileForm />} />
          <Route path="payments" element={<PaymentHistory />} />
        </Routes>
      </div>
    </div>
  );
};

const MyJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => fetchMyJobs().then(setJobs).catch(() => {}).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this job posting?")) return;
    try {
      await deleteJob(id);
      toast.success("Job deleted");
      load();
    } catch {
      toast.error("Could not delete job");
    }
  };

  if (loading) return <Loader />;
  if (jobs.length === 0) return <EmptyState title="No jobs posted yet" subtitle="Click 'Post a Job' to create your first listing." icon={<FiBriefcase />} />;

  return (
    <div>
      <h1 className="text-xl font-bold text-white mb-4">My Job Posts ({jobs.length})</h1>
      <div className="space-y-3">
        {jobs.map((job) => (
          <div key={job._id} className="glass rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <p className="font-semibold text-white">{job.title}</p>
              <p className="text-xs text-gray-500">{job.location} • {job.jobType} • {job.applicationsCount} applicants • <span className="capitalize">{job.status}</span></p>
            </div>
            <div className="flex gap-2">
              <Link to={`/recruiter/jobs/${job._id}/applicants`} className="btn-secondary !py-1.5 !px-3 text-xs flex items-center gap-1">
                <FiUsers /> Applicants
              </Link>
              <button onClick={() => handleDelete(job._id)} className="btn-secondary !py-1.5 !px-3 text-xs text-rose-400">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const CompanyProfileForm = () => {
  const { user, refreshUser } = useAuth();
  const [form, setForm] = useState({ name: "", description: "", website: "", industry: "", size: "1-10", location: "" });
  const [existingId, setExistingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user?.company) {
      api.get(`/companies/${user.company._id || user.company}`).then((r) => {
        setForm(r.data);
        setExistingId(r.data._id);
      }).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (existingId) {
        await updateCompany(existingId, form);
        toast.success("Company profile updated");
      } else {
        await createCompany(form);
        toast.success("Company profile created — pending admin approval");
      }
      await refreshUser();
    } catch (err) {
      toast.error(err.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="text-xl font-bold text-white mb-4">Company Profile</h1>
      <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 space-y-4">
        <input required className="input-field" placeholder="Company Name" value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <textarea rows={4} className="input-field" placeholder="Description" value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <div className="grid md:grid-cols-2 gap-4">
          <input className="input-field" placeholder="Website" value={form.website || ""} onChange={(e) => setForm({ ...form, website: e.target.value })} />
          <input className="input-field" placeholder="Industry" value={form.industry || ""} onChange={(e) => setForm({ ...form, industry: e.target.value })} />
          <input className="input-field" placeholder="Location" value={form.location || ""} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          <select className="input-field" value={form.size || "1-10"} onChange={(e) => setForm({ ...form, size: e.target.value })}>
            {["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"].map((s) => <option key={s} value={s}>{s} employees</option>)}
          </select>
        </div>
        <button disabled={saving} className="btn-primary">{saving ? "Saving..." : existingId ? "Update Profile" : "Create Company"}</button>
      </form>
    </div>
  );
};

export default RecruiterDashboard;
