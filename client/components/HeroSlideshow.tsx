import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useLocale } from '@/hooks/useLocale';
import { cn } from '@/lib/utils';

type HeroTexts = { title: string; lead: string; values: string; services: string };

type HeroApi = {
  slides: { id: string; url: string }[];
  texts: Record<'en' | 'fa', HeroTexts>;
};

const fallbackSlides: string[] = [
  "https://cdn.builder.io/api/v1/image/assets%2F13a4766942d54028b94747b6985a55d1%2F7cef4eecf9b946548d39691b0297da24?format=webp&width=800",
  "https://cdn.builder.io/api/v1/image/assets%2F13a4766942d54028b94747b6985a55d1%2F22a88ae9eb42463b94adf1d5fb5b181a?format=webp&width=800",
  "https://cdn.builder.io/api/v1/image/assets%2F13a4766942d54028b94747b6985a55d1%2F2404c03e5db14d62b21f414d1cab7477?format=webp&width=800",
  "https://cdn.builder.io/api/v1/image/assets%2F13a4766942d54028b94747b6985a55d1%2Faa6f78dc41404377a433acf90bce1cd4?format=webp&width=800",
  "https://cdn.builder.io/api/v1/image/assets%2F13a4766942d54028b94747b6985a55d1%2F8119f13e81b147ad8564a9440170aef4?format=webp&width=800",
  "https://cdn.builder.io/api/v1/image/assets%2F13a4766942d54028b94747b6985a55d1%2Fce396255f7154c3e8c00f1eceed3dada?format=webp&width=800",
  "https://cdn.builder.io/api/v1/image/assets%2F13a4766942d54028b94747b6985a55d1%2F93f25b5bc43d489e865a9019e2865136?format=webp&width=800",
  "https://cdn.builder.io/api/v1/image/assets%2F13a4766942d54028b94747b6985a55d1%2Fdbe6e39c9dab457b9f348d9067a8bdd7?format=webp&width=800"
];

