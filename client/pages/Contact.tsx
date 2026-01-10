import { useMemo, useState } from 'react';
import Header from '../components/Header';
import Footer from '@/components/Footer';
import { useLocale } from '@/hooks/useLocale';
import { cn } from '@/lib/utils';

const COMPANY_EMAIL = (import.meta as any).env?.VITE_COMPANY_EMAIL || 'Benaziryakta@gmail.com';
const COMPANY_WHATSAPP: string = (import.meta as any).env?.VITE_COMPANY_WHATSAPP || '+9377101070';
const COMPANY_ADDRESS = 'Shahrak-e-Omid Sabz, District 6, Kabul, Afghanistan';

// Read CMS-managed content from localStorage (website-content)
const getCmsContent = () => {
  try {
    const raw = localStorage.getItem('website-content');
    if (!raw) return null;
    return JSON.parse(raw) as any;
  } catch { return null; }
};

const Contact: React.FC = () => {
  const { t, dir } = useLocale();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const cms = useMemo(() => getCmsContent(), []);
  const contactEmailFromCms = (cms && cms.contactEmail) || COMPANY_EMAIL;
  const whatsappFieldFromCms = (cms && cms.whatsappUrl) || COMPANY_WHATSAPP;

  const mailtoHref = useMemo(() => {
    const subject = encodeURIComponent(`Inquiry from ${name || 'Website Visitor'}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
    return `mailto:${contactEmailFromCms}?subject=${subject}&body=${body}`;
  }, [name, email, message, contactEmailFromCms]);

  const whatsappHref = useMemo(() => {
    const text = encodeURIComponent(`Hello, this is ${name || 'a website visitor'}. My email is ${email || 'N/A'}.\n\n${message}`);
    if (!whatsappFieldFromCms) return '';
    // If CMS provides full URL use it, otherwise try to build wa.me link from digits
    if (/^https?:\/\//i.test(whatsappFieldFromCms)) {
      // append text param if possible
      if (whatsappFieldFromCms.includes('?')) return `${whatsappFieldFromCms}&text=${text}`;
      return `${whatsappFieldFromCms}?text=${text}`;
    }
    const phone = whatsappFieldFromCms.replace(/[^\d]/g, '');
    if (!phone) return '';
    return `https://wa.me/${phone}?text=${text}`;
  }, [name, email, message, whatsappFieldFromCms]);

  const whatsappAvailable = Boolean(whatsappFieldFromCms);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <Header />

      {/* Hero */}
      <section className="container mx-auto px-6 pt-14 pb-10 md:pt-20 md:pb-14">
      <div className="text-center">
        <h1 className="text-[56px] leading-[64.4px] font-semibold font-vazirmatn text-center text-brand-blue">{t('contact.title')}</h1>
      </div>
    </section>

      {/* Contact Sections */}
      <section className="container mx-auto px-6 pb-20">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Message Section */}
          <div className="rounded-3xl p-6 md:p-8 bg-white/90 dark:bg-gray-800/80 border border-blue-100 dark:border-gray-700 shadow">
            <h2 className={cn('text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2', dir==='rtl' && 'text-right')}>{t('contact.sendMessage')}</h2>
            <p className={cn('text-gray-600 dark:text-gray-300 mb-6', dir==='rtl' && 'text-right')}>{t('contact.lead')}</p>
            <div className="space-y-4">
              <div>
                <label className={cn('block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1', dir==='rtl' && 'text-right')}>{t('contact.form.name')}</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  dir={dir}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={t('contact.form.name')}
                />
              </div>
              <div>
                <label className={cn('block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1', dir==='rtl' && 'text-right')}>{t('contact.form.email')}</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  dir="ltr"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className={cn('block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1', dir==='rtl' && 'text-right')}>{t('contact.form.message')}</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={6}
                  dir={dir}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                  placeholder={t('contact.form.message')}
                />
              </div>
            </div>

            <div className="mt-6 grid sm:grid-cols-2 gap-3">
              <a
                href={mailtoHref}
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition-colors"
              >
                {t('contact.sendEmail')}
              </a>
              <a
                href={whatsappAvailable ? whatsappHref : undefined}
                aria-disabled={!whatsappAvailable}
                onClick={(e) => { if (!whatsappAvailable) e.preventDefault(); }}
                className={cn('inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold shadow transition-colors', whatsappAvailable ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed')}
              >
                {whatsappAvailable ? t('contact.sendWhatsApp') : t('contact.whatsappNotConfigured')}
              </a>
            </div>

            {!whatsappAvailable && (
              <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                {t('contact.whatsappSetupHint')}
              </p>
            )}
          </div>

          {/* Company Info */}
          <div className="rounded-3xl p-6 md:p-8 bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 border border-blue-100 dark:border-gray-700 shadow-xl">
            <h2 className={cn('text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2', dir==='rtl' && 'text-right')}>{t('contact.companyInfo')}</h2>
            <p className={cn('text-gray-600 dark:text-gray-300 mb-6', dir==='rtl' && 'text-right')}>Benazir Yakta Trading Company</p>

            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <div className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">✉️</span>
                <div className={cn('', dir==='rtl' && 'text-right')}>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{t('contact.email')}</p>
                  <a href={`mailto:${contactEmailFromCms}`} className="text-blue-600 dark:text-blue-400 hover:underline"><span dir="ltr">{contactEmailFromCms}</span></a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">📞</span>
                <div className={cn('', dir==='rtl' && 'text-right')}>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{t('contact.phone')}</p>
                  <a href={`tel:+9377310107`} className="text-blue-600 dark:text-blue-400 hover:underline"><span dir="ltr">+93 77 310 10 70</span></a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">🌍</span>
                <div className={cn('', dir==='rtl' && 'text-right')}>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{t('contact.branches')}</p>
                  <p>{t('branches.list', { returnObjects: true }).join(' · ')}</p>
                </div>
              </div>
            </div>

            {!whatsappAvailable && (
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                {t('contact.whatsappSetupHint')}
              </p>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
