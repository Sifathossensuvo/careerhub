import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiSearch, FiMapPin, FiUsers, FiBriefcase, FiTrendingUp, FiChevronDown } from "react-icons/fi";
import JobCard from "../components/JobCard";
import Loader from "../components/Loader";
import { fetchLatestJobs, fetchFeaturedJobs, fetchCategories } from "../services/jobService";

const STATS = [
  { icon: <FiBriefcase />, label: "Active Jobs", value: "12,400+" },
  { icon: <FiUsers />, label: "Job Seekers", value: "180,000+" },
  { icon: <FiTrendingUp />, label: "Companies", value: "3,200+" },
  { icon: <FiUsers />, label: "Hires Made", value: "45,000+" },
];

const FAQS = [
  { q: "Is CareerHub BD free to use?", a: "Yes! Job seekers can browse and apply to jobs for free with up to 5 applications per day. Upgrade to Premium for unlimited applications and AI tools." },
  { q: "How do I pay for Premium?", a: "We use a manual bKash/Nagad verification system — no card needed. Send the payment, submit your transaction ID, and our team activates your plan within a few hours." },
  { q: "Can recruiters post jobs for free?", a: "Yes, every recruiter gets 5 free job posts. Upgrade to Business or Enterprise for more posts and premium visibility." },
  { q: "Do you support Bengali language?", a: "English is fully supported today; Bengali language support is coming soon." },
];

const Home = () => {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [latestJobs, setLatestJobs] = useState([]);
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([fetchLatestJobs(), fetchFeaturedJobs(), fetchCategories()])
      .then(([latest, featured, cats]) => {
        setLatestJobs(latest);
        setFeaturedJobs(featured);
        setCategories(cats);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set("search", query);
    if (location) params.set("location", location);
    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-900/30 via-dark-900 to-dark-900" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl" />
        <div className="absolute top-40 -left-40 w-96 h-96 bg-primary-700/20 rounded-full blur-3xl" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-20 pb-24 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-extrabold text-white leading-tight"
          >
            Find Your Dream Career <br />
            <span className="bg-gradient-to-r from-primary-400 to-primary-200 bg-clip-text text-transparent">
              in Bangladesh
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-5 text-gray-400 max-w-2xl mx-auto text-lg"
          >
            Thousands of verified jobs, AI-powered resume tools, and a career platform built for Bangladeshi
            professionals — from entry level to executive.
          </motion.p>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            onSubmit={handleSearch}
            className="mt-10 glass rounded-2xl p-3 flex flex-col md:flex-row gap-3 max-w-2xl mx-auto"
          >
            <div className="flex items-center gap-2 flex-1 bg-dark-700 rounded-xl px-4">
              <FiSearch className="text-gray-500" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Job title, keyword..."
                className="bg-transparent py-3 w-full outline-none text-gray-100 placeholder-gray-500"
              />
            </div>
            <div className="flex items-center gap-2 flex-1 bg-dark-700 rounded-xl px-4">
              <FiMapPin className="text-gray-500" />
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Dhaka, Chattogram..."
                className="bg-transparent py-3 w-full outline-none text-gray-100 placeholder-gray-500"
              />
            </div>
            <button type="submit" className="btn-primary px-8">Search Jobs</button>
          </motion.form>

          <div className="flex flex-wrap justify-center gap-2 mt-6 text-sm text-gray-500">
            Popular: {["Software Engineer", "Marketing", "Accountant", "Graphic Designer"].map((t) => (
              <Link key={t} to={`/jobs?search=${t}`} className="hover:text-primary-400 underline underline-offset-4">
                {t}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
        {STATS.map((s) => (
          <div key={s.label} className="glass rounded-2xl p-5 text-center">
            <div className="text-primary-400 text-2xl flex justify-center mb-2">{s.icon}</div>
            <p className="text-2xl font-bold text-white">{s.value}</p>
            <p className="text-sm text-gray-500">{s.label}</p>
          </div>
        ))}
      </section>

      {/* CATEGORIES */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
          <h2 className="section-title text-center">Popular Categories</h2>
          <p className="text-gray-500 text-center mb-10">Explore jobs across Bangladesh's top industries</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {categories.slice(0, 10).map((c) => (
              <Link
                key={c._id}
                to={`/jobs?category=${c._id}`}
                className="glass rounded-xl p-5 text-center hover:border-primary-500/40 border border-transparent transition"
              >
                <p className="font-semibold text-gray-200 text-sm">{c.name}</p>
                <p className="text-xs text-gray-500 mt-1">{c.jobCount || 0} jobs</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* LATEST JOBS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="section-title !mb-0">Latest Jobs</h2>
          <Link to="/jobs" className="text-primary-400 text-sm font-medium hover:underline">View all →</Link>
        </div>
        {loading ? (
          <Loader />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {latestJobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        )}
      </section>

      {/* FEATURED COMPANIES / JOBS */}
      {featuredJobs.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <h2 className="section-title text-center">Featured Opportunities</h2>
          <p className="text-gray-500 text-center mb-10">Hand-picked roles from top employers</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredJobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        </section>
      )}

      {/* PREMIUM BENEFITS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <h2 className="section-title text-center">Why Go Premium?</h2>
        <p className="text-gray-500 text-center mb-12">Unlock AI-powered tools and get noticed faster</p>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: "AI Resume Tools", desc: "Get your resume scored, ATS-checked, and improved with AI feedback." },
            { title: "Unlimited Applications", desc: "No more daily limits — apply to as many jobs as you want." },
            { title: "Priority Visibility", desc: "Stand out to recruiters with priority badges and early job access." },
          ].map((f) => (
            <div key={f.title} className="glass rounded-2xl p-6">
              <h3 className="text-white font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link to="/pricing" className="btn-primary px-8 py-3 inline-block">See Premium Plans</Link>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-dark-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="section-title text-center">What Our Users Say</h2>
          <div className="grid md:grid-cols-3 gap-6 mt-10">
            {[
              { name: "Tanvir Ahmed", role: "Software Engineer @ Dhaka", quote: "Landed my current job within two weeks of using CareerHub BD. The AI resume score feature helped me a lot." },
              { name: "Nusrat Jahan", role: "HR Manager", quote: "Posting jobs and managing applicants is so much easier than the tools we used before." },
              { name: "Rakib Hasan", role: "Marketing Executive", quote: "The premium plan is affordable and the priority badge really got me noticed by recruiters." },
            ].map((t) => (
              <div key={t.name} className="glass rounded-2xl p-6">
                <p className="text-gray-300 text-sm italic">"{t.quote}"</p>
                <p className="mt-4 font-semibold text-white text-sm">{t.name}</p>
                <p className="text-gray-500 text-xs">{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-20">
        <h2 className="section-title text-center">Frequently Asked Questions</h2>
        <div className="mt-8 space-y-3">
          {FAQS.map((f, i) => (
            <FaqItem key={i} q={f.q} a={f.a} />
          ))}
        </div>
      </section>
    </div>
  );
};

const FaqItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="glass rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left text-gray-100 font-medium"
      >
        {q}
        <FiChevronDown className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="px-5 pb-4 text-gray-400 text-sm">{a}</div>}
    </div>
  );
};

export default Home;
