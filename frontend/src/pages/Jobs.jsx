import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FiSearch, FiFilter } from "react-icons/fi";
import JobCard from "../components/JobCard";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import { fetchJobs, fetchCategories, toggleSaveJob } from "../services/jobService";
import useAuth from "../hooks/useAuth";
import toast from "react-hot-toast";

const JOB_TYPES = ["full-time", "part-time", "internship", "contract", "temporary"];
const EXPERIENCE = ["no-experience", "entry", "mid", "senior", "lead"];

const Jobs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, refreshUser } = useAuth();
  const [data, setData] = useState({ jobs: [], total: 0, pages: 1 });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    location: searchParams.get("location") || "",
    category: searchParams.get("category") || "",
    jobType: searchParams.get("jobType") || "",
    experienceLevel: searchParams.get("experienceLevel") || "",
    isRemote: searchParams.get("isRemote") || "",
    salaryMin: searchParams.get("salaryMin") || "",
    page: Number(searchParams.get("page")) || 1,
  });

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));
    setSearchParams(params);
    fetchJobs(params)
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const updateFilter = (key, value) => setFilters((f) => ({ ...f, [key]: value, page: 1 }));

  const handleSave = async (jobId) => {
    if (!user) return toast.error("Please login to save jobs");
    try {
      await toggleSaveJob(jobId);
      await refreshUser();
      toast.success("Saved jobs updated");
    } catch {
      toast.error("Could not update saved jobs");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="flex items-center gap-2 flex-1 glass rounded-xl px-4">
          <FiSearch className="text-gray-500" />
          <input
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            placeholder="Search job title, skill, company..."
            className="bg-transparent py-3 w-full outline-none text-gray-100"
          />
        </div>
        <input
          value={filters.location}
          onChange={(e) => updateFilter("location", e.target.value)}
          placeholder="Location"
          className="input-field md:w-56"
        />
        <button onClick={() => setShowFilters(!showFilters)} className="btn-secondary flex items-center gap-2 md:hidden">
          <FiFilter /> Filters
        </button>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        {/* FILTER SIDEBAR */}
        <aside className={`${showFilters ? "block" : "hidden"} md:block glass rounded-2xl p-5 h-fit space-y-5`}>
          <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-2">Category</h4>
            <select className="input-field" value={filters.category} onChange={(e) => updateFilter("category", e.target.value)}>
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-2">Job Type</h4>
            <div className="space-y-2">
              {JOB_TYPES.map((t) => (
                <label key={t} className="flex items-center gap-2 text-sm text-gray-400 capitalize">
                  <input
                    type="radio"
                    name="jobType"
                    checked={filters.jobType === t}
                    onChange={() => updateFilter("jobType", t)}
                  />
                  {t.replace("-", " ")}
                </label>
              ))}
              {filters.jobType && (
                <button onClick={() => updateFilter("jobType", "")} className="text-xs text-primary-400">Clear</button>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-2">Experience</h4>
            <select className="input-field" value={filters.experienceLevel} onChange={(e) => updateFilter("experienceLevel", e.target.value)}>
              <option value="">Any Experience</option>
              {EXPERIENCE.map((e) => (
                <option key={e} value={e} className="capitalize">{e.replace("-", " ")}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm text-gray-400">
              <input type="checkbox" checked={filters.isRemote === "true"} onChange={(e) => updateFilter("isRemote", e.target.checked ? "true" : "")} />
              Remote Only
            </label>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-2">Minimum Salary (৳)</h4>
            <input
              type="number"
              className="input-field"
              placeholder="e.g. 30000"
              value={filters.salaryMin}
              onChange={(e) => updateFilter("salaryMin", e.target.value)}
              disabled={!user?.isPremium}
              title={!user?.isPremium ? "Salary filter is a Premium feature" : ""}
            />
            {!user?.isPremium && <p className="text-xs text-amber-400 mt-1">Premium feature - upgrade to filter by salary</p>}
          </div>
        </aside>

        {/* JOB LIST */}
        <div className="md:col-span-3">
          <p className="text-gray-500 text-sm mb-4">{data.total} jobs found</p>
          {loading ? (
            <Loader />
          ) : data.jobs.length === 0 ? (
            <EmptyState title="No jobs found" subtitle="Try adjusting your filters or search keywords" />
          ) : (
            <div className="grid md:grid-cols-2 gap-5">
              {data.jobs.map((job) => (
                <JobCard
                  key={job._id}
                  job={job}
                  onSave={handleSave}
                  saved={user?.savedJobs?.includes(job._id)}
                />
              ))}
            </div>
          )}

          {data.pages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: data.pages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setFilters((f) => ({ ...f, page: p }))}
                  className={`w-9 h-9 rounded-lg text-sm ${
                    filters.page === p ? "bg-primary-500 text-white" : "bg-dark-700 text-gray-400"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Jobs;
