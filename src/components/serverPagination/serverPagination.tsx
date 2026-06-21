import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { QueryParam } from '@/constants/app';

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
    <nav>
      {currentPage > 1 && (
        <Link href={createHref(currentPage - 1, searchTerm)}>
          {t('previous')}
        </Link>
      )}

      <span>
        {' '}
        {currentPage} / {totalPages}{' '}
      </span>

      {currentPage < totalPages && (
        <Link href={createHref(currentPage + 1, searchTerm)}>{t('next')}</Link>
      )}
    </nav>
  );
}

export default ServerPagination;
