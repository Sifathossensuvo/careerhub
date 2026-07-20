import { Link } from "react-router-dom";
import { FiFacebook, FiLinkedin, FiTwitter, FiMail } from "react-icons/fi";

const Footer = () => (
  <footer className="bg-dark-800 border-t border-white/5 mt-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-2 md:grid-cols-5 gap-8">
      <div className="col-span-2">
        <div className="flex items-center gap-2 font-extrabold text-xl text-white mb-3">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-sm">
            CH
          </span>
          CareerHub BD
        </div>
        <p className="text-gray-500 text-sm max-w-xs">
          Bangladesh's largest career platform — connecting job seekers and recruiters with AI-powered tools.
        </p>
        <div className="flex gap-3 mt-4 text-gray-400">
          <FiFacebook className="hover:text-primary-400 cursor-pointer" />
          <FiLinkedin className="hover:text-primary-400 cursor-pointer" />
          <FiTwitter className="hover:text-primary-400 cursor-pointer" />
          <FiMail className="hover:text-primary-400 cursor-pointer" />
        </div>
      </div>

      <div>
        <h4 className="text-white font-semibold mb-3">Job Seekers</h4>
        <ul className="space-y-2 text-sm text-gray-500">
          <li><Link to="/jobs" className="hover:text-primary-400">Browse Jobs</Link></li>
          <li><Link to="/pricing" className="hover:text-primary-400">Premium Plans</Link></li>
          <li><Link to="/companies" className="hover:text-primary-400">Companies</Link></li>
        </ul>
      </div>

      <div>
        <h4 className="text-white font-semibold mb-3">Recruiters</h4>
        <ul className="space-y-2 text-sm text-gray-500">
          <li><Link to="/register" className="hover:text-primary-400">Post a Job</Link></li>
          <li><Link to="/pricing" className="hover:text-primary-400">Recruiter Plans</Link></li>
        </ul>
      </div>

      <div>
        <h4 className="text-white font-semibold mb-3">Company</h4>
        <ul className="space-y-2 text-sm text-gray-500">
          <li>About Us</li>
          <li>Contact</li>
          <li>Terms & Privacy</li>
        </ul>
      </div>
    </div>
    <div className="border-t border-white/5 py-5 text-center text-gray-600 text-sm">
      © {new Date().getFullYear()} CareerHub BD. All rights reserved.
    </div>
  </footer>
);

export default Footer;
