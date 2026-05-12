import { Link } from 'react-router-dom';
import logo from '../assets/shakti-logo.svg';
import PageShell from '../components/PageShell.jsx';
import { useLanguage } from '../providers/LanguageProvider.jsx';

export default function HomePage() {
  const { t } = useLanguage();

  const highlights = [
    { title: t('home.chatTitle'), text: t('home.chatText'), accent: 'bg-shaktiCyan' },
    { title: t('home.mapTitle'), text: t('home.mapText'), accent: 'bg-shaktiRose' },
    { title: t('home.requestTitle'), text: t('home.requestText'), accent: 'bg-shaktiGreen' },
  ];

  return (
    <PageShell className="pb-12">
      <section className="grid min-h-[calc(100vh-12rem)] items-center gap-10 py-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="order-2 lg:order-1">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-shaktiRose">
            {t('home.care')}
          </p>
          <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-normal text-shaktiText sm:text-5xl lg:text-6xl">
            {t('tagline')}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-shaktiText/78">{t('home.intro')}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/chat"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-shaktiRose px-6 py-3 text-base font-bold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-rose-600"
            >
              {t('actions.chat')}
            </Link>
            <Link
              to="/resources"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-shaktiText/15 bg-white px-6 py-3 text-base font-bold text-shaktiText transition hover:-translate-y-0.5 hover:bg-shaktiCyan/35"
            >
              {t('actions.resources')}
            </Link>
          </div>
        </div>

        <div className="order-1 flex justify-center lg:order-2">
          <div className="animate-logo-arrive">
            <img
              src={logo}
              alt="Shakti"
              className="h-60 w-60 animate-logo-float rounded-[3rem] shadow-soft sm:h-72 sm:w-72 lg:h-80 lg:w-80"
            />
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {highlights.map((item) => (
          <article key={item.title} className="rounded-lg border border-shaktiText/10 bg-white p-5 shadow-sm">
            <span className={`mb-4 block h-2 w-12 rounded-full ${item.accent}`} aria-hidden="true" />
            <h2 className="text-xl font-black tracking-normal">{item.title}</h2>
            <p className="mt-3 leading-7 text-shaktiText/72">{item.text}</p>
          </article>
        ))}
      </section>
    </PageShell>
  );
}
