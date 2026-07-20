import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchMyPayments } from "../services/paymentService";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import useAuth from "../hooks/useAuth";

const STATUS_STYLE = {
  pending: "bg-amber-500/15 text-amber-400",
  approved: "bg-primary-500/15 text-primary-400",
  rejected: "bg-rose-500/15 text-rose-400",
};

const PaymentHistory = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyPayments().then(setPayments).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-white">Subscription & Payments</h1>
        <Link to="/pricing" className="btn-primary !py-2 !px-4 text-sm">Upgrade Plan</Link>
      </div>

      <div className="glass rounded-2xl p-5 mb-6">
        <p className="text-sm text-gray-400">Current Plan</p>
        <p className="text-2xl font-bold text-white capitalize mt-1">
          {user?.isPremium ? user.premiumPlan : "Free"}
        </p>
        {user?.isPremium && user?.premiumExpiresAt && (
          <p className="text-xs text-gray-500 mt-1">Expires: {new Date(user.premiumExpiresAt).toLocaleDateString()}</p>
        )}
      </div>

      {loading ? (
        <Loader />
      ) : payments.length === 0 ? (
        <EmptyState title="No payment history" subtitle="Your bKash/Nagad payment submissions will appear here." />
      ) : (
        <div className="space-y-3">
          {payments.map((p) => (
            <div key={p._id} className="glass rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="font-semibold text-white capitalize">{p.planName} Plan — ৳{p.amount}</p>
                <p className="text-xs text-gray-500">{p.method.toUpperCase()} • TrxID: {p.transactionId}</p>
              </div>
              <span className={`badge capitalize ${STATUS_STYLE[p.status]}`}>{p.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;
