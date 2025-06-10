import { useFetch } from '../../hooks/use-fetch';
import { useInfinite } from '../../hooks/use-infinite';
import type { MatchSchema } from '../../schemas/entities/match.entity';
import type { OrderSchema, PaginationSchema } from '../../schemas/query.schema';
import { matchesService } from './matches.service';

export const matchesKeys = {
  index: ['matches'] as const,

  listIndex: () => [...matchesKeys.index, 'list'] as const,
  list: (pagination: Omit<PaginationSchema, 'page'>, order: OrderSchema, filters: { status?: MatchSchema['status'] }) =>
    [...matchesKeys.listIndex(), pagination, order, filters] as const,

  detailIndex: () => [...matchesKeys.index, 'detail'] as const,
  detail: (matchId: string) => [...matchesKeys.detailIndex(), matchId] as const,
};

export function useMatch(matchId: string) {
  return useFetch(matchesKeys.detail(matchId), () => matchesService.findOne(matchId), {
    enabled: !!matchId,
  });
}

export function useMatches(
  pagination: Omit<PaginationSchema, 'page'>,
  order: OrderSchema,
  filters: { status?: MatchSchema['status'] }
) {
  return useInfinite({
    queryKey: matchesKeys.list(pagination, order, filters),
    queryFn: (page) =>
      matchesService.findAll(
        {
          ...pagination,
          page,
        },
        order,
        filters
      ),
  });
}
