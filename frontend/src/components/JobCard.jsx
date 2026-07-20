import { Link } from "react-router-dom";
import { FiMapPin, FiClock, FiBriefcase, FiBookmark } from "react-icons/fi";

const formatSalary = (job) => {
  if (job.salaryNegotiable) return "Negotiable";
  if (job.salaryMin && job.salaryMax) return `৳${job.salaryMin.toLocaleString()} - ৳${job.salaryMax.toLocaleString()}`;
  if (job.salaryMax) return `Up to ৳${job.salaryMax.toLocaleString()}`;
  return "Not disclosed";
};

const timeAgo = (date) => {
  const diff = Math.floor((Date.now() - new Date(date)) / (1000 * 60 * 60 * 24));
  if (diff === 0) return "Today";
  if (diff === 1) return "1 day ago";
  return `${diff} days ago`;
};

const JobCard = ({ job, onSave, saved }) => (
  <div className="glass rounded-2xl p-5 hover:border-primary-500/40 border border-transparent transition-all duration-200 group">
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-dark-600 flex items-center justify-center overflow-hidden shrink-0">
          {job.company?.logo?.url ? (
            <img src={job.company.logo.url} alt={job.company.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-primary-400 font-bold">{job.company?.name?.[0] || "C"}</span>
          )}
        </div>
        <div>
          <Link to={`/jobs/${job._id}`} className="font-semibold text-white group-hover:text-primary-400 transition line-clamp-1">
            {job.title}
          </Link>
          <p className="text-sm text-gray-400">{job.company?.name}</p>
        </div>
      </div>
      {job.isFeatured && <span className="badge bg-amber-500/15 text-amber-400 shrink-0">Featured</span>}
    </div>

    <div className="flex flex-wrap gap-3 mt-4 text-xs text-gray-400">
      <span className="flex items-center gap-1"><FiMapPin /> {job.location}</span>
      <span className="flex items-center gap-1"><FiBriefcase /> {job.jobType}</span>
      <span className="flex items-center gap-1"><FiClock /> {timeAgo(job.createdAt)}</span>
    </div>

    <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
      <span className="text-primary-400 font-semibold text-sm">{formatSalary(job)}</span>
      <div className="flex items-center gap-2">
        {onSave && (
          <button onClick={() => onSave(job._id)} className={`p-2 rounded-lg hover:bg-white/5 ${saved ? "text-primary-400" : "text-gray-500"}`}>
            <FiBookmark fill={saved ? "currentColor" : "none"} />
          </button>
        )}
        <Link to={`/jobs/${job._id}`} className="btn-primary !py-1.5 !px-4 text-xs">
          View Details
        </Link>
      </div>
    </div>
  </div>
);

export default JobCard;
