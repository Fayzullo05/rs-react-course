import { Component } from 'react';
import type { Person } from '../../types/person';
import styles from './card.module.css';

type Props = {
  person: Person;
};

class Card extends Component<Props> {
  render() {
    const { person } = this.props;

    return (
      <div className={styles.card}>
        <div className={styles.title}>{person.name}</div>

        <div className={styles.info}>
          <span>Gender: {person.gender}</span>
          <span>Birth: {person.birth_year}</span>
          <span>
            Height:{' '}
            {person.height !== 'unknown' ? `${person.height} cm` : 'Unknown'}
          </span>
        </div>
      </div>
    );
  }
}

export default Card;
