import { Component } from 'react';
import styles from './results.module.css';

type Props = {
  searchTerm: string;
};

class Results extends Component<Props> {
  render() {
    return (
      <div className={styles.container}>
        <div className={styles.title}>Results</div>

        <div className={styles.list}>
          <p>Search: {this.props.searchTerm || 'None'}</p>
        </div>
      </div>
    );
  }
}

export default Results;
