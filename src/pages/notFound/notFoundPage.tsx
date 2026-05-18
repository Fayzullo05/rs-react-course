import { Link } from 'react-router-dom';
import styles from './notFoundPage.module.css';

function NotFoundPage() {
  return (
    <main className={styles.container}>
      <h1 className={styles.title}>404</h1>
      <p className={styles.text}>Page not found</p>
      <Link className={styles.link} to="/">
        Return to main page
      </Link>
    </main>
  );
}

export default NotFoundPage;
