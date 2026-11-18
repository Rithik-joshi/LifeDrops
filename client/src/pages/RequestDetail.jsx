import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MapPin, Hospital, Calendar, Droplet, Users, Check, X } from 'lucide-react';
import { api, getErrorMessage } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';
import ErrorMessage from '../components/ErrorMessage';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';

const bloodGroupLabel = (bg) => bg.replace('_POS', '+').replace('_NEG', '−');

const RequestDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  const isOwner = user && request && request.requesterId === user.id;

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get(`/requests/${id}`);
      setRequest(res.data.data);
      if (user && res.data.data.requesterId === user.id) {
        const r = await api.get(`/requests/${id}/responses`);
        setResponses(r.data.data);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user?.id]);

  const respond = async () => {
    setActionError('');
    setBusy(true);
    try {
      await api.post(`/requests/${id}/responses`, { message: message || null });
      setMessage('');
      await load();
    } catch (err) {
      setActionError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const setStatus = async (status) => {
    setActionError('');
    setBusy(true);
    try {
      if (status === 'FULFILLED') await api.post(`/requests/${id}/fulfill`);
      else if (status === 'CANCELLED') await api.post(`/requests/${id}/cancel`);
      await load();
    } catch (err) {
      setActionError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const updateResponse = async (responseId, status) => {
    setActionError('');
    setBusy(true);
    try {
      await api.patch(`/responses/${responseId}`, { status });
      await load();
    } catch (err) {
      setActionError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  if (error) return <div className="mx-auto max-w-3xl px-4 py-12"><ErrorMessage message={error} onRetry={load} /></div>;
  if (!request) return null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <Link to="/requests" className="text-sm text-crimson-700 hover:underline">← Back to requests</Link>

      <div className="card mt-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 rounded-xl bg-crimson-50 px-3 py-1.5 text-crimson-700">
                <Droplet size={16} fill="currentColor" />
                <span className="text-sm font-bold">{bloodGroupLabel(request.bloodGroup)}</span>
              </span>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                request.status === 'OPEN' ? 'bg-green-50 text-green-700' :
                request.status === 'FULFILLED' ? 'bg-blue-50 text-blue-700' :
                'bg-ink-100 text-ink-500'
              }`}>{request.status}</span>
            </div>
            <h1 className="mt-3 text-2xl font-bold text-ink-900">
              {request.unitsRequired} unit{request.unitsRequired > 1 ? 's' : ''} needed
            </h1>
            <p className="mt-1 text-sm text-ink-500">
              Requested by {request.requester?.name}
            </p>
          </div>
          {isOwner && request.status === 'OPEN' && (
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => setStatus('CANCELLED')} disabled={busy}>Cancel</Button>
              <Button onClick={() => setStatus('FULFILLED')} disabled={busy}>Mark fulfilled</Button>
            </div>
          )}
        </div>

        <div className="mt-6 grid gap-3 text-sm text-ink-700 sm:grid-cols-2">
          <p className="flex items-center gap-2"><Hospital size={16} className="text-ink-400" /> {request.hospitalName}</p>
          <p className="flex items-center gap-2"><MapPin size={16} className="text-ink-400" /> {request.city}, {request.state}</p>
          <p className="flex items-center gap-2"><Calendar size={16} className="text-ink-400" /> Required by {new Date(request.requiredDate).toLocaleDateString()}</p>
          <p className="flex items-center gap-2"><Users size={16} className="text-ink-400" /> {request._count?.responses ?? 0} responses</p>
        </div>

        {request.additionalDetails && (
          <div className="mt-6 rounded-xl bg-ink-50 p-4 text-sm text-ink-700">
            <p className="mb-1 font-medium text-ink-900">Additional details</p>
            {request.additionalDetails}
          </div>
        )}

        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
          LifeDrops does not guarantee blood availability or compatibility. Contact the hospital and emergency services directly.
        </div>
      </div>

      {actionError && <div className="mt-4"><ErrorMessage message={actionError} /></div>}

      {/* Donor response form */}
      {user && !isOwner && request.status === 'OPEN' && (
        <div className="card mt-6">
          <h2 className="text-lg font-semibold text-ink-900">Offer to help</h2>
          <p className="mt-1 text-sm text-ink-500">
            Express interest. The requester will see your donor profile and can accept or decline.
          </p>
          <textarea
            className="input-field mt-3"
            rows={3}
            placeholder="Optional message (e.g. I can donate on Saturday)"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <div className="mt-3 flex justify-end">
            <Button onClick={respond} loading={busy}>Express interest</Button>
          </div>
        </div>
      )}

      {!user && (
        <div className="card mt-6 text-center">
          <p className="text-sm text-ink-500">
            <Link to="/login" className="font-semibold text-crimson-700 hover:underline">Login</Link> to respond to this request.
          </p>
        </div>
      )}

      {/* Owner: list of responses */}
      {isOwner && (
        <div className="mt-6">
          <h2 className="mb-3 text-lg font-semibold text-ink-900">Interested donors</h2>
          {responses.length === 0 ? (
            <EmptyState title="No responses yet" description="Donors who express interest will appear here." />
          ) : (
            <div className="space-y-3">
              {responses.map((r) => (
                <div key={r.id} className="card flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-ink-900">{r.donor.name}</p>
                    <p className="text-sm text-ink-500">
                      {r.donor.donorProfile?.bloodGroup && bloodGroupLabel(r.donor.donorProfile.bloodGroup)}
                      {r.donor.donorProfile?.city && ` · ${r.donor.donorProfile.city}`}
                    </p>
                    {r.message && <p className="mt-2 text-sm text-ink-700">"{r.message}"</p>}
                    <p className="mt-2 text-xs text-ink-500">
                      Status: <span className="font-medium">{r.status}</span>
                    </p>
                  </div>
                  {r.status === 'PENDING' && (
                    <div className="flex gap-2">
                      <Button variant="secondary" onClick={() => updateResponse(r.id, 'DECLINED')} disabled={busy}>
                        <X size={14} /> Decline
                      </Button>
                      <Button onClick={() => updateResponse(r.id, 'ACCEPTED')} disabled={busy}>
                        <Check size={14} /> Accept
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RequestDetail;
