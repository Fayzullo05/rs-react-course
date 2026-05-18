import { useState } from 'react';
import type { ChangeEvent, KeyboardEvent } from 'react';
import styles from './search.module.css';

type Props = {
  value: string;
  onSearch: (value: string) => void;
};

type InputState = {
  inputValue: string;
  previousValue: string;
};

function Search({ value, onSearch }: Props) {
  const [state, setState] = useState<InputState>({
    inputValue: value,
    previousValue: value,
  });

  if (state.previousValue !== value) {
    setState({
      inputValue: value,
      previousValue: value,
    });
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setState({
      inputValue: e.target.value,
      previousValue: value,
    });
  };

  const handleSearch = () => {
    onSearch(state.inputValue);
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
          className={styles.input}
          type="text"
          placeholder="Enter search term..."
          value={state.inputValue}
          onChange={handleChange}
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
