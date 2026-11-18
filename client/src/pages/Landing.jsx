import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Droplet, Heart, Search, ShieldCheck, Users, MapPin, Activity,
  ChevronDown, ArrowRight,
} from 'lucide-react';
import { api } from '../services/api';

const faqs = [
  {
    q: 'Is LifeDrops a medical service?',
    a: 'No. LifeDrops is a discovery and coordination platform. We do not provide medical advice, blood testing, or guaranteed availability. Always contact hospitals and emergency services directly.',
  },
  {
    q: 'How do I find a donor?',
    a: 'Use the Find Donors page to search by blood group and city. Only donors who have opted into public discovery will appear.',
  },
  {
    q: 'Is my contact information public?',
    a: 'No. Contact details are not displayed in public donor search. Donors can respond to blood requests through the platform.',
  },
  {
    q: 'Can I delete my donor profile?',
    a: 'Yes. You can pause your donor listing at any time from your dashboard, which hides you from search results.',
  },
];

const Landing = () => {
  const [stats, setStats] = useState({ donors: 0, openRequests: 0, fulfilledRequests: 0, cities: 0 });
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    api.get('/stats').then((res) => setStats(res.data.data)).catch(() => {});
  }, []);

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white to-crimson-50/40">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-crimson-200 bg-white px-3 py-1 text-xs font-medium text-crimson-700">
                <Heart size={12} fill="currentColor" /> Built for social impact
              </span>
              <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight text-ink-900 sm:text-5xl lg:text-6xl">
                Every Drop Has the <span className="text-crimson-600">Power to Save</span> a Life
              </h1>
              <p className="mt-5 max-w-xl text-lg text-ink-500">
                LifeDrops connects blood donors with people in need — quickly, safely, and transparently.
                Find donors, post emergency requests, and help your community.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/donors" className="btn-primary">
                  <Search size={16} /> Find Blood Donors
                </Link>
                <Link to="/register" className="btn-secondary">
                  <Droplet size={16} /> Become a Donor
                </Link>
                <Link to="/requests" className="btn-secondary">
                  <Activity size={16} /> Blood Requests
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-crimson-100/60 blur-2xl" />
              <div className="relative rounded-3xl border border-crimson-100 bg-white p-6 shadow-card">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: Users, label: 'Active Donors', value: stats.donors },
                    { icon: Activity, label: 'Open Requests', value: stats.openRequests },
                    { icon: Heart, label: 'Fulfilled', value: stats.fulfilledRequests },
                    { icon: MapPin, label: 'Cities', value: stats.cities },
                  ].map((s) => (
                    <div key={s.label} className="rounded-2xl border border-ink-100 bg-ink-50 p-4">
                      <s.icon size={18} className="text-crimson-600" />
                      <p className="mt-3 text-2xl font-bold text-ink-900">{s.value}</p>
                      <p className="text-xs text-ink-500">{s.label}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 rounded-2xl bg-gradient-to-r from-crimson-600 to-crimson-500 p-4 text-white">
                  <p className="text-sm font-medium opacity-90">Live platform statistics</p>
                  <p className="mt-1 text-xs opacity-75">Derived from real database records</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-ink-900 sm:text-4xl">How LifeDrops Works</h2>
            <p className="mt-3 text-ink-500">
              Three simple steps to connect donors with people in need.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { icon: Users, title: 'Register as a Donor', desc: 'Create your donor profile with blood group, city, and availability. You control what is visible.' },
              { icon: Search, title: 'Find or Request', desc: 'Search donors by blood group and city, or post a blood request with hospital details.' },
              { icon: Heart, title: 'Connect & Help', desc: 'Donors express interest, requesters review responses, and both sides coordinate safely.' },
            ].map((step, i) => (
              <div key={step.title} className="card">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-crimson-50 text-crimson-600">
                  <step.icon size={20} />
                </div>
                <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-crimson-600">
                  Step {i + 1}
                </p>
                <h3 className="mt-1 text-lg font-semibold text-ink-900">{step.title}</h3>
                <p className="mt-2 text-sm text-ink-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AWARENESS */}
      <section className="bg-ink-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold text-ink-900 sm:text-4xl">
                Blood donation saves lives — safely and simply
              </h2>
              <p className="mt-4 text-ink-500">
                A single donation can help up to three patients. Regular donors support surgeries,
                trauma care, and chronic conditions. Donating is safe when performed by trained
                medical staff at licensed blood banks.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-ink-700">
                {[
                  'Donors are screened by medical professionals before every donation.',
                  'Most healthy adults can donate every 3 months (whole blood).',
                  'Always consult a doctor about your personal eligibility.',
                  'LifeDrops does not verify medical eligibility — hospitals do.',
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2">
                    <ShieldCheck size={18} className="mt-0.5 shrink-0 text-crimson-600" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl bg-white p-8 shadow-card">
              <h3 className="text-lg font-semibold text-ink-900">Important disclaimer</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-500">
                LifeDrops is not a hospital, blood bank, or medical provider. We cannot guarantee
                blood availability, compatibility, or emergency response. In an emergency, contact
                your local hospital and emergency services immediately.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-ink-900 sm:text-4xl">Frequently Asked Questions</h2>
            <p className="mt-3 text-ink-500">Everything you need to know about LifeDrops.</p>
          </div>
          <div className="mt-10 space-y-3">
            {faqs.map((f, i) => (
              <div key={f.q} className="rounded-2xl border border-ink-100 bg-white">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                  className="flex w-full items-center justify-between px-5 py-4 text-left"
                >
                  <span className="font-medium text-ink-900">{f.q}</span>
                  <ChevronDown
                    size={18}
                    className={`text-ink-500 transition ${openFaq === i ? 'rotate-180' : ''}`}
                  />
                </button>
                {openFaq === i && (
                  <p className="border-t border-ink-100 px-5 py-4 text-sm text-ink-500">{f.a}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-crimson-700 to-crimson-500 py-16">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Ready to make a difference?</h2>
          <p className="max-w-xl text-white/80">
            Join LifeDrops today — whether you want to donate, request help, or simply be ready when someone needs you.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/register" className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-crimson-700 shadow hover:bg-ink-50">
              Create free account <ArrowRight size={16} />
            </Link>
            <Link to="/requests" className="inline-flex items-center gap-2 rounded-xl border border-white/40 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10">
              View active requests
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
