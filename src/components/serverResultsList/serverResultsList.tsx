import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import type { Person } from '@/types/person';
import { QueryParam } from '@/constants/app';

type Props = {
  results: Person[];
  currentPage: number;
  searchTerm: string;
};

async function ServerResultsList({ results, currentPage, searchTerm }: Props) {
  const t = await getTranslations('SearchPage');

  return (
    <section>
      <h2>{t('resultsTitle')}</h2>

      {results.length === 0 && <p>{t('empty')}</p>}

      {results.length > 0 && (
        <div>
          {results.map((person) => {
            const params = new URLSearchParams();

            params.set(QueryParam.page, String(currentPage));

            if (searchTerm) {
              params.set(QueryParam.name, searchTerm);
            }

            return (
              <article key={person.id}>
                <h3>
                  <Link href={`/details/${person.id}?${params.toString()}`}>
                    {person.name}
                  </Link>
                </h3>

                <p>Status: {person.status}</p>
                <p>Species: {person.species}</p>
                <p>Gender: {person.gender}</p>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default ServerResultsList;
