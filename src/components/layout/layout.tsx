import { useCallback, useEffect, useState } from 'react';
import Search from '../search/search';
import Results from '../results/results';
import type { Person } from '../../types/person';
import ErrorButton from '../errorButton/errorButton';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import styles from './layout.module.css';
import { useSearchParams } from 'react-router-dom';
import Pagination from '../pagination/pagination';

type PeopleResponse = {
  info: {
    pages: number;
  };
  results: Person[];
};

function Layout() {
  const [searchTerm, setSearchTerm] = useLocalStorage('searchTerm');
  const [results, setResults] = useState<Person[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const pageFromUrl = Number(searchParams.get('page') ?? '1');
  const currentPage =
    Number.isNaN(pageFromUrl) || pageFromUrl < 1 ? 1 : pageFromUrl;
  const [totalPages, setTotalPages] = useState(1);

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
    setSearchParams({ page: '1' });
  };

  const handlePageChange = (page: number) => {
    setSearchParams({ page: String(page) });
  };

  return (
    <div className={styles.wrapper}>
      <Search value={searchTerm} onSearch={handleSearch} />

      <Results results={results} loading={loading} error={error} />

      {!loading && !error && results.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}

      <ErrorButton />
    </div>
  );
}

export default Layout;
