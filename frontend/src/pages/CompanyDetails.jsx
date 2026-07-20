import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { FiMapPin, FiGlobe, FiUsers, FiHeart } from "react-icons/fi";
import { fetchCompanyById, toggleFollowCompany } from "../services/companyService";
import { fetchJobs } from "../services/jobService";
import Loader from "../components/Loader";
import JobCard from "../components/JobCard";
import useAuth from "../hooks/useAuth";

const CompanyDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchCompanyById(id), fetchJobs({ })])
      .then(([c, j]) => {
        setCompany(c);
        setJobs(j.jobs.filter((job) => job.company?._id === id));
      })
      .catch(() => toast.error("Company not found"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleFollow = async () => {
    if (!user) return toast.error("Please login to follow companies");
    try {
      await toggleFollowCompany(id);
      toast.success("Updated follow status");
    } catch { toast.error("Failed"); }
  };

  if (loading) return <Loader full />;
  if (!company) return <div className="text-center py-20 text-gray-500">Company not found.</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="glass rounded-2xl p-6 md:p-8 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-dark-600 flex items-center justify-center overflow-hidden">
            {company.logo?.url ? <img src={company.logo.url} className="w-full h-full object-cover" alt="" /> : <span className="text-primary-400 text-2xl font-bold">{company.name[0]}</span>}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{company.name}</h1>
            <p className="text-gray-500 text-sm flex items-center gap-1"><FiMapPin /> {company.location}</p>
          </div>
        </div>
        <button onClick={handleFollow} className="btn-secondary flex items-center gap-2"><FiHeart /> Follow</button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 glass rounded-2xl p-6">
          <h2 className="font-semibold text-white mb-3">About</h2>
          <p className="text-gray-400 text-sm whitespace-pre-line">{company.description}</p>
        </div>
        <div className="glass rounded-2xl p-6 space-y-3 text-sm">
          {company.website && <p className="flex items-center gap-2 text-gray-400"><FiGlobe /> <a href={company.website} target="_blank" rel="noreferrer" className="text-primary-400 hover:underline">{company.website}</a></p>}
          <p className="flex items-center gap-2 text-gray-400"><FiUsers /> {company.size} employees</p>
          <p className="text-gray-400">Industry: {company.industry}</p>
        </div>
      </div>

      <h2 className="section-title mt-10 mb-6">Open Positions ({jobs.length})</h2>
      {jobs.length === 0 ? (
        <p className="text-gray-500">No open positions right now.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {jobs.map((job) => <JobCard key={job._id} job={{ ...job, company }} />)}
        </div>
      )}
    </div>
  );
};

export default CompanyDetails;
