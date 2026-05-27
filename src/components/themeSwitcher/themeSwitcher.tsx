import { useTheme } from '../../context/theme/useTheme';
import styles from './themeSwitcher.module.css';

function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div className={styles.switcher}>
      <span className={styles.label}>Theme:</span>

      <button
        className={theme === 'light' ? styles.active : styles.button}
        type="button"
        onClick={() => setTheme('light')}
      >
        Light
      </button>

      <button
        className={theme === 'dark' ? styles.active : styles.button}
        type="button"
        onClick={() => setTheme('dark')}
      >
        Dark
      </button>
    </div>
  );
}

export default ThemeSwitcher;
