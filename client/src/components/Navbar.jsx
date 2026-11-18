import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Droplet, LogOut, LayoutDashboard, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition ${
      isActive ? 'text-crimson-700' : 'text-ink-700 hover:text-crimson-700'
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-ink-100 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-crimson-600 text-white">
            <Droplet size={18} fill="currentColor" />
          </span>
          <span className="text-lg font-bold text-ink-900">LifeDrops</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <NavLink to="/donors" className={linkClass}>Find Donors</NavLink>
          <NavLink to="/requests" className={linkClass}>Blood Requests</NavLink>
          <NavLink to="/" className={linkClass}>How it works</NavLink>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              {user.role === 'ADMIN' && (
                <Link
                  to="/admin"
                  className="hidden items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-ink-700 hover:bg-ink-100 sm:flex"
                >
                  <Shield size={16} /> Admin
                </Link>
              )}
              <Link
                to="/dashboard"
                className="hidden items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-ink-700 hover:bg-ink-100 sm:flex"
              >
                <LayoutDashboard size={16} /> Dashboard
              </Link>
              <button onClick={handleLogout} className="btn-secondary !py-1.5 !px-3">
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-ink-700 hover:text-crimson-700">
                Login
              </Link>
              <Link to="/register" className="btn-primary !py-2 !px-4">
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
