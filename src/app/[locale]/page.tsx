import { getTranslations, setRequestLocale } from 'next-intl/server';
import ServerSearchForm from '@/components/serverSearchForm/serverSearchForm';
import ServerResultsList from '@/components/serverResultsList/serverResultsList';
import ServerPagination from '@/components/serverPagination/serverPagination';
import { PaginationValue, QueryParam } from '@/constants/app';
import { getPeople } from '@/services/people';

type Props = {
  params: Promise<{
    locale: string;
  }>;
  searchParams: Promise<{
    page?: string;
    name?: string;
  }>;
};

function normalizePage(value: string | undefined) {
  const page = Number(value);

  if (Number.isNaN(page) || page < PaginationValue.firstPage) {
    return PaginationValue.firstPage;
  }

  return page;
}

export default async function HomePage({ params, searchParams }: Props) {
  const { locale } = await params;
  const query = await searchParams;

  setRequestLocale(locale);

  const t = await getTranslations({
    locale,
    namespace: 'SearchPage',
  });

  const currentPage = normalizePage(query.page);
  const searchTerm = query[QueryParam.name] ?? '';

  const data = await getPeople({
    searchTerm,
    page: currentPage,
  });

  return (
    <main>
      <ServerSearchForm searchTerm={searchTerm} />

      <div>
        <div>
          <ServerResultsList
            results={data.results}
            currentPage={currentPage}
            searchTerm={searchTerm}
          />

          <ServerPagination
            currentPage={currentPage}
            totalPages={data.info.pages}
            searchTerm={searchTerm}
          />
        </div>

        <aside>
          <p>{t('detailsPlaceholder')}</p>
        </aside>
      </div>
    </main>
  );
}
