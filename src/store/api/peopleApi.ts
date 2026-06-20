import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Person } from '../../types/person';
import { Api, HttpStatus, QueryParam } from '../../constants/app';

export type PeopleResponse = {
  info: {
    pages: number;
  };
  results: Person[];
};

export type GetPeopleArgs = {
  searchTerm: string;
  page: number;
};

const DEFAULT_CACHE_TTL_SECONDS = 300;

const cacheTtlSeconds = Number(
  process.env.NEXT_PUBLIC_CACHE_TTL ?? DEFAULT_CACHE_TTL_SECONDS
);

export const peopleApi = createApi({
  reducerPath: 'peopleApi',
  baseQuery: fetchBaseQuery({
    baseUrl: Api.characterBaseUrl,
  }),
  tagTypes: ['People', 'Person'],
  keepUnusedDataFor: cacheTtlSeconds,

  endpoints: (builder) => ({
    getPeople: builder.query<PeopleResponse, GetPeopleArgs>({
      query: ({ searchTerm, page }) => {
        const params = new URLSearchParams();

        params.set(QueryParam.page, String(page));

        if (searchTerm) {
          params.set(QueryParam.name, searchTerm);
        }

        return {
          url: `?${params.toString()}`,
          validateStatus: (response) =>
            response.status === HttpStatus.ok ||
            response.status === HttpStatus.notFound,
        };
      },

      transformResponse: (
        response: PeopleResponse | { error: string },
        meta
      ): PeopleResponse => {
        if (meta?.response?.status === HttpStatus.notFound) {
          return {
            info: {
              pages: 1,
            },
            results: [],
          };
        }

        return response as PeopleResponse;
      },

      providesTags: (result, _error, { page, searchTerm }) => [
        {
          type: 'People',
          id: `${searchTerm}-${page}`,
        },
        {
          type: 'People',
          id: 'LIST',
        },
        ...(result?.results.map((person) => ({
          type: 'Person' as const,
          id: person.id,
        })) ?? []),
      ],
    }),

    getPersonById: builder.query<Person, string>({
      query: (id) => id,
      providesTags: (_result, _error, id) => [
        {
          type: 'Person',
          id,
        },
      ],
    }),
  }),
});

export const { useGetPeopleQuery, useGetPersonByIdQuery } = peopleApi;
