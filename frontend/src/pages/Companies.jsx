import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiMapPin, FiSearch } from "react-icons/fi";
import { fetchCompanies } from "../services/companyService";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";

const Companies = () => {
  const [data, setData] = useState({ companies: [] });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    fetchCompanies({ search }).then(setData).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="section-title">Companies Hiring in Bangladesh</h1>
      <div className="flex items-center gap-2 glass rounded-xl px-4 max-w-md mb-8">
        <FiSearch className="text-gray-500" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === "Enter" && load()} placeholder="Search companies..." className="bg-transparent py-3 w-full outline-none text-gray-100" />
      </div>

      {loading ? <Loader /> : data.companies.length === 0 ? <EmptyState title="No companies found" /> : (
        <div className="grid md:grid-cols-3 gap-5">
          {data.companies.map((c) => (
            <Link key={c._id} to={`/companies/${c._id}`} className="glass rounded-2xl p-5 hover:border-primary-500/40 border border-transparent transition">
              <div className="w-14 h-14 rounded-xl bg-dark-600 flex items-center justify-center mb-3 overflow-hidden">
                {c.logo?.url ? <img src={c.logo.url} className="w-full h-full object-cover" alt="" /> : <span className="text-primary-400 font-bold text-xl">{c.name[0]}</span>}
              </div>
              <p className="font-semibold text-white flex items-center gap-2">{c.name} {c.isFeatured && <span className="badge bg-amber-500/15 text-amber-400">Featured</span>}</p>
              <p className="text-xs text-gray-500 flex items-center gap-1 mt-1"><FiMapPin /> {c.location}</p>
              <p className="text-sm text-gray-400 mt-2 line-clamp-2">{c.description}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Companies;
