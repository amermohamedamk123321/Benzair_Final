import { useLocale } from '@/hooks/useLocale';

interface TransportationMethod {
  image: string;
  titleKey: string;
  descKey: string;
  featureKeys: string[];
  icon: string;
}

const TransportationSection: React.FC = () => {
  const { t } = useLocale();

  const transportationMethods: TransportationMethod[] = [
    {
      image: "https://cdn.builder.io/api/v1/image/assets%2F13a4766942d54028b94747b6985a55d1%2Fc743a8ecbe644f2ca9a28f685e768bc3?format=webp&width=800",
      titleKey: "transport.air.title",
      descKey: "transport.air.desc",
      featureKeys: ["transport.air.f1", "transport.air.f2", "transport.air.f3"],
      icon: "✈️"
    },
    {
      image: "https://cdn.builder.io/api/v1/image/assets%2F13a4766942d54028b94747b6985a55d1%2F26abf54d75644b5fa9330f31a02481fb?format=webp&width=800",
      titleKey: "transport.sea.title",
      descKey: "transport.sea.desc",
      featureKeys: ["transport.sea.f1", "transport.sea.f2", "transport.sea.f3"],
      icon: "🚢"
    },
    {
      image: "https://fast-logisticsteam.com/layout/image/land-freight.jpg",
      titleKey: "transport.land.title",
      descKey: "transport.land.desc",
      featureKeys: ["transport.land.f1", "transport.land.f2", "transport.land.f3"],
      icon: "🚛"
    }
  ];

  return (
    <section className="py-12 md:py-20 bg-gradient-to-br from-blue-50 via-white to-blue-50/50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center space-x-2 bg-blue-100 dark:bg-blue-900/30 px-4 sm:px-6 py-2 rounded-full mb-4">
            <span className="text-2xl">🌍</span>
            <span className="text-blue-700 font-semibold">{t('logistics.title')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-200 mb-4 md:mb-6">
            {t('logistics.headline')}
          </h2>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            {t('logistics.lead')}
          </p>
        </div>

        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {transportationMethods.map((method, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
            >
              {/* Background Image */}
              <div className="relative h-48 md:h-64 overflow-hidden rounded-t-2xl">
                <img
                  src={method.image}
                  alt={method.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

                {/* Floating Icon */}
                <div className="absolute top-3 right-3 w-10 h-10 sm:w-12 sm:h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-lg sm:text-2xl">{method.icon}</span>
                </div>

                {/* Title Overlay */}
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 drop-shadow-lg">
                    {t(method.titleKey)}
                  </h3>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-6">
                <p className="text-gray-600 dark:text-gray-300 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                  {t(method.descKey)}
                </p>

                {/* Features */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200 text-sm uppercase tracking-wide">
                    {t('logistics.keyFeatures')}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {method.featureKeys.map((featureKey, featureIndex) => (
                      <span
                        key={featureIndex}
                        className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 text-sm rounded-full font-medium"
                      >
                        {t(featureKey)}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Hover Effect Border */}
                <div className="absolute inset-0 border-2 border-blue-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>

              {/* Animated Background Accent */}
              <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-xl"></div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default TransportationSection;
