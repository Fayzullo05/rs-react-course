import { Api, HttpStatus, PaginationValue, QueryParam } from '@/constants/app';
import type { Person } from '@/types/person';

export type PeopleResponse = {
  info: {
    pages: number;
  };
  results: Person[];
};

export type GetPeopleParams = {
  searchTerm: string;
  page: number;
};

export async function getPeople({
  searchTerm,
  page,
}: GetPeopleParams): Promise<PeopleResponse> {
  const params = new URLSearchParams();

  params.set(QueryParam.page, String(page));

  if (searchTerm) {
    params.set(QueryParam.name, searchTerm);
  }

  const response = await fetch(`${Api.characterBaseUrl}?${params.toString()}`, {
    next: {
      revalidate: 300,
    },
  });

  if (response.status === HttpStatus.notFound) {
    return {
      info: {
        pages: PaginationValue.firstPage,
      },
      results: [],
    };
  }

  if (!response.ok) {
    throw new Error('Failed to load people');
  }

  return response.json() as Promise<PeopleResponse>;
}

export async function getPersonById(id: string): Promise<Person | null> {
  const response = await fetch(`${Api.characterBaseUrl}${id}`, {
    next: {
      revalidate: 300,
    },
  });

  if (response.status === HttpStatus.notFound) {
    return null;
  }

  if (!response.ok) {
    throw new Error('Failed to load person');
  }

  return response.json() as Promise<Person>;
}
