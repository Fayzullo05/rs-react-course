import { useCallback, useEffect, useState } from 'react';
import {
  useNavigate,
  useParams,
  useSearchParams,
  Outlet,
} from 'react-router-dom';
import Search from '../search/search';
import Results from '../results/results';
import type { Person } from '../../types/person';
import ErrorButton from '../errorButton/errorButton';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import styles from './layout.module.css';
import Pagination from '../pagination/pagination';
import { toggleSelectedItem } from '../../store/selectedItems/selectedItemsSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import SelectedItemsFlyout from '../selectedItemsFlyout/selectedItemsFlyout';
import {
  Api,
  HttpStatus,
  PaginationValue,
  QueryParam,
  RoutePath,
  StorageKey,
} from '../../constants/app';

type PeopleResponse = {
  info: {
    pages: number;
  };
  results: Person[];
};

function Layout() {
  const { id: detailsId } = useParams();
  const [searchTerm, setSearchTerm] = useLocalStorage(StorageKey.searchTerm);
  const [results, setResults] = useState<Person[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasDetailsPanel = Boolean(detailsId);

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const pageFromUrl = Number(
    searchParams.get(QueryParam.page) ?? String(PaginationValue.firstPage)
  );

  const currentPage =
    Number.isNaN(pageFromUrl) || pageFromUrl < PaginationValue.firstPage
      ? PaginationValue.firstPage
      : pageFromUrl;
  const [totalPages, setTotalPages] = useState(1);

  const dispatch = useAppDispatch();
  const selectedItems = useAppSelector((state) => state.selectedItems.items);
  const selectedIds = selectedItems.map((item) => item.id);

  const handleItemSelect = (person: Person) => {
    dispatch(toggleSelectedItem(person));
  };

  const handleItemClick = (personId: number) => {
    navigate(`/details/${personId}?page=${currentPage}`);
  };

  const fetchData = useCallback(
    async (term: string, page: number, signal: AbortSignal): Promise<void> => {
      setLoading(true);
      setError(null);

      try {
        const baseUrl = Api.characterBaseUrl;
        const params = new URLSearchParams();

        params.set(QueryParam.page, String(page));

        if (term) {
          params.set(QueryParam.name, term);
        }

        const url = `${baseUrl}?${params.toString()}`;

        const res = await fetch(url, { signal });

        if (res.status === HttpStatus.notFound) {
          setResults([]);
          setTotalPages(1);
          return;
        }

        if (!res.ok) {
          throw new Error('Failed to fetch data');
        }

        const data = (await res.json()) as PeopleResponse;

        if (signal.aborted) {
          return;
        }

        setResults(data.results);
        setTotalPages(data.info.pages);
      } catch {
        if (signal.aborted) {
          return;
        }

        setResults([]);
        setError(
          'Failed to load results. Please check your connection or try again later.'
        );
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    },
    []
  );

  useEffect(() => {
    const controller = new AbortController();

    const timeoutId = globalThis.setTimeout(() => {
      fetchData(searchTerm, currentPage, controller.signal);
    }, 0);

    return () => {
      controller.abort();
      globalThis.clearTimeout(timeoutId);
    };
  }, [fetchData, searchTerm, currentPage]);

  const handleSearch = (value: string) => {
    const trimmed = value.trim();

    if (trimmed === searchTerm) return;

    setSearchTerm(trimmed);
    navigate(
      `${RoutePath.main}?${QueryParam.page}=${PaginationValue.firstPage}`
    );
  };

  const handlePageChange = (page: number) => {
    if (detailsId) {
      navigate(`/details/${detailsId}?page=${page}`);
      return;
    }

    navigate(`${RoutePath.main}?${QueryParam.page}=${page}`);
  };

  return (
    <div className={styles.wrapper}>
      <div className={hasDetailsPanel ? styles.splitLayout : styles.content}>
        <div className={styles.mainPanel}>
          <Search initialSearchTerm={searchTerm} onSearch={handleSearch} />

          <Results
            results={results}
            loading={loading}
            error={error}
            selectedIds={selectedIds}
            onItemClick={handleItemClick}
            onItemSelect={handleItemSelect}
          />

          {!loading && !error && results.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}

          <div className={styles.errorButtonWrapper}>
            <ErrorButton />
          </div>

          <SelectedItemsFlyout />
        </div>

        {hasDetailsPanel && (
          <div className={styles.detailsPanel}>
            <Outlet />
          </div>
        )}
      </div>
    </div>
  );
}

export default Layout;
