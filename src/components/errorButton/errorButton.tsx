import { useState } from 'react';
import styles from './errorButton.module.css';

function ErrorButton() {
  const [shouldThrowError, setShouldThrowError] = useState(false);

  if (shouldThrowError) {
    throw new Error('Test application error');
  }

  return (
    <button className={styles.button} onClick={() => setShouldThrowError(true)}>
      Throw Error
    </button>
  );
}

export default ErrorButton;
