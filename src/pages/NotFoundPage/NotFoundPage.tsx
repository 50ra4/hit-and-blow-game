import { useTranslation } from 'react-i18next';
import { ButtonLink } from '@/components/ButtonLink/ButtonLink';

export default function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center hab-fade-in-up">
      <div className="mb-4 text-6xl">🔍</div>
      <h1 className="mb-3 text-2xl font-bold text-white">
        {t('notFound.title')}
      </h1>
      <p className="mb-8 text-white/60">{t('notFound.desc')}</p>
      <ButtonLink to="/">{t('notFound.backToHome')}</ButtonLink>
    </div>
  );
}
