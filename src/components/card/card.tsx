import type { Person } from '../../types/person';
import styles from './card.module.css';

type Props = {
  person: Person;
  onClick?: (personId: number) => void;
};

function Card({ person, onClick }: Props) {
  return (
    <button
      className={styles.card}
      type="button"
      onClick={() => onClick?.(person.id)}
    >
      <div className={styles.title}>{person.name}</div>

      <div className={styles.info}>
        <span>Status: {person.status}</span>
        <span>Species: {person.species}</span>
        <span>Gender: {person.gender}</span>
      </div>
    </button>
  );
}

export default Card;
