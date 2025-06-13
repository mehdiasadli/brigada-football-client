import { Api } from '../define-api';
import type { SearchResponse } from './search.responses';

const api = Api.create('/search');

export const searchService = {
  search: (query: string) => api.get<SearchResponse[]>('/', { params: { query } }),
};
