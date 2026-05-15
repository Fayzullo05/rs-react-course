import type { Person } from '../../types/person';
import styles from './card.module.css';

type Props = {
  person: Person;
};

function Card({ person }: Props) {
  return (
    <div className={styles.card}>
      <div className={styles.title}>{person.name}</div>

      <div className={styles.info}>
        <span>Status: {person.status}</span>
        <span>Species: {person.species}</span>
        <span>Gender: {person.gender}</span>
      </div>
    </div>
  );
}

export default Card;
