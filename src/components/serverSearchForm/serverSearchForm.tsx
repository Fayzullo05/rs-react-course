import { getTranslations } from 'next-intl/server';
import { QueryParam } from '@/constants/app';
import { searchPeopleAction } from '@/app/[locale]/actions';
import styles from './serverSearchForm.module.css';

type Props = {
  searchTerm: string;
  locale: string;
};

async function ServerSearchForm({ searchTerm, locale }: Props) {
  const t = await getTranslations('SearchPage');

  return (
    <section className={styles.section}>
      <h1 className={styles.title}>{t('searchTitle')}</h1>

      <form className={styles.form} action={searchPeopleAction}>
        <input name="locale" type="hidden" value={locale} />

        <input
          className={styles.input}
          name={QueryParam.name}
          type="text"
          defaultValue={searchTerm}
          placeholder={t('searchPlaceholder')}
        />

        <button className={styles.button} type="submit">
          {t('searchButton')}
        </button>
      </form>
    </section>
  );
}

export default ServerSearchForm;
