import { useEffect, useState } from 'react';
import Header from '../components/Header';
import { useLocale } from '@/hooks/useLocale';
import { cn } from '@/lib/utils';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';

const heroImages = [
  'https://cdn.builder.io/api/v1/image/assets%2F13a4766942d54028b94747b6985a55d1%2F4876acb8a4b2427bbf1457cd1a69ff1e?format=webp&width=1600',
  'https://cdn.builder.io/api/v1/image/assets%2F13a4766942d54028b94747b6985a55d1%2F83c37f95d7c64d949fa18f338dda6811?format=webp&width=1600',
  'https://cdn.builder.io/api/v1/image/assets%2F13a4766942d54028b94747b6985a55d1%2Fb1bc56df4fd0487f84d754b3d4c18a1e?format=webp&width=1600',
  'https://cdn.builder.io/api/v1/image/assets%2F13a4766942d54028b94747b6985a55d1%2F82cede3eb7da4f8d8c62c8d4921762d6?format=webp&width=1600',
  'https://cdn.builder.io/api/v1/image/assets%2F13a4766942d54028b94747b6985a55d1%2Fb6d93a9214ff41cdaf59e55ea2330b8b?format=webp&width=1600',
  'https://cdn.builder.io/api/v1/image/assets%2F13a4766942d54028b94747b6985a55d1%2Fa43a1c1870cf4719be13bc905f46b8a3?format=webp&width=1600',
  'https://cdn.builder.io/api/v1/image/assets%2F13a4766942d54028b94747b6985a55d1%2Fc2a3e048edf94e19ba68a397f3b91866?format=webp&width=1600',
  'https://cdn.builder.io/api/v1/image/assets%2F13a4766942d54028b94747b6985a55d1%2F028a03a1d02e442bbe82a10b309d5300?format=webp&width=1600'
];

const serviceImages = [
  'https://cdn.builder.io/api/v1/image/assets%2F13a4766942d54028b94747b6985a55d1%2F1701c38b979b4dd09f34bb88cf2ea73f?format=webp&width=1400',
  'https://cdn.builder.io/api/v1/image/assets%2F78f33eb38ebd4b05b3e8fe59c152e236%2F403d2b4c958e4b7491f83cb1e6376171?format=webp&width=800',
  'https://cdn.builder.io/api/v1/image/assets%2F13a4766942d54028b94747b6985a55d1%2F5cf7745244084fb2b0091ae5d5c599ed?format=webp&width=1400',
  'https://cdn.builder.io/api/v1/image/assets%2F13a4766942d54028b94747b6985a55d1%2F9c8b1ec25eb6489ea59b68745ebcff96?format=webp&width=1400'
];

