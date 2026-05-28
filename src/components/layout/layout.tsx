import {
  useNavigate,
  useParams,
  useSearchParams,
  Outlet,
} from 'react-router-dom';
import Search from '../search/search';
import Results from '../results/results';
import type { Person } from '../../types/person';
import ErrorButton from '../errorButton/errorButton';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import styles from './layout.module.css';
import Pagination from '../pagination/pagination';
import { toggleSelectedItem } from '../../store/selectedItems/selectedItemsSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import SelectedItemsFlyout from '../selectedItemsFlyout/selectedItemsFlyout';
import {
  PaginationValue,
  QueryParam,
  RoutePath,
  StorageKey,
} from '../../constants/app';
import { useGetPeopleQuery } from '../../store/api/peopleApi';

function Layout() {
  const { id: detailsId } = useParams();
  const [searchTerm, setSearchTerm] = useLocalStorage(StorageKey.searchTerm);

  const hasDetailsPanel = Boolean(detailsId);

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const pageFromUrl = Number(
    searchParams.get(QueryParam.page) ?? String(PaginationValue.firstPage)
  );

  const currentPage =
    Number.isNaN(pageFromUrl) || pageFromUrl < PaginationValue.firstPage
      ? PaginationValue.firstPage
      : pageFromUrl;

  const { data, isLoading, isFetching, isError } = useGetPeopleQuery({
    searchTerm,
    page: currentPage,
  });

  const results = data?.results ?? [];
  const totalPages = data?.info.pages ?? PaginationValue.firstPage;
  const loading = isLoading || isFetching;
  const error = isError
    ? 'Failed to load results. Please check your connection or try again later.'
    : null;

  const dispatch = useAppDispatch();
  const selectedItems = useAppSelector((state) => state.selectedItems.items);
  const selectedIds = selectedItems.map((item) => item.id);

  const handleItemSelect = (person: Person) => {
    dispatch(toggleSelectedItem(person));
  };

  const handleItemClick = (personId: number) => {
    navigate(`/details/${personId}?page=${currentPage}`);
  };

  const handleSearch = (value: string) => {
    const trimmed = value.trim();

    if (trimmed === searchTerm) return;

    setSearchTerm(trimmed);
    navigate(
      `${RoutePath.main}?${QueryParam.page}=${PaginationValue.firstPage}`
    );
  };

  const handlePageChange = (page: number) => {
    if (detailsId) {
      navigate(`/details/${detailsId}?page=${page}`);
      return;
    }

    navigate(`${RoutePath.main}?${QueryParam.page}=${page}`);
  };

  return (
    <div className={styles.wrapper}>
      <div className={hasDetailsPanel ? styles.splitLayout : styles.content}>
        <div className={styles.mainPanel}>
          <Search initialSearchTerm={searchTerm} onSearch={handleSearch} />

          <Results
            results={results}
            loading={loading}
            error={error}
            selectedIds={selectedIds}
            onItemClick={handleItemClick}
            onItemSelect={handleItemSelect}
          />

          {!loading && !error && results.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}

          <div className={styles.errorButtonWrapper}>
            <ErrorButton />
          </div>

          <SelectedItemsFlyout />
        </div>

        {hasDetailsPanel && (
          <div className={styles.detailsPanel}>
            <Outlet />
          </div>
        )}
      </div>
    </div>
  );
}

export default Layout;
