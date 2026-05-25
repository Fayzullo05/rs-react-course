import { useRef } from 'react';
import type { KeyboardEvent } from 'react';
import styles from './search.module.css';

type SearchProps = {
  initialSearchTerm: string;
  onSearch: (searchTerm: string) => void;
};

function Search({ initialSearchTerm, onSearch }: Readonly<SearchProps>) {
  const inputRef = useRef<HTMLInputElement>(null);

  const submitSearch = (): void => {
    onSearch(inputRef.current?.value ?? '');
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'Enter') {
      submitSearch();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>Search</div>

      <div className={styles.form}>
        <input
          ref={inputRef}
          className={styles.input}
          type="text"
          placeholder="Enter search term..."
          defaultValue={initialSearchTerm}
          onKeyDown={handleKeyDown}
        />

        <button className={styles.button} onClick={submitSearch}>
          Search
        </button>
      </div>
    </div>
  );
}

export default Search;
