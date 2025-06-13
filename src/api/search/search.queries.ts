import { useFetch } from '../../hooks/use-fetch';
import { searchService } from './search.service';

export const searchKeys = {
  index: ['search'] as const,

  withQuery: (query: string) => [...searchKeys.index, query] as const,
};

export function useSearch(query: string) {
  return useFetch(searchKeys.withQuery(query), () => searchService.search(query), {
    enabled: query.length > 0,
  });
}
