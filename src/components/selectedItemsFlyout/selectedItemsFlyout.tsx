import { clearSelectedItems } from '../../store/selectedItems/selectedItemsSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import styles from './selectedItemsFlyout.module.css';

function escapeCsvValue(value: string) {
  const escapedValue = value.replaceAll('"', '""');

  return `"${escapedValue}"`;
}

function SelectedItemsFlyout() {
  const dispatch = useAppDispatch();
  const selectedItems = useAppSelector((state) => state.selectedItems.items);

  if (selectedItems.length === 0) {
    return null;
  }

  const handleClear = () => {
    dispatch(clearSelectedItems());
  };

  const handleDownload = () => {
    const header = ['Name', 'Status', 'Species', 'Gender', 'Details URL'];

    const rows = selectedItems.map((item) => [
      item.name,
      item.status,
      item.species,
      item.gender,
      `${window.location.origin}/details/${item.id}`,
    ]);

    const csvContent = [header, ...rows]
      .map((row) => row.map(escapeCsvValue).join(','))
      .join('\n');

    const blob = new Blob([csvContent], {
      type: 'text/csv;charset=utf-8',
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = `${selectedItems.length}_items.csv`;
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className={styles.flyout}>
      <p className={styles.text}>
        Selected items: <strong>{selectedItems.length}</strong>
      </p>

      <div className={styles.actions}>
        <button type="button" onClick={handleClear}>
          Unselect all
        </button>

        <button type="button" onClick={handleDownload}>
          Download
        </button>
      </div>
    </div>
  );
}

export default SelectedItemsFlyout;
