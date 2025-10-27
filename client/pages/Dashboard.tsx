import { useAuth } from '@/hooks/useAuth';
import AdminLogin from '@/components/admin/AdminLogin';
import AdminDashboard from '@/components/admin/AdminDashboard';
import { useLocale } from '@/hooks/useLocale';

const Dashboard: React.FC = () => {
  const { user, isLoading } = useAuth();
  const { t } = useLocale();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (!user?.isAuthenticated) {
    return <AdminLogin />;
  }

  return <AdminDashboard />;
};

export default Dashboard;
