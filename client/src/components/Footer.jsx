import { Link } from 'react-router-dom';
import { Droplet, Heart } from 'lucide-react';

const Footer = () => (
  <footer className="border-t border-ink-100 bg-white">
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-8 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-crimson-600 text-white">
              <Droplet size={16} fill="currentColor" />
            </span>
            <span className="text-base font-bold text-ink-900">LifeDrops</span>
          </div>
          <p className="mt-3 text-sm text-ink-500">
            A blood donation and emergency request platform built to connect donors with people in need.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-ink-900">Product</h4>
          <ul className="mt-3 space-y-2 text-sm text-ink-500">
            <li><Link to="/donors" className="hover:text-crimson-700">Find Donors</Link></li>
            <li><Link to="/requests" className="hover:text-crimson-700">Blood Requests</Link></li>
            <li><Link to="/register" className="hover:text-crimson-700">Become a Donor</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-ink-900">Account</h4>
          <ul className="mt-3 space-y-2 text-sm text-ink-500">
            <li><Link to="/login" className="hover:text-crimson-700">Login</Link></li>
            <li><Link to="/register" className="hover:text-crimson-700">Register</Link></li>
            <li><Link to="/dashboard" className="hover:text-crimson-700">Dashboard</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-ink-900">Important</h4>
          <p className="mt-3 text-xs leading-relaxed text-ink-500">
            LifeDrops does not guarantee blood availability, medical eligibility, or emergency response.
            Always contact hospitals and emergency services directly.
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-ink-100 pt-6 text-xs text-ink-500 sm:flex-row">
        <p>© {new Date().getFullYear()} LifeDrops. All rights reserved.</p>
        <p className="flex items-center gap-1">
          Built with <Heart size={12} className="text-crimson-600" fill="currentColor" /> for social impact
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
