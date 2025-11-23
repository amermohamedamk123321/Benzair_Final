import { useState, useEffect, useRef } from 'react';

import { useLocale } from '@/hooks/useLocale';

interface Country {
  nameKey: string;
  descKey: string;
  image: string;
  x: number; // percentage from left (0-100)
  y: number; // percentage from top (0-100)
}

const GlobalPresence: React.FC = () => {
  const { t } = useLocale();
  const [activeCountry, setActiveCountry] = useState<Country | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const sectionRef = useRef<HTMLElement>(null);

  const countries: Country[] = [
    {
      nameKey: 'countries.india.name',
      descKey: 'countries.india.description',
      image: 'https://cdn.builder.io/api/v1/image/assets%2F13a4766942d54028b94747b6985a55d1%2Fa2ba59abd6f049dd9d791ea7e488b382?format=webp&width=800',
      x: 75, y: 42
    },
    {
      nameKey: 'countries.dubai.name',
      descKey: 'countries.dubai.description',
      image: 'https://cdn.builder.io/api/v1/image/assets%2F13a4766942d54028b94747b6985a55d1%2Fbde79c08142b469780307271de6ffed2?format=webp&width=800',
      x: 67, y: 37
    },
    {
      nameKey: 'countries.france.name',
      descKey: 'countries.france.description',
      image: 'https://cdn.builder.io/api/v1/image/assets%2F13a4766942d54028b94747b6985a55d1%2F82a54b0c2c1a44f8b661a2b870bf76cb?format=webp&width=800',
      x: 47, y: 28
    },
    {
      nameKey: 'countries.switzerland.name',
      descKey: 'countries.switzerland.description',
      image: 'https://cdn.builder.io/api/v1/image/assets%2F13a4766942d54028b94747b6985a55d1%2Ff15abf669cc74d7fbe8d3df3badddc77?format=webp&width=800',
      x: 50, y: 29
    },
    {
      nameKey: 'countries.uk.name',
      descKey: 'countries.uk.description',
      image: 'https://cdn.builder.io/api/v1/image/assets%2F13a4766942d54028b94747b6985a55d1%2F81218f921f92433c89241c8e8dd08ea7?format=webp&width=800',
      x: 43, y: 25
    },
    {
      nameKey: 'countries.australia.name',
      descKey: 'countries.australia.description',
      image: 'https://cdn.builder.io/api/v1/image/assets%2F78f33eb38ebd4b05b3e8fe59c152e236%2F6e940d6a02884e73acd03fdf01698b0e?format=webp&width=800',
      x: 88, y: 70
    },
    {
      nameKey: 'countries.usa.name',
      descKey: 'countries.usa.description',
      image: 'https://cdn.builder.io/api/v1/image/assets%2F13a4766942d54028b94747b6985a55d1%2Fce396255f7154c3e8c00f1eceed3dada?format=webp&width=800',
      x: 20, y: 34
    },
    {
      nameKey: 'countries.canada.name',
      descKey: 'countries.canada.description',
      image: 'https://cdn.builder.io/api/v1/image/assets%2F13a4766942d54028b94747b6985a55d1%2Fa43a1c1870cf4719be13bc905f46b8a3?format=webp&width=800',
      x: 23, y: 30
    },
    {
      nameKey: 'countries.germany.name',
      descKey: 'countries.germany.description',
      image: 'https://cdn.builder.io/api/v1/image/assets%2F13a4766942d54028b94747b6985a55d1%2F82a54b0c2c1a44f8b661a2b870bf76cb?format=webp&width=800',
      x: 51, y: 24
    },
    {
      nameKey: 'countries.spain.name',
      descKey: 'countries.spain.description',
      image: 'https://cdn.builder.io/api/v1/image/assets%2F13a4766942d54028b94747b6985a55d1%2Ff15abf669cc74d7fbe8d3df3badddc77?format=webp&width=800',
      x: 42, y: 34
    },
    {
      nameKey: 'countries.netherlands.name',
      descKey: 'countries.netherlands.description',
      image: 'https://cdn.builder.io/api/v1/image/assets%2F13a4766942d54028b94747b6985a55d1%2F81218f921f92433c89241c8e8dd08ea7?format=webp&width=800',
      x: 49, y: 22
    },
    {
      nameKey: 'countries.italy.name',
      descKey: 'countries.italy.description',
      image: 'https://cdn.builder.io/api/v1/image/assets%2F13a4766942d54028b94747b6985a55d1%2Fdbe6e39c9dab457b9f348d9067a8bdd7?format=webp&width=800',
      x: 51, y: 31
    },
    {
      nameKey: 'countries.australia.name',
      descKey: 'countries.australia.description',
      image: 'https://cdn.builder.io/api/v1/image/assets%2F13a4766942d54028b94747b6985a55d1%2F4876acb8a4b2427bbf1457cd1a69ff1e?format=webp&width=800',
      x: 88, y: 70
    }
  ];

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-white text-slate-800 dark:bg-gray-900 dark:text-gray-200 overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className={`text-center mb-16 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="inline-flex items-center space-x-3 bg-blue-50 dark:bg-white/10 backdrop-blur-lg px-8 py-3 rounded-full mb-8 border border-blue-200 dark:border-white/20">
            <span className="text-3xl animate-bounce" role="img" aria-label="Globe">🌐</span>
            <span className="text-blue-900 dark:text-white font-semibold text-lg">{t('global.title')}</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-blue-900 via-blue-600 to-blue-900 dark:from-white dark:via-blue-200 dark:to-white bg-clip-text text-transparent">
            {t('global.title')}
          </h2>
          <p className="text-xl md:text-2xl text-blue-900/80 dark:text-blue-200 max-w-4xl mx-auto leading-relaxed">
            {t('global.lead')}
          </p>
        </div>

        {/* Interactive World Map Representation */}
        <div className="relative max-w-7xl mx-auto">
          {/* World Map Background (SVG or stylized representation) */}
          <div className="relative bg-white/90 dark:bg-white/90 backdrop-blur-lg rounded-3xl border border-blue-200 dark:border-blue-200 p-8 mb-16">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-blue-500/5 animate-pulse rounded-3xl"></div>
            <div className="absolute inset-0 pointer-events-none opacity-30 dark:opacity-60">
              <img src="https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg" alt="World map" className="w-full h-full object-contain" style={{ objectPosition: 'center' }} />
            </div>
            
            {/* World Map with Connected Dots */}
            <div className="relative w-full" style={{ paddingTop: '62.5%' }}>
              {/* Connection lines between countries */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 800 500">
                <defs>
                  <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.6" />
                  </linearGradient>
                </defs>
                {/* Connection lines from Afghanistan (center) to other countries */}
                <path d="M400,250 L600,200" stroke="url(#connectionGradient)" strokeWidth="2" strokeDasharray="5,5" className="animate-pulse" />
                <path d="M400,250 L650,150" stroke="url(#connectionGradient)" strokeWidth="2" strokeDasharray="5,5" className="animate-pulse" style={{ animationDelay: '0.5s' }} />
                <path d="M400,250 L300,180" stroke="url(#connectionGradient)" strokeWidth="2" strokeDasharray="5,5" className="animate-pulse" style={{ animationDelay: '1s' }} />
                <path d="M400,250 L250,120" stroke="url(#connectionGradient)" strokeWidth="2" strokeDasharray="5,5" className="animate-pulse" style={{ animationDelay: '1.5s' }} />
                <path d="M400,250 L200,80" stroke="url(#connectionGradient)" strokeWidth="2" strokeDasharray="5,5" className="animate-pulse" style={{ animationDelay: '2s' }} />
              </svg>
              {countries.map((country, index) => (
                <div
                  key={country.nameKey}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group`}
                  onMouseEnter={() => setActiveCountry(country)}
                  onMouseLeave={() => setActiveCountry(null)}
                  style={{
                    left: `${country.x}%`,
                    top: `${country.y}%`,
                    animationDelay: `${index * 200}ms`,
                    animation: isVisible ? 'fadeInUp 0.8s ease-out forwards' : 'none'
                  }}
                >
                  {/* Pulsing Ring */}
                  <div className={`absolute -inset-2 w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full opacity-20 animate-ping`}></div>
                  <div className={`absolute -inset-1 w-9 h-9 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full opacity-40 animate-pulse`}></div>
                  
                  {/* Country Marker */}
                  <div className={`relative w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full border-2 border-white shadow-lg transform group-hover:scale-150 transition-all duration-300 flex items-center justify-center`}>
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  </div>

                  {/* Country Label */}
                  <div className="absolute top-8 left-1/2 transform -translate-x-1/2 opacity-80 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                    <div className="bg-white/90 backdrop-blur-lg text-gray-800 px-3 py-1 rounded-lg text-sm font-semibold shadow-lg border border-blue-200">
                      {t(country.nameKey)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Country Showcase Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {countries.filter(c => ['countries.india.name','countries.dubai.name','countries.france.name','countries.switzerland.name','countries.uk.name','countries.australia.name'].includes(c.nameKey)).map((country, index) => (
              <div
                key={country.nameKey}
                className={`group relative overflow-hidden rounded-2xl bg-white dark:bg-white/5 backdrop-blur-lg border border-blue-200 dark:border-white/10 hover:border-blue-400 dark:hover:border-white/30 transition-all duration-500 hover:scale-105 hover:-translate-y-2 ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`}
                style={{ animationDelay: `${index * 100}ms` }}
                onMouseEnter={() => setActiveCountry(country)}
              >
                {/* Country Image */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={country.image}
                    alt={t(country.nameKey)}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                  {/* Country Flag/Icon */}
                  <div className="absolute top-4 right-4 w-12 h-12 bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center border border-white/30" aria-hidden="true">
                    <span className="text-2xl" role="img" aria-label="Store">🏬</span>
                  </div>

                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold text-blue-900 dark:text-white">{t(country.nameKey)}</h3>
                  </div>

                  <p className="text-slate-700 dark:text-gray-300 leading-relaxed text-sm mb-6">
                    {t(country.descKey)}
                  </p>

                </div>

                {/* Animated Border Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes fadeInUp {
          from {
            transform: translateY(30px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </section>
  );
};

export default GlobalPresence;
