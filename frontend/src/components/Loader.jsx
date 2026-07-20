const Loader = ({ full }) => (
  <div className={full ? "min-h-screen flex items-center justify-center bg-dark-900" : "flex items-center justify-center py-10"}>
    <div className="w-10 h-10 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
  </div>
);

export default Loader;
