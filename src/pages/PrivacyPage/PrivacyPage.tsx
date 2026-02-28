import { useTranslation } from 'react-i18next';

export default function PrivacyPage() {
  const { t } = useTranslation();

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 hab-fade-in-up">
      <h1 className="mb-8 text-2xl font-bold text-white">
        {t('privacy.title')}
      </h1>
      <div className="space-y-6 text-white/80">
        <section>
          <h2 className="mb-2 font-semibold text-white">収集する情報</h2>
          <p className="text-sm leading-relaxed">
            本サービスはサーバーへの通信を行いません。ゲームの統計・設定データはすべてお使いのデバイスのLocalStorageに保存されます。
          </p>
        </section>
        <section>
          <h2 className="mb-2 font-semibold text-white">LocalStorage</h2>
          <p className="text-sm leading-relaxed">
            以下のデータをLocalStorageに保存します。
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
            <li>ゲーム統計（プレイ回数・勝率・最短クリア回数など）</li>
            <li>設定情報（言語・テーマ・サウンド）</li>
            <li>デイリーチャレンジのプレイ状況</li>
          </ul>
          <p className="mt-2 text-sm leading-relaxed">
            これらのデータはお使いのブラウザに保存され、外部に送信されることはありません。
          </p>
        </section>
        <section>
          <h2 className="mb-2 font-semibold text-white">広告</h2>
          <p className="text-sm leading-relaxed">
            本サービスはGoogle AdSenseを利用する場合があります。Google
            AdSenseはCookieを使用してユーザーに関連性の高い広告を表示することがあります。詳細はGoogleの
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 underline hover:text-indigo-300"
            >
              プライバシーポリシー
            </a>
            をご確認ください。
          </p>
        </section>
        <section>
          <h2 className="mb-2 font-semibold text-white">お問い合わせ</h2>
          <p className="text-sm leading-relaxed">
            本ポリシーに関するご質問はGitHubリポジトリのIssueまでお問い合わせください。
          </p>
        </section>
      </div>
    </div>
  );
}
