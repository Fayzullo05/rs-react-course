import { Component } from 'react';
import styles from './results.module.css';

const mock = [
  { id: 1, name: 'Item 1', description: 'Description 1' },
  { id: 2, name: 'Item 2', description: 'Description 2' },
];

class Results extends Component {
  render() {
    return (
      <div className={styles.container}>
        <div className={styles.title}>Results</div>

        <div className={styles.list}>
          {mock.map((item) => (
            <div key={item.id}>
              <strong>{item.name}</strong>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default Results;
