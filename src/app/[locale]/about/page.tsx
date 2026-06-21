import { getTranslations, setRequestLocale } from 'next-intl/server';

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
    <main>
      <h1>{t('title')}</h1>
      <p>{t('author')}</p>
      <p>{t('description')}</p>

      <a
        href="https://rs.school/courses/reactjs"
        target="_blank"
        rel="noreferrer"
      >
        {t('courseLink')}
      </a>
    </main>
  );
}
