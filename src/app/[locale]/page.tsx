import { setRequestLocale } from 'next-intl/server';
import ServerDetailsPanel from '@/components/serverDetailsPanel/serverDetailsPanel';
import ServerPagination from '@/components/serverPagination/serverPagination';
import ServerResultsList from '@/components/serverResultsList/serverResultsList';
import ServerSearchForm from '@/components/serverSearchForm/serverSearchForm';
import { PaginationValue, QueryParam } from '@/constants/app';
import { getPeople } from '@/services/people';
import styles from './homePage.module.css';
import SelectedItemsFlyout from '@/components/selection/selectedItemsFlyout';
import { SelectionProvider } from '@/components/selection/selectionContext';

type Props = {
  params: Promise<{
    locale: string;
  }>;
  searchParams: Promise<{
    page?: string;
    name?: string;
    selectedId?: string;
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

  const currentPage = normalizePage(query.page);
  const searchTerm = query[QueryParam.name] ?? '';

  const data = await getPeople({
    searchTerm,
    page: currentPage,
  });

  return (
    <SelectionProvider>
      <main className={styles.page}>
        <ServerSearchForm searchTerm={searchTerm} />

        <div className={styles.content}>
          <div className={styles.resultsColumn}>
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

          <div className={styles.detailsColumn}>
            <ServerDetailsPanel
              selectedId={query.selectedId}
              currentPage={currentPage}
              searchTerm={searchTerm}
            />
          </div>
        </div>
      </main>

      <SelectedItemsFlyout />
    </SelectionProvider>
  );
}
