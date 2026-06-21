import { getTranslations } from 'next-intl/server';

type Props = {
  searchTerm: string;
};

async function ServerSearchForm({ searchTerm }: Props) {
  const t = await getTranslations('SearchPage');

  return (
    <section>
      <h2>{t('searchTitle')}</h2>

      <form>
        <input
          name="name"
          type="text"
          defaultValue={searchTerm}
          placeholder={t('searchPlaceholder')}
        />

        <input name="page" type="hidden" value="1" />

        <button type="submit">{t('searchButton')}</button>
      </form>
    </section>
  );
}

export default ServerSearchForm;
