'use client';

import { useSelection } from './selectionContext';
import styles from './selectCharacterButton.module.css';

type Props = {
  personId: number;
};

function SelectCharacterButton({ personId }: Props) {
  const { selectedIds, toggleSelectedId } = useSelection();
  const selected = selectedIds.includes(personId);

  return (
    <label className={styles.label}>
      <input
        type="checkbox"
        checked={selected}
        onChange={() => toggleSelectedId(personId)}
      />
      Select
    </label>
  );
}

export default SelectCharacterButton;
