import { useFetch } from '../../hooks/use-fetch';
import { useInfinite } from '../../hooks/use-infinite';
import type { OrderSchema, PaginationSchema } from '../../schemas/query.schema';
import { venuesService } from './venues.service';

export const venuesKeys = {
  index: ['venues'] as const,

  searchIndex: () => [...venuesKeys.index, 'search'] as const,
  search: (query?: string) => [...venuesKeys.searchIndex(), query] as const,

  map: () => [...venuesKeys.index, 'map'] as const,

  listIndex: () => [...venuesKeys.index, 'list'] as const,
  list: (pagination: Omit<PaginationSchema, 'page'>, order: OrderSchema) =>
    [...venuesKeys.listIndex(), pagination, order] as const,
};

export function useVenues(pagination: Omit<PaginationSchema, 'page'>, order: OrderSchema) {
  return useInfinite({
    queryKey: venuesKeys.list(pagination, order),
    queryFn: (page) => venuesService.findMany({ ...pagination, page }, order),
  });
}

export function useSearchVenues(query: string) {
  return useFetch(venuesKeys.search(query), () => venuesService.search(query), {
    enabled: query.length > 0,
  });
}

export function useVenuesOnMap() {
  return useFetch(venuesKeys.map(), () => venuesService.venuesOnMap());
}
