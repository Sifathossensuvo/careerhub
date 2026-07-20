const EmptyState = ({ title = "Nothing here yet", subtitle, icon }) => (
  <div className="flex flex-col items-center justify-center text-center py-16 px-4">
    {icon && <div className="text-5xl mb-4 opacity-60">{icon}</div>}
    <h3 className="text-lg font-semibold text-gray-200">{title}</h3>
    {subtitle && <p className="text-gray-500 mt-1 max-w-sm">{subtitle}</p>}
  </div>
);

export default EmptyState;
