import { z } from 'zod';

export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextPage: number | null;
  previousPage: number | null;
  firstPage: number;
  lastPage: number;
}

export interface PaginatedResult<T> {
  items: T[];
  meta: PaginationMeta;
}

export const paginationSchema = z.object({
  page: z.coerce
    .number({
      invalid_type_error: 'Page must be a number',
    })
    .int('Page must be an integer')
    .positive('Page must be positive')
    .min(1, 'Page must be greater or equal to 1')
    .default(1),
  limit: z.coerce
    .number({
      invalid_type_error: 'Limit must be a number',
    })
    .int('Limit must be an integer')
    .positive('Limit must be positive')
    .min(5, 'Limit must be greater or equal to 5')
    .max(50, 'Limit must be less or equal to 50')
    .default(25),
});

export type SearchMode = 'insensitive' | 'default';
export type SearchType = 'contains' | 'startsWith' | 'endsWith' | 'equals' | 'fullText';

export const searchSchema = z.object({
  query: z
    .string()
    .min(1, 'Search query must be at least 1 character')
    .max(100, 'Search query must be less than 100 characters')
    .optional(),
  fields: z.array(z.string()).optional().describe('Specific fields to search in'),
  mode: z.enum(['insensitive', 'default']).default('insensitive').describe('Search mode for case sensitivity'),
  searchType: z
    .enum(['contains', 'startsWith', 'endsWith', 'equals', 'fullText'])
    .default('contains')
    .describe('Type of search to perform'),
});

export type PrismaOrderByValue = 'asc' | 'desc';
export type PrismaOrderBy = Record<string, PrismaOrderByValue | Record<string, unknown>>;

export const orderSchema = z.object({
  orderDir: z.enum(['asc', 'desc']).default('desc'),
  orderBy: z.string().default('created_at'),
});

export type OrderSchema = z.infer<typeof orderSchema>;
export type PaginationSchema = z.infer<typeof paginationSchema>;
export type SearchSchema = z.infer<typeof searchSchema>;
