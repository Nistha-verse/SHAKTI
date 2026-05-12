import { NavLink } from 'react-router-dom';
import logo from '../assets/logo.png';
import { languages } from '../data/translations.js';
import { useLanguage } from '../providers/LanguageProvider.jsx';

const navItems = [
  { to: '/', key: 'home' },
  { to: '/chat', key: 'chat' },
  { to: '/resources', key: 'resources' },
  { to: '/request-help', key: 'request' },
];

export default function Header() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="sticky top-0 z-30 border-b border-shaktiText/10 bg-shaktiCream/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3">
          <NavLink to="/" className="flex min-w-0 items-center gap-3" aria-label="Shakti home">
            <img src={logo} alt="" className="h-11 w-11 shrink-0 rounded-2xl shadow-sm" />
            <span className="truncate text-2xl font-bold tracking-normal">{t('appName')}</span>
          </NavLink>

          <label className="flex items-center gap-2 text-sm font-semibold">
            <span className="hidden sm:inline">Language</span>
            <select
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
              className="rounded-xl border border-shaktiText/15 bg-white px-3 py-2 text-sm font-semibold text-shaktiText outline-none transition focus:border-shaktiRose focus:ring-2 focus:ring-shaktiRose/20"
            >
              {languages.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <nav className="flex gap-2 overflow-x-auto pb-1" aria-label="Main navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                [
                  'shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition',
                  isActive
                    ? 'bg-shaktiRose text-white shadow-sm'
                    : 'bg-white text-shaktiText hover:bg-shaktiCyan/35',
                ].join(' ')
              }
            >
              {t(`nav.${item.key}`)}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
