import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { QueryParam } from '@/constants/app';
import { getPersonById } from '@/services/people';
import styles from './serverDetailsPanel.module.css';

type Props = {
  selectedId?: string;
  currentPage: number;
  searchTerm: string;
};

function createCloseHref(currentPage: number, searchTerm: string) {
  const params = new URLSearchParams();

  params.set(QueryParam.page, String(currentPage));

  if (searchTerm) {
    params.set(QueryParam.name, searchTerm);
  }

  return `/?${params.toString()}`;
}

async function ServerDetailsPanel({
  selectedId,
  currentPage,
  searchTerm,
}: Props) {
  const t = await getTranslations('DetailsPanel');

  if (!selectedId) {
    return (
      <aside className={styles.panel}>
        <p className={styles.placeholder}>{t('placeholder')}</p>
      </aside>
    );
  }

  const person = await getPersonById(selectedId);

  if (!person) {
    return (
      <aside className={styles.panel}>
        <p className={styles.error}>{t('notFound')}</p>
        <Link
          className={styles.close}
          href={createCloseHref(currentPage, searchTerm)}
        >
          {t('close')}
        </Link>
      </aside>
    );
  }

  return (
    <aside className={styles.panel}>
      <Link
        className={styles.close}
        href={createCloseHref(currentPage, searchTerm)}
      >
        {t('close')}
      </Link>

      <h2 className={styles.title}>{person.name}</h2>

      {person.image && (
        <Image
          className={styles.image}
          src={person.image}
          alt={person.name}
          width={300}
          height={300}
          priority
        />
      )}

      <dl className={styles.list}>
        <div className={styles.row}>
          <dt className={styles.term}>{t('status')}</dt>
          <dd className={styles.description}>{person.status}</dd>
        </div>

        <div className={styles.row}>
          <dt className={styles.term}>{t('species')}</dt>
          <dd className={styles.description}>{person.species}</dd>
        </div>

        <div className={styles.row}>
          <dt className={styles.term}>{t('gender')}</dt>
          <dd className={styles.description}>{person.gender}</dd>
        </div>

        {person.type && (
          <div className={styles.row}>
            <dt className={styles.term}>{t('type')}</dt>
            <dd className={styles.description}>{person.type}</dd>
          </div>
        )}

        {person.origin && (
          <div className={styles.row}>
            <dt className={styles.term}>{t('origin')}</dt>
            <dd className={styles.description}>{person.origin.name}</dd>
          </div>
        )}

        {person.location && (
          <div className={styles.row}>
            <dt className={styles.term}>{t('location')}</dt>
            <dd className={styles.description}>{person.location.name}</dd>
          </div>
        )}
      </dl>
    </aside>
  );
}

export default ServerDetailsPanel;
