import { createContext, useContext, useMemo, useState } from 'react';
import { translations } from '../data/translations.js';

const LANGUAGE_KEY = 'shakti.language';
const LanguageContext = createContext(null);

function getInitialLanguage() {
  try {
    const saved = localStorage.getItem(LANGUAGE_KEY);
    return translations[saved] ? saved : 'en';
  } catch {
    return 'en';
  }
}

function readPath(source, path) {
  return path.split('.').reduce((current, segment) => current?.[segment], source);
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(getInitialLanguage);

  const value = useMemo(() => {
    const dictionary = translations[language] ?? translations.en;

    return {
      language,
      setLanguage(nextLanguage) {
        const safeLanguage = translations[nextLanguage] ? nextLanguage : 'en';
        setLanguageState(safeLanguage);
        try {
          localStorage.setItem(LANGUAGE_KEY, safeLanguage);
        } catch {
          console.log('Language preference could not be saved.');
        }
      },
      t(path) {
        return readPath(dictionary, path) ?? readPath(translations.en, path) ?? path;
      },
    };
  }, [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
