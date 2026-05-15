import { useCallback, useEffect, useState } from 'react';
import Search from '../search/search';
import Results from '../results/results';
import type { Person } from '../../types/person';
import ErrorButton from '../errorButton/errorButton';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import styles from './layout.module.css';

type PeopleResponse = {
  results: Person[];
};

function Layout() {
  const [searchTerm, setSearchTerm] = useLocalStorage('searchTerm');
  const [results, setResults] = useState<Person[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (term: string) => {
    await Promise.resolve();

    setLoading(true);
    setError(null);

    try {
      const url = term
        ? `https://rickandmortyapi.com/api/character/?name=${encodeURIComponent(
            term
          )}`
        : 'https://rickandmortyapi.com/api/character/';

      const res = await fetch(url);

      if (res.status === 404) {
        setResults([]);
        setLoading(false);
        return;
      }

      if (!res.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = (await res.json()) as PeopleResponse;

      setResults(data.results);
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
      void fetchData(searchTerm);
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [fetchData, searchTerm]);

  const handleSearch = (value: string) => {
    const trimmed = value.trim();

    if (trimmed === searchTerm) return;

    setSearchTerm(trimmed);
  };

  return (
    <div className={styles.wrapper}>
      <Search value={searchTerm} onSearch={handleSearch} />

      <Results results={results} loading={loading} error={error} />

      <ErrorButton />
    </div>
  );
}

export default Layout;
