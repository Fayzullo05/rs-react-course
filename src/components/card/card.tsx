import type { MouseEvent, ChangeEvent } from 'react';
import type { Person } from '../../types/person';
import styles from './card.module.css';

type Props = {
  person: Person;
  selected?: boolean;
  onClick?: (personId: number) => void;
  onSelect?: (person: Person) => void;
};

function Card({ person, selected = false, onClick, onSelect }: Props) {
  const handleSelect = (event: ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    onSelect?.(person);
  };

  return (
    <button
      className={styles.card}
      type="button"
      onClick={() => onClick?.(person.id)}
    >
      <label
        className={styles.checkboxLabel}
        onClick={(event: MouseEvent<HTMLLabelElement>) =>
          event.stopPropagation()
        }
      >
        <input type="checkbox" checked={selected} onChange={handleSelect} />
        Select
      </label>

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
