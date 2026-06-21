import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import type { Person } from '@/types/person';
import { QueryParam } from '@/constants/app';
import styles from './serverResultsList.module.css';

type Props = {
  results: Person[];
  currentPage: number;
  searchTerm: string;
};

function createDetailsHref(
  personId: number,
  currentPage: number,
  searchTerm: string
) {
  const params = new URLSearchParams();

  params.set(QueryParam.page, String(currentPage));
  params.set('selectedId', String(personId));

  if (searchTerm) {
    params.set(QueryParam.name, searchTerm);
  }

  return `/?${params.toString()}`;
}

async function ServerResultsList({ results, currentPage, searchTerm }: Props) {
  const t = await getTranslations('SearchPage');

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>{t('resultsTitle')}</h2>

      {results.length === 0 && <p className={styles.empty}>{t('empty')}</p>}

      {results.length > 0 && (
        <div className={styles.list}>
          {results.map((person) => (
            <article key={person.id} className={styles.card}>
              <h3 className={styles.name}>
                <Link
                  href={createDetailsHref(person.id, currentPage, searchTerm)}
                >
                  {person.name}
                </Link>
              </h3>

              <p className={styles.meta}>
                {t('status')}: {person.status}
              </p>
              <p className={styles.meta}>
                {t('species')}: {person.species}
              </p>
              <p className={styles.meta}>
                {t('gender')}: {person.gender}
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default ServerResultsList;
