import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Droplet, Heart, Activity, ArrowRight } from 'lucide-react';
import { api, getErrorMessage } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';
import ErrorMessage from '../components/ErrorMessage';

const Dashboard = () => {
  const { user } = useAuth();
  const [donor, setDonor] = useState(null);
  const [myRequests, setMyRequests] = useState([]);
  const [myResponses, setMyResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [d, r, resp] = await Promise.allSettled([
        api.get('/donors/me'),
        api.get('/requests/mine'),
        api.get('/responses/mine'),
      ]);
      if (d.status === 'fulfilled') setDonor(d.value.data.data);
      if (r.status === 'fulfilled') setMyRequests(r.value.data.data);
      if (resp.status === 'fulfilled') setMyResponses(resp.value.data.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink-900">Welcome, {user?.name} 👋</h1>
        <p className="mt-1 text-sm text-ink-500">Here's an overview of your LifeDrops activity.</p>
      </div>

      {error && <div className="mb-4"><ErrorMessage message={error} onRetry={load} /></div>}

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card">
          <div className="flex items-center gap-2 text-crimson-600"><Droplet size={18} /><span className="text-sm font-medium">Donor status</span></div>
          <p className="mt-3 text-lg font-semibold text-ink-900">
            {donor ? (donor.isAvailable ? 'Available' : 'Paused') : 'Not registered'}
          </p>
          <Link to="/dashboard/donor" className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-crimson-700 hover:underline">
            {donor ? 'Manage profile' : 'Become a donor'} <ArrowRight size={14} />
          </Link>
        </div>
        <div className="card">
          <div className="flex items-center gap-2 text-crimson-600"><Heart size={18} /><span className="text-sm font-medium">My requests</span></div>
          <p className="mt-3 text-2xl font-bold text-ink-900">{myRequests.length}</p>
          <Link to="/dashboard/requests" className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-crimson-700 hover:underline">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="card">
          <div className="flex items-center gap-2 text-crimson-600"><Activity size={18} /><span className="text-sm font-medium">My responses</span></div>
          <p className="mt-3 text-2xl font-bold text-ink-900">{myResponses.length}</p>
          <p className="mt-3 text-sm text-ink-500">Requests you offered to help with</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="card">
          <h2 className="text-base font-semibold text-ink-900">Recent requests</h2>
          {myRequests.length === 0 ? (
            <p className="mt-3 text-sm text-ink-500">You haven't created any requests yet.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {myRequests.slice(0, 4).map((r) => (
                <li key={r.id} className="flex items-center justify-between rounded-xl border border-ink-100 p-3 text-sm">
                  <div>
                    <p className="font-medium text-ink-900">{r.hospitalName}</p>
                    <p className="text-xs text-ink-500">{r.city} · {r.status}</p>
                  </div>
                  <Link to={`/requests/${r.id}`} className="text-crimson-700 hover:underline">View</Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card">
          <h2 className="text-base font-semibold text-ink-900">Recent responses</h2>
          {myResponses.length === 0 ? (
            <p className="mt-3 text-sm text-ink-500">You haven't responded to any requests yet.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {myResponses.slice(0, 4).map((r) => (
                <li key={r.id} className="flex items-center justify-between rounded-xl border border-ink-100 p-3 text-sm">
                  <div>
                    <p className="font-medium text-ink-900">{r.request?.hospitalName}</p>
                    <p className="text-xs text-ink-500">{r.request?.city} · {r.status}</p>
                  </div>
                  <Link to={`/requests/${r.requestId}`} className="text-crimson-700 hover:underline">View</Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
