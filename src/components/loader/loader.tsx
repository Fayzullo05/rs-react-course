import styles from './loader.module.css';

function Loader() {
  return (
    <div className={styles.container}>
      <div className={styles.spinner}></div>
      <p className={styles.text}>Loading results...</p>
    </div>
  );
}

export default Loader;
