import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import styles from './notFound.module.css';

export default function NotFoundPage() {
  const t = useTranslations('NotFoundPage');

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <h1 className={styles.title}>{t('title')}</h1>
        <p className={styles.text}>{t('description')}</p>

        <Link className={styles.link} href="/">
          {t('returnHome')}
        </Link>
      </section>
    </main>
  );
}
