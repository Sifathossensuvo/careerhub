import { useEffect, useState } from "react";
import api from "../services/api";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import { FiBell } from "react-icons/fi";

const Notifications = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/users/notifications").then((r) => setItems(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;
  if (items.length === 0) return <EmptyState title="No notifications" icon={<FiBell />} />;

  return (
    <div>
      <h1 className="text-xl font-bold text-white mb-4">Notifications</h1>
      <div className="space-y-3">
        {items.map((n) => (
          <div key={n._id} className={`glass rounded-xl p-4 ${!n.isRead ? "border border-primary-500/30" : ""}`}>
            <p className="font-semibold text-white text-sm">{n.title}</p>
            <p className="text-gray-400 text-sm mt-1">{n.message}</p>
            <p className="text-xs text-gray-600 mt-2">{new Date(n.createdAt).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
