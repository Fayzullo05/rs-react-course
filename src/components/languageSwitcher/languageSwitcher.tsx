'use client';

import { useLocale } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { usePathname, useRouter } from '@/i18n/navigation';
import styles from './languageSwitcher.module.css';

function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleLocaleChange = (nextLocale: string) => {
    const queryString = searchParams.toString();
    const href = queryString ? `${pathname}?${queryString}` : pathname;

    router.replace(href, { locale: nextLocale });
  };

  return (
    <div className={styles.switcher}>
      <span className={styles.label}>Language:</span>

      <button
        className={locale === 'en' ? styles.active : styles.button}
        type="button"
        disabled={locale === 'en'}
        onClick={() => handleLocaleChange('en')}
      >
        EN
      </button>

      <button
        className={locale === 'ru' ? styles.active : styles.button}
        type="button"
        disabled={locale === 'ru'}
        onClick={() => handleLocaleChange('ru')}
      >
        RU
      </button>
    </div>
  );
}

export default LanguageSwitcher;
