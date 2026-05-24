import { useCallback, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
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

type PeopleResponse = {
  info: {
    pages: number;
  };
  results: Person[];
};

type Props = {
  detailsSlot?: ReactNode;
};

function Layout({ detailsSlot }: Props) {
  const { id: detailsId } = useParams();
  const [searchTerm, setSearchTerm] = useLocalStorage('searchTerm');
  const [results, setResults] = useState<Person[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const pageFromUrl = Number(searchParams.get('page') ?? '1');
  const currentPage =
    Number.isNaN(pageFromUrl) || pageFromUrl < 1 ? 1 : pageFromUrl;
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

  const fetchData = useCallback(async (term: string, page: number) => {
    await Promise.resolve();

    setLoading(true);
    setError(null);

    try {
      const baseUrl = 'https://rickandmortyapi.com/api/character/';
      const params = new URLSearchParams();

      params.set('page', String(page));

      if (term) {
        params.set('name', term);
      }

      const url = `${baseUrl}?${params.toString()}`;

      const res = await fetch(url);

      if (res.status === 404) {
        setResults([]);
        setTotalPages(1);
        setLoading(false);
        return;
      }

      if (!res.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = (await res.json()) as PeopleResponse;

      setResults(data.results);
      setTotalPages(data.info.pages);
      setLoading(false);
    } catch {
      setResults([]);
      setError(
        'Failed to load results. Please check your connection or try again later.'
      );
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchData(searchTerm, currentPage);
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [fetchData, searchTerm, currentPage]);

  const handleSearch = (value: string) => {
    const trimmed = value.trim();

    if (trimmed === searchTerm) return;

    setSearchTerm(trimmed);
    navigate('/?page=1');
  };

  const handlePageChange = (page: number) => {
    if (detailsId) {
      navigate(`/details/${detailsId}?page=${page}`);
      return;
    }

    navigate(`/?page=${page}`);
  };

  return (
    <div className={styles.wrapper}>
      <div className={detailsSlot ? styles.splitLayout : styles.content}>
        <div className={styles.mainPanel}>
          <Search value={searchTerm} onSearch={handleSearch} />

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

        {detailsSlot && (
          <div className={styles.detailsPanel}>{detailsSlot}</div>
        )}
      </div>
    </div>
  );
}

export default Layout;
