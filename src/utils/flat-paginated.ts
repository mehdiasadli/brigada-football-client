import type { InfiniteData } from '@tanstack/react-query';
import type { SuccessResponse } from '../api/define-api';
import type { PaginatedResult } from '../schemas/query.schema';

export function flattenInfiniteData<T>(data: InfiniteData<SuccessResponse<PaginatedResult<T>>> | undefined): T[] {
  // Handle undefined input
  if (!data) {
    return [];
  }

  // Flatten the nested structure
  return data.pages
    .map((page) => page.data.items) // Extract items from each page
    .flat(); // Flatten into single array
}
