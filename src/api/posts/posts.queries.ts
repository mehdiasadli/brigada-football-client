import { useFetch } from '../../hooks/use-fetch';
import { useInfinite } from '../../hooks/use-infinite';
import type { OrderSchema, PaginationSchema } from '../../schemas/query.schema';
import { postsService } from './posts.service';

export const postsKeys = {
  index: ['posts'] as const,

  detailsIndex: () => [...postsKeys.index, 'details'] as const,
  details: (postId: string) => [...postsKeys.detailsIndex(), postId] as const,

  ofUserIndex: () => [...postsKeys.index, 'ofUser'] as const,
  ofUser: (username: string) => [...postsKeys.ofUserIndex(), username] as const,

  listIndex: () => [...postsKeys.index, 'list'] as const,
  list: (paginationDto: Omit<PaginationSchema, 'page'>, orderDto: OrderSchema) =>
    [...postsKeys.listIndex(), paginationDto, orderDto] as const,
};

export function usePost(postId: string) {
  return useFetch(postsKeys.details(postId), () => postsService.getOne(postId), {
    enabled: !!postId,
  });
}

export function usePostsOfUser(username?: string) {
  return useInfinite({
    queryKey: postsKeys.ofUser(username!),
    queryFn: (page) =>
      postsService.getPostsOfUser(username!, {
        page,
        limit: 10,
      }),
    enabled: !!username,
  });
}

export function usePosts(paginationDto: Omit<PaginationSchema, 'page'>, orderDto: OrderSchema) {
  return useInfinite({
    queryKey: postsKeys.list(paginationDto, orderDto),
    queryFn: (page) =>
      postsService.findMany(
        {
          page,
          limit: 10,
        },
        orderDto
      ),
  });
}
