import { useEffect, useState } from 'react';
import { Users, Heart, Activity, ShieldAlert } from 'lucide-react';
import { api, getErrorMessage } from '../services/api';
import Spinner from '../components/Spinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';

const Admin = () => {
  const [tab, setTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [s, u, r] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
        api.get('/admin/requests'),
      ]);
      setStats(s.data.data);
      setUsers(u.data.data.items);
      setRequests(r.data.data.items);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  const disableDonor = async (id) => {
    try {
      await api.patch(`/admin/donors/${id}/disable`);
      await load();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center gap-2">
        <ShieldAlert className="text-crimson-600" />
        <h1 className="text-2xl font-bold text-ink-900">Admin Dashboard</h1>
      </div>

      {error && <div className="mb-4"><ErrorMessage message={error} onRetry={load} /></div>}

      <div className="mb-6 flex gap-2">
        {['overview', 'users', 'requests'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-xl px-4 py-2 text-sm font-medium capitalize transition ${
              tab === t ? 'bg-crimson-600 text-white' : 'bg-white text-ink-700 hover:bg-ink-100'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'overview' && stats && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: Users, label: 'Total users', value: stats.users },
            { icon: Activity, label: 'Donor profiles', value: stats.donors },
            { icon: Heart, label: 'Blood requests', value: stats.requests },
            { icon: Heart, label: 'Open requests', value: stats.openRequests },
            { icon: Heart, label: 'Fulfilled', value: stats.fulfilled },
            { icon: Activity, label: 'Responses', value: stats.responses },
          ].map((s) => (
            <div key={s.label} className="card">
              <s.icon size={18} className="text-crimson-600" />
              <p className="mt-3 text-2xl font-bold text-ink-900">{s.value}</p>
              <p className="text-xs text-ink-500">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {tab === 'users' && (
        users.length === 0 ? (
          <EmptyState title="No users" />
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-ink-100 bg-white">
            <table className="w-full text-sm">
              <thead className="bg-ink-50 text-left text-xs uppercase text-ink-500">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Donor</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-t border-ink-100">
                    <td className="px-4 py-3 font-medium text-ink-900">{u.name}</td>
                    <td className="px-4 py-3 text-ink-700">{u.email}</td>
                    <td className="px-4 py-3">{u.role}</td>
                    <td className="px-4 py-3">
                      {u.donorProfile ? (
                        <span className={u.donorProfile.isDiscoverable ? 'text-green-700' : 'text-ink-500'}>
                          {u.donorProfile.isDiscoverable ? 'Discoverable' : 'Hidden'}
                        </span>
                      ) : (
                        <span className="text-ink-500">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {u.donorProfile && u.donorProfile.isDiscoverable && (
                        <button
                          onClick={() => disableDonor(u.donorProfile.id)}
                          className="text-xs font-semibold text-crimson-700 hover:underline"
                        >
                          Disable listing
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      {tab === 'requests' && (
        requests.length === 0 ? (
          <EmptyState title="No requests" />
        ) : (
          <div className="space-y-3">
            {requests.map((r) => (
              <div key={r.id} className="card flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-ink-900">{r.hospitalName}</p>
                  <p className="text-sm text-ink-500">
                    {r.requester?.name} · {r.city} · {r.status}
                  </p>
                </div>
                <span className="text-xs text-ink-500">
                  {new Date(r.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default Admin;
