import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PricingCard from "../components/PricingCard";
import Loader from "../components/Loader";
import { fetchJobseekerPlans, fetchRecruiterPlans } from "../services/paymentService";
import useAuth from "../hooks/useAuth";

const Pricing = () => {
  const [tab, setTab] = useState("jobseeker");
  const [jobseekerPlans, setJobseekerPlans] = useState([]);
  const [recruiterPlans, setRecruiterPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([fetchJobseekerPlans(), fetchRecruiterPlans()])
      .then(([js, rec]) => {
        setJobseekerPlans(js);
        setRecruiterPlans(rec);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSelect = (plan) => {
    if (!user) return navigate("/login");
    const purpose = tab === "jobseeker" ? "premium_subscription" : "recruiter_plan";
    navigate("/payment/submit", { state: { plan: plan.key, price: plan.price, purpose } });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="section-title text-center">Simple, Transparent Pricing</h1>
      <p className="text-gray-500 text-center mb-10">No hidden fees. Pay easily via bKash or Nagad.</p>

      <div className="flex justify-center mb-10">
        <div className="glass rounded-xl p-1 inline-flex">
          <button
            onClick={() => setTab("jobseeker")}
            className={`px-6 py-2 rounded-lg text-sm font-medium ${tab === "jobseeker" ? "bg-primary-500 text-white" : "text-gray-400"}`}
          >
            For Job Seekers
          </button>
          <button
            onClick={() => setTab("recruiter")}
            className={`px-6 py-2 rounded-lg text-sm font-medium ${tab === "recruiter" ? "bg-primary-500 text-white" : "text-gray-400"}`}
          >
            For Recruiters
          </button>
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : tab === "jobseeker" ? (
        <div className="grid md:grid-cols-4 gap-6">
          {jobseekerPlans.map((p, i) => (
            <PricingCard key={p.key} plan={p} highlighted={p.key === "pro"} onSelect={handleSelect} ctaLabel="Buy Now" />
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {recruiterPlans.map((p) => (
            <PricingCard
              key={p.key}
              plan={{ ...p, features: [`${p.jobPosts} Job Posts`, ...p.features.filter((f) => !f.includes("Job Posts"))] }}
              highlighted={p.key === "business"}
              onSelect={handleSelect}
              ctaLabel="Buy Now"
            />
          ))}
        </div>
      )}

      <p className="text-center text-gray-600 text-xs mt-10">
        All payments are manually verified via bKash/Nagad. Plans activate within a few hours of admin approval and expire automatically after 30 days.
      </p>
    </div>
  );
};

export default Pricing;