function shuffle<T>(arr: T[]): T[] { const a = arr.slice(); for (let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }

const HeroSlideshow: React.FC = () => {
  const { t, dir, lang } = useLocale() as any;
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [images, setImages] = useState<string[]>([]);
  const [texts, setTexts] = useState<HeroTexts | null>(null);
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();
    const load = async () => {
      try {
        const res = await fetch('/api/hero', { signal: controller.signal });
        if (!res.ok) throw new Error('failed');
        const data: HeroApi = await res.json();
        if (!mounted) return;
        const urls = (data.slides || []).map(s=>s.url).filter(Boolean);
        setImages(urls);
        setCurrentSlide(0);
        const byLang = (data.texts && data.texts[lang as 'en'|'fa']) || null;
        setTexts(byLang);
        setLoaded(true);
      } catch {
        if (!mounted) return;
        setImages([]);
        setCurrentSlide(0);
        setTexts(null);
        setLoaded(true);
      }
    };
    load();
    return () => { mounted = false; controller.abort(); };
  }, [lang]);

  // Auto-advance slides every 5 seconds
  useEffect(() => {
    if (!images.length) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  const goToSlide = (index: number): void => { setCurrentSlide(index); };

  const shown = useMemo(() => ({
    title: texts?.title || t('hero.title'),
    lead: texts?.lead || t('hero.lead'),
    values: texts?.values || t('hero.values'),
    services: texts?.services || t('hero.services'),
  }), [texts, t]);

  return (
    <div className="relative min-h-[75vh] md:h-screen overflow-hidden bg-gray-900">
      {loaded && images.length > 0 && images.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
        >
          <img src={image} alt={`Slide ${index + 1}`} className="w-full h-full object-cover" style={{ objectPosition: 'center' }} />
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>
      ))}

      <div className={cn('relative h-full flex items-center justify-center md:justify-start z-10 pb-24 md:pb-0', dir==='rtl' ? 'md:justify-end' : '')}>
        <div className={cn('max-w-xl w-full px-4 sm:px-6 md:px-8 mx-auto md:mx-0', dir==='rtl' ? 'md:mr-12 text-right' : 'md:ml-12 text-center md:text-left')}>
          <div className={cn('group relative backdrop-blur-md bg-white/20 rounded-3xl p-6 md:p-10 border border-white/30 shadow-2xl hover:shadow-3xl transition-all duration-700 hover:scale-105 overflow-hidden flex flex-col justify-start', dir==='rtl' ? 'items-end' : 'items-start')}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-blue-500/5 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className={cn('absolute top-4 w-4 h-4 bg-white/30 rounded-full animate-pulse', dir==='rtl' ? 'left-4' : 'right-4')}></div>
            <div className={cn('absolute bottom-4 w-3 h-3 bg-blue-300/40 rounded-full animate-pulse', dir==='rtl' ? 'right-4' : 'left-4')} style={{ animationDelay: '1s' }}></div>
            <div className={cn('absolute top-1/3 w-2 h-2 bg-purple-300/40 rounded-full animate-pulse', dir==='rtl' ? 'left-8' : 'right-8')} style={{ animationDelay: '2s' }}></div>

            <div className="relative z-10">
              <h1 className={cn('text-2xl sm:text-3xl md:text-4xl font-normal text-white mb-4 drop-shadow-sm bg-clip-text', dir==='rtl' && 'text-right')}>
                {shown.title}
              </h1>

              <div className="w-24 h-1 bg-gradient-to-r from-white via-blue-200 to-white rounded-full mb-4 opacity-80"></div>

              <p className={cn('text-sm sm:text-base md:text-lg text-white/90 mb-4 leading-relaxed', dir==='rtl' && 'text-right')}>
                {shown.lead}
              </p>

              <p className={cn('text-sm sm:text-base md:text-lg text-white/80 max-w-lg leading-relaxed mb-4', dir==='rtl' && 'text-right')}>
                {shown.values}
              </p>

              <p className={cn('text-sm sm:text-base md:text-lg text-white/80 max-w-lg leading-relaxed mb-6', dir==='rtl' && 'text-right')}>
                {shown.services}
              </p>

              <div className={cn('flex flex-col sm:flex-row gap-4', dir==='rtl' ? 'justify-end' : 'justify-start')}>
                <Link to="/products" className="px-6 sm:px-8 py-3 sm:py-4 bg-blue-900 text-white font-semibold rounded-full shadow-xl hover:shadow-2xl transition inline-flex items-center">
                  <div className={cn('relative z-10 flex items-center', dir==='rtl' ? 'space-x-reverse space-x-2' : 'space-x-2')}>
                    {dir==='rtl' && (
                      <svg className="w-4 h-4 transform group-hover/btn:-translate-x-1 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                      </svg>
                    )}
                    <span>{t('hero.explore')}</span>
                    {dir!=='rtl' && (
                      <svg className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </Link>

                <Link to="/contact" className="group/btn relative px-6 sm:px-8 py-3 sm:py-4 border-2 border-white text-white font-semibold rounded-full overflow-hidden transition-all duration-300 transform hover:scale-105 inline-flex items-center justify-center">
                  <div className={cn('absolute inset-0 bg-white transform scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-300', dir==='rtl' ? 'origin-right' : 'origin-left')}></div>
                  <div className={cn('relative z-10 flex items-center group-hover/btn:text-blue-600 transition-colors duration-300', dir==='rtl' ? 'space-x-reverse space-x-2' : 'space-x-2')}>
                    {dir==='rtl' && (
                      <svg className="w-4 h-4 transform group-hover/btn:-rotate-12 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M2 10a8 8 0 1116 0 8 8 0 01-16 0zm11-4a1 1 0 11-2 0 1 1 0 012 0zM11 9a1 1 0 000 2V14a1 1 0 001 1h-1a1 1 0 100 2h1a1 1 0 001-1v-3a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    )}
                    <span>{t('hero.quote')}</span>
                    {dir!=='rtl' && (
                      <svg className="w-4 h-4 transform group-hover/btn:rotate-12 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </Link>
              </div>
            </div>

            <div className="absolute inset-0 -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-6 md:bottom-8 md:absolute left-1/2 transform -translate-x-1/2 z-20 md:z-20">
        {loaded && images.length > 0 ? (
          <div className="flex space-x-3">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-white scale-125' : 'bg-white bg-opacity-50 hover:bg-opacity-75'}`}
              />
            ))}
          </div>
        ) : null}
      </div>

      {images.length > 0 && (
        <>
          <button
            onClick={() => images.length && goToSlide((currentSlide - 1 + images.length) % images.length)}
            className={cn('absolute top-1/2 transform -translate-y-1/2 p-2 sm:p-3 text-white bg-black bg-opacity-30 hover:bg-opacity-50 rounded-full transition-all duration-300 hover:scale-110 z-20', dir==='rtl' ? 'right-4 sm:right-6' : 'left-4 sm:left-6')}
            aria-label="Previous slide"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={dir==='rtl' ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"} />
            </svg>
          </button>
          <button
            onClick={() => images.length && goToSlide((currentSlide + 1) % images.length)}
            className={cn('absolute top-1/2 transform -translate-y-1/2 p-2 sm:p-3 text-white bg-black bg-opacity-30 hover:bg-opacity-50 rounded-full transition-all duration-300 hover:scale-110 z-20', dir==='rtl' ? 'left-4 sm:left-6' : 'right-4 sm:right-6')}
            aria-label="Next slide"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={dir==='rtl' ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
            </svg>
          </button>
        </>
      )}
    </div>
  );
};

export default HeroSlideshow;
