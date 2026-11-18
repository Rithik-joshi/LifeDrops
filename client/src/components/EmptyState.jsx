import { Inbox } from 'lucide-react';

const EmptyState = ({ icon: Icon = Inbox, title, description, action }) => (
  <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-ink-200 bg-white p-10 text-center">
    <div className="mb-3 rounded-full bg-crimson-50 p-3 text-crimson-600">
      <Icon size={24} />
    </div>
    <h3 className="text-base font-semibold text-ink-900">{title}</h3>
    {description && <p className="mt-1 max-w-sm text-sm text-ink-500">{description}</p>}
    {action && <div className="mt-4">{action}</div>}
  </div>
);

export default EmptyState;
