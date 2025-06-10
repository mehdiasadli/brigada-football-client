import { useFetch } from '../../hooks/use-fetch';
import { useInfinite } from '../../hooks/use-infinite';
import type { SearchSchema } from '../../schemas/query.schema';
import type { PaginationSchema } from '../../schemas/query.schema';
import type { OrderSchema } from '../../schemas/query.schema';
import { useUserStore } from '../../stores/user.store';
import { usersService } from './users.service';

export const userKeys = {
  index: ['users'] as const,

  detailIndex: () => [...userKeys.index, 'detail'] as const,
  detail: (username: string) => [...userKeys.detailIndex(), username] as const,

  searchIndex: () => [...userKeys.index, 'search'] as const,
  search: (query: string, excludeIds: string[] = []) => [...userKeys.searchIndex(), query, excludeIds] as const,

  listIndex: () => [...userKeys.index, 'list'] as const,
  list: (pagination: Omit<PaginationSchema, 'page'>, order: OrderSchema, search: SearchSchema) =>
    [...userKeys.listIndex(), pagination, order, search] as const,
};

export function useUser(id?: string) {
  const currentUser = useUserStore((state) => state.user)!;
  const userId = id ?? currentUser.id;

  return useFetch(userKeys.detail(userId), () => usersService.findOne(userId), {
    enabled: !!userId,
  });
}

export function useUsers(
  pagination: Omit<PaginationSchema, 'page'>,
  order: OrderSchema,
  search: SearchSchema,
  enabled: boolean = true
) {
  return useInfinite({
    queryKey: userKeys.list(pagination, order, search),
    queryFn: (page) => usersService.findAll({ ...pagination, page }, order, search),
    enabled,
  });
}

export function useProfile(username?: string) {
  const currentUser = useUserStore((state) => state.user)!;
  const userUsername = username ?? currentUser.username;

  return useFetch(userKeys.detail(userUsername), () => usersService.findOneWithUsername(userUsername), {
    enabled: !!userUsername,
  });
}

export function useSearchForMatch(query: string, excludeIds: string[] = []) {
  return useFetch(userKeys.search(query, excludeIds), () => usersService.searchForMatch(query, excludeIds), {
    enabled: query.length > 0,
  });
}
