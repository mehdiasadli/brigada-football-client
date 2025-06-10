import {
  type QueryFunction,
  type QueryFunctionContext,
  type QueryKey,
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query';
import type { ApiError } from '../api/api-error';

export type UseFetchResult<T> = UseQueryResult<T, ApiError>;

export function useFetch<TQueryFnData = unknown, TData = TQueryFnData>(
  queryKey: QueryKey,
  queryFn: QueryFunction<TQueryFnData, QueryKey> | (() => TQueryFnData | Promise<TQueryFnData>),
  options?: Omit<UseQueryOptions<TQueryFnData, ApiError, TData, QueryKey>, 'queryKey' | 'queryFn'>
): UseFetchResult<TData> {
  // Convert normal function to QueryFunction if needed
  const normalizedQueryFn: QueryFunction<TQueryFnData, QueryKey> =
    typeof queryFn === 'function' && queryFn.length === 0
      ? // eslint-disable-next-line @typescript-eslint/no-unused-vars
        (_: QueryFunctionContext<QueryKey>) => (queryFn as () => TQueryFnData | Promise<TQueryFnData>)()
      : (queryFn as QueryFunction<TQueryFnData, QueryKey>);

  return useQuery({
    ...options,
    queryKey,
    queryFn: normalizedQueryFn,
  });
}
