import Header from '../components/Header';
import HeroSlideshow from '../components/HeroSlideshow';
import TransportationSection from '../components/TransportationSection';
import GlobalPresence from '../components/GlobalPresence';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Footer from '@/components/Footer';
import { useLocale } from '@/hooks/useLocale';
import { cn } from '@/lib/utils';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface ProductCategory {
  image: string;
  title?: string;
  description?: string;
  key?: string;
}

function RecentProductsGrid(){
  const { t, dir } = useLocale();
  const [items, setItems] = useState<any[]>([]);
  useEffect(()=>{
    try { const s = localStorage.getItem('products-local'); const list = s? JSON.parse(s): []; setItems((list||[]).filter((p:any)=>p.recent)); } catch {}
  },[]);
  if (!items.length) return null;
  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      {items.map((p:any)=> (
        <div key={p.id} className="rounded-3xl overflow-hidden bg-white/90 dark:bg-gray-800/80 border border-blue-100 dark:border-gray-700 shadow flex flex-col">
          <div className="h-56 w-full bg-gray-100 dark:bg-gray-900/60">
            <img src={p.imageUrl || 'https://via.placeholder.com/640x240?text=No+Image'} alt={p.name} className="w-full h-56 object-cover" />
          </div>
          <div className="p-6 flex-1 flex flex-col">
            <div className="flex items-start justify-between">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{p.name}</h3>
              <div className="px-3 py-1.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200 text-sm font-bold">
                {Number(p.price||0).toLocaleString()} {p.currency || 'USD'} / {p.unit||'kg'}
              </div>
            </div>
            <div className="mt-4">
              <Link to="/products" className={cn('inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold shadow hover:bg-blue-700', { 'space-x-reverse': dir==='rtl' })}>{t('viewProduct')}</Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function FeaturedCategoriesGrid(){
  const { t, dir } = useLocale();
  const categories = [
    {
      image: "../../../assets/03.webp",
      key: "categories.fresh",
      title: "categories.fresh.title",
      description: "categories.fresh.desc"
    },
    {
      image: "../../../assets/02.webp",
      key: "categories.dry",
      title: "categories.dry.title",
      description: "categories.dry.desc"
    },
    {
      image: "../../../assets/01.webp",
      key: "categories.spices",
      title: "categories.spices.title",
      description: "categories.spices.desc"
    }
  ];

  return (
    <div className="grid md:grid-cols-3 gap-8">
      {categories.map((category, index) => (
        <div key={index} className="group relative overflow-visible rounded-2xl transition-all duration-500 bg-white dark:bg-gray-800">
          <div className="relative h-72 overflow-hidden rounded-2xl shadow-lg">
            <img src={category.image} alt={category.title ? category.title : t(`${category.key}.title`)} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
          </div>

          <div className="relative">
            <div className="absolute left-6 rounded-xl px-6 py-4 max-w-xs" style={{ bottom: '-60px', left: '24px' }}>
              <div style={{position:'relative', overflow:'hidden'}} className="bg-white/50 dark:bg-gray-800/70 backdrop-blur-md border border-white/20 dark:border-gray-700 shadow-lg rounded-xl text-gray-900 dark:text-gray-100 px-6 py-4">
                <div style={{position:'absolute', inset:0, pointerEvents:'none', background: 'radial-gradient(1200px 200px at 10% 10%, rgba(255,255,255,0.04), transparent 20%), linear-gradient(180deg, rgba(255,255,255,0.02), transparent 40%)'}} />
                <h3 className="text-2xl text-gray-900 dark:text-gray-100">{t(`${category.key}.title`)}</h3>
                              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

const Index: React.FC = () => {
  const { t, dir } = useLocale();
  const features: Feature[] = [
    {
      icon: "🌾",
      title: "features.items.1.title",
      description: "features.items.1.desc"
    },
    {
      icon: "👩‍💼",
      title: "features.items.2.title",
      description: "features.items.2.desc"
    },
    {
      icon: "🏭",
      title: "features.items.3.title",
      description: "features.items.3.desc"
    },
    {
      icon: "🌍",
      title: "features.items.4.title",
      description: "features.items.4.desc"
    }
  ];

  const productCategories: ProductCategory[] = [
    {
      image: "https://cdn.builder.io/api/v1/image/assets%2F13a4766942d54028b94747b6985a55d1%2Fce396255f7154c3e8c00f1eceed3dada?format=webp&width=800",
      key: "productCategories.nuts",
      title: "productCategories.nuts.title",
      description: "productCategories.nuts.desc"
    },
    {
      image: "https://cdn.builder.io/api/v1/image/assets%2F13a4766942d54028b94747b6985a55d1%2F93f25b5bc43d489e865a9019e2865136?format=webp&width=800",
      key: "productCategories.dried",
      title: "productCategories.dried.title",
      description: "productCategories.dried.desc"
    },
    {
      image: "https://cdn.builder.io/api/v1/image/assets%2F13a4766942d54028b94747b6985a55d1%2Fdbe6e39c9dab457b9f348d9067a8bdd7?format=webp&width=800",
      key: "productCategories.spices",
      title: "productCategories.spices.title",
      description: "productCategories.spices.desc"
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <Header />
      
      {/* Hero Slideshow */}
      <HeroSlideshow />

      {/* Transportation Section */}
      <TransportationSection />

      {/* About Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-green-200/20 to-blue-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }}></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Enhanced header */}
            <div className="mb-8">
              <div className={cn('inline-flex items-center space-x-3 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 px-6 py-3 rounded-full mb-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105', { 'space-x-reverse': dir==='rtl' })}>
                <span className="text-2xl animate-bounce">🌱</span>
                <span className="text-blue-700 font-semibold">{t('ourStory')}</span>
              </div>
              <h2 className={cn('text-4xl md:text-6xl font-bold text-gray-800 dark:text-gray-200 mb-6 bg-gradient-to-r from-gray-800 dark:from-gray-200 via-blue-600 to-purple-600 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300', dir==='rtl' ? 'text-right' : 'text-center')}>
                {t('about.company.heading')}
              </h2>
              <div className="w-40 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mx-auto rounded-full animate-pulse"></div>
            </div>

            {/* Enhanced content card */}
            <div className="group relative backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 rounded-3xl p-8 md:p-12 border border-blue-100 dark:border-gray-700 shadow-2xl hover:shadow-3xl transition-all duration-700 hover:scale-105 overflow-hidden">
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              {/* Floating decorative elements */}
              <div className="absolute top-4 right-4 w-4 h-4 bg-blue-400 rounded-full opacity-30 group-hover:opacity-60 animate-pulse"></div>
              <div className="absolute bottom-4 left-4 w-3 h-3 bg-purple-400 rounded-full opacity-30 group-hover:opacity-60 animate-pulse" style={{ animationDelay: '1s' }}></div>
              <div className="absolute top-1/2 right-8 w-2 h-2 bg-pink-400 rounded-full opacity-30 group-hover:opacity-60 animate-pulse" style={{ animationDelay: '2s' }}></div>

              {/* Content */}
              <div className="relative z-10">
                <p className={cn('text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-8 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors duration-300', dir==='rtl' && 'text-right')}>
                  {t('about.lead')}
                </p>
                <div className="grid md:grid-cols-2 gap-6 text-left">
                  <div className="bg-gradient-to-br from-blue-50 to-white dark:from-gray-700 dark:to-gray-800 p-6 rounded-2xl border border-blue-100 dark:border-gray-600 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center mb-3">
                      <span className="text-2xl mr-3">👥</span>
                      <span className="font-semibold text-blue-700 dark:text-blue-400">{t('ourTeam')}</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">{t('ourTeam.desc')}</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-white dark:from-gray-700 dark:to-gray-800 p-6 rounded-2xl border border-purple-100 dark:border-gray-600 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center mb-3">
                      <span className="text-2xl mr-3">🏢</span>
                      <span className="font-semibold text-purple-700 dark:text-purple-400">{t('ourFacility')}</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">{t('ourFacility.desc')}</p>
                  </div>
                </div>
              </div>

              {/* Shimmer effect */}
              <div className="absolute inset-0 -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-900 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-blue-100 dark:bg-blue-900/30 px-6 py-2 rounded-full mb-6 transform hover:scale-105 transition-transform duration-300">
              <span className="text-2xl animate-bounce">⭐</span>
              <span className="text-blue-700 font-semibold">{t('excellence')}</span>
            </div>
            <h2 className={cn('text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-200 mb-6 transform hover:scale-105 transition-transform duration-300', dir==='rtl' ? 'text-right' : 'text-center')}>
              {t('whyChooseUs')}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full animate-pulse"></div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center group transform hover:-translate-y-3 transition-all duration-500"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative backdrop-blur-sm bg-gradient-to-br from-blue-50 to-white dark:from-gray-800/80 dark:to-gray-800/60 rounded-2xl p-8 shadow-lg border border-blue-100 dark:border-gray-700 hover:shadow-2xl hover:border-blue-300 dark:hover:border-gray-500 transition-all duration-500 overflow-hidden">
                  {/* Animated background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* Floating particles */}
                  <div className="absolute top-2 right-2 w-2 h-2 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping transition-opacity duration-300"></div>
                  <div className="absolute bottom-2 left-2 w-1 h-1 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping transition-opacity duration-300" style={{ animationDelay: '0.5s' }}></div>

                  {/* Content */}
                  <div className="relative z-10">
                    <div className="text-5xl mb-6 transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 inline-block">{feature.icon}</div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors duration-300">
                      {t(feature.title)}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300">
                      {t(feature.description)}
                    </p>
                  </div>

                  {/* Shimmer effect */}
                  <div className="absolute inset-0 -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-20 bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
        {/* Animated background patterns */}
        <div className="absolute top-10 left-10 w-32 h-32 border-2 border-blue-200 rounded-full animate-spin" style={{ animationDuration: '20s' }}></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 border-2 border-purple-200 rounded-full animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }}></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 px-6 py-2 rounded-full mb-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <span className="text-2xl animate-pulse">🏆</span>
              <span className="text-blue-700 font-semibold">{t('premiumQuality')}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-200 mb-6 bg-gradient-to-r from-gray-800 dark:from-gray-200 via-blue-600 to-gray-800 dark:to-gray-200 bg-clip-text text-transparent">
              {t('ourProductCategories')}
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 mx-auto rounded-full animate-pulse"></div>
          </div>
          <FeaturedCategoriesGrid />
        </div>
      </section>


      {/* Global Presence */}
      <GlobalPresence />

      {/* Call to Action */}
      <section className="py-20 bg-white text-slate-800 dark:bg-gradient-to-br dark:from-blue-900 dark:via-blue-950 dark:to-slate-950 dark:text-white relative overflow-hidden">

        {/* Floating particles */}
        <div className="absolute top-10 left-10 w-2 h-2 bg-white/30 rounded-full animate-ping"></div>
        <div className="absolute top-32 right-20 w-1 h-1 bg-white/40 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-32 w-3 h-3 bg-white/20 rounded-full animate-ping" style={{ animationDelay: '3s' }}></div>

        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="group relative backdrop-blur-md bg-white rounded-3xl p-12 border border-slate-200 shadow-2xl overflow-hidden dark:bg-blue-900/30 dark:border-blue-900/40">
              {/* Enhanced background effects */}

              {/* Animated decorative rings */}
              <div className="absolute -top-8 -right-8 w-32 h-32 border-2 border-white/20 rounded-full group-hover:animate-spin transition-all duration-300" style={{ animationDuration: '10s' }}></div>
              <div className="absolute -bottom-8 -left-8 w-24 h-24 border-2 border-white/10 rounded-full group-hover:animate-spin transition-all duration-300" style={{ animationDuration: '15s', animationDirection: 'reverse' }}></div>

              {/* Content */}
              <div className="relative z-10">
                {/* Header with icon */}
                <div className="mb-8">
                  <div className="inline-flex items-center space-x-3 bg-blue-100 text-blue-900 backdrop-blur-lg px-6 py-3 rounded-full mb-6 dark:bg-blue-900/40 dark:text-white">
                    <span className="text-2xl animate-bounce">🚀</span>
                    <span className="text-custom-purple font-semibold">{t('cta.letsConnect')}</span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-white">
                    {t('cta.readyTitle')}
                  </h2>
                  <div className="w-32 h-1 bg-blue-300 mx-auto rounded-full"></div>
                </div>

                <p className="text-xl md:text-2xl text-slate-600 mb-10 leading-relaxed dark:text-blue-200">
                  {t('cta.readyLead')}
                </p>

                {/* Enhanced buttons */}
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <Link to="/contact" className="px-8 py-4 bg-blue-900 text-white font-semibold rounded-full shadow-xl hover:shadow-2xl transition inline-flex items-center justify-center dark:bg-white dark:text-blue-900">
                    <span className="relative z-10 flex items-center space-x-2">
                      <span>{t('getInTouch')}</span>
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </span>
                  </Link>

                  <Link to="/products" className="px-8 py-4 border-2 border-blue-900 text-blue-900 font-semibold rounded-full transition inline-flex items-center justify-center dark:border-white dark:text-white">
                    <span className="relative z-10 flex items-center space-x-2">
                      <span>{t('viewProduct')}</span>
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                  </Link>
                </div>
              </div>

              {/* Shimmer effect */}
              <div className="absolute inset-0 -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
