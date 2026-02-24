import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStats } from '@/features/stats/useStats';
import { StatsPanel } from '@/features/stats/StatsPanel/StatsPanel';
import { Modal } from '@/components/Modal/Modal';
import { Button } from '@/components/Button/Button';

export default function StatsPage() {
  const { t } = useTranslation();
  const { stats, clearStats } = useStats();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleClearConfirm = () => {
    clearStats();
    setIsConfirmOpen(false);
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">{t('stats.title')}</h1>
        <Button
          variant="danger"
          onClick={() => {
            setIsConfirmOpen(true);
          }}
          className="text-sm"
        >
          {t('stats.clear')}
        </Button>
      </div>

      <StatsPanel stats={stats} />

      <Modal
        isOpen={isConfirmOpen}
        onClose={() => {
          setIsConfirmOpen(false);
        }}
        title={t('stats.title')}
      >
        <p className="mb-6 text-white/80">{t('stats.confirmClear')}</p>
        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={() => {
              setIsConfirmOpen(false);
            }}
            className="flex-1"
          >
            {t('common.back')}
          </Button>
          <Button
            variant="danger"
            onClick={handleClearConfirm}
            className="flex-1"
          >
            {t('stats.clear')}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
