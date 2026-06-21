'use client';

import { useSelection } from './selectionContext';
import styles from './selectedItemsFlyout.module.css';

function SelectedItemsFlyout() {
  const { selectedIds, clearSelectedIds } = useSelection();

  if (selectedIds.length === 0) {
    return null;
  }

  const downloadHref = `/api/export-csv?ids=${selectedIds.join(',')}`;

  return (
    <div className={styles.flyout}>
      <p className={styles.text}>
        Selected items: <strong>{selectedIds.length}</strong>
      </p>

      <div className={styles.actions}>
        <button
          className={styles.button}
          type="button"
          onClick={clearSelectedIds}
        >
          Unselect all
        </button>

        <a className={styles.link} href={downloadHref}>
          Download CSV
        </a>
      </div>
    </div>
  );
}

export default SelectedItemsFlyout;
