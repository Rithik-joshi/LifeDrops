import { useEffect, useState } from 'react';
import { api, getErrorMessage } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';
import ErrorMessage from '../components/ErrorMessage';
import Spinner from '../components/Spinner';

const bloodGroups = ['A_POS', 'A_NEG', 'B_POS', 'B_NEG', 'AB_POS', 'AB_NEG', 'O_POS', 'O_NEG'];
const bloodGroupLabel = (bg) => bg.replace('_POS', '+').replace('_NEG', '−');

const DonorProfile = () => {
  const { refreshUser } = useAuth();
  const [existing, setExisting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    bloodGroup: 'O_POS',
    city: '',
    state: '',
    isAvailable: true,
    isDiscoverable: true,
    lastDonationDate: '',
    preferredContact: 'EMAIL',
  });

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get('/donors/me');
      setExisting(res.data.data);
      setForm({
        bloodGroup: res.data.data.bloodGroup,
        city: res.data.data.city,
        state: res.data.data.state,
        isAvailable: res.data.data.isAvailable,
        isDiscoverable: res.data.data.isDiscoverable,
        lastDonationDate: res.data.data.lastDonationDate
          ? res.data.data.lastDonationDate.slice(0, 10)
          : '',
        preferredContact: res.data.data.preferredContact,
      });
    } catch {
      setExisting(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);
    try {
      const payload = {
        ...form,
        lastDonationDate: form.lastDonationDate
          ? new Date(form.lastDonationDate).toISOString()
          : null,
      };
      if (existing) await api.patch('/donors/me', payload);
      else await api.post('/donors', payload);
      setSuccess('Donor profile saved.');
      await load();
      await refreshUser();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink-900">Donor Profile</h1>
      <p className="mt-1 text-sm text-ink-500">
        {existing ? 'Update your donor details below.' : 'Register as a donor to appear in search results.'}
      </p>

      <form onSubmit={onSubmit} className="card mt-6 space-y-4">
        {error && <ErrorMessage message={error} />}
        {success && (
          <div className="rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700">
            {success}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Blood group</label>
            <select
              className="input-field"
              value={form.bloodGroup}
              onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}
            >
              {bloodGroups.map((bg) => <option key={bg} value={bg}>{bloodGroupLabel(bg)}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Preferred contact</label>
            <select
              className="input-field"
              value={form.preferredContact}
              onChange={(e) => setForm({ ...form, preferredContact: e.target.value })}
            >
              <option value="EMAIL">Email</option>
              <option value="PHONE">Phone</option>
            </select>
          </div>
          <Input label="City" required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
          <Input label="State" required value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
          <Input
            label="Last donation date (optional)"
            type="date"
            value={form.lastDonationDate}
            onChange={(e) => setForm({ ...form, lastDonationDate: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm text-ink-700">
            <input
              type="checkbox"
              checked={form.isAvailable}
              onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })}
            />
            I am currently available to donate
          </label>
          <label className="flex items-center gap-2 text-sm text-ink-700">
            <input
              type="checkbox"
              checked={form.isDiscoverable}
              onChange={(e) => setForm({ ...form, isDiscoverable: e.target.checked })}
            />
            Allow my profile to appear in public donor search
          </label>
          <p className="text-xs text-ink-500">
            LifeDrops does not verify medical eligibility. Always confirm with a licensed blood bank or hospital.
          </p>
        </div>

        <div className="flex justify-end">
          <Button type="submit" loading={saving}>
            {existing ? 'Save changes' : 'Register as donor'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default DonorProfile;
