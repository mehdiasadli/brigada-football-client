import { useQueryClient, type InfiniteData } from '@tanstack/react-query';
import { useMutate } from '../../hooks/use-mutate';
import { pollOptionVotesService } from './poll-option-votes.service';
import { feedKeys } from '../feed/feed.queries';
import { postsKeys } from '../posts/posts.queries';
import type { SuccessResponse } from '../define-api';
import type { PaginatedResult } from '../../schemas/query.schema';
import type { GetFeedResponse } from '../feed/feed.responses';
import type { FeedPostResponse } from '../feed/feed.responses';
import type { GetOnePostResponse } from '../posts/posts.service';

export function usePoleOptionVote() {
  const queryClient = useQueryClient();

  return useMutate(pollOptionVotesService.create, {
    showOnError: true,
    showOnSuccess: 'Voted successfully!',
    async onMutate(optionIds) {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: feedKeys.feed() });
      await queryClient.cancelQueries({ queryKey: postsKeys.detailsIndex() });

      // Snapshot the previous values
      const prevFeed = queryClient.getQueryData(feedKeys.feed());
      const prevPostDetails = queryClient.getQueriesData({ queryKey: postsKeys.detailsIndex() });

      // Optimistic update for feed
      queryClient.setQueriesData(
        { queryKey: feedKeys.feed() },
        (old?: InfiniteData<SuccessResponse<PaginatedResult<GetFeedResponse>>>) => {
          if (!old) return old;

          const newData = { ...old, pages: [...old.pages] };

          newData.pages = newData.pages.map((page) => ({
            ...page,
            data: {
              ...page.data,
              items: page.data.items.map((item) => {
                if (isPost(item) && item.poll && 'options' in item.poll && item.poll.options) {
                  const pollWithOptions = item.poll as NonNullable<GetOnePostResponse['poll']>;
                  return {
                    ...item,
                    poll: {
                      ...pollWithOptions,
                      options: pollWithOptions.options.map((option) => ({
                        ...option,
                        _count: {
                          votes: optionIds.includes(option.id)
                            ? (option._count?.votes || 0) + 1
                            : option._count?.votes || 0,
                        },
                        votes: optionIds.includes(option.id)
                          ? [...(option.votes || []), { userId: 'current-user' }]
                          : option.votes || [],
                      })),
                      userVotes: optionIds,
                    },
                  };
                }
                return item;
              }),
            },
          }));

          return newData;
        }
      );

      // Optimistic update for post details
      queryClient.setQueriesData(
        { queryKey: postsKeys.detailsIndex() },
        (old?: SuccessResponse<GetOnePostResponse>) => {
          if (!old || !old.data.poll || !('options' in old.data.poll) || !old.data.poll.options) return old;

          return {
            ...old,
            data: {
              ...old.data,
              poll: {
                ...old.data.poll,
                options: old.data.poll.options.map((option) => ({
                  ...option,
                  _count: {
                    votes: optionIds.includes(option.id) ? (option._count?.votes || 0) + 1 : option._count?.votes || 0,
                  },
                  votes: optionIds.includes(option.id)
                    ? [...(option.votes || []), { userId: 'current-user' }]
                    : option.votes || [],
                })),
                userVotes: optionIds,
              },
            },
          };
        }
      );

      return { prevFeed, prevPostDetails };
    },
    onError(_, __, context) {
      // Revert optimistic updates on error
      if (context?.prevFeed) {
        queryClient.setQueryData(feedKeys.feed(), context.prevFeed);
      }
      if (context?.prevPostDetails) {
        context.prevPostDetails.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSuccess(data, optionIds) {
      // Update with real data from server
      const optimisticUpdate = (old?: InfiniteData<SuccessResponse<PaginatedResult<GetFeedResponse>>>) => {
        if (!old) return old;

        const newData = { ...old, pages: [...old.pages] };

        newData.pages = newData.pages.map((page) => ({
          ...page,
          data: {
            ...page.data,
            items: page.data.items.map((item) => {
              if (isPost(item) && item.poll && 'options' in item.poll) {
                return {
                  ...item,
                  poll: {
                    ...item.poll,
                    options: data.data.options,
                    userVotes: optionIds,
                  },
                };
              }
              return item;
            }),
          },
        }));

        return newData;
      };

      // Update feed with real data
      queryClient.setQueriesData({ queryKey: feedKeys.feed() }, optimisticUpdate);

      // Update post details with real data
      queryClient.setQueriesData(
        { queryKey: postsKeys.detailsIndex() },
        (old?: SuccessResponse<GetOnePostResponse>) => {
          if (!old || !old.data.poll || !('options' in old.data.poll)) return old;

          return {
            ...old,
            data: {
              ...old.data,
              poll: {
                ...old.data.poll,
                options: data.data.options,
                userVotes: optionIds,
              },
            },
          };
        }
      );
    },
    onSettled() {
      // Refetch to ensure data consistency
      queryClient.invalidateQueries({ queryKey: feedKeys.feed() });
      queryClient.invalidateQueries({ queryKey: postsKeys.detailsIndex() });
    },
  });
}

// Helper function to check if item is a post
function isPost(item: GetFeedResponse): item is FeedPostResponse {
  return 'authorId' in item;
}
