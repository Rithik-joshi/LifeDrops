import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { api, getErrorMessage } from '../services/api';
import Spinner from '../components/Spinner';
import EmptyState from '../components/EmptyState';
import ErrorMessage from '../components/ErrorMessage';

const MyRequests = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/requests/mine');
      setItems(res.data.data);
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
      <h1 className="text-2xl font-bold text-ink-900">My Blood Requests</h1>
      <p className="mt-1 text-sm text-ink-500">Requests you've created.</p>

      {error && <div className="mt-4"><ErrorMessage message={error} onRetry={load} /></div>}

      {items.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            icon={Heart}
            title="No requests yet"
            description="Create a blood request from the Requests page."
            action={<Link to="/requests" className="btn-primary">Go to requests</Link>}
          />
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {items.map((r) => (
            <div key={r.id} className="card flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-ink-900">{r.hospitalName}</p>
                <p className="text-sm text-ink-500">
                  {r.city}, {r.state} · {r.bloodGroup.replace('_POS', '+').replace('_NEG', '−')} · {r.unitsRequired} unit{r.unitsRequired > 1 ? 's' : ''}
                </p>
                <p className="mt-1 text-xs text-ink-500">
                  Status: <span className="font-medium">{r.status}</span> · {r._count?.responses ?? 0} responses
                </p>
              </div>
              <Link to={`/requests/${r.id}`} className="btn-secondary !py-1.5 !px-3">View</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRequests;
