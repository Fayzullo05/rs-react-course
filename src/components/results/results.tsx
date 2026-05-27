import Card from '../card/card';
import Loader from '../loader/loader';
import type { Person } from '../../types/person';
import styles from './results.module.css';

type Props = {
  results: Person[];
  loading: boolean;
  error: string | null;
  selectedIds?: number[];
  onItemClick?: (personId: number) => void;
  onItemSelect?: (person: Person) => void;
};

function Results({
  results,
  loading,
  error,
  selectedIds = [],
  onItemClick,
  onItemSelect,
}: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.title}>Results</div>

      {loading && <Loader />}

      {!loading && error && <p className={styles.error}>{error}</p>}

      {!loading && !error && results.length === 0 && (
        <p className={styles.empty}>No results found</p>
      )}

      {!loading && !error && results.length > 0 && (
        <div className={styles.list}>
          {results.map((person) => (
            <Card
              key={person.id}
              person={person}
              selected={selectedIds.includes(person.id)}
              onClick={onItemClick}
              onSelect={onItemSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Results;
