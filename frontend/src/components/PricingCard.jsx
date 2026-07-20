import { FiCheck } from "react-icons/fi";

const PricingCard = ({ plan, highlighted, onSelect, ctaLabel = "Choose Plan" }) => (
  <div
    className={`rounded-2xl p-6 flex flex-col relative ${
      highlighted
        ? "bg-gradient-to-b from-primary-600/20 to-dark-700 border-2 border-primary-500 shadow-xl shadow-primary-500/10 scale-105"
        : "glass border border-white/5"
    }`}
  >
    {highlighted && (
      <span className="absolute -top-3 left-1/2 -translate-x-1/2 badge bg-primary-500 text-white">Most Popular</span>
    )}
    <h3 className="text-lg font-bold text-white">{plan.name}</h3>
    <div className="mt-2 mb-5">
      <span className="text-3xl font-extrabold text-white">৳{plan.price}</span>
      {plan.price > 0 && <span className="text-gray-400 text-sm">/month</span>}
    </div>
    <ul className="space-y-2.5 flex-1 mb-6">
      {plan.features.map((f) => (
        <li key={f} className="flex items-start gap-2 text-sm text-gray-300">
          <FiCheck className="text-primary-400 mt-0.5 shrink-0" />
          {f}
        </li>
      ))}
    </ul>
    <button
      onClick={() => onSelect?.(plan)}
      className={highlighted ? "btn-primary w-full" : "btn-secondary w-full"}
    >
      {plan.price === 0 ? "Current / Free" : ctaLabel}
    </button>
  </div>
);

export default PricingCard;
