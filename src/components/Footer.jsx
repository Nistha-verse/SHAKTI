import { useLanguage } from '../providers/LanguageProvider.jsx';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-shaktiText/10 bg-white/55 px-4 py-6 text-center text-sm text-shaktiText/70">
      {t('footer')}
    </footer>
  );
}
