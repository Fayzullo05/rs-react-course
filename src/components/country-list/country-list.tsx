import { memo, useMemo } from 'react';
import { List, useDynamicRowHeight, type RowComponentProps } from 'react-window';

import type { Country } from '../../types';
import { CountryCard } from '../country-card/country-card';
import { createYearDataMap, getPopulationForYear } from '../../utils/data-transformers';

import styles from './country-list.module.css';

type CountryListProps = {
  countries: Country[];
  searchQuery: string;
  selectedColumns: string[];
  selectedRegion: string;
  selectedYear: number;
  sortField: 'name' | 'population';
  sortOrder: 'asc' | 'desc';
};

type CountryRowProps = {
  countries: Country[];
  selectedColumns: string[];
  selectedYear: number;
};

const CountryRow = ({
  ariaAttributes,
  countries,
  index,
  selectedColumns,
  selectedYear,
  style,
}: RowComponentProps<CountryRowProps>) => {
  const country = countries[index];

  if (!country) {
    return null;
  }

  return (
    <div {...ariaAttributes} className={styles.row} style={style}>
      <CountryCard
        country={country}
        selectedYear={selectedYear}
        selectedColumns={selectedColumns}
      />
    </div>
  );
};

export const CountryList = memo(
  ({
    countries,
    searchQuery,
    selectedColumns,
    selectedRegion,
    selectedYear,
    sortField,
    sortOrder,
  }: CountryListProps) => {
    const filteredCountries = useMemo(() => {
      const normalizedSearchQuery = searchQuery.trim().toLowerCase();

      const matchingCountries = countries.filter((country) => {
        const matchesSearch = country.id.toLowerCase().includes(normalizedSearchQuery);

        const matchesRegion =
          !selectedRegion || country.data.some((yearData) => yearData.region === selectedRegion);

        return matchesSearch && matchesRegion;
      });

      if (sortField === 'name') {
        return matchingCountries.sort((firstCountry, secondCountry) => {
          const comparison = firstCountry.id.localeCompare(secondCountry.id);

          return sortOrder === 'asc' ? comparison : -comparison;
        });
      }

      return matchingCountries
        .map((country) => {
          const yearDataMap = createYearDataMap(country.data);

          const population = getPopulationForYear(yearDataMap, selectedYear) ?? 0;

          return {
            country,
            population,
          };
        })
        .sort((firstCountry, secondCountry) => {
          const comparison = firstCountry.population - secondCountry.population;

          return sortOrder === 'asc' ? comparison : -comparison;
        })
        .map(({ country }) => country);
    }, [countries, searchQuery, selectedRegion, selectedYear, sortField, sortOrder]);

    const rowHeight = useDynamicRowHeight({
      defaultRowHeight: 320,
      key: [
        searchQuery,
        selectedRegion,
        selectedYear,
        selectedColumns.join(','),
        sortField,
        sortOrder,
      ].join('|'),
    });

    if (filteredCountries.length === 0) {
      return <div className={styles.emptyMessage}>No countries found.</div>;
    }

    return (
      <List
        className={styles.countryList}
        defaultHeight={600}
        rowComponent={CountryRow}
        rowCount={filteredCountries.length}
        rowHeight={rowHeight}
        rowProps={{
          countries: filteredCountries,
          selectedColumns,
          selectedYear,
        }}
        overscanCount={3}
        style={{
          height: 'calc(100vh - 260px)',
          minHeight: 400,
          width: '100%',
        }}
      />
    );
  }
);

CountryList.displayName = 'CountryList';
