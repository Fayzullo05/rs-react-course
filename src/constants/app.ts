export const Api = {
  characterBaseUrl: 'https://rickandmortyapi.com/api/character/',
} as const;

export const HttpStatus = {
  notFound: 404,
} as const;

export const QueryParam = {
  page: 'page',
  name: 'name',
} as const;

export const RoutePath = {
  main: '/',
  about: '/about',
  notFound: '*',
  details: 'details/:id',
} as const;

export const StorageKey = {
  searchTerm: 'searchTerm',
} as const;

export const PaginationValue = {
  firstPage: 1,
} as const;
