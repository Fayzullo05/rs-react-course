import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function NotFoundPage() {
  const t = useTranslations('NotFoundPage');

  return (
    <main>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>

      <Link href="/">{t('returnHome')}</Link>
    </main>
  );
}
