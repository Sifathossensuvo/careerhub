import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiMapPin, FiBriefcase, FiClock, FiCalendar, FiDollarSign, FiCheckCircle } from "react-icons/fi";
import { fetchJobById } from "../services/jobService";
import { applyToJob } from "../services/applicationService";
import Loader from "../components/Loader";
import useAuth from "../hooks/useAuth";

const JobDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [showApplyModal, setShowApplyModal] = useState(false);

  useEffect(() => {
    fetchJobById(id)
      .then(setJob)
      .catch(() => toast.error("Job not found"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleApply = async () => {
    if (!user) return navigate("/login", { state: { from: `/jobs/${id}` } });
    if (user.role !== "jobseeker") return toast.error("Only job seekers can apply");

    setApplying(true);
    try {
      await applyToJob(id, { coverLetter });
      setApplied(true);
      setShowApplyModal(false);
      toast.success("Application submitted!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not apply");
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <Loader full />;
  if (!job) return <div className="text-center py-20 text-gray-500">Job not found.</div>;

  const salaryText = job.salaryNegotiable
    ? "Negotiable"
    : job.salaryMin && job.salaryMax
    ? `৳${job.salaryMin.toLocaleString()} - ৳${job.salaryMax.toLocaleString()}`
    : "Not disclosed";

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="glass rounded-2xl p-6 md:p-8 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-dark-600 flex items-center justify-center overflow-hidden">
              {job.company?.logo?.url ? (
                <img src={job.company.logo.url} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-primary-400 text-2xl font-bold">{job.company?.name?.[0]}</span>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{job.title}</h1>
              <Link to={`/companies/${job.company?._id}`} className="text-primary-400 hover:underline text-sm">
                {job.company?.name}
              </Link>
            </div>
          </div>
          <button
            onClick={() => (applied ? null : setShowApplyModal(true))}
            disabled={applied}
            className="btn-primary px-8 py-3 whitespace-nowrap"
          >
            {applied ? "Applied ✓" : "Apply Now"}
          </button>
        </div>

        <div className="flex flex-wrap gap-4 mt-6 text-sm text-gray-400">
          <span className="flex items-center gap-1.5"><FiMapPin /> {job.location} {job.isRemote && "(Remote)"}</span>
          <span className="flex items-center gap-1.5"><FiBriefcase /> {job.jobType}</span>
          <span className="flex items-center gap-1.5"><FiDollarSign /> {salaryText}</span>
          <span className="flex items-center gap-1.5"><FiCalendar /> Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
          <span className="flex items-center gap-1.5"><FiClock /> {job.applicationsCount} applicants</span>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="glass rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Job Description</h2>
            <p className="text-gray-400 text-sm whitespace-pre-line leading-relaxed">{job.description}</p>
          </div>

          {job.requirements?.length > 0 && (
            <div className="glass rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-white mb-3">Requirements</h2>
              <ul className="space-y-2">
                {job.requirements.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                    <FiCheckCircle className="text-primary-400 mt-0.5 shrink-0" /> {r}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {job.benefits?.length > 0 && (
            <div className="glass rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-white mb-3">Benefits</h2>
              <ul className="space-y-2">
                {job.benefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                    <FiCheckCircle className="text-primary-400 mt-0.5 shrink-0" /> {b}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="glass rounded-2xl p-6">
            <h3 className="font-semibold text-white mb-3">Job Overview</h3>
            <dl className="space-y-3 text-sm">
              <Row label="Experience" value={job.experienceLevel} />
              <Row label="Education" value={job.education || "Not specified"} />
              <Row label="Vacancies" value={job.vacancies} />
              <Row label="Skills" value={job.skills?.join(", ") || "—"} />
            </dl>
          </div>

          {job.company && (
            <div className="glass rounded-2xl p-6">
              <h3 className="font-semibold text-white mb-3">About the Company</h3>
              <p className="text-sm text-gray-400 mb-3 line-clamp-4">{job.company.description}</p>
              <Link to={`/companies/${job.company._id}`} className="text-primary-400 text-sm hover:underline">
                View company profile →
              </Link>
            </div>
          )}
        </div>
      </div>

      {showApplyModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="glass rounded-2xl p-6 w-full max-w-lg">
            <h3 className="text-lg font-semibold text-white mb-4">Apply to {job.title}</h3>
            <textarea
              rows={6}
              placeholder="Write a short cover letter (optional)..."
              className="input-field"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
            />
            <div className="flex gap-3 mt-4">
              <button onClick={() => setShowApplyModal(false)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={handleApply} disabled={applying} className="btn-primary flex-1">
                {applying ? "Submitting..." : "Submit Application"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Row = ({ label, value }) => (
  <div className="flex justify-between">
    <dt className="text-gray-500 capitalize">{label}</dt>
    <dd className="text-gray-300 capitalize text-right max-w-[60%]">{value}</dd>
  </div>
);

export default JobDetails;
