import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import Results from './results';
import type { Person } from '../../types/person';

const mockResults: Person[] = [
  {
    id: 1,
    name: 'Rick Sanchez',
    status: 'Alive',
    species: 'Human',
    gender: 'Male',
  },
  {
    id: 2,
    name: 'Morty Smith',
    status: 'Alive',
    species: 'Human',
    gender: 'Male',
  },
];

describe('Results', () => {
  test('renders title', () => {
    render(<Results results={[]} loading={false} error={null} />);

    expect(screen.getByText('Results')).toBeInTheDocument();
  });

  test('renders loader when loading is true', () => {
    render(<Results results={[]} loading={true} error={null} />);

    expect(screen.getByText(/loading results/i)).toBeInTheDocument();
  });

  test('renders error message when error exists', () => {
    render(
      <Results results={[]} loading={false} error="Failed to load data" />
    );

    expect(screen.getByText('Failed to load data')).toBeInTheDocument();
  });

  test('renders empty message when there are no results', () => {
    render(<Results results={[]} loading={false} error={null} />);

    expect(screen.getByText(/no results found/i)).toBeInTheDocument();
  });

  test('renders list of result cards', () => {
    render(<Results results={mockResults} loading={false} error={null} />);

    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
    expect(screen.getByText('Morty Smith')).toBeInTheDocument();
  });

  test('renders correct number of result cards', () => {
    render(<Results results={mockResults} loading={false} error={null} />);

    expect(screen.getAllByText(/status: alive/i)).toHaveLength(2);
  });
});
