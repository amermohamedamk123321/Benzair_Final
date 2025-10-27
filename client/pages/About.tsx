import { useEffect, useRef, useState } from 'react';
import Header from '../components/Header';
import Footer from '@/components/Footer';
import { Award, Globe2, Users, Leaf } from 'lucide-react';
import { useLocale } from '@/hooks/useLocale';
import { cn } from '@/lib/utils';

function Reveal({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        obs.disconnect();
      }
    }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal ${visible ? 'reveal-visible' : ''} ${className}`}>
      {children}
    </div>
  );
}


const About: React.FC = () => {
  const bgImages = [
    'https://cdn.builder.io/api/v1/image/assets%2F13a4766942d54028b94747b6985a55d1%2Fbe21432d66f94059a66ad4635fa69310?format=webp&width=1600',
    'https://cdn.builder.io/api/v1/image/assets%2F13a4766942d54028b94747b6985a55d1%2Ffbb0e6b31fcc439ba5512d0ff8cd49a7?format=webp&width=1600',
    'https://cdn.builder.io/api/v1/image/assets%2F13a4766942d54028b94747b6985a55d1%2F3e3ebdae177a464c863667ce90f9253f?format=webp&width=1600',
    'https://cdn.builder.io/api/v1/image/assets%2F13a4766942d54028b94747b6985a55d1%2F7c2dca98bcb648f39d1d6ab9180584b9?format=webp&width=1600',
    'https://cdn.builder.io/api/v1/image/assets%2F13a4766942d54028b94747b6985a55d1%2F852a65f7f3934243a05e54d3146e0bae?format=webp&width=1600',
    'https://cdn.builder.io/api/v1/image/assets%2F13a4766942d54028b94747b6985a55d1%2F1a29889cb3444ea693656f5ffdcc478e?format=webp&width=1600'
  ];

  const [imgIndex, setImgIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setImgIndex(i => (i + 1) % bgImages.length), 2500);
    return () => clearInterval(id);
  }, []);

  // Awards will be loaded from server (admin managed). Initially empty.
  const [awards, setAwards] = useState<{ id: string; imageUrl?: string; title?: string; description?: string }[]>([]);
  const [awardIndex, setAwardIndex] = useState(0);
  const [awardsLoaded, setAwardsLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/awards');
        if (!res.ok) throw new Error('failed');
        const data = await res.json();
        if (!mounted) return;
        setAwards(Array.isArray(data) ? data : []);
      } catch {
        if (!mounted) return;
        setAwards([]);
      } finally {
        if (mounted) setAwardsLoaded(true);
      }
    })();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (!awardsLoaded || awards.length === 0) return;
    const id2 = setInterval(() => setAwardIndex(i => (i + 1) % awards.length), 2500);
    return () => clearInterval(id2);
  }, [awardsLoaded, awards.length]);

  const [profileDocument, setProfileDocument] = useState<{ name: string; url: string } | null>(null);

  useEffect(() => {
    const loadProfileDocument = () => {
      try {
        const stored = localStorage.getItem('website-content');
        if (!stored) {
          setProfileDocument(null);
          return;
        }
        const parsed = JSON.parse(stored);
        if (parsed.profileDocumentData && parsed.profileDocumentName) {
          setProfileDocument({
            name: String(parsed.profileDocumentName),
            url: String(parsed.profileDocumentData)
          });
        } else {
          setProfileDocument(null);
        }
      } catch {
        setProfileDocument(null);
      }
    };

    loadProfileDocument();
    const handleStorage = (event: StorageEvent) => {
      if (!event.key || event.key === 'website-content') {
        loadProfileDocument();
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const { t, dir } = useLocale();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <Header />

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Left: Text and Boxes */}
          <div>
            <div className={cn('inline-flex items-center space-x-3 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 px-5 py-2 rounded-full mb-5 border border-blue-100 dark:border-gray-700', { 'space-x-reverse': dir==='rtl' })}>
              <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">{t('about.badge')}</span>
            </div>
            <h1 dir="ltr" className="text-[56px] leading-[64.4px] font-semibold font-vazirmatn text-left text-gray-900 dark:text-gray-100">
              {t('about.title')}
            </h1>
            <p className={cn('mt-4 text-lg text-gray-700 dark:text-gray-300', dir==='rtl' && 'text-right')}>
              {t('about.lead')}
            </p>

            {/* Info Boxes */}
            <div className="mt-8 grid sm:grid-cols-1 gap-6">
              {/* Mission (expanded with more room for two lines) */}
              <div className="rounded-3xl p-8 md:p-12 bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 border border-blue-100 dark:border-gray-700 shadow-xl">
                <h3 className="text-2xl md:text-3xl font-bold text-blue-700 dark:text-blue-300 mb-4">{t('mission.title')}</h3>
                <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
                  {t('about.mission')}
                </p>
              </div>
              {/* Vision (expanded with more room for two lines) */}
              <div className="rounded-3xl p-8 md:p-12 bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 border border-blue-100 dark:border-gray-700 shadow-xl">
                <h3 className="text-2xl md:text-3xl font-bold text-purple-700 dark:text-purple-300 mb-4">{t('vision.title')}</h3>
                <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
                  {t('about.vision')}
                </p>
              </div>
            </div>

          </div>

          {/* Right: Prominent logo with glow */}
          <div className="relative w-full flex justify-center">
            <div className="relative transform -translate-y-2 md:-translate-y-4 -translate-x-2 md:-translate-x-6">
              <div className="absolute -inset-6 rounded-full bg-gradient-to-tr from-blue-500/25 via-purple-500/20 to-blue-500/25 blur-3xl"></div>
              <div className="relative rounded-full p-3 md:p-4 bg-white/90 dark:bg-gray-900/80 border border-blue-100 dark:border-gray-700 shadow-xl">
                <img
                  src="/api/assets/PDF.png"
                  alt="Benazir Yakta Trading Company Logo"
                  className="w-64 h-64 md:w-96 md:h-96 object-contain transition-transform duration-500 hover:scale-110"
                />
              </div>
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full bg-blue-500/10 blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="container mx-auto px-6 py-6 md:py-8">
        <Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-2xl p-5 bg-white/90 dark:bg-gray-800/80 border border-blue-100 dark:border-gray-700 shadow flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-700 dark:text-blue-300"><Users size={20} /></div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('about.stats.womenEmployed')}</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{t('about.stats.womenEmployedValue')}</p>
              </div>
            </div>
            <div className="rounded-2xl p-5 bg-white/90 dark:bg-gray-800/80 border border-blue-100 dark:border-gray-700 shadow flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-700 dark:text-blue-300"><Leaf size={20} /></div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('about.stats.contractedFarmers')}</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{t('about.stats.contractedFarmersValue')}</p>
              </div>
            </div>
            <div className="rounded-2xl p-5 bg-white/90 dark:bg-gray-800/80 border border-blue-100 dark:border-gray-700 shadow flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-700 dark:text-blue-300"><Globe2 size={20} /></div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('about.stats.exportMarkets')}</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{t('about.stats.exportMarketsValue')}</p>
              </div>
            </div>
            <div className="rounded-2xl p-5 bg-white/90 dark:bg-gray-800/80 border border-blue-100 dark:border-gray-700 shadow flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-700 dark:text-blue-300"><Award size={20} /></div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('about.stats.recognition')}</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{t('about.stats.recognitionValue')}</p>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Executive Summary */}
      <section className="container mx-auto px-6 py-12 md:py-16">
        <Reveal>
          <div className="rounded-3xl p-8 md:p-12 bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 border border-blue-100 dark:border-gray-700 shadow-xl">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">{t('about.executiveSummaryTitle')}</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              {t('about.executiveSummary')}
            </p>
          </div>
        </Reveal>
      </section>

      {/* Background & History */}
      <section className="container mx-auto px-6 py-12 relative overflow-visible">
        <Reveal>
          {/* Large visual area with glassy title and overlapping text box */}
          <div className="relative rounded-3xl overflow-visible bg-white/90 dark:bg-gray-900/70 border-2 border-blue-300 dark:border-blue-700">

            {/* Glassy title at the top (inside section) */}
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-30">
              <div className="rounded-3xl backdrop-blur-3xl bg-white/8 dark:bg-black/16 border border-white/10 dark:border-black/10 shadow-lg" style={{ marginTop: '-25px', padding: '24px 40px' }}>
                <h2 style={{ fontSize: '48px', fontWeight: 700, lineHeight: '48px', textAlign: 'center' }} className="text-gray-900 dark:text-gray-100">{t('background.title')}</h2>
              </div>
            </div>

            {/* Main carousel image (crossfade stack) */}
            <div className="w-full h-[520px] md:h-[640px] lg:h-[720px] p-6 flex items-center justify-center relative">
              <div className="w-full max-w-5xl h-full rounded-2xl overflow-hidden bg-gray-50 dark:bg-gray-800/60 border border-blue-100 relative">
                {bgImages.map((src, i) => (
                  <img
                    key={src}
                    src={src}
                    alt={`bg-${i}`}
                    className={`absolute inset-0 w-full h-full object-contain transition-all duration-800 ease-in-out transform ${i === imgIndex ? 'opacity-100 scale-100 z-20' : 'opacity-0 scale-95 z-10'}`}
                  />
                ))}
                {/* subtle gradient overlay for depth */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/8 via-transparent to-transparent dark:from-black/40" />
              </div>
            </div>

            {/* Overlapping glassy text box (half out at bottom) */}
            <div style={{ bottom: '-64px' }} className="absolute left-1/2 transform -translate-x-1/2 z-40 w-full max-w-4xl">
              <div className="rounded-3xl px-8 py-6 backdrop-blur-2xl bg-white/8 dark:bg-black/20 border border-blue-200 dark:border-black/20 shadow-xl" style={{ borderColor: 'rgba(96,165,250,0.15)' }}>
                <h3 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-3">{t('background.title')}</h3>
                <ul className={cn('list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300', dir==='rtl' && 'text-right') }>
                  <li>{t('background.items.1')}</li>
                  <li>{t('background.items.2')}</li>
                  <li>{t('background.items.3')}</li>
                  <li>{t('background.items.4')}</li>
                </ul>
              </div>
            </div>

            {/* spacer to account for overlap */}
            <div style={{ height: 140 }} />
          </div>
        </Reveal>
      </section>

      {/* Awards & Milestones */}
      <section className="container mx-auto px-6 py-12 relative overflow-visible">
        <Reveal>
          <div className="relative rounded-3xl overflow-visible bg-white/90 dark:bg-gray-900/70 border-2 border-blue-300 dark:border-blue-700">

            {/* Glassy title at the top (inside section) */}
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-30">
              <div className="rounded-3xl backdrop-blur-3xl bg-white/8 dark:bg-black/16 border border-white/10 dark:border-black/10 shadow-lg" style={{ marginTop: '-25px', padding: '20px 40px' }}>
                <h2 style={{ fontSize: '36px', fontWeight: 700, lineHeight: '40px', textAlign: 'center' }} className="text-gray-900 dark:text-gray-100">{t('awards.title')}</h2>
              </div>
            </div>

            {/* Main carousel image (crossfade stack) */}
            <div className="w-full h-[420px] md:h-[520px] lg:h-[580px] p-6 flex items-center justify-center relative">
              <div className="w-full max-w-4xl h-full rounded-2xl overflow-hidden bg-gray-50 dark:bg-gray-800/60 border border-blue-100 relative">
                {awardsLoaded && awards.length > 0 ? (
                  awards.map((a, i) => (
                    <img
                      key={a.id}
                      src={a.imageUrl || ''}
                      alt={a.title || `award-${i}`}
                      className={`absolute inset-0 w-full h-full object-contain transition-all duration-800 ease-in-out transform ${i === awardIndex ? 'opacity-100 scale-100 z-20' : 'opacity-0 scale-95 z-10'}`}
                    />
                  ))
                ) : (
                  // empty state: show nothing (keep background)
                  null
                )}
              </div>
            </div>

            {/* Overlapping glassy text box (half out at bottom) */}
            <div style={{ bottom: '-64px' }} className="absolute left-1/2 transform -translate-x-1/2 z-40 w-full max-w-4xl">
              <div className="rounded-3xl px-8 py-6 backdrop-blur-2xl bg-white/8 dark:bg-black/20 border border-blue-200 dark:border-black/20 shadow-xl" style={{ borderColor: 'rgba(96,165,250,0.15)' }}>
                <h3 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-3">{t('awards.title')}</h3>
                <ul className={cn('space-y-3 text-gray-700 dark:text-gray-300', dir==='rtl' && 'text-right')}>
                  {awardsLoaded && awards.length > 0 ? (
                    awards.map((a) => (
                      <li key={a.id} className="flex items-start gap-3">
                        <span className="mt-1 h-2 w-2 rounded-full bg-blue-600"></span>
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-gray-100">{a.title}</div>
                          {a.description ? <div className="text-sm text-gray-600 dark:text-gray-300">{a.description}</div> : null}
                        </div>
                      </li>
                    ))
                  ) : (
                    // fallback to localized default list when no awards are provided
                    <>
                      <li className="flex items-start gap-3"><span className="mt-1 h-2 w-2 rounded-full bg-blue-600"></span> {t('awards.items.1')}</li>
                      <li className="flex items-start gap-3"><span className="mt-1 h-2 w-2 rounded-full bg-blue-600"></span> {t('awards.items.2')}</li>
                      <li className="flex items-start gap-3"><span className="mt-1 h-2 w-2 rounded-full bg-blue-600"></span> {t('awards.items.3')}</li>
                    </>
                  )}
                </ul>
              </div>
            </div>

            <div style={{ height: 140 }} />
          </div>
        </Reveal>
      </section>

      {/* Company Profile Download */}
      <section className="container mx-auto px-6 py-12">
        <Reveal>
          <div className="rounded-3xl border border-blue-100 dark:border-gray-700 bg-gradient-to-r from-blue-50 via-white to-purple-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 px-8 py-10">
              <div className={cn('flex-1 space-y-2', dir === 'rtl' && 'text-right')}>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {t('about.profileDownloadHeading')}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {profileDocument ? (
                    <span>
                      {t('about.profileDownloadFileLabel')}{' '}
                      <span className="font-medium text-gray-800 dark:text-gray-100">{profileDocument.name}</span>
                    </span>
                  ) : (
                    t('about.profileDownloadUnavailable')
                  )}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {profileDocument ? (
                  <a
                    href={profileDocument.url}
                    download={profileDocument.name || 'company-profile.pdf'}
                    className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-lg hover:from-blue-700 hover:to-purple-700 transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                  >
                    {t('about.profileDownloadButton')}
                  </a>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gray-200 text-gray-500 font-semibold cursor-not-allowed"
                  >
                    {t('about.profileDownloadButton')}
                  </button>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Products */}
      <section className="container mx-auto px-6 py-12">
        <Reveal>
          <div className="mb-6">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">{t('about.productsTitle')}</h3>
            <p className="text-gray-700 dark:text-gray-300 mt-2">{t('about.productsDesc')}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {t('about.productsList', { returnObjects: true }).map((p: string) => (
              <span key={p} className="px-4 py-2 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 text-sm font-semibold">
                {p}
              </span>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Processing Pipelines */}
      <section className="container mx-auto px-6 py-12">
        <Reveal>
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">Processing</h3>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="rounded-3xl p-6 bg-white/90 dark:bg-gray-800/80 border border-blue-100 dark:border-gray-700 shadow">
              <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-3">{t('processing.almonds.title')}</h4>
              <ol className="list-decimal pl-5 space-y-2 text-gray-700 dark:text-gray-300 text-sm">
                <li>{t('processing.almonds.step1')}</li>
                <li>{t('processing.almonds.step2')}</li>
                <li>{t('processing.almonds.step3')}</li>
                <li>{t('processing.almonds.step4')}</li>
                <li>{t('processing.almonds.step5')}</li>
              </ol>
            </div>
            <div className="rounded-3xl p-6 bg-white/90 dark:bg-gray-800/80 border border-blue-100 dark:border-gray-700 shadow">
              <h4 className="font-semibold text-purple-700 dark:text-purple-300 mb-3">{t('processing.apricots.title')}</h4>
              <ol className="list-decimal pl-5 space-y-2 text-gray-700 dark:text-gray-300 text-sm">
                <li>{t('processing.apricots.step1')}</li>
                <li>{t('processing.apricots.step2')}</li>
                <li>{t('processing.apricots.step3')}</li>
                <li>{t('processing.apricots.step4')}</li>
                <li>{t('processing.apricots.step5')}</li>
              </ol>
            </div>
          </div>
        </Reveal>
      </section>


      {/* Packing & Marketing */}
      <section className="container mx-auto px-6 py-12">
        <Reveal>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="rounded-3xl p-6 bg-white/90 dark:bg-gray-800/80 border border-blue-100 dark:border-gray-700 shadow">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">{t('packing.title')}</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300 text-sm">
                <li>{t('packing.items.1')}</li>
                <li>{t('packing.items.2')}</li>
                <li>{t('packing.items.3')}</li>
                <li>{t('packing.items.4')}</li>
              </ul>
            </div>
            <div className="rounded-3xl p-6 bg-white/90 dark:bg-gray-800/80 border border-blue-100 dark:border-gray-700 shadow">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">{t('marketing.title')}</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300 text-sm">
                <li>{t('marketing.items.1')}</li>
                <li>{t('marketing.items.2')}</li>
                <li>{t('marketing.items.3')}</li>
                <li>{t('marketing.items.4')}</li>
              </ul>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Global Presence & Branches */}
      <section className="container mx-auto px-6 py-12">
        <Reveal>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="rounded-3xl p-6 bg-white/90 dark:bg-gray-800/80 border border-blue-100 dark:border-gray-700 shadow">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">{t('export.title')}</h3>
              <div className="flex flex-wrap gap-3">
                {t('export.list', { returnObjects: true }).map((c: string, i: number) => (
                  <span key={i} className="px-4 py-2 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 text-sm font-semibold">{c}</span>
                ))}
              </div>
            </div>
            <div className="rounded-3xl p-6 bg-white/90 dark:bg-gray-800/80 border border-blue-100 dark:border-gray-700 shadow">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">{t('branches.title')}</h3>
              <div className="grid sm:grid-cols-3 gap-3 text-sm">
                {t('branches.list', { returnObjects: true }).map((b: string, i: number) => (
                  <div key={i} className="px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700">{b}</div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </section>


      <Footer />

      {/* Page animations */}
      <style jsx>{`
        .reveal { opacity: 0; transform: translateY(20px); transition: opacity 600ms ease, transform 600ms ease; }
        .reveal-visible { opacity: 1; transform: translateY(0); }
      `}</style>
    </div>
  );
};

export default About;
