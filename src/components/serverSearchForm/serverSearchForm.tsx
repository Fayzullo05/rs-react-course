import { getTranslations } from 'next-intl/server';
import styles from './serverSearchForm.module.css';

type Props = {
  searchTerm: string;
};

async function ServerSearchForm({ searchTerm }: Props) {
  const t = await getTranslations('SearchPage');

  return (
    <section className={styles.section}>
      <h1 className={styles.title}>{t('searchTitle')}</h1>

      <form className={styles.form}>
        <input
          className={styles.input}
          name="name"
          type="text"
          defaultValue={searchTerm}
          placeholder={t('searchPlaceholder')}
        />

        <input name="page" type="hidden" value="1" />

        <button className={styles.button} type="submit">
          {t('searchButton')}
        </button>
      </form>
    </section>
  );
}

export default ServerSearchForm;
