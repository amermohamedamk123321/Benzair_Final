import { useEffect, useState } from 'react';

import { Link } from 'react-router-dom';
import { useLocale } from '@/hooks/useLocale';
import { cn } from '@/lib/utils';

const Footer: React.FC = () => {
  const { t, dir } = useLocale() as any;
  const [links, setLinks] = useState<{ instagram?: string; facebook?: string; whatsapp?: string; twitter?: string; linkedin?: string }>({});
  useEffect(()=>{
    const loadLinks = async () => {
      try {
        // Try to load from server first
        const res = await fetch('/api/content');
        if (res.ok) {
          const d = await res.json();
          setLinks({
            instagram: d.instagramUrl || '',
            facebook: d.facebookUrl || '',
            whatsapp: d.whatsappUrl || '',
            twitter: d.twitterUrl || '',
            linkedin: d.linkedinUrl || ''
          });
          // Cache to localStorage
          try {
            localStorage.setItem('website-content', JSON.stringify(d));
          } catch {}
          return;
        }
      } catch {}

      // Fallback to localStorage if server request fails
      try {
        const s = localStorage.getItem('website-content');
        if (s) {
          const d = JSON.parse(s);
          setLinks({
            instagram: d.instagramUrl || '',
            facebook: d.facebookUrl || '',
            whatsapp: d.whatsappUrl || '',
            twitter: d.twitterUrl || '',
            linkedin: d.linkedinUrl || ''
          });
        }
      } catch {}
    };

    loadLinks();
  },[]);

  return (
    <footer className="bg-blue-900 text-white dark:bg-gradient-to-br dark:from-gray-900 dark:via-slate-800 dark:to-gray-900 dark:text-white py-16 relative overflow-hidden rounded-t-3xl">
      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-8 mb-12 items-center">
          <div className="md:col-span-1">
            <div className="group">
              <div className="flex flex-col items-center md:items-start space-y-4 mb-6">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F13a4766942d54028b94747b6985a55d1%2F7f4187b304d44591b92b0d93350bb0d8?format=webp&width=800"
                  alt="Benazir Yakta Trading Company Logo"
                  className="h-20 w-auto object-contain transform transition-all duration-300 group-hover:scale-105"
                />
                <div className="text-center md:text-left">
                  <h3 className="text-2xl font-bold transition-colors duration-300">Benazir Yakta</h3>
                  <p className="text-lg text-blue-400 font-medium text-center">{t('tradingCompany')}</p>
                </div>
              </div>
              <div className="flex justify-center md:justify-start space-x-4">
                <a href={links.instagram || '#'} target={links.instagram ? '_blank' : undefined} rel={links.instagram ? 'noopener noreferrer' : undefined} className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-500 rounded-full flex items-center justify-center hover:from-purple-700 hover:to-pink-600 transition-all duration-300 cursor-pointer transform hover:scale-110 group/icon">
                  <svg className="w-6 h-6 text-white group-hover/icon:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
                <a href={links.facebook || '#'} target={links.facebook ? '_blank' : undefined} rel={links.facebook ? 'noopener noreferrer' : undefined} className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors duration-300 cursor-pointer transform hover:scale-110 group/icon">
                  <svg className="w-6 h-6 text-white group-hover/icon:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href={links.whatsapp || '#'} target={links.whatsapp ? '_blank' : undefined} rel={links.whatsapp ? 'noopener noreferrer' : undefined} className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors duration-300 cursor-pointer transform hover:scale-110 group/icon">
                  <svg className="w-6 h-6 text-white group-hover/icon:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488"/></svg>
                </a>
                <a href={links.twitter || '#'} target={links.twitter ? '_blank' : undefined} rel={links.twitter ? 'noopener noreferrer' : undefined} className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors duration-300 cursor-pointer transform hover:scale-110 group/icon">
                  <svg className="w-6 h-6 text-white group-hover/icon:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a2.99 2.99 0 0 0-2.106-2.115C19.087 3.5 12 3.5 12 3.5s-7.087 0-9.392.571A2.99 2.99 0 0 0 .502 6.186 31.03 31.03 0 0 0 0 12a31.03 31.03 0 0 0 .502 5.814 2.99 2.99 0 0 0 2.106 2.115C4.913 20.5 12 20.5 12 20.5s7.087 0 9.392-.571a2.99 2.99 0 0 0 2.106-2.115A31.03 31.03 0 0 0 24 12a31.03 31.03 0 0 0-.502-5.814zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/></svg>
                </a>
                <a href={links.linkedin || '#'} target={links.linkedin ? '_blank' : undefined} rel={links.linkedin ? 'noopener noreferrer' : undefined} className="w-12 h-12 bg-blue-700 rounded-full flex items-center justify-center hover:bg-blue-800 transition-colors duration-300 cursor-pointer transform hover:scale-110 group/icon">
                  <svg className="w-6 h-6 text-white group-hover/icon:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
              </div>
            </div>
          </div>

          {/* Footer navigation and contact */}
          <div className={cn('md:col-span-1 grid sm:grid-cols-2 gap-8', dir==='rtl' ? 'text-right' : 'text-left')}>
            <div>
              <h4 className="text-lg font-semibold mb-3">{t('footer.pages')}</h4>
              <ul className="space-y-2 text-blue-100">
                <li><Link to="/">{t('home')}</Link></li>
                <li><Link to="/products">{t('products')}</Link></li>
                <li><Link to="/services">{t('services')}</Link></li>
                <li><Link to="/about">{t('about')}</Link></li>
                <li><Link to="/contact">{t('contact')}</Link></li>
                {/* <li><Link to="/dashboard">{t('admin')}</Link></li> */}
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-3">{t('contact.tag')}</h4>
              <ul className="space-y-2 text-blue-100">
                <li><a href="mailto:Benaziryakta@gmail.com">Benaziryakta@gmail.com</a></li>
                <li><a href="tel:+9377310107">70 10 310 77 93+</a></li>
              </ul>
              <div className="mt-6 contact-qr-section">
                <div className="inline-flex items-center justify-center bg-white p-3 rounded-xl shadow-lg">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2F13a4766942d54028b94747b6985a55d1%2Fb2e4f84b58de46288a798193adf079e1?format=webp&width=800"
                    alt={t('contact.qrAlt')}
                    className="w-48 h-48 md:w-56 md:h-56 object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-blue-800/50 dark:border-gray-700/50 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-blue-100">{t('footer.poweredBy', { company: 'Turab Root' })}</span>
              {/* <a href="https://turabroot.com" target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-full bg-blue-900 text-white font-semibold shadow hover:shadow-md text-center"><span style={{ color: "rgb(255, 255, 255)" }}><span>turabroot</span>.com</span></a> */}
            </div>
            <div className="text-sm text-blue-100 flex items-center gap-6">
              <span>{t('footer.copyright')}</span>
              <a className="hover:underline" href="#">{t('footer.privacy')}</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
