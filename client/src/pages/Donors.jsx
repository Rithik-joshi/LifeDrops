import { useEffect, useState } from 'react';
import { Search, Users } from 'lucide-react';
import { api, getErrorMessage } from '../services/api';
import DonorCard from '../components/DonorCard';
import Spinner from '../components/Spinner';
import EmptyState from '../components/EmptyState';
import ErrorMessage from '../components/ErrorMessage';
import Button from '../components/Button';

const bloodGroups = ['A_POS', 'A_NEG', 'B_POS', 'B_NEG', 'AB_POS', 'AB_NEG', 'O_POS', 'O_NEG'];
const bloodGroupLabel = (bg) => bg.replace('_POS', '+').replace('_NEG', '−');

const Donors = () => {
  const [donors, setDonors] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(9);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [filters, setFilters] = useState({ city: '', bloodGroup: '', availableOnly: false });

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const params = { page, pageSize };
      if (filters.city) params.city = filters.city;
      if (filters.bloodGroup) params.bloodGroup = filters.bloodGroup;
      if (filters.availableOnly) params.availableOnly = 'true';
      const res = await api.get('/donors', { params });
      setDonors(res.data.data.items);
      setTotal(res.data.data.total);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, filters.bloodGroup, filters.availableOnly]);

  const onSearch = (e) => {
    e.preventDefault();
    setPage(1);
    load();
  };

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-ink-900">Find Blood Donors</h1>
        <p className="mt-2 text-ink-500">
          Search donors who have opted into public discovery. Contact info is only shown for donors who consented.
        </p>
      </div>

      <form onSubmit={onSearch} className="card mb-8 grid gap-4 md:grid-cols-4">
        <div className="md:col-span-2">
          <label className="label">City</label>
          <input
            className="input-field"
            placeholder="e.g. Mumbai"
            value={filters.city}
            onChange={(e) => setFilters({ ...filters, city: e.target.value })}
          />
        </div>
        <div>
          <label className="label">Blood group</label>
          <select
            className="input-field"
            value={filters.bloodGroup}
            onChange={(e) => {
              setPage(1);
              setFilters({ ...filters, bloodGroup: e.target.value });
            }}
          >
            <option value="">Any</option>
            {bloodGroups.map((bg) => (
              <option key={bg} value={bg}>{bloodGroupLabel(bg)}</option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <label className="flex items-center gap-2 text-sm text-ink-700">
            <input
              type="checkbox"
              checked={filters.availableOnly}
              onChange={(e) => {
                setPage(1);
                setFilters({ ...filters, availableOnly: e.target.checked });
              }}
            />
            Available only
          </label>
        </div>
        <div className="md:col-span-4 flex justify-end">
          <Button type="submit">
            <Search size={16} /> Search donors
          </Button>
        </div>
      </form>

      {error && <div className="mb-4"><ErrorMessage message={error} onRetry={load} /></div>}

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : donors.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No donors found"
          description="Try adjusting your filters or search in a different city."
        />
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {donors.map((d) => <DonorCard key={d.id} donor={d} />)}
          </div>
          <div className="mt-8 flex items-center justify-between text-sm text-ink-500">
            <p>{total} donor{total === 1 ? '' : 's'} found</p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn-secondary !py-1.5 !px-3 disabled:opacity-50"
              >
                Previous
              </button>
              <span>Page {page} of {totalPages}</span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="btn-secondary !py-1.5 !px-3 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Donors;
