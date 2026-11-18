import { Link } from 'react-router-dom';
import { MapPin, Hospital, Calendar, Droplet, Users } from 'lucide-react';

const bloodGroupLabel = (bg) => bg.replace('_POS', '+').replace('_NEG', '−');

const statusStyles = {
  OPEN: 'bg-green-50 text-green-700',
  FULFILLED: 'bg-blue-50 text-blue-700',
  CANCELLED: 'bg-ink-100 text-ink-500',
};

const BloodRequestCard = ({ request }) => (
  <div className="card flex flex-col justify-between transition hover:shadow-card">
    <div>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2 rounded-xl bg-crimson-50 px-3 py-1.5 text-crimson-700">
          <Droplet size={16} fill="currentColor" />
          <span className="text-sm font-bold">{bloodGroupLabel(request.bloodGroup)}</span>
        </div>
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
            statusStyles[request.status] || statusStyles.OPEN
          }`}
        >
          {request.status}
        </span>
      </div>

      <h3 className="mt-4 text-lg font-semibold text-ink-900">
        {request.unitsRequired} unit{request.unitsRequired > 1 ? 's' : ''} needed
      </h3>

      <div className="mt-3 space-y-1.5 text-sm text-ink-700">
        <p className="flex items-center gap-2">
          <Hospital size={14} className="text-ink-400" />
          {request.hospitalName}
        </p>
        <p className="flex items-center gap-2">
          <MapPin size={14} className="text-ink-400" />
          {request.city}, {request.state}
        </p>
        <p className="flex items-center gap-2">
          <Calendar size={14} className="text-ink-400" />
          Required by {new Date(request.requiredDate).toLocaleDateString()}
        </p>
        {typeof request._count?.responses === 'number' && (
          <p className="flex items-center gap-2 text-ink-500">
            <Users size={14} />
            {request._count.responses} response{request._count.responses === 1 ? '' : 's'}
          </p>
        )}
      </div>
    </div>

    <Link
      to={`/requests/${request.id}`}
      className="mt-5 inline-flex items-center justify-center rounded-xl bg-ink-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-ink-700"
    >
      View details
    </Link>
  </div>
);

export default BloodRequestCard;
