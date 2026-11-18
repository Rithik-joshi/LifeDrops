import { useState } from 'react';
import { api, getErrorMessage } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';
import ErrorMessage from '../components/ErrorMessage';

const Profile = () => {
  const { user, refreshUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    currentPassword: '',
    newPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);
    try {
      const payload = { name: form.name, phone: form.phone || null };
      if (form.newPassword) {
        payload.currentPassword = form.currentPassword;
        payload.newPassword = form.newPassword;
      }
      await api.patch('/auth/profile', payload);
      await refreshUser();
      setSuccess('Profile updated.');
      setForm({ ...form, currentPassword: '', newPassword: '' });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink-900">Account Settings</h1>
      <p className="mt-1 text-sm text-ink-500">Update your personal details and password.</p>

      <form onSubmit={onSubmit} className="card mt-6 space-y-4">
        {error && <ErrorMessage message={error} />}
        {success && (
          <div className="rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700">
            {success}
          </div>
        )}

        <Input label="Full name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <Input label="Email (read-only)" value={user?.email || ''} disabled />
        <Input label="Phone (optional)" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />

        <div className="border-t border-ink-100 pt-4">
          <h2 className="text-sm font-semibold text-ink-900">Change password</h2>
          <p className="mb-3 text-xs text-ink-500">Leave blank to keep your current password.</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Current password"
              type="password"
              value={form.currentPassword}
              onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
            />
            <Input
              label="New password"
              type="password"
              value={form.newPassword}
              onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" loading={saving}>Save changes</Button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
