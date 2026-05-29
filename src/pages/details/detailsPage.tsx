import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Loader from '../../components/loader/loader';
import styles from './detailsPage.module.css';
import { QueryParam, RoutePath, PaginationValue } from '../../constants/app';
import { useGetPersonByIdQuery } from '../../store/api/peopleApi';

function DetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const {
    data: person,
    isLoading,
    isFetching,
    isError,
  } = useGetPersonByIdQuery(id ?? '', {
    skip: !id,
  });

  const loading = isLoading || isFetching;
  const error = isError ? 'Failed to load character details.' : null;

  const handleClose = () => {
    const page =
      searchParams.get(QueryParam.page) ?? String(PaginationValue.firstPage);

    navigate(`${RoutePath.main}?${QueryParam.page}=${page}`);
  };

  return (
    <aside className={styles.panel}>
      <button
        className={styles.closeButton}
        type="button"
        onClick={handleClose}
      >
        Close
      </button>

      {loading && <Loader />}

      {!loading && error && <p className={styles.error}>{error}</p>}

      {!loading && person && (
        <div className={styles.content}>
          <h2 className={styles.title}>{person.name}</h2>

          {person.image && (
            <img
              className={styles.image}
              src={person.image}
              alt={person.name}
            />
          )}

          <dl className={styles.list}>
            <div>
              <dt>Status</dt>
              <dd>{person.status}</dd>
            </div>

            <div>
              <dt>Species</dt>
              <dd>{person.species}</dd>
            </div>

            <div>
              <dt>Gender</dt>
              <dd>{person.gender}</dd>
            </div>

            {person.type && (
              <div>
                <dt>Type</dt>
                <dd>{person.type}</dd>
              </div>
            )}

            {person.origin && (
              <div>
                <dt>Origin</dt>
                <dd>{person.origin.name}</dd>
              </div>
            )}

            {person.location && (
              <div>
                <dt>Location</dt>
                <dd>{person.location.name}</dd>
              </div>
            )}
          </dl>
        </div>
      )}
    </aside>
  );
}

export default DetailsPage;
