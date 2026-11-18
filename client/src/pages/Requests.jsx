import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Heart } from 'lucide-react';
import { api, getErrorMessage } from '../services/api';
import { useAuth } from '../context/AuthContext';
import BloodRequestCard from '../components/BloodRequestCard';
import Spinner from '../components/Spinner';
import EmptyState from '../components/EmptyState';
import ErrorMessage from '../components/ErrorMessage';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Input from '../components/Input';

const bloodGroups = ['A_POS', 'A_NEG', 'B_POS', 'B_NEG', 'AB_POS', 'AB_NEG', 'O_POS', 'O_NEG'];
const bloodGroupLabel = (bg) => bg.replace('_POS', '+').replace('_NEG', '−');

const Requests = () => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const pageSize = 9;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ city: '', bloodGroup: '', status: 'OPEN' });

  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({
    bloodGroup: 'O_POS',
    city: '',
    state: '',
    hospitalName: '',
    requiredDate: '',
    unitsRequired: 1,
    contactPreference: 'EMAIL',
    additionalDetails: '',
  });
  const [createError, setCreateError] = useState('');
  const [creating, setCreating] = useState(false);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const params = { page, pageSize, status: filters.status };
      if (filters.city) params.city = filters.city;
      if (filters.bloodGroup) params.bloodGroup = filters.bloodGroup;
      const res = await api.get('/requests', { params });
      setItems(res.data.data.items);
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
  }, [page, filters.bloodGroup, filters.status]);

  const onCreate = async (e) => {
    e.preventDefault();
    setCreateError('');
    setCreating(true);
    try {
      const payload = {
        ...createForm,
        requiredDate: new Date(createForm.requiredDate).toISOString(),
        unitsRequired: Number(createForm.unitsRequired),
      };
      await api.post('/requests', payload);
      setShowCreate(false);
      setPage(1);
      load();
    } catch (err) {
      setCreateError(getErrorMessage(err));
    } finally {
      setCreating(false);
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-ink-900">Blood Requests</h1>
          <p className="mt-2 text-ink-500">Browse active requests and offer help.</p>
        </div>
        {user && (
          <Button onClick={() => setShowCreate(true)}>
            <Plus size={16} /> Create request
          </Button>
        )}
      </div>

      <div className="card mb-8 grid gap-4 md:grid-cols-4">
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
            onChange={(e) => { setPage(1); setFilters({ ...filters, bloodGroup: e.target.value }); }}
          >
            <option value="">Any</option>
            {bloodGroups.map((bg) => <option key={bg} value={bg}>{bloodGroupLabel(bg)}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Status</label>
          <select
            className="input-field"
            value={filters.status}
            onChange={(e) => { setPage(1); setFilters({ ...filters, status: e.target.value }); }}
          >
            <option value="OPEN">Open</option>
            <option value="FULFILLED">Fulfilled</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
        <div className="md:col-span-4 flex justify-end">
          <Button onClick={load}>Apply filters</Button>
        </div>
      </div>

      {error && <div className="mb-4"><ErrorMessage message={error} onRetry={load} /></div>}

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="No requests found"
          description="There are no blood requests matching your filters right now."
          action={user ? <Button onClick={() => setShowCreate(true)}>Create a request</Button> : <Link to="/login" className="btn-primary">Login to create</Link>}
        />
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((r) => <BloodRequestCard key={r.id} request={r} />)}
          </div>
          <div className="mt-8 flex items-center justify-between text-sm text-ink-500">
            <p>{total} request{total === 1 ? '' : 's'}</p>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="btn-secondary !py-1.5 !px-3 disabled:opacity-50">Previous</button>
              <span>Page {page} of {totalPages}</span>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="btn-secondary !py-1.5 !px-3 disabled:opacity-50">Next</button>
            </div>
          </div>
        </>
      )}

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Create blood request">
        <form onSubmit={onCreate} className="space-y-3">
          {createError && <ErrorMessage message={createError} />}
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="label">Blood group</label>
              <select
                className="input-field"
                value={createForm.bloodGroup}
                onChange={(e) => setCreateForm({ ...createForm, bloodGroup: e.target.value })}
              >
                {bloodGroups.map((bg) => <option key={bg} value={bg}>{bloodGroupLabel(bg)}</option>)}
              </select>
            </div>
            <Input
              label="Units required"
              type="number"
              min="1"
              max="20"
              value={createForm.unitsRequired}
              onChange={(e) => setCreateForm({ ...createForm, unitsRequired: e.target.value })}
            />
          </div>
          <Input
            label="Hospital name"
            required
            value={createForm.hospitalName}
            onChange={(e) => setCreateForm({ ...createForm, hospitalName: e.target.value })}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <Input label="City" required value={createForm.city} onChange={(e) => setCreateForm({ ...createForm, city: e.target.value })} />
            <Input label="State" required value={createForm.state} onChange={(e) => setCreateForm({ ...createForm, state: e.target.value })} />
          </div>
          <Input
            label="Required date"
            type="date"
            required
            value={createForm.requiredDate}
            onChange={(e) => setCreateForm({ ...createForm, requiredDate: e.target.value })}
          />
          <div>
            <label className="label">Contact preference</label>
            <select
              className="input-field"
              value={createForm.contactPreference}
              onChange={(e) => setCreateForm({ ...createForm, contactPreference: e.target.value })}
            >
              <option value="EMAIL">Email</option>
              <option value="PHONE">Phone</option>
            </select>
          </div>
          <div>
            <label className="label">Additional details (optional)</label>
            <textarea
              className="input-field"
              rows={3}
              value={createForm.additionalDetails}
              onChange={(e) => setCreateForm({ ...createForm, additionalDetails: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setShowCreate(false)} className="btn-secondary">Cancel</button>
            <Button type="submit" loading={creating}>Create request</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Requests;
