import { getTranslations, setRequestLocale } from 'next-intl/server';
import styles from './aboutPage.module.css';

type Props = {
  params: Promise<{
    locale: string;
  }>;
};

export const dynamic = 'force-static';

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;

  setRequestLocale(locale);

  const t = await getTranslations({
    locale,
    namespace: 'AboutPage',
  });

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <h1 className={styles.title}>{t('title')}</h1>
        <p className={styles.text}>{t('author')}</p>
        <p className={styles.text}>{t('description')}</p>

        <a
          className={styles.link}
          href="https://rs.school/courses/reactjs"
          target="_blank"
          rel="noreferrer"
        >
          {t('courseLink')}
        </a>
      </section>
    </main>
  );
}
