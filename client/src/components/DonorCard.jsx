import { MapPin, Mail, Phone, Droplet, Calendar } from 'lucide-react';

const bloodGroupLabel = (bg) => bg.replace('_POS', '+').replace('_NEG', '−');

const DonorCard = ({ donor }) => (
  <div className="card transition hover:shadow-card">
    <div className="flex items-start justify-between">
      <div>
        <h3 className="text-lg font-semibold text-ink-900">{donor.donor.name}</h3>
        <p className="mt-1 flex items-center gap-1 text-sm text-ink-500">
          <MapPin size={14} />
          {donor.city}, {donor.state}
        </p>
      </div>
      <div className="flex items-center gap-1 rounded-xl bg-crimson-50 px-3 py-1.5 text-crimson-700">
        <Droplet size={16} fill="currentColor" />
        <span className="text-sm font-bold">{bloodGroupLabel(donor.bloodGroup)}</span>
      </div>
    </div>

    <div className="mt-4 space-y-2 text-sm text-ink-700">
      <div className="flex items-center gap-2">
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
            donor.isAvailable
              ? 'bg-green-50 text-green-700'
              : 'bg-ink-100 text-ink-500'
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              donor.isAvailable ? 'bg-green-500' : 'bg-ink-400'
            }`}
          />
          {donor.isAvailable ? 'Available' : 'Not available'}
        </span>
        {donor.lastDonationDate && (
          <span className="flex items-center gap-1 text-xs text-ink-500">
            <Calendar size={12} />
            Last: {new Date(donor.lastDonationDate).toLocaleDateString()}
          </span>
        )}
      </div>

      {donor.donor.email && (
        <p className="flex items-center gap-2 text-ink-700">
          <Mail size={14} className="text-ink-400" />
          {donor.donor.email}
        </p>
      )}
      {donor.donor.phone && (
        <p className="flex items-center gap-2 text-ink-700">
          <Phone size={14} className="text-ink-400" />
          {donor.donor.phone}
        </p>
      )}
    </div>
  </div>
);

export default DonorCard;
