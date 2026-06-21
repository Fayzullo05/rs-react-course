import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { QueryParam } from '@/constants/app';
import styles from './serverPagination.module.css';

type Props = {
  currentPage: number;
  totalPages: number;
  searchTerm: string;
};

function createHref(page: number, searchTerm: string) {
  const params = new URLSearchParams();

  params.set(QueryParam.page, String(page));

  if (searchTerm) {
    params.set(QueryParam.name, searchTerm);
  }

  return `/?${params.toString()}`;
}

async function ServerPagination({
  currentPage,
  totalPages,
  searchTerm,
}: Props) {
  const t = await getTranslations('SearchPage');

  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav className={styles.pagination}>
      {currentPage > 1 && (
        <Link
          className={styles.link}
          href={createHref(currentPage - 1, searchTerm)}
        >
          {t('previous')}
        </Link>
      )}

      <span className={styles.counter}>
        {currentPage} / {totalPages}
      </span>

      {currentPage < totalPages && (
        <Link
          className={styles.link}
          href={createHref(currentPage + 1, searchTerm)}
        >
          {t('next')}
        </Link>
      )}
    </nav>
  );
}

export default ServerPagination;
