import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { FiDownload, FiSearch } from "react-icons/fi";
import { fetchApplicantsForJob, updateApplicationStatus } from "../services/applicationService";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";

const STATUS_OPTIONS = ["applied", "viewed", "shortlisted", "rejected", "hired"];

const STATUS_COLORS = {
  applied: "bg-blue-500/15 text-blue-400",
  viewed: "bg-purple-500/15 text-purple-400",
  shortlisted: "bg-amber-500/15 text-amber-400",
  rejected: "bg-rose-500/15 text-rose-400",
  hired: "bg-primary-500/15 text-primary-400",
};

const Applicants = () => {
  const { jobId } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const load = () => {
    setLoading(true);
    fetchApplicantsForJob(jobId, { search, status: statusFilter })
      .then(setApplicants)
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [statusFilter]);

  const handleStatusChange = async (id, status) => {
    try {
      await updateApplicationStatus(id, status);
      toast.success("Status updated");
      setApplicants((prev) => prev.map((a) => (a._id === id ? { ...a, status } : a)));
    } catch {
      toast.error("Could not update status");
    }
  };

  return (
    <div>
      <h1 className="text-xl font-bold text-white mb-4">Applicants</h1>

      <div className="flex flex-col md:flex-row gap-3 mb-5">
        <div className="flex items-center gap-2 flex-1 glass rounded-xl px-4">
          <FiSearch className="text-gray-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && load()}
            placeholder="Search by name or skill..."
            className="bg-transparent py-2.5 w-full outline-none text-gray-100"
          />
        </div>
        <select className="input-field md:w-48" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
        </select>
      </div>

      {loading ? (
        <Loader />
      ) : applicants.length === 0 ? (
        <EmptyState title="No applicants yet" subtitle="Applicants for this job will show up here." />
      ) : (
        <div className="space-y-3">
          {applicants.map((a) => (
            <div key={a._id} className="glass rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-dark-600 flex items-center justify-center text-primary-400 font-bold">
                  {a.applicant?.name?.[0]}
                </div>
                <div>
                  <p className="font-semibold text-white flex items-center gap-2">
                    {a.applicant?.name}
                    {a.isPriority && <span className="badge bg-amber-500/15 text-amber-400 text-[10px]">Priority</span>}
                  </p>
                  <p className="text-xs text-gray-500">{a.applicant?.email} • {a.applicant?.location}</p>
                  {a.applicant?.skills?.length > 0 && (
                    <p className="text-xs text-gray-500 mt-1">Skills: {a.applicant.skills.slice(0, 5).join(", ")}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {a.resumeUrl && (
                  <a href={a.resumeUrl} target="_blank" rel="noreferrer" className="btn-secondary !py-1.5 !px-3 text-xs flex items-center gap-1">
                    <FiDownload /> CV
                  </a>
                )}
                <select
                  value={a.status}
                  onChange={(e) => handleStatusChange(a._id, e.target.value)}
                  className={`text-xs rounded-lg px-2 py-1.5 capitalize border-0 ${STATUS_COLORS[a.status]}`}
                >
                  {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Applicants;
