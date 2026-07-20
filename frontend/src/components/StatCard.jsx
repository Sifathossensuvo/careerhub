const ACCENTS = {
  primary: "bg-primary-500/15 text-primary-400",
  blue: "bg-blue-500/15 text-blue-400",
  amber: "bg-amber-500/15 text-amber-400",
  rose: "bg-rose-500/15 text-rose-400",
  purple: "bg-purple-500/15 text-purple-400",
};

const StatCard = ({ icon, label, value, accent = "primary" }) => (
  <div className="glass rounded-2xl p-5 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${ACCENTS[accent] || ACCENTS.primary}`}>
      {icon}
    </div>
    <div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-sm text-gray-400">{label}</p>
    </div>
  </div>
);

export default StatCard;
