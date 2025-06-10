import InfiniteScroll from 'react-infinite-scroll-component';
import { type InfiniteData, type UseInfiniteQueryResult } from '@tanstack/react-query';
import { Box, SimpleGrid, type BoxProps, type SimpleGridProps } from '@mantine/core';
import type { LoadingComponentProps } from './loading-component';
import type { ErrorComponentProps } from './error-component';
import ErrorComponent from './error-component';
import LoadingComponent from './loading-component';
import type { NoContentComponentProps } from './no-content-component';
import NoContentComponent from './no-content-component';
import React, { useMemo } from 'react';
import type { PaginatedResult } from '../schemas/query.schema';
import type { ApiError } from '../api/api-error';
import type { SuccessResponse } from '../api/define-api';

interface InfiniteListProps<TItem> {
  result: UseInfiniteQueryResult<InfiniteData<SuccessResponse<PaginatedResult<TItem>>, number>, ApiError>;
  render: (item: TItem, index?: number) => React.ReactNode;
  loadingComponent?: React.ReactNode;
  errorComponent?: React.ReactNode | ((error: ApiError) => React.ReactNode);
  noContentComponent?: React.ReactNode;
  errorComponentProps?: ErrorComponentProps;
  loadingComponentProps?: LoadingComponentProps;
  noContentComponentProps?: NoContentComponentProps;
  scrollProps?: Omit<
    React.ComponentProps<typeof InfiniteScroll>,
    'dataLength' | 'next' | 'hasMore' | 'refreshFunction' | 'children'
  >;
  containerProps?: BoxProps;
  gridProps?: Omit<SimpleGridProps, 'cols'>;
  cols?: SimpleGridProps['cols'];
  showEndMessage?: boolean | 'only-no-items' | 'only-no-more-items';
}

export default function InfiniteList<TItem>({
  result,
  render,
  loadingComponent,
  errorComponent,
  noContentComponent,
  scrollProps,
  containerProps,
  errorComponentProps,
  loadingComponentProps,
  noContentComponentProps,
  gridProps,
  cols,
  showEndMessage = false,
}: InfiniteListProps<TItem>) {
  const status = result.status;

  // Memoized flattened items array to prevent unnecessary re-rendering
  const flattenItems = useMemo(() => result.data?.pages.flatMap((page) => page.data.items) ?? [], [result.data]);

  // Initial loading state
  if (status === 'pending' && !result.data) {
    return loadingComponent ?? <LoadingComponent {...loadingComponentProps} />;
  }

  // Error handling
  if (status === 'error') {
    return errorComponent ? (
      typeof errorComponent === 'function' ? (
        errorComponent(result.error)
      ) : (
        errorComponent
      )
    ) : (
      <ErrorComponent error={result.error} {...errorComponentProps} />
    );
  }

  if (!result.data || !result.data.pages.length) return null;

  // Get pagination information from the latest page
  const latestPage = result.data.pages[result.data.pages.length - 1];
  const pagination = latestPage.data.meta;

  // Handle no content case
  if (flattenItems.length === 0) {
    return noContentComponent ?? <NoContentComponent {...noContentComponentProps} />;
  }

  // Check if we have more pages to load
  const hasMore =
    pagination.nextPage !== null &&
    flattenItems.length < pagination.totalItems &&
    pagination.page < pagination.totalPages;

  // Calculate the key for each item to ensure proper updates
  const getItemKey = (item: TItem, index: number) => {
    // Try to use an id field if it exists, otherwise fall back to index
    if (typeof item === 'object' && item !== null && 'id' in item) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (item as any).id;
    }
    return index;
  };

  return (
    <Box {...containerProps}>
      <InfiniteScroll
        dataLength={flattenItems.length} // Use actual number of loaded items
        next={() => {
          if (hasMore && !result.isFetchingNextPage) {
            result.fetchNextPage();
          }
        }}
        hasMore={hasMore}
        refreshFunction={result.refetch}
        loader={<LoadingComponent containerProps={{ mt: 15, py: 10 }} />}
        endMessage={
          showEndMessage === false ? undefined : showEndMessage === true ? (
            <Box ta='center' py={20} c='dimmed' fz='sm'>
              {flattenItems.length > 0 ? 'No more items to load' : 'No items found'}
            </Box>
          ) : showEndMessage === 'only-no-items' && flattenItems.length === 0 ? (
            <Box ta='center' py={20} c='dimmed' fz='sm'>
              No items found
            </Box>
          ) : showEndMessage === 'only-no-more-items' && flattenItems.length > 0 ? (
            <Box ta='center' py={20} c='dimmed' fz='sm'>
              No more items to load
            </Box>
          ) : undefined
        }
        scrollThreshold={0.8} // Load more when 80% scrolled
        {...scrollProps}
      >
        <SimpleGrid
          cols={
            typeof cols === 'number'
              ? cols
              : {
                  base: cols?.base ?? 1,
                  xs: cols?.xs ?? 1,
                  sm: cols?.sm ?? 2,
                  md: cols?.md ?? 3,
                  lg: cols?.lg ?? 4,
                  xl: cols?.xl ?? 5,
                }
          }
          {...gridProps}
        >
          {flattenItems.map((item, index) => (
            <React.Fragment key={getItemKey(item, index)}>{render(item, index)}</React.Fragment>
          ))}
        </SimpleGrid>
      </InfiniteScroll>
    </Box>
  );
}
