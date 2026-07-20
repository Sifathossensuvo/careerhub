import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import Companies from "./pages/Companies";
import CompanyDetails from "./pages/CompanyDetails";
import Pricing from "./pages/Pricing";
import PaymentSubmit from "./pages/PaymentSubmit";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";
import Dashboard from "./pages/Dashboard";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-dark-900">
      <Toaster position="top-right" toastOptions={{ style: { background: "#1a2234", color: "#f3f4f6", border: "1px solid rgba(255,255,255,0.08)" } }} />
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/companies/:id" element={<CompanyDetails />} />
          <Route path="/pricing" element={<Pricing />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />

          <Route
            path="/payment/submit"
            element={
              <ProtectedRoute>
                <PaymentSubmit />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute roles={["jobseeker"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/recruiter/*"
            element={
              <ProtectedRoute roles={["recruiter", "admin"]}>
                <RecruiterDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/*"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
