import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import LanguageSwitcher from '../languageSwitcher/languageSwitcher';
import ThemeSwitcher from '../themeSwitcher/themeSwitcher';
import styles from './navigation.module.css';

async function Navigation() {
  const t = await getTranslations('Navigation');

  return (
    <nav className={styles.nav}>
      <Link className={styles.navLink} href="/">
        {t('main')}
      </Link>

      <Link className={styles.navLink} href="/about">
        {t('about')}
      </Link>

      <Suspense fallback={null}>
        <LanguageSwitcher />
      </Suspense>

      <ThemeSwitcher />
    </nav>
  );
}

export default Navigation;
