import { memo, useMemo } from 'react';
import type { Country } from '../../types';
import { CountryCard } from '../country-card/country-card';
import { getPopulationForYear, createYearDataMap } from '../../utils/data-transformers';

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

    return (
      <div className={styles.countryList}>
        {filteredCountries.map((country) => (
          <CountryCard
            key={country.id}
            country={country}
            selectedYear={selectedYear}
            selectedColumns={selectedColumns}
          />
        ))}
      </div>
    );
  }
);

CountryList.displayName = 'CountryList';
