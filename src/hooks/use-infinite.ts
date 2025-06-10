import {
  useInfiniteQuery,
  type UseInfiniteQueryOptions,
  type UseInfiniteQueryResult,
  type InfiniteData,
  type QueryKey,
  type QueryFunctionContext,
} from '@tanstack/react-query';
import type { ApiError } from '../api/api-error';
import type { PaginatedResult } from '../schemas/query.schema';
import type { SuccessResponse } from '../api/define-api';

/**
 * Hook for infinite queries with proper pagination handling
 */
export function useInfinite<
  TQueryFnData extends PaginatedResult<unknown>,
  TData extends InfiniteData<SuccessResponse<TQueryFnData>, number> = InfiniteData<
    SuccessResponse<TQueryFnData>,
    number
  >,
>(
  options: Omit<
    UseInfiniteQueryOptions<SuccessResponse<TQueryFnData>, ApiError, TData, QueryKey, number>,
    'initialPageParam' | 'getNextPageParam' | 'queryFn'
  > & {
    queryFn: (
      page: number,
      context: QueryFunctionContext<QueryKey, number>
    ) => SuccessResponse<TQueryFnData> | Promise<SuccessResponse<TQueryFnData>>;
  }
): UseInfiniteQueryResult<TData, ApiError> {
  return useInfiniteQuery({
    ...options,
    initialPageParam: 1,
    getNextPageParam(lastPage) {
      // Only return the next page number if there are more pages to fetch
      if (lastPage.data.meta.page < lastPage.data.meta.totalPages) {
        return lastPage.data.meta.nextPage;
      }
      // Return null or undefined to indicate no more pages
      return null;
    },
    queryFn: (ctx) => options.queryFn(ctx.pageParam, ctx),
    refetchOnWindowFocus: false, // Prevent unnecessary refetches when window focus changes
    staleTime: 1000 * 60 * 5, // Data remains fresh for 5 minutes to reduce refetches
  });
}

export type UseInfiniteResult<T extends InfiniteData<SuccessResponse<PaginatedResult<unknown>>, number>> =
  UseInfiniteQueryResult<T, ApiError>;
