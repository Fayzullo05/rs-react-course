import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Loader from '../../components/loader/loader';
import type { Person } from '../../types/person';
import styles from './detailsPage.module.css';

function DetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [person, setPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const timeoutId = window.setTimeout(() => {
      const fetchDetails = async () => {
        setLoading(true);
        setError(null);

        try {
          const response = await fetch(
            `https://rickandmortyapi.com/api/character/${id}`
          );

          if (!response.ok) {
            throw new Error('Failed to fetch character details');
          }

          const data = (await response.json()) as Person;

          setPerson(data);
        } catch {
          setPerson(null);
          setError('Failed to load character details.');
        } finally {
          setLoading(false);
        }
      };

      void fetchDetails();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [id]);

  const handleClose = () => {
    const page = searchParams.get('page') ?? '1';

    navigate(`/?page=${page}`);
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
