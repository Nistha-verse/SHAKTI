import { useState } from 'react';
import PageShell from '../components/PageShell.jsx';
import { useLanguage } from '../providers/LanguageProvider.jsx';

const REQUESTS_KEY = 'shakti.help.requests';
const productOptions = ['pads', 'reusablePads', 'menstrualCup', 'periodKit'];
const pickupOptions = ['delhi', 'mumbai', 'bengaluru', 'kolkata', 'hyderabad'];

function generatePickupCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function saveRequest(request) {
  try {
    const existing = JSON.parse(localStorage.getItem(REQUESTS_KEY) || '[]');
    const next = Array.isArray(existing) ? [request, ...existing] : [request];
    localStorage.setItem(REQUESTS_KEY, JSON.stringify(next));
  } catch {
    localStorage.setItem(REQUESTS_KEY, JSON.stringify([request]));
  }
}

export default function RequestHelpPage() {
  const { t } = useLanguage();
  const [form, setForm] = useState({
    name: '',
    phone: '',
    product: '',
    pickup: '',
    notes: '',
  });
  const [success, setSuccess] = useState(null);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const pickupCode = generatePickupCode();
    const request = {
      ...form,
      pickupCode,
      createdAt: new Date().toISOString(),
    };
    saveRequest(request);
    console.log('Shakti help request:', request);
    setSuccess(request);
    setForm({ name: '', phone: '', product: '', pickup: '', notes: '' });
  }

  return (
    <PageShell>
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <h1 className="text-3xl font-black tracking-normal sm:text-4xl">{t('request.title')}</h1>
          <p className="mt-3 text-base leading-7 text-shaktiText/72">{t('request.subtitle')}</p>
        </div>

        {success && (
          <section className="mb-5 rounded-lg bg-shaktiGreen p-5 text-shaktiText shadow-sm" aria-live="polite">
            <h2 className="text-xl font-black tracking-normal">{t('request.successTitle')}</h2>
            <p className="mt-3 text-sm font-semibold">{t('request.successText')}</p>
            <div className="mt-4 inline-flex items-center gap-3 rounded-lg bg-white/85 px-4 py-3">
              <span className="text-sm font-bold">{t('request.pickupCode')}</span>
              <span className="text-2xl font-black tracking-[0.14em]">{success.pickupCode}</span>
            </div>
          </section>
        )}

        <form onSubmit={handleSubmit} className="rounded-lg border border-shaktiText/10 bg-white/85 p-5 shadow-soft">
          <div className="grid gap-4">
            <label className="grid gap-2 text-sm font-bold">
              {t('request.name')}
              <input
                value={form.name}
                onChange={(event) => updateField('name', event.target.value)}
                className="min-h-12 rounded-2xl border border-shaktiText/15 bg-shaktiCream px-4 font-normal text-shaktiText outline-none transition focus:border-shaktiRose focus:ring-2 focus:ring-shaktiRose/20"
              />
            </label>

            <label className="grid gap-2 text-sm font-bold">
              {t('request.phone')}
              <input
                value={form.phone}
                inputMode="tel"
                onChange={(event) => updateField('phone', event.target.value)}
                className="min-h-12 rounded-2xl border border-shaktiText/15 bg-shaktiCream px-4 font-normal text-shaktiText outline-none transition focus:border-shaktiRose focus:ring-2 focus:ring-shaktiRose/20"
              />
            </label>

            <label className="grid gap-2 text-sm font-bold">
              {t('request.product')} <span className="sr-only">required</span>
              <select
                required
                value={form.product}
                onChange={(event) => updateField('product', event.target.value)}
                className="min-h-12 rounded-2xl border border-shaktiText/15 bg-shaktiCream px-4 font-normal text-shaktiText outline-none transition focus:border-shaktiRose focus:ring-2 focus:ring-shaktiRose/20"
              >
                <option value="">{t('request.selectProduct')}</option>
                {productOptions.map((option) => (
                  <option key={option} value={option}>
                    {t(`request.products.${option}`)}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2 text-sm font-bold">
              {t('request.pickup')} <span className="sr-only">required</span>
              <select
                required
                value={form.pickup}
                onChange={(event) => updateField('pickup', event.target.value)}
                className="min-h-12 rounded-2xl border border-shaktiText/15 bg-shaktiCream px-4 font-normal text-shaktiText outline-none transition focus:border-shaktiRose focus:ring-2 focus:ring-shaktiRose/20"
              >
                <option value="">{t('request.selectPickup')}</option>
                {pickupOptions.map((option) => (
                  <option key={option} value={option}>
                    {t(`request.pickups.${option}`)}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2 text-sm font-bold">
              {t('request.notes')}
              <textarea
                value={form.notes}
                rows={4}
                onChange={(event) => updateField('notes', event.target.value)}
                className="rounded-2xl border border-shaktiText/15 bg-shaktiCream px-4 py-3 font-normal text-shaktiText outline-none transition focus:border-shaktiRose focus:ring-2 focus:ring-shaktiRose/20"
              />
            </label>

            <p className="rounded-lg bg-shaktiCyan/45 px-4 py-3 text-sm font-semibold text-shaktiText">
              {t('request.noPhone')}
            </p>

            <button
              type="submit"
              className="min-h-12 rounded-2xl bg-shaktiRose px-6 font-bold text-white transition hover:bg-rose-600"
            >
              {t('actions.submit')}
            </button>
          </div>
        </form>
      </div>
    </PageShell>
  );
}
