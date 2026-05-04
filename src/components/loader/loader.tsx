import { Component } from 'react';
import styles from './loader.module.css';

class Loader extends Component {
  render() {
    return (
      <div className={styles.container}>
        <div className={styles.spinner}></div>
        <p className={styles.text}>Loading results...</p>
      </div>
    );
  }
}

export default Loader;
