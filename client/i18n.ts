import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import fa from './locales/fa.json';

const getInitialLang = (): string => {
  try {
    const l = localStorage.getItem('site-lang');
    if (l) return l;
  } catch {}
  if (typeof navigator !== 'undefined') {
    const nav = navigator.language || (navigator as any).userLanguage || 'en';
    return nav.startsWith('fa') ? 'fa' : 'en';
  }
  return 'en';
};

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    fa: { translation: fa },
  },
  lng: getInitialLang(),
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
});

export default i18n;
