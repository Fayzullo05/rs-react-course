import { Component } from 'react';
import Card from '../card/card';
import type { Person } from '../../types/person';
import styles from './results.module.css';

type Props = {
  results: Person[];
  loading: boolean;
  error: string | null;
};

class Results extends Component<Props> {
  render() {
    const { results, loading, error } = this.props;

    return (
      <div className={styles.container}>
        <div className={styles.title}>Results</div>

        {loading && <p>Loading...</p>}

        {error && <p>{error}</p>}

        {!loading && !error && results.length === 0 && <p>No results found</p>}

        {!loading && !error && results.length > 0 && (
          <div className={styles.list}>
            {results.map((person) => (
              <Card key={person.id} person={person} />
            ))}
          </div>
        )}
      </div>
    );
  }
}

export default Results;
