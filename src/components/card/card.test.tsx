import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import Card from './card';
import type { Person } from '../../types/person';

const mockPerson: Person = {
  id: 1,
  name: 'Rick Sanchez',
  status: 'Alive',
  species: 'Human',
  gender: 'Male',
};

describe('Card', () => {
  test('renders person name', () => {
    render(<Card person={mockPerson} />);

    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
  });

  test('renders person details', () => {
    render(<Card person={mockPerson} />);

    expect(screen.getByText('Status: Alive')).toBeInTheDocument();
    expect(screen.getByText('Species: Human')).toBeInTheDocument();
    expect(screen.getByText('Gender: Male')).toBeInTheDocument();
  });
});
