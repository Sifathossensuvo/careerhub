import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiCopy } from "react-icons/fi";
import { fetchPaymentInstructions, submitPayment } from "../services/paymentService";
import Loader from "../components/Loader";

const PaymentSubmit = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { plan, price, purpose } = location.state || {};

  const [instructions, setInstructions] = useState(null);
  const [method, setMethod] = useState("bkash");
  const [senderNumber, setSenderNumber] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!plan) return navigate("/pricing");
    fetchPaymentInstructions().then(setInstructions).finally(() => setLoading(false));
  }, [plan, navigate]);

  const copyNumber = (num) => {
    navigator.clipboard.writeText(num);
    toast.success("Number copied");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submitPayment({ purpose, planName: plan, method, senderNumber, transactionId });
      toast.success("Payment submitted for verification!");
      navigate("/dashboard/payments");
    } catch (err) {
      toast.error(err.response?.data?.message || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader full />;

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-16">
      <div className="glass rounded-2xl p-8">
        <h1 className="text-xl font-bold text-white mb-1">Complete Your Payment</h1>
        <p className="text-gray-500 text-sm mb-6">
          Plan: <span className="text-primary-400 font-semibold capitalize">{plan}</span> — ৳{price}/month
        </p>

        <div className="flex gap-2 mb-6">
          {["bkash", "nagad"].map((m) => (
            <button
              key={m}
              onClick={() => setMethod(m)}
              className={`flex-1 py-3 rounded-xl font-semibold capitalize text-sm ${
                method === m ? "bg-primary-500 text-white" : "bg-dark-700 text-gray-400"
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        <div className="bg-dark-700 rounded-xl p-4 flex items-center justify-between mb-6">
          <div>
            <p className="text-xs text-gray-500">Send Money (Personal) to</p>
            <p className="text-xl font-bold text-white tracking-wide">
              {method === "bkash" ? instructions?.bkash : instructions?.nagad}
            </p>
          </div>
          <button
            onClick={() => copyNumber(method === "bkash" ? instructions?.bkash : instructions?.nagad)}
            className="btn-secondary !p-2.5"
          >
            <FiCopy />
          </button>
        </div>

        <ol className="text-sm text-gray-400 list-decimal list-inside space-y-1 mb-6">
          <li>Send ৳{price} to the number above using {method === "bkash" ? "bKash" : "Nagad"}.</li>
          <li>Copy the Transaction ID from your payment confirmation SMS.</li>
          <li>Enter your details below and submit for verification.</li>
        </ol>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Your {method === "bkash" ? "bKash" : "Nagad"} Number</label>
            <input required className="input-field" value={senderNumber} onChange={(e) => setSenderNumber(e.target.value)} placeholder="01XXXXXXXXX" />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Transaction ID</label>
            <input required className="input-field" value={transactionId} onChange={(e) => setTransactionId(e.target.value)} placeholder="e.g. 8N7A6B5C4D" />
          </div>
          <button disabled={submitting} className="btn-primary w-full">
            {submitting ? "Submitting..." : "Submit for Verification"}
          </button>
        </form>

        <p className="text-xs text-gray-600 mt-4 text-center">
          Your plan will be activated once our team verifies the payment (usually within a few hours).
        </p>
      </div>
    </div>
  );
};

export default PaymentSubmit;
