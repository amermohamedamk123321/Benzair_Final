import Header from '../components/Header';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';
import { useLocale } from '@/hooks/useLocale';
import { cn } from '@/lib/utils';

const NotFound: React.FC = () => {
  const { t, dir } = useLocale();
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="backdrop-blur-sm bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-3xl p-12 border border-blue-100 dark:border-gray-700 shadow-lg">
            <h1 className="text-6xl md:text-8xl font-bold text-blue-600 mb-6">
              404
            </h1>
            <h2 className={cn('text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-200 mb-6', dir==='rtl' && 'text-right')}>
              {t('notFound.title')}
            </h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto mb-8"></div>
            <p className={cn('text-xl text-gray-600 dark:text-gray-300 mb-8', dir==='rtl' && 'text-right')}>
              {t('notFound.lead')}
            </p>
            <Link 
              to="/"
              className="inline-block px-8 py-4 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors duration-300 shadow-lg"
            >
              {t('notFound.cta')}
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
