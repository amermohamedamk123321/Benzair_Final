import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import DarkModeToggle from '@/components/ui/dark-mode-toggle';
import { useLocale } from '@/hooks/useLocale';
import { cn } from '@/lib/utils';

interface NavigationItem {
  key: string;
  href: string;
}

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const location = useLocation();
  const { lang, setLang, t, dir } = useLocale() as any;

  const navigation: NavigationItem[] = [
    { key: 'home', href: '/' },
    { key: 'products', href: '/products' },
    { key: 'services', href: '/services' },
    { key: 'about', href: '/about' },
    { key: 'contact', href: '/contact' },
  ];

  const isActive = (path: string): boolean => location.pathname === path;

  const getDelayClass = (i: number): string => {
    const delays = ["anim-delay-0", "anim-delay-50", "anim-delay-100", "anim-delay-150", "anim-delay-200"];
    return delays[i % delays.length];
  };

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = (): void => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled
        ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg shadow-xl border-b border-blue-900/20'
        : 'bg-white dark:bg-slate-900 shadow-md'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-2">
          {/* Logo */}
          <Link to="/" className={cn('flex items-center space-x-3 group py-2', { 'space-x-reverse': dir==='rtl' })}>
            <div className="relative">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F13a4766942d54028b94747b6985a55d1%2F7f4187b304d44591b92b0d93350bb0d8?format=webp&width=800"
                alt="Benazir Yakta Trading Company Logo"
                className="h-12 w-auto object-contain"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">Benazir Yakta</h1>
              <p className="text-sm text-blue-900 dark:text-blue-300">{t('tradingCompany')}</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className={cn('hidden md:flex items-center space-x-2', { 'space-x-reverse': dir==='rtl' })}>
            {navigation.map((item) => (
              <Link
                key={item.key}
                to={item.href}
                className={`px-4 py-2 text-sm font-medium rounded-lg ${
                  isActive(item.href)
                    ? 'text-white bg-blue-900'
                    : 'text-slate-700 dark:text-slate-300 hover:text-blue-900 hover:bg-blue-50 dark:hover:bg-slate-800'
                }`}
              >
                {t(item.key)}
              </Link>
            ))}
            <div className="ml-3 flex items-center">
              <button
                onClick={() => setLang(lang === 'en' ? 'fa' : 'en')}
                aria-label="Toggle language"
                className="w-9 h-9 rounded-full bg-blue-900 text-white flex items-center justify-center hover:bg-blue-800 transition"
                title={lang === 'en' ? 'Switch to فارسی' : 'Switch to English'}
              >
                <span className="text-xs font-bold">{lang === 'en' ? 'EN' : 'فا'}</span>
              </button>
            </div>
          </nav>

          {/* Toggles & Buttons */}
          <div className={cn('flex items-center space-x-4', { 'space-x-reverse': dir==='rtl' })}>
            <div className="hidden md:block">
              <DarkModeToggle />
            </div>
            <Link
              to="/dashboard"
              aria-label="Open admin dashboard"
              className="hidden md:inline-flex px-6 py-3 bg-blue-900 text-white text-sm font-semibold rounded-full hover:bg-blue-800 transition"
            >
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a5 5 0 100-10 5 5 0 000 10zM2 18a8 8 0 1116 0H2z" />
                </svg>
                <span>{t('admin')}</span>
              </div>
            </Link>
            
            {/* Mobile menu button with 3D animation */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden relative p-3 rounded-xl text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 transform hover:scale-110 group"
            >
              {/* Rotating background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              
              <svg className="relative z-10 w-6 h-6 transform transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" className="origin-center transform transition-transform duration-300" />
                ) : (
                  <g className="transform transition-transform duration-300">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12h16" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 18h16" />
                  </g>
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation with slide animation */}
        <div className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="py-4 border-top border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900">
            <nav className="flex flex-col space-y-2">
              {navigation.map((item, index) => (
                <Link
                  key={item.key}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-3 text-sm font-medium rounded-lg mx-2 ${
                    isActive(item.href)
                      ? 'text-white bg-blue-900'
                      : 'text-slate-700 dark:text-slate-200 hover:text-blue-900 hover:bg-blue-50 dark:hover:bg-slate-800'
                  } ${isMenuOpen ? 'animate-slide-in ' + getDelayClass(index) : ''}`}
                >
                  {t(item.key)}
                </Link>
              ))}

              <div className="mx-2 mt-3 flex">
                <button
                  onClick={() => setLang(lang === 'en' ? 'fa' : 'en')}
                  aria-label="Toggle language"
                  className="w-10 h-10 rounded-full bg-blue-900 text-white flex items-center justify-center hover:bg-blue-800 transition"
                  title={lang === 'en' ? 'Switch to فارسی' : 'Switch to English'}
                >
                  <span className="text-sm font-bold">{lang === 'en' ? 'EN' : 'فا'}</span>
                </button>
              </div>

              <div className="mx-2 mt-4 flex justify-center">
                <DarkModeToggle />
              </div>

              <Link
                to="/dashboard"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Open admin dashboard"
                className="mx-2 mt-4 px-5 py-3 bg-blue-900 text-white text-sm font-semibold rounded-full hover:bg-blue-800 transition w-fit"
              >
                <div className={cn('flex items-center space-x-2', { 'space-x-reverse': dir==='rtl' })}>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a5 5 0 100-10 5 5 0 000 10zM2 18a8 8 0 1116 0H2z" />
                  </svg>
                  <span>{t('admin')}</span>
                </div>
              </Link>
            </nav>
          </div>
        </div>
      </div>

      {/* Custom animations */}
      <style>{`
        @keyframes slideInFromLeft {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in { animation: slideInFromLeft 0.5s ease-out forwards; }
        .anim-delay-0 { animation-delay: 0ms; }
        .anim-delay-50 { animation-delay: 50ms; }
        .anim-delay-100 { animation-delay: 100ms; }
        .anim-delay-150 { animation-delay: 150ms; }
        .anim-delay-200 { animation-delay: 200ms; }
      `}</style>
    </header>
    <div className="h-16 md:h-20"></div>
    </>
  );
};

export default Header;
