import { Component } from 'react';
import styles from './search.module.css';

class Search extends Component {
  render() {
    return (
      <div className={styles.container}>
        <div className={styles.form}>
          <input
            className={styles.input}
            type="text"
            placeholder="Enter search term..."
          />
          <button className={styles.button}>Search</button>
        </div>
      </div>
    );
  }
}

export default Search;
