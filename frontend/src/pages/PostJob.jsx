import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { createJob } from "../services/jobService";

const initialForm = {
  title: "",
  description: "",
  requirements: "",
  benefits: "",
  location: "",
  isRemote: false,
  jobType: "full-time",
  experienceLevel: "entry",
  education: "",
  salaryMin: "",
  salaryMax: "",
  salaryNegotiable: false,
  skills: "",
  vacancies: 1,
  deadline: "",
};

const PostJob = () => {
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        requirements: form.requirements.split("\n").filter(Boolean),
        benefits: form.benefits.split("\n").filter(Boolean),
        skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
        salaryMin: form.salaryMin ? Number(form.salaryMin) : undefined,
        salaryMax: form.salaryMax ? Number(form.salaryMax) : undefined,
        vacancies: Number(form.vacancies),
      };
      await createJob(payload);
      toast.success("Job posted successfully!");
      navigate("/recruiter");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not post job");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="text-xl font-bold text-white mb-4">Post a New Job</h1>
      <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 space-y-4">
        <input required className="input-field" placeholder="Job Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />

        <textarea required rows={5} className="input-field" placeholder="Job Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />

        <textarea rows={3} className="input-field" placeholder="Requirements (one per line)" value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} />

        <textarea rows={3} className="input-field" placeholder="Benefits (one per line)" value={form.benefits} onChange={(e) => setForm({ ...form, benefits: e.target.value })} />

        <div className="grid md:grid-cols-2 gap-4">
          <input required className="input-field" placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          <select className="input-field" value={form.jobType} onChange={(e) => setForm({ ...form, jobType: e.target.value })}>
            {["full-time", "part-time", "internship", "contract", "temporary"].map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <select className="input-field" value={form.experienceLevel} onChange={(e) => setForm({ ...form, experienceLevel: e.target.value })}>
            {["no-experience", "entry", "mid", "senior", "lead"].map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <input className="input-field" placeholder="Education (e.g. BSc in CSE)" value={form.education} onChange={(e) => setForm({ ...form, education: e.target.value })} />
          <input type="number" className="input-field" placeholder="Min Salary (৳)" value={form.salaryMin} onChange={(e) => setForm({ ...form, salaryMin: e.target.value })} />
          <input type="number" className="input-field" placeholder="Max Salary (৳)" value={form.salaryMax} onChange={(e) => setForm({ ...form, salaryMax: e.target.value })} />
          <input className="input-field" placeholder="Skills (comma separated)" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} />
          <input type="number" min={1} className="input-field" placeholder="Vacancies" value={form.vacancies} onChange={(e) => setForm({ ...form, vacancies: e.target.value })} />
          <input required type="date" className="input-field" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm text-gray-400">
            <input type="checkbox" checked={form.isRemote} onChange={(e) => setForm({ ...form, isRemote: e.target.checked })} /> Remote OK
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-400">
            <input type="checkbox" checked={form.salaryNegotiable} onChange={(e) => setForm({ ...form, salaryNegotiable: e.target.checked })} /> Salary Negotiable
          </label>
        </div>

        <button disabled={saving} className="btn-primary w-full">{saving ? "Posting..." : "Post Job"}</button>
      </form>
    </div>
  );
};

export default PostJob;
