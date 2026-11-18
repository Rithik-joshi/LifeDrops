import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, User, Droplet, Heart, Shield } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const linkClass = ({ isActive }) =>
  `flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition ${
    isActive
      ? 'bg-crimson-50 text-crimson-700'
      : 'text-ink-700 hover:bg-ink-100'
  }`;

const DashboardLayout = () => {
  const { user } = useAuth();
  return (
    <div className="flex min-h-screen flex-col bg-ink-50">
      <Navbar />
      <div className="mx-auto flex w-full max-w-7xl flex-1 gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <aside className="hidden w-56 shrink-0 lg:block">
          <nav className="sticky top-20 space-y-1">
            <NavLink to="/dashboard" end className={linkClass}>
              <LayoutDashboard size={16} /> Overview
            </NavLink>
            <NavLink to="/dashboard/donor" className={linkClass}>
              <Droplet size={16} /> Donor Profile
            </NavLink>
            <NavLink to="/dashboard/requests" className={linkClass}>
              <Heart size={16} /> My Requests
            </NavLink>
            <NavLink to="/dashboard/profile" className={linkClass}>
              <User size={16} /> Account
            </NavLink>
            {user?.role === 'ADMIN' && (
              <NavLink to="/admin" className={linkClass}>
                <Shield size={16} /> Admin
              </NavLink>
            )}
          </nav>
        </aside>
        <div className="min-w-0 flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
