import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Loader from '../../components/loader/loader';
import type { Person } from '../../types/person';
import styles from './detailsPage.module.css';
import {
  Api,
  QueryParam,
  RoutePath,
  PaginationValue,
} from '../../constants/app';

function DetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [person, setPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const controller = new AbortController();

    const timeoutId = globalThis.setTimeout(() => {
      const fetchDetails = async (): Promise<void> => {
        setLoading(true);
        setError(null);

        try {
          const response = await fetch(`${Api.characterBaseUrl}${id}`, {
            signal: controller.signal,
          });

          if (response.ok === false) {
            throw new Error('Failed to fetch character details');
          }

          const data = (await response.json()) as Person;

          if (controller.signal.aborted) {
            return;
          }

          setPerson(data);
        } catch {
          if (controller.signal.aborted) {
            return;
          }

          setPerson(null);
          setError('Failed to load character details.');
        } finally {
          if (controller.signal.aborted === false) {
            setLoading(false);
          }
        }
      };

      fetchDetails();
    }, 0);

    return () => {
      controller.abort();
      globalThis.clearTimeout(timeoutId);
    };
  }, [id]);

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
