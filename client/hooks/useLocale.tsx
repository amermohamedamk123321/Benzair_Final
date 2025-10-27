import React, { createContext, useContext, useEffect, useMemo, ReactNode, useState } from 'react';
import i18n from '@/i18n';
import { useTranslation } from 'react-i18next';

export type Lang = 'en' | 'fa';
interface LocaleCtx {
  lang: Lang;
  dir: 'ltr' | 'rtl';
  setLang: (l: Lang) => void;
  t: (key: string, opts?: any) => any;
}

const LocaleContext = createContext<LocaleCtx | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    try { return (localStorage.getItem('site-lang') as Lang) || (i18n.language as Lang) || 'en'; } catch { return 'en'; }
  });

  useEffect(() => {
    const onChange = (lng: string) => setLangState((lng as Lang) || 'en');
    i18n.on('languageChanged', onChange);
    return () => { i18n.off('languageChanged', onChange); };
  }, []);

  useEffect(()=>{
    document.documentElement.setAttribute('dir', lang === 'fa' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', lang);
  }, [lang]);

  const setLang = (l: Lang) => {
    i18n.changeLanguage(l);
    try { localStorage.setItem('site-lang', l); } catch {}
    setLangState(l);
  };

  const { t: i18nT } = useTranslation();
  const t = (key: string, opts?: any) => i18nT(key, opts);
  const dir = lang === 'fa' ? 'rtl' : 'ltr';

  const value = useMemo(()=>({ lang, dir, setLang, t }), [lang]);
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(){
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider');
  return ctx;
}
