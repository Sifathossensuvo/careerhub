import { useState } from "react";
import toast from "react-hot-toast";
import { FiPlus, FiTrash2, FiZap } from "react-icons/fi";
import useAuth from "../hooks/useAuth";
import api from "../services/api";
import { getResumeScore, getCoverLetter, getInterviewQuestions, getSkillGap } from "../services/aiService";

const emptyExp = { company: "", title: "", startDate: "", endDate: "", current: false, description: "" };
const emptyEdu = { institute: "", degree: "", field: "", startYear: "", endYear: "" };

const Profile = () => {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    headline: user?.headline || "",
    bio: user?.bio || "",
    location: user?.location || "",
    skills: user?.skills || [],
    experience: user?.experience?.length ? user.experience : [],
    education: user?.education?.length ? user.education : [],
  });
  const [skillInput, setSkillInput] = useState("");
  const [saving, setSaving] = useState(false);

  // AI tool state
  const [resumeResult, setResumeResult] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [targetJobTitle, setTargetJobTitle] = useState("");
  const [interviewQs, setInterviewQs] = useState(null);
  const [skillGap, setSkillGap] = useState(null);
  const [targetRole, setTargetRole] = useState("");
  const [aiLoading, setAiLoading] = useState("");

  const isPro = user?.isPremium && ["pro", "elite"].includes(user.premiumPlan);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await api.put("/users/profile", form);
      setUser((prev) => ({ ...prev, ...data }));
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !form.skills.includes(skillInput.trim())) {
      setForm({ ...form, skills: [...form.skills, skillInput.trim()] });
      setSkillInput("");
    }
  };

  const runResumeScore = async () => {
    setAiLoading("score");
    try {
      const result = await getResumeScore({ summary: form.bio, skills: form.skills, experience: form.experience, education: form.education });
      setResumeResult(result);
    } catch {
      toast.error("Could not calculate score");
    } finally {
      setAiLoading("");
    }
  };

  const runCoverLetter = async () => {
    setAiLoading("cover");
    try {
      const result = await getCoverLetter({ userName: user.name, jobTitle: targetJobTitle, topSkills: form.skills });
      setCoverLetter(result.coverLetter);
    } catch {
      toast.error("Could not generate cover letter");
    } finally {
      setAiLoading("");
    }
  };

  const runInterviewQs = async () => {
    setAiLoading("interview");
    try {
      const result = await getInterviewQuestions(targetJobTitle);
      setInterviewQs(result);
    } catch {
      toast.error("Could not fetch questions");
    } finally {
      setAiLoading("");
    }
  };

  const runSkillGap = async () => {
    setAiLoading("gap");
    try {
      const result = await getSkillGap({ targetRole, currentSkills: form.skills });
      setSkillGap(result);
    } catch {
      toast.error("Could not analyze skill gap");
    } finally {
      setAiLoading("");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-white">Profile & Resume</h1>

      <div className="glass rounded-2xl p-6 space-y-4">
        <h2 className="font-semibold text-white">Basic Info</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Full Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
          <Field label="Headline" value={form.headline} onChange={(v) => setForm({ ...form, headline: v })} placeholder="e.g. Frontend Developer" />
          <Field label="Location" value={form.location} onChange={(v) => setForm({ ...form, location: v })} placeholder="Dhaka, Bangladesh" />
        </div>
        <div>
          <label className="text-sm text-gray-400 mb-1 block">Bio / Summary</label>
          <textarea rows={4} className="input-field" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
        </div>
      </div>

      <div className="glass rounded-2xl p-6">
        <h2 className="font-semibold text-white mb-3">Skills</h2>
        <div className="flex gap-2 mb-3">
          <input className="input-field" value={skillInput} onChange={(e) => setSkillInput(e.target.value)} placeholder="Add a skill" onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())} />
          <button onClick={addSkill} className="btn-secondary"><FiPlus /></button>
        </div>
        <div className="flex flex-wrap gap-2">
          {form.skills.map((s) => (
            <span key={s} className="badge bg-dark-600 text-gray-300 gap-2">
              {s}
              <button onClick={() => setForm({ ...form, skills: form.skills.filter((x) => x !== s) })}><FiTrash2 size={12} /></button>
            </span>
          ))}
        </div>
      </div>

      <div className="glass rounded-2xl p-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold text-white">Experience</h2>
          <button onClick={() => setForm({ ...form, experience: [...form.experience, { ...emptyExp }] })} className="btn-secondary !py-1.5 !px-3 text-xs flex items-center gap-1">
            <FiPlus /> Add
          </button>
        </div>
        {form.experience.map((exp, i) => (
          <div key={i} className="border border-white/5 rounded-xl p-4 mb-3 space-y-3">
            <div className="grid md:grid-cols-2 gap-3">
              <input className="input-field" placeholder="Company" value={exp.company} onChange={(e) => updateArrItem(form, setForm, "experience", i, "company", e.target.value)} />
              <input className="input-field" placeholder="Job Title" value={exp.title} onChange={(e) => updateArrItem(form, setForm, "experience", i, "title", e.target.value)} />
            </div>
            <textarea rows={2} className="input-field" placeholder="Description" value={exp.description} onChange={(e) => updateArrItem(form, setForm, "experience", i, "description", e.target.value)} />
            <button onClick={() => setForm({ ...form, experience: form.experience.filter((_, idx) => idx !== i) })} className="text-rose-400 text-xs flex items-center gap-1"><FiTrash2 /> Remove</button>
          </div>
        ))}
      </div>

      <div className="glass rounded-2xl p-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold text-white">Education</h2>
          <button onClick={() => setForm({ ...form, education: [...form.education, { ...emptyEdu }] })} className="btn-secondary !py-1.5 !px-3 text-xs flex items-center gap-1">
            <FiPlus /> Add
          </button>
        </div>
        {form.education.map((edu, i) => (
          <div key={i} className="border border-white/5 rounded-xl p-4 mb-3 space-y-3">
            <div className="grid md:grid-cols-2 gap-3">
              <input className="input-field" placeholder="Institute" value={edu.institute} onChange={(e) => updateArrItem(form, setForm, "education", i, "institute", e.target.value)} />
              <input className="input-field" placeholder="Degree" value={edu.degree} onChange={(e) => updateArrItem(form, setForm, "education", i, "degree", e.target.value)} />
            </div>
            <button onClick={() => setForm({ ...form, education: form.education.filter((_, idx) => idx !== i) })} className="text-rose-400 text-xs flex items-center gap-1"><FiTrash2 /> Remove</button>
          </div>
        ))}
      </div>

      <button onClick={handleSave} disabled={saving} className="btn-primary">
        {saving ? "Saving..." : "Save Profile"}
      </button>

      {/* AI TOOLS */}
      <div className="glass rounded-2xl p-6 border border-primary-500/20">
        <h2 className="font-semibold text-white mb-1 flex items-center gap-2"><FiZap className="text-primary-400" /> AI Career Tools</h2>
        {!isPro && <p className="text-xs text-amber-400 mb-4">Upgrade to Pro or Elite to unlock AI Resume Review, ATS Score, Cover Letter Generator & more.</p>}

        <div className={`space-y-6 ${!isPro ? "opacity-50 pointer-events-none" : ""}`}>
          <div>
            <button onClick={runResumeScore} disabled={aiLoading === "score"} className="btn-secondary text-sm">
              {aiLoading === "score" ? "Calculating..." : "Get Resume Score"}
            </button>
            {resumeResult && (
              <div className="mt-3 bg-dark-700 rounded-xl p-4">
                <p className="text-2xl font-bold text-primary-400">{resumeResult.score}/100</p>
                <ul className="text-xs text-gray-400 list-disc list-inside mt-2">
                  {resumeResult.feedback.map((f, i) => <li key={i}>{f}</li>)}
                </ul>
              </div>
            )}
          </div>

          <div>
            <div className="flex gap-2">
              <input className="input-field" placeholder="Target job title" value={targetJobTitle} onChange={(e) => setTargetJobTitle(e.target.value)} />
              <button onClick={runCoverLetter} disabled={aiLoading === "cover"} className="btn-secondary text-sm whitespace-nowrap">
                {aiLoading === "cover" ? "Writing..." : "Generate Cover Letter"}
              </button>
            </div>
            {coverLetter && <textarea readOnly rows={8} className="input-field mt-3 text-xs" value={coverLetter} />}
          </div>

          <div>
            <button onClick={runInterviewQs} disabled={aiLoading === "interview"} className="btn-secondary text-sm">
              {aiLoading === "interview" ? "Loading..." : "Get Interview Questions"}
            </button>
            {interviewQs && (
              <ul className="text-sm text-gray-400 list-disc list-inside mt-3 space-y-1">
                {interviewQs.questions.map((q, i) => <li key={i}>{q}</li>)}
              </ul>
            )}
          </div>

          <div>
            <div className="flex gap-2">
              <input className="input-field" placeholder="Target role e.g. Frontend Developer" value={targetRole} onChange={(e) => setTargetRole(e.target.value)} />
              <button onClick={runSkillGap} disabled={aiLoading === "gap"} className="btn-secondary text-sm whitespace-nowrap">
                {aiLoading === "gap" ? "Analyzing..." : "Skill Gap Analysis"}
              </button>
            </div>
            {skillGap && (
              <div className="mt-3 bg-dark-700 rounded-xl p-4 text-sm">
                <p className="text-primary-400 font-semibold mb-2">Readiness: {skillGap.readiness}%</p>
                <p className="text-gray-400">Missing skills: {skillGap.missing.join(", ") || "None!"}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const updateArrItem = (form, setForm, field, index, key, value) => {
  const updated = [...form[field]];
  updated[index] = { ...updated[index], [key]: value };
  setForm({ ...form, [field]: updated });
};

const Field = ({ label, value, onChange, placeholder }) => (
  <div>
    <label className="text-sm text-gray-400 mb-1 block">{label}</label>
    <input className="input-field" value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
  </div>
);

export default Profile;
