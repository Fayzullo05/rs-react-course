import { useRef } from 'react';
import type { KeyboardEvent } from 'react';
import styles from './search.module.css';

type Props = {
  value: string;
  onSearch: (value: string) => void;
};

function Search({ value, onSearch }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = () => {
    onSearch(inputRef.current?.value ?? '');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>Search</div>

      <div className={styles.form}>
        <input
          key={value}
          ref={inputRef}
          className={styles.input}
          type="text"
          placeholder="Enter search term..."
          defaultValue={value}
          onKeyDown={handleKeyDown}
        />

        <button className={styles.button} onClick={handleSearch}>
          Search
        </button>
      </div>
    </div>
  );
}

export default Search;
