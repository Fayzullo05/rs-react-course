import { useEffect } from 'react';
import { clearLatestSubmissionId } from '../../store/forms/formsSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import styles from './submissionsList.module.css';

const NEW_SUBMISSION_HIGHLIGHT_TIME_MS = 3000;

function SubmissionsList() {
  const dispatch = useAppDispatch();
  const submissions = useAppSelector((state) => state.forms.submissions);
  const latestSubmissionId = useAppSelector(
    (state) => state.forms.latestSubmissionId
  );

  useEffect(() => {
    if (!latestSubmissionId) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      dispatch(clearLatestSubmissionId());
    }, NEW_SUBMISSION_HIGHLIGHT_TIME_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [dispatch, latestSubmissionId]);

  if (submissions.length === 0) {
    return (
      <section className={styles.section} aria-labelledby="submissions-title">
        <h2 id="submissions-title">Submitted profiles</h2>
        <p>No submissions yet.</p>
      </section>
    );
  }

  return (
    <section className={styles.section} aria-labelledby="submissions-title">
      <h2 id="submissions-title">Submitted profiles</h2>

      <div className={styles.grid}>
        {submissions.map((submission) => {
          const isLatest = submission.id === latestSubmissionId;

          return (
            <article
              key={submission.id}
              className={`${styles.card} ${isLatest ? styles.latest : ''}`}
              aria-label={`${submission.name} submission`}
            >
              <img
                className={styles.image}
                src={submission.imageBase64}
                alt={`${submission.name} profile`}
              />

              <div className={styles.content}>
                <h3 className={styles.name}>{submission.name}</h3>

                <dl className={styles.list}>
                  <div>
                    <dt>Age</dt>
                    <dd>{submission.age}</dd>
                  </div>

                  <div>
                    <dt>Email</dt>
                    <dd>{submission.email}</dd>
                  </div>

                  <div>
                    <dt>Gender</dt>
                    <dd>{submission.gender}</dd>
                  </div>

                  <div>
                    <dt>Country</dt>
                    <dd>{submission.country}</dd>
                  </div>

                  <div>
                    <dt>Source</dt>
                    <dd>{submission.source}</dd>
                  </div>
                </dl>

                {isLatest && <p className={styles.badge}>New submission</p>}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default SubmissionsList;
