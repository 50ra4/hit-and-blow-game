import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/Button/Button';

export default function NotFoundPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-4 text-6xl">🔍</div>
      <h1 className="mb-3 text-2xl font-bold text-white">
        {t('notFound.title')}
      </h1>
      <p className="mb-8 text-white/60">{t('notFound.desc')}</p>
      <Button onClick={handleGoHome}>{t('notFound.backToHome')}</Button>
    </div>
  );
}