const Services: React.FC = () => {
  const { t, dir } = useLocale() as any;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex(i => (i + 1) % heroImages.length), 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <Header />

      <main className="container mx-auto px-6 py-20 max-w-7xl">
        {/* HERO */}
        <section className="mb-20 grid grid-cols-1 md:[grid-template-columns:30%_70%] gap-8 items-center">
          <div className="space-y-6 md:pr-8">
            <h1 className={cn('text-5xl md:text-[4.5rem] leading-tight font-normal text-gray-900 dark:text-gray-100', dir==='rtl' && 'text-right')}>{t('services.title')}</h1>
            <p className={cn('text-lg text-gray-600 dark:text-gray-300 max-w-xl', dir==='rtl' && 'text-right')}>{t('services.lead')}</p>
            <div className={cn('flex items-center space-x-3 mt-6', { 'space-x-reverse': dir==='rtl' })}>
              <Link to="/contact" className="px-6 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition">{t('contactUs')}</Link>
            </div>
          </div>

          <div className="flex justify-center md:justify-end">
            <div className="w-full max-w-[1800px] rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-visible relative">

              <div className="relative w-full h-[320px] md:h-[360px] lg:h-[380px] xl:h-[400px]">
                {heroImages.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`hero-${i}`}
                    className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 transform ${i === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
                    style={{ willChange: 'opacity, transform' }}
                  />
                ))}

                {/* Glassy caption box: more transparent and larger spacing, non-bold text */}
                <div className="absolute z-30 bottom-[-36px] left-6 md:left-10 md:left-[-40px] md:bottom-[-44px] rounded-2xl px-6 py-4 backdrop-blur-3xl bg-white/18 border border-white/20 dark:bg-black/30 dark:border-black/20 transition-all max-w-2xl">
                  <h3 className="text-2xl md:text-3xl font-normal text-gray-900 dark:text-gray-100">{t('services.fromFarm')}</h3>
                  <p className="text-sm md:text-base text-gray-700 dark:text-gray-200 mt-1">{t('services.caption')}</p>
                </div>

                {/* subtle gradient overlay for depth */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/10 via-transparent to-transparent dark:from-black/40" />
              </div>
            </div>
          </div>
        </section>

        {/* SERVICES LIST */}
        <section id="services-list" className="space-y-12">

          {/* Service 1 */}
          <article className="flex flex-col md:flex-row items-stretch bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="w-full md:w-1/4 p-8 flex flex-col justify-center">
              <h3 className="text-3xl md:text-4xl font-normal text-gray-900 dark:text-gray-100">{t('services.training.title')}</h3>
              <div className="w-40 h-1 bg-gradient-to-r from-green-400 to-blue-600 rounded-full mt-4 mb-6" />
              <p className="mt-2 text-sm md:text-base text-gray-600 dark:text-gray-300">{t('services.training.desc')}</p>
            </div>
            <div className="w-full md:w-3/4 overflow-hidden relative group">
              <img src={serviceImages[0]} alt={t('services.training.title')} className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105" />
            </div>
          </article>

          {/* Service 2 */}
          <article className="flex flex-col md:flex-row items-stretch bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="w-full md:w-1/4 p-8 flex flex-col justify-center">
              <h3 className="text-3xl md:text-4xl font-normal text-gray-900 dark:text-gray-100">{t('services.jobs.title')}</h3>
              <div className="w-40 h-1 bg-gradient-to-r from-pink-400 to-red-600 rounded-full mt-4 mb-6" />
              <p className="mt-2 text-sm md:text-base text-gray-600 dark:text-gray-300">{t('services.jobs.desc')}</p>
            </div>
            <div className="w-full md:w-3/4 overflow-hidden relative group">
              <img src={serviceImages[1]} alt={t('services.jobs.title')} className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105" />
            </div>
          </article>

          {/* Service 3 */}
          <article className="flex flex-col md:flex-row items-stretch bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="w-full md:w-1/4 p-8 flex flex-col justify-center">
              <h3 className="text-3xl md:text-4xl font-normal text-gray-900 dark:text-gray-100">{t('services.empower.title')}</h3>
              <div className="w-40 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mt-4 mb-6" />
              <p className="mt-2 text-sm md:text-base text-gray-600 dark:text-gray-300">{t('services.empower.desc')}</p>
            </div>
            <div className="w-full md:w-3/4 overflow-hidden relative group">
              <img src={serviceImages[2]} alt={t('services.empower.title')} className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105" />
            </div>
          </article>

          {/* Service 4 */}
          <article className="flex flex-col md:flex-row items-stretch bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="w-full md:w-1/4 p-8 flex flex-col justify-center">
              <h3 className="text-3xl md:text-4xl font-normal text-gray-900 dark:text-gray-100">{t('services.exports.title')}</h3>
              <div className="w-40 h-1 bg-gradient-to-r from-blue-400 to-indigo-600 rounded-full mt-4 mb-6" />
              <p className="mt-2 text-sm md:text-base text-gray-600 dark:text-gray-300">{t('services.exports.desc')}</p>
            </div>
            <div className="w-full md:w-3/4 overflow-hidden relative group">
              <img src={serviceImages[3]} alt={t('services.exports.title')} className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105" />
            </div>
          </article>

        </section>

        {/* CTA */}
        <section className="max-w-4xl mx-auto text-center mt-12 mb-20">
          <div className="p-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl text-white shadow-lg">
            <h2 className="text-xl md:text-2xl font-normal mb-3">{t('partner.cta')}</h2>
            <p className="text-sm md:text-base mb-4">{t('partner.cta_lead')}</p>
            <div className="flex justify-center gap-3">
              <Link to="/contact" className="px-4 py-2 bg-white text-blue-700 rounded-full font-medium">{t('contactOurTeam')}</Link>
              <a href="/about" className="px-4 py-2 border border-white/30 text-white rounded-full">{t('learnAboutMission')}</a>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
};

export default Services;
