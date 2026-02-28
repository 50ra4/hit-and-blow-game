import { useTranslation } from 'react-i18next';

export default function TermsPage() {
  const { t } = useTranslation();

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 hab-fade-in-up">
      <h1 className="mb-8 text-2xl font-bold text-white">{t('terms.title')}</h1>
      <div className="space-y-6 text-white/80">
        <section>
          <h2 className="mb-2 font-semibold text-white">第1条（適用）</h2>
          <p className="text-sm leading-relaxed">
            本規約は、本アプリケーション「タイルヒットアンドブロー」（以下「本サービス」）の利用に関して適用されます。ユーザーは本サービスを利用することで、本規約に同意したものとみなします。
          </p>
        </section>
        <section>
          <h2 className="mb-2 font-semibold text-white">第2条（禁止事項）</h2>
          <p className="text-sm leading-relaxed">
            ユーザーは以下の行為を行ってはなりません。
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
            <li>法令または公序良俗に違反する行為</li>
            <li>本サービスの運営を妨害する行為</li>
            <li>不正アクセスやリバースエンジニアリング</li>
          </ul>
        </section>
        <section>
          <h2 className="mb-2 font-semibold text-white">第3条（免責事項）</h2>
          <p className="text-sm leading-relaxed">
            本サービスは現状有姿で提供されます。運営者はサービスの継続性・正確性・完全性を保証せず、利用に伴う損害に対して責任を負いません。
          </p>
        </section>
        <section>
          <h2 className="mb-2 font-semibold text-white">第4条（変更）</h2>
          <p className="text-sm leading-relaxed">
            運営者は必要に応じて本規約を変更することができます。変更後も本サービスを継続して利用した場合は、変更後の規約に同意したものとみなします。
          </p>
        </section>
      </div>
    </div>
  );
}
